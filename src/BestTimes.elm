port module BestTimes exposing (BestTimes, add, init, subscriptions, view)

import Graphics
import Html exposing (Html)
import Json.Decode as JD
import Json.Encode as JE
import Puzzle exposing (Size(..))
import Svg as S
import Svg.Attributes as SA



-- TYPES


type alias BestTimes =
    { small : List Int
    , medium : List Int
    , large : List Int
    , huge : List Int
    }


init : BestTimes
init =
    BestTimes [] [] [] []



-- COMMANDS


add : Size -> Int -> BestTimes -> ( BestTimes, Cmd msg )
add size time times =
    let
        withNewTime =
            List.take 5 (List.sort (time :: get size times))

        newTimes =
            set size withNewTime times
    in
    ( newTimes
    , saveTimes (serialize newTimes)
    )


get : Size -> BestTimes -> List Int
get size { small, medium, large, huge } =
    case size of
        Small ->
            small

        Medium ->
            medium

        Large ->
            large

        Huge ->
            huge


set : Size -> List Int -> BestTimes -> BestTimes
set size newTimes times =
    case size of
        Small ->
            { times | small = newTimes }

        Medium ->
            { times | medium = newTimes }

        Large ->
            { times | large = newTimes }

        Huge ->
            { times | huge = newTimes }



-- VIEW


view : BestTimes -> Html msg
view { small, medium, large, huge } =
    let
        x1 =
            Graphics.screen.w * 1 / 5

        x2 =
            Graphics.screen.w * 2 / 5

        x3 =
            Graphics.screen.w * 3 / 5

        x4 =
            Graphics.screen.w * 4 / 5
    in
    S.g [ SA.class "best-times" ]
        [ viewListHeader x1 "SMALL"
        , viewTimeList x1 small
        , viewListHeader x2 "MEDIUM"
        , viewTimeList x2 medium
        , viewListHeader x3 "LARGE"
        , viewTimeList x3 large
        , viewListHeader x4 "HUGE"
        , viewTimeList x4 huge
        ]


viewListHeader : Float -> String -> Html msg
viewListHeader x name =
    S.text_
        [ SA.class "list-header center"
        , SA.x (String.fromFloat x)
        , SA.y "50"
        ]
        [ S.text name ]


viewTimeList : Float -> List Int -> Html msg
viewTimeList x times =
    let
        viewTime i mT =
            S.text_
                [ SA.class "list-entry"
                , SA.x (String.fromFloat (x + 13))
                , SA.y (String.fromInt (50 + 12 * (i + 1)))
                ]
                [ S.text (format mT) ]

        pads =
            List.repeat (5 - List.length times) Nothing

        justTimes =
            List.map Just times
    in
    S.g [ SA.class "times-list" ]
        (List.indexedMap viewTime (justTimes ++ pads))


format : Maybe Int -> String
format mT =
    case mT of
        Just t ->
            String.fromInt (t // 1000)
                ++ "."
                ++ String.padLeft 3 '0' (String.fromInt (modBy 1000 t))

        Nothing ->
            "-"



-- SAVING / LOADING


port saveTimes : String -> Cmd msg


port loadTimes : (JD.Value -> msg) -> Sub msg


subscriptions : (Result JD.Error BestTimes -> msg) -> Sub msg
subscriptions msg =
    loadTimes (deserialize >> msg)


deserialize : JD.Value -> Result JD.Error BestTimes
deserialize json =
    json
        |> JD.decodeValue
            (JD.map4 BestTimes
                (JD.field "small" (JD.list JD.int))
                (JD.field "medium" (JD.list JD.int))
                (JD.field "large" (JD.list JD.int))
                (JD.field "huge" (JD.list JD.int))
            )


serialize : BestTimes -> String
serialize times =
    JE.encode 0 (toJson times)


toJson : BestTimes -> JE.Value
toJson times =
    JE.object
        [ ( "small", JE.list JE.int times.small )
        , ( "medium", JE.list JE.int times.medium )
        , ( "large", JE.list JE.int times.large )
        , ( "huge", JE.list JE.int times.huge )
        ]
