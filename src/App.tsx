import { useState } from "react";
import ChinaMap from "./components/ChinaMap";
import SidePanel from "./components/SidePanel";
import type { Poem } from "./types";

const POEMS: Poem[] = [
  {
    id: "xue",
    title: "沁园春·雪",
    place: "陕西省 榆林市 清涧县 高杰村镇 袁家沟村",
    year: "1936",
    coords: [110.47229665132853, 37.164619609513736],
    excerpt: [
      "北国风光，千里冰封，万里雪飘。望长城内外，惟余莽莽；大河上下，顿失滔滔。山舞银蛇，原驰蜡象，欲与天公试比高。",
      "须晴日，看红装素裹，分外妖娆。",
      "江山如此多娇，引无数英雄竞折腰。惜秦皇汉武，略输文采；唐宗宋祖，稍逊风骚。一代天骄，成吉思汗，只识弯弓射大雕。",
      "俱往矣，数风流人物，还看今朝。",
    ],
  },
  {
    id: "changsha",
    title: "沁园春·长沙",
    place: "湖南省 长沙市 岳麓区 橘子洲",
    year: "1925",
    coords: [112.9631774515373, 28.196750113076657],
    excerpt: [
      "独立寒秋，湘江北去，橘子洲头。看万山红遍，层林尽染；漫江碧透，百舸争流。鹰击长空，鱼翔浅底，万类霜天竞自由。",
      "怅寥廓，问苍茫大地，谁主沉浮？",
      "携来百侣曾游，忆往昔峥嵘岁月稠。恰同学少年，风华正茂；书生意气，挥斥方遒。指点江山，激扬文字，粪土当年万户侯。",
      "曾记否，到中流击水，浪遏飞舟？",
    ],
  },
  {
    id: "chongyang",
    title: "采桑子·重阳",
    place: "福建省 龙岩市 上杭县 临江楼",
    year: "1929",
    coords: [116.41667266787833, 25.04728125570103],
    excerpt: [
      "人生易老天难老，岁岁重阳。今又重阳，战地黄花分外香。",
      "一年一度秋风劲，不似春光。胜似春光，寥廓江天万里霜。",
    ],
  },
];

export default function App() {
  const [selected, setSelected] = useState<Poem | null>(null);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white">
      {/* 地图：卫星影像为底，省级边界与省名标签，三首诗的标记 */}
      <ChinaMap poems={POEMS} onSelect={(p) => setSelected(p)} />

      {/* 顶部渐变，提升对比度 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />

      {/* 左侧毛玻璃信息面板 */}
      <SidePanel
        open={!!selected}
        poem={selected}
        onClose={() => setSelected(null)}
      />

      {/* 左下角说明 */}
      <div className="z-10 pointer-events-none absolute bottom-3 left-3 text-white bg-black/35 backdrop-blur-md flex flex-col gap-0.5 py-2 px-3 rounded-xl text-xs">
        <p>LXGW WenKai: OFL-1.1</p>
        <p>地理数据来源: geojson.cn</p>
        <p>MIT License / CC BY-SA 4.0</p>
        <p>初二20班 罐装知识语文学习小队</p>
      </div>
    </div>
  );
}
