import gsap from "gsap";
import { Calendar, ChevronRight, MapPin, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Poem } from "../types";
import { cn } from "../utils";

type SidePanelProps = {
  open: boolean;
  poem: Poem | null;
  onClose: () => void;
  onExplore: () => void;
};

export default function SidePanel({
  open,
  poem,
  onClose,
  onExplore,
}: SidePanelProps) {
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const linesRef = useRef<HTMLDivElement[]>([]);
  const buttonRef = useRef<HTMLDivElement>(null);

  // 打字机效果
  useEffect(() => {
    if (!open || !poem) {
      setDisplayedText([]);
      return;
    }

    const lines = poem.excerpt;
    setDisplayedText([]);
    linesRef.current = [];

    const animateText = async () => {
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        let currentText = "";

        for (let charIndex = 0; charIndex <= line.length; charIndex++) {
          currentText = line.slice(0, charIndex);
          setDisplayedText((prev) => {
            const newLines = [...prev];
            newLines[lineIndex] = currentText;
            return newLines;
          });

          // 根据字符类型调整速度（优化性能）
          const char = line[charIndex];
          let delay = 20;
          if (
            char === "，" ||
            char === "。" ||
            char === "？" ||
            char === "！"
          ) {
            delay = 100; // 标点符号停顿
          } else if (char === " ") {
            delay = 5;
          }

          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        // 每行结束后短暂停顿（减少）
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    };

    // 延迟开始打字机效果（减少延迟）
    const timer = setTimeout(animateText, 400);
    return () => clearTimeout(timer);
  }, [open, poem]);

  // 面板进入动画
  useEffect(() => {
    if (!panelRef.current) return;

    if (open) {
      // 面板进入动画（简化）
      gsap.fromTo(
        panelRef.current,
        {
          scale: 0.9,
          opacity: 0,
          x: -30,
        },
        {
          duration: 0.5,
          scale: 1,
          opacity: 1,
          x: 0,
          ease: "power2.out",
        },
      );

      // 标题动画（简化）
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 15 },
          {
            duration: 0.4,
            opacity: 1,
            y: 0,
            ease: "power2.out",
            delay: 0.2,
          },
        );
      }

      // 按钮动画（简化）
      if (buttonRef.current) {
        gsap.fromTo(
          buttonRef.current,
          { opacity: 0, y: 20 },
          {
            duration: 0.4,
            opacity: 1,
            y: 0,
            ease: "power2.out",
            delay: 0.8,
          },
        );
      }
    } else {
      // 面板退出动画（简化）
      gsap.to(panelRef.current, {
        duration: 0.3,
        scale: 0.95,
        opacity: 0,
        x: -20,
        ease: "power2.in",
      });
    }
  }, [open]);

  const handleClose = () => {
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        duration: 0.2,
        scale: 0.95,
        opacity: 0,
        ease: "power2.in",
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  const handleExplore = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        duration: 0.1,
        scale: 0.98,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }
    onExplore();
  };

  return (
    <div
      ref={panelRef}
      className={cn(
        "absolute left-8 bottom-8 w-96 rounded-3xl top-8 z-20 backdrop-blur-2xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 p-8 gap-4 flex flex-col shadow-2xl",
        !open && "scale-50 opacity-0 pointer-events-none",
      )}
      aria-hidden={!open}
      style={{
        background:
          "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(30,30,60,0.3) 50%, rgba(0,0,0,0.2) 100%)",
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* 关闭按钮 */}
      <div
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 cursor-pointer group backdrop-blur-sm"
        onClick={handleClose}
      >
        <X className="w-5 h-5 text-white/80 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
      </div>

      {/* 装饰性渐变 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent rounded-t-3xl" />

      {/* 标题 */}
      <h1
        ref={titleRef}
        className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent pt-2"
      >
        {poem?.title}
      </h1>

      {/* 位置信息 */}
      <div className="flex items-center gap-3 text-white/90 group">
        <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
          <MapPin className="w-4 h-4 text-blue-300" />
        </div>
        <span className="text-sm leading-relaxed">{poem?.place}</span>
      </div>

      {/* 时间信息 */}
      <div className="flex items-center gap-3 text-white/90 group">
        <div className="p-2 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
          <Calendar className="w-4 h-4 text-green-300" />
        </div>
        <span className="text-sm">{poem?.year}</span>
      </div>

      {/* 诗词内容 */}
      <div className="flex flex-col gap-3 mt-4 flex-1 overflow-y-auto">
        {displayedText.map((line, i) => (
          <p
            key={i}
            ref={(el) => {
              if (el) linesRef.current[i] = el;
            }}
            className="text-white/95 leading-relaxed text-base relative"
          >
            {line}
            {line && line === poem?.excerpt[i] && (
              <span className="absolute right-0 opacity-50 animate-pulse">
                |
              </span>
            )}
          </p>
        ))}
      </div>

      {/* 探索按钮 */}
      <div
        ref={buttonRef}
        className="group bg-gradient-to-r from-blue-600/80 via-blue-500/80 to-purple-600/80 hover:from-blue-500 hover:via-blue-400 hover:to-purple-500 rounded-2xl flex items-center justify-center gap-3 text-lg py-4 px-6 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 hover:border-white/30 backdrop-blur-sm"
        onClick={handleExplore}
      >
        <span className="font-medium text-white group-hover:text-blue-50 transition-colors">
          前往探索
        </span>
        <ChevronRight className="w-5 h-5 text-white group-hover:text-blue-50 group-hover:translate-x-1 transition-all duration-300" />
      </div>

      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}
