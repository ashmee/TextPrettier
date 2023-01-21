import { getPluginSettings, setPluginSettings } from './settings'
import { initAndPrettyText } from './textProcessing'

figma.ui.onmessage = async (msg) => {
    if (msg.type === 'close') {
        figma.ui.close()
    }

    if (msg.type === 'updatePluginState') {
        await setPluginSettings(msg.data)
        figma.ui.close()
        figma.closePlugin()
    }
}

if (figma.command === 'settings') {
    await figma.clientStorage.getAsync('TextPrettierPlugin')
    const settings = await getPluginSettings()
    figma.showUI(__html__, { width: 200, height: 200, visible: false, themeColors: true })
    figma.ui.postMessage(settings)
    figma.ui.show()
}

if (figma.command === 'pretty') {
    initAndPrettyText()
}
