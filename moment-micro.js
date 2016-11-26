moment.locale("en-short",
{
    relativeTime:
    {
        past: "%s",
        s: "now",
        m: "1m",
        mm: "%dm",
        h: "1h",
        hh: "%dh",
        d: "1d",
        dd: "%dd",
        M: "1mon",
        MM: "%dmon",
    },
})

moment.locale("ru-short",
{
    relativeTime:
    {
        future: "через",
        past: "%s",
        s: "сейчас",
        m: "1м",
        mm: "%dм",
        h: "1ч",
        hh: "%dч",
        d: "1д",
        dd: "%dд",
        M: "1мес",
        MM: "%dмес",
    },
})

const th = moment.relativeTimeThreshold
const min = 6e4
const hour = 60 * min
const day = 24 * hour
const month = 30 * day

const timeout = date =>
{
    let d = Math.abs(Date.now() - date)
    if (d < th("m") * min) return min
    if (d < th("h") * hour) return hour
    if (d < th("d") * day) return day

    return month
}
