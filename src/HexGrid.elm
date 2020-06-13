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


module HexGrid exposing (Axial, HexGrid, Range, absolutePoint, cellAt, cells, create, custom, gridNeighbors, hexesAt, inBounds, neighborPoints, neighbors, offset, sum, view)

import Graphics exposing (Point)
import Hex exposing (Hex)
import HexList exposing (HexList, Index(..))
import HexPositions exposing (HexPositions)
import Html exposing (Html)
import Html.Lazy as L
import List.Extra
import StrUtil
import Svg as S
import Svg.Attributes as SA


type HexGrid
    = HexGrid Float Point (List Axial)


type alias Range =
    { x : ( Int, Int )
    , y : ( Int, Int )
    , z : ( Int, Int )
    }


type alias Axial =
    ( Int, Int )


type alias Cube =
    ( Int, Int, Int )


create : Float -> Point -> Range -> HexGrid
create zoom centerPoint { x, y, z } =
    HexGrid zoom centerPoint (inRange x y z)


custom : Float -> Point -> List Axial -> HexGrid
custom zoom centerPoint axs =
    HexGrid zoom centerPoint axs


cells : HexGrid -> List Axial
cells (HexGrid _ _ axs) =
    axs


gridNeighbors : Axial -> HexGrid -> HexList (Maybe Axial)
gridNeighbors axial (HexGrid _ _ axs) =
    let
        filterOutOfBounds ax =
            if List.member ax axs then
                Just ax

            else
                Nothing
    in
    HexList.map filterOutOfBounds (neighbors axial)


neighbors : Axial -> HexList Axial
neighbors ( q, r ) =
    HexList
        ( q + 1, r - 1 )
        ( q, r - 1 )
        ( q - 1, r )
        ( q - 1, r + 1 )
        ( q, r + 1 )
        ( q + 1, r )


inBounds : Axial -> HexGrid -> Bool
inBounds ax (HexGrid _ _ axs) =
    List.member ax axs


toPoint : Float -> Axial -> Point
toPoint zoom ( q, r ) =
    ( zoom * toFloat q * 3 / 2
    , zoom * (root3 * toFloat q / 2 + root3 * toFloat r)
    )


sum : Axial -> Axial -> Axial
sum ( x1, z1 ) ( x2, z2 ) =
    ( x1 + x2, z1 + z2 )


offset : Axial -> Axial -> Axial
offset ( x1, z1 ) ( x2, z2 ) =
    ( x2 - x1, z2 - z1 )


cellAt : Point -> HexGrid -> Maybe Axial
cellAt point ((HexGrid zoom ctr axs) as grid) =
    let
        center =
            Graphics.difference ctr (gridCenter (20 * zoom) axs)

        axialsAndPoints =
            List.map (\ax -> ( ax, axialPoints zoom ax )) axs

        axialsAndOutlines =
            List.map (Tuple.mapSecond (shiftPoints center)) axialsAndPoints
    in
    Maybe.map Tuple.first
        (List.head (List.filter (Tuple.second >> hexContains point) axialsAndOutlines))


shiftPoints : Point -> HexList Point -> HexList Point
shiftPoints point points =
    HexList.map (Graphics.sum point) points


hexContains : Point -> HexList Point -> Bool
hexContains ( x, y ) { i, ii, iii, iv, v, vi } =
    (y >= toLine i ii x)
        && (y >= toLine ii iii x)
        && (y >= toLine iii iv x)
        && (y <= toLine iv v x)
        && (y <= toLine v vi x)
        && (y <= toLine vi i x)


toLine : Point -> Point -> (Float -> Float)
toLine ( cx, cy ) ( dx, dy ) =
    let
        m =
            (cy - dy) / (cx - dx)
    in
    (*) m >> (+) (cy - cx * m)


hexesAt : Point -> List Hex -> HexPositions -> HexGrid -> List Hex
hexesAt point hexes positions ((HexGrid zoom ctr axs) as grid) =
    let
        center =
            Graphics.difference ctr (gridCenter (20 * zoom) axs)

        position hex =
            HexPositions.get hex positions

        hexesAndPoints =
            List.map (\hex -> ( hex, hexPoints zoom (position hex) )) hexes

        hexesAndOutlines =
            List.map (Tuple.mapSecond (shiftPoints center)) hexesAndPoints

        adjustedPoint =
            Graphics.sum point ctr
    in
    List.map Tuple.first
        (List.filter (Tuple.second >> hexContains adjustedPoint) hexesAndOutlines)


{-| Return the center point of a grid cell in Scene coordinates, after
accounting for the zoom and HexGrid center.
-}
absolutePoint : Float -> Axial -> HexGrid -> Point
absolutePoint puzzleZoom ax (HexGrid zoom ( sceneCx, sceneCy ) axs) =
    let
        ( gridCx, gridCy ) =
            gridCenter (20 * zoom) axs

        ( hexCx, hexCy ) =
            toPoint (20 * zoom) ax
    in
    ( (sceneCx + hexCx - gridCx) / puzzleZoom
    , (sceneCy + hexCy - gridCy) / puzzleZoom
    )


