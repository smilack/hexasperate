module SixList exposing (Index(..), SixList, indexedMap)


type alias SixList a =
    { i : a
    , ii : a
    , iii : a
    , iv : a
    , v : a
    , vi : a
    }


type Index
    = I
    | II
    | III
    | IV
    | V
    | VI


indexedMap : (Index -> a -> b) -> SixList a -> List b
indexedMap fn { i, ii, iii, iv, v, vi } =
    List.map2 fn
        [ I, II, III, IV, V, VI ]
        [ i, ii, iii, iv, v, vi ]
