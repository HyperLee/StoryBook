using Microsoft.AspNetCore.Mvc.RazorPages;
using StoryBook.Models;
using StoryBook.Services;

namespace StoryBook.Pages.Aquarium;

/// <summary>
/// 水族館動物介紹頁面模型
/// </summary>
/// <remarks>
/// 提供水族館故事書的主要頁面功能，支援：
/// <list type="bullet">
///     <item>單頁顯示一隻動物</item>
///     <item>換頁瀏覽所有動物</item>
///     <item>封面顯示（index = -1）</item>
/// </list>
/// </remarks>
/// <example>
/// <code>
/// // 顯示封面
/// /Aquarium
/// 
/// // 顯示第一隻動物
/// /Aquarium/0
/// 
/// // 顯示第三隻動物
/// /Aquarium/2
/// </code>
/// </example>
public class IndexModel : PageModel
{
    private readonly IAquariumService _aquariumService;
    private readonly ILogger<IndexModel> _logger;

    /// <summary>
    /// 當前顯示的水族館動物
    /// </summary>
    public AquariumAnimal? CurrentAnimal { get; private set; }

    /// <summary>
    /// 所有水族館動物列表（用於前端 JavaScript 搜尋）
    /// </summary>
    public IEnumerable<AquariumAnimal> AllAnimals { get; private set; } = [];

    /// <summary>
    /// 當前索引（-1 表示封面頁）
    /// </summary>
    public int CurrentIndex { get; private set; }

    /// <summary>
    /// 動物總數
    /// </summary>
    public int TotalCount { get; private set; }

    /// <summary>
    /// 是否為封面頁
    /// </summary>
    public bool IsCoverPage => CurrentIndex == -1;

    /// <summary>
    /// 是否有上一隻
    /// </summary>
    public bool HasPrevious => CurrentIndex > 0;

    /// <summary>
    /// 是否有下一隻
    /// </summary>
    public bool HasNext => CurrentIndex < TotalCount - 1;

    /// <summary>
    /// 是否發生載入錯誤
    /// </summary>
    public bool HasLoadError { get; private set; }

    /// <summary>
    /// 錯誤訊息
    /// </summary>
    public string? ErrorMessage { get; private set; }

    /// <summary>
    /// 是否可從封面進入第一頁
    /// </summary>
    public bool CanEnterFromCover => IsCoverPage && TotalCount > 0;

    /// <summary>
    /// 建立頁面模型實例
    /// </summary>
    /// <param name="aquariumService">水族館服務</param>
    /// <param name="logger">日誌服務</param>
    public IndexModel(IAquariumService aquariumService, ILogger<IndexModel> logger)
    {
        _aquariumService = aquariumService ?? throw new ArgumentNullException(nameof(aquariumService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <summary>
    /// 處理 GET 請求
    /// </summary>
    /// <param name="index">動物索引（-1 或省略表示封面頁，0 以上表示動物頁面）</param>
    public async Task OnGetAsync(int? index = null)
    {
        try
        {
            // 如果沒有提供 index，顯示封面頁
            var pageIndex = index ?? -1;

            _logger.LogInformation("載入水族館介紹頁面，索引：{Index}", pageIndex);

            AllAnimals = await _aquariumService.GetAllAsync();
            TotalCount = await _aquariumService.GetCountAsync();

            // 封面頁
            if (pageIndex == -1)
            {
                CurrentIndex = -1;
                CurrentAnimal = null;
                _logger.LogDebug("顯示水族館封面頁");
                return;
            }

            // 確保索引在有效範圍內
            if (pageIndex < 0)
            {
                pageIndex = 0;
            }
            else if (pageIndex >= TotalCount && TotalCount > 0)
            {
                pageIndex = TotalCount - 1;
            }

            CurrentIndex = pageIndex;
            CurrentAnimal = await _aquariumService.GetByIndexAsync(pageIndex);

            if (CurrentAnimal is null)
            {
                _logger.LogWarning("找不到索引 {Index} 的水族館動物", pageIndex);
            }
            else
            {
                _logger.LogDebug("顯示水族館動物：{AnimalName}，索引：{Index}", CurrentAnimal.Name.Zh, pageIndex);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "載入水族館頁面時發生錯誤");
            HasLoadError = true;
            ErrorMessage = "載入動物資料時發生錯誤，請稍後再試";
            CurrentIndex = index ?? -1;
            AllAnimals = [];
            TotalCount = 0;
        }
    }
}
