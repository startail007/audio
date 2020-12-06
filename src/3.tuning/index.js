import Drag from "../js/drag";
import { Float } from "../js/float";
import { Vector, VectorE } from "../js/vector";
import { noise_perlin, noise_value } from "../js/noise";
import { Waveform } from "../js/waveform";
import bonfire_mp3 from "./bonfire.mp3";
import scifi_mp3 from "./scifi.mp3";
import metalHits_mp3 from "./metalHits.mp3";
import tweeterElectricStatic_mp3 from "./tweeterElectricStatic.mp3";
import water_mp3 from "./water.mp3";
import thunder_mp3 from "./thunder.mp3";
import fire_mp3 from "./fire.mp3";

const getElementPagePos = (element) => {
  const pos = [0, 0];
  let m = element;
  while (m) {
    pos[0] += m.scrollLeft ?? 0;
    pos[1] += m.scrollTop ?? 0;
    m = m.parentElement;
  }
  const rect = element.getBoundingClientRect();
  return [rect.x + pos[0], rect.y + pos[1]];
};
const getBuffer = async (audioCtx, src) => {
  const response = await fetch(src);
  const arraybuffer = await response.arrayBuffer();
  const buffer = await audioCtx.decodeAudioData(arraybuffer);
  return buffer;
};
const soundEffectDraw = async () => {
  const audioCtx = new AudioContext();

  const source = audioCtx.createBufferSource();
  source.buffer = await getBuffer(audioCtx, tweeterElectricStatic_mp3);

  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 1;

  const analyser1 = audioCtx.createAnalyser();
  analyser1.fftSize = 512;
  const timeDomainDataArray = new Uint8Array(analyser1.fftSize);
  const frequencyDataArray1 = new Uint8Array(analyser1.frequencyBinCount);

  const analyser2 = audioCtx.createAnalyser();
  analyser2.fftSize = 512;
  const frequencyDataArray2 = new Uint8Array(analyser2.frequencyBinCount);

  /*const convolver = audioCtx.createConvolver();
  convolver.buffer = await getBuffer(audioCtx, metalHits_mp3);
  convolver.normalize = true;*/

  const compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.value = -50;
  compressor.knee.value = 40;
  compressor.ratio.value = 12;
  compressor.attack.value = 0;
  compressor.release.value = 0.25;

  const biquadFilter = audioCtx.createBiquadFilter();
  //biquadFilter.type = "notch";
  /*console.log(biquadFilter.frequency);
  console.log(biquadFilter.type);
  console.log(biquadFilter.Q);*/

  source.connect(gainNode);
  gainNode.connect(analyser2);
  analyser2.connect(biquadFilter);
  biquadFilter.connect(analyser1);

  const box01 = document.getElementById("box01");
  const box02 = document.getElementById("box02");
  const box01_size = [box01.clientWidth, box01.clientHeight];
  const box02_size = [box02.clientWidth, box02.clientHeight];

  const box01_ctx = box01.getContext("2d");
  const box02_ctx = box02.getContext("2d");

  const drag = new Drag(box01);

  const mPos = [0, 0];
  const mLoc = [0, 0];
  const mMovement = [0, 0];
  let isActive = false;
  const update = () => {
    const rate = Vector.inverseMix([0, 0], box01_size, mLoc);
    const noise = noise_perlin(Vector.add(Vector.scale(rate, 100), [audioCtx.currentTime, 0]), [0, 0]) * 0.5 + 0.5;
    //gainNode.gain.value = 20;
    biquadFilter.frequency.value = Float.mix(
      Float.mix(biquadFilter.frequency.minValue, biquadFilter.frequency.maxValue, 0.25),
      biquadFilter.frequency.maxValue,
      Float.clamp(rate[0])
    );
    //source.playbackRate.value = Float.mix(0.25, 4, Float.clamp(rate[0]));
    biquadFilter.Q.value = Float.mix(-10, 10, Float.clamp(rate[1]));
    //biquadFilter.Q.value = 1;
  };
  drag.on("start", (e) => {
    box01_ctx.clearRect(0, 0, ...box01_size);

    analyser1.connect(audioCtx.destination);
    audioCtx.resume();
    if (!isActive) {
      isActive = true;
      source.start();
      source.loop = true;
      //oscillator.start();
    }

    VectorE.set(mPos, e.pageX, e.pageY);
    const pos = getElementPagePos(box01);
    VectorE.set(mLoc, ...Vector.sub(mPos, pos));
  });
  drag.on("move", (e) => {
    VectorE.set(mPos, e.pageX, e.pageY);
    VectorE.set(mMovement, e.movementX, e.movementY);

    const pos = getElementPagePos(box01);
    VectorE.set(mLoc, ...Vector.sub(mPos, pos));

    box01_ctx.strokeStyle = "#ff0000";
    box01_ctx.beginPath();
    box01_ctx.moveTo(...mLoc);
    box01_ctx.lineTo(...Vector.sub(mLoc, mMovement));
    box01_ctx.stroke();
  });
  drag.on("end", (e) => {
    analyser1.disconnect(audioCtx.destination);
    audioCtx.suspend();
  });

  const updateAnimation = () => {
    requestAnimationFrame(updateAnimation);

    update();

    analyser1.getByteTimeDomainData(timeDomainDataArray);

    box02_ctx.clearRect(0, 0, ...box02_size);
    const hSize = Vector.mul(box02_size, [1, 0.5]);
    box02_ctx.strokeStyle = "#ff0000";
    box02_ctx.beginPath();
    timeDomainDataArray.forEach((el, index, array) => {
      const rate = Vector.inverseMix([0, 256 - 1], [array.length - 1, 0], [index, el]);
      const pos = Vector.mix([0, 0], hSize, rate);
      if (index == 0) {
        box02_ctx.moveTo(...pos);
      } else {
        box02_ctx.lineTo(...pos);
      }
    });
    box02_ctx.stroke();

    analyser1.getByteFrequencyData(frequencyDataArray1);
    box02_ctx.save();
    box02_ctx.lineWidth = 2;
    box02_ctx.strokeStyle = "#ff0000";
    box02_ctx.beginPath();
    frequencyDataArray1.forEach((el, index, array) => {
      const rate = Vector.inverseMix([0, 256 - 1], [array.length - 1, 0], [index, el]);
      const pos = Vector.mix([0, 0], hSize, rate);
      VectorE.add(pos, [0, hSize[1]]);
      if (index == 0) {
        box02_ctx.moveTo(...pos);
      } else {
        box02_ctx.lineTo(...pos);
      }
    });
    box02_ctx.stroke();
    box02_ctx.restore();

    analyser2.getByteFrequencyData(frequencyDataArray2);
    box02_ctx.strokeStyle = "#0000ff";
    box02_ctx.beginPath();
    frequencyDataArray2.forEach((el, index, array) => {
      const rate = Vector.inverseMix([0, 256 - 1], [array.length - 1, 0], [index, el]);
      const pos = Vector.mix([0, 0], hSize, rate);
      VectorE.add(pos, [0, hSize[1]]);
      if (index == 0) {
        box02_ctx.moveTo(...pos);
      } else {
        box02_ctx.lineTo(...pos);
      }
    });
    box02_ctx.stroke();
  };
  updateAnimation();
};

