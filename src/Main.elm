module Main exposing (main)

import Animator
import Array exposing (Array)
import Browser
import Browser.Dom
import Browser.Events
import Graphics exposing (BoundingBox, Point)
import Hex exposing (Hex)
import HexGrid
import HexList exposing (HexList)
import HexPositions exposing (HexPositions)
import Html as H exposing (Html)
import Html.Attributes as A
import Html.Events as E
import Html.Events.Extra.Mouse as ME
import Label exposing (Label)
import Options
import Palette exposing (Palette)
import Puzzle
import Random
import Random.List
import Svg as S
import Svg.Attributes as SA
import Task
import Time
import Title exposing (Title)


main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Browser.Events.onResize WindowResize
        , Animator.toSubscription Tick model animator
        ]


type alias Model =
    { svgDimensions : BoundingBox
    , mousePos : Point
    , scene : Scene
    , viewBox : Animator.Timeline BoundingBox
    , options : Options.Model
    , hexPositions : HexPositions
    , dragging : Drag
    , puzzle : Puzzle.Model
    }


type Drag
    = Drag { hex : Hex, position : Point, offset : Point }
    | NotDragging


type Scene
    = TitleScreen
    | DifficultyMenu
    | OptionsScreen
    | GameBoard
    | AboutScreen


type Align
    = Left
    | Center


getSceneCamera : Scene -> BoundingBox
getSceneCamera scene =
    let
        screen =
            Graphics.screen
    in
    case scene of
        TitleScreen ->
            screen

        DifficultyMenu ->
            { screen | x = 1.2 * screen.w }

        OptionsScreen ->
            { screen | x = -1.2 * screen.w }

        GameBoard ->
            { screen | x = 2.4 * screen.w }

        AboutScreen ->
            { screen | y = 1.2 * screen.h }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel
    , getSvgDimensions
    )


initialModel : Model
initialModel =
    { svgDimensions = BoundingBox 0 0 0 0
    , mousePos = ( 0, 0 )
    , scene = DifficultyMenu
    , viewBox = Animator.init (getSceneCamera DifficultyMenu)
    , options = Options.init
    , hexPositions = HexPositions.init
    , dragging = NotDragging
    , puzzle = Puzzle.init
    }


animator : Animator.Animator Model
animator =
    Animator.animator
        |> Animator.watching
            .viewBox
            (\new model -> { model | viewBox = new })
        |> Animator.watching
            .hexPositions
            (\new model -> { model | hexPositions = new })


getSvgDimensions : Cmd Msg
getSvgDimensions =
    Task.attempt GotSvgElement (Browser.Dom.getElement "screen")


