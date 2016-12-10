"use strict"

class Comp extends React.Component
{
    constructor()
    {
        super(...arguments)

        this.state =
        {
            date: new Date,
        }

        this.numberChange = ({ target }) =>
        {
            let date = target.valueAsDate

            this.setState({ date })
        }

        this.checkChange = ({ target }) =>
        {
            let isShort = target.checked ? "" : null

            this.setState({ isShort })
        }
    }

    render()
    {
        let { date, isShort } = this.state

        return <div>
            <hr />
            <input type="checkbox" onChange={this.checkChange} />
            short
            <br />
            <input type="date" onChange={this.numberChange} value={+date} />
            <br />
            <time is="time-ago" dateTime={date.toISOString()} data-is-short={isShort} />
        </div>
    }
}

ReactDOM.render(<section>
    <h3>Web Components Workshop</h3>
    <Comp />
    <Comp />
</section>, document.querySelector("main"))
