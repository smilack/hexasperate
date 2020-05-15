module Palette exposing (Color, Option(..), Palette, color, colors, get, optionNames, options)

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
    | Material
    | ColorBlind
    | Grayscale
    | AllSame
    | Transparent



-- OPTIONS


options : List Option
options =
    [ Resistors, Material, ColorBlind, Grayscale, AllSame, Transparent ]


optionNames : Option -> String
optionNames option =
    case option of
        Resistors ->
            "Resistors"

        Material ->
            "Material"

        ColorBlind ->
            "Color Blind"

        Grayscale ->
            "Grayscale"

        AllSame ->
            "All Same"

        Transparent ->
            "Transparent"


get : Option -> Palette
get option =
    case option of
        Resistors ->
            resistors

        Material ->
            material

        ColorBlind ->
            colorblind

        Grayscale ->
            grayscale

        AllSame ->
            allSame

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


allSame : Palette
allSame =
    Palette "#858585" "#858585" "#858585" "#858585" "#858585" "#858585" "#858585" "#858585" "#858585" "#858585"


transparent : Palette
transparent =
    Palette "transparent" "transparent" "transparent" "transparent" "transparent" "transparent" "transparent" "transparent" "transparent" "transparent"
