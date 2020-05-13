module Title exposing (Title, about, hexasperate, options, play)


type alias Letter =
    String


type alias Position =
    String


type alias Title =
    List ( Letter, Position )


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
