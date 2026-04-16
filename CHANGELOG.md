# Moodmold Mobile — 变更记录

## [未发布] 当前 `main`

### 首页与资源（`ef51ca0`）

- Home 使用 **`assets/homedog.png`** 作为主体小狗图。
- 增加 **`assets/`** 资源目录；含 **`homedog.png`**、**`pet-home.png`** 等。
- 首页主体区：浅色圆角「舞台」、双圆环、星标/爱心；小狗图放大展示，名称区大写标题样式。
- 全屏高度与滚动与底部导航的间距已做适配（`scroll-padding-bottom` 等）。

### 初始版本（`46aa079`）

- 单文件原型 **`moodmold.html`**：Home、Play/AR、Feed、Dress、Create、Generating 等界面。
- 手机外框固定尺寸、页面高度统一；Create 页真实选择/读取本地图片（`FileReader`）；生成流程可显示所选图。

---

完整历史以 Git 为准：

```bash
git log --oneline
```

远程仓库：<https://github.com/Yiyinggg/Moodmold-mobile>
