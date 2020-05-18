module StrUtil exposing (axial, scale, simplePath, spaceDelimit2, spaceDelimit4, transform, translate)

import Graphics exposing (Point)


translate : Float -> Float -> String
translate x y =
    "translate(" ++ spaceDelimit2 x y ++ ")"


transform : Float -> Float -> Float -> String
transform x y zoom =
    "translate("
        ++ spaceDelimit2 x y
        ++ ") scale("
        ++ String.fromFloat zoom
        ++ ")"


scale : Float -> String
scale z =
    "scale(" ++ String.fromFloat z ++ ")"


axial : ( Int, Int ) -> String
axial ( x, y ) =
    "(" ++ String.fromInt x ++ ", " ++ String.fromInt y ++ ")"


simplePath : List Point -> String
simplePath coords =
    let
        apply fn ( x, y ) =
            fn x y
    in
    "M " ++ String.join " L " (List.map (apply spaceDelimit2) coords) ++ " Z"


spaceDelimit2 : Float -> Float -> String
spaceDelimit2 x y =
    String.fromFloat x
        ++ " "
        ++ String.fromFloat y


spaceDelimit4 : Float -> Float -> Float -> Float -> String
spaceDelimit4 x y w h =
    spaceDelimit2 x y ++ " " ++ spaceDelimit2 w h
