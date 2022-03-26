from ast import Pass
import csv
import pandas as pd
from io import StringIO
import requests

EVENT_CODE = "2022cada"
API_KEY = "oa9Mt34ilcOT2f6R5hlRSxKlkLWknCzXhyQOxHkn8gmtHtR69BNtCL1TSz7iQIUA"
COLS = ["matchNum", "teamNum", "teamColor", "locations", "outcomes", "climbLevel", "initLinePassed", "autonCount", "humanPlayerScored", "climbTime", "brickTime", "defenseTime", "scouterName", "comments"]
FIELD_ROWS = 4
FIELD_COLS = 5

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

# locStr format: [loc1|loc2|loc3|loc4...locn]
def flipLocations(locStr):
    # remove first and last characters of locStr
    locStr = locStr[1:-1]

    if locStr == "":
        return "[]"
    
    # split by "|"
    locs = locStr.split("|")

    # reverse locs (parse each loc to an int and subtract it from FIELD_ROWS * FIELD_COLS)
    locs = [FIELD_ROWS * FIELD_COLS - int(loc) for loc in locs]

    # return joined locs with "|" and surrounded with []
    return "[" + "|".join([str(loc) for loc in locs]) + "]"

# potentials = []
# ns = ["\'u\'", "\'m\'", "\'l\'"]

# for el in ns:
#     for el2 in ns:
#         potentials.append(el + "," + el2)

# for line in lines:
#     if "|" not in line and any(potential in line for potential in potentials):
#         print(line)


for line in lines:
    # split line into pieces by commas
    pieces = line.split(',')
    new_pieces = []

    # TODO: remove once jank bug is fixed
    pieces[3].replace('|||', '|')
    pieces[4].replace('|||', '|')

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


# remove row with "matchNum" <= 4
df = df[df['matchNum'] > 4]



for index, df_row in df.iterrows():
    # get match #
    match_num = df_row["matchNum"]

    # # get red alliance and blue alliance teams from match #
    req = requests.get(url = "https://www.thebluealliance.com/api/v3/event/" + str(EVENT_CODE) + "/matches/simple", headers = {"X-TBA-Auth-Key": API_KEY}) 
    matches = req.json()

    alliances = None
    
    for match in matches:
        if match["key"] == str(EVENT_CODE) + "_qm" + str(match_num):
            alliances = match["alliances"]
            break
            
    # remove the first 3 characters of each team number
    blue_teams = [team[3:] for team in alliances["blue"]["team_keys"]]
    red_teams = [team[3:] for team in alliances["red"]["team_keys"]]


    # if either alliance contains the specified team #, then do the following:
    if str(df_row["teamNum"]) in blue_teams or str(df_row["teamNum"]) in red_teams:
        # if it scouted team color is N/A or NaN, then do the following:
        if df_row["teamColor"] == "N/A" or pd.isnull(df_row["teamColor"]):
            # if the team color is blue, the flip all of the location scouting data and set team color to blue
            if str(df_row["teamNum"]) in blue_teams:
                df.loc[index, "locations"] = flipLocations(df.loc[index, "locations"])
                df.loc[index, "teamColor"] = "blue"
            # else, if the team color is red, don't flip and set team color to red
            else:
                df.loc[index, "teamColor"] = "red"
        # else, if the scouted team color is blue/red:
        else:
            # if scouted team color matches actual team color, then do nothing
            if (df_row["teamColor"] == "blue" and str(df_row["teamNum"]) in blue_teams) or (df_row["teamColor"] == "red" and str(df_row["teamNum"]) in red_teams):
                pass
            else:
                print("Scouted team color not matching actual team color")
                print(df_row)
    else:
        print("team not found in match")
        print(df_row)


# write df to a new file called qr_cleaned.csv
df.to_csv('qr_cleaned.csv', index=False)