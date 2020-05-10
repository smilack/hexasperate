module Hex exposing (Hex, attributes, create, toPath)

import Graphics exposing (Point)
import Html
import Svg.Attributes


type alias Hex =
    { coords : Coords
    , style : Style
    }


type alias Coords =
    { i : Point
    , ii : Point
    , iii : Point
    , iv : Point
    , v : Point
    , vi : Point
    }


type alias Style =
    { stroke : String
    , fill : String
    , fontStroke : String
    , fontFill : String
    }


create : Point -> Float -> ( String, String ) -> ( String, String ) -> Hex
create { x, y } r ( stroke, fill ) ( fontStroke, fontFill ) =
    let
        co =
            r * cos (pi / 3)

        si =
            r * sin (pi / 3)

        coords =
            Coords
                (Point (x + r) (y + 0))
                (Point (x + co) (y - si))
                (Point (x - co) (y - si))
                (Point (x - r) (y + 0))
                (Point (x - co) (y + si))
                (Point (x + co) (y + si))

        st =
            Style stroke fill fontStroke fontFill
    in
    Hex coords st


toPath : Hex -> String
toPath { coords } =
    let
        { i, ii, iii, iv, v, vi } =
            coords

        m =
            "M " ++ pointToString i ++ " "

        l =
            String.join " "
                (List.map ((++) "L ")
                    (List.map pointToString [ ii, iii, iv, v, vi ])
                )

        z =
            " Z"
    in
    m ++ l ++ z


pointToString : Point -> String
pointToString { x, y } =
    String.fromFloat x ++ " " ++ String.fromFloat y


attributes : Hex -> List (Html.Attribute msg)
attributes { style } =
    [ Svg.Attributes.stroke style.stroke
    , Svg.Attributes.fill style.fill
    ]
