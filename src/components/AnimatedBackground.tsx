import gsap from "gsap";
import { useEffect, useRef } from "react";
import {
  getAnimationDuration,
  getParticleCount,
  shouldEnableFeature,
} from "../utils/performance";

interface AnimatedBackgroundProps {
  className?: string;
}

export default function AnimatedBackground({
  className = "",
}: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // 创建浮动粒子（减少数量）
    const createParticles = () => {
      const container = containerRef.current!;
      particlesRef.current = [];

      const particleCount = getParticleCount(12);
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute rounded-full bg-white/8";

        // 随机大小
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // 随机位置
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        // 随机透明度
        particle.style.opacity = (Math.random() * 0.2 + 0.05).toString();

        container.appendChild(particle);
        particlesRef.current.push(particle);
      }
    };

    // 粒子动画（优化性能）
    const animateParticles = () => {
      if (shouldEnableFeature("enableComplexAnimations")) {
        particlesRef.current.forEach((particle, index) => {
          gsap.to(particle, {
            x: `+=${Math.random() * 60 - 30}`,
            y: `+=${Math.random() * 60 - 30}`,
            duration: getAnimationDuration(15 + Math.random() * 10),
            ease: "none",
            repeat: -1,
            yoyo: true,
            delay: index * 0.5,
          });

          // 简化闪烁效果
          gsap.to(particle, {
            opacity: Math.random() * 0.3 + 0.05,
            duration: getAnimationDuration(4 + Math.random() * 3),
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
            delay: Math.random() * 3,
          });
        });
      }
    };

    // 创建渐变波纹（简化）
    const createWaves = () => {
      if (!shouldEnableFeature("enableComplexAnimations")) return;

      const container = containerRef.current!;

      for (let i = 0; i < 2; i++) {
        const wave = document.createElement("div");
        wave.className = "absolute inset-0 opacity-10";
        wave.style.background = `
          radial-gradient(
            circle at ${30 + i * 40}% ${40 + i * 20}%,
            rgba(59, 130, 246, 0.08) 0%,
            transparent 40%
          )
        `;

        container.appendChild(wave);

        // 波纹动画（减慢速度）
        gsap.to(wave, {
          backgroundPosition: `${100 + i * 30}% ${100 + i * 20}%`,
          duration: getAnimationDuration(30 + i * 10),
          ease: "none",
          repeat: -1,
        });
      }
    };

    // 创建光线效果（减少数量）
    const createLightRays = () => {
      if (!shouldEnableFeature("enableComplexAnimations")) return;

      const container = containerRef.current!;

      for (let i = 0; i < 3; i++) {
        const ray = document.createElement("div");
        ray.className = "absolute opacity-3";
        ray.style.width = "1px";
        ray.style.height = "100%";
        ray.style.background =
          "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)";
        ray.style.left = `${Math.random() * 100}%`;
        ray.style.transform = `rotate(${Math.random() * 15 - 7}deg)`;

        container.appendChild(ray);

        // 光线移动动画（减慢）
        gsap.to(ray, {
          x: `+=${Math.random() * 100 - 50}`,
          duration: getAnimationDuration(25 + Math.random() * 15),
          ease: "none",
          repeat: -1,
          yoyo: true,
        });

        // 简化光线闪烁
        gsap.to(ray, {
          opacity: 0.05,
          duration: getAnimationDuration(5 + Math.random() * 3),
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 4,
        });
      }
    };

    // 初始化动画（延迟加载）
    const initDelay = shouldEnableFeature("enableComplexAnimations")
      ? 1000
      : 500;
    setTimeout(() => {
      createParticles();
      animateParticles();
    }, initDelay);

    setTimeout(() => {
      createWaves();
    }, initDelay * 2);

    setTimeout(() => {
      createLightRays();
    }, initDelay * 3);

    // 清理函数
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      particlesRef.current = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none fixed inset-0 overflow-hidden z-0 ${className}`}
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.03) 0%, transparent 50%)
        `,
      }}
    >
      {/* 静态渐变层 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-purple-900/5" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/3 to-transparent" />

      {/* 网格线效果 */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}
