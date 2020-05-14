module Main exposing (main)

import Animator
import Array exposing (Array)
import Browser
import Browser.Dom
import Browser.Events
import Graphics exposing (BoundingBox, Point)
import Hex exposing (Hex)
import Html as H exposing (Html)
import Html.Attributes as A
import Html.Events as E
import Html.Events.Extra.Mouse as ME
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
    , backgroundAnimation : AnimationState
    , titleAnimation : AnimationState
    , labelState : OnOffState
    , palette : Palette.Option
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


type AnimationState
    = Running
    | Paused


type OnOffState
    = On
    | Off


type alias OptionValues v =
    ( List v, v -> String )


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
    , mousePos = Point 0 0
    , scene = TitleScreen
    , viewBox = Animator.init (getSceneCamera TitleScreen)
    , backgroundAnimation = Running
    , titleAnimation = Running
    , labelState = On
    , palette = Palette.Material
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
    | MouseMove ( Float, Float )
    | Tick Time.Posix
    | ChangeScene Scene
    | SetBackgroundAnimation AnimationState
    | SetTitleAnimation AnimationState
    | SetLabelState OnOffState
    | SetPalette Palette.Option


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

        SetBackgroundAnimation state ->
            ( { model | backgroundAnimation = state }
            , Cmd.none
            )

        SetTitleAnimation state ->
            ( { model | titleAnimation = state }
            , Cmd.none
            )

        SetLabelState state ->
            ( { model | labelState = state }
            , Cmd.none
            )

        SetPalette state ->
            ( { model | palette = state }
            , Cmd.none
            )



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
         , viewBackground model.backgroundAnimation
         , S.circle [ SA.cx (String.fromFloat model.mousePos.x), SA.cy (String.fromFloat model.mousePos.y), SA.r "0.6", SA.stroke "black", SA.fill "white", SA.strokeWidth "0.4" ] []
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


