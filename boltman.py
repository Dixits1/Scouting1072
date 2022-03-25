# read boltman.csv and print the contents
with open('boltman.csv', 'r') as f:
    lines = f.readlines()
    for i in range(len(lines)):
        if lines[i].endswith('\n'):
            lines[i] = lines[i][:-1]

        if lines[i].endswith('\'') or lines[i].endswith('\"'):
            lines[i] = lines[i][:-1]

        if lines[i].startswith('\'') or lines[i].startswith('\"'):
            lines[i] = lines[i][1:]

    printStr = "["

    for i in range(len(lines)):
        ln = lines[i]

        # replace all single quotes with "\'" in ln
        # replace all double quotes with "\"" in ln
        ln = ln.replace("\'", "\\\'")
        ln = ln.replace("\"", "\\\"")

        if i != len(lines) - 1:
            printStr += "\"" + ln + "\"" + ","
        else:
            printStr += "\"" + ln + "\"" + "]"

    print(printStr)