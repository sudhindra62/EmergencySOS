// Evaluates building structures (simulated via geo data) shifting color based on Incident severity
// Normal -> Affected (Yellow) -> Critical (Red) -> Hospital (Green)

export class BuildingStateEngine {
  static getBuildingColor(
    type: "hospital" | "affected" | "normal" | "critical",
  ) {
    switch (type) {
      case "hospital":
        return "#22c55e"; // green
      case "affected":
        return "#eab308"; // yellow
      case "critical":
        return "#ef4444"; // red
      default:
        return "#1e293b"; // normal low opacity
    }
  }
}
