import { useEffect, useState } from "react";
import { performanceManager } from "../utils/performance";

export default function PerformanceIndicator() {
  const [performanceLevel, setPerformanceLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const level = performanceManager.getPerformanceLevel();
    setPerformanceLevel(level);

    // 只在性能较低时显示提示
    if (level === 'low') {
      setIsVisible(true);
      // 5秒后自动隐藏
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  const getPerformanceMessage = () => {
    switch (performanceLevel) {
      case 'low':
        return {
          title: "性能优化中",
          message: "已为您的设备优化动画效果，确保流畅体验",
          icon: "⚡",
          bgColor: "from-orange-600/20 to-red-600/20",
          borderColor: "border-orange-500/30"
        };
      case 'medium':
        return {
          title: "标准模式",
          message: "正在以平衡模式运行",
          icon: "⚖️",
          bgColor: "from-blue-600/20 to-purple-600/20",
          borderColor: "border-blue-500/30"
        };
      case 'high':
        return {
          title: "高性能模式",
          message: "享受完整的动画体验",
          icon: "🚀",
          bgColor: "from-green-600/20 to-blue-600/20",
          borderColor: "border-green-500/30"
        };
    }
  };

  const { title, message, icon, bgColor, borderColor } = getPerformanceMessage();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className={`backdrop-blur-lg bg-gradient-to-r ${bgColor} border ${borderColor} rounded-2xl p-4 shadow-2xl transform transition-all duration-500 ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl">{icon}</div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm mb-1">
              {title}
            </h3>
            <p className="text-white/80 text-xs leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white/90 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* 进度条指示器 */}
        <div className="mt-3 bg-white/10 rounded-full h-1 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-white/60 to-white/40 transition-all duration-5000 ease-out"
            style={{ width: isVisible ? '0%' : '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