gridCenter : Float -> List Axial -> Point
gridCenter zoom axs =
    let
        points =
            List.map (toPoint zoom) axs

        minX =
            List.minimum (List.map Tuple.first points)

        maxX =
            List.maximum (List.map Tuple.first points)

        minY =
            List.minimum (List.map Tuple.second points)

        maxY =
            List.maximum (List.map Tuple.second points)
    in
    ( Maybe.withDefault 0 (Maybe.map2 (+) maxX minX) / 2
    , Maybe.withDefault 0 (Maybe.map2 (+) maxY minY) / 2
    )


root3 : Float
root3 =
    sqrt 3


inRange : ( Int, Int ) -> ( Int, Int ) -> ( Int, Int ) -> List Axial
inRange ( minX, maxX ) ( minY, maxY ) ( minZ, maxZ ) =
    let
        cube x y z =
            ( x, y, z )

        possible =
            List.Extra.lift3 cube
                (List.range minX maxX)
                (List.range minY maxY)
                (List.range minZ maxZ)

        valid ( x, y, z ) =
            (x + y + z) == 0

        cubes =
            List.filter valid possible
    in
    List.map toAxial cubes


toAxial : Cube -> Axial
toAxial ( x, _, z ) =
    ( x, z )


view : (Axial -> List (S.Attribute msg)) -> HexGrid -> Html msg
view mouseEvents ((HexGrid zoom ( cx, cy ) axs) as grid) =
    let
        ( gridCx, gridCy ) =
            gridCenter (20 * zoom) axs

        ( x, y ) =
            ( cx - gridCx, cy - gridCy )
    in
    S.g
        [ SA.class "grid"
        , SA.transform (StrUtil.translate x y)
        ]
        (viewHexGrid mouseEvents zoom axs ++ [ L.lazy viewOutline grid ])


viewHexGrid : (Axial -> List (S.Attribute msg)) -> Float -> List Axial -> List (Html msg)
viewHexGrid mouseEvents zoom axs =
    List.map (viewHex mouseEvents zoom) axs


viewHex : (Axial -> List (S.Attribute msg)) -> Float -> Axial -> Html msg
viewHex mouseEvents zoom ax =
    let
        points =
            axialPoints zoom ax

        coords =
            HexList.toList points

        --( x1, y ) =
        --    HexList.get I points
        --( x2, _ ) =
        --    HexList.get IV points
        --x =
        --    (x1 + x2) / 2
    in
    --S.g []
    --    [
    S.path
        ([ SA.class "grid-hex"
         , SA.d (StrUtil.simplePath coords)
         ]
            ++ mouseEvents ax
        )
        []



--, S.text_
--    [ SA.class "text center"
--    , SA.x (String.fromFloat x)
--    , SA.y (String.fromFloat y)
--    ]
--    [ S.text (StrUtil.axial ax) ]
--]


axialPoints : Float -> Axial -> HexList Point
axialPoints zoom ax =
    hexPoints zoom (toPoint (20 * zoom) ax)


hexPoints : Float -> Point -> HexList Point
hexPoints zoom ( x, y ) =
    let
        r =
            20 * zoom

        co =
            r * cos (pi / 3)

        si =
            r * sin (pi / 3)
    in
    HexList
        ( x + r, y + 0 )
        ( x + co, y - si )
        ( x - co, y - si )
        ( x - r, y + 0 )
        ( x - co, y + si )
        ( x + co, y + si )


viewOutline : HexGrid -> Html msg
viewOutline ((HexGrid zoom _ axs) as grid) =
    S.path
        [ SA.class "grid-outline"
        , SA.d (getOutline zoom axs grid)
        ]
        []


getOutline : Float -> List Axial -> HexGrid -> String
getOutline zoom axGroup grid =
    let
        -- get the line segments that are part of this outline
        filterToGroup : Axial -> HexList (Maybe Axial)
        filterToGroup ax =
            HexList.filter (\a -> List.member a axGroup) (gridNeighbors ax grid)

        neighborsInGroup : List (HexList (Maybe Axial))
        neighborsInGroup =
            List.map filterToGroup axGroup

        outlineSegments : List (HexList (Maybe ( Index, Index )))
        outlineSegments =
            List.map (HexList.sieve Hex.sides) neighborsInGroup

        -- get all the points for each hex in this group
        allPoints : List (HexList Point)
        allPoints =
            List.map (axialPoints zoom) axGroup

        -- get a segment for a given hex side
        getSegment : HexList Point -> Maybe ( Index, Index ) -> Maybe String
        getSegment pts mSeg =
            case mSeg of
                Just ( i1, i2 ) ->
                    Just (StrUtil.line (HexList.get i1 pts) (HexList.get i2 pts))

                Nothing ->
                    Nothing

        -- get segments for a given hex
        getHexSegments : HexList Point -> HexList (Maybe ( Index, Index )) -> List String
        getHexSegments pts segs =
            HexList.compact (HexList.map (getSegment pts) segs)

        -- combine segments for all hexes in the group
        outline =
            List.concat (List.map2 getHexSegments allPoints outlineSegments)
    in
    String.join " " outline
