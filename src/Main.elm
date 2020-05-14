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
import Options
import Palette exposing (Palette)
import SixList exposing (SixList)
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
    , options : GameOptions
    }


type alias GameOptions =
    { backgroundAnimation : BackgroundAnimation
    , titleAnimation : TitleAnimation
    , labelState : LabelState
    , palette : Palette.Option
    }


type alias BackgroundAnimation =
    Options.OnOff


type alias TitleAnimation =
    Options.OnOff


type alias LabelState =
    Options.OnOff


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
    , mousePos = Point 0 0
    , scene = GameBoard Small
    , viewBox = Animator.init (getSceneCamera (GameBoard Small))
    , options =
        { backgroundAnimation = Options.On
        , titleAnimation = Options.On
        , labelState = Options.On
        , palette = Palette.Material
        }
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
    | ChangeOption OptionMsg


type OptionMsg
    = SetBackgroundAnimation BackgroundAnimation
    | SetTitleAnimation TitleAnimation
    | SetLabelState LabelState
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

        ChangeOption optionMsg ->
            ( { model | options = updateOption optionMsg model.options }
            , Cmd.none
            )


updateOption : OptionMsg -> GameOptions -> GameOptions
updateOption msg options =
    case msg of
        SetBackgroundAnimation state ->
            { options | backgroundAnimation = state }

        SetTitleAnimation state ->
            { options | titleAnimation = state }

        SetLabelState state ->
            { options | labelState = state }

        SetPalette state ->
            { options | palette = state }



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


viewBackground : BackgroundAnimation -> Html Msg
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


viewTitleScreen : TitleAnimation -> List (Html Msg)
viewTitleScreen titleAnimation =
    [ viewTitle titleAnimation Title.hexasperate
    , viewMenuOption "PLAY" (Point Graphics.middle.x 67) (ChangeScene DifficultyMenu)
    , viewMenuOption "OPTIONS" (Point Graphics.middle.x 85) (ChangeScene OptionsScreen)
    , viewMenuOption "ABOUT" (Point Graphics.middle.x 103) (ChangeScene AboutScreen)
    ]


viewTitle : TitleAnimation -> Title -> Html Msg
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


viewTitleLetter : TitleAnimation -> String -> ( String, String ) -> Int -> Html Msg
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


viewDifficultyMenu : TitleAnimation -> List (Html Msg)
viewDifficultyMenu titleAnimation =
    [ viewTitle titleAnimation Title.play
    , viewMenuOption "SMALL" (Point Graphics.middle.x 67) (ChangeScene (GameBoard Small))
    , viewMenuOption "MEDIUM" (Point Graphics.middle.x 85) (ChangeScene (GameBoard Medium))
    , viewMenuOption "LARGE" (Point Graphics.middle.x 103) (ChangeScene (GameBoard Large))
    , viewBackButton TitleScreen
    ]



-- VIEW OPTIONS MENU


viewOptions : GameOptions -> List (Html Msg)
viewOptions options =
    [ viewTitle options.titleAnimation Title.options
    , viewOption "Background" 55 Options.animationStates options.backgroundAnimation SetBackgroundAnimation
    , viewOption "Titles" 70 Options.animationStates options.titleAnimation SetTitleAnimation
    , viewOption "Colors" 85 Palette.options options.palette SetPalette
    , viewPalette (Point 172 76.9) (Palette.get options.palette)
    , viewOption "Labels" 100 Options.onOffStates options.labelState SetLabelState
    , viewLabels (Point 189.5 100) options.labelState
    , viewHardMode options.palette options.labelState
    , viewBackButton TitleScreen
    ]


viewOption : String -> Float -> Options.OptionValues v -> v -> (v -> OptionMsg) -> Html Msg
viewOption label y ( values, toStr ) current msg =
    S.g
        [ SA.transform (translate 50 y) ]
        [ viewText label (Point 0 0) Left
        , viewOptionValue (toStr current) (msg (nextOption current values))
        ]


viewOptionValue : String -> OptionMsg -> Html Msg
viewOptionValue label msg =
    S.text_
        [ SA.class "option"
        , alignToClass Left
        , SA.x "70"
        , SA.y "0"
        , E.onClick (ChangeOption msg)
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
    let
        palette =
            Palette.get model.options.palette

        hex =
            Hex.create 20
                (SixList Palette.One Palette.Two Palette.Three Palette.Four Palette.Five Palette.Six)
    in
    [ viewBackButton DifficultyMenu
    , Hex.view palette model.options.labelState Graphics.middle hex
    ]



-- VIEW ABOUT


viewAbout : TitleAnimation -> List (Html Msg)
viewAbout titleAnimation =
    [ viewTitle titleAnimation Title.about
    , viewText "Hexasperate is an edge-matching puzzle" (Point 25.8 55) Left
    , viewText "game inspired by the classic game TetraVex" (Point 25.8 65) Left
    , viewText "by Scott Ferguson, which first appeared" (Point 25.8 75) Left
    , viewText "in Microsoft Entertainment Pack 3 in 1991." (Point 25.8 85) Left
    , viewText "Hexasperate was created by Tom Smilack." (Point 25.8 105) Left
    , viewBackButton TitleScreen
    ]



-- VIEW UTILS


viewBackButton : Scene -> Html Msg
viewBackButton scene =
    S.text_
        [ SA.class "back"
        , SA.x (String.fromFloat Graphics.middle.x)
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


viewColor : Int -> Palette.Color -> Html Msg
viewColor i color =
    let
        w =
            7.1

        x =
            modBy (5 * round w) (round w * i)

        y =
            round w * (i // 5)
    in
    S.rect
        [ SA.x (String.fromInt x)
        , SA.y (String.fromInt y)
        , SA.width (String.fromFloat w)
        , SA.height (String.fromFloat w)
        , SA.fill color
        ]
        []


viewLabels : Point -> LabelState -> Html Msg
viewLabels point state =
    case state of
        Options.On ->
            viewLabel "0123456789" point Center

        Options.Off ->
            S.text ""


viewHardMode : Palette.Option -> LabelState -> Html Msg
viewHardMode palette onoff =
    let
        hardMode =
            S.text_
                [ SA.x (String.fromFloat Graphics.middle.x)
                , SA.y "112"
                , SA.class "text hard-mode"
                ]
                [ S.text "Hard mode unlocked!" ]
    in
    case ( palette, onoff ) of
        ( Palette.AllSame, Options.Off ) ->
            hardMode

        ( Palette.Transparent, Options.Off ) ->
            hardMode

        ( _, _ ) ->
            S.text ""
