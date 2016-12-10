"use strict"

define("time-ago",
{
	extends: "time",
	props:
	{
		dateTime: Date,
		isShort: Boolean,
	},

	connect()
	{
        let attr = this.closest("[lang]")

        this._lang = attr && attr.lang || "en"
	},

	disconnect()
	{
		clearTimeout(this._id)
	},

	attrChange()
	{
        clearTimeout(this._id)

        let { isShort } = this
        let lang = this._lang + (isShort ? "-short" : "")
        let date = moment(this.dateTime).locale(lang)

        this.title = date.format(isShort ? "lll" : "LLLL")

        const render = () =>
        {
            this.textContent = date.fromNow()
            this._id = setTimeout(render, timeout(date))
        }

        render()
	},
})
