import gsap from "gsap";
import { ChevronLeft, ChevronRight, Download, Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Poem } from "../types";

interface ImageGalleryProps {
  poem: Poem | null;
  isVisible: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onBack: () => void;
}

export default function ImageGallery({
  poem,
  isVisible,
  currentPage,
  onPageChange,
  onBack,
}: ImageGalleryProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>([]);
  const galleryRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // 预加载图片
  useEffect(() => {
    if (!poem?.images) return;

    const loadPromises = poem.images.map((src, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          setImageLoaded((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
          resolve();
        };
        img.onerror = () => resolve();
        img.src = src;
      });
    });

    Promise.all(loadPromises);
  }, [poem?.images]);

  // 图片切换动画
  useEffect(() => {
    if (!isVisible || !poem?.images) return;

    imagesRef.current.forEach((img, index) => {
      if (!img) return;

      if (index === currentPage) {
        gsap.fromTo(
          img,
          {
            opacity: 0,
            scale: 1.1,
            filter: "blur(20px)",
            rotationY: 15,
          },
          {
            duration: 1,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            rotationY: 0,
            ease: "power3.out",
          },
        );
      } else {
        gsap.to(img, {
          duration: 0.6,
          opacity: 0,
          scale: 0.95,
          filter: "blur(10px)",
          ease: "power2.out",
        });
      }
    });
  }, [currentPage, isVisible, poem]);

  const handlePrevious = () => {
    if (!poem?.images) return;
    const newPage = Math.max(0, currentPage - 1);
    onPageChange(newPage);
  };

  const handleNext = () => {
    if (!poem?.images) return;
    const newPage = Math.min(poem.images.length - 1, currentPage + 1);
    onPageChange(newPage);
  };

  const handleFullscreen = () => {
    setIsFullscreen(true);
  };

  const handleExitFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleDownload = async () => {
    if (!poem?.images || !poem.images[currentPage]) return;

    try {
      const response = await fetch(poem.images[currentPage]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${poem.title}-${currentPage + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("下载失败:", error);
    }
  };

  if (!isVisible || !poem?.images || poem.images.length === 0) {
    return null;
  }

  return (
    <>
      {/* 主图片展示 */}
      <div
        ref={galleryRef}
        className="absolute inset-0 z-10 flex items-center justify-center"
      >
        {/* 图片容器 */}
        <div className="relative w-full h-full">
          {poem.images.map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentPage ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* 加载占位符 */}
              {!imageLoaded[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4 text-white">
                    <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    <p className="text-lg">加载中...</p>
                  </div>
                </div>
              )}

              {/* 实际图片 */}
              <img
                ref={(el) => {
                  if (el) imagesRef.current[index] = el;
                }}
                src={src}
                alt={`${poem.title} - ${index + 1}`}
                className="w-full h-full object-cover opacity-0"
                onLoad={() => {
                  setImageLoaded((prev) => {
                    const newState = [...prev];
                    newState[index] = true;
                    return newState;
                  });
                }}
              />

              {/* 图片信息叠加 */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
                <div className="max-w-4xl">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {poem.title}
                  </h2>
                  <p className="text-white/80 text-lg mb-1">{poem.place}</p>
                  <p className="text-white/60">{poem.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 控制按钮 */}
        <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
          {/* 返回按钮 */}
          <button
            onClick={onBack}
            className="group flex items-center gap-3 px-6 py-3 backdrop-blur-lg bg-black/30 hover:bg-black/50 border border-white/20 hover:border-white/40 rounded-2xl text-white transition-all duration-300 shadow-2xl"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden md:block">返回地图</span>
          </button>

          {/* 工具按钮 */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              className="p-3 backdrop-blur-lg bg-black/30 hover:bg-black/50 border border-white/20 hover:border-white/40 rounded-xl text-white transition-all duration-300 shadow-xl hover:scale-110"
              title="下载图片"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleFullscreen}
              className="p-3 backdrop-blur-lg bg-black/30 hover:bg-black/50 border border-white/20 hover:border-white/40 rounded-xl text-white transition-all duration-300 shadow-xl hover:scale-110"
              title="全屏查看"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 左右切换按钮 */}
        {poem.images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className="absolute left-8 top-1/2 -translate-y-1/2 p-4 backdrop-blur-lg bg-black/30 hover:bg-black/50 border border-white/20 hover:border-white/40 rounded-full text-white transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === poem.images.length - 1}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-4 backdrop-blur-lg bg-black/30 hover:bg-black/50 border border-white/20 hover:border-white/40 rounded-full text-white transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* 图片指示器 */}
        {poem.images.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
            {poem.images.map((_, index) => (
              <button
                key={index}
                onClick={() => onPageChange(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? "bg-white scale-125 shadow-lg"
                    : "bg-white/40 hover:bg-white/60 hover:scale-110"
                }`}
              />
            ))}
            <div className="ml-4 px-3 py-1 backdrop-blur-md bg-black/40 rounded-full text-white text-sm">
              {currentPage + 1} / {poem.images.length}
            </div>
          </div>
        )}
      </div>

      {/* 全屏模式 */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={handleExitFullscreen}
            className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={poem.images[currentPage]}
            alt={`${poem.title} - ${currentPage + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </>
  );
}
