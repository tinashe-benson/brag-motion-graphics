# Pre-mix the SFX stem from cues.json: one bus, gentle top-end taming, a shared
# short room so effects sit in the same space as the music, soft limiting.
import json, subprocess, numpy as np, wave, os
SR=44100; DUR=60.0
base='../composition/assets/sfx'
cues=json.load(open('cues.json'))
cache={}
def load(f):
    if f not in cache:
        raw=subprocess.run(['ffmpeg','-v','quiet','-i',os.path.join(base,f),'-ac','2','-ar',str(SR),'-f','f32le','-'],capture_output=True).stdout
        cache[f]=np.frombuffer(raw,dtype=np.float32).reshape(-1,2).astype(np.float64)
    return cache[f]
bus=np.zeros((int(SR*DUR)+SR,2))
for f,t,db,pan in cues:
    x=load(f)*10**(db/20)
    l=np.cos((pan+1)*np.pi/4)*np.sqrt(2); r=np.sin((pan+1)*np.pi/4)*np.sqrt(2)
    x=x*np.array([min(l,1.3),min(r,1.3)])
    i=int(t*SR); n=min(len(x),len(bus)-i)
    bus[i:i+n]+=x[:n]
# tame harsh highs: blend in a one-pole lowpass (~7 kHz) -> softer top
a=np.exp(-2*np.pi*7000/SR)
lp=np.zeros_like(bus); s=np.zeros(2)
for k in range(len(bus)):
    s=(1-a)*bus[k]+a*s; lp[k]=s
bus=0.55*lp+0.45*bus
# shared room: short dark reverb send
rng=np.random.default_rng(3); L=int(0.9*SR); tt=np.arange(L)/SR
ir=rng.standard_normal((L,2))*np.exp(-4.5*tt)[:,None]
ir=np.apply_along_axis(lambda c: np.convolve(c,np.ones(30)/30,'same'),0,ir); ir/=np.abs(ir).sum(0)/6
wet=np.zeros((len(bus)+L-1,2))
for c in range(2):
    N=len(wet); wet[:,c]=np.fft.irfft(np.fft.rfft(bus[:,c],N)*np.fft.rfft(ir[:,c],N),N)
out=bus+0.18*wet[:len(bus)]
out=out[:int(SR*DUR)]
out*=10**(-6/20)  # bus trim: effects sit under the music bed
out=np.tanh(out*1.1)/np.tanh(1.1)  # soft limiter
pk=np.max(np.abs(out)); out*=0.89/max(pk,0.89)
d=(np.clip(out,-1,1)*32767).astype(np.int16)
with wave.open(os.path.join(base,'sfx-stem.wav'),'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(d.tobytes())
print('cues',len(cues),'peak',round(float(pk),3))
