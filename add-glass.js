const fs = require("fs");
const file = "src/components/EmergencyDashboard.tsx";
let data = fs.readFileSync(file, "utf8");
data = data.replace(
  /(<div className="[^"]*premium-card.*?>)/g,
  '$1\n            <div className="glass-reflection"></div>',
);
fs.writeFileSync(file, data);
