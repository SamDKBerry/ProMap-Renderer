# ProMap-Renderer

Tool to visualise Prodeus levels in 2D.

This is currently very wip, it's able to render a top down view of a Prodeus level by drawing each triangle with it's assigned colour. There is currently no logic around correctly positioning the level, there's a `centralOffset` value in `renderMap.ts` that needs tweaking on a per level basis to get all of the level in the image.

## Rough road map for improvemnts:

- Center levels in the image editor and scale image around them
- Look at making tool a bit more customisable with options to:
  - add map and author titles
  - add grid overlay
  - show nodes and node links
- Look at giving the tool a gui: show which levels are available and give render options an interface

## Install Dependencies

Install node.

Then run:

`npm install`

## Run

To compile and run the map locally:
`npm run-script start`

To package a windows distributabel of the app
`npm run-script make`
