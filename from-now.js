"use strict"

define("from-now",
{
	extends: "time",
	props: { short: Boolean },
	
	connect()
	{
		let attr = this.closest("[lang]")

		this._lang = attr ? attr.lang : "en"
	},

	disconnect()
	{
		clearTimeout(this._id)
	},

	attrChange()
	{
		let { short } = this
		let lang = this._lang + (short ? "-short" : "")
		this._date = moment(this.dateTime).locale(lang)

		this.title = this._date.format(short ? "lll" : "LLLL")
		this.render()
	},

	render()
	{
		clearTimeout(this._id)

		let date = this._date

		this.textContent = date.fromNow()
		this._id = setTimeout(() =>
		{
			this.textContent = date.fromNow()
			this.render()
		},  timeout(date))
	},
})
