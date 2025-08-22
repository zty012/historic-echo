import gsap from "gsap";
import { useEffect, useRef } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  speed = 0.05,
  delay = 0.3,
  className = "",
  onComplete,
}: TypewriterTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current || !cursorRef.current) return;

    // 保存当前的 ref 值
    const textElement = textRef.current;
    const cursorElement = cursorRef.current;

    // 清空文本内容
    textElement.textContent = "";

    // 创建GSAP时间线
    const tl = gsap.timeline();

    // 设置初始状态
    gsap.set(textElement, { opacity: 1 });
    gsap.set(cursorElement, { opacity: 1 });

    // 光标闪烁动画
    gsap.to(cursorElement, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    // 打字机动画
    tl.to(
      {},
      {
        duration: text.length * speed,
        delay: delay,
        ease: "none",
        onUpdate: function () {
          const progress = this.progress();
          const currentLength = Math.floor(progress * text.length);
          if (textElement) {
            textElement.textContent = text.slice(0, currentLength);
          }
        },
        onComplete: () => {
          // 动画完成后停止光标闪烁
          gsap.killTweensOf(cursorElement);
          gsap.to(cursorElement, {
            opacity: 0,
            duration: 0.3,
            delay: 0.5,
          });
          onComplete?.();
        },
      },
    );

    // 清理函数
    return () => {
      tl.kill();
      gsap.killTweensOf(cursorElement);
    };
  }, [text, speed, delay, onComplete]);

  return (
    <div ref={containerRef} className={className}>
      <span ref={textRef}></span>
      <span ref={cursorRef} className="text-blue-300 ml-1">
        |
      </span>
    </div>
  );
}
