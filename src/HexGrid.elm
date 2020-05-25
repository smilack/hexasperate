{-
   Copyright 2020 Tom Smilack

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <https://www.gnu.org/licenses/>.
-}


module HexGrid exposing (Axial, HexGrid, Range, absolutePoint, cells, create, inBounds, neighbors, offset, sum, view)

import Graphics exposing (Point)
import HexList exposing (HexList, Index(..))
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


cells : HexGrid -> List Axial
cells (HexGrid _ _ axs) =
    axs


neighbors : Axial -> HexGrid -> HexList (Maybe Axial)
neighbors ( q, r ) (HexGrid _ _ axs) =
    let
        filterOutOfBounds ax =
            if List.member ax axs then
                Just ax

            else
                Nothing
    in
    HexList
        (filterOutOfBounds ( q + 1, r - 1 ))
        (filterOutOfBounds ( q, r - 1 ))
        (filterOutOfBounds ( q - 1, r ))
        (filterOutOfBounds ( q - 1, r + 1 ))
        (filterOutOfBounds ( q, r + 1 ))
        (filterOutOfBounds ( q + 1, r ))


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
            hexPoints zoom ax

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


hexPoints : Float -> Axial -> HexList Point
hexPoints zoom ax =
    let
        r =
            20 * zoom

        co =
            r * cos (pi / 3)

        si =
            r * sin (pi / 3)

        ( x, y ) =
            toPoint r ax
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
    let
        getOutline ax =
            HexList.compact (HexList.sieve (hexPoints zoom ax) (neighbors ax grid))

        arctan ( x, y ) =
            atan2 y x

        points =
            List.sortBy arctan
                (List.concatMap getOutline axs)
    in
    S.path
        [ SA.class "grid-outline"
        , SA.d (StrUtil.simplePath points)
        ]
        []
