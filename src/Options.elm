module Options exposing (OnOff(..), OptionValues, animationStates, onOffStates)


type alias OptionValues v =
    ( List v, v -> String )


type OnOff
    = On
    | Off


onOffVariants =
    [ On
    , Off
    ]


animationStateStrings : OnOff -> String
animationStateStrings onOff =
    case onOff of
        On ->
            "Animated"

        Off ->
            "Stopped"


animationStates : OptionValues OnOff
animationStates =
    ( onOffVariants, animationStateStrings )


onOffStateStrings : OnOff -> String
onOffStateStrings onOff =
    case onOff of
        On ->
            "On"

        Off ->
            "Off"


onOffStates : OptionValues OnOff
onOffStates =
    ( onOffVariants, onOffStateStrings )
