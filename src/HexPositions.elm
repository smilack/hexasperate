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


module HexPositions exposing (HexPositions, get, getLagged, glideAll, init, move, moveAll, snap)

import Animator as An
import Dict exposing (Dict)
import Graphics exposing (Point)
import Hex exposing (Hex)


type alias HexPositions =
    An.Timeline (Dict Hex.Id Point)


init : HexPositions
init =
    An.init Dict.empty


get : Hex -> HexPositions -> Point
get { id } dict =
    let
        { x, y } =
            An.xy dict (getPos id)
    in
    ( x, y )


getPos : Hex.Id -> Dict Hex.Id Point -> { x : An.Movement, y : An.Movement }
getPos id state =
    let
        ( x, y ) =
            Maybe.withDefault ( 0, 0 ) (Dict.get id state)
    in
    { x = An.at x, y = An.at y }


getLagged : Hex -> Int -> Int -> HexPositions -> Point
getLagged { id } index count dict =
    let
        ( i, n, t ) =
            ( toFloat index, toFloat count, 0.5 )

        leave =
            t * i / n

        arrive =
            t * (n - i) / n

        { x, y } =
            An.xy dict (getPosLagged id leave arrive)
    in
    ( x, y )


getPosLagged : Hex.Id -> Float -> Float -> Dict Hex.Id Point -> { x : An.Movement, y : An.Movement }
getPosLagged id leave arrive state =
    let
        ( x, y ) =
            Maybe.withDefault ( 0, 0 ) (Dict.get id state)
    in
    { x = An.at x |> An.leaveLate leave |> An.arriveEarly arrive |> An.arriveSmoothly 1
    , y = An.at y |> An.leaveLate leave |> An.arriveEarly arrive |> An.arriveSmoothly 1
    }


move : Hex -> Point -> HexPositions -> HexPositions
move { id } point dict =
    let
        current =
            An.current dict

        new =
            Dict.insert id point current
    in
    dict |> An.queue [ An.event An.immediately new ]


moveAll : List ( Hex.Id, Point ) -> HexPositions -> HexPositions
moveAll pairs dict =
    let
        current =
            An.current dict

        new =
            Dict.union (Dict.fromList pairs) current
    in
    dict |> An.queue [ An.event An.immediately new ]


snap : Hex -> Point -> HexPositions -> HexPositions
snap { id } point dict =
    let
        current =
            An.current dict

        new =
            Dict.insert id point current
    in
    dict |> An.queue [ An.event An.quickly new ]


glideAll : List Hex -> List Point -> List Point -> Float -> Float -> HexPositions -> HexPositions
glideAll hexes from to glideDelay glideDuration dict =
    let
        ids =
            List.map .id hexes

        current =
            An.current dict

        next =
            Dict.union (Dict.fromList (List.map2 Tuple.pair ids from)) current

        last =
            Dict.union (Dict.fromList (List.map2 Tuple.pair ids to)) next
    in
    dict
        |> An.queue
            [ An.event An.immediately next
            , An.wait (An.millis glideDelay)
            , An.event (An.millis glideDuration) last
            ]
