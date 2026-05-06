import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Palette, 
  Layers, 
  Maximize2, 
  Terminal, 
  RotateCcw, 
  RotateCw,
  Settings2, 
  Copy, 
  Check, 
  Sparkles, 
  Shapes,
  FlaskConical,
  Hexagon,
  Square,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  Type,
  MousePointer2,
  Move
} from "lucide-react";
import { LayerState, CompositionPreset, ShapeType } from "./types";
import { ART_PRESETS, createDefaultLayer } from "./constants";
import { cn } from "./lib/utils";

// --- Components ---

const SidebarHeader = ({ children, icon: Icon, colorClass = "text-indigo-600" }: { children: React.ReactNode, icon: any, colorClass?: string }) => (
  <div className="flex items-center gap-4 mb-8 px-2">
    <div className={cn("p-3 rounded-2xl bg-zinc-100", colorClass.replace('text', 'bg-opacity-10 text'))}>
      <Icon className={cn("w-6 h-6", colorClass)} />
    </div>
    <h2 className="text-lg font-bold tracking-tight text-zinc-800">{children}</h2>
  </div>
);

const ControlGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="mb-12 group/group">
    <label className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6 block group-hover/group:text-zinc-600 transition-colors">
      {label}
    </label>
    <div className="space-y-8">
      {children}
    </div>
  </div>
);

const SliderControl = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  suffix = ""
}: { 
  label: string, 
  value: number, 
  onChange: (val: number) => void,
  min?: number,
  max?: number,
  step?: number,
  suffix?: string
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center px-1">
      <span className="text-[13px] text-zinc-700 font-semibold">{label}</span>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors border border-zinc-200"
        >
          -
        </button>
        <input 
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-16 h-8 text-center text-[13px] text-zinc-900 font-mono font-bold bg-zinc-50 rounded-lg border border-zinc-200 focus:border-indigo-500 outline-none"
        />
        <span className="text-[10px] font-bold text-zinc-400 absolute translate-y-6">{suffix}</span>
        <button 
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-colors border border-zinc-200"
        >
          +
        </button>
      </div>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
    />
  </div>
);

// --- Main App ---

