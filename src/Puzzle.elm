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


module Puzzle exposing (Drag(..), InternalMsg(..), Model, Msg, Size(..), Translator, init, preview, resume, translator, update, view)

import Dict exposing (Dict)
import Graphics exposing (Point)
import Hex exposing (Hex)
import HexGrid exposing (HexGrid)
import HexList exposing (HexList)
import HexPlacements exposing (HexPlacements)
import HexPositions exposing (HexPositions)
import Html exposing (Html)
import Html.Events as E
import Html.Events.Extra.Mouse as ME
import Html.Events.Extra.Pointer as PE
import Html.Events.Extra.Touch as TE
import Html.Lazy as L
import Json.Decode as JD
import Label exposing (Label(..))
import Process
import Random
import Random.List
import StrUtil
import Svg as S
import Svg.Attributes as SA
import Svg.Keyed as SK
import Task
import Time
import Timer exposing (Timer)



-- MODEL / INIT


type alias Model =
    { size : Size
    , grid : HexGrid
    , hexes : List Hex
    , positions : HexPositions
    , placements : HexPlacements
    , drag : Drag
    , dropTarget : DropTarget
    , verified : Solution
    , paused : Bool
    , groupDragButton : ME.Button
    , timer : Timer
    , complete : Bool
    }


init : Model
init =
    new Small


new : Size -> Model
new size =
    let
        grid =
            gridFor size
    in
    { size = size
    , grid = grid
    , hexes = []
    , positions = HexPositions.init
    , placements = HexPlacements.empty
    , drag = NotDragging
    , dropTarget = NotDraggedYet HexPlacements.empty
    , verified = Incomplete
    , paused = False
    , groupDragButton = ME.SecondButton
    , timer = Timer.init
    , complete = False
    }



-- MESSAGES


type Msg
    = ForSelf InternalMsg
    | ForParent OutMsg


type OutMsg
    = PuzzleReady Model
    | StartDraggingHex Hex ME.Button Point
    | PausePuzzle
    | PuzzleSolved Size Int


type alias TranslationDictionary parentMsg =
    { onInternalMsg : InternalMsg -> parentMsg
    , onPuzzleReady : Model -> parentMsg
    , onStartDraggingHex : Hex -> ME.Button -> Point -> parentMsg
    , onPausePuzzle : parentMsg
    , onPuzzleSolved : Size -> Int -> parentMsg
    }


type alias Translator parentMsg =
    Msg -> parentMsg


translator : TranslationDictionary parentMsg -> Translator parentMsg
translator { onInternalMsg, onPuzzleReady, onStartDraggingHex, onPausePuzzle, onPuzzleSolved } msg =
    case msg of
        ForSelf internal ->
            onInternalMsg internal

        ForParent (PuzzleReady model) ->
            onPuzzleReady model

        ForParent (StartDraggingHex hex button pagePos) ->
            onStartDraggingHex hex button pagePos

        ForParent PausePuzzle ->
            onPausePuzzle

        ForParent (PuzzleSolved size time) ->
            onPuzzleSolved size time


type InternalMsg
    = StartGame Size
    | LabelsGeneratedAndIdsShuffled ( List Label, List Hex.Id )
    | Ready Model
    | StartTimer
    | Tick Time.Posix
    | StartDragging Hex ME.Button Point
    | MovePointer Point
    | HoverGridSpace HexGrid.Axial
    | HoverOffGrid
    | StopDraggingHex
    | VerifyPuzzle
    | EndGame
    | PreventContextMenu
    | PauseGame
    | OrganizeHexes



-- UPDATE


