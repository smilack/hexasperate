module Puzzle exposing (Drag(..), InternalMsg(..), Model, Msg, Size(..), Translator, init, preview, translator, update, view)

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
import Json.Decode as JD
import Label exposing (Label(..))
import Random
import Random.List
import StrUtil
import Svg as S
import Svg.Attributes as SA
import Svg.Keyed as SK
import Task



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
    }



-- MESSAGES


type Msg
    = ForSelf InternalMsg
    | ForParent OutMsg


type OutMsg
    = PuzzleReady Model Float
    | StartDraggingHex Hex ME.Button Point
    | PuzzleSolved


type alias TranslationDictionary parentMsg =
    { onInternalMsg : InternalMsg -> parentMsg
    , onPuzzleReady : Model -> Float -> parentMsg
    , onStartDraggingHex : Hex -> ME.Button -> Point -> parentMsg
    , onPuzzleSolved : parentMsg
    }


type alias Translator parentMsg =
    Msg -> parentMsg


translator : TranslationDictionary parentMsg -> Translator parentMsg
translator { onInternalMsg, onPuzzleReady, onStartDraggingHex, onPuzzleSolved } msg =
    case msg of
        ForSelf internal ->
            onInternalMsg internal

        ForParent (PuzzleReady model delay) ->
            onPuzzleReady model delay

        ForParent (StartDraggingHex hex button pagePos) ->
            onStartDraggingHex hex button pagePos

        ForParent PuzzleSolved ->
            onPuzzleSolved


type InternalMsg
    = StartGame Size
    | LabelsGeneratedAndIdsShuffled ( List Label, List Hex.Id )
    | StartDragging Hex ME.Button Point
    | MovePointer Point
    | StopDraggingHex
    | HoverGridSpace HexGrid.Axial
    | HoverOffGrid
    | PauseGame
    | PreventContextMenu
    | VerifyPuzzle



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

        StartDragging hex button mousePos ->
            ( startDraggingHexes hex button mousePos model
            , Cmd.none
            )

        MovePointer mousePos ->
            case model.drag of
                NotDragging ->
                    ( model, Cmd.none )

                Drag hexes ->
                    ( updateDraggedHexes mousePos hexes model
                    , Cmd.none
                    )

        StopDraggingHex ->
            case model.drag of
                NotDragging ->
                    ( model, Cmd.none )

                Drag draggedHexes ->
                    let
                        newModel =
                            handleDrop draggedHexes model
                    in
                    update
                        VerifyPuzzle
                        { newModel
                            | hexes = List.map .hex draggedHexes ++ newModel.hexes
                            , drag = NotDragging
                        }

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

        PauseGame ->
            ( { model | paused = True }
            , Cmd.none
            )

        PreventContextMenu ->
            ( model, Cmd.none )

        VerifyPuzzle ->
            let
                verified =
                    verify model.hexes model.placements model.grid

                cmd =
                    case verified of
                        Solved ->
                            endGame

                        _ ->
                            Cmd.none
            in
            ( { model | verified = verified }
            , cmd
            )



-- DRAGGING


type alias DraggedHex =
    { hex : Hex
    , position : Point
    , offset : Point
    , axialOffset : HexGrid.Axial
    }


type Drag
    = Drag (List DraggedHex)
    | NotDragging


type DropTarget
    = NotDraggedYet HexPlacements
    | GridCell HexGrid.Axial
    | OffGrid



-- START DRAGGING


getContiguousHexes : List Hex -> HexPlacements -> HexGrid -> Hex -> List ( Hex, HexGrid.Axial )
getContiguousHexes hexes placements grid hex =
    let
        addNeighbor toCheck checked neighbors ax =
            let
                uncheckedNeighbors =
                    List.filter (notIn (toCheck ++ checked))
                        (HexList.compact (HexGrid.neighbors ax grid))

                ( this, alsoCheck ) =
                    case HexPlacements.at ax hexes placements of
                        Nothing ->
                            ( [], [] )

                        Just h ->
                            ( [ ( h, ax ) ], uncheckedNeighbors )

                newNeighbors =
                    neighbors ++ this
            in
            case toCheck ++ alsoCheck of
                next :: rest ->
                    addNeighbor rest (ax :: checked) newNeighbors next

                [] ->
                    newNeighbors
    in
    case Dict.get hex.id placements of
        Nothing ->
            [ ( hex, ( 0, 0 ) ) ]

        Just axial ->
            List.map (Tuple.mapSecond (HexGrid.offset axial))
                (addNeighbor [] [] [] axial)


startDraggingHexes : Hex -> ME.Button -> Point -> Model -> Model
startDraggingHexes hex button mousePos model =
    let
        hexesAndOffsets =
            if button == model.groupDragButton then
                getContiguousHexes model.hexes model.placements model.grid hex

            else
                [ ( hex, ( 0, 0 ) ) ]

        draggedHexes =
            List.map
                (startDraggingHex (zoomFor model.size) model.positions mousePos)
                hexesAndOffsets

        hexes =
            List.map Tuple.first hexesAndOffsets
    in
    { model
        | drag = Drag draggedHexes
        , hexes = List.filter (notIn hexes) model.hexes
        , dropTarget = NotDraggedYet (HexPlacements.extract hexes model.placements)
    }


