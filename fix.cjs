const fs = require("fs");
let code = fs.readFileSync("./src/components/SmartBinDigitalTwin.tsx", "utf-8");

code = code.replace(
  /animate=\{\{ rotate: trayRotated \? \(isHazardous \? 35 : -35\) : 0 \}\}/,
  "animate={{ rotateZ: trayRotated ? (isHazardous ? 35 : -35) : 0 }}",
);

code = code.replace(
  /className="absolute top-0 left-0 w-full h-\[5px\] rounded-full origin-center shadow-\[0_5px_20px_rgba\(0,0,0,0\.9\)\] z-20 flex justify-center overflow-hidden transition-all duration-700"/,
  'className="w-full h-2 rounded-full mx-auto origin-center shadow-[0_5px_20px_rgba(0,0,0,0.9)] z-20 flex justify-center overflow-hidden transition-all duration-700"',
);

code = code.replace(
  /rotate: stage === 5 \? \(isHazardous \? 45 : -45\) : 0,/,
  "rotate: stage >= 4 ? (isHazardous ? 90 : -90) : 0,",
);

code = code.replace(
  /y: stage === 1 \? 40 : stage === 5 \? "400%" : 40,/,
  "y: stage === 1 ? 40 : stage >= 4 ? 60 : 40,",
);

code = code.replace(
  /x: stage === 5 \? \(isHazardous \? "100%" : "-200%"\) : "-50%"/,
  'x: stage === 5 ? (isHazardous ? "200%" : "-300%") : "-50%"',
);

fs.writeFileSync("./src/components/SmartBinDigitalTwin.tsx", code);
