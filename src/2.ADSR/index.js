const audioCtx = new AudioContext();

const btn0 = document.getElementById("btn0");
const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
const btn3 = document.getElementById("btn3");
const btn4 = document.getElementById("btn4");
const btn5 = document.getElementById("btn5");
const btn6 = document.getElementById("btn6");
const btn7 = document.getElementById("btn7");
btn0.addEventListener("mousedown", () => adsr(261.6));
btn1.addEventListener("mousedown", () => adsr(293.7));
btn2.addEventListener("mousedown", () => adsr(329.6));
btn3.addEventListener("mousedown", () => adsr(349.2));
btn4.addEventListener("mousedown", () => adsr(392.0));
btn5.addEventListener("mousedown", () => adsr(440.0));
btn6.addEventListener("mousedown", () => adsr(493.9));
btn7.addEventListener("mousedown", () => adsr(523.3));

const adsr = (frequency) => {
  const oscillator = audioCtx.createOscillator(); //振盪器
  oscillator.type = "sine"; // 正弦波
  oscillator.frequency.value = frequency; //頻率
  oscillator.detune.value = 0; // 解諧

  const gainNode = audioCtx.createGain(); //音量控制
  //gainNode.gain.value = 0.2;
  const time = {
    attack: 0.001,
    decay: 0.1,
    sustain: 0.5,
    release: 0.3,
  };
  let t = audioCtx.currentTime;
  gainNode.gain.setValueAtTime(0, t);

  t += time.attack;
  gainNode.gain.linearRampToValueAtTime(1, t);

  //gainNode.gain.setTargetAtTime(time.sustain, t, time.decay);
  t += time.decay;
  t += 0.2;

  //gainNode.gain.setTargetAtTime(0, t, time.release);
  t += time.release;

  gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 1);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + t + 1);
};
