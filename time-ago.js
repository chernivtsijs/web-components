"use strict"

class TimeAgo extends HTMLTimeElement
{
    get dateTime()
    {
        return new Date(super.dateTime)
    }

    set dateTime(value)
    {
        super.dateTime = value instanceof Date
            ? value.toISOString()
            : value 
    }

    get isShort()
    {
        return "isShort" in this.dataset
    }

    set isShort(value)
    {
        let data = this.dataset

        if (value) data.isShort = ""
        else delete data.isShort
    }

    connectedCallback()
    {
        let attr = this.closest("[lang]")

        this._lang = attr && attr.lang || "en"
    }

    disconnectedCallback()
    {
        clearTimeout(this._id)
    }

    attributeChangedCallback()
    {
        let { isShort } = this
        let lang = this._lang + (isShort ? "-short" : "")
        let date = moment(this.dateTime).locale(lang)

        this.title = date.format(isShort ? "lll" : "LLLL")
        this.textContent = date.fromNow()
    }
}

TimeAgo.observedAttributes =
[
    "datetime",
    "data-is-short",
]

customElements.define("time-ago", TimeAgo,
{
    extends: "time",
})
