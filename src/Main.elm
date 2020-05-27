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


module Main exposing (main)

import Animator
import BestTimes exposing (BestTimes)
import Browser
import Browser.Dom
import Browser.Events
import Graphics exposing (BoundingBox, Point)
import Hex exposing (Hex)
import HexList exposing (HexList)
import HexPositions
import Html as H exposing (Html)
import Html.Attributes as A
import Html.Events as E
import Html.Events.Extra.Mouse as ME
import Html.Lazy as L
import Json.Decode
import Label exposing (Label)
import Options
import Palette exposing (Palette)
import Puzzle
import Random
import Random.List
import StrUtil
import Svg as S
import Svg.Attributes as SA
import Svg.Keyed as SK
import Task
import Time
import Timer exposing (Timer)
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
    , scene : Animator.Timeline Scene
    , options : Options.Model
    , puzzle : Puzzle.Model
    , bestTimes : BestTimes
    }


type Scene
    = TitleScreen
    | DifficultyMenu
    | OptionsScreen
    | GameBoard
    | AboutScreen
    | LicenseScreen
    | BestTimes
    | HowToScreen



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
    , scene = Animator.init initialScene
    , options = Options.init
    , puzzle = Puzzle.init
    , bestTimes = BestTimes.init
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
        , BestTimes.subscriptions LoadBestTimes
        ]


animator : Animator.Animator Model
animator =
    Animator.animator
        |> Animator.watching
            .scene
            (\new model -> { model | scene = new })
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
    | LoadBestTimes (Result Json.Decode.Error BestTimes)
    | MouseMove Point
    | ChangeScene Scene
    | OptionMsg Options.Msg
    | StartDraggingHex Hex ME.Button Point
    | CreatePuzzle Puzzle.Size
    | PuzzleMsg Puzzle.InternalMsg
    | PuzzleReady Puzzle.Model
    | PausePuzzle
    | ResumePuzzle
    | PuzzleSolved Puzzle.Size Int


