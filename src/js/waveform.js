import { Float } from "./float";

class Waveform {
  static create(start = 0, end = array.length) {
    return new Float32Array(parseInt(end - start));
  }
  static set(array, val, start = 0, end = array.length) {
    for (let i = start; i < end; i++) {
      const index = parseInt(i);
      array[index] = val;
    }
  }
  static mul(array, val, start = 0, end = array.length) {
    for (let i = parseInt(start); i < parseInt(end); i++) {
      const index = parseInt(i);
      array[index] = val * array[index];
    }
  }
  static slope(array, min = 0, max = 1, start = 0, end = array.length) {
    for (let i = start; i < end; i++) {
      const index = parseInt(i);
      const rate = Float.mix(min, max, Float.inverseMix(start, end, i));
      array[index] = rate * array[index];
    }
  }
  static run(array, fun, start = 0, end = array.length) {
    for (let i = parseInt(start); i < parseInt(end); i++) {
      const index = parseInt(i);
      const rate = Float.inverseMix(start, end, i);
      array[index] = fun(array[index], rate);
    }
  }
}
export { Waveform };
