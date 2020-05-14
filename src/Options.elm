module Options exposing
    ( BackgroundAnimation
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
import Svg as S
import Svg.Attributes as SA



-- MODEL


init : Model
init =
    { backgroundAnimation = On
    , titleAnimation = On
    , labelState = On
    , palette = Palette.Material
    }


type alias Model =
    { backgroundAnimation : BackgroundAnimation
    , titleAnimation : TitleAnimation
    , labelState : LabelState
    , palette : Palette.Option
    }


type alias BackgroundAnimation =
    OnOff


type alias TitleAnimation =
    OnOff


type alias LabelState =
    OnOff



-- UPDATE


type Msg
    = SetBackgroundAnimation BackgroundAnimation
    | SetTitleAnimation TitleAnimation
    | SetLabelState LabelState
    | SetPalette Palette.Option


update : Msg -> Model -> Model
update msg model =
    case msg of
        SetBackgroundAnimation state ->
            { model | backgroundAnimation = state }

        SetTitleAnimation state ->
            { model | titleAnimation = state }

        SetLabelState state ->
            { model | labelState = state }

        SetPalette state ->
            { model | palette = state }



-- VIEW


view : (Msg -> parentMsg) -> Model -> Html parentMsg
view parentMsg model =
    S.g []
        [ viewOption "Background"
            55
            animationStates
            model.backgroundAnimation
            (SetBackgroundAnimation >> parentMsg)
        , viewOption "Titles"
            70
            animationStates
            model.titleAnimation
            (SetTitleAnimation >> parentMsg)
        , viewOption "Color Palette"
            85
            palettes
            model.palette
            (SetPalette >> parentMsg)
        , viewPalette
            (Point 172 76.9)
            (Palette.get model.palette)
        , viewOption "Labels"
            100
            onOffStates
            model.labelState
            (SetLabelState >> parentMsg)
        , viewLabels
            (Point 189.5 100)
            model.labelState
        , viewHardMode model.palette model.labelState
        ]


viewOption :
    String
    -> Float
    -> OptionValues v
    -> v
    -> (v -> parentMsg)
    -> Html parentMsg
viewOption label y ( allVals, valToStr ) current msg =
    S.g
        [ SA.transform ("translate(50 " ++ String.fromFloat y ++ ")") ]
        [ viewOptionName label
        , viewOptionValue (valToStr current) (msg (nextOption current allVals))
        ]


viewOptionName : String -> Html msg
viewOptionName label =
    S.text_
        [ SA.class "text left"
        , SA.x "0"
        , SA.y "0"
        ]
        [ S.text label ]


viewOptionValue : String -> msg -> Html msg
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


viewPalette : Point -> Palette -> Html msg
viewPalette { x, y } palette =
    S.g
        [ SA.transform
            ("translate("
                ++ String.fromFloat x
                ++ " "
                ++ String.fromFloat y
                ++ ")"
            )
        ]
        (List.indexedMap viewColor (Palette.colors palette))


viewColor : Int -> Palette.Color -> Html msg
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


viewLabels : Point -> LabelState -> Html msg
viewLabels point state =
    case state of
        On ->
            Label.viewPreview point

        Off ->
            S.text ""


viewHardMode : Palette.Option -> LabelState -> Html msg
viewHardMode palette onoff =
    let
        hardMode =
            S.text_
                [ SA.x (String.fromFloat Graphics.middle.x)
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
