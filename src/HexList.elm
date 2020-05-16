module HexList exposing (HexList, Index(..), absorb, fromList, get, hexMap, indexedHexMap, indexedMap, invert, isEmpty, set)


type alias HexList a =
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


indexedMap : (Index -> a -> b) -> HexList a -> List b
indexedMap fn { i, ii, iii, iv, v, vi } =
    List.map2 fn
        [ I, II, III, IV, V, VI ]
        [ i, ii, iii, iv, v, vi ]


indexedHexMap : (Index -> a -> b) -> HexList a -> HexList b
indexedHexMap fn { i, ii, iii, iv, v, vi } =
    HexList
        (fn I i)
        (fn II ii)
        (fn III iii)
        (fn IV iv)
        (fn V v)
        (fn VI vi)


hexMap : (a -> b) -> HexList a -> HexList b
hexMap fn { i, ii, iii, iv, v, vi } =
    HexList
        (fn i)
        (fn ii)
        (fn iii)
        (fn iv)
        (fn v)
        (fn vi)


get : Index -> HexList a -> a
get index { i, ii, iii, iv, v, vi } =
    case index of
        I ->
            i

        II ->
            ii

        III ->
            iii

        IV ->
            iv

        V ->
            v

        VI ->
            vi


set : Index -> a -> HexList a -> HexList a
set i val list =
    case i of
        I ->
            { list | i = val }

        II ->
            { list | ii = val }

        III ->
            { list | iii = val }

        IV ->
            { list | iv = val }

        V ->
            { list | v = val }

        VI ->
            { list | vi = val }


fromList : a -> List a -> HexList a
fromList default list =
    let
        helper indices values hexList =
            case indices of
                index :: inds ->
                    case values of
                        value :: vals ->
                            set index value hexList

                        [] ->
                            hexList

                [] ->
                    hexList
    in
    helper [ I, II, III, IV, V, VI ]
        list
        (HexList default default default default default default)


invert : Index -> Index
invert i =
    case i of
        I ->
            IV

        II ->
            V

        III ->
            VI

        IV ->
            I

        V ->
            II

        VI ->
            III


isEmpty : HexList (Maybe a) -> Bool
isEmpty { i, ii, iii, iv, v, vi } =
    List.all ((==) Nothing) [ i, ii, iii, iv, v, vi ]


{-| Given a HexList with a Maybe value, convert it to a real value by picking
from one of three sources: first, the existing value - if it is Nothing, then
second, the head of "source" - if source is empty then third, default. Return
a tuple of the filled in HexList and the source list minus the consumed values.

    absorb [ 1, 3 ]
        5
        (HexList Nothing (Just 2) Nothing (Just 4) Nothing (Just 6))
        == ( HexList 1 2 3 4 5 6, [] )

-}
absorb : List a -> a -> HexList (Maybe a) -> ( HexList a, List a )
absorb source default imperfectList =
    let
        helper :
            List Index
            -> List a
            -> HexList (Maybe a)
            -> HexList a
            -> ( HexList a, List a )
        helper indices src imperfect perfect =
            case indices of
                index :: restIndices ->
                    case get index imperfect of
                        Just v ->
                            helper restIndices src imperfect (set index v perfect)

                        Nothing ->
                            case src of
                                srcV :: srcRest ->
                                    helper restIndices srcRest imperfect (set index srcV perfect)

                                [] ->
                                    helper restIndices src imperfect perfect

                [] ->
                    ( perfect, src )
    in
    helper [ I, II, III, IV, V, VI ] source imperfectList (repeat default)


repeat : a -> HexList a
repeat val =
    HexList val val val val val val
