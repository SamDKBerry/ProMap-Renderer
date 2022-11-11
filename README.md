# ProMap-Renderer

Tool to visualise Prodeus levels in 2D.

This is currently very wip, it's able to render a top down view of a Prodeus level by drawing each triangle with it's assigned colour. There is currently no logic around correctly positioning the level, there's a `centralOffset` value in `renderMap.ts` that needs tweaking on a per level basis to get all of the level in the image.

## Rough road map for improvemnts:

- Center levels in the image editor and scale image around them
- Look at making tool a bit more customisable with options to:
  - Show areas not on automap
  - change background colour
  - change resolution
  - add map and author titles
  - add grid overlay
  - show nodes and node links
- Look at giving the tool a gui: show which levels are available and give render options an interface

## Install Dependencies

Install node.

Then run:

`npm install`

## Run

ProMap takes an argument of the mapId you want to generate an image for. That map needs to exists in the LocalLow/BoundingBoxSoftware/Prodeus/CloudMaps maps folder (thats where it should be if you've downloaded it in game).

`npm run-script start MAP_ID`

If for example you had downloaded Altitude (which has the map Id hPkZH3dKig) and wanted to render it's layout you'd run:

`npm run-script start hPkZH3dKig`

The image will be rendered to an output folder in the root of this project. The above command would create `./output/Altitude.png`.
