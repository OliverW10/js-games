from PIL import Image
import numpy

im =Image.open("images/map1.png");

for i in range(len(im)):
	print(im[i]);  