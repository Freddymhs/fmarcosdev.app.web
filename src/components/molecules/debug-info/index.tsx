const DebugInfo = ({
  allComponentsHeight = [],
  areaHeight,
}: {
  allComponentsHeight: number[];
  areaHeight: number;
}) => (
  <div className="fixed bottom-4 left-4 border text-black text-xs p-2 rounded z-50 shadow-lg bg-white">
    <div>🐛 DEBUG ON</div>
    {allComponentsHeight.map((value, index) => (
      <div key={`component-${index}`}>
        Component {index + 1}: {value}vh
      </div>
    ))}
    <div>Assigned (Footer): {areaHeight}vh</div>
  </div>
);

export default DebugInfo;
