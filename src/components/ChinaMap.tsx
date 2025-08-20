import maplibregl, { Map as MapLibreMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MutableRefObject, useEffect, useRef } from "react";
import type { Poem } from "../types";
import { cn } from "../utils";

type ChinaMapProps = {
  className?: string;
  poems: Poem[];
  selectedPoem?: Poem | null;
  onSelect?: (poem: Poem) => void;
};

export default function ChinaMap({
  className,
  poems,
  selectedPoem,
  onSelect,
}: ChinaMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const mapLoadedRef = useRef(false);

  const provinceLabelMarkersRef = useRef<Marker[]>([]);
  const poemMarkersRef = useRef<Marker[]>([]);
  const onSelectRef = useRef<typeof onSelect>(() => {});
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // 初始化地图
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          esri: {
            type: "raster" as const,
            tiles: [
              "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            attribution: "Imagery © Esri",
          },
        },
        layers: [
          {
            id: "esri",
            type: "raster" as const,
            source: "esri",
          },
        ],
      },
      center: [104.1954, 35.8617],
      zoom: 3.6,
      maxZoom: 10,
      minZoom: 2.2,
      attributionControl: false,
      pitchWithRotate: false,
      dragRotate: false,
    });
    mapRef.current = map;

    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right",
    );
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      "bottom-right",
    );

    map.on("load", async () => {
      mapLoadedRef.current = true;

      // 省级边界
      try {
        const res = await fetch(
          "https://geojson.cn/api/china/1.6.2/china.json",
        );
        const data = await res.json();

        map.addSource("china-provinces", { type: "geojson", data });
        map.addLayer({
          id: "china-borders",
          type: "line",
          source: "china-provinces",
          paint: {
            "line-color": "rgba(255,255,255,0.65)",
            "line-width": 0.8,
          },
        });

        // 等待边界线渲染完成后再添加省份标签
        setTimeout(() => {
          addProvinceLabels(map, data, provinceLabelMarkersRef);
        }, 300);
      } catch {
        // 忽略：边界加载失败不影响底图与标记
      }

      // 等待地图完全稳定后再渲染诗词标记
      setTimeout(() => {
        renderPoemMarkers(map, poems, poemMarkersRef, (poem) => {
          onSelectRef.current?.(poem);
          map.flyTo({
            center: poem.coords,
            zoom: 6,
            speed: 1.2,
            curve: 1.8,
            essential: true,
          });
        });

        // 若初始已有选中项，飞到该位置
        if (selectedPoem) {
          map.flyTo({
            center: selectedPoem.coords,
            zoom: 6,
            speed: 1.2,
            curve: 1.8,
            essential: true,
          });
        }
      }, 500);
    });

    return () => {
      // 清理所有 marker 与地图实例
      try {
        poemMarkersRef.current.forEach((m) => m.remove());
      } catch (e) {
        console.error(e);
      }
      poemMarkersRef.current = [];
      try {
        provinceLabelMarkersRef.current.forEach((m) => m.remove());
      } catch (e) {
        console.error(e);
      }
      provinceLabelMarkersRef.current = [];

      try {
        map.remove();
      } catch (e) {
        console.error(e);
      }
      mapRef.current = null;
      mapLoadedRef.current = false;
    };
  }, []);

  // poems 变化时重绘标记
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoadedRef.current) return;

    // 重新渲染诗词标记
    clearMarkers(poemMarkersRef);
    setTimeout(() => {
      renderPoemMarkers(map, poems, poemMarkersRef, (poem) => {
        onSelectRef.current?.(poem);
        map.flyTo({
          center: poem.coords,
          zoom: 6,
          speed: 1.2,
          curve: 1.8,
          essential: true,
        });
      });
    }, 100);
  }, [poems, selectedPoem]);

  // 选中项变化时飞行
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoadedRef.current || !selectedPoem) return;
    map.flyTo({
      center: selectedPoem.coords,
      zoom: 6,
      speed: 0.8,
      curve: 1.2,
      essential: true,
    });
  }, [selectedPoem]);

  return <div ref={containerRef} className={cn("w-full h-full", className)} />;
}

/* ---------- Helpers ---------- */

function clearMarkers(ref: MutableRefObject<Marker[]>) {
  try {
    ref.current.forEach((m) => m.remove());
  } catch (e) {
    console.error(e);
  }
  ref.current = [];
}

