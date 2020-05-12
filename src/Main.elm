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
    , title : Animator.Timeline (Array State)
    }


type State
    = Stopped
    | Transition
    | Oscillating


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
    , title = initTitle
    }


initTitle : Animator.Timeline (Array State)
initTitle =
    let
        steps =
            60

        sine =
            List.map
                (toFloat >> (*) (2 / toFloat steps) >> (*) pi >> sin >> (*) -10)
                (List.range 0 steps)

        repeat =
            Array.repeat (String.length "HEXASPERATE")

        start =
            Animator.init (repeat Stopped)

        wave =
            List.map
                (repeat >> Animator.event (Animator.millis 16))
                (Debug.log "sine steps" sine)

        nextSteps =
            [ Animator.wait (Animator.seconds 2)

            --++ List.map
            --    (Animator.event (Animator.millis 200))
            --    (startOsc 12)
            --++ [ Animator.wait (Animator.seconds 5) ]
            --++ List.map
            --    (Animator.event (Animator.millis 200))
            --    (stopOsc 12)
            , Animator.event (Animator.seconds 0.5) (repeat Oscillating)
            , Animator.wait (Animator.seconds 5)
            , Animator.event (Animator.seconds 1.25) (repeat Stopped)

            --, Animator.event Animator.immediately (repeat Oscillating)
            ]

        next =
            Animator.queue (Debug.log "nextSteps" nextSteps)
    in
    start |> next


startOsc : Int -> List (Array State)
startOsc len =
    List.map
        (\i ->
            Array.fromList
                (List.repeat i Oscillating ++ List.repeat (len - 1 - i) Stopped)
        )
        (List.range 0 (len - 1))


stopOsc : Int -> List (Array State)
stopOsc len =
    List.reverse (startOsc len)



--|> next


