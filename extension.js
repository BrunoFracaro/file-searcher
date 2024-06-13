

const vscode = require('vscode');
const _ = require('lodash'); // Assuming you've installed lodash

let fileContentMap = {};
let unusedImages = [];

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate() {

	// this line will be run on initialization
	await updateUnusedImages();

	// Debounced listener for file saves and renames (adjust delay as needed)
	const debouncedUpdate = _.debounce(updateUnusedImages, 500);

	vscode.workspace.onDidSaveTextDocument(debouncedUpdate);
	vscode.workspace.onDidRenameFiles(debouncedUpdate);

	if (firstRender) {
		firstRender = false;
		debouncedUpdate();
	}

}

let firstRender = true;

async function updateUnusedImages() {
	fileContentMap = await buildFileContentMap();
	unusedImages = await filterUnusedImages(fileContentMap);

	// Calling countdecorationProvider class to badge unused images
	const unusedDecorationProvider = new UnusedDecorationProvider(unusedImages);
	vscode.window.registerFileDecorationProvider(unusedDecorationProvider);
}

async function buildFileContentMap() {
	const allFilesObj = await vscode.workspace.findFiles('**/*', '**/node_modules/**');
	const promises = allFilesObj.map(async (item) => {
		const content = await readFileContent(item.path);
		return { path: item.path, content };
	});

	const contentArray = await Promise.all(promises);
	const map = {};
	for (const item of contentArray) {
		map[item.path] = item.content;
	}
	return map;
}

async function filterUnusedImages(contentMap) {
	const allImages = await getAllImageFiles();
	const unused = [];
	for (const image of allImages) {
		const imageName = image.split('/')[image.split('/').length - 1];
		let found = false;
		for (const path in contentMap) {
			if (contentMap[path].includes(imageName)) {
				found = true;
				break;
			}
		}
		if (!found) {
			unused.push(image);
		}
	}
	return unused;
}

async function getAllImageFiles() {
	const allFilesObj = await vscode.workspace.findFiles('**/*.{png,jpg,jpeg,gif,svg}', '**/node_modules/**');
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