viewBackground : AnimationState -> Html Msg
viewBackground state =
    let
        ( x, y ) =
            ( -2.4 * Graphics.screen.w, -2.4 * Graphics.screen.h )

        ( w, h ) =
            ( 7.2 * Graphics.screen.w, 7.2 * Graphics.screen.h )

        animClass =
            case state of
                Running ->
                    SA.class ""

                Paused ->
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
                , SA.stroke "#29b6f6"

                --, SA.stroke "rgba(41, 182, 246, 0.5)"
                , SA.fill "transparent"
                ]
                []
            , S.path
                [ SA.d "M 4 0 L 2 -3.5 L -2 -3.5 L -4 0 L -2 3.5 L 2 3.5 Z"
                , SA.strokeWidth "0.2"
                , SA.stroke "#29b6f6"

                --, SA.stroke "rgba(41, 182, 246, 0.5)"
                , SA.fill "transparent"
                ]
                []
            , S.path
                [ SA.d "M 4 0 L 8 0"
                , SA.strokeWidth "0.15"
                , SA.stroke "#29b6f6"

                --, SA.stroke "rgba(41, 182, 246, 0.5)"
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
                [ SA.offset "90%"
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
        (viewTitleScreen model)
    , S.g
        [ SA.transform (translate diffCam.x diffCam.y) ]
        (viewDifficultyMenu model)
    , S.g
        [ SA.transform (translate optsCam.x optsCam.y) ]
        (viewOptions model)
    , S.g
        [ SA.transform (translate aboutCam.x aboutCam.y) ]
        (viewAbout model)
    , game
    ]



-- VIEW TITLE SCREEN


viewTitleScreen : Model -> List (Html Msg)
viewTitleScreen model =
    [ viewTitle model.titleAnimation Title.hexasperate
    , viewMenuOption "PLAY" (Point Graphics.middle.x 67) (ChangeScene DifficultyMenu)
    , viewMenuOption "OPTIONS" (Point Graphics.middle.x 85) (ChangeScene OptionsScreen)
    , viewMenuOption "ABOUT" (Point Graphics.middle.x 103) (ChangeScene AboutScreen)
    , viewLabel "Copyright 2018-2020 Tom Smilack" (Point Graphics.middle.x 125) Center
    ]


viewTitle : AnimationState -> Title -> Html Msg
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


viewTitleLetter : AnimationState -> String -> ( String, String ) -> Int -> Html Msg
viewTitleLetter state animValues ( letter, xPos ) index =
    let
        animate =
            case state of
                Running ->
                    S.animate
                        [ SA.dur "3s"
                        , SA.repeatCount "indefinite"
                        , SA.begin (String.fromFloat (toFloat index / 10) ++ "s")
                        , SA.attributeName "y"
                        , SA.values animValues
                        ]
                        []

                Paused ->
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


viewDifficultyMenu : Model -> List (Html Msg)
viewDifficultyMenu model =
    [ viewTitle model.titleAnimation Title.play
    , viewMenuOption "SMALL" (Point Graphics.middle.x 67) (ChangeScene (GameBoard Small))
    , viewMenuOption "MEDIUM" (Point Graphics.middle.x 85) (ChangeScene (GameBoard Medium))
    , viewMenuOption "LARGE" (Point Graphics.middle.x 103) (ChangeScene (GameBoard Large))
    , viewBackButton TitleScreen
    ]



-- VIEW OPTIONS MENU


animationStateToString : AnimationState -> String
animationStateToString state =
    case state of
        Paused ->
            "Stopped"

        Running ->
            "Animated"


onOffStateToString : OnOffState -> String
onOffStateToString state =
    case state of
        On ->
            "On"

        Off ->
            "Off"


viewOptions : Model -> List (Html Msg)
viewOptions model =
    let
        animValues : OptionValues AnimationState
        animValues =
            ( [ Paused, Running ], animationStateToString )

        onOffValues : OptionValues OnOffState
        onOffValues =
            ( [ On, Off ], onOffStateToString )
    in
    [ viewTitle model.titleAnimation Title.options
    , viewOption "Background" 55 animValues model.backgroundAnimation SetBackgroundAnimation
    , viewOption "Titles" 70 animValues model.titleAnimation SetTitleAnimation
    , viewOption "Colors" 85 Palette.options model.palette SetPalette
    , viewPalette (Point 172 76.9) (Palette.get model.palette)
    , viewOption "Labels" 100 onOffValues model.labelState SetLabelState
    , viewBackButton TitleScreen
    ]


viewOption : String -> Float -> OptionValues v -> v -> (v -> Msg) -> Html Msg
viewOption label y ( values, toStr ) current msg =
    S.g
        [ SA.transform (translate 50 y) ]
        [ viewText label (Point 0 0) Left
        , viewOptionValue (toStr current) (msg (nextOption current values))
        ]


viewOptionValue : String -> Msg -> Html Msg
viewOptionValue label msg =
    S.text_
        [ SA.class "option"
        , alignToClass Left
        , SA.x "70"
        , SA.y "0"
        , E.onClick msg
        ]
        [ S.text label ]


nextOption : v -> List v -> v
nextOption current list =
    let
        next cur def rest =
            case rest of
                [] ->
                    def

                val :: [] ->
                    def

                val1 :: val2 :: vals ->
                    if cur == val1 then
                        val2

                    else
                        next cur def (val2 :: vals)
    in
    case list of
        [] ->
            current

        default :: vals ->
            next current default list



-- VIEW GAME


viewGame : Model -> Difficulty -> List (Html Msg)
viewGame model difficulty =
    [ viewBackButton DifficultyMenu
    ]



-- VIEW ABOUT


viewAbout : Model -> List (Html Msg)
viewAbout model =
    [ viewTitle model.titleAnimation Title.about
    , viewText "Hexasperate is an edge-matching" (Point Graphics.middle.x 70) Left
    , viewText "puzzle game inspired by the classic" (Point Graphics.middle.x 80) Left
    , viewText "game TetraVex by Scott Ferguson" (Point Graphics.middle.x 90) Left
    , viewBackButton TitleScreen
    ]



-- VIEW UTILS


viewBackButton : Scene -> Html Msg
viewBackButton scene =
    S.text_
        [ SA.class "back"
        , SA.x "23"
        , SA.y "125"
        , E.onClick (ChangeScene scene)
        ]
        [ S.text "BACK" ]


viewMenuOption : String -> Point -> Msg -> Html Msg
viewMenuOption label center action =
    S.text_
        [ SA.class "menu-option"
        , SA.x (String.fromFloat center.x)
        , SA.y (String.fromFloat center.y)
        , E.onClick action
        ]
        [ S.text label ]


viewText : String -> Point -> Align -> Html Msg
viewText label { x, y } align =
    S.text_
        [ SA.class "text"
        , alignToClass align
        , SA.x (String.fromFloat x)
        , SA.y (String.fromFloat y)
        ]
        [ S.text label ]


viewMenuHighlight : Animator.Timeline BoundingBox -> Html Msg
viewMenuHighlight tbb =
    let
        x =
            Animator.move tbb (.x >> Animator.at)

        y =
            Animator.move tbb (.y >> Animator.at)

        w =
            Animator.move tbb (.w >> Animator.at)

        h =
            Animator.move tbb (.h >> Animator.at)
    in
    S.rect
        [ SA.x (String.fromFloat x)
        , SA.y (String.fromFloat y)
        , SA.width (String.fromFloat w)
        , SA.height (String.fromFloat h)
        , SA.fill "rgba(128, 128, 255, 0.5)"
        , SA.stroke "transparent"
        ]
        []


viewLabel : String -> Point -> Align -> Html Msg
viewLabel str { x, y } align =
    S.text_
        [ SA.class "label"
        , alignToClass align
        , SA.x (String.fromFloat x)
        , SA.y (String.fromFloat y)
        ]
        [ S.text str ]


viewHex : Hex -> Html Msg
viewHex h =
    S.path
        ([ SA.d (Hex.toPath h)
         , SA.strokeWidth "0.5"
         ]
            ++ Hex.attributes h
        )
        []


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


viewPalette : Point -> Palette -> Html Msg
viewPalette { x, y } palette =
    S.g
        [ SA.transform (translate x y) ]
        (List.indexedMap viewColor (Palette.colors palette))


viewColor : Int -> String -> Html Msg
viewColor i color =
    let
        w =
            7

        x =
            modBy (5 * w) (w * i)

        y =
            w * (i // 5)
    in
    S.rect
        [ SA.x (String.fromInt x)
        , SA.y (String.fromInt y)
        , SA.width (String.fromInt w)
        , SA.height (String.fromInt w)
        , SA.fill color
        ]
        []
