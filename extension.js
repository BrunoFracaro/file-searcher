// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "file-searcher" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('file-searcher.helloWorld', async function () {
		// The code you place here will be executed every time your command is executed

		const allImagesFilesObj = await vscode.workspace.findFiles('**/*.{png,jpg,jpeg,gif,svg}', '**/node_modules/**');
		const allImagesFilesNames = []
		for (const item of allImagesFilesObj) {
			allImagesFilesNames.push(item.path);
		}

		const allJsFilesObj = await vscode.workspace.findFiles('**/*.js', '**/node_modules/**');
		const allJsFilesNames = []
		for (const item of allJsFilesObj) {
			allJsFilesNames.push(item.path);

			console.log(item.path);
		}

		const text = await readFileContent(allJsFilesNames[0]);

		console.log(text);

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from File Searcher Unused Image Highlighter8!');
	});

	context.subscriptions.push(disposable);
}

async function readFileContent(filePath) {
  const document = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
  return document.getText();
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
