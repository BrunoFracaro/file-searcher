// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate() {

	// this line will be run on initialization
	await markFilesAsUnused();

	// This listener will execute when a file is saved
	vscode.workspace.onDidSaveTextDocument(async () => {
		await markFilesAsUnused();
	});

}

async function markFilesAsUnused() {
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
	const unusedDecorationProvider = new UnusedDecorationProvider(notUsed);
	vscode.window.registerFileDecorationProvider(unusedDecorationProvider);
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

let instance;

class UnusedDecorationProvider {
	constructor(unused) {
		this.disposables = [];
		this.disposables.push(vscode.window.registerFileDecorationProvider(this));
		this.unused = unused
		if (instance) {
			instance.dispose();
			instance = null;
		}

		instance = this;
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
				color: new vscode.ThemeColor("charts.orange"),
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
