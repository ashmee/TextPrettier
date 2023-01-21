import * as React from 'react'
import { useCallback, useLayoutEffect, useMemo } from 'react'
import * as ReactDOM from 'react-dom'
import { LOCALE } from './locales'
import './ui.css'

const getLangOptions = (): JSX.Element[] => {
    const options = []
    for (const [short, lang] of Object.entries(LOCALE)) {
        options.push(
            <option key={short} value={short}>
                {lang}
            </option>
        )
    }

    return options
}

const App = () => {
    const [locale, setLocale] = React.useState('')
    const [digitGrouping, setDigitGrouping] = React.useState<boolean>(false)
    const [disabled, setDisabled] = React.useState<boolean>(false)
    const needShowDigitGroupRule = locale === 'en-US' || locale === 'ru'

    const handlePostMessage = useCallback((event: MessageEvent) => {
        const msg = event.data.pluginMessage
        setLocale(Array.isArray(msg.locale) ? msg.locale[0] : msg.locale)

        setDigitGrouping(!!msg?.enableRule)
    }, [])

    useLayoutEffect(() => {
        window.addEventListener('message', handlePostMessage)

        return () => {
            window.removeEventListener('keydown', handlePostMessage)
        }
    }, [handlePostMessage])

    const updateSubmit = useCallback(
        (event) => {
            event.preventDefault()
            setDisabled(true)
            const data = new FormData(event.target)
            const value = Object.fromEntries(data.entries())
            const postData = {
                locale: value.languages,
                enableRule: digitGrouping || value.digitGrouping === 'on',
            }

            parent.postMessage(
                {
                    pluginMessage: { type: 'updatePluginState', data: postData },
                },
                '*'
            )
        },
        [digitGrouping]
    )

    const handleChange = (event) => {
        setLocale(event.target.value)
    }

    const handleSwitchChange = () => {
        setDigitGrouping((digitGrouping) => !digitGrouping)
    }

    const options = useMemo(() => getLangOptions(), [])

    return (
        <form id="pluginState" onSubmit={updateSubmit}>
            <label className="point" htmlFor="languages">
                Language{' '}
            </label>
            <select value={locale} onChange={handleChange} id="languages" name="languages">
                {options}
            </select>
            <label className={`point ${needShowDigitGroupRule ? '' : 'hide'}`}>
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
