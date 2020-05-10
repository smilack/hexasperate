module Main exposing (main)

import Animator
import Browser
import Browser.Dom
import Browser.Events
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
    { svgDimensions : Box
    , mousePos : Point
    , animatedPoint : Animator.Timeline Point
    }


type alias Box =
    { x : Float
    , y : Float
    , w : Float
    , h : Float
    }


type alias Point =
    { x : Float
    , y : Float
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, getSvgDimensions )


initialModel : Model
initialModel =
    { svgDimensions = Box 0 0 0 0
    , mousePos = Point 0 0
    , animatedPoint =
        Animator.init (Point 0 0)
            |> Animator.go (Animator.seconds 10) (Point screen.w screen.h)
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
                            Box element.x element.y element.width element.height
                    in
                    ( { model | svgDimensions = box }
                    , Cmd.none
                    )

        MouseMove pagePos ->
            let
                point =
                    scale pagePos model.svgDimensions
            in
            ( { model | mousePos = point }
            , Cmd.none
            )

        Tick newTime ->
            ( model |> Animator.update newTime animator
            , Cmd.none
            )


screen : Box
screen =
    Box 0 0 240 135


scale : ( Float, Float ) -> Box -> Point
scale ( x, y ) bb =
    let
        c =
            min (bb.w / screen.w) (bb.h / screen.h)
    in
    Point (bb.x + (x / c)) (bb.y + (y / c))


view : Model -> Html Msg
view model =
    let
        vb =
            String.join " "
                (List.map String.fromFloat
                    [ screen.x, screen.y, screen.w, screen.h ]
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
        , ME.onMove (.pagePos >> MouseMove)
        ]
        [ S.circle
            [ SA.cx (String.fromFloat mx)
            , SA.cy (String.fromFloat my)
            , SA.r "1"
            , SA.stroke "black"
            , SA.strokeWidth "0.5"
            , SA.fill "transparent"
            ]
            []
        , S.circle
            [ SA.cx (String.fromFloat x)
            , SA.cy (String.fromFloat y)
            , SA.r "1"
            , SA.stroke "red"
            , SA.strokeWidth "0.5"
            , SA.fill "transparent"
            ]
            []
        ]
