module HexPositions exposing (HexPositions, get, init, move, snap)

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
