
# Read CSV into a list of lists

import csv

with open('favorites.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    data = list(reader)

# Keep only the first 2 columns

data = [row[:2] for row in data[1:] if row]

# Write the list of lists to a text file

with open('music.txt', 'w', encoding='utf-8') as f:
    for row in data:
        f.write(row[1] + " by " + row[0] + "\n")