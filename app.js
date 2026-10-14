(function () {
  "use strict";

  const ROUTES = {
    home: { label: "首页", hash: "#/home" },
    about: { label: "关于项目", hash: "#/about" },
    graph: { label: "知识图谱", hash: "#/graph" },
    narrative: { label: "生平叙事", hash: "#/narrative" },
    academic: { label: "学术脉络", hash: "#/academic" },
  };

  const app = document.getElementById("app");
  const state = {
    route: "home",
    narrativeStage: 0,
    academicDiscipline: 0,
    graphData: null,
    chinaGeoData: null,
    graphController: null,
    pageCleanup: null,
  };

  const narrativeStages = [
    {
      title: "东关出发",
      years: "1890—1910",
      summary: "生于上虞东关，先后赴上海、唐山求学；1910 年考取第二批庚款留美。",
      locations: ["东关", "上海", "唐山"],
      placeLine: "东关 → 上海 → 唐山",
      milestones: [["1890", "生于东关"], ["1905", "上海求学"], ["1909", "入唐山路矿学堂"], ["1910", "庚款留美"]],
      sourceLabel: "浙大档案馆 · 西南交大档案馆",
      sourceUrl: "https://zdjy.zju.edu.cn/review/toReview?dbID=23&dbName=ZHEJIANGDAXUEBAO&sysID=33179",
    },
    {
      title: "留美研学",
      years: "1910—1918",
      summary: "在伊利诺伊大学完成农学学习，继而进入哈佛大学地学系研究气象，获博士学位后回国。",
      locations: ["上海"],
      placeLine: "上海启程 → 伊利诺伊 → 哈佛",
      overseas: "美国 · 伊利诺伊大学 / 哈佛大学",
      milestones: [["1910", "自上海赴美"], ["1913", "伊利诺伊大学毕业"], ["1913", "入哈佛研究气象"], ["1918", "获博士学位"]],
      sourceLabel: "中国科学院地理资源所",
      sourceUrl: "https://www.igsnrr.cas.cn/cbkx/kpyd/dlxj/202009/t20200910_5692697.html",
    },
    {
      title: "地学教育",
      years: "1918—1928",
      summary: "回国后任教武昌高师、南京高师，参与创建东南大学地学系，并在上海、天津继续教学与编辑工作。",
      locations: ["武昌", "南京", "上海", "天津"],
      placeLine: "武昌 → 南京 → 上海 → 天津 → 南京",
      milestones: [["1918", "任教武昌高师"], ["1920", "转任南京高师"], ["1921", "创建地学系"], ["1925—27", "上海、天津工作"]],
      sourceLabel: "南京大学档案馆",
      sourceUrl: "https://dawww.nju.edu.cn/xswh/ndxs/zydx/njgdszll.htm",
    },
    {
      title: "建所与观测",
      years: "1928—1936",
      summary: "在南京主持中央研究院气象研究所，建设北极阁气象台，推动近代气象观测网络与天气研究。",
      locations: ["南京"],
      placeLine: "南京 · 北极阁",
      milestones: [["1928", "主持气象研究所"], ["1928—36", "建设观测网络"], ["同期", "推进台风与季风研究"]],
      sourceLabel: "中科院大气物理研究所",
      sourceUrl: "https://iap.cas.cn/qt/zthd/sq/lc/201811/t20181107_5166363.html",
    },
    {
      title: "掌校与西迁",
      years: "1936—1949",
      summary: "出任浙江大学校长，抗战中率校辗转西迁，在遵义、湄潭坚持办学，1946 年复员杭州。",
      locations: ["杭州"],
      placeLine: "杭州 → 浙赣湘粤桂黔 → 杭州",
      milestones: [["1936", "就任浙大校长"], ["1937", "率校西迁"], ["1940", "遵义、湄潭办学"], ["1946", "复员杭州"]],
      sourceLabel: "浙江大学校史馆",
      sourceUrl: "https://www.zju.edu.cn/2009/0629/c32862a61670/pagem.htm",
    },
    {
      title: "科学院与晚年",
      years: "1949—1974",
      summary: "参与筹建中国科学院并任副院长，组织资源综合考察，持续推进物候与历史气候研究。",
      locations: ["上海", "北京"],
      placeLine: "上海 → 北京",
      milestones: [["1949", "参与筹建中科院"], ["1956", "组织综合考察"], ["1963", "出版《物候学》"], ["1974", "在北京逝世"]],
      sourceLabel: "中国科学院",
      sourceUrl: "https://www.cas.cn/zt/rwzt/jnzkz/jnzkzwj/201003/t20100325_2807187.shtml",
    },
  ];

  const lifePlaces = [
    { name: "东关", label: "东关（今上虞）", lon: 120.814074, lat: 30.011658, year: "1890" },
    { name: "上海", label: "上海", lon: 121.46254, lat: 31.290536, year: "1905 / 1949" },
    { name: "唐山", label: "唐山", lon: 118.181283, lat: 39.603012, year: "1909" },
    { name: "武昌", label: "武昌", lon: 114.300669, lat: 30.541944, year: "1918" },
    { name: "南京", label: "南京", lon: 118.788282, lat: 32.057648, year: "1920 / 1928" },
    { name: "天津", label: "天津", lon: 117.162231, lat: 39.10357, year: "1925" },
    { name: "杭州", label: "杭州", lon: 120.205234, lat: 30.248963, year: "1936 / 1946" },
    { name: "北京", label: "北京", lon: 116.391297, lat: 39.905714, year: "1949—1974" },
  ];

  const lifeRoute = ["东关", "上海", "唐山", "武昌", "南京", "上海", "天津", "南京", "杭州", "上海", "北京"];

  const disciplines = [
    { title: "气象学", terms: "台风 · 季风 · 观测网络", detail: "从台风分类、季风系统到北极阁观测实践，推动中国近代气象研究与业务体系的形成。" },
    { title: "气候学", terms: "区域气候 · 气候区划", detail: "立足中国季风与区域差异，提出气候区划和自然区划的基本轮廓。" },
    { title: "物候学", terms: "萌芽 · 开花 · 候鸟 · 农时", detail: "把日常观察转化为长期、可比较的物候记录，连接气候变化与农事节律。" },
    { title: "历史气候学", terms: "历史文献 · 气候变迁", detail: "综合古籍、方志和物候证据，研究中国长时间尺度的气候变迁。" },
    { title: "自然地理与综合考察", terms: "自然区划 · 资源综合考察", detail: "组织全国自然资源综合考察，推动冰川、冻土、沙漠与青藏高原等领域的研究布局。" },
  ];

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function routeFromHash() {
    const candidate = location.hash.replace(/^#\/?/, "") || "home";
    return ROUTES[candidate] ? candidate : "home";
  }

  function headerTemplate(route) {
    const active = route;
    return `
      <header class="site-header${route === "home" ? " site-header--home" : route === "about" ? " site-header--about" : ""}">
        <div class="header-inner">
          <a class="brand" href="#/home" aria-label="求是脉络首页">
        <span class="brand-logo"><img src="assets/visuals/logo.png" alt="求是脉络标志" /></span>
            <span class="brand-copy">
              <span class="brand-name">求是脉络</span>
              <span class="brand-tagline">竺可桢科学思想证据图谱</span>
            </span>
          </a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">菜单</button>
          <nav id="primary-nav" class="primary-nav" aria-label="主导航">
            ${["home", "about"].map((key) => `
              <a class="nav-link" href="${ROUTES[key].hash}" ${active === key ? 'aria-current="page"' : ""}>${ROUTES[key].label}</a>
            `).join("")}
          </nav>
        </div>
      </header>`;
  }

  function homeTemplate() {
    const portals = [
      ["01", "知识图谱", "探索人物、事件、著作与机构之间的关联网络。", "#/graph", "assets/visuals/icon-knowledge-graph.png"],
      ["02", "生平叙事", "沿时间与地点回看竺可桢的学术历程与人生轨迹。", "#/narrative", "assets/visuals/icon-life-timeline.png"],
      ["03", "学术脉络", "追踪气象、地理、物候与教育思想的形成与演变。", "#/academic", "assets/visuals/icon-academic-book.png"],
    ];
    return `
      <main id="main-content" class="page home-page">
        <div class="page-inner">
          <section class="home-hero" aria-labelledby="home-title">
            <img class="hero-visual" src="assets/visuals/hero-zhu-collage.png" alt="竺可桢肖像、气象仪器与校园建筑的水墨拼贴" />
            <div class="home-copy">
              <p class="section-kicker">观测 · 叙事 · 思想</p>
              <h1 id="home-title" class="display-title"><span class="art-title">求是</span><span class="title-rest">脉络</span></h1>
              <p class="home-subtitle">竺可桢科学思想证据图谱与数字叙事平台</p>
              <div class="title-rule"></div>
              <p class="lead home-description">本项目以20世纪中国科学史人物竺可桢为研究对象，在权利边界允许的本地研究范围内，对候选资料开展系统调研与证据整理，构建可追溯的本地知识图谱；并通过人物关系网络、生平时间线与学术脉络等数字叙事模块，呈现其科学实践、思想发展及其与时代的联系。</p>
            </div>
            <aside class="climate-card" aria-label="杭州多年平均月气温图表">
              <div class="climate-heading"><span>杭州</span><span>气象手记</span></div>
              <h2>四时温序</h2>
              <p>多年平均月气温</p>
              <canvas id="climate-chart" width="300" height="150">杭州一至十二月平均气温折线图。</canvas>
              <div class="climate-seasons" aria-hidden="true"><span>春</span><span>夏</span><span>秋</span><span>冬</span></div>
            </aside>
          </section>
          <section class="portal-grid" aria-label="核心模块">
            ${portals.map(([index, title, text, href, icon]) => `
              <a class="portal-card glass-card" href="${href}">
                <span class="portal-index">${index} / 03</span>
                <img class="portal-icon" src="${icon}" alt="" aria-hidden="true" />
                <div><h2>${title}</h2><p>${text}</p></div>
                <span class="portal-action">进入模块</span>
              </a>`).join("")}
          </section>
        </div>
      </main>`;
  }

  function aboutTemplate() {
    const methodSteps = [
      {
        index: "01",
        phase: "词条起点",
        title: "定位人物",
        text: "调用百度百科 API，以竺可桢人物词条建立研究的种子节点。",
        meta: "BAIDU BAIKE API",
        icon: "assets/visuals/icon-data-step-1.png",
      },
      {
        index: "02",
        phase: "链接扩展",
        title: "三轮裂变",
        text: "自动遍历词条内的全部链接，并沿对应词条连续扩展三轮。",
        meta: "CRAWL DEPTH · 3",
        rounds: ["第一轮", "第二轮", "第三轮"],
        icon: "assets/visuals/icon-data-step-2.png",
      },
      {
        index: "03",
        phase: "语义处理",
        title: "实体与关系抽取",
        text: "将三轮扩展后的语料交由 DeepSeek API，识别人、事、机构与相互关系。",
        meta: "DEEPSEEK API",
        icon: "assets/visuals/icon-data-step-3.png",
      },
      {
        index: "04",
        phase: "质量控制",
        title: "人工核验",
        text: "对抽取结果逐项复核，处理实体歧义、关系误判与来源对应。",
        meta: "HUMAN IN THE LOOP",
        icon: "assets/visuals/icon-data-step-4.png",
      },
      {
        index: "05",
        phase: "成果呈现",
        title: "进入知识图谱",
        text: "将核验后的数据载入知识图谱模块，呈现可探索的关联网络。",
        meta: "KNOWLEDGE GRAPH",
        icon: "assets/visuals/icon-knowledge-graph.png",
      },
    ];
    return `
      <main id="main-content" class="page about-page about-method-page">
        <img class="about-method-visual" src="assets/visuals/zhu-at-desk.png" alt="" aria-hidden="true" />
        <div class="page-inner">
          <section class="about-method-opening" aria-labelledby="about-title">
            <div class="about-method-copy">
              <p class="about-method-kicker">PROJECT METHODOLOGY · 研究方法</p>
              <h1 id="about-title" class="page-title"><span class="teal">关于</span>项目</h1>
              <p class="about-method-thesis">从一个词条，生长为一张可核验的关系网络</p>
            </div>
          </section>

          <section class="about-method-process" aria-label="研究流程">
            <ol class="about-method-grid">
              ${methodSteps.map((step) => `
                <li class="about-method-step">
                  <div class="about-step-topline"><span>${step.index}</span><small>${step.phase}</small></div>
                  <img src="${step.icon}" alt="" aria-hidden="true" />
                  <h3>${step.title}</h3>
                  <p>${step.text}</p>
                  ${step.rounds ? `<div class="about-step-rounds" aria-label="连续裂变三轮">${step.rounds.map((round) => `<span>${round}</span>`).join("")}</div>` : ""}
                  <span class="about-step-meta">${step.meta}</span>
                </li>`).join("")}
            </ol>
          </section>
        </div>
      </main>`;
  }

  function narrativeTemplate() {
    const stage = narrativeStages[state.narrativeStage];
    return `
      <main id="main-content" class="page narrative-page">
        <div class="page-inner">
          <header class="narrative-head">
            <div>
              <nav class="graph-breadcrumb" aria-label="当前位置"><a href="#/home">首页</a><span aria-hidden="true">／</span><span aria-current="page">生平叙事</span></nav>
              <p class="section-kicker">Life in time and place</p>
              <h1 class="page-title"><span class="teal">在时间中观看</span>竺可桢与时代</h1>
            </div>
            <p class="eyebrow-note">选择年代或地图地点，时间与空间将彼此回应。地图按真实经纬度投影。</p>
          </header>
          <section class="narrative-atlas" aria-label="当前人生阶段与地理轨迹">
            <article id="era-detail" class="era-story" aria-live="polite">
              <div class="era-heading"><span id="stage-years" class="era-years">${stage.years}</span><span id="era-sequence" class="era-sequence">${String(state.narrativeStage + 1).padStart(2, "0")} / ${String(narrativeStages.length).padStart(2, "0")}</span></div>
              <h2 id="stage-title">${stage.title}</h2>
              <p id="stage-summary" class="era-summary">${stage.summary}</p>
              <p id="stage-place-line" class="era-place-line">${stage.placeLine}</p>
              <div id="stage-milestones" class="milestone-ribbon" aria-label="本阶段关键事件">${stage.milestones.map(([year, label]) => `<span><b>${year}</b>${label}</span>`).join("")}</div>
              <a id="stage-source" class="era-source" href="${stage.sourceUrl}" target="_blank" rel="noreferrer">史料核对：${stage.sourceLabel}</a>
              <blockquote class="editorial-quote"><p>排万难，冒百死，<br />以求真知。</p><cite>竺可桢 · 1939《求是精神与牺牲精神》</cite></blockquote>
              <figure class="archive-portrait"><img src="assets/visuals/zhu-archive-portrait.jpg" alt="竺可桢黑白肖像" /><figcaption>竺可桢肖像 · 浙江大学档案馆资料页</figcaption></figure>
            </article>
            <figure class="journey-atlas">
              <div class="map-heading"><div><p class="map-kicker">WGS84 · Albers equal-area</p><h2>人生轨迹地图</h2></div><p>点击地点，可回到它首次出现的人生阶段</p></div>
              <div id="journey-map-viewport" class="map-viewport">
                <canvas id="journey-map" width="900" height="520">竺可桢人生轨迹中国地图。</canvas>
                <div id="journey-map-points" class="map-points" aria-label="人生轨迹地点">${lifePlaces.map((place) => `<button class="map-point" type="button" data-location="${place.name}" aria-label="${place.label}，${place.year}"><span class="map-dot" aria-hidden="true"></span><span class="map-label">${place.label}<small>${place.year}</small></span></button>`).join("")}</div>
                <p id="map-loading" class="map-loading" role="status">正在载入中国行政区边界…</p>
                <p id="overseas-note" class="overseas-note" hidden>跨洋研学<br /><strong>伊利诺伊 · 哈佛</strong></p>
              </div>
              <img class="journey-ornament" src="assets/visuals/icon-life-timeline.png" alt="" aria-hidden="true" />
              <figcaption>边界：DataV GeoAtlas（2026-08-10 获取） · 地点：机构史料与 OSM WGS84 · 显示投影：Albers 等积</figcaption>
            </figure>
          </section>
          <nav class="timeline-rail" role="tablist" aria-label="竺可桢生平六阶段">
            <span class="timeline-baseline" aria-hidden="true"></span>
            ${narrativeStages.map((item, index) => `<button class="timeline-stop" type="button" role="tab" data-stage="${index}" aria-controls="era-detail" aria-selected="${index === state.narrativeStage}" tabindex="${index === state.narrativeStage ? 0 : -1}"><span class="timeline-year">${item.years.split("—")[0]}</span><span class="timeline-node" aria-hidden="true"></span><span class="timeline-name">${item.title}</span></button>`).join("")}
            <span class="timeline-end" aria-hidden="true">1974</span>
          </nav>
        </div>
      </main>`;
  }

  function academicTemplate() {
    return `
      <main id="main-content" class="page academic-page" data-active-discipline="${state.academicDiscipline}">
        <img class="academic-landscape" src="assets/visuals/academic-river-bg.png" alt="水墨山河中分布着气象仪器、季风地图、花鸟、古籍和地貌考察意象" />
        <div class="page-inner">
          <header class="academic-intro">
            <nav class="graph-breadcrumb" aria-label="当前位置"><a href="#/home">首页</a><span aria-hidden="true">／</span><span aria-current="page">学术脉络</span></nav>
            <p class="section-kicker">Academic river</p>
            <h1 class="page-title academic-title"><span class="art-title">学术</span><span class="title-rest">脉络</span></h1>
            <p class="lead">沿背景中的五处学术意象，观看竺可桢如何把观测、地域与历史编织成一条研究长河。</p>
            <span class="academic-instruction">依次浮现 · 点击一处深入阅读</span>
          </header>
          <section class="academic-route" aria-label="五大学术领域">
            ${disciplines.map((item, index) => `
              <button class="discipline-marker" type="button" data-discipline="${index}" aria-pressed="${index === state.academicDiscipline}">
                <span class="discipline-index">${String(index + 1).padStart(2, "0")}</span>
                <span class="discipline-name">${item.title}</span>
                <span class="discipline-terms">${item.terms}</span>
                <span class="discipline-explainer">${item.detail}</span>
              </button>`).join("")}
          </section>
          <p class="academic-source">学术方向核对：<a href="https://www.cas.cn/zt/rwzt/jnzkz/zkzjj/zkjjjwz/201003/t20100326_2807834.shtml" target="_blank" rel="noreferrer">中国科学院生平简介</a></p>
        </div>
      </main>`;
  }

  function graphTemplate() {
    return `
      <main id="main-content" class="page graph-page">
        <div class="page-inner">
          <header class="graph-head">
            <div class="graph-head-copy">
              <nav class="graph-breadcrumb" aria-label="当前位置"><a href="#/home">首页</a><span aria-hidden="true">／</span><span aria-current="page">知识图谱</span></nav>
              <div class="graph-title-lockup"><h1 class="page-title"><span class="teal">知识</span>图谱</h1><p>以关系为经纬，循人物与思想的轨迹展开</p></div>
            </div>
            <div id="graph-scope" class="graph-scope" aria-live="polite"><strong>全库关系全景</strong><span>正在整理图谱数据…</span></div>
          </header>
          <section class="graph-workspace" aria-label="交互式知识图谱">
            <div class="graph-canvas-wrap">
              <canvas id="graph-canvas" width="1200" height="700" tabindex="0" aria-label="可缩放、拖动并选择节点的知识图谱画布">交互式知识图谱画布。</canvas>
              <div class="graph-toolbar" aria-label="画布控制">
                <button class="toolbar-button" type="button" data-graph-action="zoom-in" aria-label="放大">放大</button>
                <button class="toolbar-button" type="button" data-graph-action="zoom-out" aria-label="缩小">缩小</button>
                <button class="toolbar-button" type="button" data-graph-action="reset">归位</button>
              </div>
              <div id="graph-legend" class="graph-legend" aria-label="实体颜色图例"></div>
              <div id="graph-loading" class="graph-loading">正在读取完整图谱数据…</div>
            </div>
            <aside class="graph-sidebar" aria-label="图谱检索与筛选">
              <h2>寻迹</h2>
              <div class="search-wrap">
                <label for="graph-search" class="muted">检索人物、机构或著作</label>
                <input id="graph-search" class="search-input" type="search" autocomplete="off" placeholder="输入人物、机构或著作" />
                <ul id="search-results" class="search-results" aria-label="搜索结果"></ul>
              </div>
              <div id="layer-filters" class="filter-group"><h3>关系层级</h3></div>
              <div id="type-filters" class="filter-group"><h3>实体类型</h3></div>
              <div class="graph-view-actions">
                <button id="show-overview" class="ghost-button" type="button">查看全部数据</button>
                <button id="show-default" class="ghost-button" type="button">聚焦竺可桢</button>
              </div>
            </aside>
            <aside id="graph-detail" class="graph-detail" aria-live="polite">
              <h2>关系札记</h2><p class="detail-empty">单击节点查看关系，双击可展开它的局部网络。</p>
            </aside>
          </section>
        </div>
      </main>`;
  }

  const templates = { home: homeTemplate, about: aboutTemplate, narrative: narrativeTemplate, academic: academicTemplate, graph: graphTemplate };

  function bindHeader() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    nav.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  }

  function render() {
    if (state.pageCleanup) {
      state.pageCleanup();
      state.pageCleanup = null;
    }
    if (state.graphController) {
      state.graphController.destroy();
      state.graphController = null;
    }
    state.route = routeFromHash();
    app.dataset.route = state.route;
    app.innerHTML = headerTemplate(state.route) + templates[state.route]();
    bindHeader();
    window.scrollTo({ top: 0, behavior: "instant" });
    if (state.route === "home") {
      const climateCleanup = initClimateChart();
      const entranceTimer = window.setTimeout(() => document.querySelector(".home-page")?.classList.add("entrance-complete"), 2300);
      state.pageCleanup = () => { climateCleanup?.(); window.clearTimeout(entranceTimer); };
      requestAnimationFrame(() => document.querySelector(".home-page")?.classList.add("is-visible"));
    }
    if (state.route === "narrative") state.pageCleanup = initNarrative();
    if (state.route === "academic") state.pageCleanup = initAcademic();
    if (state.route === "graph") initGraph();
  }

  function fitCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const context = canvas.getContext("2d");
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { context, width: rect.width, height: rect.height, dpr };
  }

  function initClimateChart() {
    const canvas = document.getElementById("climate-chart");
    if (!canvas) return null;
    const values = [6.1, 8.2, 12.9, 18.7, 23.7, 27.6, 29.0, 28.1, 24.1, 18.6, 12.5, 7.7];
    function draw() {
      const { context: ctx, width, height } = fitCanvas(canvas);
      ctx.clearRect(0, 0, width, height);
      const pad = { l: 24, r: 10, t: 18, b: 15 };
      const chartWidth = width - pad.l - pad.r;
      const chartHeight = height - pad.t - pad.b;
      ctx.save();
      ctx.setLineDash([2, 5]);
      ctx.strokeStyle = "rgba(13,78,89,.14)";
      ctx.lineWidth = 0.8;
      [10, 20, 30].forEach((tick) => {
        const y = pad.t + (30 - tick) / 30 * (height - pad.t - pad.b);
        ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(width - pad.r, y); ctx.stroke();
        ctx.fillStyle = "rgba(37,66,68,.68)"; ctx.font = "9px Georgia,serif"; ctx.fillText(`${tick}°`, 1, y + 3);
      });
      ctx.restore();
      const points = values.map((value, index) => ({
        x: pad.l + index / 11 * chartWidth,
        y: pad.t + (30 - value) / 30 * chartHeight,
      }));
      const temperatureFill = ctx.createLinearGradient(0, pad.t, 0, height - pad.b);
      temperatureFill.addColorStop(0, "rgba(11,102,114,.24)");
      temperatureFill.addColorStop(1, "rgba(11,102,114,.025)");
      ctx.fillStyle = temperatureFill;
      ctx.beginPath();
      ctx.moveTo(points[0].x, height - pad.b);
      ctx.lineTo(points[0].x, points[0].y);
      points.slice(1).forEach((point, index) => {
        const previous = points[index];
        const midX = (previous.x + point.x) / 2;
        const midY = (previous.y + point.y) / 2;
        ctx.quadraticCurveTo(previous.x, previous.y, midX, midY);
      });
      const finalPoint = points.at(-1);
      ctx.lineTo(finalPoint.x, finalPoint.y);
      ctx.lineTo(finalPoint.x, height - pad.b);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#0b6672";
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point, index) => {
        const previous = points[index];
        const midX = (previous.x + point.x) / 2;
        const midY = (previous.y + point.y) / 2;
        ctx.quadraticCurveTo(previous.x, previous.y, midX, midY);
      });
      ctx.lineTo(finalPoint.x, finalPoint.y);
      ctx.stroke();
      points.forEach((point, index) => {
        if (index % 3 !== 0 && index !== 6) return;
        ctx.fillStyle = index === 6 ? "#741a16" : "#a57a41";
        ctx.beginPath(); ctx.arc(point.x, point.y, index === 6 ? 2.9 : 2.2, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = "#0d4e59";
      ctx.font = "10px 'Noto Serif SC','Songti SC',serif";
      ctx.fillText("盛夏 29°", Math.max(pad.l, points[6].x - 22), Math.max(11, points[6].y - 8));
    }
    draw();
    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }

  function albersChinaRaw(lon, lat) {
    const radians = Math.PI / 180;
    const lambda = lon * radians;
    const phi = lat * radians;
    const lambda0 = 105 * radians;
    const phi0 = 0;
    const phi1 = 25 * radians;
    const phi2 = 47 * radians;
    const n = (Math.sin(phi1) + Math.sin(phi2)) / 2;
    const c = Math.cos(phi1) ** 2 + 2 * n * Math.sin(phi1);
    const rho = Math.sqrt(Math.max(0, c - 2 * n * Math.sin(phi))) / n;
    const rho0 = Math.sqrt(c - 2 * n * Math.sin(phi0)) / n;
    const theta = n * (lambda - lambda0);
    return [rho * Math.sin(theta), rho0 - rho * Math.cos(theta)];
  }

  function visitCoordinates(geometry, visitor) {
    if (!geometry?.coordinates) return;
    if (geometry.type === "Polygon") geometry.coordinates.forEach((ring) => ring.forEach(visitor));
    if (geometry.type === "MultiPolygon") geometry.coordinates.forEach((polygon) => polygon.forEach((ring) => ring.forEach(visitor)));
  }

  function createChinaProjection(geoData, width, height, alignedLeft = null) {
    const projected = [];
    geoData.features.forEach((feature) => visitCoordinates(feature.geometry, ([lon, lat]) => projected.push(albersChinaRaw(lon, lat))));
    const xs = projected.map(([x]) => x);
    const ys = projected.map(([, y]) => y);
    const bounds = { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
    const padX = Math.max(28, width * 0.06);
    const padY = Math.max(22, height * 0.055);
    const fitScale = Math.min((width - padX * 2) / (bounds.maxX - bounds.minX), (height - padY * 2) / (bounds.maxY - bounds.minY));
    const atlasScale = width >= 760 ? 1.09 : 1;
    const scale = fitScale * atlasScale;
    const horizontalBias = width >= 1000 ? 0.21 : width >= 760 ? 0.14 : 0.055;
    const offsetX = Number.isFinite(alignedLeft)
      ? alignedLeft
      : (width - (bounds.maxX - bounds.minX) * scale) / 2 - width * horizontalBias;
    const verticalBias = width >= 1000 ? height * 0.055 : width >= 760 ? height * 0.035 : 0;
    const offsetY = (height - (bounds.maxY - bounds.minY) * scale) / 2 + verticalBias;
    return (lon, lat) => {
      const [rawX, rawY] = albersChinaRaw(lon, lat);
      return [offsetX + (rawX - bounds.minX) * scale, offsetY + (bounds.maxY - rawY) * scale];
    };
  }

  function traceMapGeometry(ctx, geometry, project) {
    const traceRing = (ring) => {
      ring.forEach(([lon, lat], index) => {
        const [x, y] = project(lon, lat);
        if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.closePath();
    };
    if (geometry.type === "Polygon") geometry.coordinates.forEach(traceRing);
    if (geometry.type === "MultiPolygon") geometry.coordinates.forEach((polygon) => polygon.forEach(traceRing));
  }

  function initNarrative() {
    const page = document.querySelector(".narrative-page");
    const canvas = document.getElementById("journey-map");
    const viewport = document.getElementById("journey-map-viewport");
    const loading = document.getElementById("map-loading");
    const stageButtons = Array.from(document.querySelectorAll(".timeline-stop"));
    const mapButtons = Array.from(document.querySelectorAll(".map-point"));
    const abortController = new AbortController();
    let disposed = false;
    let resizeObserver = null;

    function drawMap() {
      if (!canvas || !state.chinaGeoData) return;
      const { context: ctx, width, height } = fitCanvas(canvas);
      ctx.clearRect(0, 0, width, height);
      const title = page?.querySelector(".map-heading h2");
      const canvasRect = canvas.getBoundingClientRect();
      const titleRect = title?.getBoundingClientRect();
      const alignedLeft = window.innerWidth >= 1281 && titleRect
        ? Math.max(0, titleRect.left - canvasRect.left)
        : null;
      const project = createChinaProjection(state.chinaGeoData, width, height, alignedLeft);
      state.chinaGeoData.features.forEach((feature) => {
        ctx.beginPath();
        traceMapGeometry(ctx, feature.geometry, project);
        ctx.fillStyle = "rgba(214, 222, 207, 0.32)";
        ctx.strokeStyle = "rgba(65, 83, 78, 0.31)";
        ctx.lineWidth = 0.7;
        ctx.fill("evenodd");
        ctx.stroke();
      });

      const byName = new Map(lifePlaces.map((place) => [place.name, place]));
      const routePoints = lifeRoute.map((name) => byName.get(name)).filter(Boolean).map((place) => project(place.lon, place.lat));
      ctx.beginPath();
      routePoints.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.strokeStyle = "rgba(13, 78, 89, 0.34)";
      ctx.lineWidth = 1.25;
      ctx.setLineDash([5, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      const activeStage = narrativeStages[state.narrativeStage];
      const activePoints = activeStage.locations.map((name) => byName.get(name)).filter(Boolean).map((place) => project(place.lon, place.lat));
      if (activePoints.length > 1) {
        ctx.beginPath();
        activePoints.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.strokeStyle = "rgba(116, 26, 22, 0.78)";
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }

      mapButtons.forEach((button) => {
        const place = byName.get(button.dataset.location);
        if (!place) return;
        const [x, y] = project(place.lon, place.lat);
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
        const isActive = activeStage.locations.includes(place.name);
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-current", isActive ? "location" : "false");
      });
    }

    function selectStage(index) {
      state.narrativeStage = index;
      const stage = narrativeStages[index];
      stageButtons.forEach((button, buttonIndex) => {
        button.setAttribute("aria-selected", String(buttonIndex === index));
        button.tabIndex = buttonIndex === index ? 0 : -1;
      });
      document.getElementById("stage-years").textContent = stage.years;
      document.getElementById("era-sequence").textContent = `${String(index + 1).padStart(2, "0")} / ${String(narrativeStages.length).padStart(2, "0")}`;
      document.getElementById("stage-title").textContent = stage.title;
      document.getElementById("stage-summary").textContent = stage.summary;
      document.getElementById("stage-place-line").textContent = stage.placeLine;
      document.getElementById("stage-milestones").innerHTML = stage.milestones.map(([year, label]) => `<span><b>${escapeHTML(year)}</b>${escapeHTML(label)}</span>`).join("");
      const source = document.getElementById("stage-source");
      source.href = stage.sourceUrl;
      source.textContent = `史料核对：${stage.sourceLabel}`;
      const overseas = document.getElementById("overseas-note");
      overseas.hidden = !stage.overseas;
      const detail = document.getElementById("era-detail");
      detail.classList.remove("is-updating");
      requestAnimationFrame(() => detail.classList.add("is-updating"));
      drawMap();
    }

    stageButtons.forEach((button, index) => {
      button.addEventListener("click", () => selectStage(index));
      button.addEventListener("keydown", (event) => {
        if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? stageButtons.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + stageButtons.length) % stageButtons.length;
        selectStage(next);
        stageButtons[next].focus();
      });
    });

    mapButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const index = narrativeStages.findIndex((stage) => stage.locations.includes(button.dataset.location));
        if (index >= 0) selectStage(index);
      });
    });

    requestAnimationFrame(() => page?.classList.add("is-visible"));
    (async () => {
      try {
        if (!state.chinaGeoData) {
          const response = await fetch("assets/data/china-provinces.geojson", { signal: abortController.signal });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          state.chinaGeoData = await response.json();
        }
        if (disposed || state.route !== "narrative") return;
        loading?.remove();
        drawMap();
        resizeObserver = new ResizeObserver(drawMap);
        if (viewport) resizeObserver.observe(viewport);
      } catch (error) {
        if (error.name === "AbortError") return;
        if (loading) loading.textContent = `地图边界载入失败：${error.message}`;
        console.error(error);
      }
    })();

    selectStage(state.narrativeStage);
    return () => {
      disposed = true;
      abortController.abort();
      resizeObserver?.disconnect();
    };
  }

  function initAcademic() {
    const page = document.querySelector(".academic-page");
    const markers = Array.from(document.querySelectorAll(".discipline-marker"));
    const selectDiscipline = (index) => {
      state.academicDiscipline = index;
      page.dataset.activeDiscipline = String(index);
      markers.forEach((marker, markerIndex) => marker.setAttribute("aria-pressed", String(markerIndex === index)));
    };
    markers.forEach((marker, index) => {
      marker.addEventListener("click", () => selectDiscipline(index));
      marker.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
        event.preventDefault();
        const next = (index + (event.key === "ArrowDown" ? 1 : -1) + markers.length) % markers.length;
        selectDiscipline(next);
        markers[next].focus();
      });
    });
    requestAnimationFrame(() => page?.classList.add("is-visible"));
    return () => {};
  }

  async function initGraph() {
    const loading = document.getElementById("graph-loading");
    try {
      if (!state.graphData) {
        const response = await fetch("assets/data/graph-data.json");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        state.graphData = await response.json();
      }
      if (state.route !== "graph") return;
      loading?.remove();
      state.graphController = createGraphController(state.graphData);
    } catch (error) {
      if (loading) loading.className = "graph-error";
      if (loading) loading.textContent = `图谱数据加载失败：${error.message}。请通过 start.bat 或本地 HTTP 服务器访问。`;
      console.error(error);
    }
  }

  function createGraphController(data) {
    const canvas = document.getElementById("graph-canvas");
    const detail = document.getElementById("graph-detail");
    const search = document.getElementById("graph-search");
    const results = document.getElementById("search-results");
    const legend = document.getElementById("graph-legend");
    const scope = document.getElementById("graph-scope");
    const layerFilters = document.getElementById("layer-filters");
    const typeFilters = document.getElementById("type-filters");
    const showOverview = document.getElementById("show-overview");
    const nodeById = new Map(data.nodes.map((node) => [node.id, node]));
    const edgesByNode = new Map();
    const componentNodeIds = new Map();
    data.nodes.forEach((node) => {
      const componentId = node.componentId || `component-${node.id}`;
      if (!componentNodeIds.has(componentId)) componentNodeIds.set(componentId, []);
      componentNodeIds.get(componentId).push(node.id);
    });
    data.edges.forEach((edge) => {
      if (!edgesByNode.has(edge.source)) edgesByNode.set(edge.source, []);
      if (!edgesByNode.has(edge.target)) edgesByNode.set(edge.target, []);
      edgesByNode.get(edge.source).push(edge);
      if (edge.target !== edge.source) edgesByNode.get(edge.target).push(edge);
    });

    const layerNames = Object.keys(data.stats.layerCounts);
    const typeNames = Object.keys(data.stats.nodeTypeCounts);
    const layerLabels = { academic: "学术", communication: "通信", dissemination: "传播", education: "教育", institutional: "机构", observation: "观测" };
    const typeLabels = { person: "人物", institution: "机构", role: "角色", work: "著作", concept: "概念", unknown: "事件" };
    const colors = { person: "#0b6672", institution: "#a57a41", role: "#6e7781", work: "#7c4f3b", concept: "#6f7543", unknown: "#adb2af" };
    const numberFormatter = new Intl.NumberFormat("zh-CN");
    const internalLabelPattern = /^(?:ENT|EVT|ROLE|WORK|CONCEPT|INST|CANON)-[A-Z0-9-]+$/i;

    function displayLabel(node) {
      const label = String(node?.label || "").trim();
      if (!label || internalLabelPattern.test(label)) return node?.entityType === "unknown" ? "未命名事件" : "未命名实体";
      return label;
    }

    const graph = {
      mode: "overview",
      focusIds: new Set(data.nodes.map((node) => node.id)),
      focusCenter: data.canonicalNodeId,
      selectedId: data.canonicalNodeId,
      selectedLayers: new Set(layerNames),
      selectedTypes: new Set(typeNames),
      positions: new Map(),
      transform: { x: 0, y: 0, scale: 1 },
      pointer: null,
      moved: false,
      draggingNode: null,
      destroyed: false,
    };
    let animationFrame = 0;

    layerFilters.insertAdjacentHTML("beforeend", layerNames.map((layer) => `<label class="check-row"><input type="checkbox" data-layer="${layer}" checked /><span>${layerLabels[layer] || "其他"} <small>${numberFormatter.format(data.stats.layerCounts[layer])}</small></span></label>`).join(""));
    typeFilters.insertAdjacentHTML("beforeend", typeNames.map((type) => `<label class="check-row"><input type="checkbox" data-type="${type}" checked /><span>${typeLabels[type] || "其他"} <small>${numberFormatter.format(data.stats.nodeTypeCounts[type])}</small></span></label>`).join(""));
    legend.innerHTML = typeNames.map((type) => `<span class="legend-item"><span class="legend-dot" style="--dot-color:${colors[type]}"></span>${typeLabels[type] || "其他"}</span>`).join("");

    function visibleNodes() {
      return Array.from(graph.focusIds).map((id) => nodeById.get(id)).filter((node) => node && graph.selectedTypes.has(node.entityType));
    }

    function visibleEdges(nodeIds) {
      return data.edges.filter((edge) => !edge.isSelfLoop && nodeIds.has(edge.source) && nodeIds.has(edge.target) && edge.layers.some((layer) => graph.selectedLayers.has(layer)));
    }

    function fitTransformToPositions() {
      if (!graph.positions.size) {
        graph.transform = { x: 0, y: 0, scale: 1 };
        return;
      }
      const rect = canvas.getBoundingClientRect();
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      graph.positions.forEach((position) => {
        minX = Math.min(minX, position.x); maxX = Math.max(maxX, position.x);
        minY = Math.min(minY, position.y); maxY = Math.max(maxY, position.y);
      });
      const spanX = Math.max(120, maxX - minX + 56);
      const spanY = Math.max(120, maxY - minY + 56);
      const sideInset = rect.width > 1180 ? 292 : rect.width > 900 ? 210 : 34;
      const availableWidth = Math.max(220, rect.width - sideInset * 2);
      const availableHeight = Math.max(220, rect.height - 96);
      const maximumScale = graph.mode === "overview" ? 1 : 1.35;
      const scale = Math.max(0.16, Math.min(maximumScale, availableWidth / spanX, availableHeight / spanY));
      graph.transform = {
        x: -((minX + maxX) / 2) * scale,
        y: -((minY + maxY) / 2) * scale,
        scale,
      };
    }

    function layoutOverview(nodes) {
      const components = new Map();
      nodes.forEach((node) => {
        const key = node.componentId || `component-${node.id}`;
        if (!components.has(key)) components.set(key, []);
        components.get(key).push(node);
      });
      const canonicalComponent = nodeById.get(data.canonicalNodeId)?.componentId;
      const orderedComponents = Array.from(components.entries()).sort((a, b) => {
        if (a[0] === canonicalComponent) return -1;
        if (b[0] === canonicalComponent) return 1;
        return b[1].length - a[1].length || a[0].localeCompare(b[0]);
      });
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      orderedComponents.forEach(([, componentNodes], componentIndex) => {
        componentNodes.sort((a, b) => b.degree - a.degree || displayLabel(a).localeCompare(displayLabel(b), "zh-CN"));
        const centerRadius = componentIndex === 0 ? 0 : 7.2 * Math.sqrt(componentIndex);
        const centerAngle = componentIndex * goldenAngle;
        const centerX = Math.cos(centerAngle) * centerRadius * 1.36;
        const centerY = Math.sin(centerAngle) * centerRadius * 0.82;
        const localRadius = Math.min(48, Math.max(3, Math.sqrt(componentNodes.length) * 2.5));
        componentNodes.forEach((node, nodeIndex) => {
          if (nodeIndex === 0) {
            graph.positions.set(node.id, { x: centerX, y: centerY });
            return;
          }
          const progress = Math.sqrt(nodeIndex / Math.max(1, componentNodes.length - 1));
          const angle = nodeIndex * goldenAngle + componentIndex * 0.17;
          graph.positions.set(node.id, {
            x: centerX + Math.cos(angle) * localRadius * progress,
            y: centerY + Math.sin(angle) * localRadius * progress,
          });
        });
      });
    }

    function layoutFocus(nodes) {
      const center = nodeById.get(graph.focusCenter) && graph.focusIds.has(graph.focusCenter) && graph.selectedTypes.has(nodeById.get(graph.focusCenter).entityType)
        ? graph.focusCenter
        : nodes[0]?.id;
      if (!center) return;
      graph.positions.set(center, { x: 0, y: 0 });
      const nodeIds = new Set(nodes.map((node) => node.id));
      const adjacency = new Map(nodes.map((node) => [node.id, new Set()]));
      visibleEdges(nodeIds).forEach((edge) => {
        adjacency.get(edge.source)?.add(edge.target);
        adjacency.get(edge.target)?.add(edge.source);
      });
      const distance = new Map([[center, 0]]);
      const queue = [center];
      while (queue.length) {
        const current = queue.shift();
        for (const next of adjacency.get(current) || []) {
          if (distance.has(next)) continue;
          distance.set(next, distance.get(current) + 1);
          queue.push(next);
        }
      }
      const furthestKnown = Math.max(0, ...distance.values());
      const rings = new Map();
      nodes.filter((node) => node.id !== center).forEach((node) => {
        const ring = distance.has(node.id) ? distance.get(node.id) : furthestKnown + 1;
        if (!rings.has(ring)) rings.set(ring, []);
        rings.get(ring).push(node);
      });
      rings.forEach((ringNodes, ring) => {
        ringNodes.sort((a, b) => b.degree - a.degree || displayLabel(a).localeCompare(displayLabel(b), "zh-CN") || a.id.localeCompare(b.id));
        const radius = 80 + ring * 76 + Math.sqrt(ringNodes.length) * 4;
        ringNodes.forEach((node, index) => {
          const angle = -Math.PI / 2 + index / ringNodes.length * Math.PI * 2 + ring * 0.31;
          graph.positions.set(node.id, { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
        });
      });
    }

    function layout() {
      graph.positions.clear();
      const nodes = visibleNodes();
      if (graph.mode === "overview") layoutOverview(nodes);
      else layoutFocus(nodes);
      fitTransformToPositions();
    }

    function worldToScreen(position, width, height) {
      return { x: width / 2 + graph.transform.x + position.x * graph.transform.scale, y: height / 2 + graph.transform.y + position.y * graph.transform.scale };
    }

    function drawCompass(ctx, width, height) {
      const centerX = width / 2, centerY = height / 2;
      const radius = Math.max(100, Math.min(width, height) * 0.4);
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.strokeStyle = "rgba(13,78,89,.12)";
      ctx.fillStyle = "rgba(13,78,89,.36)";
      ctx.lineWidth = 1;
      [0.34, 0.67, 1].forEach((ratio) => {
        ctx.beginPath(); ctx.arc(0, 0, radius * ratio, 0, Math.PI * 2); ctx.stroke();
      });
      for (let index = 0; index < 72; index += 1) {
        const angle = index / 72 * Math.PI * 2;
        const inner = radius * (index % 9 === 0 ? 0.86 : index % 3 === 0 ? 0.93 : 0.97);
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
        ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        ctx.stroke();
      }
      for (let index = 0; index < 8; index += 1) {
        const angle = index / 8 * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius); ctx.stroke();
      }
      ctx.font = "600 12px 'Noto Serif SC','Songti SC',serif";
      ctx.textAlign = "center";
      ctx.fillText("北", 0, -radius - 10);
      ctx.fillText("南", 0, radius + 18);
      ctx.fillText("西", -radius - 14, 4);
      ctx.fillText("东", radius + 14, 4);
      ctx.restore();
    }

    function draw() {
      if (graph.destroyed) return;
      const { context: ctx, width, height } = fitCanvas(canvas);
      ctx.clearRect(0, 0, width, height);
      drawCompass(ctx, width, height);
      const nodes = visibleNodes();
      const nodeIds = new Set(nodes.map((node) => node.id));
      const edges = visibleEdges(nodeIds);
      const scopeTitle = graph.mode === "overview" ? "全库关系全景" : "真实关系簇";
      const scopeDescription = `呈现 ${numberFormatter.format(nodes.length)} 个实体 · ${numberFormatter.format(edges.length)} 条关系`;
      if (scope && (scope.dataset.title !== scopeTitle || scope.dataset.description !== scopeDescription)) {
        scope.dataset.title = scopeTitle;
        scope.dataset.description = scopeDescription;
        scope.innerHTML = `<strong>${scopeTitle}</strong><span>${scopeDescription}</span>`;
      }
      ctx.strokeStyle = graph.mode === "overview" ? "rgba(13,78,89,.075)" : "rgba(74,91,91,.25)";
      ctx.lineWidth = graph.mode === "overview" ? 0.5 : Math.max(0.65, graph.transform.scale * 0.82);
      edges.forEach((edge) => {
        const a = graph.positions.get(edge.source), b = graph.positions.get(edge.target);
        if (!a || !b) return;
        const sa = worldToScreen(a, width, height), sb = worldToScreen(b, width, height);
        ctx.beginPath(); ctx.moveTo(sa.x, sa.y); ctx.lineTo(sb.x, sb.y); ctx.stroke();
      });
      nodes.sort((a, b) => a.id === graph.selectedId ? 1 : b.id === graph.selectedId ? -1 : a.degree - b.degree).forEach((node) => {
        const position = graph.positions.get(node.id);
        if (!position) return;
        const screen = worldToScreen(position, width, height);
        const selected = node.id === graph.selectedId;
        const canonical = node.id === data.canonicalNodeId;
        const radius = graph.mode === "overview"
          ? canonical ? 5.5 : selected ? 5 : Math.min(2.45, 0.72 + Math.sqrt(node.degree || 0) * 0.1)
          : canonical ? 14 : selected ? 11 : Math.min(9, 4.2 + Math.sqrt(node.degree || 0) * 0.42);
        ctx.fillStyle = colors[node.entityType] || colors.unknown;
        ctx.strokeStyle = selected ? "#741a16" : graph.mode === "overview" ? "rgba(255,253,248,.55)" : "rgba(255,253,248,.92)";
        ctx.lineWidth = selected ? (graph.mode === "overview" ? 2 : 3.5) : graph.mode === "overview" ? 0.5 : 1.7;
        ctx.beginPath(); ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        const showLabel = canonical || selected || (graph.mode === "focus" && (nodes.length <= 80 || graph.transform.scale >= 1.15 || node.degree > 28)) || (graph.mode === "overview" && graph.transform.scale >= 2.2 && node.degree > 16);
        if (showLabel) {
          ctx.font = `${canonical || selected ? "700 " : ""}${canonical ? 15 : 12}px 'Noto Serif SC','Songti SC',serif`;
          ctx.fillStyle = "#172124";
          ctx.textAlign = "center";
          const fullLabel = displayLabel(node);
          const label = fullLabel.length > 12 ? `${fullLabel.slice(0, 11)}…` : fullLabel;
          ctx.fillText(label, screen.x, screen.y + radius + 16);
        }
      });
      if (!nodes.length) {
        ctx.fillStyle = "#667678"; ctx.font = "16px 'Noto Serif SC','Songti SC',serif"; ctx.textAlign = "center";
        ctx.fillText("当前筛选条件下没有可见节点", width / 2, height / 2);
      }
    }

    function scheduleDraw() {
      if (animationFrame || graph.destroyed) return;
      animationFrame = requestAnimationFrame(() => {
        animationFrame = 0;
        draw();
      });
    }

    function nodeAt(x, y) {
      const rect = canvas.getBoundingClientRect();
      const nodes = visibleNodes();
      for (let index = nodes.length - 1; index >= 0; index -= 1) {
        const node = nodes[index], position = graph.positions.get(node.id);
        if (!position) continue;
        const screen = worldToScreen(position, rect.width, rect.height);
        if (Math.hypot(screen.x - x, screen.y - y) <= (graph.mode === "overview" ? 9 : 18)) return node;
      }
      return null;
    }

    function showEvidence(edge) {
      const evidence = document.getElementById("evidence-detail");
      if (!evidence) return;
      const sourceCount = (edge.evidenceLinkIds?.length || 0) + (edge.passageIds?.length || 0);
      evidence.innerHTML = `
        <div class="evidence-box">
          <strong>关系说明</strong>
          <span>关系：${escapeHTML(predicateLabel(edge.predicate))}</span>
          <span>类别：${edge.layers.map((layer) => escapeHTML(layerLabels[layer] || "其他")).join(" / ")}</span>
          <span>时间：${escapeHTML(edge.rawStart || "未标注")} — ${escapeHTML(edge.rawEnd || "未标注")}</span>
          ${sourceCount ? `<span>相关资料：${numberFormatter.format(sourceCount)} 条</span>` : ""}
        </div>`;
    }

    function predicateLabel(value) {
      const labels = {
        held_role_at: "任职于", held_role: "担任角色", authored: "著作", studied_at: "就读于",
        teacher_of: "指导", student_of: "师从", participated_in: "参与", influenced_by: "受其影响",
        collaborated_with: "合作", communicated_with: "通信", organized: "组织", advised: "建议",
        published_by: "出版于", presented_at: "发表于", cited: "引用", co_present: "共同出现",
        reported_observation_to: "提交观测", recorded_in: "记录于",
      };
      return labels[value] || "其他关系";
    }

    function focusAround(nodeId) {
      const node = nodeById.get(nodeId);
      if (!node) return;
      const componentIds = componentNodeIds.get(node.componentId || `component-${node.id}`) || [nodeId];
      graph.mode = "focus";
      graph.focusIds = new Set(componentIds);
      graph.focusCenter = nodeId;
      layout();
      selectNode(nodeId);
    }

    function selectNode(nodeId) {
      graph.selectedId = nodeId;
      const node = nodeById.get(nodeId);
      if (!node) return;
      const allRelations = (edgesByNode.get(nodeId) || []).filter((edge) => !edge.isSelfLoop).slice().sort((a, b) => a.predicate.localeCompare(b.predicate));
      const relations = allRelations.slice(0, 18);
      detail.innerHTML = `
        <div class="detail-heading"><div><p>当前实体</p><h2 class="detail-title">${escapeHTML(displayLabel(node))}</h2></div><button class="detail-focus-button" type="button">展开此节点</button></div>
        <div class="detail-grid">
          <div class="detail-chip"><strong>实体类型</strong>${typeLabels[node.entityType] || "其他"}</div>
          <div class="detail-chip"><strong>直接关系</strong>${numberFormatter.format(allRelations.length)} 条</div>
          <div class="detail-chip detail-chip-wide"><strong>所在关系簇</strong>共 ${numberFormatter.format(node.componentSize || 1)} 个实体</div>
        </div>
        <h2>相关关系${relations.length ? `（${numberFormatter.format(relations.length)}）` : ""}</h2>
        <div class="relation-list">
          ${relations.length ? relations.map((edge, index) => {
            const otherId = edge.source === nodeId ? edge.target : edge.source;
            const other = nodeById.get(otherId);
            return `<button class="relation-button" type="button" data-relation="${index}"><strong>${escapeHTML(predicateLabel(edge.predicate))} · ${escapeHTML(displayLabel(other))}</strong><small>${edge.layers.map((layer) => layerLabels[layer] || "其他").join(" / ")}</small></button>`;
          }).join("") : '<p class="detail-empty">当前节点没有可显示的关系。</p>'}
        </div>
        <div id="evidence-detail"></div>`;
      detail.querySelector(".detail-focus-button")?.addEventListener("click", () => focusAround(nodeId));
      detail.querySelectorAll("[data-relation]").forEach((button) => {
        button.addEventListener("click", () => showEvidence(relations[Number(button.dataset.relation)]));
      });
      scheduleDraw();
    }

    function resetOverview() {
      graph.mode = "overview";
      graph.focusIds = new Set(data.nodes.map((node) => node.id));
      graph.focusCenter = data.canonicalNodeId;
      layout();
      selectNode(data.canonicalNodeId);
    }

    search.addEventListener("input", () => {
      const query = search.value.trim().toLocaleLowerCase("zh-CN");
      if (!query) { results.innerHTML = ""; return; }
      const matches = data.nodes.filter((node) => {
        const label = String(node.label || "").trim();
        return label && !internalLabelPattern.test(label) && label.toLocaleLowerCase("zh-CN").includes(query);
      }).sort((a, b) => b.degree - a.degree || displayLabel(a).localeCompare(displayLabel(b), "zh-CN")).slice(0, 20);
      results.innerHTML = matches.length ? matches.map((node) => `<li class="search-result"><button type="button" data-node-id="${node.id}"><strong>${escapeHTML(displayLabel(node))}</strong><small>${typeLabels[node.entityType] || "其他"} · ${numberFormatter.format((edgesByNode.get(node.id) || []).filter((edge) => !edge.isSelfLoop).length)} 条关系</small></button></li>`).join("") : '<li class="detail-empty">没有匹配实体</li>';
    });
    results.addEventListener("click", (event) => {
      const button = event.target.closest("[data-node-id]");
      if (!button) return;
      focusAround(button.dataset.nodeId);
      results.innerHTML = "";
    });

    layerFilters.addEventListener("change", (event) => {
      const input = event.target.closest("[data-layer]");
      if (!input) return;
      input.checked ? graph.selectedLayers.add(input.dataset.layer) : graph.selectedLayers.delete(input.dataset.layer);
      layout(); scheduleDraw();
    });
    typeFilters.addEventListener("change", (event) => {
      const input = event.target.closest("[data-type]");
      if (!input) return;
      input.checked ? graph.selectedTypes.add(input.dataset.type) : graph.selectedTypes.delete(input.dataset.type);
      layout(); scheduleDraw();
    });
    showOverview.addEventListener("click", resetOverview);
    document.getElementById("show-default").addEventListener("click", () => focusAround(data.canonicalNodeId));
    document.querySelectorAll("[data-graph-action]").forEach((button) => button.addEventListener("click", () => {
      const action = button.dataset.graphAction;
      if (action === "zoom-in") graph.transform.scale = Math.min(5, graph.transform.scale * 1.22);
      if (action === "zoom-out") graph.transform.scale = Math.max(0.14, graph.transform.scale / 1.22);
      if (action === "reset") fitTransformToPositions();
      scheduleDraw();
    }));

    canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const pointerX = event.clientX - rect.left - rect.width / 2;
      const pointerY = event.clientY - rect.top - rect.height / 2;
      const previousScale = graph.transform.scale;
      const nextScale = Math.max(0.14, Math.min(5, previousScale * (event.deltaY < 0 ? 1.12 : 0.89)));
      const ratio = nextScale / previousScale;
      graph.transform.x = pointerX - (pointerX - graph.transform.x) * ratio;
      graph.transform.y = pointerY - (pointerY - graph.transform.y) * ratio;
      graph.transform.scale = nextScale;
      scheduleDraw();
    }, { passive: false });

    canvas.addEventListener("pointerdown", (event) => {
      canvas.setPointerCapture(event.pointerId);
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left, y = event.clientY - rect.top;
      graph.pointer = { x, y };
      graph.moved = false;
      graph.draggingNode = nodeAt(x, y)?.id || null;
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!graph.pointer) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left, y = event.clientY - rect.top;
      const dx = x - graph.pointer.x, dy = y - graph.pointer.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) graph.moved = true;
      if (graph.draggingNode) {
        const position = graph.positions.get(graph.draggingNode);
        if (position) { position.x += dx / graph.transform.scale; position.y += dy / graph.transform.scale; }
      } else {
        graph.transform.x += dx; graph.transform.y += dy;
      }
      graph.pointer = { x, y };
      scheduleDraw();
    });
    canvas.addEventListener("pointerup", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left, y = event.clientY - rect.top;
      if (!graph.moved) {
        const node = nodeAt(x, y);
        if (node) selectNode(node.id);
      }
      graph.pointer = null; graph.draggingNode = null;
    });
    canvas.addEventListener("dblclick", (event) => {
      const rect = canvas.getBoundingClientRect();
      const node = nodeAt(event.clientX - rect.left, event.clientY - rect.top);
      if (node) focusAround(node.id);
    });
    canvas.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && graph.selectedId) focusAround(graph.selectedId);
      if (event.key === "Home") resetOverview();
    });

    const resizeObserver = new ResizeObserver(() => {
      if (graph.destroyed) return;
      layout();
      scheduleDraw();
    });
    resizeObserver.observe(canvas.parentElement);
    layout();
    selectNode(data.canonicalNodeId);
    scheduleDraw();
    return { destroy() { graph.destroyed = true; resizeObserver.disconnect(); if (animationFrame) cancelAnimationFrame(animationFrame); } };
  }

  window.addEventListener("hashchange", render);
  if (!location.hash || !ROUTES[routeFromHash()]) location.hash = "#/home";
  else render();
})();
