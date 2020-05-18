module Hex exposing (Hex, Id, create, view)

import Graphics exposing (Point)
import HexList exposing (HexList)
import Html exposing (Html)
import Label exposing (Label)
import StrUtil
import Svg as S
import Svg.Attributes as SA



-- TYPES


type alias Id =
    Int


type alias Hex =
    { id : Id
    , wedges : HexList Wedge
    , outline : HexList Point
    }


type alias Wedge =
    { label : Label
    , points : Triangle
    }


type Triangle
    = Triangle Point Point Point


create : Id -> HexList Label -> Hex
create id labels =
    let
        co =
            20 * cos (pi / 3)

        si =
            20 * sin (pi / 3)

        coords =
            HexList
                ( 20, 0 )
                ( co, -si )
                ( -co, -si )
                ( -20, 0 )
                ( -co, si )
                ( co, si )

        wedges =
            HexList
                (Wedge labels.i (Triangle ( 0, 0 ) coords.i coords.ii))
                (Wedge labels.ii (Triangle ( 0, 0 ) coords.ii coords.iii))
                (Wedge labels.iii (Triangle ( 0, 0 ) coords.iii coords.iv))
                (Wedge labels.iv (Triangle ( 0, 0 ) coords.iv coords.v))
                (Wedge labels.v (Triangle ( 0, 0 ) coords.v coords.vi))
                (Wedge labels.vi (Triangle ( 0, 0 ) coords.vi coords.i))
    in
    Hex id wedges coords



-- VIEW


view : Hex -> Html msg
view { wedges, outline } =
    S.g
        [ SA.class "hex" ]
        (List.concat (HexList.toList (HexList.indexedMap viewWedge wedges))
            ++ HexList.toList (HexList.map (.points >> viewWedgeDivider) wedges)
            ++ [ viewHexOutline outline ]
        )


viewWedge : HexList.Index -> Wedge -> List (Html msg)
viewWedge index wedge =
    let
        (Triangle a b c) =
            wedge.points

        center =
            adjustCenter index (centroid wedge.points)
    in
    [ S.path
        [ SA.d (StrUtil.simplePath [ a, b, c ])
        , SA.class "wedge"
        , SA.class (Label.class wedge.label)
        ]
        []
    , Label.view center wedge.label
    ]


viewWedgeDivider : Triangle -> Html msg
viewWedgeDivider (Triangle a b _) =
    S.path
        [ SA.d (StrUtil.line a b)
        , SA.class "wedge-outline"
        ]
        []


viewHexOutline : HexList Point -> Html msg
viewHexOutline coords =
    S.path
        [ SA.d (StrUtil.simplePath (HexList.toList coords))
        , SA.class "hex-outline"
        ]
        []



-- LABEL PLACEMENT


centroid : Triangle -> Point
centroid (Triangle _ ( bx, by ) ( cx, cy )) =
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
