"use strict"

class App extends React.Component
{
	constructor()
	{
		super(...arguments)

		let date = new Date

		this.state = { date }
		this.handleClick = ({ target }) =>
		{
			date.setTime(target.valueAsNumber)
			this.forceUpdate()
		}
	}

	render()
	{
		let { date } = this.state
		let iso = date.toISOString()

		return <section>
			<h3>Web Components Workshop</h3>
			<input type="number" step="5e4" onChange={this.handleClick} value={+date} />
			<ul>
				<li><time is="from-now" dateTime={iso} /></li>
				<li><time is="from-now" dateTime={iso} data-short /></li>
			</ul>
		</section>
	}
}

ReactDOM.render(<App />, document.querySelector("main"))