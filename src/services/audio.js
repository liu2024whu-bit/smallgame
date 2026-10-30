import {createFoley} from './foley.js';
import {playPianoVoice} from './piano-voice.js';
import { createMusicPlayer } from './music-player.js';

// Independent music/effect buses. The first gesture unlocks audio, never page load.
export function createAudio({advance,library}={}) {
  let context, master, duckTimer;
  let settings = { sound: true, volume: 0.35, music:true, musicVolume:.65, effectsVolume:1, musicTrack:'window',musicOrder:'cycle' };
  const foley=createFoley({context:()=>context,output:()=>master,enabled:()=>settings.sound&&!document.hidden&&settings.effectsVolume>0&&settings.volume>0});
  const timers = new Set();
  let rainSource;
  let ducked=false;
  const music=createMusicPlayer({context:()=>context,advance,library});

  function configure(next) {
    settings = next;
    if (!settings.sound) stopRain();
    levels();music.configure(settings);
  }
  function levels(){
    if(!master)return;
    const enabled=settings.sound&&!document.hidden,volume=enabled?settings.volume:0;
    master.gain.setTargetAtTime(volume*settings.effectsVolume*.4,context.currentTime,.08);
    music.level(volume*settings.musicVolume*(ducked?.2:1));
  }
  function duck(value){ducked=value;levels();}

  async function resume({music:startMusic=true}={}) {
    if (!context) {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      context = new Audio();
      master = context.createGain();
      master.connect(context.destination);
      configure(settings);
    }
    if (context.state === 'suspended') await context.resume().catch(() => {});
    levels();if(startMusic)music.engage();else music.refresh();
  }

  function tone(frequency, duration = 0.25, volume = 0.18, delay = 0, type = 'sine') {
    if (!context || !settings.sound || document.hidden) return;
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(volume, start + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(envelope).connect(master);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  }

  function paper() {
    if (!context || !settings.sound || document.hidden) return;
    const length = Math.floor(context.sampleRate * 0.12);
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) samples[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2 * 0.07;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 1900;
    source.buffer = buffer;
    source.connect(filter).connect(master);
    source.start();
    source.onended = () => { source.disconnect(); filter.disconnect(); };
  }

  function material(kind = 'wood',delay=0) {
    if (kind === 'paper') return paper();
    const notes = { wood: [260, 0.09], glass: [940, 0.65], pet: [390, 0.22], pickup: [520, 0.4], key:[155,.045], metal:[720,.065] };
    const [frequency, length] = notes[kind] ?? notes.wood;
    const animated=settings.motion!==false&&!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    tone(frequency, length, 0.15, animated?delay:0, kind === 'wood' ? 'triangle' : 'sine');
  }

  function pour() {
    if(!context||!settings.sound||document.hidden)return;
    const animated=settings.motion!==false&&!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches,delay=animated?.38:0,length=animated?.82:.38;
    const buffer=context.createBuffer(1,Math.floor(context.sampleRate*length),context.sampleRate),samples=buffer.getChannelData(0);
    let smooth=0;
    for(let i=0;i<samples.length;i++){smooth=(smooth+(Math.random()*2-1)*.08)/1.05;samples[i]=smooth*Math.sin(Math.PI*i/samples.length)*.18;}
    const source=context.createBufferSource(),filter=context.createBiquadFilter();
    source.buffer=buffer;filter.type='lowpass';filter.frequency.value=1200;
    source.connect(filter).connect(master);source.start(context.currentTime+delay);
    source.onended=()=>{source.disconnect();filter.disconnect();};
    tone(660,.14,.025,delay+length+.22);
  }

  function success() {
    [523.25, 659.25, 783.99].forEach((note, i) => tone(note, 1.3, 0.11, i * 0.12));
  }

  function stopMelody() { for (const timer of timers) window.clearTimeout(timer); timers.clear();window.clearTimeout(duckTimer);duck(false); }
  function previewNote(note) { const frequencies=[261.63,293.66,329.63,392,440]; if(frequencies[note])tone(frequencies[note],.5,.18); }
  function stopRain() { if(!rainSource)return;rainSource.source.stop();rainSource.source.disconnect();rainSource.filter.disconnect();rainSource=null; }
  function rain() {
    if(rainSource || !context || !settings.sound || document.hidden)return;
    const buffer=context.createBuffer(1,context.sampleRate*4,context.sampleRate),samples=buffer.getChannelData(0);
    for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*.035;
    const source=context.createBufferSource(),filter=context.createBiquadFilter();source.buffer=buffer;source.loop=true;
    filter.type='lowpass';filter.frequency.value=1800;source.connect(filter).connect(master);source.start();rainSource={source,filter};
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopRain();stopMelody();}levels();});
  function melody(notes, illuminate) {
    stopMelody();
    duck(true);duckTimer=window.setTimeout(()=>duck(false),notes.length*480+700);
    const frequencies = [261.63, 293.66, 329.63, 392, 440];
    notes.forEach((note, index) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        tone(frequencies[note], 0.8, 0.25);
        illuminate(index);
      }, index * 480);
      timers.add(timer);
    });
  }
  const pianoNote=note=>{if(!context||!settings.sound||document.hidden)return;playPianoVoice(context,master,note);duck(true);window.clearTimeout(duckTimer);duckTimer=window.setTimeout(()=>duck(false),1100);};
  return { resume, configure, material, foley, pour, success, music, melody, stopMelody, previewNote,pianoNote, rain, stopRain };
}
