import * as Tone from "tone";
import Scribbletune from "scribbletune";

const reSpace = (s) => {
  return s.replace(/\s*/g, "");
};
/*AMSynth
DuoSynth
FMSynth
MembraneSynth
MetalSynth
MonoSynth
NoiseSynth
PluckSynth
PolySynth
Synth*/
/*
https://scribbletune.com/sounds/kick.wav
https://scribbletune.com/sounds/bass.wav
https://scribbletune.com/sounds/ch.wav
https://scribbletune.com/sounds/oh.wav
https://scribbletune.com/sounds/snare.wav
*/
window.Tone = Tone;
//console.log(Tone);
const btn = document.getElementById("btn");
console.log(Scribbletune);
const session = new Scribbletune.Session();
//console.log(session);
btn.addEventListener("click", () => {
  /*Scribbletune.clip({
    instrument: "PolySynth",
    notes: "c4 c4 d4 c4 f4 e4 c4 c4 d4 c4 g4 f4 c4 c4 c5 a4 f4 e4 d4 a#4 a#4 a4 f4 g4 f4",
    pattern: reSpace("--[xx] xxx x-[xx] xxx x-[xx] xxx xx[xx] xxx x--"),
  }).start();

  Scribbletune.clip({
    instrument: "PolySynth",
    notes: "Fm Cm Cm7 Fm Fm7 Bbm Cm7 Fm",
    pattern: reSpace("--- x-- x-- x-- x-- x__ x-- x-- x--"),
  }).start();

  const c = Scribbletune.clip({
    notes: "c4 c4 d4 c4 f4 e4 c4 c4 d4 c4 g4 f4 c4 c4 c5 a4 f4 e4 d4 a#4 a#4 a4 f4 g4 f4",
    pattern: reSpace("--[xx] xxx x-[xx] xxx x-[xx] xxx xx[xx] xxx x--"),
  });
  const b = Scribbletune.midi(c, "chords.mid");
  document.body.appendChild(b);*/

  /*const clips = ["1032", "2032", "4021", "3052"].map((order) => {
    console.log(order);
    return 
  });
  console.log(clips);*/

  Scribbletune.clip({
    instrument: "PolySynth",
    pattern: "[xx][xR]".repeat(4), //R will play notes from our progression
    notes: Scribbletune.arp({
      chords: "Dm BbM Am FM BbM FM CM Gm",
      count: 8,
      order: "1032",
    }),
    //accent: "x-xx--xx",
    //subdiv: "1n",
  }).start();

  /*Scribbletune.clip({
    sample: "https://scribbletune.com/sounds/kick.wav",
    pattern: "xxx[xx]",
  }).start();

  Scribbletune.clip({
    sample: "https://scribbletune.com/sounds/bass.wav",
    pattern: "--xx",
  }).start();*/

  /*const kickChannel = session.createChannel({
    sample: "https://scribbletune.com/sounds/kick.wav",
    clips: [{ pattern: "x" }, { pattern: "xxx[xx]" }, { pattern: "x" }, { pattern: "xxx[-x]" }],
  });
  const bassChannel = session.createChannel({
    sample: "https://scribbletune.com/sounds/bass.wav",
    clips: [{ pattern: "[-x]" }, { pattern: "[--xx]" }, { pattern: "[-xxx]" }, { pattern: "xxx" }],
  });
  session.startRow(3);*/
  //kickChannel.startClip(1);
  //bassChannel.startClip(0);
  //Tone.Transport.bpm.value = 180;
  //console.log(Tone.Transport.bpm.value);
  Tone.context.resume().then(() => Tone.Transport.start());
});
