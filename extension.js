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

		// concat all text in all files for further matching with images names
		let filesCompleteText = ''
		for (const item of allFiles) {
			const text = await readFileContent(item);
			filesCompleteText = filesCompleteText + text
		}

		// get unused images by matching the image name to any mention on the other files, including comments
		const notUsed = allImages.filter(path => !filesCompleteText.includes(path.split('/')[path.split('/').length - 1]))

		// calling countdecorationProvider class to badge the unused images
		const countDecorationProvider = new CountDecorationProvider(notUsed);
		vscode.window.registerFileDecorationProvider(countDecorationProvider);

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from File Searcher Unused Image Highlighter!');
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
	try {
		const document = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
		return document.getText();
	} catch (error) {
		return ''
	}
}

class CountDecorationProvider {
	constructor(unused) {
		this.disposables = [];
		this.disposables.push(vscode.window.registerFileDecorationProvider(this));
		this.unused = unused
	}

	// marking the unused images with an "Un" badge
	provideFileDecoration(uri) {
		const show = this.unused.includes(uri.path)
		if (show) {
			const newUnused = this.unused.filter(item => item !== uri.path)
			this.unused = newUnused
			return {
				badge: "Un",
				tooltip: "Unusd media file in workspace",
				color: "blue",
				propagate: true
			};
		}
	}

	dispose() {
		this.disposables.forEach((d) => d.dispose());
	}
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
