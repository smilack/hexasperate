module Main exposing (main)

import Animator
import Browser
import Browser.Dom
import Browser.Events
import Graphics exposing (BoundingBox, Point)
import Hex exposing (Hex)
import HexPositions
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
import StrUtil
import Svg as S
import Svg.Attributes as SA
import Task
import Time
import Title exposing (Title)



-- MAIN


main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { svgDimensions : BoundingBox
    , mousePos : Point
    , scene : Scene
    , viewBox : Animator.Timeline BoundingBox
    , options : Options.Model
    , puzzle : Puzzle.Model
    }


type Scene
    = TitleScreen
    | DifficultyMenu
    | OptionsScreen
    | GameBoard
    | AboutScreen


type Align
    = Left
    | Center



-- INIT


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel
    , getSvgDimensions
    )


initialModel : Model
initialModel =
    { svgDimensions = BoundingBox 0 0 0 0
    , mousePos = ( 0, 0 )
    , scene = initialScene
    , viewBox = Animator.init (getSceneCamera initialScene)
    , options = Options.init
    , puzzle = Puzzle.init
    }


initialScene : Scene
initialScene =
    TitleScreen



--SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Browser.Events.onResize WindowResize
        , Animator.toSubscription Tick model animator
        , Sub.map OptionMsg (Options.subscriptions model.options)
        ]


animator : Animator.Animator Model
animator =
    Animator.animator
        |> Animator.watching
            .viewBox
            (\new model -> { model | viewBox = new })
        |> Animator.watching
            (.puzzle >> .positions)
            setPuzzlePositions


setPuzzlePositions : HexPositions.HexPositions -> Model -> Model
setPuzzlePositions new ({ puzzle } as model) =
    let
        newPuzzle =
            { puzzle | positions = new }
    in
    { model | puzzle = newPuzzle }



-- COMMANDS


getSvgDimensions : Cmd Msg
getSvgDimensions =
    Task.attempt GotSvgElement (Browser.Dom.getElement "screen")



-- MESSAGES


type Msg
    = WindowResize Int Int
    | GotSvgElement (Result Browser.Dom.Error Browser.Dom.Element)
    | Tick Time.Posix
    | MouseMove Point
    | ChangeScene Scene
    | OptionMsg Options.Msg
    | StartDraggingHex Hex Point
    | CreatePuzzle Puzzle.Size
    | PuzzleMsg Puzzle.InternalMsg
    | PuzzleReady Puzzle.Model


puzzleTranslator : Puzzle.Translator Msg
puzzleTranslator =
    Puzzle.translator
        { onInternalMsg = PuzzleMsg
        , onPuzzleReady = PuzzleReady
        , onStartDraggingHex = StartDraggingHex
        }