const soundAnalyser = () => {
  const getData = (audioCtx, src) => {
    return new Promise((resolve, reject) => {
      const source = audioCtx.createBufferSource();
      var request = new XMLHttpRequest();

      request.open("GET", src, true);

      request.responseType = "arraybuffer";

      request.onload = () => {
        const audioData = request.response;
        return resolve({ audioCtx, source, audioData });
      };

      request.send();
    });
  };
  const audioCtx = new AudioContext();

  const btn02 = document.getElementById("btn02");

  const box04 = document.getElementById("box04");
  const box04_size = [box04.clientWidth, box04.clientHeight];
  const box04_ctx = box04.getContext("2d");

  const channels = 1;
  const frameCount = audioCtx.sampleRate * 0.5;
  const myArrayBuffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);

  const nowBuffering = myArrayBuffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    const rate = Float.inverseMix(0, frameCount, i);
    nowBuffering[i] = Math.sin(rate * 440 * Math.PI);
  }
  //Waveform.slope(nowBuffering, 0, 1, 0 * audioCtx.sampleRate, 0.02 * audioCtx.sampleRate);
  Waveform.run(
    nowBuffering,
    (el, rate) => Float.mix(0, 1, rate * rate) * el,
    0 * audioCtx.sampleRate,
    0.02 * audioCtx.sampleRate
  );
  //Waveform.slope(nowBuffering, 1, 0.5, 0.02 * audioCtx.sampleRate, 0.1 * audioCtx.sampleRate);
  Waveform.run(
    nowBuffering,
    (el, rate) => Float.mix(1, 0.5, 1 - (1 - rate) * (1 - rate)) * el,
    0.02 * audioCtx.sampleRate,
    0.1 * audioCtx.sampleRate
  );
  Waveform.mul(nowBuffering, 0.5, 0.1 * audioCtx.sampleRate, 0.12 * audioCtx.sampleRate);
  //Waveform.slope(nowBuffering, 0.5, 0, 0.15 * audioCtx.sampleRate, 0.35 * audioCtx.sampleRate);
  Waveform.run(
    nowBuffering,
    (el, rate) => Float.mix(0.5, 0, 1 - (1 - rate) * (1 - rate)) * el,
    0.12 * audioCtx.sampleRate,
    0.5 * audioCtx.sampleRate
  );

  const source = audioCtx.createBufferSource();
  source.buffer = myArrayBuffer;

  //biquadFilter.type = "highpass";
  //biquadFilter.frequency.setValueAtTime(10, audioCtx.currentTime + 0.25);
  //biquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);

  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 1;

  const analyser = audioCtx.createAnalyser();

  const processor = audioCtx.createScriptProcessor(2048, 1, 1);

  const compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);
  compressor.knee.setValueAtTime(40, audioCtx.currentTime);
  compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
  compressor.attack.setValueAtTime(0, audioCtx.currentTime);
  compressor.release.setValueAtTime(0.25, audioCtx.currentTime);

  audioCtx.suspend();
  //source.loop = true;
  source.connect(gainNode);
  gainNode.connect(compressor);

  compressor.connect(analyser);

  analyser.connect(audioCtx.destination);

  //console.log(source);

  //console.log(source, analyser);

  //const destination = myArrayBuffer.getChannelData(0);

  const destination = new Float32Array(frameCount);

  btn02.addEventListener("click", () => {
    /*getData(audioCtx, metalHits_mp3).then((data) => {
      const { audioCtx, source, audioData } = data;
      audioCtx.decodeAudioData(audioData).then((decodedData) => {
        source.buffer = decodedData;
        const destination = decodedData.getChannelData(0);
        console.log(decodedData, destination);

        const draw = (start, end, segment, move = 0) => {
          box04_ctx.beginPath();
          for (let i = 0, len = end - start; i < len; i++) {
            const val = destination[start + i];
            const rate = Vector.inverseMix([0, 1], [segment, -1], [move + i, val]);
            const pos = Vector.mix([0, 0], box04_size, rate);
            if (i == 0) {
              box04_ctx.moveTo(...pos);
            } else {
              box04_ctx.lineTo(...pos);
            }
          }
          box04_ctx.stroke();
        };
        box04_ctx.clearRect(0, 0, ...box04_size);
        box04_ctx.strokeStyle = "#ff0000";
        draw(0, decodedData.length, decodedData.length, 0);

        audioCtx.resume();
        source.connect(audioCtx.destination);
        source.start(0);
        //source.loop = true;
      });
    });*/
    audioCtx.resume();
    source.start(0);
    let drawVisual;
    const updateAnimation = () => {
      const count = parseInt(audioCtx.currentTime * audioCtx.sampleRate);
      if (count < destination.length) {
        drawVisual = requestAnimationFrame(updateAnimation);
        const dataArray = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(dataArray);
        if (count + dataArray.length < destination.length) {
          destination.set(dataArray, count);
          //cancelAnimationFrame(drawVisual);
        } else {
          destination.set(dataArray.slice(0, destination.length - count), count);
        }

        box04_ctx.strokeStyle = "#ff0000";
        box04_ctx.clearRect(0, 0, ...box04_size);
        box04_ctx.beginPath();
        for (let i = 0, len = destination.length; i < len; i++) {
          const val = destination[i];
          const rate = Vector.inverseMix([0, 1], [destination.length, -1], [i, val]);
          const pos = Vector.mix([0, 0], box04_size, rate);
          if (i == 0) {
            box04_ctx.moveTo(...pos);
          } else {
            box04_ctx.lineTo(...pos);
          }
        }
        box04_ctx.stroke();
      }
    };
    updateAnimation();
    //source.loop = true;
  });
};

const main = () => {
  soundEffectDraw();
  //soundAnalyser();
};
main();
