// Original, quietly synthesized material sounds. Audio starts only after a gesture.
export function createAudio() {
  let context, master, ambientTimer;
  let settings = { sound: true, volume: 0.35 };
  const timers = new Set();

  function configure(next) {
    settings = next;
    if (master) master.gain.setTargetAtTime(settings.sound ? settings.volume * 0.4 : 0, context.currentTime, 0.08);
  }

  async function resume() {
    if (!context) {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      context = new Audio();
      master = context.createGain();
      master.connect(context.destination);
      configure(settings);
    }
    if (context.state === 'suspended') await context.resume().catch(() => {});
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

  function material(kind = 'wood') {
    if (kind === 'paper') return paper();
    const notes = { wood: [260, 0.09], glass: [940, 0.65], pet: [390, 0.22], pickup: [520, 0.4] };
    const [frequency, length] = notes[kind] ?? notes.wood;
    tone(frequency, length, 0.15, 0, kind === 'wood' ? 'triangle' : 'sine');
  }

  function success() {
    [523.25, 659.25, 783.99].forEach((note, i) => tone(note, 1.3, 0.11, i * 0.12));
  }

  function ambient() {
    if (ambientTimer) return;
    let bar = 0;
    const chords = [[261.63, 329.63, 392], [220, 293.66, 349.23], [246.94, 329.63, 392], [196, 293.66, 392]];
    const play = () => {
      const chord = chords[bar++ % chords.length];
      chord.forEach((note, i) => tone(note, 4.5, 0.025, i * 0.35));
      [0, 2, 1, 2].forEach((index, i) => tone(chord[index] * 2, 1.5, 0.024, 2.8 + i * 1.1));
    };
    play();
    ambientTimer = window.setInterval(play, 11000);
  }

  function stopMelody() { for (const timer of timers) window.clearTimeout(timer); timers.clear(); }
  function melody(notes, illuminate) {
    stopMelody();
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
  return { resume, configure, material, success, ambient, melody, stopMelody };
}
