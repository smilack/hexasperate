module Main exposing (main)

import Animator
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
    , animatedPoint : Animator.Timeline Point
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, getSvgDimensions )


initialModel : Model
initialModel =
    { svgDimensions = BoundingBox 0 0 0 0
    , mousePos = Point 0 0
    , animatedPoint =
        Animator.init (Point 0 0)
            |> Animator.go
                (Animator.seconds 10)
                (Point Graphics.screen.w Graphics.screen.h)
    }


animator : Animator.Animator Model
animator =
    Animator.animator
        |> Animator.watching
            .animatedPoint
            (\new model -> { model | animatedPoint = new })


getSvgDimensions : Cmd Msg
getSvgDimensions =
    Task.attempt GotSvgElement (Browser.Dom.getElement "screen")


type Msg
    = WindowResize Int Int
    | GotSvgElement (Result Browser.Dom.Error Browser.Dom.Element)
    | MouseMove ( Float, Float )
    | Tick Time.Posix


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


view : Model -> Html Msg
view model =
    let
        vb =
            String.join " "
                (List.map String.fromFloat
                    [ Graphics.screen.x, Graphics.screen.y, Graphics.screen.w, Graphics.screen.h ]
                )

        ( mx, my ) =
            ( model.mousePos.x, model.mousePos.y )

        { x, y } =
            Animator.xy
                model.animatedPoint
                (\state -> { x = Animator.at state.x, y = Animator.at state.y })
    in
    S.svg
        [ SA.viewBox vb
        , SA.id "screen"
        , SA.preserveAspectRatio "xMidYMid meet"
        , ME.onMove (.pagePos >> MouseMove)
        ]
        [ viewBackground
        , viewScreen
        , viewTitle
        , viewLabel "0" (Point 10 60)
        , viewLabel "1" (Point 20 60)
        , viewLabel "2" (Point 30 60)
        , viewLabel "3" (Point 40 60)
        , viewLabel "4" (Point 50 60)
        , viewLabel "5" (Point 60 60)
        , viewLabel "6" (Point 70 60)
        , viewLabel "7" (Point 80 60)
        , viewLabel "8" (Point 90 60)
        , viewLabel "9" (Point 100 60)
        , viewHex (Hex.create model.mousePos 3 ( "black", "transparent" ) ( "", "" ))
        , viewHex (Hex.create (Point x y) 3 ( "black", "transparent" ) ( "", "" ))
        , viewHex (Hex.create (Point 100 100) 10 ( "black", "transparent" ) ( "", "" ))
        ]


viewLabel : String -> Point -> Html Msg
viewLabel str { x, y } =
    S.text_
        [ SA.class "label"
        , SA.x (String.fromFloat x)
        , SA.y (String.fromFloat y)
        ]
        [ S.text str ]


viewScreen : Html Msg
viewScreen =
    S.rect
        [ SA.fill "rgba(255, 255, 255, 0.5)"
        , SA.x "5"
        , SA.y "5"
        , SA.width (String.fromFloat (Graphics.screen.w - 10))
        , SA.height (String.fromFloat (Graphics.screen.h - 10))
        ]
        []


viewTitle : Html Msg
viewTitle =
    S.text_
        [ SA.class "title"
        , SA.x "120"
        , SA.y "30"
        ]
        [ S.text "HEXASPERATE" ]


viewBackground : Html Msg
viewBackground =
    let
        ( x, y ) =
            ( -Graphics.screen.w, -Graphics.screen.h )

        ( w, h ) =
            ( 3 * Graphics.screen.w, 3 * Graphics.screen.h )
    in
    S.rect
        [ SA.fill "#aaccff"
        , SA.x (String.fromFloat x)
        , SA.y (String.fromFloat y)
        , SA.width (String.fromFloat w)
        , SA.height (String.fromFloat h)
        ]
        []


viewHex : Hex -> Html Msg
viewHex h =
    S.path
        ([ SA.d (Hex.toPath h)
         , SA.strokeWidth "0.5"
         ]
            ++ Hex.attributes h
        )
        []
