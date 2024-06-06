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

		// get all image files and stores the path in "allImages" array
		const allImages = await getAllImageFiles()

		// get all files and stores the path in "allFiles" array
		const allFiles = await getAllFiles()

		const text = await readFileContent(allFiles[0]);

		console.log(text);

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from File Searcher Unused Image Highlighter9!');
	});

	context.subscriptions.push(disposable);
}

async function getAllImageFiles() {
	const allFilesObj = await vscode.workspace.findFiles('**/*.{png,jpg,jpeg,gif,svg}', '**/node_modules/**');
	const allFilesPath = []
	for (const item of allFilesObj) {
		allFilesPath.push(item.path);
	}
	return allFilesPath;
}

async function getAllFiles() {
	const allFilesObj = await vscode.workspace.findFiles('**/*', '**/node_modules/**');
	const allFilesPath = []
	for (const item of allFilesObj) {
		allFilesPath.push(item.path);
	}
	return allFilesPath;
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
