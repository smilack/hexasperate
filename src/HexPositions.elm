module HexPositions exposing (HexPositions, get, glideAll, init, move, snap)

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


move : Hex -> Point -> HexPositions -> HexPositions
move { id } point dict =
    let
        current =
            An.current dict

        new =
            Dict.insert id point current
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


glideAll : List Hex -> List Point -> List Point -> HexPositions -> HexPositions
glideAll hexes from to dict =
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
            , An.wait (An.millis 750)
            , An.event An.quickly last
            ]
