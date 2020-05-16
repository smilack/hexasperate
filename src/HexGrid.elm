module HexGrid exposing (Axial, HexGrid, Range, cells, create, neighbors, view)

import Graphics exposing (Point)
import HexList exposing (HexList, Index(..))
import Html exposing (Html)
import List.Extra
import Svg as S
import Svg.Attributes as SA


type HexGrid
    = HexGrid Float Point (List Axial)


type alias Range =
    { x : ( Int, Int )
    , y : ( Int, Int )
    , z : ( Int, Int )
    }


type alias Axial =
    ( Int, Int )


type alias Cube =
    ( Int, Int, Int )


create : Float -> Point -> Range -> HexGrid
create zoom center { x, y, z } =
    HexGrid zoom center (inRange x y z)


toAxial : Cube -> Axial
toAxial ( x, _, z ) =
    ( x, z )


toCube : Axial -> Cube
toCube ( q, r ) =
    ( q, -q - r, r )


cells : HexGrid -> List Axial
cells (HexGrid _ _ axs) =
    axs


neighbors : Axial -> HexGrid -> HexList (Maybe Axial)
neighbors ( q, r ) (HexGrid _ _ axs) =
    let
        filter ax =
            if List.member ax axs then
                Just ax

            else
                Nothing
    in
    HexList
        (filter ( q + 1, r - 1 ))
        (filter ( q, r - 1 ))
        (filter ( q - 1, r ))
        (filter ( q - 1, r + 1 ))
        (filter ( q, r + 1 ))
        (filter ( q + 1, r ))


toPoint : Float -> Axial -> Point
toPoint zoom ( q, r ) =
    ( zoom * toFloat q * 3 / 2
    , zoom * (root3 * toFloat q / 2 + root3 * toFloat r)
    )


gridCenter : Float -> List Axial -> Point
gridCenter zoom axs =
    let
        points =
            List.map (toPoint zoom) axs

        minX =
            Debug.log "minX" (List.minimum (List.map Tuple.first points))

        maxX =
            Debug.log "maxX" (List.maximum (List.map Tuple.first points))

        minY =
            Debug.log "minY" (List.minimum (List.map Tuple.second points))

        maxY =
            Debug.log "maxY" (List.maximum (List.map Tuple.second points))
    in
    ( Maybe.withDefault 0 (Maybe.map2 (+) maxX minX) / 2
    , Maybe.withDefault 0 (Maybe.map2 (+) maxY minY) / 2
    )


root3 : Float
root3 =
    sqrt 3


inRange : ( Int, Int ) -> ( Int, Int ) -> ( Int, Int ) -> List Axial
inRange ( minX, maxX ) ( minY, maxY ) ( minZ, maxZ ) =
    let
        cube x y z =
            ( x, y, z )

        possible =
            List.Extra.lift3 cube
                (List.range minX maxX)
                (List.range minY maxY)
                (List.range minZ maxZ)

        valid ( x, y, z ) =
            (x + y + z) == 0

        cubes =
            List.filter valid possible
    in
    List.map toAxial cubes


view : HexGrid -> Html msg
view (HexGrid zoom ( cx, cy ) axs) =
    let
        ( gridCx, gridCy ) =
            Debug.log "grid center"
                (gridCenter (20 * zoom) axs)

        _ =
            Debug.log "given center" ( cx, cy )

        ( x, y ) =
            Debug.log "adjusted center"
                ( cx - gridCx, cy - gridCy )
    in
    S.g
        [ SA.transform (transform x y zoom)
        , SA.class "grid"
        ]
        (List.map (viewHex zoom) axs)


viewHex : Float -> Axial -> Html msg
viewHex zoom ax =
    let
        r =
            20 * zoom

        co =
            r * cos (pi / 3)

        si =
            r * sin (pi / 3)

        ( x, y ) =
            toPoint r ax

        coords =
            [ ( x + r, y + 0 )
            , ( x + co, y - si )
            , ( x - co, y - si )
            , ( x - r, y + 0 )
            , ( x - co, y + si )
            , ( x + co, y + si )
            ]
    in
    S.path
        [ SA.d
            ("M "
                ++ String.join " L "
                    (List.map str coords)
                ++ " Z"
            )
        ]
        []


str : Point -> String
str ( x, y ) =
    String.fromFloat x
        ++ " "
        ++ String.fromFloat y


transform : Float -> Float -> Float -> String
transform x y zoom =
    "translate("
        ++ str ( x, y )
        ++ ")"



-- scale("
--++ String.fromFloat zoom
--++ ")"
