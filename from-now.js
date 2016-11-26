"use strict"

class FromNow extends HTMLTimeElement
{
	get short()
	{
		return "short" in this.dataset
	}

	set short(value)
	{
		if (value) this.dataset.short = ""
		else delete this.dataset.short
	}

	connectedCallback()
	{
		let attr = this.closest("[lang]")

		this._lang = attr ? attr.lang : "en"
	}

	disconnectedCallback()
	{
		clearTimeout(this._id)
	}

	attributeChangedCallback()
	{
		let { short } = this
		let lang = this._lang + (short ? "-short" : "")
		this._date = moment(this.dateTime).locale(lang)

		this.title = this._date.format(short ? "lll" : "LLLL")
		this.render()
	}

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
	}
}

FromNow.observedAttributes =
[
	"datetime",
	"data-short",
]

customElements.define("from-now", FromNow,
{
	extends: "time",
})