update : InternalMsg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        StartGame size ->
            ( new size
            , generateLabelsAndShuffleIds size
            )

        LabelsGeneratedAndIdsShuffled ( labels, hexIds ) ->
            ( model
            , createAndShuffleHexesAndPositions labels hexIds model
            )

        Ready newModel ->
            ( newModel
            , Cmd.batch
                [ startTimerAfter (timerDelayFor newModel.size)
                , startGame newModel
                ]
            )

        StartTimer ->
            ( { model | timer = Timer.start model.timer }
            , Cmd.none
            )

        Tick newTime ->
            ( { model | timer = Timer.update newTime model.timer }
            , Cmd.none
            )

        StartDragging hex button mousePos ->
            ( startDraggingHexes hex button mousePos model
            , Cmd.none
            )

        MovePointer mousePos ->
            case model.drag of
                NotDragging ->
                    ( model, Cmd.none )

                Drag hexes ->
                    let
                        dropTarget =
                            case model.dropTarget of
                                NotDraggedYet placements ->
                                    NoHoverInfo mousePos

                                NoHoverInfo _ ->
                                    NoHoverInfo mousePos

                                other ->
                                    other
                    in
                    ( updateDraggedHexes mousePos hexes { model | dropTarget = dropTarget }
                    , Cmd.none
                    )

        HoverGridSpace axial ->
            case model.drag of
                NotDragging ->
                    ( { model | dropTarget = NotDraggedYet HexPlacements.empty }
                    , Cmd.none
                    )

                Drag _ ->
                    ( { model | dropTarget = GridCell axial }
                    , Cmd.none
                    )

        HoverOffGrid ->
            ( { model | dropTarget = OffGrid }
            , Cmd.none
            )

        StopDraggingHex ->
            case model.drag of
                NotDragging ->
                    ( model, Cmd.none )

                Drag draggedHexes ->
                    let
                        newModel =
                            handleDrop draggedHexes model.dropTarget model
                    in
                    update
                        VerifyPuzzle
                        { newModel
                            | hexes = List.map .hex draggedHexes ++ newModel.hexes
                            , drag = NotDragging
                        }

        VerifyPuzzle ->
            let
                newModel =
                    { model | verified = verify model.hexes model.placements model.grid }
            in
            case newModel.verified of
                Solved ->
                    update EndGame newModel

                _ ->
                    ( newModel, Cmd.none )

        EndGame ->
            ( { model
                | complete = True
                , timer = Timer.stop model.timer
              }
            , endGame model.size model.timer.time
            )

        PauseGame ->
            let
                paused =
                    if model.complete then
                        False

                    else
                        True
            in
            ( { model | paused = paused }
            , Cmd.none
            )

        PreventContextMenu ->
            ( model, Cmd.none )

        OrganizeHexes ->
            ( organizeUnplaced model
            , Cmd.none
            )



-- DRAGGING


type alias DraggedHex =
    { hex : Hex
    , position : Point
    , offset : Point
    }


type Drag
    = Drag (List DraggedHex)
    | NotDragging


type DropTarget
    = NotDraggedYet HexPlacements
    | NoHoverInfo Point
    | GridCell HexGrid.Axial
    | OffGrid



-- START DRAGGING


getContiguousHexes : List Hex -> HexPositions -> HexGrid -> Hex -> List Hex
getContiguousHexes hexes positions grid hex =
    let
        neighborPoints h =
            HexList.toList (HexGrid.neighborPoints (HexPositions.get h positions) grid)

        addHex : List Point -> List Hex -> List Hex
        addHex pointsToCheck contigHexes =
            case pointsToCheck of
                [] ->
                    contigHexes

                pt :: pts ->
                    let
                        hexesHere =
                            List.filter (notIn contigHexes)
                                (HexGrid.hexesAt pt hexes positions grid)

                        newToCheck =
                            pts ++ List.concatMap neighborPoints hexesHere

                        newContig =
                            contigHexes ++ hexesHere
                    in
                    addHex newToCheck newContig
    in
    addHex (neighborPoints hex) [ hex ]


startDraggingHexes : Hex -> ME.Button -> Point -> Model -> Model
startDraggingHexes hex button mousePos model =
    let
        hexes =
            if button == model.groupDragButton then
                getContiguousHexes model.hexes model.positions model.grid hex

            else
                [ hex ]

        draggedHexes =
            List.map
                (startDraggingHex (zoomFor model.size) model.positions mousePos)
                hexes
    in
    { model
        | drag = Drag draggedHexes
        , hexes = List.filter (notIn hexes) model.hexes
        , dropTarget = NotDraggedYet (HexPlacements.extract hexes model.placements)
        , verified = Incomplete
    }


startDraggingHex : Float -> HexPositions -> Point -> Hex -> DraggedHex
startDraggingHex zoom positions mouse hex =
    let
        start =
            HexPositions.get hex positions

        offset =
            Graphics.difference (scale zoom mouse) start
    in
    DraggedHex hex start offset


notIn : List a -> a -> Bool
notIn list item =
    not (List.member item list)



-- UPDATING DRAGGING


