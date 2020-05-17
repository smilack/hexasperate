module Hex exposing (Hex, Id, create, view)

import Graphics exposing (Point)
import HexList exposing (HexList)
import Html exposing (Html)
import Label exposing (Label)
import Svg as S
import Svg.Attributes as SA
import Wedge exposing (Wedge)


type alias Id =
    Int


type alias Hex =
    { id : Id
    , wedges : HexList Wedge
    }


create : Id -> HexList Label -> Hex
create id labels =
    let
        co =
            20 * cos (pi / 3)

        si =
            20 * sin (pi / 3)

        coords =
            HexList
                ( 20, 0 )
                ( co, -si )
                ( -co, -si )
                ( -20, 0 )
                ( -co, si )
                ( co, si )

        wedges =
            HexList
                (Wedge.create labels.i coords.i coords.ii)
                (Wedge.create labels.ii coords.ii coords.iii)
                (Wedge.create labels.iii coords.iii coords.iv)
                (Wedge.create labels.iv coords.iv coords.v)
                (Wedge.create labels.v coords.v coords.vi)
                (Wedge.create labels.vi coords.vi coords.i)
    in
    Hex id wedges


view : Hex -> Html msg
view hex =
    S.g
        [ SA.class "hex" ]
        (HexList.indexedMap Wedge.view hex.wedges)
