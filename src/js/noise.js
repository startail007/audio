import { Vector } from "./vector";
import { Float } from "./float";
const random = (p, loop) => {
  if (loop[0] != 0) {
    p[0] = p[0] % loop[0];
  }
  if (loop[1] != 0) {
    p[1] = p[1] % loop[1];
  }
  const f = Vector.dot(p, [127.1, 311.7]);
  return -1 + 2 * Float.fract(Math.sin(f) * 43758.5453123);
};
const random2 = (p, loop) => {
  if (loop[0] != 0) {
    p[0] = p[0] % loop[0];
  }
  if (loop[1] != 0) {
    p[1] = p[1] % loop[1];
  }
  const f = [Vector.dot(p, [127.1, 311.7]), Vector.dot(p, [269.5, 183.3])];
  return Vector.sub(Vector.scale(Vector.fract(Vector.scale(Vector.sin(f), 43758.5453123)), 2), [1, 1]);
};
const noise_perlin = (p, loop) => {
  const i = Vector.floor(p);
  const f = Vector.fract(p);
  const a = Vector.dot(random2(i, loop), f);
  const b = Vector.dot(random2(Vector.add(i, [1, 0]), loop), Vector.sub(f, [1, 0]));
  const c = Vector.dot(random2(Vector.add(i, [0, 1]), loop), Vector.sub(f, [0, 1]));
  const d = Vector.dot(random2(Vector.add(i, [1, 1]), loop), Vector.sub(f, [1, 1]));
  const u = Vector.mul(Vector.mul(f, f), Vector.sub([3, 3], Vector.scale(f, 2)));
  return Float.mix(Float.mix(a, b, u[0]), Float.mix(c, d, u[0]), u[1]);
};

const noise_value = (p, loop) => {
  const i = Vector.floor(p);
  const f = Vector.fract(p);
  const u = Vector.mul(Vector.mul(f, f), Vector.sub([3, 3], Vector.scale(f, 2)));
  const a = random(i, loop);
  const b = random(Vector.add(i, [1, 0]), loop);
  const c = random(Vector.add(i, [0, 1]), loop);
  const d = random(Vector.add(i, [1, 1]), loop);
  return Float.mix(Float.mix(a, b, u[0]), Float.mix(c, d, u[0]), u[1]);
};
export { noise_perlin, noise_value };
