#!/usr/bin/python3

import urllib.request
import sys
import os

if len(sys.argv) < 2:
    print("Arguments missing!")
    exit(1)

if sys.argv[1] == "help":
  print("""
    help:            display this page
    renumber:        renumber the photos in images directory
    link [filename]: download images from links in the given filename
  """)

if sys.argv[1] == "renumber":
  print("Starting image renaming")
  files = os.listdir("images")
  files.sort()
  n = 1
  for name in files:
    image = name[:-4]
    if str(n).zfill(5) != image:
      source = "images/" + image + ".jpg"
      dest = "images/" + str(n).zfill(5) + ".jpg"
      print("Renaming", source, "to", dest)
      os.rename(source, dest)
    n += 1
  exit(0)

if sys.argv[1] == "link":
  if len(sys.argv) < 3:
    print("No source for image links defined!")
    exit(1)

  if not os.path.exists("images"):
      os.makedirs("images")

  image_links = open(sys.argv[1])
  n = 0

  for image_name in os.listdir("images"):
      n = max(n, int(image_name[:-4]))

  n += 1

  for link in image_links:
      link = link.rstrip('\n')
      name = str(n).zfill(5)
      print("Downloading ", name + ".jpg")
      urllib.request.urlretrieve(link, "images/" + name + ".jpg")
      n += 1