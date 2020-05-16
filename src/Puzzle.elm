module Puzzle exposing (Puzzle, Size(..), create, empty, generateValues, range)

import Graphics
import Hex exposing (Hex)
import HexGrid exposing (HexGrid)
import HexList exposing (HexList, Index(..))
import Label exposing (Label(..))
import Random
import Random.List


type alias Puzzle =
    { grid : HexGrid
    , hexes : List Hex
    }


empty : Puzzle
empty =
    Puzzle (HexGrid.create 0 ( 0, 0 ) (HexGrid.Range ( 0, 0 ) ( 0, 0 ) ( 0, 0 ))) []


type Size
    = Small
    | Medium
    | Large


create : Size -> List Hex.Id -> List Label -> (Puzzle -> msg) -> Cmd msg
create size hexIds labels msg =
    let
        grid =
            HexGrid.create
                (zoomFor size)
                Graphics.middle
                (range size)

        hexes =
            createHexes (zoomFor size) hexIds labels grid

        _ =
            Debug.log "hexes" hexes
    in
    Random.generate (Puzzle grid >> msg) (Random.List.shuffle hexes)


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


zoomFor : Size -> Float
zoomFor size =
    case size of
        Small ->
            1

        Medium ->
            0.8

        Large ->
            0.7


createHexes :
    Float
    -> List Hex.Id
    -> List Label
    -> HexGrid
    -> List Hex
createHexes zoom hexIds labels grid =
    let
        cells =
            HexGrid.cells grid

        getHex : List ( HexGrid.Axial, Hex ) -> HexGrid.Axial -> Maybe Hex
        getHex curCells cell =
            case List.partition (Tuple.first >> (==) cell) curCells of
                ( x :: _, _ ) ->
                    Just (Tuple.second x)

                ( [], _ ) ->
                    Nothing

        getOppositeLabel : Index -> Hex -> Label
        getOppositeLabel index hex =
            let
                wedge =
                    HexList.get (HexList.invert index) hex.wedges
            in
            wedge.label

        --setWedge i
        helper :
            List Hex.Id
            -> List Label
            -> List HexGrid.Axial
            -> List ( HexGrid.Axial, Hex )
            -> List ( HexGrid.Axial, Hex )
        helper ids labs axs hexes =
            case ( ids, axs ) of
                ( id :: restIds, ax :: restAxs ) ->
                    let
                        possibleNeighbors =
                            HexGrid.neighbors ax grid

                        neighbors =
                            HexList.hexMap
                                (Maybe.andThen (getHex hexes))
                                possibleNeighbors

                        knownWedges =
                            HexList.indexedHexMap
                                (\i h -> Maybe.map (getOppositeLabel i) h)
                                neighbors

                        ( wedges, restLabs ) =
                            HexList.absorb labs Label.Zero knownWedges

                        hex =
                            Hex.create id zoom wedges
                    in
                    helper restIds restLabs restAxs (( ax, hex ) :: hexes)

                ( _, _ ) ->
                    hexes
    in
    List.map Tuple.second (helper hexIds labels cells [])