puzzleTranslator : Puzzle.Translator Msg
puzzleTranslator =
    Puzzle.translator
        { onInternalMsg = PuzzleMsg
        , onPuzzleReady = PuzzleReady
        , onStartDraggingHex = StartDraggingHex
        , onPausePuzzle = PausePuzzle
        , onPuzzleSolved = PuzzleSolved
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
            let
                ( newPuzzle, cmd ) =
                    Puzzle.update (Puzzle.Tick newTime) model.puzzle
            in
            ( Animator.update newTime animator { model | puzzle = newPuzzle }
            , Cmd.map puzzleTranslator cmd
            )

        LoadBestTimes result ->
            case result of
                Err err ->
                    let
                        _ =
                            Debug.log "Error loading times" err
                    in
                    ( model, Cmd.none )

                Ok times ->
                    ( { model | bestTimes = times }
                    , Cmd.none
                    )

        MouseMove pagePos ->
            let
                scaledPoint =
                    Graphics.scale pagePos model.svgDimensions (BoundingBox 0 0 0 0)

                mousePoint =
                    Graphics.scale pagePos model.svgDimensions (getSceneCamera (Animator.current model.scene))

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
            ( { model | scene = model.scene |> Animator.go Animator.slowly newScene }
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

        StartDraggingHex hex button pagePos ->
            let
                scaledPoint =
                    Graphics.scale pagePos model.svgDimensions (BoundingBox 0 0 0 0)

                ( newPuzzle, cmd ) =
                    Puzzle.update (Puzzle.StartDragging hex button scaledPoint) model.puzzle
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
            let
                ( newModel, cmd ) =
                    update (ChangeScene GameBoard) { model | puzzle = puzzle }
            in
            ( newModel
            , cmd
            )

        PausePuzzle ->
            let
                ( newPuzzle, _ ) =
                    Puzzle.update Puzzle.PauseGame model.puzzle
            in
            update (ChangeScene DifficultyMenu) { model | puzzle = newPuzzle }

        ResumePuzzle ->
            update (ChangeScene GameBoard) model

        PuzzleSolved size time ->
            let
                ( newBestTimes, cmd ) =
                    BestTimes.add size time model.bestTimes
            in
            ( { model | bestTimes = newBestTimes }
            , cmd
            )


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

        LicenseScreen ->
            { screen | x = -1.2 * screen.w, y = 1.2 * screen.h }

        BestTimes ->
            { screen | y = -1.2 * screen.h }

        HowToScreen ->
            { screen | x = 1.2 * screen.w, y = 1.2 * screen.h }



-- VIEW


view : Model -> Html Msg
view ({ options } as model) =
    S.svg
        [ SA.viewBox (getViewBox model.scene)
        , SA.id "screen"
        , SA.preserveAspectRatio "xMidYMid meet"
        , ME.onMove (.pagePos >> MouseMove)
        , ME.onUp (always (PuzzleMsg Puzzle.StopDraggingHex))
        ]
        [ viewDefs
        , L.lazy3 viewBackground options.backgroundAnimation options.backgroundPattern options.backgroundColor

        --, viewDebugRect (getSceneCamera (Animator.current model.scene))
        --, S.circle [ SA.cx (String.fromFloat (Tuple.first model.mousePos)), SA.cy (String.fromFloat (Tuple.second model.mousePos)), SA.r "0.6", SA.stroke "black", SA.fill "white", SA.strokeWidth "0.4" ] []
        , viewGameContent model
        ]


viewDebugRect : BoundingBox -> Html Msg
viewDebugRect { x, y, w, h } =
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


getViewBox : Animator.Timeline Scene -> String
getViewBox scene =
    let
        x =
            Animator.move scene (getSceneCamera >> .x >> Animator.at)

        y =
            Animator.move scene (getSceneCamera >> .y >> Animator.at)

        w =
            Animator.move scene (getSceneCamera >> .w >> Animator.at)

        h =
            Animator.move scene (getSceneCamera >> .h >> Animator.at)
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


viewGameContent : Model -> Html Msg
viewGameContent model =
    let
        current =
            Animator.current model.scene

        previous =
            Animator.previous model.scene

        scenes =
            if current == previous then
                [ current ]

            else
                [ previous, current ]
    in
    SK.node "g"
        [ SA.class "game-content" ]
        (List.map (viewScene model) scenes)


viewScene : Model -> Scene -> ( String, Html Msg )
viewScene { options, puzzle, bestTimes } scene =
    let
        { x, y } =
            getSceneCamera scene

        transform =
            SA.transform (StrUtil.translate x y)
    in
    case scene of
        TitleScreen ->
            ( "title-screen"
            , S.g [ transform, SA.class "title-screen" ]
                (viewTitleScreen options.titleAnimation)
            )

        DifficultyMenu ->
            ( "difficulty-menu"
            , S.g [ transform, SA.class "difficulty-menu" ]
                (viewDifficultyMenu options.titleAnimation puzzle)
            )

        OptionsScreen ->
            ( "options-screen"
            , S.g [ transform, SA.class "options-screen" ]
                (viewOptions options)
            )

        AboutScreen ->
            ( "about-screen"
            , S.g [ transform, SA.class "about-screen" ]
                (viewAbout options.titleAnimation)
            )

        LicenseScreen ->
            ( "license-screen"
            , S.g [ transform, SA.class "license-screen" ]
                (viewLicense options.titleAnimation)
            )

        GameBoard ->
            ( "game-board"
            , S.g [ transform, SA.class "game-board" ]
                (viewGame options puzzle)
            )

        BestTimes ->
            ( "best-times"
            , S.g [ transform, SA.class "best-times" ]
                (viewTimes options.titleAnimation bestTimes)
            )

        HowToScreen ->
            ( "how-to"
            , S.g [ transform, SA.class "how-to" ]
                (viewHowTo options.titleAnimation)
            )



-- VIEW TITLE SCREEN


viewTitleScreen : Options.TitleAnimation -> List (Html Msg)
viewTitleScreen titleAnimation =
    let
        ( x, _ ) =
            Graphics.middle
    in
    [ Title.view titleAnimation Title.hexasperate
    , viewMenuOption "PLAY" ( x, 60 ) (ChangeScene DifficultyMenu)
    , viewMenuOption "BEST TIMES" ( x, 75 ) (ChangeScene BestTimes)
    , viewMenuOption "HOW TO PLAY" ( x, 90 ) (ChangeScene HowToScreen)
    , viewMenuOption "OPTIONS" ( x, 105 ) (ChangeScene OptionsScreen)
    , viewMenuOption "ABOUT" ( x, 120 ) (ChangeScene AboutScreen)
    ]



-- VIEW DIFFICULTY MENU


viewDifficultyMenu : Options.TitleAnimation -> Puzzle.Model -> List (Html Msg)
viewDifficultyMenu titleAnimation puzzle =
    let
        ( x, _ ) =
            Graphics.middle

        ( resumePreview, resumeText ) =
            case puzzle.paused of
                False ->
                    ( S.text "", S.text "" )

                True ->
                    ( Puzzle.resume puzzle.size
                    , viewMenuOption "RESUME" ( x, 77.5 ) ResumePuzzle
                    )
    in
    [ Title.view titleAnimation Title.play
    , Puzzle.preview Puzzle.Small
    , viewMenuOption "SMALL" ( x / 2, 57 ) (CreatePuzzle Puzzle.Small)
    , Puzzle.preview Puzzle.Medium
    , viewMenuOption "MEDIUM" ( x / 2, 98 ) (CreatePuzzle Puzzle.Medium)
    , resumePreview
    , resumeText
    , Puzzle.preview Puzzle.Large
    , viewMenuOption "LARGE" ( x * 3 / 2, 57 ) (CreatePuzzle Puzzle.Large)
    , Puzzle.preview Puzzle.Huge
    , viewMenuOption "HUGE" ( x * 3 / 2, 98 ) (CreatePuzzle Puzzle.Huge)
    , viewBackButton TitleScreen
    ]



-- VIEW OPTIONS MENU


viewOptions : Options.Model -> List (Html Msg)
viewOptions options =
    [ Title.view options.titleAnimation Title.options
    , H.map OptionMsg (Options.view options)
    , viewBackButton TitleScreen
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
    ]



-- VIEW ABOUT


viewAbout : Options.TitleAnimation -> List (Html Msg)
viewAbout titleAnimation =
    [ Title.view titleAnimation Title.about
    , viewText "Hexasperate is an edge-matching puzzle" ( 25.8, 50 )
    , viewText "game inspired by the classic game TetraVex" ( 25.8, 59.5 )
    , viewText "by Scott Ferguson, which first appeared" ( 25.8, 69 )
    , viewText "in Microsoft Entertainment Pack 3 in 1991." ( 25.8, 78.5 )
    , viewText "Hexasperate was created by Tom Smilack." ( 25.8, 93 )
    , viewMenuOption "FINE PRINT" ( 120, 110 ) (ChangeScene LicenseScreen)
    , viewBackButton TitleScreen
    ]


viewText : String -> Point -> Html Msg
viewText label ( x, y ) =
    S.text_
        [ SA.class "text left"
        , SA.x (String.fromFloat x)
        , SA.y (String.fromFloat y)
        ]
        [ S.text label ]



-- VIEW LICENSE


viewLicense : Options.TitleAnimation -> List (Html Msg)
viewLicense titleAnimation =
    [ Title.view titleAnimation Title.finePrint
    , viewFinePrint "Hexasperate Copyright © 2020 Tom Smilack." ( 40.3, 50 )
    , viewFinePrint "This program comes with ABSOLUTELY NO" ( 40.3, 58 )
    , viewFinePrint "WARRANTY. This is free software, and you" ( 40.3, 66 )
    , viewFinePrint "are welcome to redistribute it under certain" ( 40.3, 74 )
    , viewFinePrint "conditions. For more details see" ( 40.3, 82 )
    , S.a
        [ SA.xlinkHref "https://github.com/smilack/hexasperate/LICENSE.md" ]
        [ viewFinePrint "https://github.com/smilack/hexasperate/LICENSE.md" ( 40.3, 90 ) ]
    , viewFinePrint "The source code for Hexasperate is available at" ( 40.3, 102 )
    , S.a
        [ SA.xlinkHref "https://github.com/smilack/hexasperate" ]
        [ viewFinePrint "https://github.com/smilack/hexasperate" ( 40.3, 110 ) ]
    , viewBackButton AboutScreen
    ]


viewFinePrint : String -> Point -> Html Msg
viewFinePrint label ( x, y ) =
    S.text_
        [ SA.class "fine-print left"
        , SA.x (String.fromFloat x)
        , SA.y (String.fromFloat y)
        ]
        [ S.text label ]



-- VIEW TIMES


viewTimes : Options.TitleAnimation -> BestTimes -> List (Html Msg)
viewTimes titleAnimation bestTimes =
    [ Title.view titleAnimation Title.bestTimes
    , BestTimes.view bestTimes
    , viewBackButton TitleScreen
    ]



-- VIEW HOW TO


viewHowTo : Options.TitleAnimation -> List (Html Msg)
viewHowTo titleAnimation =
    let
        hex1 =
            Hex.create 1 (HexList Label.Four Label.Two Label.Seven Label.Four Label.Two Label.Seven)

        hex2 =
            Hex.create 2 (HexList Label.Four Label.Eight Label.Six Label.Seven Label.Six Label.One)

        hex3 =
            Hex.create 3 (HexList Label.Six Label.Two Label.One Label.Two Label.Eight Label.Five)
    in
    [ Title.view titleAnimation Title.howTo
    , viewFinePrint "The goal of the game is to place all of the" ( 3, 50 )
    , viewFinePrint "hexagonal tiles in the grid such that all of" ( 3, 58 )
    , viewFinePrint "the colors that are touching are matched." ( 3, 66 )
    , viewFinePrint "" ( 3, 69 )
    , S.rect
        [ SA.id "howto", SA.fill "transparent", SA.stroke "transparent", SA.x "0", SA.y "0", SA.width "240", SA.height "135" ]
        []
    , S.g
        [ SA.class "palette palette-material"
        , SA.transform (StrUtil.transform 220 65 0.67)
        ]
        [ S.path [ SA.class "grid-hex", SA.d "M 20 -34.6 L 10 -52 L -10 -52 L -20 -34.6 L -10 -17.3 L 10 -17.3 Z" ] []
        , S.path [ SA.class "grid-hex", SA.d "M 20 0 L 10 -17.3 L -10 -17.3 L -20 0 L -10 17.3 L 10 17.3 Z" ] []
        , S.path [ SA.class "grid-hex", SA.d "M -10 -17.3 L -20 -34.6 L -40 -34.6 L -50 -17.3 L -40 0 L -20 0 Z" ] []
        , S.g [ SA.transform (StrUtil.translate 0 -34.6) ] [ Hex.view hex1 ]
        , S.g [ SA.transform (StrUtil.translate -30 -17.3) ]
            [ S.animateTransform
                [ SA.attributeName "transform"
                , SA.attributeType "XML"
                , SA.type_ "translate"
                , SA.values "-75 -7.3 ; -75 -7.3 ; -30 -17.3 ; -30 -17.3"
                , SA.dur "5s"
                , SA.repeatCount "indefinite"
                , SA.keyTimes "0 ; 0.25 ; 0.5 ; 1"
                , SA.keySplines "0.5 0 0.5 1 ; 0.5 0 0.5 1 ; 0.5 0 0.5 1"
                , SA.calcMode "spline"
                , SA.begin "howto.mouseenter"
                ]
                []
            , Hex.view hex2
            ]
        , S.g [ SA.transform (StrUtil.translate 0 0) ] [ Hex.view hex3 ]
        ]
    , viewFinePrint "Left click and drag (any" ( 3, 83 )
    , viewFinePrint "hex) moves one hex." ( 3, 91 )
    , viewMouse ( 3, 112 ) LeftButton
    , S.g
        [ SA.class "palette palette-material"
        , SA.transform (StrUtil.transform 48 123 0.53)
        ]
        [ S.path [ SA.class "grid-hex", SA.d "M 20 -34.6 L 10 -52 L -10 -52 L -20 -34.6 L -10 -17.3 L 10 -17.3 Z" ] []
        , S.path [ SA.class "grid-hex", SA.d "M 20 0 L 10 -17.3 L -10 -17.3 L -20 0 L -10 17.3 L 10 17.3 Z" ] []
        , S.path [ SA.class "grid-hex", SA.d "M -10 -17.3 L -20 -34.6 L -40 -34.6 L -50 -17.3 L -40 0 L -20 0 Z" ] []
        , S.g [ SA.transform (StrUtil.translate 0 -34.6) ]
            [ S.animateTransform
                [ SA.attributeName "transform"
                , SA.attributeType "XML"
                , SA.type_ "translate"
                , SA.values "0 -34.6 ; 0 -34.6 ; 50 -34.6 ; 50 -34.6"
                , SA.dur "5s"
                , SA.repeatCount "indefinite"
                , SA.keyTimes "0 ; 0.25 ; 0.5 ; 1"
                , SA.keySplines "0.5 0 0.5 1 ; 0.5 0 0.5 1 ; 0.5 0 0.5 1"
                , SA.calcMode "spline"
                , SA.begin "howto.mouseenter"
                ]
                []
            , Hex.view hex1
            ]
        , S.g [ SA.transform (StrUtil.translate -30 -17.3) ] [ Hex.view hex2 ]
        , S.g [ SA.transform (StrUtil.translate 0 0) ] [ Hex.view hex3 ]
        ]
    , viewFinePrint "Right click and drag (hexes in the" ( 118, 83 )
    , viewFinePrint "grid) moves all connected hexes." ( 118, 91 )
    , viewMouse ( 145, 112 ) RightButton
    , S.g
        [ SA.class "palette palette-material"
        , SA.transform (StrUtil.transform 190 123 0.53)
        ]
        [ S.path [ SA.class "grid-hex", SA.d "M 20 -34.6 L 10 -52 L -10 -52 L -20 -34.6 L -10 -17.3 L 10 -17.3 Z" ] []
        , S.path [ SA.class "grid-hex", SA.d "M 20 0 L 10 -17.3 L -10 -17.3 L -20 0 L -10 17.3 L 10 17.3 Z" ] []
        , S.path [ SA.class "grid-hex", SA.d "M -10 -17.3 L -20 -34.6 L -40 -34.6 L -50 -17.3 L -40 0 L -20 0 Z" ] []
        , S.g [ SA.transform (StrUtil.translate 0 -34.6) ]
            [ S.animateTransform
                [ SA.attributeName "transform"
                , SA.attributeType "XML"
                , SA.type_ "translate"
                , SA.values "0 -34.6 ; 0 -34.6 ; 68 -34.6 ; 68 -34.6"
                , SA.dur "5s"
                , SA.repeatCount "indefinite"
                , SA.keyTimes "0 ; 0.25 ; 0.5 ; 1"
                , SA.keySplines "0.5 0 0.5 1 ; 0.5 0 0.5 1 ; 0.5 0 0.5 1"
                , SA.calcMode "spline"
                , SA.begin "howto.mouseenter"
                ]
                []
            , Hex.view hex1
            ]
        , S.g [ SA.transform (StrUtil.translate -30 -17.3) ]
            [ S.animateTransform
                [ SA.attributeName "transform"
                , SA.attributeType "XML"
                , SA.type_ "translate"
                , SA.values "-30 -17.3 ; -30 -17.3 ; 38 -17.3 ; 38 -17.3"
                , SA.dur "5s"
                , SA.repeatCount "indefinite"
                , SA.keyTimes "0 ; 0.25 ; 0.5 ; 1"
                , SA.keySplines "0.5 0 0.5 1 ; 0.5 0 0.5 1 ; 0.5 0 0.5 1"
                , SA.calcMode "spline"
                , SA.begin "howto.mouseenter"
                ]
                []
            , Hex.view hex2
            ]
        , S.g [ SA.transform (StrUtil.translate 0 0) ]
            [ S.animateTransform
                [ SA.attributeName "transform"
                , SA.attributeType "XML"
                , SA.type_ "translate"
                , SA.values "0 0 ; 0 0 ; 68 0 ; 68 0"
                , SA.dur "5s"
                , SA.repeatCount "indefinite"
                , SA.keyTimes "0 ; 0.25 ; 0.5 ; 1"
                , SA.keySplines "0.5 0 0.5 1 ; 0.5 0 0.5 1 ; 0.5 0 0.5 1"
                , SA.calcMode "spline"
                , SA.begin "howto.mouseenter"
                ]
                []
            , Hex.view hex3
            ]
        ]
    , viewBackButton TitleScreen
    ]


type HowToMouseButton
    = LeftButton
    | RightButton


viewMouse : Point -> HowToMouseButton -> Html Msg
viewMouse ( x, y ) button =
    let
        ( lmb, rmb ) =
            case button of
                LeftButton ->
                    ( "clicked", "" )

                RightButton ->
                    ( "", "clicked" )
    in
    S.g
        [ SA.class "mouse"
        , SA.transform (StrUtil.transform x y 0.5)
        ]
        [ S.path [ SA.class lmb, SA.d "m 0,0 c 0,-15 10,-18 15,-18 v 20 z" ] []
        , S.path [ SA.class rmb, SA.d "m 30,0 c 0,-15 -10,-18 -15,-18 v 20 z" ] []
        , S.path [ SA.d "m 0,0 c 0,20 5,25 15,25 c 10,0 15,-5 15,-25 z" ] []
        , S.ellipse [ SA.cx "15", SA.cy "-9", SA.rx "2.5", SA.ry "5" ] []
        ]



-- VIEW UTILS


viewBackButton : Scene -> Html Msg
viewBackButton scene =
    S.text_
        [ SA.class "back"
        , SA.x (String.fromFloat (Tuple.first Graphics.middle))
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