type Msg
    = WindowResize Int Int
    | GotSvgElement (Result Browser.Dom.Error Browser.Dom.Element)
    | Tick Time.Posix
    | MouseMove Point
    | ChangeScene Scene
    | ChangeOption Options.Msg
    | StartDraggingHex Hex Point
    | StopDraggingHex
    | CreatePuzzle Puzzle.Size
    | PuzzleMsg Puzzle.InternalMsg
    | PuzzleReady Puzzle.Model


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        WindowResize _ _ ->
            ( model, getSvgDimensions )

        GotSvgElement result ->
            case result of
                Err (Browser.Dom.NotFound str) ->
                    let
                        _ =
                            Debug.log "Error getting screen element" str
                    in
                    ( model, Cmd.none )

                Ok { element } ->
                    let
                        box =
                            Debug.log "resizing to"
                                (BoundingBox element.x element.y element.width element.height)
                    in
                    ( { model | svgDimensions = box }
                    , Cmd.none
                    )

        Tick newTime ->
            ( model |> Animator.update newTime animator
            , Cmd.none
            )

        MouseMove pagePos ->
            let
                ( x, y ) =
                    Graphics.scale pagePos model.svgDimensions (getSceneCamera model.scene)

                ( dragging, hexPositions ) =
                    case model.dragging of
                        NotDragging ->
                            ( NotDragging, model.hexPositions )

                        Drag { hex, offset } ->
                            let
                                ( offX, offY ) =
                                    offset

                                position =
                                    ( x - offX, y - offY )
                            in
                            ( Drag
                                { hex = hex
                                , position = position
                                , offset = offset
                                }
                            , HexPositions.move hex position model.hexPositions
                            )

                ( newPuzzle, cmd ) =
                    Puzzle.update (Puzzle.SetPointer ( x, y )) model.puzzle
            in
            ( { model
                | mousePos = ( x, y )
                , dragging = dragging
                , hexPositions = hexPositions
                , puzzle = newPuzzle
              }
            , Cmd.map puzzleTranslator cmd
            )

        ChangeScene newScene ->
            ( { model
                | scene = newScene
                , viewBox =
                    model.viewBox
                        |> Animator.go Animator.slowly (getSceneCamera newScene)
              }
            , Cmd.none
            )

        ChangeOption optionMsg ->
            ( { model | options = Options.update optionMsg model.options }
            , Cmd.none
            )

        StartDraggingHex hex pagePos ->
            let
                ( x, y ) =
                    Graphics.scale pagePos model.svgDimensions (getSceneCamera model.scene)

                ( startX, startY ) =
                    HexPositions.get hex model.hexPositions

                ( offX, offY ) =
                    ( x - startX, y - startY )

                -- TODO also remove hex from puzzle?
            in
            ( { model
                | dragging =
                    Drag
                        { hex = hex
                        , position = ( startX, startY )
                        , offset = ( offX, offY )
                        }
              }
            , Cmd.none
            )

        StopDraggingHex ->
            ( { model
                | dragging = NotDragging
              }
            , Cmd.none
            )

        CreatePuzzle size ->
            let
                ( newPuzzle, cmd ) =
                    Puzzle.update (Puzzle.StartGame size) model.puzzle
            in
            ( { model | puzzle = newPuzzle }
            , Cmd.map puzzleTranslator cmd
            )

        PuzzleMsg internal ->
            let
                ( newPuzzle, cmd ) =
                    Puzzle.update internal model.puzzle
            in
            ( { model | puzzle = newPuzzle }
            , Cmd.map puzzleTranslator cmd
            )

        PuzzleReady puzzle ->
            update (ChangeScene GameBoard) { model | puzzle = puzzle }


puzzleTranslator : Puzzle.Translator Msg
puzzleTranslator =
    --H.map puzzleTranslator (Puzzle.view puzzle)
    Puzzle.translator
        { onInternalMsg = PuzzleMsg
        , onPuzzleReady = PuzzleReady
        }



-- VIEW


view : Model -> Html Msg
view model =
    S.svg
        [ SA.viewBox (getViewBox model.viewBox)
        , SA.id "screen"
        , SA.preserveAspectRatio "xMidYMid meet"
        , ME.onMove (.pagePos >> MouseMove)
        , ME.onUp (always StopDraggingHex)
        ]
        ([ viewDefs
         , viewBackground model.options.backgroundAnimation
         , viewDebugRect model.viewBox

         --, S.circle [ SA.cx (String.fromFloat model.mousePos.x), SA.cy (String.fromFloat model.mousePos.y), SA.r "0.6", SA.stroke "black", SA.fill "white", SA.strokeWidth "0.4" ] []
         ]
            ++ viewScene model
        )


viewDebugRect : Animator.Timeline BoundingBox -> Html Msg
viewDebugRect viewBox =
    let
        x =
            Animator.move viewBox (.x >> Animator.at)

        y =
            Animator.move viewBox (.y >> Animator.at)

        w =
            Animator.move viewBox (.w >> Animator.at)

        h =
            Animator.move viewBox (.h >> Animator.at)
    in
    S.rect
        [ SA.strokeWidth "0.1"
        , SA.stroke "black"
        , SA.x (String.fromFloat x)
        , SA.y (String.fromFloat y)
        , SA.width (String.fromFloat w)
        , SA.height (String.fromFloat h)
        , SA.fill "none"
        ]
        []


getViewBox : Animator.Timeline BoundingBox -> String
getViewBox viewBox =
    let
        x =
            Animator.move viewBox (.x >> Animator.at)

        y =
            Animator.move viewBox (.y >> Animator.at)

        w =
            Animator.move viewBox (.w >> Animator.at)

        h =
            Animator.move viewBox (.h >> Animator.at)
    in
    String.join " "
        (List.map String.fromFloat [ x, y, w, h ])


