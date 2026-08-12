import fs from "fs";
const content = fs.readFileSync("server.ts", "utf-8");
const updated = content.replace(/gemini-1\.5-flash/g, "gemini-2.5-flash");
fs.writeFileSync("server.ts", updated);
