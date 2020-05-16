module Puzzle exposing (Puzzle, Size(..), create, generateValues)

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


type Size
    = Small
    | Medium
    | Large


create : Size -> List Hex.Id -> List Label -> (Puzzle -> msg) -> Cmd msg
create size hexIds labels msg =
    let
        grid =
            HexGrid.create (zoomFor size) Graphics.middle (range size)

        hexes =
            createHexes (zoomFor size) hexIds labels grid
    in
    Random.generate (Puzzle grid >> msg) (Random.List.shuffle hexes)


generateValues : Size -> (Size -> List Label -> msg) -> Cmd msg
generateValues size msg =
    Random.generate (msg size)
        (Random.list (valueCountFor size)
            (Random.uniform Zero
                [ One, Two, Three, Four, Five, Six, Seven, Eight, Nine ]
            )
        )


valueCountFor : Size -> Int
valueCountFor size =
    case size of
        Small ->
            30

        Medium ->
            --these aren't right
            42

        Large ->
            --these aren't right
            42


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
createHexes zoom hexIdList labelList grid =
    let
        cells =
            HexGrid.cells grid

        addHex :
            List Hex.Id
            -> List Label
            -> List HexGrid.Axial
            -> List ( HexGrid.Axial, Hex )
            -> List ( HexGrid.Axial, Hex )
        addHex hexIds labels axials hexes =
            case ( hexIds, axials ) of
                ( id :: ids, ax :: axs ) ->
                    let
                        mNeighbors =
                            HexList.hexMap
                                (Maybe.andThen (getHexIfExists hexes))
                                (HexGrid.neighbors ax grid)

                        knownWedges =
                            HexList.indexedHexMap
                                (\i h -> Maybe.map (getMatchingLabel i) h)
                                mNeighbors

                        ( wedges, labs ) =
                            HexList.absorb labels Label.Zero knownWedges

                        hex =
                            Hex.create id zoom wedges
                    in
                    addHex ids labs axs (( ax, hex ) :: hexes)

                ( _, _ ) ->
                    hexes
    in
    List.map Tuple.second (addHex hexIdList labelList cells [])


getMatchingLabel : Index -> Hex -> Label
getMatchingLabel index hex =
    let
        wedge =
            HexList.get (HexList.invert index) hex.wedges
    in
    wedge.label


getHexIfExists : List ( HexGrid.Axial, Hex ) -> HexGrid.Axial -> Maybe Hex
getHexIfExists knownCells cell =
    let
        partitioned =
            List.partition
                (Tuple.first >> (==) cell)
                knownCells
    in
    case partitioned of
        ( x :: _, _ ) ->
            Just (Tuple.second x)

        ( [], _ ) ->
            Nothing