viewBackground : Options.BackgroundAnimation -> Html Msg
viewBackground state =
    let
        ( x, y ) =
            ( -2.4 * Graphics.screen.w, -2.4 * Graphics.screen.h )

        ( w, h ) =
            ( 7.2 * Graphics.screen.w, 7.2 * Graphics.screen.h )

        animClass =
            case state of
                Options.On ->
                    SA.class ""

                Options.Off ->
                    SA.class "stopped"
    in
    S.g []
        [ S.rect
            [ -- SA.fill "#03a9f4"
              SA.fill "url(#bggradient)"
            , SA.x (String.fromFloat x)
            , SA.y (String.fromFloat y)
            , SA.width (String.fromFloat w)
            , SA.height (String.fromFloat h)
            ]
            []
        , S.rect
            [ SA.fill "url(#bgpattern)"
            , SA.class "bgpattern"
            , animClass
            , SA.x (String.fromFloat x)
            , SA.y (String.fromFloat y)
            , SA.width (String.fromFloat w)
            , SA.height (String.fromFloat h)
            ]
            []
        ]


viewDefs : Html Msg
viewDefs =
    S.defs []
        [ S.pattern
            [ SA.id "bgpattern"
            , SA.x "0"
            , SA.y "0"
            , SA.width "80"
            , SA.height "46"
            , SA.patternUnits "userSpaceOnUse"
            , SA.viewBox "-6 -10 12.125 20"
            , SA.preserveAspectRatio "xMidYMid slice"
            ]
            [ S.path
                [ SA.d "M -4 0 L -8 0"
                , SA.strokeWidth "0.15"
                , SA.stroke "#4fc3f7"
                , SA.strokeLinecap "butt"
                , SA.fill "transparent"
                ]
                []
            , S.path
                [ SA.d "M 4 0 L 2 -3.5 L -2 -3.5 L -4 0 L -2 3.5 L 2 3.5 Z"
                , SA.strokeWidth "0.2"
                , SA.stroke "#4fc3f7"
                , SA.strokeLinejoin "bevel"
                , SA.fill "transparent"
                ]
                []
            , S.path
                [ SA.d "M 4 0 L 8 0"
                , SA.strokeWidth "0.15"
                , SA.stroke "#4fc3f7"
                , SA.strokeLinecap "butt"
                , SA.fill "transparent"
                ]
                []
            ]
        , S.linearGradient
            [ SA.id "bggradient"
            , SA.gradientTransform "rotate(30)"
            ]
            [ S.stop
                [ SA.offset "10%"
                , SA.stopColor "#03a9f4"
                ]
                []
            , S.stop
                [ SA.offset "100%"
                , SA.stopColor "#9c27b0"
                ]
                []
            ]
        ]


viewScene : Model -> List (Html Msg)
viewScene model =
    let
        titleCam =
            getSceneCamera TitleScreen

        diffCam =
            getSceneCamera DifficultyMenu

        optsCam =
            getSceneCamera OptionsScreen

        aboutCam =
            getSceneCamera AboutScreen

        gameCam =
            getSceneCamera GameBoard
    in
    [ S.g
        [ SA.transform (translate titleCam.x titleCam.y) ]
        (viewTitleScreen model.options.titleAnimation)
    , S.g
        [ SA.transform (translate diffCam.x diffCam.y) ]
        (viewDifficultyMenu model.options.titleAnimation)
    , S.g
        [ SA.transform (translate optsCam.x optsCam.y) ]
        (viewOptions model.options)
    , S.g
        [ SA.transform (translate aboutCam.x aboutCam.y) ]
        (viewAbout model.options.titleAnimation)
    , S.g
        [ SA.transform (translate gameCam.x gameCam.y) ]
        (viewGame model)
    ]



-- VIEW TITLE SCREEN


viewTitleScreen : Options.TitleAnimation -> List (Html Msg)
viewTitleScreen titleAnimation =
    let
        ( x, _ ) =
            Graphics.middle
    in
    [ viewTitle titleAnimation Title.hexasperate
    , viewMenuOption "PLAY" ( x, 67 ) (ChangeScene DifficultyMenu)
    , viewMenuOption "OPTIONS" ( x, 85 ) (ChangeScene OptionsScreen)
    , viewMenuOption "ABOUT" ( x, 103 ) (ChangeScene AboutScreen)
    ]


viewTitle : Options.TitleAnimation -> Title -> Html Msg
viewTitle state title =
    S.g
        [ SA.class "title"
        , SA.x "0"
        , SA.y "0"
        , SA.transform "translate(0 30)"
        ]
        (List.map2 (viewTitleLetter state sineValues)
            title
            (List.range 0 (List.length title))
        )


sineValues : String
sineValues =
    String.join ";"
        (List.map String.fromFloat (sineSteps 20 5))


