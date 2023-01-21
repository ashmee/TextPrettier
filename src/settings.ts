const initSettings = {
    locale: ['ru', 'en-US'],
    enableRule: [
        'ru/money/ruble',
        'common/number/digitGrouping',
        'common/other/trailingPreposition',
    ],
} as const

export const setPluginSettings = async (config) => {
    try {
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
    } catch (e) {
        console.error(`failed set data to figma client storage with locale ${config.locale}`, e)
    }
}

export const getPluginSettings = async () => {
    try {
        const currentSettings = await figma.clientStorage.getAsync('TextPrettierPlugin')
        if (!currentSettings || !currentSettings?.locale || currentSettings?.locale?.length === 0) {
            await setPluginSettings(initSettings)
        }
        return currentSettings
    } catch (e) {
        console.error('failed get settings  ', e)
    }
}
