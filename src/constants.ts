import { LayerState, CompositionPreset } from "./types";

export const createDefaultLayer = (id: string, name: string): LayerState => ({
  id,
  name,
  type: "rectangle",
  width: 100,
  height: 100,
  top: 150,
  left: 150,
  zIndex: 1,
  bgType: "solid",
  backgroundColor: "#3b82f6",
  gradientAngle: 45,
  borderWidth: 0,
  borderColor: "#ffffff",
  borderStyle: "solid",
  borderRadius: "0%",
  clipPath: "none",
  polygonPoints: "50% 0%, 0% 100%, 100% 100%",
  rotate: 0,
  scale: 1,
  skewX: 0,
  skewY: 0,
  shadowColor: "rgba(0,0,0,0.5)",
  shadowBlur: 20,
  shadowSpread: 0,
  shadowX: 0,
  shadowY: 10,
  opacity: 1,
  filter: {
    blur: 0,
    contrast: 100,
    brightness: 100,
    hueRotate: 0,
    saturate: 100,
  },
  presetName: "Quadrato",
  glass: {
    enabled: false,
    blur: 10,
    opacity: 0.2,
    borderOpacity: 0.3,
  },
});

export const ART_PRESETS: CompositionPreset[] = [
  {
    name: "Minimal Panda",
    description: "Simple character using overlapping layers",
    layers: [
      { ...createDefaultLayer("p1", "Face"), type: "circle", borderRadius: "50%", backgroundColor: "#ffffff", width: 140, height: 120, left: 180, top: 190, zIndex: 5 },
      { ...createDefaultLayer("p2", "Left Ear"), type: "circle", borderRadius: "50%", backgroundColor: "#222", width: 40, height: 40, left: 185, top: 180, zIndex: 1 },
      { ...createDefaultLayer("p3", "Right Ear"), type: "circle", borderRadius: "50%", backgroundColor: "#222", width: 40, height: 40, left: 275, top: 180, zIndex: 1 },
      { ...createDefaultLayer("p4", "Left Eye"), type: "circle", borderRadius: "50%", backgroundColor: "#222", width: 30, height: 35, left: 210, top: 220, zIndex: 6, rotate: 15 },
      { ...createDefaultLayer("p5", "Right Eye"), type: "circle", borderRadius: "50%", backgroundColor: "#222", width: 30, height: 35, left: 260, top: 220, zIndex: 6, rotate: -15 },
      { ...createDefaultLayer("p6", "Nose"), type: "circle", borderRadius: "50%", backgroundColor: "#111", width: 10, height: 6, left: 245, top: 260, zIndex: 10 },
    ]
  },
  {
    name: "Rocket Ship",
    description: "Geometric rocket composition",
    layers: [
      { ...createDefaultLayer("r1", "Body"), type: "rectangle", borderRadius: "50% 50% 0 0", backgroundColor: "#f8fafc", width: 50, height: 100, left: 225, top: 150, zIndex: 5 },
      { ...createDefaultLayer("r2", "Nose"), type: "triangle", clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", backgroundColor: "#ef4444", width: 50, height: 30, left: 225, top: 120, zIndex: 6 },
      { ...createDefaultLayer("r3", "Left Wing"), type: "triangle", clipPath: "polygon(100% 0%, 0% 100%, 100% 100%)", backgroundColor: "#ef4444", width: 30, height: 30, left: 195, top: 220, zIndex: 4 },
      { ...createDefaultLayer("r4", "Right Wing"), type: "triangle", clipPath: "polygon(0% 0%, 0% 100%, 100% 100%)", backgroundColor: "#ef4444", width: 30, height: 30, left: 275, top: 220, zIndex: 4 },
      { ...createDefaultLayer("r5", "Window"), type: "circle", borderRadius: "50%", backgroundColor: "#38bdf8", borderWidth: 3, borderColor: "#cbd5e1", width: 20, height: 20, left: 240, top: 170, zIndex: 7 },
    ]
  },
  {
    name: "Orizzonte Astratto",
    description: "Un gioco di luci e ombre con forme geometriche traslucide",
    layers: [
      { ...createDefaultLayer("h1", "Sfondo"), backgroundColor: "#1e293b", width: 600, height: 600, left: 100, top: 100, zIndex: 1, borderRadius: "80px" },
      { ...createDefaultLayer("h2", "Glow Central"), type: "circle", backgroundColor: "#38bdf8", width: 400, height: 400, left: 200, top: 200, zIndex: 2, borderRadius: "50%", opacity: 0.1, shadowBlur: 100, shadowColor: "#38bdf8" },
      { ...createDefaultLayer("h3", "Blade 1"), clipPath: "polygon(0 0, 100% 40%, 100% 60%, 0 100%)", backgroundColor: "rgba(255,255,255,0.05)", width: 800, height: 100, left: 0, top: 350, zIndex: 10, rotate: -15 },
      { ...createDefaultLayer("h4", "Blade 2"), clipPath: "polygon(0 40%, 100% 0, 100% 100%, 0 60%)", backgroundColor: "rgba(255,255,255,0.03)", width: 800, height: 120, left: 0, top: 330, zIndex: 11, rotate: 10 },
      { ...createDefaultLayer("h5", "Punto Luce"), type: "circle", backgroundColor: "#fff", width: 20, height: 20, left: 390, top: 390, zIndex: 20, borderRadius: "50%", shadowBlur: 30, shadowColor: "#fff" },
      { ...createDefaultLayer("h6", "Ring"), type: "circle", backgroundColor: "transparent", borderWidth: 2, borderColor: "#38bdf8", width: 450, height: 450, left: 175, top: 175, zIndex: 5, borderRadius: "50%", opacity: 0.2 }
    ]
  },
  {
    name: "Minimal Coffee",
    description: "Design iconico e geometrico di una tazza calda",
    layers: [
      { ...createDefaultLayer("c1", "Piatto"), backgroundColor: "#e2e8f0", width: 300, height: 20, left: 250, top: 500, zIndex: 5, borderRadius: "20px" },
      { ...createDefaultLayer("c2", "Tazza Body"), backgroundColor: "#fff", width: 200, height: 160, left: 300, top: 350, zIndex: 10, borderRadius: "0 0 80px 80px", borderWidth: 4, borderColor: "#cbd5e1" },
      { ...createDefaultLayer("c3", "Manico"), backgroundColor: "transparent", borderWidth: 15, borderColor: "#cbd5e1", width: 80, height: 80, left: 450, top: 380, zIndex: 8, borderRadius: "50%" },
      { ...createDefaultLayer("c4", "Caffè"), backgroundColor: "#451a03", width: 170, height: 20, left: 315, top: 360, zIndex: 11, borderRadius: "50%" },
      { ...createDefaultLayer("c5", "Vapore L"), clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", backgroundColor: "#cbd5e1", width: 20, height: 100, left: 340, top: 220, zIndex: 5, rotate: -15, opacity: 0.4 },
      { ...createDefaultLayer("c6", "Vapore R"), clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", backgroundColor: "#cbd5e1", width: 20, height: 80, left: 420, top: 240, zIndex: 5, rotate: 10, opacity: 0.3 }
    ]
  },
  {
    name: "Viso Espressivo",
    description: "Un esempio di come usare le nuove forme per creare personaggi",
    layers: [
      { ...createDefaultLayer("f1", "Viso"), type: "circle", borderRadius: "50%", backgroundColor: "#ffdbac", width: 300, height: 350, left: 250, top: 200, zIndex: 1, presetName: "Cerchio" },
      { ...createDefaultLayer("f2", "Occhio L"), type: "polygon", clipPath: "polygon(0% 50%, 20% 20%, 50% 10%, 80% 20%, 100% 50%, 80% 80%, 50% 90%, 20% 80%)", backgroundColor: "#fff", width: 60, height: 40, left: 300, top: 300, zIndex: 5, rotate: -5, presetName: "Occhio" },
      { ...createDefaultLayer("f3", "Occhio R"), type: "polygon", clipPath: "polygon(0% 50%, 20% 20%, 50% 10%, 80% 20%, 100% 50%, 80% 80%, 50% 90%, 20% 80%)", backgroundColor: "#fff", width: 60, height: 40, left: 440, top: 300, zIndex: 5, rotate: 5, presetName: "Occhio" },
      { ...createDefaultLayer("f4", "Pupilla L"), type: "circle", borderRadius: "50%", backgroundColor: "#111", width: 22, height: 22, left: 319, top: 309, zIndex: 6, presetName: "Pupilla" },
      { ...createDefaultLayer("f5", "Pupilla R"), type: "circle", borderRadius: "50%", backgroundColor: "#111", width: 22, height: 22, left: 459, top: 309, zIndex: 6, presetName: "Pupilla" },
      { ...createDefaultLayer("f6", "Sopracciglio L"), type: "polygon", clipPath: "polygon(0% 100%, 50% 0%, 100% 100%, 50% 60%)", backgroundColor: "#4b2c20", width: 70, height: 20, left: 295, top: 270, zIndex: 7, rotate: -10, presetName: "Sopracciglio" },
      { ...createDefaultLayer("f7", "Sopracciglio R"), type: "polygon", clipPath: "polygon(0% 100%, 50% 0%, 100% 100%, 50% 60%)", backgroundColor: "#4b2c20", width: 70, height: 20, left: 435, top: 270, zIndex: 7, rotate: 10, presetName: "Sopracciglio" },
      { ...createDefaultLayer("f8", "Naso"), type: "polygon", clipPath: "polygon(50% 0%, 100% 100%, 50% 85%, 0% 100%)", backgroundColor: "#e2a983", width: 40, height: 60, left: 380, top: 340, zIndex: 4, presetName: "Naso" },
      { ...createDefaultLayer("f9", "Bocca"), type: "polygon", clipPath: "polygon(10% 20%, 90% 20%, 100% 50%, 50% 100%, 0% 50%)", backgroundColor: "#c44536", width: 100, height: 40, left: 350, top: 430, zIndex: 5, presetName: "Sorriso" }
    ]
  }
];