sineSteps : Int -> Float -> List Float
sineSteps steps scale =
    let
        toSin i =
            sin (toFloat i * (2 / toFloat steps) * pi)
    in
    List.map
        (toSin >> (*) -scale)
        (List.range 0 steps)


viewTitleLetter : Options.TitleAnimation -> String -> ( String, String ) -> Int -> Html Msg
viewTitleLetter state animValues ( letter, xPos ) index =
    let
        animate =
            case state of
                Options.On ->
                    S.animate
                        [ SA.dur "3s"
                        , SA.repeatCount "indefinite"
                        , SA.begin (String.fromFloat (toFloat index / 10) ++ "s")
                        , SA.attributeName "y"
                        , SA.values animValues
                        ]
                        []

                Options.Off ->
                    S.text ""
    in
    S.text_
        [ SA.x xPos
        , SA.y "0"
        ]
        [ animate
        , S.text letter
        ]



-- VIEW DIFFICULTY MENU


viewDifficultyMenu : Options.TitleAnimation -> List (Html Msg)
viewDifficultyMenu titleAnimation =
    let
        ( x, _ ) =
            Graphics.middle
    in
    [ viewTitle titleAnimation Title.play
    , viewMenuOption "SMALL" ( x, 67 ) (CreatePuzzle Puzzle.Small)
    , viewMenuOption "MEDIUM" ( x, 85 ) (CreatePuzzle Puzzle.Medium)
    , viewMenuOption "LARGE" ( x, 103 ) (CreatePuzzle Puzzle.Large)
    , viewBackButton TitleScreen
    ]



-- VIEW OPTIONS MENU


viewOptions : Options.Model -> List (Html Msg)
viewOptions options =
    [ viewTitle options.titleAnimation Title.options
    , H.map ChangeOption (Options.view options)
    , viewBackButton TitleScreen
    ]



-- VIEW GAME


viewGame : Model -> List (Html Msg)
viewGame model =
    let
        { grid, hexes } =
            model.puzzle

        palette =
            Palette.get model.options.palette

        drag =
            case model.dragging of
                NotDragging ->
                    S.text ""

                Drag { hex, position } ->
                    Hex.view palette model.options.labelState position StartDraggingHex hex
    in
    [ HexGrid.view grid
    , viewBackButton DifficultyMenu
    ]
        ++ List.map
            (\h ->
                Hex.view
                    palette
                    model.options.labelState
                    (HexPositions.get h model.hexPositions)
                    StartDraggingHex
                    h
            )
            hexes
        ++ [ drag ]



-- VIEW ABOUT


viewAbout : Options.TitleAnimation -> List (Html Msg)
viewAbout titleAnimation =
    [ viewTitle titleAnimation Title.about
    , viewText "Hexasperate is an edge-matching puzzle" ( 25.8, 55 ) Left
    , viewText "game inspired by the classic game TetraVex" ( 25.8, 65 ) Left
    , viewText "by Scott Ferguson, which first appeared" ( 25.8, 75 ) Left
    , viewText "in Microsoft Entertainment Pack 3 in 1991." ( 25.8, 85 ) Left
    , viewText "Hexasperate was created by Tom Smilack." ( 25.8, 105 ) Left
    , viewBackButton TitleScreen
    ]



-- VIEW UTILS


viewBackButton : Scene -> Html Msg
viewBackButton scene =
    let
        ( x, _ ) =
            Graphics.middle
    in
    S.text_
        [ SA.class "back"
        , SA.x (String.fromFloat x)
        , SA.y "125"
        , E.onClick (ChangeScene scene)
        ]
        [ S.text "BACK" ]


viewMenuOption : String -> Point -> Msg -> Html Msg
viewMenuOption label ( x, y ) action =
    S.text_
        [ SA.class "menu-option"
        , SA.x (String.fromFloat x)
        , SA.y (String.fromFloat y)
        , E.onClick action
        ]
        [ S.text label ]


viewText : String -> Point -> Align -> Html Msg
viewText label ( x, y ) align =
    S.text_
        [ SA.class "text"
        , alignToClass align
        , SA.x (String.fromFloat x)
        , SA.y (String.fromFloat y)
        ]
        [ S.text label ]


translate : Float -> Float -> String
translate x y =
    "translate(" ++ String.fromFloat x ++ " " ++ String.fromFloat y ++ ")"


alignToClass : Align -> S.Attribute Msg
alignToClass align =
    case align of
        Left ->
            SA.class "left"

        Center ->
            SA.class "center"
