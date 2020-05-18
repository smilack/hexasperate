module Puzzle exposing (Drag(..), InternalMsg(..), Model, Msg, Size(..), Translator, init, translator, update, view)

import Graphics exposing (Point)
import Hex exposing (Hex)
import HexGrid exposing (HexGrid)
import HexList exposing (HexList)
import HexPositions exposing (HexPositions)
import Html exposing (Html)
import Html.Events.Extra.Mouse as ME
import Label exposing (Label(..))
import Random
import Random.List
import StrUtil
import Svg as S
import Svg.Attributes as SA



-- MODEL / INIT


type alias Model =
    { size : Size
    , grid : HexGrid
    , hexes : List Hex
    , positions : HexPositions
    , drag : Drag
    , dropTarget : Maybe HexGrid.Axial
    , interactionStarted : Bool
    , verified : Bool
    }


init : Model
init =
    let
        grid =
            gridFor Small
    in
    { size = Small
    , grid = grid
    , hexes = []
    , positions = HexPositions.init
    , drag = NotDragging
    , dropTarget = Nothing
    , interactionStarted = False
    , verified = False
    }



-- MESSAGES


type Msg
    = ForSelf InternalMsg
    | ForParent OutMsg


type OutMsg
    = PuzzleReady Model
    | StartDraggingHex Hex Point


type alias TranslationDictionary parentMsg =
    { onInternalMsg : InternalMsg -> parentMsg
    , onPuzzleReady : Model -> parentMsg
    , onStartDraggingHex : Hex -> Point -> parentMsg
    }


type alias Translator parentMsg =
    Msg -> parentMsg


translator : TranslationDictionary parentMsg -> Translator parentMsg
translator { onInternalMsg, onPuzzleReady, onStartDraggingHex } msg =
    case msg of
        ForSelf internal ->
            onInternalMsg internal

        ForParent (PuzzleReady model) ->
            onPuzzleReady model

        ForParent (StartDraggingHex hex pagePos) ->
            onStartDraggingHex hex pagePos


type InternalMsg
    = StartGame Size
    | LabelsGeneratedAndIdsShuffled ( List Label, List Hex.Id )
    | StartDragging Hex Point
    | MovePointer Point
    | StopDraggingHex
    | HoverGridSpace HexGrid.Axial
    | HoverOffGrid



-- UPDATE


update : InternalMsg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        StartGame size ->
            ( { model
                | size = size
                , grid = gridFor size
                , interactionStarted = False
                , verified = False
              }
            , generateLabelsAndShuffleIds size
            )

        LabelsGeneratedAndIdsShuffled ( labels, hexIds ) ->
            ( model
            , createAndShuffleHexesAndPositions labels hexIds model
            )

        StartDragging hex ( x, y ) ->
            let
                zoom =
                    zoomFor model.size

                ( startX, startY ) =
                    HexPositions.get hex model.positions

                offset =
                    ( x / zoom - startX, y / zoom - startY )
            in
            ( { model
                | drag = Drag (DraggedHex hex ( startX, startY ) offset)
                , hexes = List.filter ((/=) hex) model.hexes
                , dropTarget = Nothing
              }
            , Cmd.none
            )

        MovePointer ( x, y ) ->
            case model.drag of
                NotDragging ->
                    ( model, Cmd.none )

                Drag ({ hex, offset } as drag) ->
                    let
                        ( offX, offY ) =
                            offset

                        zoom =
                            zoomFor model.size

                        newPosition =
                            ( x / zoom - offX, y / zoom - offY )

                        newDrag =
                            Drag { drag | position = newPosition }
                    in
                    ( { model
                        | drag = newDrag
                        , positions = HexPositions.move hex newPosition model.positions
                      }
                    , Cmd.none
                    )

        StopDraggingHex ->
            case model.drag of
                NotDragging ->
                    ( model, Cmd.none )

                Drag { hex, position } ->
                    case model.dropTarget of
                        Nothing ->
                            ( { model
                                | drag = NotDragging
                                , hexes = model.hexes ++ [ hex ]
                                , positions = HexPositions.move hex position model.positions
                                , interactionStarted = True
                              }
                            , Cmd.none
                            )

                        Just axial ->
                            let
                                glidePosition =
                                    HexGrid.absolutePoint (zoomFor model.size) axial model.grid

                                hexes =
                                    model.hexes ++ [ hex ]

                                positions =
                                    HexPositions.move hex glidePosition model.positions
                            in
                            ( { model
                                | drag = NotDragging
                                , hexes = hexes
                                , positions = positions
                                , interactionStarted = True
                                , verified = verify hexes positions model.grid
                              }
                            , Cmd.none
                            )

        HoverGridSpace axial ->
            case model.drag of
                NotDragging ->
                    ( { model
                        | dropTarget = Nothing
                      }
                    , Cmd.none
                    )

                Drag _ ->
                    ( { model
                        | dropTarget = Just axial
                      }
                    , Cmd.none
                    )

        HoverOffGrid ->
            ( { model
                | dropTarget = Nothing
              }
            , Cmd.none
            )



