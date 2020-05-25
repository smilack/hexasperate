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


module Palette exposing (Color, Option(..), Palette, class, color, colors, get, nameToOption, optionNames, options)

import Label exposing (Label(..))



-- TYPES


type alias Color =
    String


type alias Palette =
    { zero : Color
    , one : Color
    , two : Color
    , three : Color
    , four : Color
    , five : Color
    , six : Color
    , seven : Color
    , eight : Color
    , nine : Color
    }


type Option
    = Resistors
    | Mondrian
    | Material
    | ColorBlind
    | Grayscale
    | Classic
    | Transparent



-- OPTIONS


options : List Option
options =
    [ Resistors, Mondrian, Material, ColorBlind, Grayscale, Classic, Transparent ]


optionNames : Option -> String
optionNames option =
    case option of
        Resistors ->
            "Resistors"

        Mondrian ->
            "Mondrian"

        Material ->
            "Material"

        ColorBlind ->
            "Color Blind"

        Grayscale ->
            "Grayscale"

        Classic ->
            "Classic"

        Transparent ->
            "Transparent"


nameToOption : String -> Maybe Option
nameToOption str =
    case str of
        "Resistors" ->
            Just Resistors

        "Mondrian" ->
            Just Mondrian

        "Material" ->
            Just Material

        "Color Blind" ->
            Just ColorBlind

        "Grayscale" ->
            Just Grayscale

        "Classic" ->
            Just Classic

        "Transparent" ->
            Just Transparent

        _ ->
            Nothing


class : Option -> String
class option =
    case option of
        Resistors ->
            "palette-resistors"

        Mondrian ->
            "palette-mondrian"

        Material ->
            "palette-material"

        ColorBlind ->
            "palette-colorblind"

        Grayscale ->
            "palette-grayscale"

        Classic ->
            "palette-classic"

        Transparent ->
            "palette-transparent"


get : Option -> Palette
get option =
    case option of
        Resistors ->
            resistors

        Mondrian ->
            mondrian

        Material ->
            material

        ColorBlind ->
            colorblind

        Grayscale ->
            grayscale

        Classic ->
            classic

        Transparent ->
            transparent



-- COLORS


colors : Palette -> List Color
colors { zero, one, two, three, four, five, six, seven, eight, nine } =
    [ zero, one, two, three, four, five, six, seven, eight, nine ]


color : Label -> Palette -> Color
color label palette =
    case label of
        Zero ->
            palette.zero

        One ->
            palette.one

        Two ->
            palette.two

        Three ->
            palette.three

        Four ->
            palette.four

        Five ->
            palette.five

        Six ->
            palette.six

        Seven ->
            palette.seven

        Eight ->
            palette.eight

        Nine ->
            palette.nine



-- PALETTES


resistors : Palette
resistors =
    Palette "#000000" "#884400" "#ff0000" "#ff8800" "#ffff00" "#00ee00" "#1122ff" "#8800ff" "#888888" "#ffffff"


mondrian : Palette
mondrian =
    Palette "#ffffff" "#292929" "#dd0100" "#fac901" "#225095" "#ffffff" "#292929" "#dd0100" "#fac901" "#225095"


material : Palette
material =
    Palette "#FF5722" "#E91E63" "#9C27B0" "#3F51B5" "#2196F3" "#00897B" "#4CAF50" "#FFEB3B" "#FF9800" "#795548"


colorblind : Palette
colorblind =
    -- http://mkweb.bcgsc.ca/colorblind/palettes.mhtml
    Palette "#323232" "#bf3465" "#50b29e" "#d9d9d9" "#731683" "#1c6ccc" "#21bcff" "#dfa5e5" "#db6d1b" "#f4e345"


grayscale : Palette
grayscale =
    Palette "#000000" "#1e1e1e" "#353535" "#4e4e4e" "#696969" "#858585" "#a2a2a2" "#c0c0c0" "#dfdfdf" "#ffffff"


classic : Palette
classic =
    Palette "#858585" "#858585" "#858585" "#858585" "#858585" "#858585" "#858585" "#858585" "#858585" "#858585"


transparent : Palette
transparent =
    Palette "transparent" "transparent" "transparent" "transparent" "transparent" "transparent" "transparent" "transparent" "transparent" "transparent"
