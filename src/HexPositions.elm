module HexPositions exposing (HexPositions, get, init, insert)

import Dict exposing (Dict)
import Graphics exposing (Point)
import Hex exposing (Hex)


type alias HexPositions =
    Dict Hex.Id Point


init : HexPositions
init =
    Dict.empty


get : Hex -> HexPositions -> Point
get { id } dict =
    Maybe.withDefault Graphics.middle
        (Dict.get id dict)


insert : Hex -> Point -> HexPositions -> HexPositions
insert { id } point dict =
    Dict.insert id point dict
