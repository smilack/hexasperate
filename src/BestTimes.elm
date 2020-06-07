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
    , double : List Int
    , triple : List Int
    }


init : BestTimes
init =
    BestTimes [] [] [] [] [] []



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
get size { small, medium, large, huge, double, triple } =
    case size of
        Small ->
            small

        Medium ->
            medium

        Large ->
            large

        Huge ->
            huge

        Double ->
            double

        Triple ->
            triple


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

        Double ->
            { times | double = newTimes }

        Triple ->
            { times | triple = newTimes }



-- VIEW


view : BestTimes -> Html msg
view { small, medium, large, huge, double, triple } =
    let
        x1 =
            Graphics.screen.w * 1 / 7

        x2 =
            Graphics.screen.w * 2 / 7

        x3 =
            Graphics.screen.w * 3 / 7

        x4 =
            Graphics.screen.w * 4 / 7

        x5 =
            Graphics.screen.w * 5 / 7

        x6 =
            Graphics.screen.w * 6 / 7
    in
    S.g [ SA.class "best-times" ]
        [ viewListHeader x1 "SM"
        , viewTimeList x1 small
        , viewListHeader x2 "MED"
        , viewTimeList x2 medium
        , viewListHeader x3 "LG"
        , viewTimeList x3 large
        , viewListHeader x4 "HUGE"
        , viewTimeList x4 huge
        , viewListHeader x5 "2X"
        , viewTimeList x5 double
        , viewListHeader x6 "3X"
        , viewTimeList x6 triple
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
            (JD.map6 BestTimes
                (maybeListDecoder "small")
                (maybeListDecoder "medium")
                (maybeListDecoder "large")
                (maybeListDecoder "huge")
                (maybeListDecoder "double")
                (maybeListDecoder "triple")
            )


maybeListDecoder : String -> JD.Decoder (List Int)
maybeListDecoder field =
    let
        toList mList =
            case mList of
                Just list ->
                    JD.succeed list

                Nothing ->
                    JD.succeed []
    in
    JD.andThen toList
        (JD.maybe (JD.field field (JD.list JD.int)))


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
        , ( "double", JE.list JE.int times.double )
        , ( "triple", JE.list JE.int times.triple )
        ]
