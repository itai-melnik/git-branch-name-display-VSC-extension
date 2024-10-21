// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import simpleGit from 'simple-git';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "git-branch-name-display" is now active!');


	// add item to status bar
	const rootPath = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
	if (rootPath) {
		addToStatusBar(context, rootPath);
	} else {
		console.error('No workspace is opened');
	}
}


function addToStatusBar(context: vscode.ExtensionContext, rootPath: string) {
	const git = require('simple-git')(rootPath);
	git.branch((err: any, branchSummary: any) => {
		if (err) {
			console.error(err);
			return;
		}
		const branchNameItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
		branchNameItem.text = `$(git-branch) ${branchSummary.current}`;
		branchNameItem.command = 'extension.showBranchOptions';
		branchNameItem.show();

		const disposable = vscode.commands.registerCommand('extension.showBranchOptions', async () => {
			const selectedOption = await vscode.window.showQuickPick(
				['Change Branch', 'Create New Branch', 'Delete Branch'], // Options
				{
					placeHolder: 'Select a Git action',
					canPickMany: false,
				}
			);

			if (selectedOption) {
				handleBranchAction(selectedOption);
			}
		});

		context.subscriptions.push(branchNameItem);
		context.subscriptions.push(disposable);

	});

}

function handleBranchAction(selectedOption: string) {
	switch (selectedOption) {
		case 'Change Branch':
			vscode.window.showInformationMessage('Branch changed.');
			// Add logic to change the branch
			break;
		case 'Create New Branch':
			vscode.window.showInputBox({ placeHolder: 'Enter new branch name' }).then(branchName => {
				if (branchName) {
					vscode.window.showInformationMessage(`Branch '${branchName}' created.`);
					// Add logic to create the new branch
				}
			});
			break;
		case 'Delete Branch':
			vscode.window.showInformationMessage('Branch deleted.');
			// Add logic to delete the branch
			break;
		default:
			vscode.window.showErrorMessage('Unknown action');
	}
}

// This method is called when your extension is deactivated
export function deactivate() { }



