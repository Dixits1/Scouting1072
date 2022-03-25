import csv
import pandas as pd

# read in qr_backup.csv as txt file


# read in qr.csv
df = pd.read_csv('qr.csv')

# remove the last column
df = df.drop(df.columns[-1], axis=1)

print(df)
