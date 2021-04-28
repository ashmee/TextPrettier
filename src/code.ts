import Typograf from 'typograf'
import cloneDeep from 'lodash-es/cloneDeep'
import { makeSuccessMessage } from './utils'

const initSettings = {}

const setPluginSettings = async (config) => {
    await figma.clientStorage.setAsync('TextPrettierPlugin', config)
}

const getPluginSettings = async () => {
    const currentSettings = await figma.clientStorage.getAsync('TextPrettierPlugin')
    if (!currentSettings) await setPluginSettings(initSettings)

    return currentSettings
}

figma.ui.onmessage = async (msg) => {
    if (msg.type === 'close') {
        figma.ui.close()
    }

    if (msg.type === 'updatePluginState') {
        await setPluginSettings(msg.newPluginState)
    }
}

if (figma.command === 'settings') {
    console.log(figma.clientStorage)

    figma.showUI(__html__, { width: 200, height: 214 })
}

//
//
// if (figma.command === "prettyAll") {
//   const textNodesOnCurrentPage = figma.currentPage.findAll(
//       (node) => node.type === 'TEXT',
//   );
//
//   if (!textNodesOnCurrentPage || textNodesOnCurrentPage.length === 0) {
//     figma.closePlugin("prettyAll not finded.");
//   }
//
//   figma.closePlugin(`${textNodesOnCurrentPage.length}`);
// }
//
// if (figma.command === "pretty") {
//
//
//
//
// }
//
{
    getPluginSettings()
    Typograf.addRule({
        name: 'common/other/trailingPreposition',
        index: 1320,
        handler: (text) => text.replace(/(?<=[^a-zа-яё][a-zа-яё]{1,2})\s/giu, '\u00A0'),
    })

    const typografSettings = {
        locale: ['ru', 'en-US'],
        enableRule: [
            'ru/money/ruble',
            'common/number/digitGrouping',
            'common/other/trailingPreposition',
        ],
    }

    const tp = new Typograf(typografSettings)

    const selection = figma.currentPage.selection

    if (selection.length === 0) {
        figma.closePlugin('Choose some text.')
    }

    const textNodesSelection = selection.filter((item) => item.type === 'TEXT')

    if (textNodesSelection.length === 0) {
        figma.closePlugin('Choose some text.')
    }

    const clonedTextSelection = cloneDeep(textNodesSelection)

    const setPlainTypo = async (item) => {
        const fontInfo = {
            family: item.fontName.family,
            style: item.fontName.style,
        }
        await figma.loadFontAsync(fontInfo)

        item.characters = tp.execute(item.characters)
        figma.closePlugin(makeSuccessMessage())
    }

    const updateStyles = async (textNode, styleObject) => {
        if (textNode.hasMissingFont) {
            figma.closePlugin(
                'Text uses a font currently not available in the document. Add or replace missing font first'
            )
        }
        for (const item of styleObject) {
            const index = styleObject.indexOf(item)
            const nextIndex = index + 1
            const {
                fontName,
                fontSize,
                textCase,
                textDecoration,
                textStyleId,
                fills,
                fillStyleId,
            } = item
            await figma.loadFontAsync(fontName)
            textNode.setRangeFontName(index, nextIndex, fontName)
            textNode.setRangeFontSize(index, nextIndex, fontSize)
            textNode.setRangeTextCase(index, nextIndex, textCase)
            textNode.setRangeTextDecoration(index, nextIndex, textDecoration)
            textNode.setRangeLetterSpacing(index, nextIndex, textDecoration)
            textNode.setRangeTextStyleId(index, nextIndex, textStyleId)
            textNode.setRangeFills(index, nextIndex, fills)
            textNode.setRangeFillStyleId(index, nextIndex, fillStyleId)
        }

        // styleObject.forEach(async (item, index) => {
        //     await figma.loadFontAsync(item.fontName)
        //     textNode.setRangeFontName(index, index + 1, item.fontName)
        //     textNode.setRangeFontSize(index, index + 1, item.fontSize)
        //     textNode.setRangeTextCase(index, index + 1, item.textCase)
        //     textNode.setRangeTextDecoration(
        //         index,
        //         index + 1,
        //         item.textDecoration
        //     )
        //     textNode.setRangeLetterSpacing(
        //         index,
        //         index + 1,
        //         item.textDecoration
        //     )
        //     textNode.setRangeTextStyleId(index, index + 1, item.textStyleId)
        //     textNode.setRangeFills(index, index + 1, item.fills)
        //     textNode.setRangeFillStyleId(index, index + 1, item.fillStyleId)
        // })
        figma.closePlugin(makeSuccessMessage())
    }

    const updateText = async (item) => {
        const styleObject = []

        const charLength = item.characters.length
        for (let i = 0; i < charLength; i++) {
            const nextIndex = i + 1

            await figma.loadFontAsync(item.getRangeFontName(i, nextIndex))

            const fontName = await item.getRangeFontName(i, nextIndex)
            const fontSize = await item.getRangeFontSize(i, nextIndex)
            const textCase = await item.getRangeTextCase(i, nextIndex)
            const textDecoration = await item.getRangeTextDecoration(i, nextIndex)
            const letterSpacing = await item.getRangeLetterSpacing(i, nextIndex)
            const textStyleId = await item.getRangeTextStyleId(i, nextIndex)
            const fills = await item.getRangeFills(i, nextIndex)
            const fillStyleId = await item.getRangeFillStyleId(i, nextIndex)

            const currentCharacterStyle = {
                fontName: fontName,
                fontSize: fontSize,
                textCase: textCase,
                textDecoration: textDecoration,
                letterSpacing: letterSpacing,
                textStyleId: textStyleId,
                fills: fills,
                fillStyleId: fillStyleId,
            }

            styleObject.push(currentCharacterStyle)
        }
        item.characters = tp.execute(item.characters)
        await updateStyles(item, styleObject)
    }

    const isContainsMixedType = (item): boolean =>
        [
            item.fontName,
            item.fontSize,
            item.textCase,
            item.textDecoration,
            item.letterSpacing,
            item.lineHeight,
            item.textStyleId,
        ].some((itemProp) => typeof itemProp == 'symbol')

    clonedTextSelection.forEach((item: SceneNode) => {
        isContainsMixedType(item) ? updateText(item) : setPlainTypo(item)
    })
}
