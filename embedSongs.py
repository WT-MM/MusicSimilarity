import librosa
import torch
from transformers import EncodecModel, AutoProcessor
import numpy as np

model = EncodecModel.from_pretrained("facebook/encodec_32khz")
processor = AutoProcessor.from_pretrained("facebook/encodec_32khz")

y, sr = librosa.load('/content/sam.mp4', sr=32000) # Ensure the sample rate is 32 kHz
x, _ = librosa.load('/content/musicgen_out.wav', sr=32000)

pad = lambda a,i : a[0:i] if len(a) > i else a + [0] * (i-len(a))

print(len(x))
print(len(y))

def pad_array(array, length, pad_value=0):
    current_length = len(array)
    
    if current_length >= length:
        return array
    
    padding_length = length - current_length
    padding = np.full(padding_length, pad_value)
    padded_array = np.concatenate((array, padding))
    
    return padded_array

if(len(x) > len(y)):
  y = pad_array(y, len(x))
else:
  x = pad_array(x, len(y))

inputs = processor(raw_audio=y, sampling_rate=processor.sampling_rate, return_tensors="pt")
otherInputs = processor(raw_audio=x, sampling_rate=processor.sampling_rate, return_tensors="pt")

'''
encoder_outputs = model.encode(inputs["input_values"], inputs["padding_mask"])['audio_codes'].float()
otherOut = model.encode(otherInputs["input_values"], otherInputs["padding_mask"])['audio_codes'].float()

'''

with torch.no_grad():
    one = model.encode(inputs['input_values'])['audio_codes']
    encoder_outputs = torch.flatten(torch.cat([encoded[0] for encoded in one], dim=-1))

    two = model.encode(otherInputs['input_values'])['audio_codes']
    otherOut = torch.flatten(torch.cat([encoded[0] for encoded in two], dim=-1))

print(otherOut.size())