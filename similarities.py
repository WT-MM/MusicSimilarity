import torch
import numpy as np
from tqdm import tqdm
from glob import glob
import os
import json
import pandas as pd

embeddings = []
labels = []

for embedding in glob("./embeddings/music/*.pt"):
    embeddings.append(torch.load(embedding))
    labels.append(os.path.splitext(os.path.basename(embedding))[0])  # Extract song name from file name.

print("Loaded embeddings")

with torch.no_grad():
    embeddings = torch.stack(embeddings).float()
    embeddings /= embeddings.norm(dim=-1, keepdim=True)  # Normalize the vectors.
    similarities = torch.mm(embeddings, embeddings.t())

print("Calculated similarities")

# Convert tensor to numpy for dataframe
similarities_np = similarities.numpy()

# Create pandas DataFrame with labels
df = pd.DataFrame(similarities_np, index=labels, columns=labels)

# Save the dataframe to a CSV file
df.to_csv('similarities.csv')

print("Saved similarities to CSV file")

def get_similar_songs(song):
    sorted_songs = df[song].sort_values(ascending=False)
    top10_similar_songs = sorted_songs.head(10)
    return top10_similar_songs

print(get_similar_songs('Heart-Shaped_Hologram_by_Stephanie_Mabey'))

'''
df = pd.read_csv('similarities.csv', index_col=0)

sorted_songs = df['song1'].sort_values(ascending=False)
top10_similar_songs = sorted_songs.head(10)
'''