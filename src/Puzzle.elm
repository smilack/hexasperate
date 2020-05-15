module Puzzle exposing (Puzzle, Size(..), create, empty, generateValues, range)

import Graphics
import Hex exposing (Hex)
import HexGrid exposing (HexGrid)
import HexList exposing (HexList, Index(..))
import Label exposing (Label(..))
import Random
import Random.List


type alias Puzzle =
    { hexes : List Hex
    , grid : HexGrid
    }


empty : Puzzle
empty =
    Puzzle [] (HexGrid.create 0 ( 0, 0 ) (HexGrid.Range ( 0, 0 ) ( 0, 0 ) ( 0, 0 )))


type Size
    = Small
    | Medium
    | Large


create : Size -> List Int -> List Label -> (Puzzle -> msg) -> Cmd msg
create size hexIds labels msg =
    let
        grid =
            HexGrid.create
                1
                Graphics.middle
                (range size)

        puzzle =
            []
    in
    Random.generate
        (\list -> msg (Puzzle list grid))
        (Random.List.shuffle puzzle)


generateValues : Size -> (Size -> List Label -> msg) -> Cmd msg
generateValues size msg =
    Random.generate (msg size)
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


range : Size -> HexGrid.Range
range size =
    case size of
        Small ->
            HexGrid.Range ( -1, 1 ) ( -1, 1 ) ( -1, 1 )

        Medium ->
            HexGrid.Range ( -2, 2 ) ( -1, 2 ) ( -2, 1 )

        Large ->
            HexGrid.Range ( -2, 2 ) ( -2, 2 ) ( -2, 2 )
