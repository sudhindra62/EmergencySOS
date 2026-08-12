// Dynamic routing logic generating polyline waypoints for Map layers

export class RouteSimulator {
  static async getRealRoute(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ): Promise<[number, number][]> {
    try {
      // OSRM coordinates are in lng,lat format
      const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates; // array of [lng, lat]
        return coords.map((c: [number, number]) => [c[1], c[0]]); // convert to [lat, lng]
      }
    } catch (err) {
      console.error("OSRM Route fetching failed", err);
    }
    
    // Fallback if failed
    return [
      [startLat, startLng],
      [endLat, endLng]
    ];
  }
}

