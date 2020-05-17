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
import Svg as S
import Svg.Attributes as SA



-- MODEL / INIT


type alias Model =
    { size : Size
    , grid : HexGrid
    , hexes : List Hex
    , positions : HexPositions
    , drag : Drag
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
    }


setSize : Size -> Model -> Model
setSize size model =
    let
        grid =
            gridFor size
    in
    { model
        | size = size
        , grid = grid
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



-- UPDATE


update : InternalMsg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        StartGame size ->
            ( setSize size model
            , generateLabelsAndShuffleIds size
            )

        LabelsGeneratedAndIdsShuffled ( labels, hexIds ) ->
            ( model
            , createAndShuffleHexes labels hexIds model
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
                    ( { model
                        | drag = NotDragging
                        , hexes = model.hexes ++ [ hex ]
                        , positions = HexPositions.move hex position model.positions
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


createAndShuffleHexes : List Label -> List Hex.Id -> Model -> Cmd Msg
createAndShuffleHexes labels hexIds model =
    let
        placedHexes =
            createHexes labels hexIds model

        axToPoint ax =
            let
                _ =
                    Debug.log "ax" ax

                ( hx, hy ) =
                    HexGrid.toPoint 20 ax

                ( gx, gy ) =
                    HexGrid.center model.grid
            in
            Debug.log "point" ( gx + hx, gy + hy )

        positions =
            HexPositions.moveAll
                (List.map
                    (\( ax, hex ) -> ( hex, axToPoint ax ))
                    placedHexes
                )
                model.positions

        readyMsg shuffled =
            ForParent (PuzzleReady { model | hexes = shuffled, positions = positions })

        unshuffledHexes =
            List.map Tuple.second placedHexes
    in
    Random.generate readyMsg (Random.List.shuffle unshuffledHexes)



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



-- VIEW


view : Model -> Html Msg
view model =
    S.g
        []
        [ HexGrid.view model.grid
        , S.g
            [ SA.transform
                ("scale(" ++ String.fromFloat (zoomFor model.size) ++ ")")
            ]
            (List.map (viewHex model.positions) model.hexes
                ++ [ viewDragged model.drag ]
            )
        ]


viewHex : HexPositions -> Hex -> Html Msg
viewHex positions hex =
    let
        ( x, y ) =
            HexPositions.get hex positions
    in
    S.g
        [ SA.transform (translate x y)
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
                [ SA.transform (translate x y) ]
                [ Hex.view hex ]


translate : Float -> Float -> String
translate x y =
    "translate("
        ++ String.fromFloat x
        ++ " "
        ++ String.fromFloat y
        ++ ")"
