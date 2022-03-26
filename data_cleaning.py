from ast import Pass
import csv
import pandas as pd
from io import StringIO
import requests

EVENT_CODE = "2022cada"
API_KEY = "oa9Mt34ilcOT2f6R5hlRSxKlkLWknCzXhyQOxHkn8gmtHtR69BNtCL1TSz7iQIUA"
COLS = ["matchNum", "teamNum", "teamColor", "locations", "outcomes", "climbLevel", "initLinePassed", "autonCount", "humanPlayerScored", "climbTime", "brickTime", "defenseTime", "scouterName", "comments"]

# read in qr_backup.csv as txt file
f = open('qr.csv', 'r')

# split file into lines
lines = f.readlines()

new_lines = []


def getSchedule():
    # send a GET request to "https://www.thebluealliance.com/api/v3/event/" + eventCode + "/matches/simple"
    # with a header of "X-TBA-Auth-Key" and the authKey

    req = requests.get(url = "https://www.thebluealliance.com/api/v3/event/" + EVENT_CODE + "/matches/simple", headers = {"X-TBA-Auth-Key": API_KEY}) 

    return req.json()



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
        if last_elem[i] == ',':
            last_elem = last_elem[:i] + last_elem[i+1:]


    # combine all elements in pieces after the 13th element into 1 string
    new_pieces.append(last_elem)
    
    print(last_elem)

    pieces_merged = ','.join(new_pieces)

    # add new_pieces to new_lines
    new_lines.append(pieces_merged)

# compile new_lines into a string seperated by new lines
new_lines_str = ''.join(new_lines)

# save new_lines_str to a new file called qr_cleaned.py
with open('qr_cleaned.csv', 'w') as f:
    f.write(new_lines_str)

csv_cleaned = StringIO(new_lines_str)

df = pd.read_csv(csv_cleaned, sep=",", names=COLS)

# iterate over rows in df and store the dataframe df's row in a variable called df_row
for index, df_row in df.iterrows():
    # getSchedule()
    
#   get match #
#   get red alliance and blue alliance teams from match #
#   if either alliance contains the specified team #, then do the following:
#       if it scouted team color is N/A, then do the following:
#           if the team color is blue, the flip all of the location scouting data and set team color to blue
#           else, if the team color is red, don't flip and set team color to red
#       else, if the scouted team color is blue/red:
            # if scouted team color matches actual team color, then do nothing
            # else, print "scouted team color not matching actual team color for some reason...."
#   else, print "team not found in match #"

    pass


# print(df['scouterName'].value_counts())


# for index, df_row in df.iterrows():
#     # get match #
#     match_num = df_row["matchNum"]

#     # # get red alliance and blue alliance teams from match #
#     req = requests.get(url = "https://www.thebluealliance.com/api/v3/event/" + EVENT_CODE + "/match/" + match_num + "/alliances", headers = {"X-TBA-Auth-Key": API_KEY}) 
#     matches = req.json()

#     alliances = None
    
#     for match in matches:
#         if match.key == EVENT_CODE + "_qm" + match_num:
            

#     blueTeams = all

    # red_teams = []
    # blue_teams = []

    # for alliance in alliance_data:
    #     if alliance["alliance_color"] == "red":
    #         for team in alliance["picks"]:
    #             red_teams.append(team)
    #     else:
    #         for team in alliance["picks"]:
    #             blue_teams.append(team)

    # print(red_teams)
    # print(blue_teams)

    # # if either alliance contains the specified team #, then do the following:
    # if any(team == "frc" + str(df_row["teamNum"]) for team in red_teams) or any(team == "frc" + str(df_row["teamNum"]) for team in blue_teams):
    #     # if it scouted team color is N/A, then do the following:
    #     if df_row["teamColor"] == "N/A":
    #         # if the team color is blue, the flip all of the location scouting data and set team color to blue
    #         if df_row["teamColor"] == "blue":
    #             # flip all of the location scouting data
    #             df.loc[index, "locations"] = df.loc[index, "locations"].replace("R", "L")
    #             df.loc[index, "locations"] = df.loc[index, "locations"].replace("L", "R")
    #             df.loc[index, "locations"] = df.loc[index, "locations"].replace("C", "C")

    #             # set team color to blue
    #             df.loc[index, "teamColor"] = "blue"
    #         # else, if
