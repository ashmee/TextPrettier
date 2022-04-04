import * as React from 'react'
import { useEffect } from 'react'
import * as ReactDOM from 'react-dom'
import { LOCALE } from './locales'
import './ui.css'

const App = () => {
    const [locale, setLocale] = React.useState('')
    const [digitGrouping, setDigitGrouping] = React.useState<boolean>(false)
    const [disabled, setDisabled] = React.useState<boolean>(false)

    useEffect(() => {
        window.addEventListener('message', (event: MessageEvent) => {
            setLocale(
                Array.isArray(event.data.pluginMessage.locale)
                    ? event.data.pluginMessage.locale[0]
                    : event.data.pluginMessage.locale
            )

            setDigitGrouping(
                event.data.pluginMessage?.enableRule?.includes('common/number/digitGrouping') ||
                    false
            )
        })
    }, [])

    const updateSubmit = (event) => {
        event.preventDefault()
        setDisabled(true)
        const data = new FormData(event.target)
        const value = Object.fromEntries(data.entries())
        const postData = {
            locale: value.languages,
            enableRule: digitGrouping && 'common/number/digitGrouping',
        }

        parent.postMessage(
            {
                pluginMessage: { type: 'updatePluginState', data: postData },
            },
            '*'
        )
    }

    const handleChange = (event) => {
        setLocale(event.target.value)
    }

    const handleSwitchChange = () => {
        setDigitGrouping((digitGrouping) => !digitGrouping)
    }

    const options = []
    for (const [short, lang] of Object.entries(LOCALE)) {
        options.push(
            <option key={short} value={short}>
                {lang}
            </option>
        )
    }
    
    return (
        <form id="pluginState" onSubmit={updateSubmit}>
            <label className="point" htmlFor="languages">
                Language{' '}
            </label>
            <select value={locale} onChange={handleChange} id="languages" name="languages">
                {options}
            </select>
            <label className="point">
                Digit grouping
                <input
                    className="switch"
                    name="digitGrouping"
                    type="checkbox"
                    checked={digitGrouping}
                    onChange={handleSwitchChange}
                />
            </label>

            <button disabled={disabled} id="updatePluginState" type="submit">
                Save settings
            </button>
        </form>
    )
}

ReactDOM.render(<App />, document.getElementById('textprettier'))
