export type ShapeType = 'rectangle' | 'circle' | 'polygon' | 'triangle';

export interface LayerState {
  id: string;
  name: string;
  type: ShapeType;
  width: number;
  height: number;
  top: number;
  left: number;
  zIndex: number;
  
  // Background
  bgType: 'solid' | 'linear' | 'radial' | 'conic';
  backgroundColor: string;
  gradientAngle: number;
  
  // Borders
  borderWidth: number;
  borderColor: string;
  borderStyle: 'solid' | 'dashed' | 'dotted' | 'double';
  
  // Geometry
  borderRadius: string;
  clipPath: string;
  polygonPoints: string;
  
  // Transformation
  rotate: number;
  scale: number;
  skewX: number;
  skewY: number;
  
  // Effects
  shadowColor: string;
  shadowBlur: number;
  shadowSpread: number;
  shadowX: number;
  shadowY: number;
  opacity: number;
  
  filter: {
    blur: number;
    contrast: number;
    brightness: number;
    hueRotate: number;
    saturate: number;
  };
  
  presetName?: string;
  
  glass: {
    enabled: boolean;
    blur: number;
    opacity: number;
    borderOpacity: number;
  };
}

export type CompositionPreset = {
  name: string;
  description: string;
  layers: LayerState[];
};
