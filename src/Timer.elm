module Timer exposing (Timer, init, start, stop, update)

import Time exposing (Posix, millisToPosix, posixToMillis)


type alias Timer =
    { time : Int
    , lastTime : Posix
    , running : Bool
    }


init : Timer
init =
    { time = 0
    , lastTime = millisToPosix 0
    , running = False
    }


update : Posix -> Timer -> Timer
update newTime ({ running, time, lastTime } as timer) =
    if running then
        { timer
            | time = time + (posixToMillis newTime - posixToMillis lastTime)
            , lastTime = newTime
        }

    else
        { timer | lastTime = newTime }


start : Timer -> Timer
start timer =
    { timer
        | time = 0
        , running = True
    }


stop : Timer -> Timer
stop timer =
    { timer | running = False }
