{-
   Copyright 2020 Tom Smilack

   This file is part of Hexasperate.

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
-}


module Graphics exposing (BoundingBox, Point, difference, middle, scale, scalePoint, screen, sum)


type alias BoundingBox =
    { x : Float
    , y : Float
    , w : Float
    , h : Float
    }


type alias Point =
    ( Float, Float )


screen : BoundingBox
screen =
    BoundingBox 0 0 240 135


middle : Point
middle =
    ( screen.w / 2, screen.h / 2 )


scale : ( Float, Float ) -> BoundingBox -> BoundingBox -> Point
scale ( x, y ) elementBb camera =
    let
        ( cw, ch ) =
            ( elementBb.w / screen.w
            , elementBb.h / screen.h
            )

        c =
            min cw ch

        margin virtualSize actualSize =
            (actualSize / c - virtualSize) / 2

        ( newX, newY ) =
            if c == cw then
                ( camera.x + elementBb.x + (x / c)
                , camera.y + elementBb.y + (y / c) - margin screen.h elementBb.h
                )

            else
                ( camera.x + elementBb.x + (x / c) - margin screen.w elementBb.w
                , camera.y + elementBb.y + (y / c)
                )
    in
    ( newX, newY )


difference : Point -> Point -> Point
difference ( x1, y1 ) ( x2, y2 ) =
    ( x1 - x2, y1 - y2 )


sum : Point -> Point -> Point
sum ( x1, y1 ) ( x2, y2 ) =
    ( x1 + x2, y1 + y2 )


scalePoint : Float -> Point -> Point
scalePoint s ( x, y ) =
    ( s * x, s * y )
