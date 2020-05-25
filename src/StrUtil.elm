{-
   Copyright 2020 Tom Smilack

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <https://www.gnu.org/licenses/>.
-}


module StrUtil exposing (axial, line, scale, simplePath, spaceDelimit2, spaceDelimit4, transform, translate)

import Graphics exposing (Point)


{-|

    translate 1 2 == "translate(1 2)"

-}
translate : Float -> Float -> String
translate x y =
    "translate(" ++ spaceDelimit2 x y ++ ")"


{-|

    transform 1 2 3 == "translate(1 2) scale(3)"

-}
transform : Float -> Float -> Float -> String
transform x y zoom =
    "translate("
        ++ spaceDelimit2 x y
        ++ ") scale("
        ++ String.fromFloat zoom
        ++ ")"


{-|

    scale 1 == "scale(1)"

-}
scale : Float -> String
scale z =
    "scale(" ++ String.fromFloat z ++ ")"


{-|

    axial 1 2 == "(1, 2)"

-}
axial : ( Int, Int ) -> String
axial ( x, y ) =
    "(" ++ String.fromInt x ++ ", " ++ String.fromInt y ++ ")"


{-|

    simplePath [ ( 0, 1 ), ( 2, 3 ), ( 4, 5 ) ] == "M 0 1 L 2 3 L 4 5 Z"

-}
simplePath : List Point -> String
simplePath coords =
    let
        apply fn ( x, y ) =
            fn x y
    in
    "M " ++ String.join " L " (List.map (apply spaceDelimit2) coords) ++ " Z"


{-|

    line ( 1, 2 ) ( 3, 4 ) == "M 1 2 L 3 4"

-}
line : Point -> Point -> String
line ( ax, ay ) ( bx, by ) =
    "M " ++ spaceDelimit2 ax ay ++ " L " ++ spaceDelimit2 bx by


{-|

    spaceDelimit2 1 2 == "1 2"

-}
spaceDelimit2 : Float -> Float -> String
spaceDelimit2 x y =
    String.fromFloat x
        ++ " "
        ++ String.fromFloat y


{-|

    spaceDelimit4 1 2 3 4 == "1 2 3 4"

-}
spaceDelimit4 : Float -> Float -> Float -> Float -> String
spaceDelimit4 x y w h =
    spaceDelimit2 x y ++ " " ++ spaceDelimit2 w h
