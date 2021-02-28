// import Typograf from 'typograf'
// import cloneDeep from 'lodash-es/cloneDeep'
// import { makeSuccsessMessage } from './utils'

const setPluginSettings = async (config) => {
    await figma.clientStorage.setAsync('TextPrettierPlugin', config)
}

// const getPluginSettings = async () => {
//     return await figma.clientStorage.getAsync('TextPrettierPlugin')
// }

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
//
// Typograf.addRule({
//   name: "common/other/trailingPreposition",
//   index: 1320,
//   handler: (text) =>
//     text.replace(/(?<=[^a-zа-яё][a-zа-яё]{1,2})\s/giu, "\u00A0"),
// });
//
// const typografSettings = {
//   locale: ["ru", "en-US"],
//   enableRule: [
//     "ru/money/ruble",
//     "common/number/digitGrouping",
//     "common/other/trailingPreposition",
//   ],
// };
//
// const tp = new Typograf(typografSettings);
//
//
//
// const selection = figma.currentPage.selection;
//
// if (selection.length === 0) {
//   figma.closePlugin("Choose some text.");
// }
//
// const textNodesSelection = selection.filter((item) => item.type === "TEXT");
//
// if (textNodesSelection.length === 0) {
//   figma.closePlugin("Choose some text.");
// }
//
// const clonedTextSelection = cloneDeep(textNodesSelection);
//
//
// const setPlainTypo = async (item) => {
//   const fontInfo = {
//     family: item.fontName.family,
//     style: item.fontName.style,
//   };
//   await figma.loadFontAsync(fontInfo);
//
//   item.characters = tp.execute(item.characters);
//   figma.closePlugin(makeSuccsessMessage());
// };
//
// const updateStyles = async (textNode, styleObject) => {
//   if (textNode.hasMissingFont) {
//     figma.closePlugin(
//       "Text uses a font currently not available in the document. Add or replace missing font first"
//     );
//   }
//   styleObject.forEach(async (item, index) => {
//     await figma.loadFontAsync(item.fontName);
//     textNode.setRangeFontName(index, index + 1, item.fontName);
//     textNode.setRangeFontSize(index, index + 1, item.fontSize);
//     textNode.setRangeTextCase(index, index + 1, item.textCase);
//     textNode.setRangeTextDecoration(index, index + 1, item.textDecoration);
//     textNode.setRangeLetterSpacing(index, index + 1, item.textDecoration);
//     textNode.setRangeTextStyleId(index, index + 1, item.textStyleId);
//     textNode.setRangeFills(index, index + 1, item.fills);
//     textNode.setRangeFillStyleId(index, index + 1, item.fillStyleId);
//   });
//   figma.closePlugin(makeSuccsessMessage());
// };
//
// const updateText = async (item, index) => {
//   const styleObject = [];
//
//   const charLength = item.characters.length;
//   for (let i = 0; i < charLength; i++) {
//     await figma.loadFontAsync(item.getRangeFontName(i, i + 1));
//     const fontName = await item.getRangeFontName(i, i + 1);
//     const fontSize = await item.getRangeFontSize(i, i + 1);
//     const textCase = await item.getRangeTextCase(i, i + 1);
//     const textDecoration = await item.getRangeTextDecoration(i, i + 1);
//     const letterSpacing = await item.getRangeLetterSpacing(i, i + 1);
//     const textStyleId = await item.getRangeTextStyleId(i, i + 1);
//     const fills = await item.getRangeFills(i, i + 1);
//     const fillStyleId = await item.getRangeFillStyleId(i, i + 1);
//
//     const currentCharacterStyle = {
//       fontName: fontName,
//       fontSize: fontSize,
//       textCase: textCase,
//       textDecoration: textDecoration,
//       letterSpacing: letterSpacing,
//       textStyleId: textStyleId,
//       fills: fills,
//       fillStyleId: fillStyleId,
//     };
//
//     styleObject.push(currentCharacterStyle);
//   }
//   item.characters = tp.execute(item.characters);
//   await updateStyles(item, styleObject);
// };
//
// const isContainsMixedType = (item): boolean =>
//   [
//     item.fontName,
//     item.fontSize,
//     item.textCase,
//     item.textDecoration,
//     item.letterSpacing,
//     item.lineHeight,
//     item.textStyleId,
//   ].some((itemProp) => typeof itemProp == "symbol");
//
//
// clonedTextSelection.forEach((item: SceneNode, index: number) => {
//   isContainsMixedType(item) ? updateText(item, index) : setPlainTypo(item);
// });