animator : Animator.Animator Model
animator =
    Animator.animator
        |> Animator.watching
            .menuHighlight
            (\new model -> { model | menuHighlight = new })
        |> Animator.watching
            .title
            (\new model -> { model | title = new })


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

         --, S.use [ SA.xlinkHref "#zigzag", SA.x "0", SA.y "30" ] []
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
    let
        zigs =
            List.map (toFloat >> (*) 10) (List.range 0 24)

        zags =
            List.intersperse 0 (List.repeat 13 10)

        zigzags : List ( Float, Float )
        zigzags =
            List.map2 Tuple.pair zigs zags

        str : ( Float, Float ) -> String
        str ( x, y ) =
            String.fromFloat x ++ " " ++ String.fromFloat y

        d =
            String.join " "
                (case zigzags of
                    x :: xs ->
                        ("M " ++ str x) :: List.map (str >> (++) "L ") xs

                    _ ->
                        [ "" ]
                )
    in
    S.defs []
        [ S.path
            [ SA.id "zigzag"
            , SA.d d
            , SA.stroke "black"
            , SA.fill "transparent"
            , SA.strokeWidth "1"
            ]
            []
        , S.pattern
            [ SA.id "bgpattern"
            , SA.x "0"
            , SA.y "0"
            , SA.width "20"
            , SA.height "11"
            , SA.patternUnits "userSpaceOnUse"
            , SA.viewBox "-6 -10 12.125 20"
            , SA.preserveAspectRatio "xMidYMid slice"
            ]
            [ S.rect
                [ SA.x "-6"
                , SA.y "-10"
                , SA.width "12.5"
                , SA.height "20"
                , SA.fill "#ddddff"
                ]
                []
            , S.path
                [ SA.d "M -4 0 L -8 0"
                , SA.strokeWidth "0.75"
                , SA.stroke "white"
                , SA.fill "transparent"
                ]
                []
            , S.path
                [ SA.d "M 4 0 L 2 -3.5 L -2 -3.5 L -4 0 L -2 3.5 L 2 3.5 Z"
                , SA.strokeWidth "1"
                , SA.stroke "white"
                , SA.fill "transparent"
                ]
                []
            , S.path
                [ SA.d "M 4 0 L 8 0"
                , SA.strokeWidth "0.75"
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
    [ --viewTitle3    ,
      viewTitle4

    --, viewMenuHighlight model.menuHighlight
    , viewMenuOption "PLAY" (Point Graphics.middle.x 72) (ChangeScene DifficultyMenu)
    , viewMenuOption "OPTIONS" (Point Graphics.middle.x 90) (ChangeScene OptionsScreen)
    , viewMenuOption "ABOUT" (Point Graphics.middle.x 108) (ChangeScene AboutScreen)
    ]


adjustDx : List Float -> List Float
adjustDx poss =
    --List.map2 (-) poss (0 :: poss)
    poss


viewTitle3 : Html Msg
viewTitle3 =
    S.text_
        [ SA.class "title"
        , SA.x "120"
        , SA.y "30"
        ]
        [ S.text "HEXASPERATE" ]


viewTitle4 : Html Msg
viewTitle4 =
    let
        steps =
            20

        sine =
            List.map
                (toFloat >> (*) (2 / toFloat steps) >> (*) pi >> sin >> (*) 5)
                (List.range 0 steps)

        sinePoints =
            List.map
                (toFloat >> (*) (2 / toFloat steps) >> (*) pi >> sin >> abs)
                (List.range 0 steps)

        sineTimes =
            List.indexedMap
                (\i _ -> toFloat i / toFloat (List.length sinePoints))
                sinePoints

        coord ( y, x ) =
            String.fromFloat (toFloat x * 0) ++ " " ++ String.fromFloat y

        merge list =
            String.join " L "
                (List.map coord list)

        values =
            String.join ";" (List.map String.fromFloat sine)

        --case List.map2 Tuple.pair (Debug.log "sine" sine) (List.range 0 (List.length sine)) of
        --    first :: rest ->
        --        "M " ++ coord first ++ " L " ++ merge rest
        --    _ ->
        --        ""
        xs =
            [ "0", "13", "26.8", "41.9", "55", "67.1", "79.8", "92.5", "106.7", "116.9", "130.5" ]

        letters =
            List.map String.fromChar (String.toList "HEXASPERATE")

        toText x letter i =
            S.text_
                [ SA.x x
                , SA.y "0"
                ]
                [ S.animate
                    [ SA.dur "3s"
                    , SA.repeatCount "indefinite"
                    , SA.begin (String.fromFloat (toFloat i / 10) ++ "s")

                    --, SA.keyTimes (String.join ";" (List.map String.fromFloat sineTimes))
                    --, SA.keyPoints (String.join ";" (List.map String.fromFloat sinePoints))
                    , SA.attributeName "y"
                    , SA.values values
                    ]
                    []

                --[ S.mpath [ SA.xlinkHref "#sinepath" ] [] ]
                , S.text letter
                ]
    in
    S.g
        [ SA.class "title"
        , SA.id "group"
        , SA.x "0"
        , SA.y "0"
        , SA.transform "translate(55 30)"
        ]
        (S.path [ SA.id "sinepath", SA.d values ] []
            :: List.map3 toText xs letters (List.range 0 (List.length letters))
        )


viewTitle2 : Animator.Timeline (Array State) -> Html Msg
viewTitle2 positionTimeline =
    let
        title =
            "HEXASPERATE"

        letters =
            List.map String.fromChar (String.toList title)

        maybeOsc i ste =
            let
                osc =
                    Animator.wave -7 0

                shift =
                    Animator.shift (toFloat i / 14)

                loop =
                    Animator.loop (Animator.seconds 3)
            in
            case ste of
                Oscillating ->
                    osc |> shift |> loop

                Transition ->
                    Animator.interpolate ((*) 7) |> shift |> loop

                Stopped ->
                    Animator.at 0

        getPos timeline i _ =
            Animator.linear timeline
                (Array.get i >> Maybe.withDefault Stopped >> maybeOsc i)

        positions =
            adjustDx
                (List.indexedMap
                    (getPos positionTimeline)
                    letters
                )

        toTspan letter pos i =
            S.tspan
                [ SA.dx
                    (if letter == "T" then
                        "0"
                        --"-4"

                     else
                        "0"
                    )
                , SA.y (String.fromFloat pos)
                , SA.x (String.fromInt (i * 13))
                ]
                [ S.text letter ]

        tspans =
            List.map3 toTspan letters positions (List.range 0 30)
    in
    S.text_
        [ SA.class "title"
        , SA.x "0"
        , SA.y "0"
        , SA.transform "translate(60 30)"
        ]
        tspans


viewAnimate : Float -> Html Msg
viewAnimate delay =
    let
        steps =
            20

        sine =
            List.map
                (toFloat >> (*) (2 / toFloat steps) >> (*) pi >> sin >> (*) -5)
                (List.range 0 steps)

        values =
            String.join ";" (List.map String.fromFloat sine)
    in
    S.animate
        [ SA.attributeName "y"
        , SA.values values
        , SA.dur "3s"
        , SA.repeatCount "10"
        , SA.begin (String.fromFloat delay ++ "s")
        ]
        []


viewTitle : Html Msg
viewTitle =
    let
        title =
            "HEXASPERATE"

        letters =
            List.map String.fromChar (String.toList title)

        toTspan i letter =
            S.tspan
                [ SA.dx
                    (if letter == "T" then
                        "-4"

                     else
                        "0"
                    )
                , SA.y "0"
                ]
                [ viewAnimate (toFloat i / 10)
                , S.text letter
                ]

        tspans =
            List.indexedMap toTspan letters
    in
    S.text_
        [ SA.class "title"
        , SA.x "0"
        , SA.y "0"
        , SA.transform "translate(120 30)"
        ]
        tspans



-- VIEW DIFFICULTY MENU


viewDifficultyMenu : Model -> List (Html Msg)
viewDifficultyMenu model =
    [ S.text "" ]



-- VIEW OPTIONS MENU


viewOptions : Model -> List (Html Msg)
viewOptions model =
    [ S.text "" ]



-- VIEW GAME


viewGame : Model -> List (Html Msg)
viewGame model =
    [ S.text "" ]



-- VIEW ABOUT


viewAbout : Model -> List (Html Msg)
viewAbout model =
    [ S.text "" ]



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



--, viewTitle
--, viewLabel "0" (Point 10 60)
--, viewLabel "1" (Point 20 60)
--, viewLabel "2" (Point 30 60)
--, viewLabel "3" (Point 40 60)
--, viewLabel "4" (Point 50 60)
--, viewLabel "5" (Point 60 60)
--, viewLabel "6" (Point 70 60)
--, viewLabel "7" (Point 80 60)
--, viewLabel "8" (Point 90 60)
--, viewLabel "9" (Point 100 60)
--, viewHex (Hex.create model.mousePos 3 ( "black", "transparent" ) ( "", "" ))
--, viewHex (Hex.create (Point x y) 3 ( "black", "transparent" ) ( "", "" ))
--, viewHex (Hex.create (Point 100 100) 10 ( "black", "transparent" ) ( "", "" ))


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
