import gsap from "gsap";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import a1 from "./assets/a1.png";
import a2 from "./assets/a2.png";
import a3 from "./assets/a3.png";
import AnimatedBackground from "./components/AnimatedBackground";
import ChinaMap from "./components/ChinaMap";
import PerformanceIndicator from "./components/PerformanceIndicator";
import SidePanel from "./components/SidePanel";
import type { Poem } from "./types";
import { usePrevious } from "./utils";
import {
  getAnimationDuration,
  getParticleCount,
  performanceManager,
  shouldEnableFeature,
} from "./utils/performance";

const POEMS: Poem[] = [
  {
    id: "xue",
    title: "沁园春·雪",
    place: "陕西省 榆林市 清涧县 高杰村镇 袁家沟村",
    year: "1936",
    coords: [110, 37.164619609513736],
    excerpt: [
      "北国风光，千里冰封，万里雪飘。望长城内外，惟余莽莽；大河上下，顿失滔滔。山舞银蛇，原驰蜡象，欲与天公试比高。",
      "须晴日，看红装素裹，分外妖娆。",
      "江山如此多娇，引无数英雄竞折腰。惜秦皇汉武，略输文采；唐宗宋祖，稍逊风骚。一代天骄，成吉思汗，只识弯弓射大雕。",
      "俱往矣，数风流人物，还看今朝。",
    ],
    images: [a1, a2, a3],
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
    images: [],
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
    images: [],
  },
];

