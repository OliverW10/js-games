from PIL import Image, ImageDraw
import numpy as np
import random

imWidth, imHeight = 7200, 5120#2848, 2080
dotsNum = 200
im = Image.new("RGB", (imWidth, imHeight), (240, 240, 240))
draw = ImageDraw.Draw(im)
for y in range(dotsNum + 1):
	for x in range(dotsNum + 1):
		if random.random() < 0.99:
			draw.ellipse(((x/dotsNum-0.0002)*imWidth, (y/dotsNum-0.0002)*imHeight,(x/dotsNum+0.0002)*imWidth, (y/dotsNum+0.0002)*imHeight), fill = (0, 0, 0))

im.save("dots.png")