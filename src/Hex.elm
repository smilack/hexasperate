module Hex exposing (Hex, create, view)

import Graphics exposing (Point)
import HexList exposing (HexList)
import Html exposing (Html)
import Label exposing (Label)
import Options
import Palette exposing (Palette)
import Svg as S
import Svg.Attributes as SA
import Wedge exposing (Wedge)


type alias Hex =
    { wedges : HexList Wedge
    , zoom : Float
    }


create : Float -> HexList Label -> Hex
create zoom labels =
    let
        co =
            20 * cos (pi / 3)

        si =
            20 * sin (pi / 3)

        coords =
            HexList
                (Point 20 0)
                (Point co -si)
                (Point -co -si)
                (Point -20 0)
                (Point -co si)
                (Point co si)

        wedges =
            HexList
                (Wedge.create labels.i coords.i coords.ii)
                (Wedge.create labels.ii coords.ii coords.iii)
                (Wedge.create labels.iii coords.iii coords.iv)
                (Wedge.create labels.iv coords.iv coords.v)
                (Wedge.create labels.v coords.v coords.vi)
                (Wedge.create labels.vi coords.vi coords.i)
    in
    Hex wedges zoom


view : Palette -> Options.LabelState -> Point -> Hex -> Html msg
view palette labels { x, y } { wedges, zoom } =
    S.g
        [ SA.transform (transform x y zoom)
        , SA.class "hex"
        ]
        (HexList.indexedMap (Wedge.view palette labels) wedges)


transform : Float -> Float -> Float -> String
transform x y zoom =
    "translate("
        ++ String.fromFloat x
        ++ " "
        ++ String.fromFloat y
        ++ ") scale("
        ++ String.fromFloat zoom
        ++ ")"
