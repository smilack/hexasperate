module HexPositions exposing (HexPositions, get, getLagged, glideAll, init, move, snap)

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
    { x = An.at x |> An.leaveLate leave |> An.arriveEarly arrive
    , y = An.at y |> An.leaveLate leave |> An.arriveEarly arrive
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


snap : Hex -> Point -> HexPositions -> HexPositions
snap { id } point dict =
    let
        current =
            An.current dict

        new =
            Dict.insert id point current
    in
    dict |> An.queue [ An.event An.quickly new ]


glideAll : List Hex -> List Point -> List Point -> Float -> HexPositions -> HexPositions
glideAll hexes from to glideDuration dict =
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
            , An.event (An.millis glideDuration) last
            ]
