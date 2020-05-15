module Hex exposing (Hex, Id, create, view)

import Graphics exposing (Point)
import HexList exposing (HexList)
import Html exposing (Html)
import Html.Events.Extra.Mouse as ME
import Label exposing (Label)
import Options
import Palette exposing (Palette)
import Svg as S
import Svg.Attributes as SA
import Wedge exposing (Wedge)


type alias Id =
    Int


type alias Hex =
    { id : Id
    , wedges : HexList Wedge
    , zoom : Float
    }


create : Id -> Float -> HexList Label -> Hex
create id zoom labels =
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
    Hex id wedges zoom


view :
    Palette
    -> Options.LabelState
    -> Point
    -> (Hex -> Point -> msg)
    -> msg
    -> Hex
    -> Html msg
view palette labels ( x, y ) mouseDownMsg mouseUpMsg hex =
    S.g
        [ SA.transform (transform x y hex.zoom)
        , SA.class "hex"
        , ME.onDown (.pagePos >> mouseDownMsg hex)
        , ME.onUp (always mouseUpMsg)
        ]
        (HexList.indexedMap (Wedge.view palette labels) hex.wedges)


transform : Float -> Float -> Float -> String
transform x y zoom =
    "translate("
        ++ String.fromFloat x
        ++ " "
        ++ String.fromFloat y
        ++ ") scale("
        ++ String.fromFloat zoom
        ++ ")"