-- DRAGGING


type alias DraggedHex =
    { hex : Hex, position : Point, offset : Point }


type Drag
    = Drag DraggedHex
    | NotDragging



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
    ForParent (PuzzleReady newModel)



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


verify : List Hex -> HexPositions -> HexGrid -> Bool
verify hexes positions grid =
    False



-- SIZES


type Size
    = Small
    | Medium
    | Large


gridFor : Size -> HexGrid
gridFor size =
    HexGrid.create (zoomFor size) Graphics.middle (rangeFor size)


valueCountFor : Size -> Int
valueCountFor size =
    case size of
        Small ->
            30

        Medium ->
            55

        Large ->
            72


rangeFor : Size -> HexGrid.Range
rangeFor size =
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


glideDurationFor : Size -> Float
glideDurationFor size =
    case size of
        Small ->
            770

        Medium ->
            1540

        Large ->
            2090


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
    in
    List.map (\a -> HexGrid.absolutePoint (zoomFor size) a grid) axs



-- VIEW


view : Model -> Html Msg
view model =
    let
        mapViewHex =
            viewHex model.interactionStarted model.positions (List.length model.hexes)

        dropMsgAttr =
            HoverGridSpace >> ForSelf >> always >> ME.onMove

        winner =
            if model.verified then
                "winner"

            else
                ""
    in
    S.g
        [ SA.class "puzzle"
        , SA.class winner
        ]
        [ viewOffGridTarget model.drag
        , HexGrid.view dropMsgAttr model.grid
        , S.g
            [ SA.class "puzzle-pieces"
            , SA.transform (StrUtil.scale (zoomFor model.size))
            ]
            (List.indexedMap mapViewHex model.hexes
                ++ [ viewDragged model.drag ]
            )

        --, HexGrid.view dropMsgAttr (HexGrid.create 0.85 Graphics.middle (HexGrid.Range ( -4, 4 ) ( -3, 4 ) ( -4, 3 )))
        ]


viewHex : Bool -> HexPositions -> Int -> Int -> Hex -> Html Msg
viewHex interactionStarted positions count index hex =
    let
        ( x, y ) =
            if interactionStarted then
                HexPositions.get hex positions

            else
                HexPositions.getLagged hex index count positions
    in
    S.g
        [ SA.class "hex-container"
        , SA.transform (StrUtil.translate x y)
        , ME.onDown (.pagePos >> StartDraggingHex hex >> ForParent)
        ]
        [ Hex.view hex ]


viewDragged : Drag -> Html Msg
viewDragged drag =
    case drag of
        NotDragging ->
            S.text ""

        Drag { hex, position } ->
            let
                ( x, y ) =
                    position
            in
            S.g
                [ SA.transform (StrUtil.translate x y)
                , SA.class "hex-container dragging"
                ]
                [ Hex.view hex ]


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
                , ME.onMove (always (ForSelf HoverOffGrid))
                , SA.x (String.fromFloat -w)
                , SA.y (String.fromFloat -h)
                , SA.width (String.fromFloat (3 * w))
                , SA.height (String.fromFloat (3 * h))
                ]
                []
