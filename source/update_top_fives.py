# update_top_fives.py
# Lets store the data like this: dictionary with stroke & distance as keys
#  tuples with total splits, splits (as a list), and name as values
# {"100 METER BACKSTROKE": [(51.85, [25.13, 26.72], 'Ryan Murphy'), (), (), (), ()]
# (no need to limit to 5 when READING data, we can sort by total splits later & pull top 5
import os

# a-e
# tab: _    _

#a) create a dictionary called all_data
all_data={}

# step 1: read entire top_data.txt file & store all values into our chosen data structure
#b) open top_data.txt (or other file)
def read_raw_data(filename, all_data):
    F = open(filename, "r")
    #c) for every line in the file...
    for line in F:
        line = line.strip()
        parts = line.split("/")

        if line == "":
            pass
            
        elif len(parts) == 1:
            event = line
            event = event.strip()
            all_data[event] = []
        elif len(parts) == 2: # if the line contains a name and splits
            # seperate the two parts
            name = parts[0]
            splits = parts[1]
            # extract the splits from the list, then find the average split
            splits = splits.strip()
            splits = splits[1:-1]
            splits = splits.split(", ")
            totalsplits = 0
            for i in range(0,len(splits)):
                splits[i] = float(splits[i])
                totalsplits += splits[i]			
            totalsplits *= 100
            totalsplits += 0.5
            totalsplits = int(totalsplits)
            totalsplits /= 100.0
            # extract the  name from the line
            name = name.strip()
            
            infotup = (totalsplits, splits, name)
            all_data[event].append(infotup)
        else:
            print("problem reading line " + line + " in top_data_raw.txt")

    F.close()

# step 2: go through ALL splits files & add their data to the approrpiate area (no particular order)
# (optional for now)
# get a list of all files in AthleteSplits (list_files.py)
# for each filename in that list:
#     read_split.py
def read_splits_folder(foldername, all_data):
    files = [f for f in os.listdir('./' + foldername)]
    for f in files:

        next_file = './' + foldername + '/' + f

        F = open(next_file)
        splits = []
        totalsplits = 0
        line_num = 0
        for line in F:
            if line_num == 0:
                first_name = line[:-1]
            elif line_num == 1:
                last_name = line[:-1]
            elif line_num == 2:
                gender = line
            elif line_num == 3:
                stroke = line
            elif line_num == 4:
                distance = line
            elif line_num == 5:
                year = line
            elif line_num == 6:
                month = line
            elif line_num == 7:
                day = line
            elif line_num == 8:
                time = line
            elif line_num > 9:
                line = float(line[:-1])
                line *= 100
                line += 0.5
                line = int(line)
                line /= 100
                splits.append(line)
                totalsplits += line
            else:
                pass
            line_num += 1
        
        totalsplits *= 100
        totalsplits += 0.5
        totalsplits = int(totalsplits)
        totalsplits /= 100
        distance = distance[:-2]
        distance = distance + " METER"
        stroke = stroke.strip()
        gender = gender.strip()
        if gender == "male":
            gender = "MENS"
        else:
            gender = "WOMENS"
        if stroke == "free":
            stroke = "FREESTYLE"
        elif stroke == "back":
            stroke = "BACKSTROKE"
        elif stroke == "fly":
            stroke = "BUTTERFLY"
        else:
            stroke = "BREASTSTROKE"
        infotup = (totalsplits, splits, first_name + " " + last_name)
        keys = []
        for key in all_data:
                keys.append(key)
        thisKey = gender + " " + distance + " " + stroke
        if thisKey in keys:
            all_data[thisKey].append(infotup)
        else:
            all_data[thisKey] = [infotup]
    print(all_data)
    




# interface
choice = -1
while choice != 0:
    print("1. Add in raw data file")
    print("2. Add in splits folder")
    print("0. Exit and write top5 file")
    choice = int(input("? "))
    if choice == 1:
        filename = input("Which raw data filename (or just press enter to default to world record data)? ")
        filename = filename.strip()
        print("input:" + filename)
        if filename == "":
            filename = 'top_data_raw.txt'
        print("reading raw: " + filename)
        read_raw_data(filename, all_data)
    elif choice == 2:
        foldername = input("Which splits folder do you want to combine in (or just press enter to cancel?) ")
        if foldername != "":
            read_splits_folder(foldername, all_data)
    elif choice == 0:
        print("Building your new top5 file")



# step 3: go through ALL dictionary entries, sort their tuples by first value (total splits)
for key in all_data:
    all_data[key] = sorted(all_data[key])


# step 4: using the sorted lists, run through until you've found the 5th unique name, moving found data to a NEW data structure
for key in all_data:
    all_data[key] = all_data[key][0:5]
# new data structure can be a NEW dictionary holding data we chose to add
# OR we can selectively remove data from the existing dict if we don't want it
# OR we can remove any duplicate names & then just take the first 5 entries

filename = input("What would you like to call this new top data file? ")
F = open(filename + ".top5","w+")


# for each event
for key in all_data:
    allAverageSplits = []
    for n in range(0,len(all_data[key][1][1])):
        totalOfSplit = 0
        splitNum = 0
        allSplits = {}
        
        for i in range(0,len(all_data[key])):
            totalOfSplit += all_data[key][i][1][n]
            splitNum += 1
            
        averageOfSplit = totalOfSplit / splitNum
        averageOfSplit *= 100
        averageOfSplit += 0.5
        averageOfSplit = int(averageOfSplit)
        averageOfSplit /= 100.0
        allAverageSplits.append(averageOfSplit)
        
    allSplits[key] = allAverageSplits
    #print(allSplits)
    allSplits = str(allSplits[key])
    allSplits =  allSplits[1:-1]
    print(key + " / " + allSplits)
    F.write(key + " / " + allSplits + "\n")


F.close()        

'''
BACKSTROKE / 100 / Ryan Murphy / 25.13, 26.72
BACKSTROKE / 100 / Xu Jiayu / 24.99, 26.87
BUTTERFLY / 200 / Michael Phelps / 24.76, 28.12, 29.05, 29.58


'''


# once done, this file can be read when the javascript launches to fill the arrays
# (feel free to take a whack at this as well)

for key in all_data:
    print(key)
    print(all_data[key])


