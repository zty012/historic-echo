/**
 * 通用经纬度类型：[lng, lat]
 */
export type LngLat = [number, number];

/**
 * 解析内容类型
 */
export type AnalysisSection = {
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
  /** 相关图片链接 */
  image: string;
};

/**
 * 诗作信息类型
 */
export type Poem = {
  /** 唯一标识 */
  id: string;
  /** 标题（如《沁园春·雪》） */
  title: string;
  /** 地点（省市或地标） */
  place: string;
  /** 年份 */
  year: string;
  /** 经纬度坐标，[lng, lat] */
  coords: LngLat;
  /** 摘句（若干行） */
  excerpt: string[];
  /** 解析内容 */
  analysis?: AnalysisSection[];
};
