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
    , hexIds : List Hex.Id
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
    , hexIds = List.range 1 (List.length (HexGrid.cells grid))
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
        , hexIds = List.range 1 (List.length (HexGrid.cells grid))
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
    | PuzzleValuesGenerated (List Label)
    | HexIdsShuffled (List Hex.Id)
    | StartDragging Hex Point
    | MovePointer Point
    | StopDraggingHex



-- UPDATE


update : InternalMsg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        StartGame size ->
            ( setSize size model
            , generateValues size
            )

        PuzzleValuesGenerated labels ->
            ( model
            , createAndShuffleHexes labels model
            )

        HexIdsShuffled hexIds ->
            ( { model | hexIds = hexIds }
            , Cmd.none
            )

        StartDragging hex ( x, y ) ->
            let
                ( startX, startY ) =
                    HexPositions.get hex model.positions

                offset =
                    ( x - startX, y - startY )
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

                Drag drag ->
                    let
                        ( offX, offY ) =
                            drag.offset

                        newDrag =
                            Drag { drag | position = ( x - offX, y - offY ) }
                    in
                    ( { model | drag = newDrag }
                    , Cmd.none
                    )

        StopDraggingHex ->
            case model.drag of
                NotDragging ->
                    ( model, Cmd.none )

                Drag { hex } ->
                    ( { model
                        | drag = NotDragging
                        , hexes = model.hexes ++ [ hex ]
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


generateValues : Size -> Cmd Msg
generateValues size =
    Random.generate (PuzzleValuesGenerated >> ForSelf)
        (Random.list (valueCountFor size)
            (Random.uniform Zero
                [ One, Two, Three, Four, Five, Six, Seven, Eight, Nine ]
            )
        )


createAndShuffleHexes : List Label -> Model -> Cmd Msg
createAndShuffleHexes labels model =
    let
        readyMsg shuffled =
            ForParent (PuzzleReady { model | hexes = shuffled })

        unshuffledHexes =
            createHexes labels model
    in
    Random.generate readyMsg (Random.List.shuffle unshuffledHexes)



-- HEX INITIALIZATION


createHexes : List Label -> Model -> List Hex
createHexes labelList { hexIds, grid, size } =
    List.map Tuple.second
        (addHexToGrid
            (zoomFor size)
            grid
            hexIds
            labelList
            (HexGrid.cells grid)
            []
        )


{-| Create a complete, valid puzzle from a shuffled list of ids, a shuffled
list of label values, a list of hexagonal grid coordinates, and the grid they
belong to.
-}
addHexToGrid :
    Float
    -> HexGrid
    -> List Hex.Id
    -> List Label
    -> List HexGrid.Axial
    -> List ( HexGrid.Axial, Hex )
    -> List ( HexGrid.Axial, Hex )
addHexToGrid zoom grid hexIds labels axials hexes =
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
            addHexToGrid zoom grid ids labs axs (( ax, hex ) :: hexes)

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
            --these aren't right
            42

        Large ->
            --these aren't right
            42


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
