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
import Svg as S
import Svg.Attributes as SA
import Task
import Time


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
    , menuHighlight : Animator.Timeline BoundingBox
    }


type Scene
    = TitleScreen
    | DifficultyMenu
    | OptionsScreen
    | GameBoard
    | AboutScreen


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, getSvgDimensions )


initialModel : Model
initialModel =
    { svgDimensions = BoundingBox 0 0 0 0
    , mousePos = Point 0 0
    , scene = TitleScreen
    , menuHighlight = Animator.init (BoundingBox 0 0 0 0)
    }


animator : Animator.Animator Model
animator =
    Animator.animator
        |> Animator.watching
            .menuHighlight
            (\new model -> { model | menuHighlight = new })


getSvgDimensions : Cmd Msg
getSvgDimensions =
    Task.attempt GotSvgElement (Browser.Dom.getElement "screen")


type Msg
    = WindowResize Int Int
    | GotSvgElement (Result Browser.Dom.Error Browser.Dom.Element)
    | MouseMove ( Float, Float )
    | Tick Time.Posix
    | ChangeScene Scene
    | HoverMenuOption BoundingBox BoundingBox
    | UnhoverMenuOption BoundingBox


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
                    Graphics.scale pagePos model.svgDimensions
            in
            ( { model | mousePos = point }
            , Cmd.none
            )

        Tick newTime ->
            ( model |> Animator.update newTime animator
            , Cmd.none
            )

        ChangeScene newScene ->
            ( { model | scene = newScene }
            , Cmd.none
            )

        HoverMenuOption start end ->
            ( { model
                | menuHighlight =
                    Animator.init start
                        |> Animator.go Animator.slowly end
              }
            , Cmd.none
            )

        UnhoverMenuOption menuBox ->
            ( { model
                | menuHighlight =
                    model.menuHighlight
                        |> Animator.go Animator.slowly menuBox
              }
            , Cmd.none
            )



-- VIEW


view : Model -> Html Msg
view model =
    S.svg
        [ SA.viewBox getViewBox
        , SA.id "screen"
        , SA.preserveAspectRatio "xMidYMid meet"
        , ME.onMove (.pagePos >> MouseMove)
        ]
        ([ viewDefs
         , viewBackground
         , viewScreenTint
         ]
            ++ viewScene model
        )


getViewBox : String
getViewBox =
    String.join " "
        (List.map String.fromFloat
            [ Graphics.screen.x, Graphics.screen.y, Graphics.screen.w, Graphics.screen.h ]
        )


viewBackground : Html Msg
viewBackground =
    let
        ( x, y ) =
            ( -Graphics.screen.w, -Graphics.screen.h )

        ( w, h ) =
            ( 3 * Graphics.screen.w, 3 * Graphics.screen.h )
    in
    S.rect
        [ SA.fill "url(#bgpattern)"
        , SA.class "bgpattern"
        , SA.x (String.fromFloat x)
        , SA.y (String.fromFloat y)
        , SA.width (String.fromFloat w)
        , SA.height (String.fromFloat h)
        ]
        []


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
            [ S.rect
                [ SA.x "-6"
                , SA.y "-10"
                , SA.width "12.5"
                , SA.height "20"
                , SA.fill "#03a9f4"
                ]
                []
            , S.path
                [ SA.d "M -4 0 L -8 0"
                , SA.strokeWidth "0.15"
                , SA.stroke "white"
                , SA.fill "transparent"
                ]
                []
            , S.path
                [ SA.d "M 4 0 L 2 -3.5 L -2 -3.5 L -4 0 L -2 3.5 L 2 3.5 Z"
                , SA.strokeWidth "0.2"
                , SA.stroke "white"
                , SA.fill "transparent"
                ]
                []
            , S.path
                [ SA.d "M 4 0 L 8 0"
                , SA.strokeWidth "0.15"
                , SA.stroke "white"
                , SA.fill "transparent"
                ]
                []
            ]
        ]


viewScreenTint : Html Msg
viewScreenTint =
    S.rect
        [ SA.fill "rgba(255, 255, 255, 0.75)"
        , SA.x "5"
        , SA.y "5"
        , SA.width (String.fromFloat (Graphics.screen.w - 10))
        , SA.height (String.fromFloat (Graphics.screen.h - 10))
        ]
        []


viewScene : Model -> List (Html Msg)
viewScene model =
    case model.scene of
        TitleScreen ->
            viewTitleScreen model

        DifficultyMenu ->
            viewDifficultyMenu model

        OptionsScreen ->
            viewOptions model

        GameBoard ->
            viewGame model

        AboutScreen ->
            viewAbout model



-- VIEW TITLE SCREEN


