module Graphics exposing (BoundingBox, Point, middle, scale, screen)


type alias BoundingBox =
    { x : Float
    , y : Float
    , w : Float
    , h : Float
    }


type alias Point =
    { x : Float
    , y : Float
    }


screen : BoundingBox
screen =
    BoundingBox 0 0 240 135


middle : Point
middle =
    Point (screen.w / 2) (screen.h / 2)


scale : ( Float, Float ) -> BoundingBox -> Point
scale ( x, y ) bb =
    let
        ( cw, ch ) =
            ( bb.w / screen.w
            , bb.h / screen.h
            )

        c =
            min cw ch

        margin virtualSize actualSize =
            (actualSize / c - virtualSize) / 2

        ( newX, newY ) =
            if c == cw then
                ( bb.x + (x / c)
                , bb.y + (y / c) - margin screen.h bb.h
                )

            else
                ( bb.x + (x / c) - margin screen.w bb.w
                , bb.y + (y / c)
                )
    in
    Point newX newY
