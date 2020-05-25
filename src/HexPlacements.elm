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


module HexPlacements exposing (HexPlacements, at, available, empty, extract, removeAll)

import Dict exposing (Dict)
import Hex exposing (Hex, Id)
import HexGrid exposing (Axial)


type alias HexPlacements =
    Dict Id Axial


empty : HexPlacements
empty =
    Dict.empty


at : Axial -> List Hex -> HexPlacements -> Maybe Hex
at axial hexes placements =
    let
        idToHex id =
            case List.filter (.id >> (==) id) hexes of
                h :: _ ->
                    Just h

                [] ->
                    Nothing

        getHexAt ax =
            case List.filter (Tuple.second >> (==) ax) (Dict.toList placements) of
                ( id, _ ) :: _ ->
                    Just id

                [] ->
                    Nothing
    in
    Maybe.andThen idToHex (getHexAt axial)


extract : List Hex -> HexPlacements -> HexPlacements
extract hexes placements =
    let
        get hex =
            ( hex.id, Dict.get hex.id placements )

        exists ( id, mPoint ) =
            case mPoint of
                Nothing ->
                    Nothing

                Just point ->
                    Just ( id, point )
    in
    Dict.fromList (List.filterMap exists (List.map get hexes))


removeAll : List Hex -> HexPlacements -> HexPlacements
removeAll hexes placements =
    let
        fakePlacements =
            List.map
                (\id -> ( id, ( 0, 0 ) ))
                (List.map .id hexes)
    in
    Dict.diff placements (Dict.fromList fakePlacements)


available : Axial -> HexPlacements -> Bool
available axial placements =
    Dict.size (Dict.filter (\_ v -> v == axial) placements) == 0