viewTitleScreen : Model -> List (Html Msg)
viewTitleScreen model =
    [ viewTitle
    , viewMenuOption "PLAY" (Point Graphics.middle.x 67) (ChangeScene DifficultyMenu)
    , viewMenuOption "OPTIONS" (Point Graphics.middle.x 85) (ChangeScene OptionsScreen)
    , viewMenuOption "ABOUT" (Point Graphics.middle.x 103) (ChangeScene AboutScreen)
    , viewLabel "Copyright 2018-2020 Tom Smilack" (Point Graphics.middle.x 126)
    ]


viewTitle : Html Msg
viewTitle =
    let
        values =
            String.join ";"
                (List.map String.fromFloat (viewSine 20 5))

        xs =
            [ "0", "13", "26.8", "41.9", "55", "67.1", "79.8", "92.5", "106.7", "116.9", "130.5" ]

        letters =
            List.map String.fromChar (String.toList "HEXASPERATE")
    in
    S.g
        [ SA.class "title"
        , SA.x "0"
        , SA.y "0"
        , SA.transform "translate(55 30)"
        ]
        (List.map3 (viewTitleLetter values)
            xs
            letters
            (List.range 0 (List.length letters))
        )


viewSine : Int -> Float -> List Float
viewSine steps scale =
    let
        toSin i =
            sin (toFloat i * (2 / toFloat steps) * pi)
    in
    List.map
        (toSin >> (*) -scale)
        (List.range 0 steps)


viewTitleLetter : String -> String -> String -> Int -> Html Msg
viewTitleLetter animValues xPos letter index =
    S.text_
        [ SA.x xPos
        , SA.y "0"
        ]
        [ S.animate
            [ SA.dur "3s"
            , SA.repeatCount "indefinite"
            , SA.begin (String.fromFloat (toFloat index / 10) ++ "s")
            , SA.attributeName "y"
            , SA.values animValues
            ]
            []
        , S.text letter
        ]



-- VIEW DIFFICULTY MENU


viewDifficultyMenu : Model -> List (Html Msg)
viewDifficultyMenu model =
    [ viewTitle
    , viewMenuOption "SMALL" (Point Graphics.middle.x 67) (ChangeScene DifficultyMenu)
    , viewMenuOption "MEDIUM" (Point Graphics.middle.x 85) (ChangeScene OptionsScreen)
    , viewMenuOption "LARGE" (Point Graphics.middle.x 103) (ChangeScene AboutScreen)
    , viewMenuOption "BACK" (Point 30 118) (ChangeScene TitleScreen)
    ]



-- VIEW OPTIONS MENU


viewOptions : Model -> List (Html Msg)
viewOptions model =
    [ viewTitle
    , viewText "Background (static/moving)" (Point Graphics.middle.x 55)
    , viewText "Titles (static/moving)" (Point Graphics.middle.x 70)
    , viewText "Colors (palettes)" (Point Graphics.middle.x 85)
    , viewText "Labels (on/off)" (Point Graphics.middle.x 100)
    , viewMenuOption "BACK" (Point 30 118) (ChangeScene TitleScreen)
    ]



-- VIEW GAME


viewGame : Model -> List (Html Msg)
viewGame model =
    [ S.text "" ]



-- VIEW ABOUT


viewAbout : Model -> List (Html Msg)
viewAbout model =
    [ viewTitle
    , viewText "Hexasperate is an edge-matching" (Point Graphics.middle.x 70)
    , viewText "puzzle game inspired by the classic" (Point Graphics.middle.x 80)
    , viewText "game TetraVex by Scott Ferguson" (Point Graphics.middle.x 90)
    , viewMenuOption "BACK" (Point 30 118) (ChangeScene TitleScreen)
    ]



-- VIEW UTILS


viewMenuOption : String -> Point -> Msg -> Html Msg
viewMenuOption label center action =
    let
        hover =
            BoundingBox (center.x - 32) (center.y - 7.5) 64 12.5

        unhover =
            BoundingBox center.x (center.y - 1.25) 0 0
    in
    S.text_
        [ SA.class "option"
        , SA.x (String.fromFloat center.x)
        , SA.y (String.fromFloat center.y)
        , E.onClick action
        , ME.onOver (always (HoverMenuOption unhover hover))
        , ME.onOut (always (UnhoverMenuOption unhover))
        ]
        [ S.text label ]


viewText : String -> Point -> Html Msg
viewText label center =
    S.text_
        [ SA.class "text"
        , SA.x (String.fromFloat center.x)
        , SA.y (String.fromFloat center.y)
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


viewLabel : String -> Point -> Html Msg
viewLabel str { x, y } =
    S.text_
        [ SA.class "label"
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
