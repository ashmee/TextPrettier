import Typograf from 'typograf';
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep';


const selection = figma.currentPage.selection;
if (selection.length === 0) {
  figma.closePlugin("Choose some text.");
}

const textNodesSelection = selection.filter(item => item.type === "TEXT");
if (textNodesSelection.length === 0) {
  figma.closePlugin("Choose some text.");
}


Typograf.addRule({
  name: 'common/other/trailingPreposition',
  index: 1320,
  handler: (text) => text.replace(/([\s][a-zа-яё]{1,2})[\s]/igu, '$1\u00A0')
});


const typografSettings = {
  locale: ['ru', 'en-US'],
  enableRule: ['ru/money/ruble', 'common/number/digitGrouping', 'common/other/trailingPreposition'],
};
const tp = new Typograf(typografSettings);
const defaultFontName: FontName = { family: "Roboto", style: "Regular" };
const clonedTextSelection = cloneDeep(textNodesSelection);
const emojis: string[] = [
  '😄', '😃', '😀', '😊', '😉', '😍', '😘', '😚', '😗', '😙', '😜', '😝', '😛', '😁', '😅', '😱', '😆', '😋', '😎', '😇', '😏', '👮', '👶', '👧', '👩', '👴', '👵', '👱', '👼', '👸', '😺', '😸', '😻', '🙀', '🙈', '🙉', '👽', '🔥', '🔥🔥', '🔥🔥🔥', '✨', '🌟', '👍', '👌', '✌', '👋', '🙏', '💪', '🐱', '🐹', '🐰',  '🐨', '🐼', '🐳', '🐾', '🍀', '🌹', '🌴', '🌞', '🌝', '🌚', '🌜', '🌛', '⭐', '🌈', '🌊', '💝', '👻', '🎅', '🎄', '🎁', '🎉', '🏆', '🏄', '☕', '🍩', '🍒', '🌉', '🎡', '🚀' , '💯', '✔',
];
const finalMessages: string[] = ['Da', 'Darīts', 'Done', 'Done', 'e Bërë', 'Erledigt', 'Fatto', 'Feito', 'Feito', 'Ferdig', 'Fet', 'Færdig', 'Gedaan', 'Gert', 'Gjort', 'Gotowe', 'Hecho', 'Hotovo', 'Hotový', 'Isir', 'Končano', 'Kész', 'Padaryta', 'Rinneadh', 'Tehtud', 'Tehty', 'Terminat', 'Terminé', 'You\'re BREATHTAKING!', 'Učinio', 'Готово', 'Завршено', 'Зроблена', 'Зроблено', 'Свършен', 'Сделано', 'Ready', 'Ok.']
const getRandomEmoji = (): string => `${finalMessages[Math.floor(Math.random() * finalMessages.length)]} ${emojis[Math.floor(Math.random() * emojis.length)]}`


const setPlainTypo = async (item) => {
  const fontInfo = {
    family: item.fontName.family,
    style: item.fontName.style
  }
  await figma.loadFontAsync(fontInfo);
  item.characters = tp.execute(item.characters);
  figma.closePlugin(getRandomEmoji());
}


const upDateStyles = async (textNode, styleObject) => {
  styleObject.forEach(async (item, index) => {
    await figma.loadFontAsync(item.fontName);
    textNode.setRangeFontName(index, index + 1, item.fontName);
    textNode.setRangeFontSize(index, index + 1, item.fontSize);
    textNode.setRangeTextCase(index, index + 1, item.textCase);
    textNode.setRangeTextDecoration(index, index + 1, item.textDecoration);
    textNode.setRangeLetterSpacing(index, index + 1, item.textDecoration);
    textNode.setRangeTextStyleId(index, index + 1, item.textStyleId);
    textNode.setRangeFills(index, index + 1, item.fills);
    textNode.setRangeFillStyleId(index, index + 1, item.fillStyleId);
  })
  figma.closePlugin(getRandomEmoji());
}


const updateText = async (item, index) => {
  const styleObject = [];

  const charLength = item.characters.length;
  for (let i = 0; i < charLength; i++) {
    await figma.loadFontAsync(item.getRangeFontName(i, i + 1));
    const fontName = await item.getRangeFontName(i, i + 1);
    const fontSize = await item.getRangeFontSize(i, i + 1);
    const textCase = await item.getRangeTextCase(i, i + 1);
    const textDecoration = await item.getRangeTextDecoration(i, i + 1);
    const letterSpacing = await item.getRangeLetterSpacing(i, i + 1);
    const textStyleId = await item.getRangeTextStyleId(i, i + 1);
    const fills = await item.getRangeFills(i, i + 1);
    const fillStyleId = await item.getRangeFillStyleId(i, i + 1);

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

    styleObject.push(currentCharacterStyle);
  }

  item.characters = tp.execute(item.characters);
  upDateStyles(item, styleObject)
}


const isContainsMixedType = (item): boolean =>
  [item.fontName, item.fontSize, item.textCase, item.textDecoration, item.letterSpacing, item.lineHeight, item.textStyleId]
    .some(itemProp => typeof itemProp == 'symbol')


clonedTextSelection.forEach((item, index: number) => {
  if (item.hasMissingFont) {
    figma.closePlugin("Text uses a font currently not available to the document. Add or replace missing font first");
  }

  isContainsMixedType(item)
    ? updateText(item, index)
    : setPlainTypo(item)
});
