import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import a1 from "./assets/a1.png";
import a2 from "./assets/a2.png";
import a3 from "./assets/a3.png";
import a4 from "./assets/a4.jpg";
import b1 from "./assets/b1.png";
import b2 from "./assets/b2.png";
import b3 from "./assets/b3.png";
import b4 from "./assets/b4.png";
import c1 from "./assets/c1.png";
import c2 from "./assets/c2.png";
import c3 from "./assets/c3.png";
import c4 from "./assets/c4.png";
import qbyriyihuaAudio from "./assets/沁园春长沙.m4a";
import qbyriyxtAudio from "./assets/沁园春雪.m4a";
import cdshziisyhAudio from "./assets/采桑子重阳.m4a";
import AnimatedBackground from "./components/AnimatedBackground";
import ChinaMap from "./components/ChinaMap";
import PerformanceIndicator from "./components/PerformanceIndicator";
import SidePanel from "./components/SidePanel";
import { TypewriterText } from "./components/TypewriterText";
import type { Poem } from "./types";
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
    audio: qbyriyihuaAudio,
    analysis: [
      {
        title: "写作手法解析",
        content:
          '"千里冰封，万里雪飘"起笔，以泼墨般的豪情巨笔勾勒出北国严冬的雄浑画卷。"山舞银蛇，原驰蜡象"化静为动，赋予沉睡大地以奔腾不息的生命伟力，暗喻着古老民族在革命风暴中焕发的蓬勃生机。"欲与天公试比高"一句，是革命者挑战一切压迫、开创崭新世界的豪迈宣言。下阕纵论千古帝王，"惜"、"略输"、"稍逊"、"只识"等词，举重若轻，在历史评判中彰显无产阶级革命者超越前贤的雄阔气魄。"俱往矣"三字如雷霆扫荡，将历史烟云一笔收尽，终句"数风流人物，还看今朝"的论断，石破天惊，将人民推上创造历史的中心舞台。',
        image: a1,
      },
      {
        title: "历史背景钩沉",
        content:
          '1936年2月，毛泽东率红军东征抗日，行军至陕北清涧县袁家沟。此时，中央红军历经万里长征，胜利抵达陕北，但民族危亡迫在眉睫，蒋介石仍坚持"攘外必先安内"。词作于大雪纷飞之时，面对壮丽河山和深重国难，革命领袖以吞吐山河的胸襟，既抒发了保卫祖国大好河山的坚定意志，更宣示了中国共产党及其领导下的抗日军民才是挽救民族危亡、开辟历史新篇的"今朝"风流人物。此词1945年重庆谈判时发表，震动山城，极大鼓舞了全国人民争取民主进步的斗志。',
        image: a2,
      },
      {
        title: "红色精神内核",
        content:
          '"数风流人物，还看今朝"是全词灵魂所在。它彻底颠覆了英雄史观，宣告了历史的真正创造者是千百万觉醒和正在觉醒的人民群众，是领导人民进行伟大斗争的中国共产党及其所代表的无产阶级先锋队。词中对秦皇汉武等封建帝王的评点，体现了历史唯物主义精神，深刻指出只有代表最广大人民根本利益、致力于民族解放和社会进步的力量，才是推动历史车轮向前的真正动力。这磅礴之语，是人民力量最雄辩的肯定，是革命必胜信念的最强音。',
        image: a3,
      },
      {
        title: "现代传承之思",
        content:
          '理解"人民是历史的创造者"这一真谛至关重要。可结合脱贫攻坚、抗击疫情等伟大实践，让学生真切感受"今朝风流人物"就在亿万普通奋斗者之中。寻找身边的"今朝风流人物"，社区建设者、科技工作者、文化传承人，理解平凡岗位上的不凡贡献。对比古今"英雄观"的流变，深化对"人民至上"理念的认同。将个人理想融入时代洪流，立志成为推动社会进步的"今朝"一份子。',
        image: a4,
      },
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
    audio: qbyriyxtAudio,
    analysis: [
      {
        title: "写作手法解析",
        content:
          '开篇"独立寒秋"四字，立体化的勾勒出青年革命者顶天立地的形象。"万山红遍，层林尽染"的壮丽秋日景色，并非单纯写景，而是革命洪流风起云涌的象征。"鹰击长空，鱼翔浅底"以动写静，暗示万物在激烈的革命斗争中争求解放。"问苍茫大地，谁主沉浮？"这惊天一问，将个人思索陡然升华为对民族命运的叩问，极具思想张力。"指点江山，激扬文字"等句，以豪迈笔触刻画了青年知识分子改造世界的锐气。"浪遏飞舟"的想象，更是革命者无畏激流的壮志豪情的澎湃外化。',
        image: b1,
      },
      {
        title: "历史背景钩沉",
        content:
          '此词作于1925年深秋。彼时，"五卅运动"掀起的反帝浪潮席卷全国，国共合作下的农民运动在湖南亦风起云涌。青年毛泽东重返长沙，面对军阀割据、民生凋敝的黑暗现实，目睹工农觉醒的磅礴力量。橘子洲头的独立凝思，正是革命风暴来临前夕的深沉蓄势。词中"百侣曾游"、"峥嵘岁月"所指，正是其早期在湖南一师求学及组织新民学会的革命实践，那些"挥斥方遒"、"粪土万户侯"的豪情岁月，为日后投身革命洪流奠定了坚实的精神基石。',
        image: b2,
      },
      {
        title: "红色精神内核",
        content:
          '"问苍茫大地，谁主沉浮？"这声时代之问，如闪电般劈开黑暗，直指核心——历史变革的主体力量何在？它强烈呼唤着觉醒的无产阶级及其先锋队肩负起"主沉浮"的千钧重担。词中对"同学少年"战斗情谊的追忆，对"中流击水"奋斗姿态的赞美，生动体现了革命者依靠集体力量、敢于斗争、勇于献身的崇高品质。这激荡着青春热血的词章，是投向旧世界的檄文，更是召唤一代代青年为理想不懈奋斗的号角。',
        image: b3,
      },
      {
        title: "现代传承之思",
        content:
          '今体味"谁主沉浮"的历史叩问，正是为了激发青少年"天下兴亡，匹夫有责"的担当意识。诵读词章，感悟革命先辈的青春抉择；可结合"大国工匠"、"科研先锋"等新时代奋斗者事迹，诠释"浪遏飞舟"精神在科技攻坚、乡村振兴等领域的延续。',
        image: b4,
      },
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
    audio: cdshziisyhAudio,
    analysis: [
      {
        title: "写作手法解析",
        content:
          '"人生易老天难老"，以朴素哲理直击人心，在宇宙永恒与人生短暂的对照中，引出深沉的生命之思。"岁岁重阳，今又重阳"的回环往复，在时间流逝的咏叹中，暗含对革命征程的坚守。"战地黄花分外香"是神来之笔，将肃杀的战场、萧瑟的秋景与绽放的野菊并置，"分外香"三字以强烈的主观感受，赋予残酷环境以昂扬的诗意，是革命乐观主义精神的璀璨结晶。下阕"不似春光。胜似春光"的转折，更以辩证之眼，在秋风劲烈、霜天寥廓中发现了超越传统春光的壮美，凸显了革命者特有的精神境界和审美情操。',
        image: c1,
      },
      {
        title: "历史背景钩沉",
        content:
          '1929年10月，毛泽东在上杭县苏家坡养病，并指导地方工作。此前的红四军第七次代表大会上，他的正确主张未被多数同志理解，落选前委书记，加之身患疟疾，处境艰难。时值重阳佳节，闽西山区硝烟未散，野菊傲霜怒放。这首词便是在个人境遇坎坷、革命事业遭遇挫折的背景下写成。然而，字里行间毫无消沉颓唐，"战地黄花分外香"、"胜似春光"的吟唱，展现了一位真正的革命者在逆境中不改其志、愈挫愈勇的博大胸襟和对革命前途的坚定信念。',
        image: c2,
      },
      {
        title: "红色精神内核",
        content:
          '"战地黄花分外香"是此词精神内核的集中爆发。它超越了个人荣辱得失，将个体的生命体验与壮丽的革命事业融为一体。在革命者眼中，艰苦卓绝的斗争环境（战地），因理想之光的照耀而具有了非凡的意义（黄花分外香）。这种在艰难困苦中发现价值、在逆境险境中保持昂扬的乐观主义精神，是红色精神谱系中极其珍贵的一环。"胜似春光"的宣告，则体现了革命者以斗争为美、以奋斗为荣的独特价值观和强大的精神定力，坚信经过革命风暴洗礼的新世界，必将展现出比自然春光更加绚烂的壮丽图景。',
        image: c3,
      },
      {
        title: "现代传承之思",
        content:
          '体悟"战地黄花分外香"的深刻意蕴，培养在困难中发现价值、在挑战中保持乐观的积极心态至关重要。在学业压力、社会竞争中，讨论如何将个人"战场"上的磨砺转化为成长的养分。学习科学家在艰苦条件下取得突破、运动员带伤拼搏等事迹，深化对奋斗精神的理解。在面对挫折时，以"胜似春光"的信念，看到超越困境后的广阔天地。',
        image: c4,
      },
    ],
  },
];

