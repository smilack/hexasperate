module Title exposing (Title, about, bestTimes, finePrint, hexasperate, options, play, view)

import Html exposing (Html)
import Options
import Svg as S
import Svg.Attributes as SA



-- TYPES


type alias Letter =
    String


type alias Position =
    String


type alias Title =
    List ( Letter, Position )



-- DATA


hexasperateLetters : List Letter
hexasperateLetters =
    [ "H", "E", "X", "A", "S", "P", "E", "R", "A", "T", "E" ]


hexasperatePositions : List Position
hexasperatePositions =
    [ "55", "68", "81.8", "96.9", "110", "122.1", "134.8", "147.5", "161.7", "171.9", "185.5" ]


hexasperate : Title
hexasperate =
    List.map2 Tuple.pair hexasperateLetters hexasperatePositions


aboutLetters : List Letter
aboutLetters =
    [ "A", "B", "O", "U", "T" ]


aboutPositions : List Position
aboutPositions =
    [ "91.2", "105.3", "119.6", "134.5", "149.2" ]


about : Title
about =
    List.map2 Tuple.pair aboutLetters aboutPositions


optionsLetters : List Letter
optionsLetters =
    [ "O", "P", "T", "I", "O", "N", "S" ]


optionsPositions : List Position
optionsPositions =
    [ "83.4", "97.5", "110.3", "120.2", "130.5", "145.4", "158.5" ]


options : Title
options =
    List.map2 Tuple.pair optionsLetters optionsPositions


playLetters : List Letter
playLetters =
    [ "P", "L", "A", "Y" ]


playPositions : List Position
playPositions =
    [ "101.1", "113.3", "126.8", "138.3" ]


play : Title
play =
    List.map2 Tuple.pair playLetters playPositions


bestTimesLetters : List Letter
bestTimesLetters =
    [ "B", "E", "S", "T", "T", "I", "M", "E", "S" ]


bestTimesPositions : List Position
bestTimesPositions =
    [ "67.7", "80.5", "92.7", "104.8", "124.6", "134.4", "145.6", "160.8", "173" ]


bestTimes : Title
bestTimes =
    List.map2 Tuple.pair bestTimesLetters bestTimesPositions


finePrintLetters : List Letter
finePrintLetters =
    [ "T", "H", "E", "F", "I", "N", "E", "P", "R", "I", "N", "T" ]


finePrintPositions : List Position
finePrintPositions =
    [ "49.3", "63.6", "77.1", "94.8", "103.7", "113.6", "127.2", "144.9", "157.5", "166.4", "176.2", "190.6" ]


finePrint : Title
finePrint =
    List.map2 Tuple.pair finePrintLetters finePrintPositions



-- VIEW


view : Options.TitleAnimation -> Title -> Html msg
view state title =
    S.g
        [ SA.class "title"
        , SA.x "0"
        , SA.y "0"
        , SA.transform "translate(0 30)"
        ]
        (List.map2 (viewLetter state sineValues)
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


viewLetter : Options.TitleAnimation -> String -> ( String, String ) -> Int -> Html msg
viewLetter state animValues ( letter, xPos ) index =
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
