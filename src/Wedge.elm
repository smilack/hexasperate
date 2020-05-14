module Wedge exposing (Wedge, create, view)

import Graphics exposing (Point)
import Html exposing (Html)
import Options
import Palette exposing (Number, Palette)
import Svg as S
import Svg.Attributes as SA


type alias Wedge =
    { number : Number
    , points : Triangle
    }


type Triangle
    = Triangle Point Point Point


create : Number -> Point -> Point -> Wedge
create num b c =
    Wedge num (Triangle (Point 0 0) b c)


view : Palette -> Options.OnOff -> Wedge -> Html msg
view palette labels wedge =
    let
        c =
            center wedge.points

        fill =
            Palette.color wedge.number palette

        strokeAttrs =
            if fill == "transparent" then
                []

            else
                [ SA.stroke "white"
                , SA.strokeWidth "0.1"
                ]

        text =
            case labels of
                Options.On ->
                    S.text_
                        [ SA.x (String.fromFloat c.x)
                        , SA.y (String.fromFloat c.y)
                        , SA.class "label center"
                        ]
                        [ S.text (Palette.numberToString wedge.number) ]

                Options.Off ->
                    S.text ""
    in
    S.g
        []
        [ S.path
            ([ SA.d (triangleToPath wedge.points)
             , SA.fill fill
             ]
                ++ strokeAttrs
            )
            []
        , text
        ]


triangleToPath : Triangle -> String
triangleToPath (Triangle a b c) =
    let
        str { x, y } =
            String.fromFloat x ++ " " ++ String.fromFloat y
    in
    "M " ++ str a ++ " L " ++ str b ++ " L " ++ str c ++ " Z"


center : Triangle -> Point
center (Triangle _ b c) =
    Point
        ((b.x + c.x) / 3)
        ((b.y + c.y) / 3)