function addProvinceLabels(
  map: MapLibreMap,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geojson: any,
  ref: MutableRefObject<Marker[]>,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const computeBBoxCenter = (feature: any): [number, number] | null => {
    const geom = feature?.geometry;
    if (!geom || !geom.coordinates) return null;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update = (coords: any) => {
      if (typeof coords?.[0] === "number" && typeof coords?.[1] === "number") {
        const x = coords[0],
          y = coords[1];
        if (isFinite(x) && isFinite(y)) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
        return;
      }
      if (Array.isArray(coords)) {
        for (const c of coords) update(c);
      }
    };
    update(geom.coordinates);
    if (
      !isFinite(minX) ||
      !isFinite(minY) ||
      !isFinite(maxX) ||
      !isFinite(maxY)
    )
      return null;
    return [(minX + maxX) / 2, (minY + maxY) / 2];
  };

  const features =
    geojson?.type === "FeatureCollection" ? (geojson.features ?? []) : [];
  for (const f of features) {
    const name =
      f?.properties?.name ??
      f?.properties?.NAME ??
      f?.properties?.NAME_CHN ??
      f?.properties?.fullname ??
      f?.properties?.province ??
      "";
    const center = computeBBoxCenter(f);
    if (!name || !center) continue;

    const labelEl = document.createElement("div");
    labelEl.className =
      "pointer-events-none select-none px-2 py-1 rounded-lg bg-black/60 text-white text-[10px] md:text-xs leading-none backdrop-blur-md border border-white/20 shadow-lg";
    labelEl.textContent = name;

    // 省份标签初始化 - 直接显示，避免位置问题
    labelEl.style.opacity = "0";

    const m = new maplibregl.Marker({
      element: labelEl,
      anchor: "center",
      offset: [0, 0],
    })
      .setLngLat(center)
      .addTo(map);
    ref.current.push(m);

    // 简化显示动画 - 确保标签已正确定位后再显示
    setTimeout(
      () => {
        labelEl.style.transition = "opacity 0.5s ease-out";
        labelEl.style.opacity = "0.9";
      },
      Math.random() * 500 + 300,
    );
  }
}

function renderPoemMarkers(
  map: MapLibreMap,
  poems: Poem[],
  ref: MutableRefObject<Marker[]>,
  onClick: (poem: Poem) => void,
) {
  poems.forEach((poem, index) => {
    const el = document.createElement("div");
    el.className = "group relative hover:z-10";
    el.style.cursor = "pointer";

    // 外圈动画环
    const outerRing = document.createElement("div");
    outerRing.className =
      "absolute inset-0 w-8 h-8 -translate-x-2 -translate-y-2 rounded-full border-2 border-red-400/30 animate-pulse";
    el.appendChild(outerRing);

    // 主体圆点
    const pin = document.createElement("div");
    pin.className =
      "relative w-5 h-5 rounded-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 ring-2 ring-white shadow-2xl shadow-red-500/50 group-hover:scale-125 group-hover:shadow-red-500/80";

    // 内部光点
    const innerGlow = document.createElement("div");
    innerGlow.className =
      "absolute inset-1 rounded-full bg-white/40 animate-pulse";
    pin.appendChild(innerGlow);

    // 动画波纹
    const ping = document.createElement("span");
    ping.className =
      "absolute inset-0 rounded-full bg-red-500/40 animate-ping animation-delay-1000";
    pin.appendChild(ping);

    const ping2 = document.createElement("span");
    ping2.className =
      "absolute inset-0 rounded-full bg-red-400/30 animate-ping animation-delay-500";
    pin.appendChild(ping2);

    el.appendChild(pin);

    // 文本标签（中等及以上屏幕显示）
    const label = document.createElement("div");
    label.className =
      "absolute left-6 top-1/2 -translate-y-1/2 ml-2 hidden md:block whitespace-nowrap px-3 py-2 rounded-xl bg-black/70 text-white text-sm backdrop-blur-lg border border-white/20 shadow-xl group-hover:bg-black/90 group-hover:scale-105 group-hover:border-white/40";
    label.textContent = poem.title;

    // 添加年份信息
    const yearSpan = document.createElement("span");
    yearSpan.className = "block text-xs text-white/70 mt-0.5";
    yearSpan.textContent = poem.year;
    label.appendChild(yearSpan);

    el.appendChild(label);

    // 悬浮效果 - 只在需要时添加transition
    el.addEventListener("mouseenter", () => {
      if (!pin.style.transition) pin.style.transition = "transform 0.2s ease";
      pin.style.transform = "scale(1.3)";

      if (!outerRing.style.transition)
        outerRing.style.transition = "transform 0.2s ease";
      outerRing.style.transform = "scale(1.5) translate(-50%, -50%)";
      outerRing.style.left = "50%";
      outerRing.style.top = "50%";

      if (!label.style.transition) label.style.transition = "all 0.2s ease";
      label.style.transform = "translateY(-50%) scale(1.05)";
      label.style.opacity = "1";
    });

    el.addEventListener("mouseleave", () => {
      pin.style.transform = "scale(1)";
      outerRing.style.transform = "scale(1) translate(-2px, -2px)";
      outerRing.style.left = "0";
      outerRing.style.top = "0";
      label.style.transform = "translateY(-50%) scale(1)";
      label.style.opacity = "0.9";
    });

    // 点击波纹效果
    el.addEventListener("click", () => {
      const ripple = document.createElement("div");
      ripple.className =
        "absolute inset-0 w-12 h-12 -translate-x-4 -translate-y-4 rounded-full bg-red-400/20 animate-ping pointer-events-none";
      el.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 1000);

      onClick(poem);
    });

    const marker = new maplibregl.Marker({ element: el, anchor: "center" })
      .setLngLat(poem.coords)
      .addTo(map);

    // 先设置初始透明度为0，但不影响定位
    el.style.opacity = "0";

    // 添加到地图
    ref.current.push(marker);

    // 延迟显示动画，确保marker已正确定位
    setTimeout(
      () => {
        el.style.transition = "opacity 0.6s ease-out";
        el.style.opacity = "1";
      },
      index * 100 + 200, // 减少延迟，因为已经在renderPoemMarkers外层有延迟
    );
  });
}
