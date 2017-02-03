# ksp-fotky

You will need Node.js (v6.9.2 would be optimal).

Create a folder `images`, images from this folder will be displayed on the page.

Script `scrape_images.py` has 2 functions, `renumber` goes through all the
photos in image folder and renumbers them from 1 to n. `link [filename]` will
download all the images from the links in the chosen filename.

Results are stored in sqlite file in the table `photos`.

You can run the server with

```
npm install
PORT=8000 npm start
```

Default port is 3000.
