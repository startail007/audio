import Listener from "./listener";
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

class Drag extends Listener {
  constructor(element) {
    super();
    this.element = element;
    this.mousedown = false;
    const start = (e) => {
      if (!this.mousedown) {
        this.mousedown = true;
        this.fire("start", e);
        e.preventDefault();
      }
    };
    const move = (e) => {
      if (this.mousedown) {
        this.fire("move", e);
        e.preventDefault();
      }
    };
    const end = (e) => {
      if (this.mousedown) {
        this.mousedown = false;
        this.fire("end", e);
        e.preventDefault();
      }
    };

    if (isMobile()) {
      this.element.addEventListener("touchstart", start);
      this.element.addEventListener("touchmove", move);
      this.element.addEventListener("touchend", end);
    } else {
      const a_start = (e) => {
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", a_end);
        start(e);
      };
      const a_end = (e) => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", a_end);
        end(e);
      };
      this.element.addEventListener("mousedown", a_start);
    }
  }
}
export default Drag;
