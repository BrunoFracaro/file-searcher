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

	// This listener will execute when a file is renamed
	vscode.workspace.onDidRenameFiles(async () => {
		await markFilesAsUnused();
	});
}

async function markFilesAsUnused() {
	// get all image files and stores the path in "allImages" array
	const allImages = await getAllImageFiles()

	// get all files and stores the path in "allFiles" array
	const allFiles = await getAllFiles()

	// initialize array of not used images
	const notUsed = allImages

	// run evey file to check if any image appers on the file
	for (const item of allFiles) {

		const text = await readFileContent(item);

		for (const img of notUsed) {
			// if image appers on the file, remove it from notUsed array
			if (text.includes(img.split('/')[img.split('/').length - 1])) {
				notUsed.splice(notUsed.indexOf(img), 1)
			}
		}

	}

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
	async provideFileDecoration(uri) {
		const show = this.unused.includes(uri.path)
		if (show) {
			const newUnused = this.unused.filter(item => item !== uri.path)
			this.unused = newUnused

			const badge = await vscode.workspace.getConfiguration('unused-images-highlighter').get('badge');

			const propagate = await vscode.workspace.getConfiguration('unused-images-highlighter').get('propagate');

			const fontColor = await vscode.workspace.getConfiguration('unused-images-highlighter').get('fontColor');

			const colors = {
				red: "charts.red",
				blue: "charts.blue",
				yellow: "charts.yellow",
				orange: "charts.orange",
				green: "charts.green",
				purple: "charts.purple",
			}

			const color = colors[fontColor]

			return {
				badge: badge ? "Un" : '',
				tooltip: "Unusd media file in workspace",
				color: new vscode.ThemeColor(color),
				propagate: propagate
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
