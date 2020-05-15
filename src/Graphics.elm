module Graphics exposing (BoundingBox, Point, middle, scale, screen)


type alias BoundingBox =
    { x : Float
    , y : Float
    , w : Float
    , h : Float
    }


type alias Point =
    ( Float, Float )


screen : BoundingBox
screen =
    BoundingBox 0 0 240 135


middle : Point
middle =
    ( screen.w / 2, screen.h / 2 )


scale : ( Float, Float ) -> BoundingBox -> BoundingBox -> Point
scale ( x, y ) elementBb camera =
    let
        ( cw, ch ) =
            ( elementBb.w / screen.w
            , elementBb.h / screen.h
            )

        c =
            min cw ch

        margin virtualSize actualSize =
            (actualSize / c - virtualSize) / 2

        ( newX, newY ) =
            if c == cw then
                ( camera.x + elementBb.x + (x / c)
                , camera.y + elementBb.y + (y / c) - margin screen.h elementBb.h
                )

            else
                ( camera.x + elementBb.x + (x / c) - margin screen.w elementBb.w
                , camera.y + elementBb.y + (y / c)
                )
    in
    ( newX, newY )