startDraggingHex : Float -> HexPositions -> Point -> ( Hex, HexGrid.Axial ) -> DraggedHex
startDraggingHex zoom positions mouse ( hex, axialOffset ) =
    let
        start =
            HexPositions.get hex positions

        offset =
            Graphics.difference (scale zoom mouse) start
    in
    DraggedHex hex start offset axialOffset


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
            List.map (\{ hex, position } -> ( hex.id, position )) movedHexes
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


handleDrop : List DraggedHex -> Model -> Model
handleDrop draggedHexes model =
    case model.dropTarget of
        NotDraggedYet returnTargets ->
            { model | placements = Dict.union returnTargets model.placements }

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
                    placeHexes axial model.grid model.placements draggedHexes

                positions =
                    placementsToPositions (zoomFor model.size) placements model.grid model.positions
            in
            { model
                | placements = placements
                , positions = positions
            }


placeHexes : HexGrid.Axial -> HexGrid -> HexPlacements -> List DraggedHex -> HexPlacements
placeHexes axial grid placements draggedHexes =
    let
        remainingPlaces =
            HexPlacements.removeAll (List.map .hex draggedHexes) placements

        canPlace ( _, ax ) =
            HexPlacements.available ax placements
                && HexGrid.inBounds ax grid

        place { hex, axialOffset } =
            ( hex.id, HexGrid.sum axial axialOffset )

        newPlaces =
            List.map place draggedHexes
    in
    if List.all canPlace newPlaces then
        Dict.union (Dict.fromList newPlaces) remainingPlaces

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
        ( cx, cy ) =
            Graphics.middle

        start =
            List.repeat
                (List.length hexes)
                ( cx / zoomFor size, cy / zoomFor size )

        points =
            startingPositionsFor size

        positions =
            HexPositions.glideAll hexes start points (glideDurationFor size) model.positions

        newModel =
            { model
                | hexes = hexes
                , positions = positions
            }
    in
    ForParent (PuzzleReady newModel (750 + glideDurationFor size))


endGame : Cmd Msg
endGame =
    Task.perform (always (ForParent PuzzleSolved)) (Task.succeed ())



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
                        (HexGrid.neighbors ax grid)

                knownWedges =
                    HexList.indexedMap
                        (\i h -> Maybe.map (getMatchingLabel i) h)
                        mNeighbors

                ( wedges, labs ) =
                    HexList.absorb labels Label.Zero knownWedges

                hex =
                    Hex.create id wedges
            in
            addHexToGrid grid ids labs axs (( ax, hex ) :: hexes)

        ( _, _ ) ->
            hexes


{-| Get the label touching a hex that the given Hex is the neighbor of at
the given Index.

    getMachingLabel I
        (Hex _
            (HexList
                (Wedge One _)
                (Wedge Two _)
                (Wedge Three _)
                (Wedge Four _)
                (Wedge Five _)
                (Wedge Six _)
            )
        _
        )
        == Four

-}
getMatchingLabel : HexList.Index -> Hex -> Label
getMatchingLabel index hex =
    let
        wedge =
            HexList.get (HexList.invert index) hex.wedges
    in
    wedge.label


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
            Dict.fromList (List.map (\h -> ( h.id, h )) hexes)

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
    case Dict.get hex.id placements of
        Nothing ->
            False

        Just axial ->
            let
                neighborCoords =
                    HexGrid.neighbors axial grid

                neighbors =
                    HexList.map
                        (Maybe.andThen (getNeighbor (Dict.toList placements) hexes))
                        neighborCoords

                labels =
                    HexList.map .label hex.wedges
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
            let
                wedge =
                    HexList.get (HexList.invert index) hex.wedges
            in
            label == wedge.label



-- SIZES


type Size
    = Small
    | Medium
    | Large
    | Huge


gridFor : Size -> HexGrid
gridFor size =
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
            0.52


glideDurationFor : Size -> Float
glideDurationFor size =
    case size of
        Small ->
            750

        Medium ->
            1500

        Large ->
            2000

        Huge ->
            2500