updateDraggedHexes : Point -> List DraggedHex -> Model -> Model
updateDraggedHexes mousePos hexes model =
    let
        movedHexes =
            List.map (updateDraggedHex (zoomFor model.size) mousePos) hexes

        newPositions =
            List.map (\{ hex, position } -> ( Hex.id hex, position )) movedHexes
    in
    { model
        | drag = Drag movedHexes
        , positions = HexPositions.moveAll newPositions model.positions
    }


updateDraggedHex : Float -> Point -> DraggedHex -> DraggedHex
updateDraggedHex zoom mousePos ({ hex, offset } as drag) =
    let
        newPosition =
            Graphics.difference (scale zoom mousePos) offset
    in
    { drag | position = newPosition }


scale : Float -> Point -> Point
scale zoom ( x, y ) =
    ( x / zoom, y / zoom )



-- DROPPING


handleDrop : List DraggedHex -> DropTarget -> Model -> Model
handleDrop draggedHexes dropTarget model =
    case dropTarget of
        NotDraggedYet returnTargets ->
            { model | placements = Dict.union returnTargets model.placements }

        NoHoverInfo point ->
            case HexGrid.cellAt point model.grid of
                Just ax ->
                    handleDrop draggedHexes (GridCell ax) model

                Nothing ->
                    handleDrop draggedHexes OffGrid model

        OffGrid ->
            let
                placements =
                    HexPlacements.removeAll
                        (List.map .hex draggedHexes)
                        model.placements
            in
            { model | placements = placements }

        GridCell axial ->
            let
                placements =
                    placeHexes (zoomFor model.size) axial model.grid model.placements draggedHexes

                positions =
                    placementsToPositions (zoomFor model.size) placements model.grid model.positions
            in
            { model
                | placements = placements
                , positions = positions
            }


placeHexes : Float -> HexGrid.Axial -> HexGrid -> HexPlacements -> List DraggedHex -> HexPlacements
placeHexes zoom axial grid placements draggedHexes =
    let
        dropPoint offset =
            scale (1 / zoom)
                (Graphics.difference (HexGrid.absolutePoint zoom axial grid) offset)

        place { hex, offset } =
            ( Hex.id hex, HexGrid.cellAt (dropPoint offset) grid )

        newPlaces =
            List.map place draggedHexes

        remainingPlaces =
            HexPlacements.removeAll (List.map .hex draggedHexes) placements

        placingOnlyOne mAx =
            List.length (List.filter (Tuple.second >> (==) mAx) newPlaces) == 1

        canPlace ( _, mAx ) =
            case mAx of
                Nothing ->
                    False

                Just ax ->
                    HexPlacements.available ax remainingPlaces
                        && HexGrid.inBounds ax grid
                        && placingOnlyOne mAx

        reify ( hId, mAx ) =
            case mAx of
                Nothing ->
                    Nothing

                Just ax ->
                    Just ( hId, ax )
    in
    if List.all canPlace newPlaces then
        Dict.union (Dict.fromList (List.filterMap reify newPlaces)) remainingPlaces

    else
        placements


placementsToPositions : Float -> HexPlacements -> HexGrid -> HexPositions -> HexPositions
placementsToPositions zoom placements grid positions =
    let
        placeToPos place =
            HexGrid.absolutePoint zoom place grid

        positionList =
            List.map (Tuple.mapSecond placeToPos) (Dict.toList placements)
    in
    HexPositions.moveAll positionList positions



-- COMMANDS


{-| Begin preparing the puzzle by generating enough random label values to
creeate all the hexes. Also, shuffle the hex Ids so they don't give away the
correct placement. When complete, send an Internal Msg to go to the next step.
-}
generateLabelsAndShuffleIds : Size -> Cmd Msg
generateLabelsAndShuffleIds size =
    let
        headLabel =
            Zero

        tailLabels =
            [ One, Two, Three, Four, Five, Six, Seven, Eight, Nine ]

        hexIds =
            List.range 1 (List.length (HexGrid.cells (gridFor size)))
    in
    Random.generate (LabelsGeneratedAndIdsShuffled >> ForSelf)
        (Random.map2 Tuple.pair
            (Random.list (valueCountFor size) (Random.uniform headLabel tailLabels))
            (Random.List.shuffle hexIds)
        )


