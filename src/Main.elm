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
import Html.Events.Extra.Mouse as ME
import Html.Events.Extra.Pointer as PE
import Html.Events.Extra.Touch as TE
import Html.Lazy as L
import Json.Decode
import Label
import Options
import Palette
import Puzzle
import StrUtil
import Svg as S
import Svg.Attributes as SA
import Svg.Keyed as SK
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
    , scene : Animator.Timeline Scene
    , options : Options.Model
    , puzzle : Puzzle.Model
    , bestTimes : BestTimes
    , version : String
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


init : String -> ( Model, Cmd Msg )
init version =
    ( initialModel version
    , getSvgDimensions
    )


initialModel : String -> Model
initialModel version =
    { svgDimensions = BoundingBox 0 0 0 0
    , mousePos = ( 0, 0 )
    , scene = Animator.init initialScene
    , options = Options.init
    , puzzle = Puzzle.init
    , bestTimes = BestTimes.init
    , version = version
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
                    ( model, Cmd.none )

                Ok { element } ->
                    ( { model | svgDimensions = BoundingBox element.x element.y element.width element.height }
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
        , TE.onMove (getTouchCoord >> MouseMove)
        , TE.onEnd (always (PuzzleMsg Puzzle.StopDraggingHex))
        ]
        [ viewDefs
        , L.lazy3 viewBackground options.backgroundAnimation options.backgroundPattern options.backgroundColor

        --, viewSafeScreenArea (getSceneCamera (Animator.current model.scene))
        --, viewMousePosition model.mousePos
        , viewGameContent model
        ]


getTouchCoord : TE.Event -> Point
getTouchCoord event =
    Maybe.withDefault Graphics.middle
        (Maybe.map .pagePos
            (List.head event.changedTouches)
        )


viewSafeScreenArea : BoundingBox -> Html Msg
viewSafeScreenArea { x, y, w, h } =
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


viewMousePosition : Point -> Html Msg
viewMousePosition ( x, y ) =
    S.circle
        [ SA.cx (String.fromFloat x)
        , SA.cy (String.fromFloat y)
        , SA.r "0.6"
        , SA.stroke "black"
        , SA.fill "white"
        , SA.strokeWidth "0.4"
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
                    "url(#bggradient)"

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
viewScene { options, puzzle, bestTimes, version } scene =
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
                (viewAbout options.titleAnimation version)
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
    , viewMenuOption "SMALL" ( 60, 45 ) (CreatePuzzle Puzzle.Small)
    , Puzzle.preview Puzzle.Medium
    , viewMenuOption "MEDIUM" ( 40, 77.5 ) (CreatePuzzle Puzzle.Medium)
    , resumePreview
    , resumeText
    , Puzzle.preview Puzzle.Large
    , viewMenuOption "LARGE" ( 60, 110.5 ) (CreatePuzzle Puzzle.Large)
    , Puzzle.preview Puzzle.Huge
    , viewMenuOption "HUGE" ( 180, 110.5 ) (CreatePuzzle Puzzle.Huge)
    , Puzzle.preview Puzzle.Double
    , viewMenuOption "DOUBLE" ( 180, 45 ) (CreatePuzzle Puzzle.Double)
    , Puzzle.preview Puzzle.Triple
    , viewMenuOption "TRIPLE" ( 200, 77.5 ) (CreatePuzzle Puzzle.Triple)
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


viewAbout : Options.TitleAnimation -> String -> List (Html Msg)
viewAbout titleAnimation version =
    [ Title.view titleAnimation Title.about
    , viewVersion version
    , viewText "Hexasperate is an edge-matching puzzle" ( 25.8, 50 )
    , viewText "game inspired by the classic game TetraVex" ( 25.8, 59.5 )
    , viewText "by Scott Ferguson, which first appeared" ( 25.8, 69 )
    , viewText "in Microsoft Entertainment Pack 3 in 1991." ( 25.8, 78.5 )
    , viewText "Hexasperate was created by Tom Smilack." ( 25.8, 93 )
    , viewMenuOption "FINE PRINT" ( 120, 110 ) (ChangeScene LicenseScreen)
    , viewBackButton TitleScreen
    ]


viewVersion : String -> Html Msg
viewVersion version =
    if String.isEmpty version then
        H.text ""

    else
        viewText ("VERSION " ++ version) ( 0.5, 5 )


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
        [ SA.xlinkHref "https://github.com/smilack/hexasperate/blob/master/LICENSE.md" ]
        [ viewFinePrint "github.com/smilack/hexasperate/blob/master/LICENSE.md" ( 12.2, 90 ) ]
    , viewFinePrint "The source code for Hexasperate can be" ( 40.3, 102 )
    , viewFinePrint "found at" ( 40.3, 110 )
    , S.a
        [ SA.xlinkHref "https://github.com/smilack/hexasperate" ]
        [ viewFinePrint "github.com/smilack/hexasperate" ( 72.3, 110 ) ]
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
    [ Title.view titleAnimation Title.howTo
    , viewFinePrint "The goal is to place all the hexagonal tiles in the grid" ( 2, 50 )
    , viewFinePrint "so that all colors that are touching are matched." ( 2, 58 )
    , viewFinePrint "" ( 2, 66 )
    , viewHowToGrid 0.5
        ( 225, 67 )
        ( Displacement 0 0 0 0, Displacement -45 10 0 0, Displacement 0 0 0 0 )
    , viewFinePrint "Left click and drag a hex to move it." ( 2, 73 )
    , viewMouse ( 6, 104 ) LeftButton
    , viewHowToGrid 0.5
        ( 48, 113 )
        ( Displacement 0 0 50 0, Displacement 0 0 0 0, Displacement 0 0 0 0 )
    , viewFinePrint "Right click and drag a hex to move all connected hexes." ( 2, 81 )
    , viewMouse ( 152, 104 ) RightButton
    , viewHowToGrid 0.5
        ( 193, 113 )
        ( Displacement 0 0 68 0, Displacement 0 0 68 0, Displacement 0 0 68 0 )
    , viewBackButton TitleScreen
    ]


viewHowToGrid : Float -> Point -> ( Displacement, Displacement, Displacement ) -> Html Msg
viewHowToGrid zoom ( x, y ) animations =
    let
        ( hex1, hex2, hex3 ) =
            howToHexes

        ( displacement1, displacement2, displacement3 ) =
            animations
    in
    S.g
        [ SA.class "palette palette-material"
        , SA.transform (StrUtil.transform x y zoom)
        ]
        [ S.path [ SA.class "grid-hex", SA.d "M 20 -34.6 L 10 -52 L -10 -52 L -20 -34.6 L -10 -17.3 L 10 -17.3 Z" ] []
        , S.path [ SA.class "grid-hex", SA.d "M 20 0 L 10 -17.3 L -10 -17.3 L -20 0 L -10 17.3 L 10 17.3 Z" ] []
        , S.path [ SA.class "grid-hex", SA.d "M -10 -17.3 L -20 -34.6 L -40 -34.6 L -50 -17.3 L -40 0 L -20 0 Z" ] []
        , S.g [ SA.transform (StrUtil.translate 0 -34.6) ]
            [ howToAnimation ( 0, -34.6 ) displacement1
            , Hex.view hex1
            ]
        , S.g [ SA.transform (StrUtil.translate -30 -17.3) ]
            [ howToAnimation ( -30, -17.3 ) displacement2
            , Hex.view hex2
            ]
        , S.g [ SA.transform (StrUtil.translate 0 0) ]
            [ howToAnimation ( 0, 0 ) displacement3
            , Hex.view hex3
            ]
        ]


type alias Displacement =
    { dx1 : Float
    , dy1 : Float
    , dx2 : Float
    , dy2 : Float
    }


howToAnimation : Point -> Displacement -> Html Msg
howToAnimation ( x, y ) { dx1, dy1, dx2, dy2 } =
    let
        start =
            StrUtil.spaceDelimit2 (x + dx1) (y + dy1)

        end =
            StrUtil.spaceDelimit2 (x + dx2) (y + dy2)

        values =
            String.join " ; " [ start, start, end, end ]
    in
    S.animateTransform
        [ SA.attributeName "transform"
        , SA.attributeType "XML"
        , SA.type_ "translate"
        , SA.values values
        , SA.dur "5s"
        , SA.repeatCount "indefinite"
        , SA.keyTimes "0 ; 0.25 ; 0.5 ; 1"
        , SA.keySplines "0.5 0 0.5 1 ; 0.5 0 0.5 1 ; 0.5 0 0.5 1"
        , SA.calcMode "spline"
        ]
        []


howToHexes : ( Hex, Hex, Hex )
howToHexes =
    ( Hex.create 1 (HexList Label.Four Label.Two Label.Seven Label.Four Label.Two Label.Seven)
    , Hex.create 2 (HexList Label.Four Label.Eight Label.Six Label.Seven Label.Six Label.One)
    , Hex.create 3 (HexList Label.Six Label.Two Label.One Label.Two Label.Eight Label.Five)
    )


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
        , SA.transform (StrUtil.transform x y 0.45)
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
        , PE.onDown (always (ChangeScene scene))
        ]
        [ S.text "BACK" ]


viewMenuOption : String -> Point -> Msg -> Html Msg
viewMenuOption label ( x, y ) action =
    S.text_
        [ SA.class "menu-option"
        , SA.x (String.fromFloat x)
        , SA.y (String.fromFloat y)
        , PE.onDown (always action)
        ]
        [ S.text label ]
