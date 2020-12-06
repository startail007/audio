import { Vector, VectorE } from "../js/vector";
import metalHits_mp3 from "./metalHits.mp3";
import Bed_and_Breakfast_mp3 from "./Bed_and_Breakfast.mp3";

const getBuffer = async (audioCtx, src) => {
  const response = await fetch(src);
  const arraybuffer = await response.arrayBuffer();
  const buffer = await audioCtx.decodeAudioData(arraybuffer);
  return buffer;
};
const soundEffectFrequency = async () => {
  const btn = document.getElementById("btn");
  const box = document.getElementById("box");

  const audioCtx = new AudioContext();
  audioCtx.addEventListener("statechange", () => {
    if (audioCtx.state == "suspended") {
      btn.textContent = "撥放";
    } else {
      btn.textContent = "暫停";
    }
  });
  const source = audioCtx.createBufferSource();
  const buffer = await getBuffer(audioCtx, Bed_and_Breakfast_mp3);
  source.buffer = buffer;

  /*source.addEventListener("ended", () => {
    audioCtx.suspend();
  });*/
  //source.playbackRate.value = 4;

  const compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.value = -50;
  compressor.knee.value = 40;
  compressor.ratio.value = 12;
  compressor.attack.value = 0;
  compressor.release.value = 0.25;

  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 1;

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 128;

  source.connect(compressor);
  compressor.connect(gainNode);
  gainNode.connect(analyser);
  analyser.connect(audioCtx.destination);
  source.start();
  source.loop = true;

  const box_size = [box.clientWidth, box.clientHeight];
  const box_ctx = box.getContext("2d");
  if (audioCtx.state == "suspended") {
    btn.textContent = "撥放";
  } else {
    btn.textContent = "暫停";
  }

  btn.addEventListener("click", () => {
    if (audioCtx.state == "suspended") {
      audioCtx.resume();
    } else {
      audioCtx.suspend();
    }
  });

  const updateAnimation = () => {
    requestAnimationFrame(updateAnimation);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(dataArray);

    /*const dataArray = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(dataArray);*/

    box_ctx.clearRect(0, 0, ...box_size);
    //box_ctx.fillStyle = "#0000ff";
    //box_ctx.beginPath();
    dataArray.forEach((el, index, array) => {
      const rate = Vector.inverseMix([0, 0], [array.length, 256], [index, el]);
      const pos = Vector.mix([0, 0], box_size, rate);
      const w = box_size[0] / array.length;

      box_ctx.fillStyle = `hsl(${rate[0] * 360},100%,50%)`;
      box_ctx.fillRect(pos[0], box_size[1] - pos[1], w, pos[1]);
      box_ctx.strokeStyle = `hsl(${rate[0] * 360},100%,50%)`;
      box_ctx.strokeRect(pos[0], box_size[1] - pos[1], w, pos[1]);
    });
    //box_ctx.stroke();
  };

  updateAnimation();
};

const main = () => {
  soundEffectFrequency();
};
main();
