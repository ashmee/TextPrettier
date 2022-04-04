import { cloneDeep } from 'lodash-es'
import { makeSuccessMessage } from './utils'
import Typograf from 'typograf'
import { getPluginSettings } from './settings'

const initTP = async () => {
    Typograf.addRule({
        name: 'common/other/trailingPreposition',
        index: 1320,
        handler: (text) => text.replace(/(?<=[^a-zа-яё][a-zа-яё]{1,2})\s/giu, '\u00A0'),
    })

    const typografSettings = await getPluginSettings()

    return new Typograf(typografSettings)
}

const getSelectedTextNodes = () => {
    const selection = figma.currentPage.selection as SceneNode[]

    if (selection.length === 0) {
        figma.closePlugin('Choose some text for typography.')
    }
    const textNodesSelection = selection.filter((item) => item.type === 'TEXT')

    if (textNodesSelection.length === 0) {
        figma.closePlugin(
            `You selected ${selection.length} nodes, but there is no text among them. Choose some text.`
        )
    }

    return textNodesSelection
}

export const initAndPrettyText = async () => {
    const textNodes = getSelectedTextNodes()
    const clonedTextSelection = cloneDeep(textNodes)

    let tp = await initTP()

    const updateStyles = async (textNode, styleObject) => {
        if (textNode.hasMissingFont) {
            figma.closePlugin(
                'Text uses a font currently not available in the document. Add or replace missing font first'
            )
        }

        const length =
            textNode.characters.length === styleObject.length
                ? styleObject.length
                : textNode.characters.length

        for (let index = 0; index < length; index++) {
            try {
                const nextIndex = index + 1
                const textStyle = styleObject[index]?.textStyleId
                if (textStyle) {
                    await textNode.setRangeTextStyleId(index, nextIndex, textStyle)
                } else {
                    const {
                        fontName,
                        fontSize,
                        textCase,
                        textDecoration,
                        letterSpacing,
                        lineHeight,
                        listOptions,
                        indentation,
                        fills,
                        fillStyleId,
                    } = styleObject[index]
                    await textNode.setRangeFontName(index, nextIndex, fontName)
                    await textNode.setRangeFontSize(index, nextIndex, fontSize)
                    await textNode.setRangeTextCase(index, nextIndex, textCase)
                    await textNode.setRangeTextDecoration(index, nextIndex, textDecoration)
                    await textNode.setRangeFills(index, nextIndex, fills)
                    await textNode.setRangeLetterSpacing(index, nextIndex, letterSpacing)
                    await textNode.setRangeLineHeight(index, nextIndex, lineHeight)
                    await textNode.setRangeListOptions(index, nextIndex, listOptions)
                    await textNode.setRangeIndentation(index, nextIndex, indentation)
                    await textNode.setRangeFillStyleId(index, nextIndex, fillStyleId)
                }
            } catch (error) {
                console.error(
                    error,
                    'Try to choose this text node and start plugin again:',
                    textNode.characters
                )
                figma.closePlugin(
                    `Cant apply Figma styles on text: ${textNode.characters}. Try to choose this text manually`
                )
            }
        }
    }

    const updateText = async (item) => {
        const styleObject = []
        try {
            await Promise.all(
                item.getRangeAllFontNames(0, item.characters.length).map(figma.loadFontAsync)
            )
        } catch (error) {
            figma.closePlugin('Cant load some font')
        }

        const charLength = item.characters.length

        for (let i = 0; i < charLength; i++) {
            const nextIndex = i + 1
            try {
                const textStyleId = await item.getRangeTextStyleId(i, nextIndex)
                if (textStyleId) {
                    styleObject.push({ textStyleId })
                } else {
                    const fontName = await item.getRangeFontName(i, nextIndex)
                    const fontSize = await item.getRangeFontSize(i, nextIndex)
                    const textCase = await item.getRangeTextCase(i, nextIndex)
                    const textDecoration = await item.getRangeTextDecoration(i, nextIndex)
                    const letterSpacing = await item.getRangeLetterSpacing(i, nextIndex)
                    const fills = await item.getRangeFills(i, nextIndex)
                    const fillStyleId = await item.getRangeFillStyleId(i, nextIndex)
                    const lineHeight = await item.getRangeLineHeight(i, nextIndex)
                    const listOptions = await item.getRangeListOptions(i, nextIndex)
                    const indentation = await item.getRangeIndentation(i, nextIndex)

                    const currentCharacterStyle = {
                        fontName,
                        fontSize,
                        textCase,
                        textDecoration,
                        letterSpacing,
                        textStyleId,
                        lineHeight,
                        listOptions,
                        indentation,
                        fills,
                        fillStyleId,
                    }

                    styleObject.push(currentCharacterStyle)
                }
            } catch (error) {
                figma.closePlugin('Plugin cant get text styles from Figma')
            }
        }
        item.characters = tp.execute(item.characters)
        await updateStyles(item, styleObject)
    }

    async function processArray(array) {
        for (const item of array) {
            await updateText(item)
        }
    }

    await processArray(clonedTextSelection)

    figma.closePlugin(makeSuccessMessage())
}
