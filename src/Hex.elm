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
    , outline : String
    }


type alias Wedge =
    { label : Label
    , points : Triangle
    , path : String
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
                (createWedge labels.i (Triangle ( 0, 0 ) coords.i coords.ii))
                (createWedge labels.ii (Triangle ( 0, 0 ) coords.ii coords.iii))
                (createWedge labels.iii (Triangle ( 0, 0 ) coords.iii coords.iv))
                (createWedge labels.iv (Triangle ( 0, 0 ) coords.iv coords.v))
                (createWedge labels.v (Triangle ( 0, 0 ) coords.v coords.vi))
                (createWedge labels.vi (Triangle ( 0, 0 ) coords.vi coords.i))
    in
    Hex id wedges (StrUtil.simplePath (HexList.toList coords))


createWedge : Label -> Triangle -> Wedge
createWedge label ((Triangle a b c) as points) =
    Wedge label points (StrUtil.simplePath [ a, b, c ])



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
        center =
            adjustCenter index (centroid wedge.points)
    in
    [ S.path
        [ SA.d wedge.path
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


viewHexOutline : String -> Html msg
viewHexOutline outline =
    S.path
        [ SA.d outline
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
