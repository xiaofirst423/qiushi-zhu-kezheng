# 生平叙事与地图数据来源

检索与下载日期：2026-08-10。

## 中国行政区边界

- 文件：`assets/data/china-provinces.geojson`
- 来源：阿里云 DataV GeoAtlas，`https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json`
- 原始格式：GeoJSON `FeatureCollection`，35 个要素，582,522 字节。
- 坐标约定：经纬度输入按 WGS84（EPSG:4326）处理；网页显示采用 Albers 等积圆锥投影，标准纬线 25°N / 47°N、中央经线 105°E。
- 用途：仅作为中国地图底图和省级边界，不参与距离或面积计算。

## 生平地点

| 地点 | 经度 | 纬度 | 史料与坐标来源 |
|---|---:|---:|---|
| 东关（今绍兴上虞） | 120.814074 | 30.011658 | [浙江大学校史研究](https://zdjy.zju.edu.cn/review/toReview?dbID=23&dbName=ZHEJIANGDAXUEBAO&sysID=33179)；OSM relation 19137547 |
| 上海·澄衷学堂 | 121.462540 | 31.290536 | [上海虹口区政府](https://www.shhk.gov.cn/xwzx/002008/002008040/20230918/7ae8e8d1-0a39-437c-8c9f-9d3d0ce8859e.html)；OSM way 1008189198 |
| 唐山·路矿学堂旧址 | 118.181283 | 39.603012 | [西南交通大学档案馆](https://dag.swjtu.edu.cn/info/1151/3361.htm)；OSM node 8240235798 |
| 武昌·东厂口旧校址附近 | 114.300669 | 30.541944 | [湖北省文化和旅游厅](https://wlt.hubei.gov.cn/bmdt/ztzl/zshb/201912/t20191226_1799441.shtml)；OSM node 1215740609 |
| 南京·四牌楼/北极阁 | 118.788282 | 32.057648 | [南京大学档案馆](https://dawww.nju.edu.cn/xswh/ndxs/zydx/njgdszll.htm)；[中科院大气物理研究所](https://iap.cas.cn/qt/zthd/sq/lc/201811/t20181107_5166363.html) |
| 天津·南开大学 | 117.162231 | 39.103570 | [南京大学](https://www.nju.edu.cn/info/3891/406851.htm)；[南开大学](https://aiguo.nankai.edu.cn/lsyg/list.htm) |
| 杭州 | 120.205234 | 30.248963 | [浙江大学档案馆](https://acv.zju.edu.cn/site/ztby_dsj_view.html?year=1936)；[浙大西迁史](https://www.zju.edu.cn/2009/0629/c32862a61670/pagem.htm) |
| 北京 | 116.391297 | 39.905714 | [中国科学院](https://www.cas.cn/zt/rwzt/jnzkz/jnzkzwj/201003/t20100325_2807187.shtml) |

留美阶段不再以哈尔滨作为替代地点。中国地图只显示 1910 年自上海启程，并以边注说明伊利诺伊大学和哈佛大学；两校 WGS84 坐标分别为 `-88.223313, 40.076155` 与 `-71.116716, 42.374090`。

## 生平阶段、引语与学术方向

- 阶段划分主要依据：[中国科学院地理资源所生平资料](https://www.igsnrr.cas.cn/cbkx/kpyd/dlxj/202009/t20200910_5692697.html)、[南京大学档案馆](https://dawww.nju.edu.cn/xswh/ndxs/zydx/njgdszll.htm)、[浙江大学档案馆](https://acv.zju.edu.cn/site/ztby_dsj_view.html?year=1936) 与 [中国科学院生平简介](https://www.cas.cn/zt/rwzt/jnzkz/zkzjj/zkjjjwz/201003/t20100326_2807834.shtml)。
- “1928—1949 浙江大学时期”已拆分为“1928—1936 建所与观测”和“1936—1949 掌校与西迁”。
- 原页面无来源的阶段投入值 `18/34/48/72/84/96` 已删除，改为有日期的关键事件。
- 原页面六条无出处引语已删除。现用“排万难，冒百死，以求真知”，来源为竺可桢 1939 年 2 月 4 日演讲《求是精神与牺牲精神》，正文见[中国科学院](https://www.bjb.cas.cn/tbzt2016/dnzt/sd/jdwz/202007/t20200704_5618050.html)。
- 五个学术方向依据中国科学院生平简介核对；“综合地理”改为更明确的“自然地理与综合考察”。

## 人物肖像

- 文件：`assets/visuals/zhu-archive-portrait.jpg`
- 页面来源：[浙江大学档案馆《竺可桢日记》手稿入选中国档案文献遗产名录](https://acv.zju.edu.cn/site/bgxw_view.html?id=1603)
- 原图接口：`https://acv.zju.edu.cn/site/publicmodules/topic/tinymcefileload.bin?id=181`
- SHA-256：`00099965BAD09DF4D17C224A5C650F90A131BA32CDCA789ABA307258CFA46854`

当前项目仍为本地研究展示。行政区数据、档案肖像与机构网页内容在公开部署或传播前，应分别完成许可、署名和使用范围复核。
