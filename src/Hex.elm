module Hex exposing (Hex, create, view)

import Graphics exposing (Point)
import Html exposing (Html)
import Options
import Palette exposing (Number, Palette)
import SixList exposing (SixList)
import Svg as S
import Svg.Attributes as SA
import Wedge exposing (Wedge)


type alias Hex =
    { wedges : SixList Wedge }


create : Float -> SixList Number -> Hex
create r numbers =
    let
        co =
            r * cos (pi / 3)

        si =
            r * sin (pi / 3)

        coords =
            SixList
                (Point r 0)
                (Point co -si)
                (Point -co -si)
                (Point -r 0)
                (Point -co si)
                (Point co si)

        wedges =
            SixList
                (Wedge.create numbers.i coords.i coords.ii)
                (Wedge.create numbers.ii coords.ii coords.iii)
                (Wedge.create numbers.iii coords.iii coords.iv)
                (Wedge.create numbers.iv coords.iv coords.v)
                (Wedge.create numbers.v coords.v coords.vi)
                (Wedge.create numbers.vi coords.vi coords.i)
    in
    Hex wedges


view : Palette -> Options.OnOff -> Point -> Hex -> Html msg
view palette labels { x, y } { wedges } =
    S.g
        [ SA.transform ("translate(" ++ String.fromFloat x ++ " " ++ String.fromFloat y ++ ")") ]
        (SixList.map (Wedge.view palette labels) wedges)