startingPositionsFor : Size -> List Point
startingPositionsFor size =
    let
        ( grid, axs ) =
            case size of
                Small ->
                    ( HexGrid.create 1.1 Graphics.middle (HexGrid.Range ( -3, 3 ) ( -3, 3 ) ( -3, 3 ))
                    , [ ( -2, 0 ), ( -2, 1 ), ( -2, 2 ), ( 2, -2 ), ( 3, -2 ), ( 2, -1 ), ( 2, 0 ) ]
                    )

                Medium ->
                    ( HexGrid.create 0.85 Graphics.middle (HexGrid.Range ( -4, 4 ) ( -3, 4 ) ( -4, 3 ))
                    , [ ( -2, -1 ), ( -4, 0 ), ( -3, 0 ), ( -4, 1 ), ( -3, 1 ), ( -4, 2 ), ( -3, 2 ), ( 2, -3 ), ( 3, -3 ), ( 4, -4 ), ( 4, -3 ), ( 3, -2 ), ( 4, -2 ), ( 3, -1 ) ]
                    )

                Large ->
                    ( HexGrid.create 0.75 Graphics.middle (HexGrid.Range ( -4, 4 ) ( -4, 4 ) ( -4, 4 ))
                    , [ ( -4, 0 ), ( -3, 0 ), ( -4, 1 ), ( -3, 1 ), ( -4, 2 ), ( -3, 2 ), ( -4, 3 ), ( -3, 3 ), ( -2, 3 ), ( 4, -4 ), ( 3, -3 ), ( 4, -3 ), ( 3, -2 ), ( 4, -2 ), ( 3, -1 ), ( 4, -1 ), ( 3, 0 ), ( 4, 0 ), ( 2, 1 ) ]
                    )

                Huge ->
                    ( HexGrid.create 0.56 Graphics.middle (HexGrid.Range ( -4, 4 ) ( -4, 4 ) ( -4, 4 ))
                    , [ ( -3, -1 ), ( -4, -1 ), ( -4, 0 ), ( -5, 0 ), ( -6, 1 ), ( -4, 1 ), ( -5, 1 ), ( -6, 2 ), ( -4, 2 ), ( -5, 2 ), ( -6, 3 ), ( -4, 3 ), ( -5, 3 ), ( -6, 4 ), ( -3, 4 ), ( -4, 4 ), ( -5, 4 ), ( -6, 5 ), ( 3, -4 ), ( 4, -5 ), ( 4, -4 ), ( 5, -5 ), ( 6, -5 ), ( 4, -3 ), ( 5, -4 ), ( 6, -4 ), ( 4, -2 ), ( 5, -3 ), ( 6, -3 ), ( 4, -1 ), ( 5, -2 ), ( 6, -2 ), ( 3, 1 ), ( 4, 0 ), ( 5, -1 ), ( 6, -1 ), ( 5, 0 ) ]
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
    in
    S.g
        [ SA.class "puzzle"
        , SA.class status
        ]
        [ viewOffGridTarget model.drag
        , HexGrid.view gridMouseEvents model.grid
        , SK.node "g"
            [ SA.class "puzzle-pieces"
            , SA.transform (StrUtil.scale (zoomFor model.size))
            ]
            (List.indexedMap mapViewHex (List.reverse model.hexes)
                ++ viewDraggedHexes model.drag
            )

        --, HexGrid.view gridMouseEvents (HexGrid.create 0.55 Graphics.middle (HexGrid.Range ( -6, 6 ) ( -7, 7 ) ( -7, 7 )))
        ]


gridMouseEvents : HexGrid.Axial -> List (S.Attribute Msg)
gridMouseEvents ax =
    [ ME.onMove (always (ForSelf (HoverGridSpace ax)))
    , E.custom "contextmenu" (JD.succeed { message = ForSelf PreventContextMenu, stopPropagation = True, preventDefault = True })
    ]


viewHex : HexPositions -> Int -> Int -> Hex -> ( String, Html Msg )
viewHex positions count index hex =
    let
        ( x, y ) =
            HexPositions.getLagged hex (count - index) count positions
    in
    ( String.fromInt hex.id
    , S.g
        [ SA.class "hex-container"
        , SA.transform (StrUtil.translate x y)
        , ME.onDown (getClickInfo (StartDraggingHex hex) >> ForParent)
        ]
        [ Hex.view hex ]
    )


getClickInfo : (ME.Button -> Point -> OutMsg) -> ME.Event -> OutMsg
getClickInfo msg event =
    msg event.button event.pagePos


viewDraggedHexes : Drag -> List ( String, Html Msg )
viewDraggedHexes drag =
    case drag of
        NotDragging ->
            [ ( "none", S.text "" ) ]

        Drag hexes ->
            List.map viewDraggedHex hexes


viewDraggedHex : DraggedHex -> ( String, Html Msg )
viewDraggedHex { hex, position } =
    let
        ( x, y ) =
            position
    in
    ( String.fromInt hex.id
    , S.g
        [ SA.transform (StrUtil.translate x y)
        , SA.class "hex-container dragging"
        ]
        [ Hex.view hex ]
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
                , E.custom "contextmenu" (JD.succeed { message = ForSelf PreventContextMenu, stopPropagation = True, preventDefault = True })
                , ME.onMove (always (ForSelf HoverOffGrid))
                , SA.x (String.fromFloat -w)
                , SA.y (String.fromFloat -h)
                , SA.width (String.fromFloat (3 * w))
                , SA.height (String.fromFloat (3 * h))
                ]
                []


preview : Point -> Size -> Html msg
preview ( x, y ) size =
    let
        grid =
            HexGrid.create 0.19 ( x, y ) (rangeFor size)
    in
    HexGrid.view (always [ SA.class "static" ]) grid
