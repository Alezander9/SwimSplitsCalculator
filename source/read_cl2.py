# read_cl2.py
import os

def parseMeetCL2(filename):
    file = open(filename)
    lines = file.readlines()
    file.close()
    
    corruptedSplitCount = 0
    splitCount = 0
    successCount = 0
    failureCount = 0
    
    # TESTING
    lines = lines
    
    # Extract date and meet name from filename
    # Example: Meet Results-2023 Woody Memorial Invitational-17Nov2023-001.cl2
    if filename[0:13] == "Meet Results-":
        filenameData = filename[13:]
        filenameComponents = filenameData.split("-")
        meetName = filenameComponents[0]
        meetDateData = filenameComponents[1]
        year = int(meetDateData[-4:])
        monthString = meetDateData[-7:-4]
        try:
            month = ["null","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].index(monthString)
        except:
            month = 1
        day = int(meetDateData[:-7])
        
        date = str(year)+"."+str(month)+"."+str(day)
        
    os.makedirs(meetName, exist_ok=True)
    
    lineOpenings =  [
        'A01', # Title, signals the meet info begins, some more unidentified data
        'B11', # The meet name, address, some more unidentified data
        'C11', # A swim club/team name its address and city, a club ID number?
        'D01', # An athlete name, an athete ID that ends in MM or FF for gender, a 4 digit number, 
        #      something that ends with a date. Then three times that end with Y, sometimes some are missing. More info
        'D3', # Lots of space. Sometimes a name. A number. Seems useless
        'E01', # Only occurs in test1. Sequence of letters. M or F. Unidentified info. Two times. More numbers
        'F01', # Only occurs in test1. Letters no space then athlete name. Athlete ID ending in M or F. More info 
        'G01'] # Athlete name. an athlete ID. Number of splits. "50C". Then swim splits. "P" or "F" for prelims or finals I think
        #      Then "N"+two digit number
    
    lastD01 = ""
    
    for line in lines:
        lineOpening = line.split(" ")[0]
        if len(lineOpening) > 5: #If the line opens with a "D ID"
            continue
        
        lineOpening = lineOpening[0:3] # Now only take the first three chars (discarding the two capital letters)
        if lineOpening not in lineOpenings:
            print(f"ERROR: unrecognized line with opening {lineOpening}")
    
        if lineOpening == 'D01':
            lastD01 = line
        if lineOpening == 'G01':
            
            D01Components = lastD01.split(" ")
            while "" in D01Components:
                D01Components.remove("")
            if len(D01Components[3]) == 1:
                D01Components.pop(3)
            lastName = D01Components[1][:-1]
            firstName = D01Components[2]
            if "MM" in D01Components[3] or "MM" in D01Components[4]:
                sex = "male"
            elif "FF" in D01Components[3] or "FF" in D01Components[4]:
                sex = "female"
            else:
                sex = "null"

            
            lineComponents = line.split(" ")
            while "" in lineComponents:
                lineComponents.remove("")
            if len(lineComponents[3]) == 1:
                lineComponents.pop(3)
            times = []
            for component in lineComponents:
                if component.count(".") == 1:
                    times.append(component)
                    splitCount += 1
                elif component.count(".") > 1:
                    corruptedSplitCount += 1
            if len(times) == 0:
                continue
            if "P" in times[-1]:
                time = "1" # 1 for prelims
                times[-1] = times[-1][:-1]
            elif "F" in times[-1]:
                time = "3" # 3 for finals
                times[-1] = times[-1][:-1]
            else:
                if lineComponents[-2] == "P":
                    time = "1" # 1 for prelims
                elif lineComponents[-2] == "F":
                    time = "3" # 3 for finals
                else:
                    time = "1"
            try:
                splits = convert_to_swim_splits(times)
            except:
                failureCount += 1
                continue 
            distance = str(len(splits)*50)+"m"
            if len(D01Components[-2]) < 5:
                continue
            strokeNumber = int(D01Components[-2][4:5])
            stroke = ["null", "free", "back", "breast", "fly", "im"][strokeNumber]
            
#             print(lastD01)
#             print(line)
#             print(stroke)
#             print(splits)
#             print(time)  
#             print("---------------------------------")
            
            file = open(meetName+"/"+lastName+"."+firstName+"."+stroke+"("+distance+")."+date+time+".txt","w")
            file.write(lastName+"\n")
            file.write(firstName+"\n")
            file.write(sex+"\n")
            file.write(stroke+"\n")
            file.write(distance+"\n")
            file.write(str(year)+"\n")
            file.write(str(month)+"\n")
            file.write(str(day)+"\n")
            file.write(time+"\n")
            file.write("--"+"\n")
            for split in splits:
                file.write(split+"\n")
            
#             file.close()

            successCount +=1
             
    print("corrupted splits: " + str(corruptedSplitCount))
    print("read splits: " + str(splitCount))
    print("successful events: " + str(successCount))
    print("corrupted events: " + str(failureCount))
    return

# THE BIG ISSUES
# THE FILE DOES NOT INDICATE WHAT STROKE EACH SPLIT IS FOR
# THE FILE DOES NOT INDICATE WHETHER THE POOL IS IN METERS OR YARDS

# Necessary output format
# For each athlete
# File Name: LastName.FirstName.Stroke(distance).year.month.day.time.txt
# File contents:
# LastName
# FirstName
# sex (lowercase male or female)
# stroke (back breast fly free im)
# distance
# year
# month
# day
# time
# --
# split 1
# split 2
# split 3
# etc
def convert_to_swim_splits(times):
    """
    Convert a list of swim times in string format to swim splits.

    Args:
    times (list of str): List of swim times in string format.

    Returns:
    list of str: List of swim splits in string format.
    """

    def time_to_seconds(time_str):
        """
        Convert a time string to seconds.

        Args:
        time_str (str): Time in the format 'MM:SS.ss' or 'SS.ss'.

        Returns:
        float: Time in seconds.
        """
        parts = time_str.split(':')
        if len(parts) == 2:
            minutes, seconds = parts
            return int(minutes) * 60 + float(seconds)
        return float(time_str)

    def seconds_to_time(seconds):
        """
        Convert seconds to a time string.

        Args:
        seconds (float): Time in seconds.

        Returns:
        str: Time in the format 'MM:SS.ss' or 'SS.ss'.
        """
        minutes, seconds = divmod(seconds, 60)
        if minutes:
            return f"{int(minutes)}:{seconds:05.2f}"
        return f"{seconds:.2f}"

    splits = []
    prev_time = 0.0
    for time in times:
        current_time = time_to_seconds(time)
        split = current_time - prev_time
        splits.append(seconds_to_time(split))
        prev_time = current_time

    return splits

filename = input("Enter the name of the .cl2 file in the SCC folder \n")
if not ".cl2" in filename:
    filename += ".cl2"
parseMeetCL2(filename)