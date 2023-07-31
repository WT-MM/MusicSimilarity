#Load .pt embedding

import torch
import numpy as np


testEmbedding = torch.load("./embeddings/music/6_Count_Swing_by_This_Way_To_The_Egress.pt")

print(testEmbedding.tolist())

with open("temp.txt", 'w') as f:
    f.write(str(testEmbedding.tolist()))