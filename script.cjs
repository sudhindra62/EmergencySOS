const fs = require("fs");

let code = fs.readFileSync("./src/components/SmartBinDigitalTwin.tsx", "utf-8");

const bgReplacement = `      {/* Global Visual Engine */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_0%,#041128_0%,#020612_80%)]"></div>
      {/* Elegance Glow Layer (like the second image) */}
      <div className="absolute top-0 right-0 w-[80%] h-full bg-[radial-gradient(ellipse_at_right_center,rgba(0,230,255,0.08)_0%,transparent_70%)] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,255,178,0.05)_0%,transparent_60%)] pointer-events-none z-0"></div>`;

code = code.replace(
  /<div className="absolute inset-0 z-0 bg-\[radial-gradient[^\]]+\]">\s*<\/div>/,
  bgReplacement,
);

const tabReplacement = `<div className="absolute inset-0 transition-opacity duration-700" style={{ 
                  background: isActive 
                     ? \`radial-gradient(ellipse at right, \${step.color}60 0%, transparent 80%), radial-gradient(ellipse at left, \${step.color}20 0%, transparent 80%)\` 
                     : 'transparent',
                  opacity: isActive ? 1 : 0 
                }}></div>`;

code = code.replace(
  /<div className="absolute inset-0 transition-opacity duration-700" style=\{\{ backgroundColor: step\.color, opacity: bgOpacity \}\}\><\/div>/,
  tabReplacement,
);

code = code.replace(
  /backgroundColor: !isHazardous && stage >= 6 \? `\$\{targetColorHex\}25` : 'rgba\(0, 255, 178, 0\.05\)'/g,
  `background: !isHazardous && stage >= 6 ? \`radial-gradient(ellipse at right, \${targetColorHex}50 0%, transparent 90%), \${targetColorHex}15\` : 'rgba(0, 255, 178, 0.03)'`,
);

code = code.replace(
  /backgroundColor: isHazardous && stage >= 6 \? `\$\{targetColorHex\}25` : 'rgba\(255, 41, 101, 0\.05\)'/g,
  `background: isHazardous && stage >= 6 ? \`radial-gradient(ellipse at right, \${targetColorHex}50 0%, transparent 90%), \${targetColorHex}15\` : 'rgba(255, 41, 101, 0.03)'`,
);

code = code.replace(
  /boxShadow: isActive \? `0 0 35px \$\{shadowColor\}90, inset 0 0 20px \$\{shadowColor\}60` : isPast \? `0 0 15px \$\{shadowColor\}40` : '0 4px 10px rgba\\(0,0,0,0\\.5\\)'/g,
  `boxShadow: isActive ? \`0 0 30px \${shadowColor}70, inset 0 1px 1px \${shadowColor}90, inset 0 -5px 15px \${shadowColor}20\` : isPast ? \`0 0 15px \${shadowColor}40\` : '0 4px 10px rgba(0,0,0,0.5)'`,
);

fs.writeFileSync("./src/components/SmartBinDigitalTwin.tsx", code);
