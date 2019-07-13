from PIL import Image
import numpy as np
import glob
import os

#img = Image.open("track.png")
#array = np.array(img)


file = open("track.js", "w+")
file.write("var collisionList = {")
filesTotal = len(glob.glob("*.png"))
filesDone = 0
for infile in glob.glob("*.png"):
	fileName, ext = os.path.splitext(infile)
	file.write(fileName+" : [")
	im = Image.open(infile)
	array = np.array(im)
	for m in range(array.shape[0]):
		file.write("[")
		for n in range(array.shape[1]):
			#print(array[m][n][1])
			if array[m][n][2] == 0: #no blue
				if array[m][n][1] == 0: #no green
					if array[m][n][0] == 0: #no red
						file.write("true, ") #thats black
					elif array[m][n][0] == 255: #all red
						file.write("2, ") #thats red
				elif array[m][n][1] == 255 and array[m][n][0] == 0: #some green and no blue
					file.write("1, ")
			elif array[m][n][0] == 255 and array[m][n][1] == 255 and array[m][n][2] == 255:
				file.write("false, ")
		file.write("],")
	file.write("], ")
	filesDone += 1
	print(str(filesDone)+"/"+str(filesTotal))
file.write("};")
file.close()