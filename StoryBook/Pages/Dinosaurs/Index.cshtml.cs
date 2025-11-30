using Microsoft.AspNetCore.Mvc.RazorPages;
using StoryBook.Models;
using StoryBook.Services;

namespace StoryBook.Pages.Dinosaurs;

/// <summary>
/// 恐龍介紹頁面模型
/// </summary>
public class IndexModel : PageModel
{
    private readonly IDinosaurService _dinosaurService;
    private readonly ILogger<IndexModel> _logger;

    /// <summary>
    /// 當前顯示的恐龍
    /// </summary>
    public Dinosaur? CurrentDinosaur { get; private set; }

    /// <summary>
    /// 所有恐龍列表（用於前端 JavaScript）
    /// </summary>
    public IEnumerable<Dinosaur> AllDinosaurs { get; private set; } = [];

    /// <summary>
    /// 當前索引
    /// </summary>
    public int CurrentIndex { get; private set; }

    /// <summary>
    /// 恐龍總數
    /// </summary>
    public int TotalCount { get; private set; }

    /// <summary>
    /// 是否有上一隻
    /// </summary>
    public bool HasPrevious => CurrentIndex > 0;

    /// <summary>
    /// 是否有下一隻
    /// </summary>
    public bool HasNext => CurrentIndex < TotalCount - 1;

    /// <summary>
    /// 建立頁面模型實例
    /// </summary>
    /// <param name="dinosaurService">恐龍服務</param>
    /// <param name="logger">日誌服務</param>
    public IndexModel(IDinosaurService dinosaurService, ILogger<IndexModel> logger)
    {
        _dinosaurService = dinosaurService;
        _logger = logger;
    }

    /// <summary>
    /// 處理 GET 請求
    /// </summary>
    /// <param name="index">恐龍索引（預設為 0）</param>
    public async Task OnGetAsync(int index = 0)
    {
        _logger.LogInformation("載入恐龍介紹頁面，索引：{Index}", index);

        AllDinosaurs = await _dinosaurService.GetAllAsync();
        TotalCount = await _dinosaurService.GetCountAsync();

        // 確保索引在有效範圍內
        if (index < 0)
        {
            index = 0;
        }
        else if (index >= TotalCount && TotalCount > 0)
        {
            index = TotalCount - 1;
        }

        CurrentIndex = index;
        CurrentDinosaur = await _dinosaurService.GetByIndexAsync(index);

        if (CurrentDinosaur is null)
        {
            _logger.LogWarning("找不到索引 {Index} 的恐龍", index);
        }
    }
}
