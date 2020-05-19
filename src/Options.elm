module Options exposing
    ( Background(..)
    , LabelState
    , Model
    , Msg(..)
    , OnOff(..)
    , TitleAnimation
    , init
    , update
    , view
    )

import Graphics exposing (Point)
import Html exposing (Html)
import Html.Events as E
import Label
import Palette exposing (Palette)
import StrUtil
import Svg as S
import Svg.Attributes as SA



-- MODEL


init : Model
init =
    { backgroundAnimation = BGAnimated
    , titleAnimation = On
    , labelState = On
    , palette = Palette.Material
    }


type alias Model =
    { backgroundAnimation : Background
    , titleAnimation : TitleAnimation
    , labelState : LabelState
    , palette : Palette.Option
    }


type Background
    = BGAnimated
    | BGStopped
    | BGDark


type alias TitleAnimation =
    OnOff


type alias LabelState =
    OnOff



-- UPDATE


type Msg
    = SetBackground Background
    | SetTitleAnimation TitleAnimation
    | SetLabelState LabelState
    | SetPalette Palette.Option


update : Msg -> Model -> Model
update msg model =
    case msg of
        SetBackground state ->
            { model | backgroundAnimation = state }

        SetTitleAnimation state ->
            { model | titleAnimation = state }

        SetLabelState state ->
            { model | labelState = state }

        SetPalette state ->
            { model | palette = state }



-- VIEW


view : Model -> Html Msg
view model =
    S.g []
        [ viewOption "Background"
            55
            backgroundStates
            model.backgroundAnimation
            SetBackground
        , viewOption "Titles"
            70
            animationStates
            model.titleAnimation
            SetTitleAnimation
        , viewOption "Color Palette"
            85
            palettes
            model.palette
            SetPalette
        , viewPalette
            ( 172, 76.9 )
            (Palette.get model.palette)
        , viewOption "Labels"
            100
            onOffStates
            model.labelState
            SetLabelState
        , viewLabels
            ( 189.5, 100 )
            model.labelState
        , viewHardMode model.palette model.labelState
        ]


viewOption : String -> Float -> OptionValues v -> v -> (v -> Msg) -> Html Msg
viewOption label y ( allVals, valToStr ) current msg =
    S.g
        [ SA.transform (StrUtil.translate 50 y) ]
        [ viewOptionName label
        , viewOptionValue (valToStr current) (msg (nextOption current allVals))
        ]


viewOptionName : String -> Html Msg
viewOptionName label =
    S.text_
        [ SA.class "text left"
        , SA.x "0"
        , SA.y "0"
        ]
        [ S.text label ]


viewOptionValue : String -> Msg -> Html Msg
viewOptionValue label msg =
    S.text_
        [ SA.class "option left"
        , SA.x "70"
        , SA.y "0"
        , E.onClick msg
        ]
        [ S.text label ]


nextOption : v -> List v -> v
nextOption current list =
    let
        next cur def rest =
            case rest of
                [] ->
                    def

                val :: [] ->
                    def

                val1 :: val2 :: vals ->
                    if cur == val1 then
                        val2

                    else
                        next cur def (val2 :: vals)
    in
    case list of
        [] ->
            current

        default :: vals ->
            next current default list


viewPalette : Point -> Palette -> Html Msg
viewPalette ( x, y ) palette =
    S.g
        [ SA.transform (StrUtil.translate x y) ]
        (List.indexedMap viewColor (Palette.colors palette))


viewColor : Int -> Palette.Color -> Html Msg
viewColor i color =
    let
        w =
            7.1

        x =
            modBy (5 * round w) (round w * i)

        y =
            round w * (i // 5)
    in
    S.rect
        [ SA.x (String.fromInt x)
        , SA.y (String.fromInt y)
        , SA.width (String.fromFloat w)
        , SA.height (String.fromFloat w)
        , SA.fill color
        ]
        []


viewLabels : Point -> LabelState -> Html Msg
viewLabels point state =
    case state of
        On ->
            Label.viewPreview point

        Off ->
            S.text ""


viewHardMode : Palette.Option -> LabelState -> Html Msg
viewHardMode palette onoff =
    let
        ( x, _ ) =
            Graphics.middle

        hardMode =
            S.text_
                [ SA.x (String.fromFloat x)
                , SA.y "112"
                , SA.class "text hard-mode"
                ]
                [ S.text "Hard mode unlocked!" ]
    in
    case ( palette, onoff ) of
        ( Palette.AllSame, Off ) ->
            hardMode

        ( Palette.Transparent, Off ) ->
            hardMode

        ( _, _ ) ->
            S.text ""



-- OPTION VALUES


type alias OptionValues v =
    ( List v, v -> String )


animationStates : OptionValues OnOff
animationStates =
    ( onOffVariants, animationStateNames )


onOffStates : OptionValues OnOff
onOffStates =
    ( onOffVariants, onOffStateNames )


palettes : OptionValues Palette.Option
palettes =
    ( Palette.options, Palette.optionNames )


backgroundStates : OptionValues Background
backgroundStates =
    ( backgroundVariants, backgroundStateNames )



-- HELPERS


type OnOff
    = On
    | Off


onOffVariants =
    [ On, Off ]


animationStateNames : OnOff -> String
animationStateNames onOff =
    case onOff of
        On ->
            "Animated"

        Off ->
            "Stopped"


onOffStateNames : OnOff -> String
onOffStateNames onOff =
    case onOff of
        On ->
            "On"

        Off ->
            "Off"


backgroundVariants =
    [ BGAnimated, BGStopped, BGDark ]


backgroundStateNames : Background -> String
backgroundStateNames bg =
    case bg of
        BGAnimated ->
            "Animated"

        BGStopped ->
            "Stopped"

        BGDark ->
            "Dark Mode"
