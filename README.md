# 求是脉络

“求是脉络——竺可桢科学思想证据图谱与数字叙事平台”是一个无需安装前端依赖的静态数字人文项目，包含首页、项目介绍、数据说明、知识图谱、生平叙事与学术脉络六个交互视图。

## 运行方法

### Windows

双击 `start.bat`。脚本会查找可用的 Python 3，在 `8000`—`8010` 中选择空闲端口，启动本地服务并打开浏览器。

### 命令行

在项目目录中运行：

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

然后访问 `http://127.0.0.1:8000/`。

由于页面通过 HTTP 加载知识图谱和地图数据，请勿直接双击 `index.html` 运行。

## GitHub Pages 托管

此项目可以直接由 GitHub Pages 托管，无需运行 `start.bat`、安装 Python 或执行构建。

- 代码仓库：https://github.com/xiaofirst423/qiushi-zhu-kezheng
- 在线网站：https://xiaofirst423.github.io/qiushi-zhu-kezheng/

1. 将本目录中的文件上传至公开仓库 `qiushi-zhu-kezheng` 的根目录，确保 `index.html` 与 `assets/` 同级。
2. 在仓库的 **Settings → Pages** 中，将 **Source** 设为 **Deploy from a branch**。
3. 选择 **main** 分支和 **/ (root)** 目录，点击 **Save**。
4. 等待仓库 **Actions** 中的 Pages 部署完成，访问上面的在线网站。

根目录中的 `.nojekyll` 禁用 Jekyll 处理，直接发布静态文件。资源和数据使用相对路径，页面使用 `#/home` 等哈希路由，支持仓库子路径及子页面刷新。后续推送到 `main` 分支会自动更新网站。

`start.bat` 仍用于 Windows 本地预览。

修改网页后，在本目录运行以下命令更新仓库和网站：

```powershell
git add .
git commit -m "Update website"
git push
```

## 项目结构

```text
landingpage/
├── index.html          # 网页入口
├── app.js              # 页面、交互、图谱与地图逻辑
├── styles.css          # 全站样式与响应式布局
├── start.bat           # Windows 一键启动脚本
├── DATA_SOURCES.md     # 史料、地图、坐标与图片来源
└── assets/
    ├── data/           # 浏览器直接读取的数据
    └── visuals/        # 页面直接使用的图片资源
```

## 技术说明

- 原生 HTML、CSS、JavaScript，无 npm 或第三方前端运行依赖。
- 知识图谱使用 Canvas 渲染，数据位于 `assets/data/graph-data.json`。
- 生平地图使用本地 GeoJSON，数据位于 `assets/data/china-provinces.geojson`。
- 页面中的史料链接需要联网访问；本地交互与主要数据展示不依赖外部接口。

## 数据与使用说明

详细来源和坐标说明见 `DATA_SOURCES.md`。项目中的知识图谱数据用于本地研究展示；公开部署、比赛传播或二次使用前，应根据赛事要求复核数据、档案肖像和机构网页内容的授权、署名及使用范围。
