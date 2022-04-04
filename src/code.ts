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
    getPluginSettings().then((data) => {
        figma.showUI(__html__, { width: 200, height: 200, visible: false })
        figma.ui.postMessage(data)
        figma.ui.show()
    })
}

if (figma.command === 'pretty') {
    initAndPrettyText()
}
