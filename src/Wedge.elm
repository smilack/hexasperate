module Wedge exposing (Wedge, create, view)

import Graphics exposing (Point)
import HexList
import Html exposing (Html)
import Label exposing (Label)
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
    Wedge label (Triangle ( 0, 0 ) b c)


view : HexList.Index -> Wedge -> Html msg
view index wedge =
    let
        c =
            adjustCenter index (center wedge.points)
    in
    S.g
        []
        [ S.path
            [ SA.d (triangleToPath wedge.points)
            , SA.class "wedge"
            , SA.class (Label.class wedge.label)
            ]
            []
        , Label.view c wedge.label
        ]


triangleToPath : Triangle -> String
triangleToPath (Triangle a b c) =
    let
        str ( x, y ) =
            String.fromFloat x ++ " " ++ String.fromFloat y
    in
    "M " ++ str a ++ " L " ++ str b ++ " L " ++ str c ++ " Z"


center : Triangle -> Point
center (Triangle _ ( bx, by ) ( cx, cy )) =
    ( (bx + cx) / 3, (by + cy) / 3 )


adjustCenter : HexList.Index -> Point -> Point
adjustCenter index ( x, y ) =
    case index of
        HexList.I ->
            ( x + 0, y + 0.5 )

        HexList.II ->
            ( x + 0, y + 0.7 )

        HexList.III ->
            ( x + 0, y + 0.5 )

        HexList.IV ->
            ( x + 0, y + 0.8 )

        HexList.V ->
            ( x + 0, y + 0.5 )

        HexList.VI ->
            ( x + 0, y + 0.8 )
