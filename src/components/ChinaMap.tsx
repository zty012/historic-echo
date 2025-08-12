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

        addProvinceLabels(map, data, provinceLabelMarkersRef);
      } catch {
        // 忽略：边界加载失败不影响底图与标记
      }

      // 初次渲染诗词标记
      renderPoemMarkers(map, poems, poemMarkersRef, (poem) => {
        onSelectRef.current?.(poem);
        map.flyTo({
          center: poem.coords,
          zoom: 6,
          speed: 0.8,
          curve: 1.2,
          essential: true,
        });
      });

      // 若初始已有选中项，飞到该位置
      if (selectedPoem) {
        map.flyTo({
          center: selectedPoem.coords,
          zoom: 6,
          speed: 0.8,
          curve: 1.2,
          essential: true,
        });
      }
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
    renderPoemMarkers(map, poems, poemMarkersRef, (poem) => {
      onSelectRef.current?.(poem);
      map.flyTo({
        center: poem.coords,
        zoom: 6,
        speed: 0.8,
        curve: 1.2,
        essential: true,
      });
    });
  }, [poems]);

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
      "pointer-events-none select-none px-1.5 py-0.5 rounded bg-black/35 text-white text-[10px] md:text-xs leading-none backdrop-blur-sm border border-white/10 shadow-sm";
    labelEl.textContent = name;

    const m = new maplibregl.Marker({ element: labelEl, anchor: "center" })
      .setLngLat(center)
      .addTo(map);
    ref.current.push(m);
  }
}

function renderPoemMarkers(
  map: MapLibreMap,
  poems: Poem[],
  ref: MutableRefObject<Marker[]>,
  onClick: (poem: Poem) => void,
) {
  poems.forEach((poem) => {
    const el = document.createElement("div");
    el.className = "group relative";
    el.style.cursor = "pointer";

    // 主体圆点
    const pin = document.createElement("div");
    pin.className =
      "relative w-4 h-4 rounded-full bg-red-500 ring-2 ring-white/90 shadow-lg shadow-black/40";
    // 动画波纹
    const ping = document.createElement("span");
    ping.className = "absolute inset-0 rounded-full bg-red-500/60 animate-ping";
    pin.appendChild(ping);
    el.appendChild(pin);

    // 文本标签（中等及以上屏幕显示）
    const label = document.createElement("div");
    label.className =
      "absolute left-4 top-1/2 -translate-y-1/2 ml-2 hidden md:block whitespace-nowrap px-2 py-1 rounded-md bg-black/60 text-white text-xs backdrop-blur";
    label.textContent = poem.title;
    el.appendChild(label);

    el.addEventListener("click", () => onClick(poem));

    const marker = new maplibregl.Marker({ element: el, anchor: "center" })
      .setLngLat(poem.coords)
      .addTo(map);

    ref.current.push(marker);
  });
}
