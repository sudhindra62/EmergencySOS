import https from "https";

https
  .get("https://openrouter.ai/api/v1/models", (resp) => {
    let data = "";
    resp.on("data", (chunk) => {
      data += chunk;
    });
    resp.on("end", () => {
      const models = JSON.parse(data).data;
      const geminiModels = models.filter((m: any) => m.id.includes("gemini"));
      console.log(geminiModels.map((m: any) => m.id).join("\n"));
    });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  });
