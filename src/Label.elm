module Label exposing (Label(..), toString, view)

import Graphics exposing (Point)
import Html exposing (Html)
import Svg as S
import Svg.Attributes as SA


type Label
    = Zero
    | One
    | Two
    | Three
    | Four
    | Five
    | Six
    | Seven
    | Eight
    | Nine


view : Point -> Label -> Html msg
view center label =
    let
        { x, y } =
            adjustCenter label center
    in
    S.text_
        [ SA.x (String.fromFloat x)
        , SA.y (String.fromFloat y)
        , SA.class "label center"
        ]
        [ S.text (toString label) ]


toString : Label -> String
toString label =
    case label of
        Zero ->
            "0"

        One ->
            "1"

        Two ->
            "2"

        Three ->
            "3"

        Four ->
            "4"

        Five ->
            "5"

        Six ->
            "6"

        Seven ->
            "7"

        Eight ->
            "8"

        Nine ->
            "9"


adjustCenter : Label -> Point -> Point
adjustCenter label { x, y } =
    case label of
        Zero ->
            Point (x + 0) (y + 0)

        One ->
            Point (x - 0.3) (y + 0)

        Two ->
            Point (x + 0) (y + 0)

        Three ->
            Point (x + 0) (y + 0)

        Four ->
            Point (x + 0) (y + 0)

        Five ->
            Point (x + 0) (y + 0)

        Six ->
            Point (x + 0.1) (y + 0)

        Seven ->
            Point (x + 0.1) (y + 0)

        Eight ->
            Point (x + 0) (y + 0)

        Nine ->
            Point (x + 0) (y + 0)