export default function App() {
  const [selected, setSelected] = useState<Poem | null>(null);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const prevPage = usePrevious(page);
  const el1 = useRef<HTMLDivElement>(null);
  const el2 = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  // 页面加载动画
  useEffect(() => {
    // 应用性能优化
    performanceManager.applyPerformanceCSS();
    performanceManager.startPerformanceMonitoring();

    const timer = setTimeout(
      () => {
        // 淡出加载屏幕
        gsap.to(loadingRef.current, {
          duration: getAnimationDuration(1.5),
          opacity: 0,
          y: shouldEnableFeature("enableComplexAnimations") ? -50 : -20,
          scale: shouldEnableFeature("enableComplexAnimations") ? 0.95 : 0.98,
          ease: "power3.out",
          onComplete: () => {
            setIsLoading(false);
            // 地图元素进入动画
            gsap.fromTo(
              el1.current,
              {
                opacity: 0,
                scale: 1.05,
                filter: shouldEnableFeature("enableBlur")
                  ? "blur(10px)"
                  : "none",
              },
              {
                duration: getAnimationDuration(2),
                opacity: 1,
                scale: 1,
                filter: "none",
                ease: "power3.out",
              },
            );
          },
        });
      },
      shouldEnableFeature("enableComplexAnimations") ? 2000 : 1000,
    );

    // 加载屏幕标题动画
    // 页面加载动画（简化）
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      {
        duration: 0.8,
        opacity: 1,
        y: 0,
        ease: "power2.out",
        delay: 0.3,
      },
    );

    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 15 },
      {
        duration: 0.6,
        opacity: 1,
        y: 0,
        ease: "power2.out",
        delay: 0.8,
      },
    );

    return () => clearTimeout(timer);
  }, []);

  async function explore() {
    if (!selected) return;

    // 地图缩放和淡出（自适应）
    await gsap.to(el1.current, {
      duration: getAnimationDuration(0.8),
      opacity: 0,
      pointerEvents: "none",
      scale: shouldEnableFeature("enableComplexAnimations") ? 1.2 : 1.05,
      ease: "power2.out",
    });

    // 图片展示淡入（自适应）
    await gsap.fromTo(
      el2.current,
      {
        opacity: 0,
        scale: shouldEnableFeature("enableComplexAnimations") ? 0.9 : 0.95,
      },
      {
        duration: getAnimationDuration(1),
        opacity: 1,
        scale: 1,
        pointerEvents: "auto",
        ease: "power2.out",
      },
    );
  }

  async function back() {
    // 图片展示淡出（自适应）
    await gsap.to(el2.current, {
      duration: getAnimationDuration(0.6),
      opacity: 0,
      pointerEvents: "none",
      scale: shouldEnableFeature("enableComplexAnimations") ? 0.95 : 0.98,
      ease: "power2.out",
    });

    // 地图重新进入（自适应）
    await gsap.fromTo(
      el1.current,
      { scale: shouldEnableFeature("enableComplexAnimations") ? 1.1 : 1.02 },
      {
        duration: getAnimationDuration(0.8),
        opacity: 1,
        pointerEvents: "auto",
        scale: 1,
        ease: "power2.out",
      },
    );
    setPage(0);
    setSelected(null);
  }

  useEffect(() => {
    (async () => {
      const isBack = page < prevPage;
      // 两个元素的类型都得是img标签
      if (el2.current?.children[page].tagName !== "IMG") {
        console.error("Expected children to be img elements");
        return;
      }
      if (el2.current?.children[prevPage]?.tagName !== "IMG") {
        console.error("Expected previous children to be img elements");
        return;
      }

      // 自适应图片切换动画
      gsap.to(el2.current?.children[prevPage] ?? "", {
        duration: getAnimationDuration(0.4),
        opacity: 0,
        x: shouldEnableFeature("enableComplexAnimations")
          ? isBack
            ? "20%"
            : "-20%"
          : "0%",
        ease: "power2.out",
      });

      gsap.fromTo(
        el2.current?.children[page] ?? "",
        {
          opacity: 0,
          x: shouldEnableFeature("enableComplexAnimations")
            ? isBack
              ? "-25%"
              : "25%"
            : "0%",
        },
        {
          duration: getAnimationDuration(0.6),
          opacity: 1,
          x: "0%",
          ease: "power2.out",
          delay: getAnimationDuration(0.2),
        },
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selected]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-800 text-white">
      {/* 性能指示器 */}
      <PerformanceIndicator />

      {/* 动画背景 */}
      {shouldEnableFeature("enableComplexAnimations") && <AnimatedBackground />}

      {/* 加载屏幕 */}
      {isLoading && (
        <div
          ref={loadingRef}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-black to-blue-900"
        >
          {/* 背景动态粒子（自适应数量） */}
          {shouldEnableFeature("enableParticles") && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(getParticleCount(8))].map((_, i) => (
                <div
                  key={i}
                  className="particle absolute w-1 h-1 bg-white/15 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
          )}

          <div
            ref={titleRef}
            className="text-7xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent text-center px-4"
          >
            诗笔烽烟
          </div>
          <div
            ref={subtitleRef}
            className="text-4xl text-white/70 text-center max-w-2xl px-4"
          >
            毛主席诗词中的历史回响
          </div>

          {/* 加载动画（简化） */}
          <div className="mt-8 flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white/50 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>
      )}

      <div
        className="absolute h-full w-full overflow-hidden opacity-0 pointer-events-auto"
        ref={el1}
      >
        {/* 地图：卫星影像为底，省级边界与省名标签，三首诗的标记 */}
        <ChinaMap poems={POEMS} onSelect={(p) => setSelected(p)} />

        {/* 静态渐变背景 */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 via-black/15 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />

        {/* 左侧毛玻璃信息面板 */}
        <SidePanel
          open={!!selected}
          poem={selected}
          onClose={() => setSelected(null)}
          onExplore={explore}
        />

        {/* 左下角说明 */}
        <div className="z-10 pointer-events-none absolute bottom-3 left-3 text-white bg-black/40 backdrop-blur-xl flex flex-col gap-0.5 py-3 px-4 rounded-2xl text-xs border border-white/10 shadow-2xl transition-all duration-300 hover:bg-black/50">
          <p className="text-white/90">LXGW WenKai: OFL-1.1</p>
          <p className="text-white/90">地理数据来源: geojson.cn</p>
          <p className="text-white/90">MIT License / CC BY-SA 4.0</p>
          <p className="text-white font-medium">
            初二20班 罐装知识语文学习小队
          </p>
        </div>
      </div>

      <div
        className="absolute h-full w-full overflow-hidden opacity-0 pointer-events-none"
        ref={el2}
      >
        {selected?.images.map((img, index) => (
          <img
            key={index}
            src={img}
            className="w-full h-full object-cover absolute inset-0 opacity-0 transition-all duration-500"
          />
        ))}

        {/* 图片展示模式的控制按钮 */}
        <div className="flex absolute top-8 left-8 right-8 gap-4 z-20">
          <div
            className="group backdrop-blur-lg bg-black/20 border-2 border-white/30 rounded-full p-4 hover:bg-black/40 hover:border-white/50 active:scale-95 transition-all duration-300 cursor-pointer shadow-2xl"
            onClick={back}
          >
            <ArrowLeft className="w-6 h-6 text-white group-hover:text-blue-200 transition-colors" />
          </div>
          <div className="flex-1" />
          <div
            className="group backdrop-blur-lg bg-black/20 border-2 border-white/30 rounded-full p-4 hover:bg-black/40 hover:border-white/50 active:scale-95 transition-all duration-300 cursor-pointer shadow-2xl"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:text-blue-200 transition-colors" />
          </div>
          <div
            className="group backdrop-blur-lg bg-black/20 border-2 border-white/30 rounded-full p-4 hover:bg-black/40 hover:border-white/50 active:scale-95 transition-all duration-300 cursor-pointer shadow-2xl"
            onClick={() =>
              setPage((p) =>
                Math.min((selected?.images.length || 1) - 1, p + 1),
              )
            }
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:text-blue-200 transition-colors" />
          </div>
        </div>

        {/* 图片指示器 */}
        {selected?.images && selected.images.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {selected.images.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  index === page
                    ? "bg-white shadow-lg scale-125"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                onClick={() => setPage(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
