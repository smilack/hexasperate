module Main exposing (main)

import Animator
import Array exposing (Array)
import Browser
import Browser.Dom
import Browser.Events
import Graphics exposing (BoundingBox, Point)
import Hex exposing (Hex)
import HexList exposing (HexList)
import Html as H exposing (Html)
import Html.Attributes as A
import Html.Events as E
import Html.Events.Extra.Mouse as ME
import Label exposing (Label)
import Options
import Palette exposing (Palette)
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
    }


type Difficulty
    = Small
    | Medium
    | Large
    | Custom Int


type Scene
    = TitleScreen
    | DifficultyMenu
    | OptionsScreen
    | GameBoard Difficulty
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

        GameBoard _ ->
            { screen | x = 2.4 * screen.w }

        AboutScreen ->
            { screen | y = 1.2 * screen.h }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, getSvgDimensions )


initialModel : Model
initialModel =
    { svgDimensions = BoundingBox 0 0 0 0
    , mousePos = ( 0, 0 )
    , scene = GameBoard Small
    , viewBox = Animator.init (getSceneCamera (GameBoard Small))
    , options = Options.init
    }


animator : Animator.Animator Model
animator =
    Animator.animator
        |> Animator.watching
            .viewBox
            (\new model -> { model | viewBox = new })


getSvgDimensions : Cmd Msg
getSvgDimensions =
    Task.attempt GotSvgElement (Browser.Dom.getElement "screen")


type Msg
    = WindowResize Int Int
    | GotSvgElement (Result Browser.Dom.Error Browser.Dom.Element)
    | MouseMove Point
    | Tick Time.Posix
    | ChangeScene Scene
    | ChangeOption Options.Msg
    | StartDraggingHex Hex Point
    | StopDraggingHex


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

        MouseMove pagePos ->
            let
                point =
                    Graphics.scale pagePos model.svgDimensions (getSceneCamera model.scene)
            in
            ( { model | mousePos = point }
            , Cmd.none
            )

        Tick newTime ->
            ( model |> Animator.update newTime animator
            , Cmd.none
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

        StartDraggingHex hex point ->
            ( model, Cmd.none )

        StopDraggingHex ->
            ( model, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    S.svg
        [ SA.viewBox (getViewBox model.viewBox)
        , SA.id "screen"
        , SA.preserveAspectRatio "xMidYMid meet"
        , ME.onMove (.pagePos >> MouseMove)
        ]
        ([ viewDefs
         , viewBackground model.options.backgroundAnimation

         --, S.circle [ SA.cx (String.fromFloat model.mousePos.x), SA.cy (String.fromFloat model.mousePos.y), SA.r "0.6", SA.stroke "black", SA.fill "white", SA.strokeWidth "0.4" ] []
         ]
            ++ viewScene model
        )


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

        game =
            case model.scene of
                GameBoard difficulty ->
                    let
                        gameCam =
                            getSceneCamera model.scene
                    in
                    S.g
                        [ SA.transform (translate gameCam.x gameCam.y) ]
                        (viewGame model difficulty)

                _ ->
                    S.text ""
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
    , game
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
    , viewMenuOption "SMALL" ( x, 67 ) (ChangeScene (GameBoard Small))
    , viewMenuOption "MEDIUM" ( x, 85 ) (ChangeScene (GameBoard Medium))
    , viewMenuOption "LARGE" ( x, 103 ) (ChangeScene (GameBoard Large))
    , viewBackButton TitleScreen
    ]



-- VIEW OPTIONS MENU


viewOptions : Options.Model -> List (Html Msg)
viewOptions options =
    [ viewTitle options.titleAnimation Title.options
    , Options.view ChangeOption options
    , viewBackButton TitleScreen
    ]



-- VIEW GAME


viewGame : Model -> Difficulty -> List (Html Msg)
viewGame model difficulty =
    let
        palette =
            Palette.get model.options.palette

        hex1 =
            Hex.create 1
                (HexList Label.Zero Label.One Label.Two Label.Three Label.Four Label.Five)

        hex2 =
            Hex.create 1
                (HexList Label.One Label.Two Label.Three Label.Four Label.Five Label.Six)

        hex3 =
            Hex.create 1
                (HexList Label.Five Label.Six Label.Seven Label.Eight Label.Nine Label.Zero)

        hex4 =
            Hex.create 1
                (HexList Label.Seven Label.Eight Label.Nine Label.Zero Label.One Label.Two)
    in
    [ viewBackButton DifficultyMenu
    , Hex.view palette model.options.labelState ( 80, 30 ) StartDraggingHex StopDraggingHex hex1
    , Hex.view palette model.options.labelState ( 160, 30 ) StartDraggingHex StopDraggingHex hex2
    , Hex.view palette model.options.labelState ( 80, 90 ) StartDraggingHex StopDraggingHex hex3
    , Hex.view palette model.options.labelState ( 160, 90 ) StartDraggingHex StopDraggingHex hex4
    ]



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
