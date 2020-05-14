module SixList exposing (SixList, map)


type alias SixList a =
    { i : a
    , ii : a
    , iii : a
    , iv : a
    , v : a
    , vi : a
    }


map : (a -> b) -> SixList a -> List b
map fn { i, ii, iii, iv, v, vi } =
    List.map fn [ i, ii, iii, iv, v, vi ]
