import pandas as pd
import matplotlib.pyplot as plt
import requests
import numpy as np

EVENT_CODE = "2022cada"
API_KEY = "oa9Mt34ilcOT2f6R5hlRSxKlkLWknCzXhyQOxHkn8gmtHtR69BNtCL1TSz7iQIUA"
matchNum = 74
showPlots = False


def getAlliances(matchNum):
    req = requests.get(url = "https://www.thebluealliance.com/api/v3/event/" + str(EVENT_CODE) + "/matches/simple", headers = {"X-TBA-Auth-Key": API_KEY}) 
    matches = req.json()

    alliances = None
    
    for match in matches:
        if match["key"] == str(EVENT_CODE) + "_qm" + str(matchNum):
            alliances = match["alliances"]
            break
            
    # remove the first 3 characters of each team number
    blue_teams = [int(team[3:]) for team in alliances["blue"]["team_keys"]]
    red_teams = [int(team[3:]) for team in alliances["red"]["team_keys"]]

    return (blue_teams, red_teams)

def commentsAnalysis(teamData):
    tn_comments = teamData["comments"]

    # remove NaN values from tn_comments
    tn_comments = tn_comments.dropna()

    # convert tn_comments to an array
    tn_comments = tn_comments.to_numpy()

    print(tn_comments)

def climbFreqAnalysis(teamData):
    climbLevels = teamData["climbLevel"].to_numpy()

    # print team number + ": " + median of climbLevels
    print("Climb Median: " + str(np.median(climbLevels)))


    if showPlots:
        # plot climbLevels as a histogram with bucket size of 1
        plt.hist(climbLevels, bins=range(0, 5))
        
        # set title of plot to team number + " Climb Level Frequencies"
        plt.title(str(team) + " Climb Level Frequencies")

        plt.show()

def shotAttemptsAnalysis(teamData):
    matches = teamData["locations"].to_numpy()
    matchNums = teamData["matchNum"].to_numpy()
    lens = []
    matchDict = {}

    for m in range(len(matches)):
        locsStr = matches[m][1:-1]
        locs = locsStr.split("|")
        matchNum = matchNums[m]

        # check if the dictionary contains a key of matchNum
        #   if it does, append the length of locs to the list
        
        if matchNum in matchDict:
            matchDict[matchNum].append(len(locs))
        else:
            matchDict[matchNum] = [len(locs)]

    for key in matchDict:
        lens.append(int(np.mean(matchDict[key])))

    print("Mean Shots Taken: " + str(round(np.mean(lens), 2)) + " Std Dev.: " + str(round(np.std(lens), 2)))

    if showPlots:
        plt.hist(lens, bins=range(0, max(lens) + 1))
        plt.title(str(team) + " Shot Count Frequencies")
        plt.show()

def shootingPctAnalysis(teamData):
    matches = teamData["outcomes"].to_numpy()
    matchNums = teamData["matchNum"].to_numpy()
    pcts = []
    matchDict = {}

    for m in range(len(matches)):
        outsStr = matches[m][1:-1]
        outs = [outs[1: -1] for outs in outsStr.split("|")]
        matchNum = matchNums[m]
        
        if matchNum in matchDict:
            matchDict[matchNum].append(1.0 - (outs.count('m') * 1.0)/len(outs))
        else:
            matchDict[matchNum] = [(1.0 - (outs.count('m') * 1.0)/len(outs))]

    for key in matchDict:
        pcts.append(np.mean(matchDict[key]))

    print("Mean Shooting Pct: " + str(round(np.mean(pcts) * 100, 2)) + "% Std Dev.: " + str(round(np.std(pcts) * 100, 2)) + "%")


# alliances = getAlliances(matchNum)

alliances = ([1072, 5419, 687], [1678, 254, 5458])


teams = alliances[0] + alliances[1]

df = pd.read_csv("qr_cleaned.csv", sep=",")

for teams in alliances:
    if teams == alliances[0]:
        print("~~~~~~~~~~ Blue Alliance ~~~~~~~~~~")
    else:
        print("~~~~~~~~~~ Red Alliance ~~~~~~~~~~")

    for team in teams:
        teamData = df[df['teamNum'] == team]

        print("~~~ " + str(team) + " ~~~")

        # commentsAnalysis(teamData)
        # climbFreqAnalysis(teamData)
        shotAttemptsAnalysis(teamData)
        shootingPctAnalysis(teamData)