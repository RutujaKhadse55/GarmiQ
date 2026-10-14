/// <reference types="vite/client" />

declare namespace GeoJSON {
  export type FeatureCollection = any;
  export type Feature = any;
  export type Geometry = any;
  export type Polygon = any;
}

declare module 'geojson' {
  export type FeatureCollection = any;
  export type Feature = any;
  export type Geometry = any;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_TILES_URL: string;
  readonly VITE_USE_MOCKS: string;
  readonly VITE_REAL_ENDPOINTS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