{-| With the shuffled lists of labels and ids, create a list of all the hexes
needed for the puzzle and shuffle it.
-}
createAndShuffleHexesAndPositions : List Label -> List Hex.Id -> Model -> Cmd Msg
createAndShuffleHexesAndPositions labels hexIds model =
    let
        -- if I ever want to implement a solver or hint system,
        -- the first element of this tuple is the correct placement
        unshuffledHexes =
            List.map Tuple.second (createHexes labels hexIds model)
    in
    Random.generate (assignPositionsAndStart model)
        (Random.List.shuffle unshuffledHexes)


{-| When the list of hexes is shuffled, update the position animator to make
them start in the center of the screen and glide to their starting positions.
Return a Msg telling the parent that the puzzle is ready to play. This Msg is
sent by Random.generate in createAndShuffleHexesAndPositions.
-}
assignPositionsAndStart : Model -> List Hex -> Msg
assignPositionsAndStart ({ size } as model) hexes =
    let
        start =
            List.repeat
                (List.length hexes)
                (scale (zoomFor size) Graphics.middle)

        points =
            startingPositionsFor size

        positions =
            HexPositions.glideAll hexes start points 750 (glideDurationFor size) model.positions

        newModel =
            { model
                | hexes = hexes
                , positions = positions
            }
    in
    ForSelf (Ready newModel)


organizeUnplaced : Model -> Model
organizeUnplaced model =
    let
        unplaced =
            List.filter
                (Hex.id >> notIn (Dict.keys model.placements))
                model.hexes

        starts =
            List.map (\h -> HexPositions.get h model.positions) unplaced

        ends =
            startingPositionsFor model.size

        positions =
            HexPositions.glideAll
                unplaced
                starts
                ends
                0
                (100 * toFloat (List.length unplaced))
                model.positions
    in
    { model | positions = positions }


startTimerAfter : Float -> Cmd Msg
startTimerAfter delay =
    Task.perform (always (ForSelf StartTimer)) (Process.sleep delay)



{- I know it's not kosher to use Task.perform like this, but it was the only
   way I could figure out to:

       1. Send a message and start the timer from within Puzzle at the same
       time (i.e. without having Main start the timer on behalf of puzzle
       after getting the ready message).

       2. Send a message after doing a calculation (i.e. verifying the
       solution).
-}


startGame : Model -> Cmd Msg
startGame model =
    Task.perform (always (ForParent (PuzzleReady model))) (Task.succeed ())


endGame : Size -> Int -> Cmd Msg
endGame size time =
    Task.perform (always (ForParent (PuzzleSolved size time))) (Task.succeed ())



-- HEX INITIALIZATION


createHexes : List Label -> List Hex.Id -> Model -> List ( HexGrid.Axial, Hex )
createHexes labelList hexIds { grid, size } =
    addHexToGrid grid hexIds labelList (HexGrid.cells grid) []


{-| Create a complete, valid puzzle from a shuffled list of ids, a shuffled
list of label values, a list of hexagonal grid coordinates, and the grid they
belong to.
-}
addHexToGrid :
    HexGrid
    -> List Hex.Id
    -> List Label
    -> List HexGrid.Axial
    -> List ( HexGrid.Axial, Hex )
    -> List ( HexGrid.Axial, Hex )
addHexToGrid grid hexIds labels axials hexes =
    case ( hexIds, axials ) of
        ( id :: ids, ax :: axs ) ->
            let
                mNeighbors =
                    HexList.map
                        (Maybe.andThen (getHexIfExists hexes))
                        (HexGrid.gridNeighbors ax grid)

                knownWedges =
                    HexList.indexedMap
                        (\i h -> Maybe.map (Hex.matchingLabel i) h)
                        mNeighbors

                ( wedges, labs ) =
                    HexList.absorb labels Label.Zero knownWedges

                hex =
                    Hex.create id wedges
            in
            addHexToGrid grid ids labs axs (( ax, hex ) :: hexes)

        ( _, _ ) ->
            hexes


{-| Find a Hex at the given Axial coordinates, if it exists, in a list of
Axial coordinates paired with Hexes.

    getHexIfExists [ ( ( 0, 0 ), Hex _ _ _ ) ] ( 0, 0 ) == Just (Hex _ _ _)
    getHexIfExists [ ( ( 0, 0 ), Hex _ _ _ ) ] ( 0, 1 ) == Nothing

-}
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



-- SOLUTION


type Solution
    = Solved
    | Incorrect
    | Incomplete


