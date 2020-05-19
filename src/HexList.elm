module HexList exposing (HexList, Index(..), absorb, all, compact, get, indexedMap, invert, map, reify, sieve, toList)

-- TYPES


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


indices : List Index
indices =
    [ I, II, III, IV, V, VI ]



-- CREATION


{-| Create a HexList where all values are the same.
-}
repeat : a -> HexList a
repeat val =
    HexList val val val val val val



-- CONVERSION TO LIST


{-| Return all the values in the HexList as a List.

    toList (HexList 1 2 3 4 5 6) == [ 1, 2, 3, 4, 5, 6 ]

-}
toList : HexList a -> List a
toList { i, ii, iii, iv, v, vi } =
    [ i, ii, iii, iv, v, vi ]


{-| Return the non-Nothing values from a HexList as a List.

    compact (HexList (Just 1) Nothing Nothing (Just 2) Nothing Nothing) == [ 1, 2 ]

-}
compact : HexList (Maybe a) -> List a
compact list =
    let
        add values keep =
            case values of
                [] ->
                    keep

                val :: vals ->
                    case val of
                        Nothing ->
                            add vals keep

                        Just v ->
                            add vals (keep ++ [ v ])
    in
    add (toList list) []



-- MAPPING


map : (a -> b) -> HexList a -> HexList b
map fn { i, ii, iii, iv, v, vi } =
    HexList
        (fn i)
        (fn ii)
        (fn iii)
        (fn iv)
        (fn v)
        (fn vi)


map2 : (a -> b -> c) -> HexList a -> HexList b -> HexList c
map2 fn a b =
    HexList
        (fn a.i b.i)
        (fn a.ii b.ii)
        (fn a.iii b.iii)
        (fn a.iv b.iv)
        (fn a.v b.v)
        (fn a.vi b.vi)


indexedMap : (Index -> a -> b) -> HexList a -> HexList b
indexedMap fn { i, ii, iii, iv, v, vi } =
    HexList
        (fn I i)
        (fn II ii)
        (fn III iii)
        (fn IV iv)
        (fn V v)
        (fn VI vi)


all : (a -> Bool) -> HexList a -> Bool
all fn list =
    List.all fn (toList list)



-- GET / SET


{-| Get the value at a specific index.

    get III (HexMap 1 2 3 4 5 6) == 3

-}
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


{-| Update the value at a specific index.

    set III 7 (HexMap 1 2 3 4 5 6) == HexMap 1 2 7 4 5 6

-}
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


{-| Imagine that two HexLists are hexagons touching on one side.
This function returns the index of side of the other hexagon that
is touching the side with this index.
-}
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



-- MAYBES


{-| Keep entries in list 1 when the corresponding entry in list 2 is
Nothing. Discard entries in list 1 when the corresponding entry in list
2 is Just something.

    sieve (HexList 1 2 3 4 5 6)
        (HexList (Just "A") Nothing Nothing (Just "D") Nothing Nothing)
        == HexList Nothing (Just 2) (Just 3) Nothing (Just 5) (Just 6)

-}
sieve : HexList a -> HexList (Maybe b) -> HexList (Maybe a)
sieve list1 list2 =
    let
        filter : a -> Maybe b -> Maybe a
        filter a b =
            case b of
                Nothing ->
                    Just a

                Just _ ->
                    Nothing
    in
    map2 filter list1 list2


{-| Given a HexList with a Maybe type, reify it by picking from one of three
sources: first, the existing value - if it is Nothing, then second, the head
of "source" - if source is empty then third, the default parameter. Return a
tuple of the filled in HexList and the source list minus the consumed values.

    absorb [ 1, 3 ]
        5
        (HexList Nothing (Just 2) Nothing (Just 4) Nothing (Just 6))
        == ( HexList 1 2 3 4 5 6, [] )

    absorb [ 1, 2, 3, 4, 5, 6, 7, 8 ]
        0
        (HexList Nothing Nothing Nothing Nothing Nothing Nothing)
        == ( HexList 1 2 3 4 5 6, [ 7, 8, 9 ] )

-}
absorb : List a -> a -> HexList (Maybe a) -> ( HexList a, List a )
absorb sourceList defaultValue imperfectList =
    let
        setIndex :
            List Index
            -> List a
            -> HexList (Maybe a)
            -> HexList a
            -> ( HexList a, List a )
        setIndex indexes source imperfect perfect =
            case indexes of
                [] ->
                    ( perfect, source )

                idx :: idxs ->
                    case get idx imperfect of
                        Just val ->
                            setIndex idxs source imperfect (set idx val perfect)

                        Nothing ->
                            case source of
                                [] ->
                                    setIndex idxs source imperfect perfect

                                src :: srcs ->
                                    setIndex idxs srcs imperfect (set idx src perfect)
    in
    setIndex indices
        sourceList
        imperfectList
        (repeat defaultValue)


{-| If the HexList has a Maybe type, it is considered empty if all values are
Nothing.
-}
isEmpty : HexList (Maybe a) -> Bool
isEmpty list =
    List.all ((==) Nothing) (toList list)


{-| The number of items in a HexList with a Maybe type that are not nothing.

    length (HexList Nothing (Just 2) Nothing (Just 4) Nothing (Just 6)) == 3

-}
length : HexList (Maybe a) -> Int
length list =
    List.length (List.filter ((/=) Nothing) (toList list))


{-| For a HexList with a maybe type, if it contains only Just values, return
Just the list with the inner type. If it contains any Nothing values, return
Nothing.

    reify HexList (Just 0) (Just 0) (Just 0) (Just 0) (Just 0) (Just 0) == Just (HexList 0 0 0 0 0 0)
    reify HexList (Just 0) (Just 0) (Just 0) Nothing (Just 0) (Just 0) = Nothing

-}
reify : HexList (Maybe a) -> Maybe (HexList a)
reify list =
    case List.filterMap identity (toList list) of
        [ i, ii, iii, iv, v, vi ] ->
            Just (HexList i ii iii iv v vi)

        _ ->
            Nothing
