# Synthesized SFX in C major so effects sit in the music's key and space.
import numpy as np, wave, os
SR=44100
OUT='/home/user/brag-motion-graphics/brag-output/composition/assets/sfx/synth'
os.makedirs(OUT,exist_ok=True)
rng=np.random.default_rng(7)
def hz(note):  # midi -> hz
    return 440*2**((note-69)/12)
def ir(sec=1.2,decay=3.2):
    t=np.arange(int(SR*sec))/SR
    n=rng.standard_normal((len(t),2))*np.exp(-decay*t)[:,None]
    # darken the tail
    k=np.ones(24)/24
    for c in range(2): n[:,c]=np.convolve(n[:,c],k,'same')
    return n/np.abs(n).sum(0)*8
def reverb(x,wet=0.25,sec=1.2,decay=3.2):
    if x.ndim==1: x=np.stack([x,x],1)
    h=ir(sec,decay)
    y=np.zeros((len(x)+len(h)-1,2))
    for c in range(2):
        y[:,c]=np.fft.irfft(np.fft.rfft(x[:,c],len(y))*np.fft.rfft(h[:,c],len(y)),len(y))
    dry=np.zeros_like(y); dry[:len(x)]=x
    return dry*(1-wet)+y*wet
def lowpass(x,cut):
    a=np.exp(-2*np.pi*cut/SR); y=np.zeros_like(x); s=0.0
    for i in range(len(x)): s=(1-a)*x[i]+a*s; y[i]=s
    return y
def save(name,x,peak=0.7):
    if x.ndim==1: x=np.stack([x,x],1)
    fade=int(0.01*SR); x[-fade:]*=np.linspace(1,0,fade)[:,None]
    x=x/np.max(np.abs(x))*peak
    d=(x*32767).astype(np.int16)
    with wave.open(f'{OUT}/{name}.wav','wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(d.tobytes())
def bell(f,dur=0.9,bright=0.25):
    t=np.arange(int(SR*dur))/SR
    env=np.minimum(t/0.004,1)*np.exp(-t*5.5)
    s=np.sin(2*np.pi*f*t)+bright*np.sin(2*np.pi*2*f*t)*np.exp(-t*9)+0.08*np.sin(2*np.pi*3.01*f*t)*np.exp(-t*14)
    return s*env
# notification pings: C major pentatonic, mid register (not piercing)
for i,n in enumerate([72,76,79,81,74,84,77,79,76]):
    save(f'ping{i}',reverb(bell(hz(n),0.7,0.18),0.3),0.55)
# lock tick: short warm pluck on G4/C5
for i,n in enumerate([67,72,76,79]):
    t=np.arange(int(SR*0.35))/SR
    s=(np.sin(2*np.pi*hz(n)*t)+0.3*np.sin(2*np.pi*hz(n+12)*t))*np.minimum(t/0.002,1)*np.exp(-t*16)
    save(f'tick{i}',reverb(s,0.22,0.8),0.6)
# success chime: C5 E5 G5 C6 arpeggio
t_total=1.6; x=np.zeros(int(SR*t_total))
for k,n in enumerate([72,76,79,84]):
    b=bell(hz(n),1.2,0.2); o=int(k*0.07*SR); x[o:o+len(b)]+=b[:len(x)-o]*(0.9-0.1*k)
save('success',reverb(x,0.3,1.4),0.7)
# sub boom on C (for logo / big reveals)
t=np.arange(int(SR*1.6))/SR
f=hz(36)*(1+0.6*np.exp(-t*18))
ph=2*np.pi*np.cumsum(f)/SR
boom=np.sin(ph)*np.exp(-t*2.6)*np.minimum(t/0.003,1)
click=lowpass(rng.standard_normal(len(t)),1800)*np.exp(-t*60)*0.6
save('boom',reverb(boom+click,0.18,1.2),0.85)
# riser: 2.4s, filtered noise swell + rising C-fifth drone, cut clean at the end
dur=2.4; t=np.arange(int(SR*dur))/SR; p=t/dur
noise=rng.standard_normal(len(t))
# moving lowpass: approximate by blending two filtered versions
nl=lowpass(noise,600); nh=lowpass(noise,4200)
nz=(nl*(1-p)+nh*p)*p**2.2
fs=hz(48)*(1+p*1.0); ph=2*np.pi*np.cumsum(fs)/SR
drone=(np.sin(ph)+0.5*np.sin(ph*1.5))*p**2.5*0.5
r=reverb(nz*0.9+drone,0.35,1.0)[:len(t)]
save('riser',r,0.6)
# whoosh: 0.7s band sweep
dur=0.7; t=np.arange(int(SR*dur))/SR; p=t/dur
env=np.sin(np.pi*p)**2
n=rng.standard_normal(len(t)); w=lowpass(n,900)*(1-p)+lowpass(n,3000)*p
pan=np.stack([w*env*(1-0.6*p),w*env*(0.4+0.6*p)],1)
save('whoosh',reverb(pan,0.25,0.8),0.5)
# soft pad swell under the outro: C major add9 chord
dur=6.0; t=np.arange(int(SR*dur))/SR
x=np.zeros(len(t))
for n in [48,55,60,64,67,74]:
    x+=np.sin(2*np.pi*hz(n)*t+n)*(0.6 if n<60 else 0.35)
x=lowpass(x,1600)*np.minimum(t/1.5,1)*np.minimum((dur-t)/2.0,1)
save('pad',reverb(x,0.4,2.0,2.0)[:len(t)],0.5)
print(sorted(os.listdir(OUT)))
