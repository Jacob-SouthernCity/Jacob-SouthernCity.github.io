export type LatLng = [number, number];

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

export function centroid(locations: readonly LatLng[]): LatLng {
  let x = 0;
  let y = 0;
  let z = 0;
  for (const [latitude, longitude] of locations) {
    const lat = toRadians(latitude);
    const lng = toRadians(longitude);
    x += Math.cos(lat) * Math.cos(lng);
    y += Math.cos(lat) * Math.sin(lng);
    z += Math.sin(lat);
  }
  return [toDegrees(Math.atan2(z, Math.hypot(x, y))), toDegrees(Math.atan2(y, x))];
}

export function angularDistance([lat1, lng1]: LatLng, [lat2, lng2]: LatLng) {
  const a = toRadians(lat1);
  const b = toRadians(lat2);
  const deltaLng = toRadians(lng2 - lng1);
  return Math.acos(
    Math.min(1, Math.sin(a) * Math.sin(b) + Math.cos(a) * Math.cos(b) * Math.cos(deltaLng))
  );
}

export function flagEmoji(countryCode: string) {
  return String.fromCodePoint(
    ...[...countryCode.toUpperCase()].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65)
  );
}