verify : List Hex -> HexPlacements -> HexGrid -> Solution
verify hexes placements grid =
    let
        allPlaced =
            List.length hexes == Dict.size placements

        hexDict =
            Dict.fromList (List.map (\h -> ( Hex.id h, h )) hexes)

        allMatched =
            List.all (matched hexDict placements grid) hexes
    in
    if allPlaced then
        if allMatched then
            Solved

        else
            Incorrect

    else
        Incomplete


matched : Dict Hex.Id Hex -> HexPlacements -> HexGrid -> Hex -> Bool
matched hexes placements grid hex =
    case Dict.get (Hex.id hex) placements of
        Nothing ->
            False

        Just axial ->
            let
                neighborCoords =
                    HexGrid.gridNeighbors axial grid

                neighbors =
                    HexList.map
                        (Maybe.andThen (getNeighbor (Dict.toList placements) hexes))
                        neighborCoords

                labels =
                    Hex.labels hex
            in
            HexList.all identity (HexList.indexedMap (match neighbors) labels)


getNeighbor : List ( Hex.Id, HexGrid.Axial ) -> Dict Hex.Id Hex -> HexGrid.Axial -> Maybe Hex
getNeighbor placementList hexes ax =
    case List.partition (Tuple.second >> (==) ax) placementList of
        ( [], _ ) ->
            Nothing

        ( ( id, _ ) :: [], _ ) ->
            Dict.get id hexes

        -- there shouldn't be two hexes in the same spot
        ( _ :: _, _ ) ->
            Nothing


match : HexList (Maybe Hex) -> HexList.Index -> Label -> Bool
match neighbors index label =
    case HexList.get index neighbors of
        Nothing ->
            True

        Just hex ->
            label == Hex.labelAt index hex



-- SIZES


type Size
    = Small
    | Medium
    | Large
    | Huge
    | Double
    | Triple


gridFor : Size -> HexGrid
gridFor size =
    case size of
        Double ->
            HexGrid.custom (zoomFor Double) Graphics.middle (cellsFor Double)

        Triple ->
            HexGrid.custom (zoomFor Triple) Graphics.middle (cellsFor Triple)

        _ ->
            HexGrid.create (zoomFor size) Graphics.middle (rangeFor size)


{-| The number of values needed to fill out a puzzle of the given size. To
empirically determine the count for a new size, change headLabel in
generateLabelsAndShuffleIds to something other than Zero, then increase the
count until there are no more zeroes on the board.
-}
valueCountFor : Size -> Int
valueCountFor size =
    case size of
        Small ->
            30

        Medium ->
            55

        Large ->
            72

        Huge ->
            132

        Double ->
            72

        Triple ->
            78


cellsFor : Size -> List HexGrid.Axial
cellsFor size =
    case size of
        Double ->
            [ ( 3, -2 ), ( 3, -1 ), ( 2, 0 ), ( 0, 2 ), ( 2, -2 ), ( 1, -1 ), ( 1, 0 ), ( -1, 0 ), ( -1, 1 ), ( -2, 2 ), ( 0, -2 ), ( -2, 0 ), ( -3, 1 ), ( -3, 2 ) ]

        Triple ->
            [ ( 2, -3 ), ( 2, -2 ), ( 2, -1 ), ( 2, 0 ), ( 2, 1 ), ( 1, 1 ), ( 1, 0 ), ( 1, -2 ), ( 0, 1 ), ( -1, 1 ), ( -1, 0 ), ( -2, 1 ), ( 2, -4 ), ( 1, -3 ), ( 0, -2 ), ( -1, -1 ), ( -2, 0 ), ( -3, 1 ) ]

        _ ->
            []


rangeFor : Size -> HexGrid.Range
rangeFor size =
    case size of
        Small ->
            HexGrid.Range ( -1, 1 ) ( -1, 1 ) ( -1, 1 )

        Medium ->
            HexGrid.Range ( -2, 2 ) ( -1, 2 ) ( -2, 1 )

        Large ->
            HexGrid.Range ( -2, 2 ) ( -2, 2 ) ( -2, 2 )

        Huge ->
            HexGrid.Range ( -3, 3 ) ( -3, 3 ) ( -3, 3 )

        _ ->
            HexGrid.Range ( 0, 0 ) ( 0, 0 ) ( 0, 0 )


zoomFor : Size -> Float
zoomFor size =
    case size of
        Small ->
            1

        Medium ->
            0.8

        Large ->
            0.7

        Huge ->
            0.5

        Double ->
            0.7

        Triple ->
            0.6


