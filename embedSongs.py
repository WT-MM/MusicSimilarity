import os
import librosa
import torch
from transformers import EncodecModel, AutoProcessor
import numpy as np
from glob import glob
from tqdm import tqdm


model = EncodecModel.from_pretrained("facebook/encodec_32khz")
processor = AutoProcessor.from_pretrained("facebook/encodec_32khz")

sample_rate = 32000

def pad_array(array, length, pad_value=0):
    current_length = len(array)
    
    if current_length >= length:
        return array
    
    padding_length = length - current_length
    padding = np.full(padding_length, pad_value)
    padded_array = np.concatenate((array, padding))
    
    return padded_array

def trim_array(array, length):
    current_length = len(array)
    
    if current_length <= length:
        return array
    
    return array[:length]

embeddings = []

files = glob("./music/*.mp3")

for i in tqdm(range(len(files))):
  file = files[i]
  print("./embeddings"+file.replace(".mp3", ".pt")[1:])
  if(os.path.exists("./embeddings"+file.replace(".mp3", ".pt")[1:])):
    continue
  y, _ = librosa.load(file, sr=sample_rate) # Ensure the sample rate is 32 kHz
  y = trim_array(pad_array(y, sample_rate*60*5), sample_rate*60*5)

  inputs = processor(raw_audio=y, sampling_rate=processor.sampling_rate, return_tensors="pt")
  with torch.no_grad():
    tem = model.encode(inputs['input_values'])['audio_codes']
    encoder_outputs = torch.flatten(torch.cat([encoded[0] for encoded in tem], dim=-1))
    torch.save(encoder_outputs, "./embeddings"+file.replace(".mp3", ".pt")[1:])
    #embeddings.append(encoder_outputs)

#embeddings = torch.stack(embeddings)
#torch.save(embeddings, "embeddings.pt")



    