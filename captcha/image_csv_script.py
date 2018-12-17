#!/usr/bin/env python
from __future__ import print_function
import os
import csv
 
images_path = './images/'
blurry_path = './blurry_images/'
practice_path = './practice_images/'
 
images = os.listdir(images_path)
blurry = os.listdir(blurry_path)
practice = os.listdir(practice_path)


with open('images.csv', mode='w') as image_file:
	image_writer = csv.writer(image_file, delimiter=',')
	for name in images:
		if name != '.DS_Store':
			image_writer.writerow([name, images_path + name])

with open('blurry_images.csv', mode='w') as blurry_file:
	image_writer = csv.writer(blurry_file, delimiter=',')
	for name in blurry:
		if name != '.DS_Store':
			image_writer.writerow(["blurry", blurry_path + name])


with open('practice_images.csv', mode='w') as practice_file:
	image_writer = csv.writer(practice_file, delimiter=',')
	for name in practice:
		if name != '.DS_Store':
			image_writer.writerow(["practice", practice_path + name])
