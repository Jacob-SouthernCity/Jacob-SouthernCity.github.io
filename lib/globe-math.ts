import { angularDistance, centroid, type LatLng } from "./geo";

export type Rotation = {
  phi: number;
  theta: number;
};

export type ScreenPoint = {
  x: number;
  y: number;
  visible: boolean;
};

const GLOBE_RADIUS = 0.8;

export function anglesFor([latitude, longitude]: LatLng): Rotation {
  return {
    phi: Math.PI - ((longitude * Math.PI) / 180 - Math.PI / 2),
    theta: (latitude * Math.PI) / 180,
  };
}

export function projectToScreen(
  [latitude, longitude]: LatLng,
  { phi, theta }: Rotation,
  scale: number,
  size: number
): ScreenPoint {
  const lat = (latitude * Math.PI) / 180;
  const lng = (longitude * Math.PI) / 180 - Math.PI;
  const px = -Math.cos(lat) * Math.cos(lng);
  const py = Math.sin(lat);
  const pz = Math.cos(lat) * Math.sin(lng);

  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);

  const qx = cosPhi * px + sinPhi * pz;
  const qy = sinPhi * sinTheta * px + cosTheta * py - cosPhi * sinTheta * pz;
  const qz = -sinPhi * cosTheta * px + sinTheta * py + cosPhi * cosTheta * pz;

  const clipX = GLOBE_RADIUS * scale * qx;
  const clipY = GLOBE_RADIUS * scale * qy;
  return {
    x: ((clipX + 1) / 2) * size,
    y: ((1 - clipY) / 2) * size,
    visible: qz > 0,
  };
}

export function screenRadiansPerPixel(size: number, scale: number) {
  return 1 / ((GLOBE_RADIUS * scale * size) / 2);
}

export type ClusterInput<Item> = {
  item: Item;
  location: LatLng;
  pinned: boolean;
};

export type Cluster<Item> = {
  items: Item[];
  location: LatLng;
};

export function clusterByDistance<Item>(
  inputs: readonly ClusterInput<Item>[],
  maxAngle: number
): Cluster<Item>[] {
  const clusters: { items: Item[]; locations: LatLng[]; pinned: boolean }[] = [];
  for (const { item, location, pinned } of inputs) {
    const target = pinned
      ? undefined
      : clusters.find(
          (cluster) => !cluster.pinned && angularDistance(cluster.locations[0], location) <= maxAngle
        );
    if (target) {
      target.items.push(item);
      target.locations.push(location);
    } else {
      clusters.push({ items: [item], locations: [location], pinned });
    }
  }
  return clusters.map(({ items, locations }) => ({
    items,
    location: locations.length === 1 ? locations[0] : centroid(locations),
  }));
}
