## Code Review: StoryBook Models Layer

> **審查日期：** 2026-03-21  
> **審查範圍：** `StoryBook/Models/` — 9 files (~295 lines)  
> **專案框架：** ASP.NET Core (.NET 10 / C# 14, Nullable enabled)  

### Summary

Reviewed 9 model files forming the data layer for a bilingual (中/英) storybook application covering aquarium animals and dinosaurs. The code is well-structured with good use of modern C# features (`required`, `GeneratedRegex`, collection expressions, switch expressions, file-scoped namespaces) and thorough XML documentation. However, there are **3 critical issues** that must be addressed: the `AquariumAnimalValidator` is **dead code** (never invoked by any caller), it has a null-safety bug in its public API, and `Dinosaur` entities have **no validation at all**. The model layer also has significant code duplication between the Aquarium and Dinosaur entity hierarchies that will become a maintenance burden as more creature types are added.

**Verdict: Needs significant rework** — the validator is disconnected from actual data loading, leaving all model data effectively unvalidated at runtime.

**Priority action plan:**
1. Wire `AquariumAnimalValidator` into the actual data loading pipeline (`JsonDataService`) or remove it to eliminate dead code
2. Fix the null-safety bug in `ValidateDescription` and extend `ValidateAnimal` coverage
3. Create validation parity for `Dinosaur` (dedicated validator or shared abstraction)

---

### 🔴 Critical Issues

**1. `AquariumAnimalValidator` is dead code — never called anywhere** (`AquariumAnimalValidator.cs`)

The validator class provides `ValidateAnimal`, `ValidateId`, `ValidateDescription`, and `ValidateStory` methods, but none are invoked from anywhere in the codebase. The actual data loading in `JsonDataService.ValidateAquariumData()` (lines 453-471) performs its own ad-hoc validation that only checks for empty `Id` and null `Name` — completely ignoring the dedicated validator.

This means the 115-line validator provides zero runtime protection. The description length limit (≤200 chars), story length range (100-150 chars), and ID format regex are never enforced.

**Fix** — integrate the validator into `JsonDataService.ValidateAquariumData()`:

```csharp
private void ValidateAquariumData(AquariumAnimalData data)
{
    foreach (var animal in data.Animals)
    {
        var errors = AquariumAnimalValidator.ValidateAnimal(animal).ToList();
        if (errors.Count > 0)
        {
            _logger.LogWarning(
                "水族館動物 {Id} 驗證失敗：{Errors}",
                animal.Id,
                string.Join("; ", errors.Select(e => e.ErrorMessage)));
        }
    }
}
```

**2. `ValidateDescription` will throw `NullReferenceException` on null input** (`AquariumAnimalValidator.cs`, line 18)

```csharp
public static ValidationResult? ValidateDescription(LocalizedText description)
{
    if (description.Zh.Length > 200)  // NRE if description is null
```

This is a `public static` method — any caller can pass `null`. While `AquariumAnimal.Description` is marked `required`, the validator method's contract doesn't enforce this. The C# reference says: missing nullable annotation on `description` tells callers it's non-null, but there's no runtime guard.

**Fix:**
```csharp
public static ValidationResult? ValidateDescription(LocalizedText description)
{
    ArgumentNullException.ThrowIfNull(description);
    // ...
}
```

**3. `Dinosaur` entities have no validator at all** (missing file)

`AquariumAnimal` has a dedicated `AquariumAnimalValidator`, but `Dinosaur` has none. The `JsonDataService.ValidateDinosaurData()` only checks for empty `Id` and null `Name` — no format, length, or content validation. This means dinosaur data from JSON can contain any malformed content (e.g., 10,000-character descriptions, invalid IDs with special characters) and silently propagate to the UI.

**Fix** — either create `DinosaurValidator.cs` mirroring the aquarium one, or (preferred) extract a shared `CreatureValidator` that works on common properties via an interface.

---

### 🟡 Suggestions

**1. `LocalizedText.GetText` has incorrect nullable annotation** (`LocalizedText.cs`, line 24)

```csharp
public string GetText(string languageCode) =>
    languageCode?.ToLowerInvariant() == "en" ? En : Zh;
```

The parameter is declared as non-nullable `string`, but the implementation uses `?.` (null-conditional operator), indicating the author expects null input. With `<Nullable>enable</Nullable>`, this mismatch means callers won't get a compiler warning when passing `null`.

**Fix:**
```csharp
public string GetText(string? languageCode) =>
    languageCode?.ToLowerInvariant() == "en" ? En : Zh;
```

**2. `ParseHabitatZone` silently returns default on invalid input** (`HabitatZone.cs`, line 70-78)

```csharp
_ => HabitatZone.Saltwater // 預設為海水
```

A typo in JSON data (e.g., `"corralreef"` instead of `"coralreef"`) silently maps to `Saltwater`. In `JsonDataService.ParseAquariumAnimal()` (line 367), this is the exact callsite — corrupt data will load without any warning. At minimum, log a warning for unrecognized values:

```csharp
public static HabitatZone ParseHabitatZone(string? value)
{
    var zone = value?.ToLowerInvariant() switch
    {
        "freshwater" => HabitatZone.Freshwater,
        "saltwater" => HabitatZone.Saltwater,
        "deepsea" => HabitatZone.DeepSea,
        "coralreef" => HabitatZone.CoralReef,
        "polar" => HabitatZone.Polar,
        _ => (HabitatZone?)null
    };

    return zone ?? HabitatZone.Saltwater;
}

// Better yet, provide a TryParse variant for callers that need to detect failures.
```

**3. Magic numbers in validator should be named constants** (`AquariumAnimalValidator.cs`, lines 18, 44, 49, 53, 59)

The values `200`, `100`, `150` appear as raw literals. They represent business rules (description max length, story min/max length) but lack names. This is especially problematic because `Dinosaur.cs` (line 43) documents Story as "不超過 150 字" (max 150 only) while `AquariumAnimal.cs` (line 48) says "100-150 字" (min 100, max 150) — the inconsistency is hidden by unlabeled numbers.

**Fix:**
```csharp
public const int DescriptionMaxLength = 200;
public const int StoryMinLength = 100;
public const int StoryMaxLength = 150;
```

**4. Significant code duplication between `AquariumAnimal` and `Dinosaur`** (cross-file)

These two entities share 7 identical properties (`Id`, `Name`, `Diet`, `Location`, `Size`, `Description`, `Story`) with the same types, nullable annotations, and documentation patterns. `AquariumAnimalImages` and `DinosaurImages` are structurally identical (both have `Main` string + `Story` list). This duplication extends to services (`AquariumService` / `DinosaurService`) and data containers.

**Fix** — extract a shared interface for the common properties:
```csharp
public interface IStoryBookCreature
{
    string Id { get; }
    LocalizedText Name { get; }
    LocalizedText Diet { get; }
    LocalizedText Location { get; }
    LocalizedText? Size { get; }
    LocalizedText Description { get; }
    LocalizedText? Story { get; }
}
```

This enables shared validation, shared search logic, and easier addition of new creature types.

**5. Mutable collection properties exposed directly** (`AquariumAnimalData.cs` line 20, `DinosaurData.cs` line 9)

```csharp
public List<AquariumAnimal> Animals { get; set; } = [];
```

The `List<T>` is publicly mutable — any consumer can add, remove, or clear items after loading. Since this data is cached in `JsonDataService` (shared across requests), mutations would affect all subsequent callers.

Per the C# language patterns reference: *"Mutable collections exposed from methods: Return Collections.unmodifiableList() or defensive copies."*

**Fix:**
```csharp
public IReadOnlyList<AquariumAnimal> Animals { get; init; } = [];
```

**6. No unit tests exist for any model or validator** (project-wide)

There are no `*Test*.cs` files or test projects in the solution. The validator's logic (regex matching, length boundaries, null handling) is exactly the kind of code that benefits from parameterized tests. Without tests, the critical issues above (#1 dead code, #2 NRE bug) went undetected.

Consider adding an xUnit test project with `[Theory]` + `[InlineData]` tests for boundary conditions:
- ID format: valid (`"clownfish"`, `"deep-sea-1"`), invalid (`"Clown Fish"`, `""`, `"fish@reef"`)
- Description: exactly 200 chars (pass), 201 chars (fail)
- Story: 99, 100, 150, 151 chars at boundaries

**7. Image path properties lack any input validation** (`AquariumAnimalImages.cs` line 19, `DinosaurImages.cs` line 10)

Paths like `Main = "/images/aquarium/clownfish/main.png"` come from JSON data and are rendered in HTML. There's no validation against path traversal (`../../../etc/passwd`) or absolute paths. While the risk is low in a read-only Razor Pages app, it's a defense-in-depth concern.

Per the security checklist: *"Input used in file paths is validated against path traversal (../, null bytes, symlink attacks)"*

---

### ✅ Good Practices

**1. Effective use of `required` modifier across all entity properties.** Every non-optional property uses `required`, which provides compile-time enforcement that object initializers include all mandatory fields. This prevents partially-constructed entities from entering the system. (`AquariumAnimal.cs`, `Dinosaur.cs`, `LocalizedText.cs`, `AquariumAnimalImages.cs`)

**2. Excellent XML documentation with `<example>` blocks.** `AquariumAnimal.cs`, `LocalizedText.cs`, `HabitatZone.cs`, and `AquariumAnimalImages.cs` all include runnable code examples in their doc comments. This serves as both documentation and a quick-reference for consumers.

**3. Modern C# idioms used consistently.** File-scoped namespaces, collection expressions (`= []`), switch expressions in `HabitatZone.cs`, `[GeneratedRegex]` source generator in the validator, and pattern matching (`is null`, `is not null`) — all align with C# 12-14 best practices and the project's `.editorconfig` settings.

**4. Clean separation of concerns in validator design.** `AquariumAnimalValidator` is a `static partial class` with `[GeneratedRegex]`, keeping validation logic separate from model classes. Individual validation methods (`ValidateId`, `ValidateDescription`, `ValidateStory`) are composable and independently testable.

**5. Nullable reference types handled correctly in model design.** Optional properties (`Size`, `Story`) use `T?` annotations, while required properties are non-nullable. The `ValidateStory` method correctly handles the `null` case with an early return. This aligns with the C# anti-pattern guidance: *"Not enabling `<Nullable>enable</Nullable>` or ignoring warnings leads to NullReferenceException at runtime."*

**6. `HabitatZone` enum with extension methods is a clean pattern.** Keeping display names and CSS classes in extension methods rather than attributes keeps the enum simple while providing rich behavior. The switch expressions are exhaustive with a sensible default arm.

---

### Metrics

| 項目 | 數值 |
|------|------|
| Files reviewed | 9 (+ 3 related service files for context) |
| Critical issues | 3 |
| Suggestions | 7 |
| Good practices identified | 6 |
| Test coverage | None (no test project exists) |
| **Verdict** | **Needs significant rework** |

---

*Report generated by GitHub Copilot Code Review Skill — 2026-03-21*
