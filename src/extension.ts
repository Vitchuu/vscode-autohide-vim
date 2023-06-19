"use strict";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {

    if (vscode.workspace.getConfiguration("autoHide").hideOnOpen) {
        vscode.commands.executeCommand("workbench.action.closePanel");
        vscode.commands.executeCommand("workbench.action.closeSidebar");
    };

    vscode.window.onDidChangeTextEditorSelection(selection => {
        let config = vscode.workspace.getConfiguration("autoHide");
        let path = vscode.window.activeTextEditor.document.fileName;
        let pathIsFile = path.includes(".") || path.includes("\\") || path.includes("/");

        if (selection.selections.length != 1                      // no selections or multiselections
            || selection.selections.find(a => a.isEmpty) == null    // multiselections
            || !pathIsFile) {                                     // The debug window editor
            return;
        } else {
            if (config.autoHideReferences) {
                vscode.commands.executeCommand("closeReferenceSearch");
            }

            if (config.autoHideSideBar) {
                vscode.commands.executeCommand("workbench.action.closeSidebar");
            }
        };
    });

    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHidePanel", async () => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update("autoHidePanel", !config.autoHidePanel, vscode.ConfigurationTarget.Workspace);
        }));
    context.subscriptions.push(
        vscode.commands.registerCommand("autoHide.toggleHideSideBar", async () => {
            let config = vscode.workspace.getConfiguration("autoHide");
            await config.update("autoHideSideBar", !config.autoHideSideBar, vscode.ConfigurationTarget.Workspace);
        }));
}

export function deactivate() { }