glideDurationFor : Size -> Float
glideDurationFor size =
    case size of
        Small ->
            1250

        Medium ->
            2000

        Large ->
            2750

        Huge ->
            4500

        Double ->
            2000

        Triple ->
            2500


timerDelayFor : Size -> Float
timerDelayFor =
    glideDurationFor >> (+) 750


startingPositionsFor : Size -> List Point
startingPositionsFor size =
    let
        ( grid, axs ) =
            case size of
                Small ->
                    ( HexGrid.create 1.1 Graphics.middle (HexGrid.Range ( -3, 3 ) ( -3, 3 ) ( -3, 3 ))
                    , [ ( -3, 1 ), ( -2, 0 ), ( 2, -2 ), ( 3, -2 ), ( -3, 2 ), ( -2, 1 ), ( 2, -1 ) ]
                    )

                Medium ->
                    ( HexGrid.create 0.85 Graphics.middle (HexGrid.Range ( -4, 4 ) ( -3, 4 ) ( -4, 3 ))
                    , [ ( -2, -1 ), ( 2, -3 ), ( -4, 1 ), ( -3, 0 ), ( 3, -3 ), ( 4, -3 ), ( -4, 2 ), ( -3, 1 ), ( 3, -2 ), ( 4, -2 ), ( -3, 2 ), ( 3, -1 ), ( -2, 2 ), ( 2, 0 ) ]
                    )

                Large ->
                    ( HexGrid.create 0.75 Graphics.middle (HexGrid.Range ( -4, 4 ) ( -4, 4 ) ( -4, 4 ))
                    , [ ( -2, -1 ), ( 2, -3 ), ( 4, -4 ), ( -4, 1 ), ( -3, 0 ), ( 3, -3 ), ( 4, -3 ), ( -4, 2 ), ( -3, 1 ), ( 3, -2 ), ( 4, -2 ), ( -4, 3 ), ( -3, 2 ), ( 3, -1 ), ( 4, -1 ), ( -3, 3 ), ( 3, 0 ), ( -2, 3 ), ( 2, 1 ) ]
                    )

                Huge ->
                    ( HexGrid.create 0.55 Graphics.middle (HexGrid.Range ( -4, 4 ) ( -4, 4 ) ( -4, 4 ))
                    , [ ( -4, -1 ), ( 4, -5 ), ( 6, -6 ), ( -6, 1 ), ( -5, 0 ), ( -4, 0 ), ( -3, -1 ), ( 3, -4 ), ( 4, -4 ), ( 5, -5 ), ( 6, -5 ), ( -6, 2 ), ( -5, 1 ), ( -4, 1 ), ( 4, -3 ), ( 5, -4 ), ( 6, -4 ), ( -6, 3 ), ( -5, 2 ), ( -4, 2 ), ( 4, -2 ), ( 5, -3 ), ( 6, -3 ), ( -6, 4 ), ( -5, 3 ), ( -4, 3 ), ( 4, -1 ), ( 5, -2 ), ( 6, -2 ), ( -6, 5 ), ( -5, 4 ), ( -4, 4 ), ( -3, 4 ), ( 4, 0 ), ( 5, -1 ), ( 6, -1 ), ( 3, 1 ) ]
                    )

                Double ->
                    ( HexGrid.create 0.75 Graphics.middle (HexGrid.Range ( -4, 4 ) ( -4, 4 ) ( -4, 4 ))
                    , [ ( 2, -3 ), ( 3, -3 ), ( 4, -3 ), ( 4, -2 ), ( 4, -1 ), ( 3, 0 ), ( 2, 1 ), ( -2, 3 ), ( -3, 3 ), ( -4, 3 ), ( -4, 2 ), ( -4, 1 ), ( -3, 0 ), ( -2, -1 ) ]
                    )

                Triple ->
                    ( HexGrid.create 0.65 Graphics.middle (HexGrid.Range ( -4, 4 ) ( -4, 4 ) ( -4, 4 ))
                    , [ ( 4, -4 ), ( 5, -4 ), ( 4, -3 ), ( 5, -3 ), ( 4, -2 ), ( 5, -2 ), ( 5, -1 ), ( 4, -1 ), ( 4, 0 ), ( -2, 3 ), ( -3, 3 ), ( -4, 3 ), ( -5, 3 ), ( -4, 2 ), ( -5, 2 ), ( -4, 1 ), ( -3, 0 ), ( -2, -1 ) ]
                    )
    in
    List.map (\a -> HexGrid.absolutePoint (zoomFor size) a grid) axs



