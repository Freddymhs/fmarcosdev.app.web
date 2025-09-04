import { tv } from "tailwind-variants";

interface LayoutDimensions {
  viewport: number;
  headerHeight: number;
  footerHeight: number;
  mainHeight: number;
  headerHeightVh: number;
  footerHeightVh: number;
  mainHeightVh: number;
}

interface LayoutDebugPanelProps {
  show?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  layoutData: LayoutDimensions;
}

const debugPanelStyles = tv({
  base: "fixed z-[9999] bg-black/80 text-white text-xs font-mono p-3 rounded border border-gray-500 backdrop-blur-sm",
  variants: {
    position: {
      "top-left": "top-4 left-4",
      "top-right": "top-4 right-4", 
      "bottom-left": "bottom-4 left-4",
      "bottom-right": "bottom-4 right-4",
    },
  },
});

const debugItemStyles = tv({
  base: "flex justify-between gap-4 py-1",
});

const debugLabelStyles = tv({
  base: "text-gray-300",
});

const debugValueStyles = tv({
  base: "text-green-400 font-bold",
});

const LayoutDebugPanel = ({ 
  show = false, 
  position = "bottom-right",
  layoutData
}: LayoutDebugPanelProps) => {

  if (!show) return null;

  return (
    <div className={debugPanelStyles({ position })}>
      <div className="mb-2 text-yellow-400 font-bold">🔧 Layout Debug</div>
      
      {/* Viewport Info */}
      <div className={debugItemStyles()}>
        <span className={debugLabelStyles()}>Viewport:</span>
        <span className={debugValueStyles()}>{layoutData.viewport}px</span>
      </div>

      {/* Configuration Section */}
      <div className="mt-3 mb-1 text-cyan-400 text-xs font-bold">📐 CONFIGURED:</div>
      <div className={debugItemStyles()}>
        <span className={debugLabelStyles()}>Header:</span>
        <span className="text-cyan-400 font-bold">{layoutData.headerHeightVh}vh</span>
      </div>
      <div className={debugItemStyles()}>
        <span className={debugLabelStyles()}>Main:</span>
        <span className="text-cyan-400 font-bold">{layoutData.mainHeightVh}vh</span>
      </div>
      <div className={debugItemStyles()}>
        <span className={debugLabelStyles()}>Footer:</span>
        <span className="text-cyan-400 font-bold">{layoutData.footerHeightVh}vh</span>
      </div>

      {/* Real Calculations Section */}
      <div className="mt-3 mb-1 text-green-400 text-xs font-bold">📏 CALCULATED (REAL-TIME):</div>
      <div className={debugItemStyles()}>
        <span className={debugLabelStyles()}>Header:</span>
        <span className={debugValueStyles()}>{layoutData.headerHeight}px</span>
      </div>
      <div className={debugItemStyles()}>
        <span className={debugLabelStyles()}>Main:</span>
        <span className={debugValueStyles()}>{layoutData.mainHeight}px</span>
      </div>
      <div className={debugItemStyles()}>
        <span className={debugLabelStyles()}>Footer:</span>
        <span className={debugValueStyles()}>{layoutData.footerHeight}px</span>
      </div>

      {/* Validation */}
      <div className="mt-3 mb-1 text-white text-xs">
        Total: {layoutData.headerHeight + layoutData.mainHeight + layoutData.footerHeight}px
        {layoutData.headerHeight + layoutData.mainHeight + layoutData.footerHeight === layoutData.viewport && 
          <span className="text-green-400 ml-2">✅</span>
        }
      </div>
    </div>
  );
};

export default LayoutDebugPanel;