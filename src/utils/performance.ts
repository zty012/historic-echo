/**
 * 性能优化管理器
 * 根据设备性能自动调整动画复杂度
 */

export interface PerformanceSettings {
  enableComplexAnimations: boolean;
  enableParticles: boolean;
  enableBlur: boolean;
  animationDuration: number;
  particleCount: number;
}

class PerformanceManager {
  private static instance: PerformanceManager;
  private settings: PerformanceSettings;
  private performanceLevel: "low" | "medium" | "high" = "medium";

  private constructor() {
    this.settings = this.getDefaultSettings();
    this.detectPerformance();
  }

  public static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  private getDefaultSettings(): PerformanceSettings {
    return {
      enableComplexAnimations: true,
      enableParticles: true,
      enableBlur: true,
      animationDuration: 1,
      particleCount: 20,
    };
  }

  private detectPerformance(): void {
    // 检测硬件并发数（CPU核心数的近似值）
    const cores = navigator.hardwareConcurrency || 4;

    // 检测内存（如果可用）
    const memory = (navigator as { deviceMemory?: number }).deviceMemory || 4;

    // 检测屏幕尺寸
    const screenArea = window.screen.width * window.screen.height;
    const isLowRes = screenArea < 1920 * 1080;

    // 检测是否为移动设备
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    // 检测是否启用了减少动画偏好
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // 计算性能等级
    let score = 0;

    if (cores >= 8) score += 3;
    else if (cores >= 4) score += 2;
    else score += 1;

    if (memory >= 8) score += 3;
    else if (memory >= 4) score += 2;
    else score += 1;

    if (!isLowRes) score += 2;
    if (!isMobile) score += 2;
    if (!prefersReducedMotion) score += 1;

    // 根据分数确定性能等级
    if (score >= 9 || prefersReducedMotion) {
      this.performanceLevel = "high";
    } else if (score >= 6) {
      this.performanceLevel = "medium";
    } else {
      this.performanceLevel = "low";
    }

    this.applyPerformanceSettings();
  }

  private applyPerformanceSettings(): void {
    switch (this.performanceLevel) {
      case "low":
        this.settings = {
          enableComplexAnimations: false,
          enableParticles: false,
          enableBlur: false,
          animationDuration: 0.3,
          particleCount: 0,
        };
        break;
      case "medium":
        this.settings = {
          enableComplexAnimations: true,
          enableParticles: true,
          enableBlur: true,
          animationDuration: 0.6,
          particleCount: 8,
        };
        break;
      case "high":
        this.settings = {
          enableComplexAnimations: true,
          enableParticles: true,
          enableBlur: true,
          animationDuration: 1,
          particleCount: 15,
        };
        break;
    }
  }

  public getSettings(): PerformanceSettings {
    return { ...this.settings };
  }

  public getPerformanceLevel(): "low" | "medium" | "high" {
    return this.performanceLevel;
  }

  public shouldEnableFeature(feature: keyof PerformanceSettings): boolean {
    return !!this.settings[feature];
  }

  public getAnimationDuration(baseDuration: number = 1): number {
    return baseDuration * this.settings.animationDuration;
  }

  public getParticleCount(baseCount: number = 20): number {
    const ratio = this.settings.particleCount / 20; // 20 是基准值
    return Math.max(1, Math.floor(baseCount * ratio));
  }

  // 动态性能监控
  public startPerformanceMonitoring(): void {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;

        // 如果FPS低于30，降低性能等级
        if (fps < 30 && this.performanceLevel !== "low") {
          console.log("检测到性能问题，降低动画复杂度");
          this.degradePerformance();
        }
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  private degradePerformance(): void {
    if (this.performanceLevel === "high") {
      this.performanceLevel = "medium";
    } else if (this.performanceLevel === "medium") {
      this.performanceLevel = "low";
    }
    this.applyPerformanceSettings();
  }

  // 设置性能优化样式
  public applyPerformanceCSS(): void {
    const styleId = "performance-optimization";
    let style = document.getElementById(styleId) as HTMLStyleElement;

    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    let css = "";

    if (!this.settings.enableBlur) {
      css += `
        .backdrop-blur-sm,
        .backdrop-blur-md,
        .backdrop-blur-lg,
        .backdrop-blur-xl,
        .backdrop-blur-2xl,
        .backdrop-blur-3xl {
          backdrop-filter: none !important;
        }
      `;
    }

    if (!this.settings.enableComplexAnimations) {
      css += `
        * {
          animation-duration: 0.2s !important;
          transition-duration: 0.2s !important;
        }
        .animate-ping,
        .animate-pulse,
        .animate-bounce,
        .animate-spin {
          animation: none !important;
        }
      `;
    }

    style.textContent = css;
  }
}

// 导出单例实例
export const performanceManager = PerformanceManager.getInstance();

// 便捷函数
export const getPerformanceSettings = () => performanceManager.getSettings();
export const shouldEnableFeature = (feature: keyof PerformanceSettings) =>
  performanceManager.shouldEnableFeature(feature);
export const getAnimationDuration = (baseDuration?: number) =>
  performanceManager.getAnimationDuration(baseDuration);
export const getParticleCount = (baseCount?: number) =>
  performanceManager.getParticleCount(baseCount);
