module Wedge exposing (Wedge, create, view)

import Graphics exposing (Point)
import Html exposing (Html)
import Label exposing (Label)
import Options
import Palette exposing (Palette)
import SixList
import Svg as S
import Svg.Attributes as SA


type alias Wedge =
    { label : Label
    , points : Triangle
    }


type Triangle
    = Triangle Point Point Point


create : Label -> Point -> Point -> Wedge
create label b c =
    Wedge label (Triangle (Point 0 0) b c)


view : Palette -> Options.OnOff -> SixList.Index -> Wedge -> Html msg
view palette labels index wedge =
    let
        c_ =
            center wedge.points

        c =
            adjustCenter index c_

        fill =
            Palette.color wedge.label palette

        strokeClass =
            if fill == "transparent" then
                "transparent"

            else
                ""

        text =
            case labels of
                Options.On ->
                    Label.view c wedge.label

                Options.Off ->
                    S.text ""
    in
    S.g
        []
        [ S.path
            [ SA.d (triangleToPath wedge.points)
            , SA.fill fill
            , SA.class "wedge"
            , SA.class strokeClass
            ]
            []
        , S.path
            [ SA.d (cornersToCentroid wedge.points c_)
            , SA.fill "none"
            , SA.stroke "white"
            , SA.strokeWidth "0"
            ]
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


cornersToCentroid : Triangle -> Point -> String
cornersToCentroid (Triangle a b c) cent =
    let
        str { x, y } =
            String.fromFloat x ++ " " ++ String.fromFloat y

        m =
            "M " ++ str cent ++ " "

        l p =
            "L " ++ str p ++ " "
    in
    m ++ l a ++ m ++ l b ++ m ++ l c


center : Triangle -> Point
center (Triangle _ b c) =
    Point
        ((b.x + c.x) / 3)
        ((b.y + c.y) / 3)


adjustCenter : SixList.Index -> Point -> Point
adjustCenter index { x, y } =
    case index of
        SixList.I ->
            Point (x + 0) (y + 0.5)

        SixList.II ->
            Point (x + 0) (y + 0.7)

        SixList.III ->
            Point (x + 0) (y + 0.5)

        SixList.IV ->
            Point (x + 0) (y + 0.7)

        SixList.V ->
            Point (x + 0) (y + 0.7)

        SixList.VI ->
            Point (x + 0) (y + 0.7)
