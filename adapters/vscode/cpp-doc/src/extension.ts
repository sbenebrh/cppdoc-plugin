import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Load the native addon produced by the Rust crate (cppdoc_core).
 * The file must be copied/renamed as:
 *    <extension-root>/native/cppdoc_core.node
 */
function loadNative() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(path.join(__dirname, '..', 'native', 'cppdoc_core.node')) as {
    ping: () => string;
  };
}

/**
 * Called by VS Code when the extension is activated.
 */
export function activate(context: vscode.ExtensionContext): void {
  const { ping } = loadNative();

  const disposable = vscode.commands.registerCommand('cpp-doc.ping', () => {
    vscode.window.showInformationMessage(ping());
  });

  context.subscriptions.push(disposable);
}

/**
 * Cleanup (nothing for now).
 */
export function deactivate(): void {
  /* noop */
}