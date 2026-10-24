"""Original miniatures and a newly performed public-domain birthday tune. Requires numpy/ffmpeg."""
from pathlib import Path
import subprocess, tempfile, wave
import numpy as np

RATE = 44100
ROOT = Path(__file__).resolve().parent.parent
SCORES = [
    (.82,0,[[48,55,59,64],[45,52,57,60],[41,48,55,60],[43,50,57,62]],[0,2,4,2,1,3,4,6,4,2,1,0,2,4,3,1]),
    (.9,2,[[46,53,58,62],[43,50,57,62],[39,46,53,58],[41,48,55,60]],[0,3,2,1,4,3,1,2,0,1,3,5,4,2,1,0]),
    (1.02,5,[[48,55,60,64],[45,52,59,64],[41,48,55,60],[43,50,57,62]],[4,2,1,3,2,0,1,4,3,2,4,5,3,1,2,0]),
]
SCALE = [0,2,4,7,9,12,14]
def voice(buffer,midi,start,length,level=.12,bell=False,pan=0):
    count = min(int(length*RATE),len(buffer)-int(start*RATE))
    if count <= 0: return
    t = np.arange(count)/RATE
    hz = 440*2**((midi-69)/12)
    signal = np.zeros(count)
    for ratio,gain,decay in [(1,1,1.5),(2,.25,.7),(3,.08,.4),(4.01 if bell else 4,.045,.3)]:
        signal += np.sin(2*np.pi*hz*ratio*t)*gain*np.exp(-t/decay)
    signal *= level*np.maximum(0,np.minimum(1,t/.014)*np.minimum(1,(length-t)/.09))
    begin = int(start*RATE)
    buffer[begin:begin+count,0] += signal*(1-pan)*.5
    buffer[begin:begin+count,1] += signal*(1+pan)*.5
def save(name,buffer):
    dry = buffer.copy()
    for seconds,gain in [(.093,.12),(.157,.08),(.257,.045)]:
        offset = int(seconds*RATE)
        buffer[offset:] += dry[:-offset,::-1]*gain
    fade = min(int(RATE*1.8),len(buffer)//8)
    buffer[:int(RATE*.08)] *= np.linspace(0,1,int(RATE*.08))[:,None]
    buffer[-fade:] *= np.linspace(1,0,fade)[:,None]
    buffer /= max(.65,float(np.max(np.abs(buffer)))/.85)
    with tempfile.TemporaryDirectory(prefix='.score-',dir=ROOT/'assets/audio') as temp:
        assert Path(temp).resolve().is_relative_to((ROOT/'assets/audio').resolve())
        wav = Path(temp)/'score.wav'
        with wave.open(str(wav),'wb') as output:
            output.setparams((2,2,RATE,0,'NONE','not compressed'))
            output.writeframes((np.clip(buffer,-1,1)*32767).astype('<i2').tobytes())
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-af','loudnorm=I=-21:TP=-3:LRA=8','-codec:a','libmp3lame','-b:a','128k',str(ROOT/'assets/audio'/f'{name}.mp3')],check=True)
for name,(beat,root,chords,line) in zip(['window','pages','starlight'],SCORES):
    buffer = np.zeros((int(beat*64*RATE),2))
    for step in range(64):
        at = step*beat
        chord = chords[(step//8)%4]
        if step%2 == 0: voice(buffer,chord[(step//2)%4],at,2.5,.13,pan=-.3)
        if step%4 == 0: voice(buffer,chord[0]-12,at,3.2,.1,pan=.3)
        if step%4 != 3: voice(buffer,60+root+SCALE[line[(step//2)%16]],at+.045,1.9,.10 if step%2 == 0 else .065,pan=.1)
    save(name,buffer)
    print(name,round(len(buffer)/RATE,2))
phrases = [
    [(60,.5),(60,.5),(62,1),(60,1),(65,1),(64,2)],
    [(60,.5),(60,.5),(62,1),(60,1),(67,1),(65,2)],
    [(60,.5),(60,.5),(72,1),(69,1),(65,1),(64,1),(62,2)],
    [(70,.5),(70,.5),(69,1),(65,1),(67,1),(65,2)],
]
buffer = np.zeros((int(30*RATE),2))
position = .65
for number,phrase in enumerate(phrases):
    voice(buffer,[48,43,48,41][number],position,3,.08,pan=-.4)
    voice(buffer,[55,59,57,60][number],position,3,.06,pan=.3)
    for midi,length in phrase:
        voice(buffer,midi+12,position,min(2.7,length*.69+1.4),.16,bell=True,pan=.1)
        position += length*.69
    position += .3
save('birthday',buffer)
print('birthday',30)
