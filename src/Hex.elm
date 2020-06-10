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


module Hex exposing (Hex, Id, create, id, labelAt, labels, matchingLabel, sides, view)

import Graphics exposing (Point)
import HexList exposing (HexList, Index(..))
import Html exposing (Html)
import Label exposing (Label)
import StrUtil
import Svg as S
import Svg.Attributes as SA



-- TYPES


type alias Id =
    Int


type Hex
    = Hex HexInfo


type alias HexInfo =
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
create id_ labs =
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
                (createWedge labs.i (Triangle ( 0, 0 ) coords.i coords.ii))
                (createWedge labs.ii (Triangle ( 0, 0 ) coords.ii coords.iii))
                (createWedge labs.iii (Triangle ( 0, 0 ) coords.iii coords.iv))
                (createWedge labs.iv (Triangle ( 0, 0 ) coords.iv coords.v))
                (createWedge labs.v (Triangle ( 0, 0 ) coords.v coords.vi))
                (createWedge labs.vi (Triangle ( 0, 0 ) coords.vi coords.i))
    in
    Hex (HexInfo id_ wedges (StrUtil.simplePath (HexList.toList coords)))


createWedge : Label -> Triangle -> Wedge
createWedge label ((Triangle a b c) as points) =
    Wedge label points (StrUtil.simplePath [ a, b, c ])



-- UTILITIES


id : Hex -> Int
id (Hex h) =
    h.id


sides : HexList ( Index, Index )
sides =
    HexList ( I, II ) ( II, III ) ( III, IV ) ( IV, V ) ( V, VI ) ( VI, I )


{-| Get the label touching a hex that the given Hex is the neighbor of at
the given Index.

    matchingLabel I
        (Hex (HexInfo
            _
            (HexList
                (Wedge One _)
                (Wedge Two _)
                (Wedge Three _)
                (Wedge Four _)
                (Wedge Five _)
                (Wedge Six _)
            )
            _
        )
        == Four

-}
matchingLabel : Index -> Hex -> Label
matchingLabel index (Hex { wedges }) =
    let
        wedge =
            HexList.get (HexList.invert index) wedges
    in
    wedge.label


labels : Hex -> HexList Label
labels (Hex { wedges }) =
    HexList.map .label wedges


labelAt : Index -> Hex -> Label
labelAt index (Hex { wedges }) =
    HexList.get (HexList.invert index) wedges |> .label



-- VIEW


view : Hex -> Html msg
view (Hex { wedges, outline }) =
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


adjustCenter : Index -> Point -> Point
adjustCenter index ( x, y ) =
    case index of
        I ->
            ( x + 0, y + 0.5 )

        II ->
            ( x + 0, y + 0.7 )

        III ->
            ( x + 0, y + 0.5 )

        IV ->
            ( x + 0, y + 0.8 )

        V ->
            ( x + 0, y + 0.5 )

        VI ->
            ( x + 0, y + 0.8 )