export default function App() {
  const [layers, setLayers] = useState<LayerState[]>(ART_PRESETS[0].layers);
  const [history, setHistory] = useState<LayerState[][]>([ART_PRESETS[0].layers]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(layers[0].id);
  const [activeTab, setActiveTab] = useState<'layers' | 'properties' | 'presets' | 'code'>('layers');
  const [copied, setCopied] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const selectedLayer = layers.find(l => l.id === selectedLayerId) || layers[0];

  const saveToHistory = (newLayers: LayerState[]) => {
    setHistory(prev => {
      const newHistory = [...prev.slice(0, historyIndex + 1)];
      newHistory.push(JSON.parse(JSON.stringify(newLayers)));
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  };

  const undo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      const historyState = JSON.parse(JSON.stringify(history[nextIndex]));
      setLayers(historyState);
      setHistoryIndex(nextIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const historyState = JSON.parse(JSON.stringify(history[nextIndex]));
      setLayers(historyState);
      setHistoryIndex(nextIndex);
    }
  };

  const updateSelectedLayer = (updates: Partial<LayerState>, skipHistory = false) => {
    setLayers(prev => {
      const newLayers = prev.map(l => l.id === selectedLayerId ? { ...l, ...updates } : l);
      return newLayers;
    });
  };

  // Improved history capturing - avoid running during heavy operations or drags
  useEffect(() => {
    if (!selectedLayerId || isDragging) return;
    
    const timer = setTimeout(() => {
      const currentLayerStr = JSON.stringify(layers);
      const lastHistoryStr = JSON.stringify(history[historyIndex]);
      if (currentLayerStr !== lastHistoryStr) {
        saveToHistory(layers);
      }
    }, 1200); 
    return () => clearTimeout(timer);
  }, [layers, historyIndex, isDragging, selectedLayerId]);

  const addLayer = () => {
    const id = Math.random().toString(36).substring(7);
    const newLayer = createDefaultLayer(id, `Elemento ${layers.length + 1}`);
    // Add it more centered and visible
    newLayer.width = 150;
    newLayer.height = 150;
    newLayer.top = 225;
    newLayer.left = 225;
    newLayer.backgroundColor = "#6366f1";
    setLayers(prev => [...prev, newLayer]);
    setSelectedLayerId(id);
    setActiveTab('properties');
  };

  const removeLayer = (id: string) => {
    if (layers.length <= 1) return;
    setLayers(prev => prev.filter(l => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(layers[0].id);
  };

  const moveLayer = (id: string, direction: 'up' | 'down') => {
    const index = layers.findIndex(l => l.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === layers.length - 1) return;
    
    const newLayers = [...layers];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newLayers[index], newLayers[targetIndex]] = [newLayers[targetIndex], newLayers[index]];
    setLayers(newLayers);
  };

  const generateFullCSS = useMemo(() => {
    const cssBlocks: string[] = [];
    
    layers.forEach(layer => {
      const styles = [];
      styles.push(`position: absolute;`);
      styles.push(`top: ${layer.top}px;`);
      styles.push(`left: ${layer.left}px;`);
      styles.push(`width: ${layer.width}px;`);
      styles.push(`height: ${layer.height}px;`);
      styles.push(`z-index: ${layer.zIndex};`);
      styles.push(`background: ${layer.backgroundColor};`);
      if (layer.opacity < 1) styles.push(`opacity: ${layer.opacity};`);
      if (layer.borderRadius !== '0%') styles.push(`border-radius: ${layer.borderRadius};`);
      if (layer.clipPath !== 'none') styles.push(`clip-path: ${layer.clipPath};`);
      if (layer.borderWidth > 0) styles.push(`border: ${layer.borderWidth}px ${layer.borderStyle} ${layer.borderColor};`);
      
      const transforms = [];
      if (layer.rotate !== 0) transforms.push(`rotate(${layer.rotate}deg)`);
      if (layer.scale !== 1) transforms.push(`scale(${layer.scale})`);
      if (layer.skewX !== 0) transforms.push(`skewX(${layer.skewX}deg)`);
      if (transforms.length > 0) styles.push(`transform: ${transforms.join(' ')};`);
      
      if (layer.shadowBlur > 0) {
        styles.push(`box-shadow: ${layer.shadowX}px ${layer.shadowY}px ${layer.shadowBlur}px ${layer.shadowSpread}px ${layer.shadowColor};`);
      }
      
      const selector = layer.name.toLowerCase().replace(/\s+/g, '-');
      cssBlocks.push(`/* ${layer.name} */\n.${selector} {\n  ${styles.join('\n  ')}\n}`);
    });

    return cssBlocks.join('\n\n');
  }, [layers]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generateFullCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const SHAPE_PRESETS = [
    { name: "Cerchio", path: "none", borderRadius: "50%" },
    { name: "Pupilla", path: "none", borderRadius: "50%", color: "#000000", width: 30, height: 30 },
    { name: "Quadrato", path: "none", borderRadius: "0%" },
    { name: "Occhio", path: "polygon(0% 50%, 20% 20%, 50% 10%, 80% 20%, 100% 50%, 80% 80%, 50% 90%, 20% 80%)" },
    { name: "Sopracciglio", path: "polygon(0% 100%, 50% 0%, 100% 100%, 50% 60%)" },
    { name: "Naso", path: "polygon(50% 0%, 100% 100%, 50% 85%, 0% 100%)" },
    { name: "Sorriso", path: "polygon(10% 20%, 90% 20%, 100% 50%, 50% 100%, 0% 50%)" },
    { name: "Triste", path: "polygon(0% 100%, 50% 50%, 100% 100%, 100% 120%, 0% 120%)" },
    { name: "Bocca Aperta", path: "polygon(10% 10%, 90% 10%, 100% 90%, 0% 90%)", color: "#451a03", width: 120, height: 80 },
    { name: "Labbra", path: "polygon(0% 50%, 20% 20%, 50% 40%, 80% 20%, 100% 50%, 80% 80%, 50% 70%, 20% 80%)", color: "#e11d48" },
    { name: "Baffo", path: "polygon(0% 100%, 50% 80%, 100% 100%, 50% 0%)", color: "#1c1917" },
    { name: "Stella", path: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }
  ];

  return (
    <div className="flex h-screen bg-black text-zinc-900 font-sans selection:bg-indigo-100 overflow-hidden">
      
      {/* Navigation - Dark & Minimal */}
      <div className="w-24 border-r border-white/5 bg-black flex flex-col items-center py-12 gap-12 shrink-0 z-50">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/40">
          <FlaskConical className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex flex-col gap-10">
          <NavBtn icon={Layers} active={activeTab === 'layers'} onClick={() => setActiveTab('layers')} label="Struttura" />
          <NavBtn icon={Settings2} active={activeTab === 'properties'} onClick={() => setActiveTab('properties')} label="Proprietà" />
          <NavBtn icon={Shapes} active={activeTab === 'presets'} onClick={() => setActiveTab('presets')} label="Galleria" />
          <NavBtn icon={Terminal} active={activeTab === 'code'} onClick={() => setActiveTab('code')} label="CSS" />
        </div>

        <button onClick={() => setLayers(ART_PRESETS[0].layers)} className="mt-auto p-4 text-zinc-600 hover:text-white transition-colors">
          <RotateCcw className="w-8 h-8" />
        </button>
      </div>

      {/* Editor Panel - Clear & Focus */}
      <div className="w-[450px] overflow-y-auto border-r border-zinc-400 bg-zinc-100 p-12 custom-scrollbar shrink-0 shadow-2xl">
        <AnimatePresence mode="wait">
          
          {activeTab === 'layers' && (
            <motion.div key="layers" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <SidebarHeader icon={Layers}>Gestione Elementi</SidebarHeader>
              <div className="space-y-4 mb-12">
                {layers.map((layer, i) => (
                  <div 
                    key={layer.id}
                    onClick={() => setSelectedLayerId(layer.id)}
                    className={cn(
                      "flex items-center gap-6 p-6 rounded-[32px] border-4 transition-all cursor-pointer group",
                      selectedLayerId === layer.id 
                        ? "bg-white border-indigo-500 shadow-xl scale-[1.02]" 
                        : "bg-white/50 border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:bg-white"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-base font-black transition-colors",
                      selectedLayerId === layer.id ? "bg-indigo-600 text-white" : "bg-zinc-200 text-zinc-500"
                    )}>
                       {i + 1}
                    </div>
                    <span className={cn("text-lg font-bold truncate flex-1", selectedLayerId === layer.id ? "text-zinc-900" : "text-zinc-500")}>
                      {layer.name}
                    </span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'up'); }} className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-indigo-600"><ChevronUp className="w-6 h-6" /></button>
                      <button onClick={(e) => { e.stopPropagation(); moveLayer(layer.id, 'down'); }} className="p-2 hover:bg-zinc-100 rounded-xl text-zinc-400 hover:text-indigo-600"><ChevronDown className="w-6 h-6" /></button>
                      <button onClick={(e) => { e.stopPropagation(); removeLayer(layer.id); }} className="p-2 hover:bg-red-50 rounded-xl text-zinc-400 hover:text-red-600"><Trash2 className="w-6 h-6" /></button>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={addLayer}
                className="w-full py-8 border-4 border-dashed border-zinc-300 rounded-[40px] text-lg font-black text-zinc-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-white transition-all flex items-center justify-center gap-4 group"
              >
                <Plus className="w-8 h-8 group-hover:scale-125 transition-transform" /> NUOVO ELEMENTO
              </button>
            </motion.div>
          )}

          {activeTab === 'properties' && (
            <motion.div key="props" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <SidebarHeader icon={Settings2} colorClass="text-emerald-600">Configura: {selectedLayer.name}</SidebarHeader>
              
              <ControlGroup label="Nome">
                <input 
                  type="text" 
                  value={selectedLayer.name} 
                  onChange={(e) => updateSelectedLayer({ name: e.target.value })}
                  className="w-full bg-white border-4 border-zinc-200 rounded-3xl px-8 py-6 text-lg font-bold text-zinc-900 outline-none focus:border-indigo-500 transition-all shadow-sm"
                />
              </ControlGroup>

              <ControlGroup label="Dimensioni & Posizione">
                <div className="space-y-12">
                  <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                    <SliderControl label="Dall'alto" value={selectedLayer.top} min={-100} max={600} suffix="px" onChange={(v) => updateSelectedLayer({ top: v })} />
                    <SliderControl label="Da sinistra" value={selectedLayer.left} min={-100} max={600} suffix="px" onChange={(v) => updateSelectedLayer({ left: v })} />
                    <SliderControl label="Larghezza" value={selectedLayer.width} min={1} max={600} suffix="px" onChange={(v) => updateSelectedLayer({ width: v })} />
                    <SliderControl label="Altezza" value={selectedLayer.height} min={1} max={600} suffix="px" onChange={(v) => updateSelectedLayer({ height: v })} />
                  </div>
                  <SliderControl label="Livello Z (Livelli)" value={selectedLayer.zIndex} min={0} max={20} step={1} onChange={(v) => updateSelectedLayer({ zIndex: v })} />
                  <SliderControl label="Opacità" value={Math.round(selectedLayer.opacity * 100)} min={0} max={100} step={5} suffix="%" onChange={(v) => updateSelectedLayer({ opacity: v / 100 })} />
                </div>
              </ControlGroup>

              <ControlGroup label="Trasformazione & Forma">
                <div className="space-y-10 mb-8">
                  <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                    <SliderControl label="Scala" value={Math.round(selectedLayer.scale * 100)} min={10} max={300} suffix="%" onChange={(v) => updateSelectedLayer({ scale: v / 100 })} />
                    <SliderControl label="Inclinazione" value={selectedLayer.skewX} min={-45} max={45} suffix="°" onChange={(v) => updateSelectedLayer({ skewX: v })} />
                  </div>
                  <SliderControl label="Rotazione" value={selectedLayer.rotate} min={-180} max={180} suffix="°" onChange={(v) => updateSelectedLayer({ rotate: v })} />
                  <SliderControl label="Arrotondamento" value={parseInt(selectedLayer.borderRadius) || 0} min={0} max={100} suffix="%" onChange={(v) => updateSelectedLayer({ borderRadius: `${v}%` })} />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {SHAPE_PRESETS.map(s => {
                    const isActive = selectedLayer.presetName === s.name;
                    return (
                      <button 
                        key={s.name}
                        onClick={() => updateSelectedLayer({ 
                          clipPath: s.path, 
                          borderRadius: s.borderRadius || "0%",
                          type: s.path === "none" ? "rectangle" : "polygon",
                          presetName: s.name,
                          ...(s.color ? { backgroundColor: s.color } : {}),
                          ...(s.scale ? { scale: s.scale } : {}),
                          ...(s.width ? { width: s.width } : {}),
                          ...(s.height ? { height: s.height } : {})
                        })}
                        className={cn(
                          "py-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all overflow-hidden",
                          isActive 
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" 
                            : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400"
                        )}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </ControlGroup>

              <ControlGroup label="Stile & Colore">
                <div className="flex items-center gap-8 mb-4">
                  <div className="relative group/color">
                    <div 
                      className="w-24 h-24 rounded-[32px] border-8 border-white shadow-2xl cursor-pointer ring-4 ring-indigo-50" 
                      style={{ background: selectedLayer.backgroundColor }} 
                    />
                    <input 
                      type="color" 
                      value={selectedLayer.backgroundColor}
                      onChange={(e) => updateSelectedLayer({ backgroundColor: e.target.value })}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <label className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Colore Hex</label>
                    <input 
                      type="text" 
                      value={selectedLayer.backgroundColor} 
                      onChange={(e) => updateSelectedLayer({ backgroundColor: e.target.value })}
                      className="w-full bg-white border-4 border-zinc-200 rounded-3xl px-6 py-4 text-lg font-mono font-bold text-zinc-900 outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </ControlGroup>

              <ControlGroup label="Ombre & Luce">
                 <div className="space-y-10">
                   <SliderControl label="Sfocatura" value={selectedLayer.shadowBlur} min={0} max={100} suffix="px" onChange={(v) => updateSelectedLayer({ shadowBlur: v })} />
                   <SliderControl label="Spinta" value={selectedLayer.shadowSpread} min={-20} max={50} suffix="px" onChange={(v) => updateSelectedLayer({ shadowSpread: v })} />
                 </div>
              </ControlGroup>

            </motion.div>
          )}

          {activeTab === 'presets' && (
            <motion.div key="presets">
              <SidebarHeader icon={Shapes} colorClass="text-rose-600">Scene Pronte</SidebarHeader>
              <div className="space-y-8">
                {ART_PRESETS.map(p => (
                  <button 
                    key={p.name}
                    onClick={() => { setLayers(p.layers); setSelectedLayerId(p.layers[0].id); }}
                    className="w-full p-10 bg-white border-4 border-zinc-200 rounded-[48px] text-left hover:border-rose-400 hover:shadow-2xl transition-all group relative overflow-hidden"
                  >
                    <h3 className="text-2xl font-black text-zinc-900 mb-3 tracking-tight group-hover:text-rose-600 transition-colors uppercase">{p.name}</h3>
                    <p className="text-base text-zinc-500 leading-relaxed font-bold">{p.description}</p>
                    <div className="mt-6 flex gap-2">
                       {p.layers.slice(0, 3).map((l, i) => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-white" style={{ background: l.backgroundColor }} />
                       ))}
                       <span className="text-xs font-bold text-zinc-300 flex items-center">+{p.layers.length - 3}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'code' && (
            <motion.div key="code">
              <SidebarHeader icon={Terminal} colorClass="text-zinc-950">CSS Master Code</SidebarHeader>
              <div className="relative mb-10">
                <button onClick={handleCopy} className="absolute right-6 top-6 p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors z-10 shadow-lg">
                  {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                </button>
                <div className="bg-zinc-900 border-8 border-black rounded-[48px] p-10 pt-16 max-h-[70vh] overflow-y-auto custom-scrollbar shadow-2xl">
                  <pre className="text-sm font-mono text-indigo-300 leading-relaxed">
                    {generateFullCSS}
                  </pre>
                </div>
              </div>
              <div className="p-10 bg-indigo-600 text-white rounded-[40px] shadow-2xl shadow-indigo-200 border-4 border-indigo-400">
                <h4 className="text-xl font-black mb-4 uppercase tracking-wider">Pronto per il Deploy!</h4>
                <p className="text-base leading-relaxed font-bold opacity-90">
                  Copia questo codice nel tuo progetto. Funziona con qualsiasi browser moderno che supporta CSS standard.
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Main Workbench Area */}
      <div className="flex-1 flex flex-col relative bg-zinc-900 overflow-hidden">
        
        {/* Top Header */}
        <div className="h-24 border-b border-white/5 bg-zinc-950 flex items-center justify-between px-16 shrink-0 z-20 shadow-2xl">
           <div className="flex items-center gap-10">
              <div className="flex flex-col">
                <h1 className="text-2xl font-black tracking-tight text-white">LABORATORIO ARTISTICO CSS</h1>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Engine V2.8 // Professional Control</span>
              </div>
              <div className="h-10 w-px bg-white/10 mx-4" />
              <div className="flex items-center gap-6">
                 <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg">
                    <button onClick={undo} disabled={historyIndex === 0} className="p-3 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all border-r border-white/10" title="Annulla (Ctrl+Z)"><RotateCcw className="w-5 h-5" /></button>
                    <button onClick={redo} disabled={historyIndex === history.length - 1} className="p-3 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all" title="Ripristina (Ctrl+Shift+Z)"><RotateCw className="w-5 h-5" /></button>
                 </div>
                 <button 
                  onClick={() => setShowGrid(!showGrid)}
                  className={cn("text-xs font-black transition-all px-4 py-2 rounded-xl border-2", showGrid ? "bg-indigo-600 border-indigo-600 text-white" : "border-white/10 text-zinc-500 hover:text-white")}
                 >
                   GRIGLIA: {showGrid ? "SI" : "NO"}
                 </button>
                 <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                    <span className="text-[10px] font-black text-zinc-500 uppercase">Zoom:</span>
                    <span className="text-xs font-mono font-bold text-indigo-400">{Math.round(zoom * 100)}%</span>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-10">
              <div className="text-sm font-black text-zinc-400 px-6 py-2.5 bg-white/5 rounded-2xl border border-white/10">{layers.length} LIVELLI NEL PROGETTO</div>
              <div className="flex items-center gap-4">
                 <button className="p-4 text-zinc-400 hover:text-white bg-white/5 rounded-2xl border-2 border-white/10 transition-all"><MousePointer2 className="w-8 h-8" /></button>
                 <button className="p-4 text-zinc-400 hover:text-white bg-white/5 rounded-2xl border-2 border-white/10 transition-all"><Move className="w-8 h-8" /></button>
              </div>
           </div>
        </div>

        {/* Workspace Viewport */}
        <div className="flex-1 relative overflow-auto custom-scrollbar flex items-center justify-center p-40 bg-zinc-950">
          
          {/* Zoom Controls */}
          <div className="fixed bottom-24 right-16 flex flex-col gap-4 z-40">
             <button onClick={() => setZoom(prev => Math.min(3, prev + 0.2))} className="w-16 h-16 bg-white rounded-3xl shadow-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all font-black text-3xl shadow-indigo-500/20">+</button>
             <button onClick={() => setZoom(1)} className="w-16 h-12 bg-zinc-800 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-indigo-600 transition-all font-black text-xs">100%</button>
             <button onClick={() => setZoom(prev => Math.max(0.1, prev - 0.2))} className="w-16 h-16 bg-white rounded-3xl shadow-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all font-black text-3xl shadow-indigo-500/20">-</button>
          </div>

          <div 
            className="relative shrink-0"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.1s ease-out' }}
          >
            {/* Studio Grid */}
            {showGrid && (
              <div className="absolute -inset-[500px] pointer-events-none opacity-[0.3]" style={{
                backgroundImage: `
                  radial-gradient(circle at 2px 2px, #6366f1 2px, transparent 0)
                `,
                backgroundSize: '40px 40px'
              }} />
            )}

            {/* Composition Stage */}
            <div className="relative w-[800px] h-[800px] bg-white rounded-[100px] shadow-[0_120px_240px_-60px_rgba(0,0,0,0.8)] border-[24px] border-white ring-1 ring-white/20 checkerboard">
               <div className="absolute top-12 left-12 text-sm font-black text-zinc-300 uppercase tracking-[0.6em] z-0 select-none">Canvas_V2_800x800</div>
               
               {layers.map(layer => (
                  <motion.div
                    key={layer.id}
                    drag
                    dragMomentum={false}
                    dragElastic={0}
                    onDragStart={() => {
                        setSelectedLayerId(layer.id);
                        setIsDragging(true);
                    }}
                    onDragEnd={(e, info) => {
                       setIsDragging(false);
                       const deltaX = info.offset.x / zoom;
                       const deltaY = info.offset.y / zoom;
                       updateSelectedLayer({
                         top: Math.round(layer.top + deltaY),
                         left: Math.round(layer.left + deltaX)
                       });
                    }}
                    onClick={(e) => { e.stopPropagation(); setSelectedLayerId(layer.id); }}
                    initial={false}
                    animate={{
                      width: layer.width,
                      height: layer.height,
                      top: layer.top,
                      left: layer.left,
                      zIndex: layer.zIndex,
                      backgroundColor: layer.backgroundColor,
                      borderRadius: layer.borderRadius,
                      rotate: layer.rotate,
                      scale: layer.scale,
                      opacity: layer.opacity,
                      clipPath: layer.clipPath,
                      filter: `blur(${layer.filter?.blur || 0}px) contrast(${layer.filter?.contrast || 100}%) brightness(${layer.filter?.brightness || 100}%)`,
                      boxShadow: `${layer.shadowX}px ${layer.shadowY}px ${layer.shadowBlur}px ${layer.shadowSpread}px ${layer.shadowColor}`,
                      border: layer.borderWidth > 0 ? `${layer.borderWidth}px ${layer.borderStyle} ${layer.borderColor}` : 'none'
                    }}
                    className={cn(
                      "absolute transition-[box-shadow,ring] duration-300",
                      selectedLayerId === layer.id ? "z-[500] cursor-grabbing shadow-2xl ring-4 ring-white/50" : "cursor-grab hover:ring-[12px] hover:ring-indigo-500/10"
                    )}
                  >
                     {/* Selection Highlights */}
                     {selectedLayerId === layer.id && (
                       <div className="absolute -inset-8 border-[6px] border-indigo-600 rounded-[48px] pointer-events-none shadow-[0_0_100px_rgba(99,102,241,0.5)]">
                          <div className="absolute -top-6 -left-6 w-12 h-12 bg-white border-[6px] border-indigo-600 rounded-full shadow-2xl" />
                          <div className="absolute -top-6 -right-6 w-12 h-12 bg-white border-[6px] border-indigo-600 rounded-full shadow-2xl" />
                          <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white border-[6px] border-indigo-600 rounded-full shadow-2xl" />
                          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-white border-[6px] border-indigo-600 rounded-full shadow-2xl" />
                       </div>
                     )}
                  </motion.div>
               ))}
            </div>
          </div>


        </div>

        {/* Footer Area */}
        <div className="h-16 border-t border-zinc-400 bg-zinc-100 flex items-center justify-between px-16 text-sm font-black text-zinc-600 pointer-events-none z-20">
           <div className="flex gap-12">
              <span className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-300" />
                SISTEMA OPERATIVO
              </span>
              <span className="flex items-center gap-4">
                 <div className="w-2 h-2 rounded-full bg-zinc-500" />
                 MODELLO_A_LIVELLI
              </span>
           </div>
           <span className="tracking-[0.3em]">STUDIO_CREATIVO_CSS // V2.5.1</span>
        </div>
      </div>
    </div>
  );
}

// --- Icons & Sub-Components ---

const NavBtn = ({ icon: Icon, active, onClick, label }: { icon: any, active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={cn(
      "group relative p-5 rounded-[24px] transition-all duration-500",
      active 
        ? "bg-indigo-600 text-white shadow-2xl scale-125" 
        : "text-zinc-600 hover:text-white"
    )}
  >
    <Icon className="w-8 h-8" />
    <span className="absolute left-28 scale-0 group-hover:scale-100 transition-all duration-300 bg-white text-zinc-950 px-6 py-3 rounded-2xl text-base font-black uppercase whitespace-nowrap z-50 shadow-2xl border-4 border-zinc-50">
      {label}
    </span>
  </button>
);

const ShapeBtn = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-4 py-8 rounded-[40px] border-4 transition-all shadow-xl",
      active 
        ? "bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-105" 
        : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:bg-zinc-50"
    )}
  >
    <Icon className="w-10 h-10" />
    <span className="text-sm font-black uppercase tracking-widest">{label}</span>
  </button>
);

// --- Utils ---
