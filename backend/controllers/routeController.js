export function allocateSurplus(surplus, ngos) {
  let remaining = Number(surplus || 0);
  const out = [];
  // Sort NGOs by demand desc to maximize coverage quickly
  const sorted = [...ngos].sort((a,b)=> Number(b.demand) - Number(a.demand));
  for (const ngo of sorted) {
    if (remaining <= 0) break;
    const give = Math.min(Number(ngo.demand || 0), remaining);
    if (give > 0) {
      out.push({ ngoId: ngo.id, ngoName: ngo.name, meals: give, lat: ngo.lat || null, lng: ngo.lng || null });
      remaining -= give;
    }
  }
  return { allocated: out, leftover: Math.max(0, remaining) };
}

function haversine(a, b){
  const toRad = x => x * Math.PI / 180;
  const R = 6371; // km
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}

export function computeRoute(start, stops){
  // start: {lat,lng}, stops: [{id,lat,lng}]
  if(!stops || stops.length===0) return [];
  const unvisited = stops.map(s => ({...s}));
  const path = [];
  let current = {...start};
  while(unvisited.length>0){
    unvisited.sort((A,B)=> haversine(current,A) - haversine(current,B));
    const next = unvisited.shift();
    path.push(next);
    current = next;
  }
  return path;
}