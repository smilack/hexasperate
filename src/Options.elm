{-
   Copyright 2020 Tom Smilack

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <https://www.gnu.org/licenses/>.
-}


port module Options exposing
    ( BackgroundAnimation
    , BackgroundColor(..)
    , BackgroundPattern
    , LabelState
    , Model
    , Msg(..)
    , OnOff(..)
    , TitleAnimation
    , init
    , subscriptions
    , update
    , view
    )

import Graphics exposing (Point)
import Html exposing (Html)
import Html.Events as E
import Json.Decode as JD
import Json.Encode as JE
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
    | LoadOptions (Result JD.Error Model)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        newModel =
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

                LoadOptions result ->
                    case result of
                        Err err ->
                            let
                                _ =
                                    Debug.log "Error loading options" err
                            in
                            model

                        Ok loadedOptions ->
                            loadedOptions

        cmd =
            case msg of
                LoadOptions _ ->
                    Cmd.none

                _ ->
                    saveOptions (serialize newModel)
    in
    ( newModel, cmd )



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



-- SAVING / LOADING


port saveOptions : String -> Cmd msg


port loadOptions : (JD.Value -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions _ =
    loadOptions (deserialize >> LoadOptions)


deserialize : JD.Value -> Result JD.Error Model
deserialize json =
    json
        |> JD.decodeValue
            (JD.map6 Model
                (JD.field "backgroundAnimation" onOffDecoder)
                (JD.field "backgroundPattern" onOffDecoder)
                (JD.field "backgroundColor" backgroundColorDecoder)
                (JD.field "titleAnimation" onOffDecoder)
                (JD.field "palette" paletteDecoder)
                (JD.field "labelState" onOffDecoder)
            )


onOffDecoder : JD.Decoder OnOff
onOffDecoder =
    let
        boolToOnOff b =
            if b then
                On

            else
                Off
    in
    JD.map boolToOnOff JD.bool


backgroundColorDecoder : JD.Decoder BackgroundColor
backgroundColorDecoder =
    let
        getBgColor val =
            case val of
                "BluePurple" ->
                    JD.succeed BluePurple

                "DarkMode" ->
                    JD.succeed DarkMode

                _ ->
                    JD.fail "Invalid Background Color"
    in
    JD.string |> JD.andThen getBgColor


paletteDecoder : JD.Decoder Palette.Option
paletteDecoder =
    let
        getPalette val =
            case Palette.nameToOption val of
                Just palette ->
                    JD.succeed palette

                Nothing ->
                    JD.fail "Invalid Palette"
    in
    JD.string |> JD.andThen getPalette


serialize : Model -> String
serialize model =
    JE.encode 0 (toJson model)


toJson : Model -> JE.Value
toJson model =
    JE.object
        [ ( "backgroundAnimation", encodeOnOff model.backgroundAnimation )
        , ( "backgroundPattern", encodeOnOff model.backgroundPattern )
        , ( "backgroundColor", encodeBackgroundColor model.backgroundColor )
        , ( "titleAnimation", encodeOnOff model.titleAnimation )
        , ( "palette", encodePalette model.palette )
        , ( "labelState", encodeOnOff model.labelState )
        ]


encodeOnOff : OnOff -> JE.Value
encodeOnOff onOff =
    case onOff of
        On ->
            JE.bool True

        Off ->
            JE.bool False


encodeBackgroundColor : BackgroundColor -> JE.Value
encodeBackgroundColor backgroundColor =
    case backgroundColor of
        BluePurple ->
            JE.string "BluePurple"

        DarkMode ->
            JE.string "DarkMode"


encodePalette : Palette.Option -> JE.Value
encodePalette palette =
    JE.string (Palette.optionNames palette)