export default function App() {
  const [selected, setSelected] = useState<Poem | null>(null);
  const [currentAnalysisIndex, setCurrentAnalysisIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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

    // 重置状态
    setCurrentAnalysisIndex(0);

    // 地图淡出
    await gsap.to(el1.current, {
      duration: getAnimationDuration(0.8),
      opacity: 0,
      scale: shouldEnableFeature("enableComplexAnimations") ? 1.2 : 1.05,
      ease: "power2.out",
    });

    // 禁用地图交互
    if (el1.current) {
      el1.current.style.pointerEvents = "none";
    }

    // analyze页面淡入
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
        ease: "power2.out",
      },
    );

    // 强制确保容器可交互
    if (el2.current) {
      el2.current.style.opacity = "1";
      el2.current.style.pointerEvents = "auto";
    }
  }

  async function back() {
    // analyze页面淡出
    await gsap.to(el2.current, {
      duration: getAnimationDuration(0.6),
      opacity: 0,
      scale: shouldEnableFeature("enableComplexAnimations") ? 0.95 : 0.98,
      ease: "power2.out",
    });

    // 禁用容器交互
    if (el2.current) {
      el2.current.style.opacity = "0";
      el2.current.style.pointerEvents = "none";
    }

    // 地图重新进入
    await gsap.fromTo(
      el1.current,
      { scale: shouldEnableFeature("enableComplexAnimations") ? 1.1 : 1.02 },
      {
        duration: getAnimationDuration(0.8),
        opacity: 1,
        scale: 1,
        ease: "power2.out",
      },
    );

    // 启用地图交互
    if (el1.current) {
      el1.current.style.pointerEvents = "auto";
    }

    setCurrentAnalysisIndex(0);
    setSelected(null);
  }

  // 切换到下一个分析
  const nextAnalysis = () => {
    if (!selected?.analysis) return;
    const nextIndex = Math.min(
      currentAnalysisIndex + 1,
      selected.analysis.length - 1,
    );
    if (nextIndex !== currentAnalysisIndex) {
      // 按钮点击反馈动画
      const button = document.querySelector(".next-button") as HTMLElement;
      if (button) {
        gsap.to(button, {
          duration: 0.1,
          scale: 0.95,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });
      }
      animatePageTransition(nextIndex);
    }
  };

  // 切换到上一个分析
  const prevAnalysis = () => {
    const prevIndex = Math.max(currentAnalysisIndex - 1, 0);
    if (prevIndex !== currentAnalysisIndex) {
      // 按钮点击反馈动画
      const button = document.querySelector(".prev-button") as HTMLElement;
      if (button) {
        gsap.to(button, {
          duration: 0.1,
          scale: 0.95,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });
      }
      animatePageTransition(prevIndex);
    }
  };

  // 跳转到指定分析
  const goToAnalysis = (index: number) => {
    if (index !== currentAnalysisIndex) {
      // 指示器点击反馈动画
      const indicator = document.querySelector(
        `[data-index="${index}"]`,
      ) as HTMLElement;
      if (indicator) {
        gsap.to(indicator, {
          duration: 0.15,
          scale: 1.5,
          ease: "back.out(1.7)",
          yoyo: true,
          repeat: 1,
        });
      }
      animatePageTransition(index);
    }
  };

  // 翻页动画
  const animatePageTransition = async (newIndex: number) => {
    if (!el2.current) return;

    const isNext = newIndex > currentAnalysisIndex;
    const direction = isNext ? 1 : -1;

    const currentCard = el2.current.querySelector(
      ".analysis-card",
    ) as HTMLElement;
    const currentImage = el2.current.querySelector(
      ".background-image",
    ) as HTMLElement;

    if (currentCard && currentImage) {
      // 滑出当前内容
      await Promise.all([
        gsap.to(currentCard, {
          duration: getAnimationDuration(0.4),
          opacity: 0,
          x: direction * -30,
          y: 10,
          ease: "power2.in",
        }),
        gsap.to(currentImage, {
          duration: getAnimationDuration(0.5),
          opacity: 0,
          scale: 0.95,
          x: direction * -20,
          ease: "power2.in",
        }),
      ]);
    }

    // 更新索引
    setCurrentAnalysisIndex(newIndex);

    // 延迟滑入新内容
    setTimeout(() => {
      const newCard = el2.current?.querySelector(
        ".analysis-card",
      ) as HTMLElement;
      const newImage = el2.current?.querySelector(
        ".background-image",
      ) as HTMLElement;

      if (newCard && newImage) {
        // 先设置初始位置
        gsap.set(newCard, { opacity: 0, x: direction * 30, y: 20 });
        gsap.set(newImage, { opacity: 0, scale: 1.1, x: direction * 20 });

        // 滑入动画
        gsap.to(newCard, {
          duration: getAnimationDuration(0.6),
          opacity: 1,
          x: 0,
          y: 0,
          ease: "power2.out",
          delay: getAnimationDuration(0.1),
        });
        gsap.to(newImage, {
          duration: getAnimationDuration(0.8),
          opacity: 1,
          scale: 1,
          x: 0,
          ease: "power2.out",
        });
      }
    }, 50);
  };

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
        className="absolute h-full w-full overflow-hidden"
        ref={el2}
        style={{
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        {/* 当前分析的背景图片 */}
        {selected?.analysis && selected.analysis[currentAnalysisIndex] && (
          <img
            src={selected.analysis[currentAnalysisIndex].image}
            alt={`${selected.title} - ${selected.analysis[currentAnalysisIndex].title}`}
            className="background-image w-full h-full object-cover"
          />
        )}

        {/* 返回按钮 */}
        <button
          onClick={back}
          className="absolute top-8 left-8 z-50 group backdrop-blur-2xl bg-black/30 border-2 border-white/50 rounded-full p-4 hover:bg-black/50 hover:border-white/70 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer shadow-2xl"
          style={{
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
          }}
          title="返回地图"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:text-blue-200 transition-colors" />
        </button>

        {/* 分析内容卡片 */}
        {selected?.analysis && selected.analysis[currentAnalysisIndex] && (
          <div className="absolute inset-x-8 bottom-8 z-40">
            <div
              className="analysis-card backdrop-blur-3xl bg-black/60 rounded-2xl p-6 border border-white/30 shadow-2xl max-h-96 overflow-y-auto"
              style={{
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
              }}
            >
              {/* 标题 */}
              <TypewriterText
                key={`title-${selected.title}-${currentAnalysisIndex}`}
                text={selected.analysis[currentAnalysisIndex].title}
                speed={0.06}
                delay={0}
                className="text-2xl font-bold text-white mb-4 text-center block"
              />

              {/* 内容 */}
              <TypewriterText
                key={`content-${selected.title}-${currentAnalysisIndex}`}
                text={selected.analysis[currentAnalysisIndex].content}
                speed={0.03}
                delay={0.5}
                className="text-white/90 leading-relaxed text-base"
              />

              {/* 导航控制 */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/20">
                {/* 上一个按钮 */}
                <button
                  onClick={prevAnalysis}
                  disabled={currentAnalysisIndex === 0}
                  className="prev-button flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <TypewriterText
                    text="上一个"
                    speed={0.08}
                    delay={0.1}
                    className="text-sm"
                  />
                </button>

                {/* 页面指示器 */}
                <div className="flex items-center gap-2">
                  {selected.analysis.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToAnalysis(index)}
                      data-index={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentAnalysisIndex
                          ? "bg-blue-400 scale-125 shadow-lg"
                          : "bg-white/40 hover:bg-white/60 hover:scale-110"
                      }`}
                      style={{
                        animation:
                          index === currentAnalysisIndex
                            ? "pulse 2s infinite"
                            : undefined,
                      }}
                    />
                  ))}
                  <TypewriterText
                    key={`page-indicator-${currentAnalysisIndex}`}
                    text={`${currentAnalysisIndex + 1} / ${selected.analysis?.length || 0}`}
                    speed={0.05}
                    delay={0.2}
                    className="ml-3 text-sm text-white/70"
                  />
                </div>

                {/* 下一个按钮 */}
                <button
                  onClick={nextAnalysis}
                  disabled={
                    currentAnalysisIndex ===
                    (selected.analysis?.length || 1) - 1
                  }
                  className="next-button flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <TypewriterText
                    text="下一个"
                    speed={0.08}
                    delay={0.15}
                    className="text-sm"
                  />
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
