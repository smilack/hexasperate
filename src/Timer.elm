{-
   Copyright 2020 Tom Smilack

   This file is part of Hexasperate.

   Hexasperate is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   Hexasperate is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with Hexasperate.  If not, see <https://www.gnu.org/licenses/>.
-}


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
