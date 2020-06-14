# ![Hexasperate title card](assets/hexasperate-title.png)

Hexasperate is an edge-matching puzzle game inspired by [TetraVex](#links).

**Play Hexasperate at [hexasperate.com](https://hexasperate.com)**

## How to Play

The goal of Hexasperate is to place all the hexagonal tiles in the grid so that everywhere two hexagons touch, the colors match.

Tiles can be dragged with the mouse:
* Left clicking and dragging a hexagon moves that one hexagon.
* Right clicking a hexagon and dragging it will move it and all tiles connected to it.

On devices with touch screens, tiles can only be dragged one-by-one via touch.

### A new game of Hexasperate with no tiles placed yet
![A new game of Hexasperate](assets/goal-before.png)

### A completed puzzle
![A completed game of Hexasperate](assets/goal-after.png)

## Running from Source
Hexasperate is written in [Elm](https://elm-lang.org). The [official Elm guide](https://guide.elm-lang.org) contains installation instructions.

`make-dev` uses [elm-live](https://github.com/wking-io/elm-live), but it is not required to compile the code. You could instead run:

    elm make src/Main.elm --output=hexasperate.js

`make-prod` uses [UglifyJS](https://www.npmjs.com/package/uglify-js) to minify the compiled code, but to compile with just Elm, you could run:

    elm make src/Main.elm --output=hexasperate.js --optimize

## Links

* [Play TetraVex on archive.org](https://archive.org/details/win3_TetraVex)

## License
Copyright 2020 Tom Smilack

Hexasperate is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Hexasperate is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Hexasperate.  If not, see <https://www.gnu.org/licenses/>.
