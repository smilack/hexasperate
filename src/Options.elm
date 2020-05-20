module Options exposing
    ( BackgroundAnimation
    , BackgroundColor(..)
    , BackgroundPattern
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
    { backgroundAnimation = On
    , backgroundPattern = On
    , backgroundColor = BluePurple
    , titleAnimation = On
    , palette = Palette.Material
    , labelState = On
    }


type alias Model =
    { backgroundAnimation : BackgroundAnimation
    , backgroundPattern : BackgroundPattern
    , backgroundColor : BackgroundColor
    , titleAnimation : TitleAnimation
    , palette : Palette.Option
    , labelState : LabelState
    }


type alias BackgroundAnimation =
    OnOff


type alias BackgroundPattern =
    OnOff


type BackgroundColor
    = BluePurple
    | DarkMode


type alias TitleAnimation =
    OnOff


type alias LabelState =
    OnOff



-- UPDATE


type Msg
    = SetBackgroundAnimation BackgroundAnimation
    | SetBackgroundPattern BackgroundPattern
    | SetBackgroundColor BackgroundColor
    | SetTitleAnimation TitleAnimation
    | SetPalette Palette.Option
    | SetLabelState LabelState


update : Msg -> Model -> Model
update msg model =
    case msg of
        SetBackgroundAnimation state ->
            { model | backgroundAnimation = state }

        SetBackgroundPattern state ->
            { model | backgroundPattern = state }

        SetBackgroundColor state ->
            { model | backgroundColor = state }

        SetTitleAnimation state ->
            { model | titleAnimation = state }

        SetPalette state ->
            { model | palette = state }

        SetLabelState state ->
            { model | labelState = state }



-- VIEW


view : Model -> Html Msg
view model =
    S.g []
        [ viewOption "Background Animation"
            50
            onOffStates
            model.backgroundAnimation
            SetBackgroundAnimation
        , viewOption "Background Pattern"
            61
            onOffStates
            model.backgroundPattern
            SetBackgroundPattern
        , viewOption "Background Color"
            72
            backgroundColorStates
            model.backgroundColor
            SetBackgroundColor
        , viewOption "Title Animation"
            83
            onOffStates
            model.titleAnimation
            SetTitleAnimation
        , viewOption "Color Palette"
            94
            palettes
            model.palette
            SetPalette
        , viewOption "Tile Labels"
            105
            onOffStates
            model.labelState
            SetLabelState
        , viewTilePreview
            ( 153, 111 )
            (Palette.get model.palette)
            model.labelState
        , viewHardMode model.palette model.labelState
        ]


viewOption : String -> Float -> OptionValues v -> v -> (v -> Msg) -> Html Msg
viewOption label y ( allVals, valToStr ) current msg =
    S.g
        [ SA.transform (StrUtil.translate 47 y) ]
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
        , SA.x "106"
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


viewTilePreview : Point -> Palette -> LabelState -> Html Msg
viewTilePreview ( x, y ) palette labelState =
    let
        labelClass =
            case labelState of
                On ->
                    ""

                Off ->
                    "no-labels"
    in
    S.g
        [ SA.transform (StrUtil.translate x y)
        , SA.class "tile-preview"
        , SA.class labelClass
        ]
        (List.concat
            (List.map3 viewSwatch
                (List.range 0 9)
                (Palette.colors palette)
                Label.labels
            )
        )


viewSwatch : Int -> Palette.Color -> Label.Label -> List (Html Msg)
viewSwatch i color label =
    let
        w =
            11.1

        x =
            modBy (5 * round w) (round w * i)

        y =
            round w * (i // 5)

        center =
            ( toFloat x + w / 2, toFloat y + w / 2 + 1 )
    in
    [ S.rect
        [ SA.x (String.fromInt x)
        , SA.y (String.fromInt y)
        , SA.width (String.fromFloat w)
        , SA.height (String.fromFloat w)
        , SA.fill color
        ]
        []
    , Label.view center label
    ]


viewHardMode : Palette.Option -> LabelState -> Html Msg
viewHardMode palette onoff =
    let
        hardMode =
            S.g []
                [ S.text_
                    [ SA.x "180.75"
                    , SA.y "118.5"
                    , SA.class "text hard-mode center"
                    ]
                    [ S.text "Hard mode" ]
                , S.text_
                    [ SA.x "180.75"
                    , SA.y "126.5"
                    , SA.class "text hard-mode center"
                    ]
                    [ S.text "unlocked!" ]
                ]
    in
    case ( palette, onoff ) of
        ( Palette.Classic, Off ) ->
            hardMode

        ( Palette.Transparent, Off ) ->
            hardMode

        ( _, _ ) ->
            S.text ""



-- OPTION VALUES


type alias OptionValues v =
    ( List v, v -> String )


onOffStates : OptionValues OnOff
onOffStates =
    ( onOffVariants, onOffStateNames )


palettes : OptionValues Palette.Option
palettes =
    ( Palette.options, Palette.optionNames )


backgroundColorStates : OptionValues BackgroundColor
backgroundColorStates =
    ( backgroundColorVariants, backgroundColorStateNames )



-- HELPERS


type OnOff
    = On
    | Off


onOffVariants =
    [ On, Off ]


onOffStateNames : OnOff -> String
onOffStateNames onOff =
    case onOff of
        On ->
            "On"

        Off ->
            "Off"


backgroundColorVariants =
    [ BluePurple, DarkMode ]


backgroundColorStateNames : BackgroundColor -> String
backgroundColorStateNames bg =
    case bg of
        BluePurple ->
            "Blue/Purple"

        DarkMode ->
            "Dark Mode"
