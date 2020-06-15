// The module 'vscode' contains the VS Code extensibility API
import * as vscode from "vscode";

class GoCodeLensProvider implements vscode.CodeLensProvider {
  range = new vscode.Range(
    new vscode.Position(0, 0),
    new vscode.Position(0, 4)
  );

  command: vscode.Command = {
    title: "'Run Cell'",
    command: "helloworldDS.webview",
  };

  public provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.CodeLens[] | Thenable<vscode.CodeLens[]> {
    return [new vscode.CodeLens(this.range, this.command)];
  }
}

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  let panel: any;

  let messageCommand = vscode.commands.registerCommand(
    "helloworldDS.messages",
    () => {
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World!");
    }
  );

  let webviewCommand = vscode.commands.registerCommand(
    "helloworldDS.webview",
    () => {
      // Create and show panel
      panel = vscode.window.createWebviewPanel(
        "Hello World",
        "Hello World",
        vscode.ViewColumn.One,
        {}
      );
      // And set its HTML content
      panel.webview.html = `
      <html>
        <script>
          window.onmessage = function(event) {
            document.getElementById("123").innerHTML += ", also, I got a message";
          };
        </script>
        <body><h1 id='123'>Hello World</h1></body>
      </html>`;

      panel.webview.options = {
        enableScripts: true,
      };
    }
  );

  let webviewMessageCommand = vscode.commands.registerCommand(
    "helloworldDS.webviewMessage",
    () => {
      panel.webview.postMessage("hi");
    }
  );

  const docSelector: vscode.DocumentSelector = {
    scheme: "untitled",
    language: "typescript",
  };
  let codeLens = vscode.languages.registerCodeLensProvider(
    docSelector,
    new GoCodeLensProvider()
  );

  context.subscriptions.push(messageCommand);
  context.subscriptions.push(webviewCommand);
  context.subscriptions.push(codeLens);
  context.subscriptions.push(webviewMessageCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