-- UPDATE


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
                scaledPoint =
                    Graphics.scale pagePos model.svgDimensions (BoundingBox 0 0 0 0)

                mousePoint =
                    Graphics.scale pagePos model.svgDimensions (getSceneCamera model.scene)

                ( newPuzzle, cmd ) =
                    Puzzle.update (Puzzle.MovePointer scaledPoint) model.puzzle
            in
            ( { model
                | mousePos = mousePoint
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

        OptionMsg optionMsg ->
            let
                ( options, cmd ) =
                    Options.update optionMsg model.options
            in
            ( { model | options = options }
            , Cmd.map OptionMsg cmd
            )

        StartDraggingHex hex pagePos ->
            let
                scaledPoint =
                    Graphics.scale pagePos model.svgDimensions (BoundingBox 0 0 0 0)

                ( newPuzzle, cmd ) =
                    Puzzle.update (Puzzle.StartDragging hex scaledPoint) model.puzzle
            in
            ( { model | puzzle = newPuzzle }
            , Cmd.map puzzleTranslator cmd
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



-- VIEW


view : Model -> Html Msg
view ({ options } as model) =
    S.svg
        [ SA.viewBox (getViewBox model.viewBox)
        , SA.id "screen"
        , SA.preserveAspectRatio "xMidYMid meet"
        , ME.onMove (.pagePos >> MouseMove)
        , ME.onUp (always (PuzzleMsg Puzzle.StopDraggingHex))
        ]
        ([ viewDefs
         , viewBackground options.backgroundAnimation options.backgroundPattern options.backgroundColor

         --, viewDebugRect model.viewBox
         --, S.circle [ SA.cx (String.fromFloat (Tuple.first model.mousePos)), SA.cy (String.fromFloat (Tuple.second model.mousePos)), SA.r "0.6", SA.stroke "black", SA.fill "white", SA.strokeWidth "0.4" ] []
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
    StrUtil.spaceDelimit4 x y w h


viewBackground : Options.BackgroundAnimation -> Options.BackgroundPattern -> Options.BackgroundColor -> Html Msg
viewBackground animation pattern color =
    let
        ( x, y ) =
            ( -2.4 * Graphics.screen.w, -2.4 * Graphics.screen.h )

        ( w, h ) =
            ( 7.2 * Graphics.screen.w, 7.2 * Graphics.screen.h )

        fillColor =
            case color of
                Options.BluePurple ->
                    "url(#bggradient"

                Options.DarkMode ->
                    "#2d2d2d"

        animationClass =
            case animation of
                Options.On ->
                    ""

                Options.Off ->
                    "stopped"

        patternClass =
            case pattern of
                Options.On ->
                    ""

                Options.Off ->
                    "hidden"
    in
    S.g [ SA.class "background" ]
        [ S.rect
            [ SA.fill fillColor
            , SA.x (String.fromFloat x)
            , SA.y (String.fromFloat y)
            , SA.width (String.fromFloat w)
            , SA.height (String.fromFloat h)
            ]
            []
        , S.rect
            [ SA.fill "url(#bgpattern)"
            , SA.class "bgpattern"
            , SA.class patternClass
            , SA.class animationClass
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
        [ SA.class "title-screen"
        , SA.transform (StrUtil.translate titleCam.x titleCam.y)
        ]
        (viewTitleScreen model.options.titleAnimation)
    , S.g
        [ SA.class "difficulty-menu"
        , SA.transform (StrUtil.translate diffCam.x diffCam.y)
        ]
        (viewDifficultyMenu model.options.titleAnimation)
    , S.g
        [ SA.class "options-screen"
        , SA.transform (StrUtil.translate optsCam.x optsCam.y)
        ]
        (viewOptions model.options)
    , S.g
        [ SA.class "about-screen"
        , SA.transform (StrUtil.translate aboutCam.x aboutCam.y)
        ]
        (viewAbout model.options.titleAnimation)
    , S.g
        [ SA.class "game-board"
        , SA.transform (StrUtil.translate gameCam.x gameCam.y)
        ]
        (viewGame model.options model.puzzle)
    ]



-- VIEW TITLE SCREEN


viewTitleScreen : Options.TitleAnimation -> List (Html Msg)
viewTitleScreen titleAnimation =
    let
        ( x, _ ) =
            Graphics.middle
    in
    [ Title.view titleAnimation Title.hexasperate
    , viewMenuOption "PLAY" ( x, 67 ) (ChangeScene DifficultyMenu)
    , viewMenuOption "OPTIONS" ( x, 85 ) (ChangeScene OptionsScreen)
    , viewMenuOption "ABOUT" ( x, 103 ) (ChangeScene AboutScreen)
    ]



-- VIEW DIFFICULTY MENU


viewDifficultyMenu : Options.TitleAnimation -> List (Html Msg)
viewDifficultyMenu titleAnimation =
    let
        ( x, _ ) =
            Graphics.middle
    in
    , viewMenuOption "SMALL" ( x, 67 ) (CreatePuzzle Puzzle.Small)
    , viewMenuOption "MEDIUM" ( x, 85 ) (CreatePuzzle Puzzle.Medium)
    , viewMenuOption "LARGE" ( x, 103 ) (CreatePuzzle Puzzle.Large)
    [ Title.view titleAnimation Title.play
    , viewBackButton TitleScreen Center
    ]



-- VIEW OPTIONS MENU


viewOptions : Options.Model -> List (Html Msg)
viewOptions options =
    [ Title.view options.titleAnimation Title.options
    , H.map OptionMsg (Options.view options)
    , viewBackButton TitleScreen Center
    ]



-- VIEW GAME


viewGame : Options.Model -> Puzzle.Model -> List (Html Msg)
viewGame options puzzle =
    let
        palette =
            Palette.class options.palette

        labels =
            case options.labelState of
                Options.On ->
                    ""

                Options.Off ->
                    "no-labels"
    in
    [ S.g
        [ SA.class "palette"
        , SA.class palette
        , SA.class labels
        ]
        [ H.map puzzleTranslator (Puzzle.view puzzle) ]
    , viewBackButton DifficultyMenu Left
    ]



-- VIEW ABOUT


viewAbout : Options.TitleAnimation -> List (Html Msg)
viewAbout titleAnimation =
    [ Title.view titleAnimation Title.about
    , viewText "Hexasperate is an edge-matching puzzle" ( 25.8, 55 ) Left
    , viewText "game inspired by the classic game TetraVex" ( 25.8, 65 ) Left
    , viewText "by Scott Ferguson, which first appeared" ( 25.8, 75 ) Left
    , viewText "in Microsoft Entertainment Pack 3 in 1991." ( 25.8, 85 ) Left
    , viewText "Hexasperate was created by Tom Smilack." ( 25.8, 105 ) Left
    , viewBackButton TitleScreen Center
    ]


viewText : String -> Point -> Align -> Html Msg
viewText label ( x, y ) align =
    S.text_
        [ SA.class "text"
        , alignToClass align
        , SA.x (String.fromFloat x)
        , SA.y (String.fromFloat y)
        ]
        [ S.text label ]



-- VIEW UTILS


viewBackButton : Scene -> Align -> Html Msg
viewBackButton scene align =
    let
        ( x, _ ) =
            case align of
                Center ->
                    Graphics.middle

                Left ->
                    ( 1, 0 )

        y =
            case align of
                Center ->
                    "125"

                Left ->
                    "131"
    in
    S.text_
        [ SA.class "back"
        , alignToClass align
        , SA.x (String.fromFloat x)
        , SA.y y
        , E.onClick (ChangeScene scene)
        ]
        [ S.text "BACK" ]


alignToClass : Align -> S.Attribute Msg
alignToClass align =
    case align of
        Left ->
            SA.class "left"

        Center ->
            SA.class "center"


viewMenuOption : String -> Point -> Msg -> Html Msg
viewMenuOption label ( x, y ) action =
    S.text_
        [ SA.class "menu-option"
        , SA.x (String.fromFloat x)
        , SA.y (String.fromFloat y)
        , E.onClick action
        ]
        [ S.text label ]
