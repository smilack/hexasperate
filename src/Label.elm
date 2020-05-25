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


module Label exposing (Label(..), class, labels, toString, view)

import Graphics exposing (Point)
import Html exposing (Html)
import Svg as S
import Svg.Attributes as SA


type Label
    = Zero
    | One
    | Two
    | Three
    | Four
    | Five
    | Six
    | Seven
    | Eight
    | Nine


labels : List Label
labels =
    [ Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine ]


class : Label -> String
class label =
    "label-" ++ toString label


view : Point -> Label -> Html msg
view center label =
    let
        ( x, y ) =
            adjustCenter label center
    in
    S.text_
        [ SA.x (String.fromFloat x)
        , SA.y (String.fromFloat y)
        , SA.class ("center label " ++ class label)
        ]
        [ S.text (toString label) ]


adjustCenter : Label -> Point -> Point
adjustCenter label ( x, y ) =
    case label of
        Zero ->
            ( x + 0, y + 0 )

        One ->
            ( x - 0.3, y + 0 )

        Two ->
            ( x + 0, y + 0 )

        Three ->
            ( x + 0, y + 0 )

        Four ->
            ( x + 0, y + 0 )

        Five ->
            ( x + 0, y + 0 )

        Six ->
            ( x + 0.1, y + 0 )

        Seven ->
            ( x + 0.1, y + 0 )

        Eight ->
            ( x + 0, y + 0 )

        Nine ->
            ( x + 0, y + 0 )


toString : Label -> String
toString label =
    case label of
        Zero ->
            "0"

        One ->
            "1"

        Two ->
            "2"

        Three ->
            "3"

        Four ->
            "4"

        Five ->
            "5"

        Six ->
            "6"

        Seven ->
            "7"

        Eight ->
            "8"

        Nine ->
            "9"
