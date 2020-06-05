<a href="https://www.figma.com/community/plugin/783077214649465682/Text-Prettier" rel="noopener" target="_blank">
  <p><img src="./assets/logo.png" alt="Logo" width="72" height="72" /></p>
</a>
<a href="https://www.figma.com/community/plugin/783077214649465682/Text-Prettier" rel="noopener" target="_blank">
  <h1>TextPrettier</h1>
</a>
<h6>
  Figma plugin to make text legible, readable,<br />
  and appealing when displayed.
</h6>

#### Installation from official Figma Plugin store

Click and install. Link:
[figma.com/Text-Prettier](https://www.figma.com/community/plugin/783077214649465682/Text-Prettier)

<p>
  <a href="https://www.figma.com/community/plugin/783077214649465682/Text-Prettier" rel="noopener" target="_blank">
    <img src="https://www.figma.com/c/plugin/783077214649465682/thumbnail"  alt="info" width=870 height=430>
  </a>
</p>
  
***

> Помогает автоматически расставить неразрывные пробелы, исправить мелкие опечатки, привести кавычки к правильному виду, заменить дефисы на тире в нужных местах и многое другое.

В данном проекте используется [typograf (c)](https://github.com/typograf/typograf) от [hcodes](https://github.com/hcodes)

> Figma plugin to make text legible, readable, and appealing when displayed.

---

### Requirements

You must be using the Figma [Desktop App for Windows or macOS](https://www.figma.com/downloads/).
It is currently not possible to use local builds of a plugin through the web interface.

### Installation

This plugin uses Typescript and Webpack.

#### Installation From Repo

1. Clone this repo `git clone https://github.com/ashmee/TextPrettier.git`
2. Open directory with the project in terminal.
3. Type `npm i`
4. Build files to `./dist` folder: `npx webpack --mode=production -watch`
5. Open `manifest.json` from Figma Desktop App (Follow step 2 from "Installation from Zip")

#### OR

#### Installation From Zip

1. Unzip the `TextPrettier.zip` file somewhere on your computer where you will be able to find it later.
2. Open the Figma desktop app
3. In Figma, on the left-hand sidebar of your dashboard, click “Plugins”
4. On the right-hand sidebar of “Plugins”, next to “Create your own plugin”, click the “plus” icon.
5. In the resulting modal, under “Link existing plugin”, click on “Click to choose a `manifest.json` file”
6. Navigate to the directory that you un-zipped and select the `manifest.json` file.

Once linked, do not move the directory containing the `manifest.json` file. If you do, you will need to re-link it by following the process above, starting with step 2.
