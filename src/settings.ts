const initSettings = {
    locale: ['ru', 'en-US'],
    enableRule: [
        'ru/money/ruble',
        'common/number/digitGrouping',
        'common/other/trailingPreposition',
    ],
} as const

export const setPluginSettings = async (config) => {
    if (config.locale === 'ru') {
        await figma.clientStorage.setAsync('TextPrettierPlugin', {
            locale: initSettings.locale,
            enableRule: [
                'ru/money/ruble',
                config.enableRule ? 'common/number/digitGrouping' : '',
                'common/other/trailingPreposition',
            ],
        })
    } else if (config.locale === 'en-US') {
        await figma.clientStorage.setAsync('TextPrettierPlugin', {
            locale: ['en-US', 'ru'],
            enableRule: config.enableRule,
        })
    } else {
        await figma.clientStorage.setAsync('TextPrettierPlugin', config)
    }
}

export const getPluginSettings = async () => {
    const currentSettings = await figma.clientStorage.getAsync('TextPrettierPlugin')
    if (!currentSettings || !currentSettings?.locale || currentSettings?.locale?.length === 0)
        await setPluginSettings(initSettings)

    return currentSettings
}
