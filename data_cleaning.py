import csv
import pandas as pd
from io import StringIO

# read in qr_backup.csv as txt file
f = open('qr.csv', 'r')

# split file into lines
lines = f.readlines()

new_lines = []

for line in lines:
    # split line into pieces by commas
    pieces = line.split(',')
    new_pieces = []

    # for the first 13 elements of pieces, store in new_pieces. for all elements in pieces after the 13th element, 
    # combine into 1 string and store a the end of new_pieces
    for i in range(13):
        new_pieces.append(pieces[i])

    last_elem = ' '.join(pieces[13:])

    # in the last_elem string, iterate over each character. if character is not a letter from A-Z (either uppercase or lowercase) and is not a number, then replace it with a space
    for i in range(len(last_elem)):
        if not (last_elem[i].isalpha() or last_elem[i].isdigit() or last_elem[i] == '(' or last_elem == ')'):
            last_elem = last_elem[:i] + ' ' + last_elem[i+1:]


    # combine all elements in pieces after the 13th element into 1 string
    new_pieces.append(last_elem)

    pieces_merged = ','.join(new_pieces)

    # add new_pieces to new_lines
    new_lines.append(pieces_merged)

# compile new_lines into a string seperated by new lines
new_lines_str = '\n'.join(new_lines)

csv_cleaned = StringIO(new_lines_str)

df = pd.read_csv(csv_cleaned, sep=",")

# remove the last column
df = df.drop(df.columns[-1], axis=1)

print(df)