-- VIEW


view : Model -> Html Msg
view model =
    let
        mapViewHex =
            viewHex model.positions (List.length model.hexes)

        status =
            case model.verified of
                Solved ->
                    "winner"

                Incorrect ->
                    "incorrect"

                Incomplete ->
                    ""

        dragging =
            case model.drag of
                NotDragging ->
                    ""

                Drag _ ->
                    "dragging"
    in
    S.g
        [ SA.class "puzzle"
        , SA.class status
        , SA.class dragging
        ]
        [ viewOffGridTarget model.drag
        , L.lazy2 HexGrid.view gridMouseEvents model.grid
        , SK.node "g"
            [ SA.class "puzzle-pieces"
            , SA.transform (StrUtil.scale (zoomFor model.size))
            ]
            (List.indexedMap mapViewHex (List.reverse model.hexes)
                ++ viewDraggedHexes model.drag
            )
        , viewTimer model.timer
        , viewPauseButton
        , viewOrganize model.complete
        , viewNewGame model.size model.complete

        --, HexGrid.view gridMouseEvents (HexGrid.create 0.55 Graphics.middle (HexGrid.Range ( -6, 6 ) ( -7, 7 ) ( -7, 7 )))
        ]


gridMouseEvents : HexGrid.Axial -> List (S.Attribute Msg)
gridMouseEvents ax =
    [ ME.onMove (always (ForSelf (HoverGridSpace ax)))
    , E.custom "contextmenu" contextMenuEvent
    ]


viewHex : HexPositions -> Int -> Int -> Hex -> ( String, Html Msg )
viewHex positions count index hex =
    let
        ( x, y ) =
            HexPositions.getLagged hex (count - index) count positions
    in
    ( String.fromInt (Hex.id hex)
    , S.g
        [ SA.class "hex-container"
        , SA.transform (StrUtil.translate x y)
        , ME.onDown (getClickInfo (StartDraggingHex hex) >> ForParent)
        , TE.onStart (getTouchInfo (StartDraggingHex hex) >> ForParent)
        ]
        [ L.lazy Hex.view hex ]
    )


getClickInfo : (ME.Button -> Point -> OutMsg) -> ME.Event -> OutMsg
getClickInfo msg event =
    msg event.button event.pagePos


getTouchInfo : (ME.Button -> Point -> OutMsg) -> TE.Event -> OutMsg
getTouchInfo msg event =
    msg ME.MainButton
        (Maybe.withDefault Graphics.middle
            (Maybe.map .pagePos
                (List.head event.changedTouches)
            )
        )


viewDraggedHexes : Drag -> List ( String, Html Msg )
viewDraggedHexes drag =
    case drag of
        NotDragging ->
            [ ( "none", S.text "" ) ]

        Drag hexes ->
            List.map viewDraggedHex (List.reverse hexes)


viewDraggedHex : DraggedHex -> ( String, Html Msg )
viewDraggedHex { hex, position } =
    let
        ( x, y ) =
            position
    in
    ( String.fromInt (Hex.id hex)
    , S.g
        [ SA.transform (StrUtil.translate x y)
        , SA.class "hex-container dragging"
        ]
        [ L.lazy Hex.view hex ]
    )


viewOffGridTarget : Drag -> Html Msg
viewOffGridTarget drag =
    case drag of
        NotDragging ->
            S.text ""

        Drag _ ->
            let
                { w, h } =
                    Graphics.screen
            in
            S.rect
                [ SA.class "off-grid-target"
                , E.custom "contextmenu" contextMenuEvent
                , ME.onMove (always (ForSelf HoverOffGrid))
                , SA.x (String.fromFloat -w)
                , SA.y (String.fromFloat -h)
                , SA.width (String.fromFloat (3 * w))
                , SA.height (String.fromFloat (3 * h))
                ]
                []


contextMenuEvent : JD.Decoder { message : Msg, preventDefault : Bool, stopPropagation : Bool }
contextMenuEvent =
    JD.succeed { message = ForSelf PreventContextMenu, stopPropagation = True, preventDefault = True }


