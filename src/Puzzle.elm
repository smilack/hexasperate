module Puzzle exposing (Puzzle, Size(..), create, generateValues)

import Hex exposing (Hex)
import HexList exposing (HexList, Index(..))
import Label exposing (Label(..))
import Random
import Random.List


type alias Puzzle =
    List Hex


type Size
    = Small
    | Medium
    | Large


create : List Int -> List Label -> (List Hex -> msg) -> Cmd msg
create hexIds values msg =
    let
        puzzle =
            []
    in
    Random.generate msg (Random.List.shuffle puzzle)


generateValues : Size -> (List Label -> msg) -> Cmd msg
generateValues size msg =
    Random.generate msg
        (Random.list (numValues size)
            (Random.uniform Zero
                [ One, Two, Three, Four, Five, Six, Seven, Eight, Nine ]
            )
        )


numValues : Size -> Int
numValues size =
    case size of
        Small ->
            30

        Medium ->
            0

        Large ->
            0