viewTimer : Timer -> Html Msg
viewTimer timer =
    let
        seconds =
            timer.time // 1000

        ones =
            modBy 10 seconds

        tens =
            modBy 10 (seconds // 10)

        hundreds =
            modBy 10 (seconds // 100)

        thousands =
            seconds // 1000

        xs =
            [ 6.85, 0.15, -6.6 ]

        values =
            [ ones, tens, hundreds ]

        thresholds =
            [ 0, 10, 100 ]

        makeText align x value threshold =
            if seconds >= threshold then
                S.text_
                    [ SA.class "timer"
                    , SA.class align
                    , SA.x (String.fromFloat x)
                    , SA.y "0"
                    ]
                    [ S.text (String.fromInt value) ]

            else
                S.text ""
    in
    S.g
        [ SA.transform (StrUtil.translate 24.5 7) ]
        (makeText "right" -10 thousands 1000
            :: List.map3 (makeText "center") xs values thresholds
        )


viewPauseButton : Html Msg
viewPauseButton =
    S.text_
        [ SA.class "back center"
        , SA.x "17"
        , SA.y "130"
        , PE.onDown (always (ForParent PausePuzzle))
        ]
        [ S.text "BACK" ]


viewOrganize : Bool -> Html Msg
viewOrganize complete =
    let
        hidden =
            if complete then
                "hidden"

            else
                ""
    in
    S.text_
        [ SA.class "organize"
        , SA.class hidden
        , SA.x "208"
        , SA.y "130"
        , PE.onDown (always (ForSelf OrganizeHexes))
        ]
        [ S.text "ORGANIZE" ]


viewNewGame : Size -> Bool -> Html Msg
viewNewGame size complete =
    let
        hidden =
            if complete then
                ""

            else
                "hidden"
    in
    S.text_
        [ SA.class "new-game"
        , SA.class hidden
        , SA.x "205"
        , SA.y "130"
        , PE.onDown (always (ForSelf (StartGame size)))
        ]
        [ S.text "NEW GAME" ]


preview : Size -> Html msg
preview size =
    case size of
        Small ->
            L.lazy2 HexGrid.view previewMsgAttrs previewGrids.small

        Medium ->
            L.lazy2 HexGrid.view previewMsgAttrs previewGrids.medium

        Large ->
            L.lazy2 HexGrid.view previewMsgAttrs previewGrids.large

        Huge ->
            L.lazy2 HexGrid.view previewMsgAttrs previewGrids.huge

        Double ->
            L.lazy2 HexGrid.view previewMsgAttrs previewGrids.double

        Triple ->
            L.lazy2 HexGrid.view previewMsgAttrs previewGrids.triple


previewMsgAttrs =
    always [ SA.class "static" ]


previewGrids =
    { small = HexGrid.create 0.19 ( 60, 43.5 ) (rangeFor Small)
    , medium = HexGrid.create 0.19 ( 40, 75 ) (rangeFor Medium)
    , large = HexGrid.create 0.19 ( 60, 109 ) (rangeFor Large)
    , huge = HexGrid.create 0.19 ( 180, 109 ) (rangeFor Huge)
    , double = HexGrid.custom 0.19 ( 180, 43.5 ) (cellsFor Double)
    , triple = HexGrid.custom 0.19 ( 200, 75 ) (cellsFor Triple)
    }


resume : Size -> Html msg
resume size =
    case size of
        Small ->
            L.lazy2 HexGrid.view previewMsgAttrs resumeGrids.small

        Medium ->
            L.lazy2 HexGrid.view previewMsgAttrs resumeGrids.medium

        Large ->
            L.lazy2 HexGrid.view previewMsgAttrs resumeGrids.large

        Huge ->
            L.lazy2 HexGrid.view previewMsgAttrs resumeGrids.huge

        Double ->
            L.lazy2 HexGrid.view previewMsgAttrs resumeGrids.double

        Triple ->
            L.lazy2 HexGrid.view previewMsgAttrs resumeGrids.triple


resumeGrids =
    { small = HexGrid.create 0.19 ( Tuple.first Graphics.middle, 76 ) (rangeFor Small)
    , medium = HexGrid.create 0.19 ( Tuple.first Graphics.middle, 76 ) (rangeFor Medium)
    , large = HexGrid.create 0.19 ( Tuple.first Graphics.middle, 76 ) (rangeFor Large)
    , huge = HexGrid.create 0.19 ( Tuple.first Graphics.middle, 76 ) (rangeFor Huge)
    , double = HexGrid.custom 0.19 ( Tuple.first Graphics.middle, 76 ) (cellsFor Double)
    , triple = HexGrid.custom 0.19 ( Tuple.first Graphics.middle, 76 ) (cellsFor Triple)
    }
