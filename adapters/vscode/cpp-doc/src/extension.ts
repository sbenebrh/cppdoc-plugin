import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';


function loadNative() {
  return require(path.join(__dirname, '..', 'native', 'cppdoc_core.node')) as {
    ping: () => string;
  };
}

function buildWebviewHtml(
  originalHtml: string,
  scriptTag: string,
  cspSource: string
): string {
  // retire les anciennes CSP
  let html = originalHtml.replace(
    /<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi,
    ''
  );

  // CSP qui autorise unsafe-inline + cspSource
  const csp = `<meta http-equiv="Content-Security-Policy"
    content="default-src 'none';
             style-src 'self' 'unsafe-inline';
             img-src https: data:;
             script-src 'unsafe-inline' ${cspSource};">`;

  html = html.replace(/<head[^>]*>/i, m => `${m}\n${csp}`);

  // injecte le script juste avant </body>
  const pos = html.lastIndexOf('</body>');
  return pos !== -1
    ? html.slice(0, pos) + scriptTag + html.slice(pos)
    : html + scriptTag;
}


export function activate(context: vscode.ExtensionContext): void {
  const { ping, lookup } = loadNative() as {
    ping: () => string;
    lookup: (sym: string) => string | null;
  };

  context.subscriptions.push(
    vscode.commands.registerCommand('cpp-doc.ping', () => {
      vscode.window.showInformationMessage(ping());
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('cpp-doc.lookupVector', () => {
      const p = lookup('std::vector');
      vscode.window.showInformationMessage(p ?? 'not found');
    })
  );

  context.subscriptions.push(
  	vscode.commands.registerCommand('cpp-doc.openVector', () => {
      const filePath = lookup('std::vector');
      if (!filePath) {
        vscode.window.showErrorMessage('std::vector not found – run fetch_docs.py');
        return;
      }

      const uri = vscode.Uri.file(filePath);


      const panel = vscode.window.createWebviewPanel(
        'cppDocView',
        'C++ Doc – std::vector',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          localResourceRoots: [vscode.Uri.file(path.dirname(uri.fsPath))]
        }
      );

      const rawHtml = fs.readFileSync(uri.fsPath, 'utf8');

      const injectedScript = `
      <script>
        (function () {
          const vscode = acquireVsCodeApi();      /* pont WebView ↔ extension */
          console.log('🟢 injected');

          document.addEventListener('click', function (ev) {
            const a = ev.target.closest('a');
            if (!a) return;
            ev.preventDefault();

            const href = a.getAttribute('href') || '';
            console.log('Clicked:', href);
            vscode.postMessage({ kind: 'navigate', href });
          });
        })();
      </script>`;

      const csp = `<meta http-equiv="Content-Security-Policy"
        content="default-src 'none';
                 style-src 'self' 'unsafe-inline';
                 img-src https: data:;
                 script-src 'unsafe-inline' ${panel.webview.cspSource};">`;

      let html = rawHtml.replace(
        /<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi,
        ''
      );
      html = html.replace(/<head[^>]*>/i, m => `${m}\n${csp}`);

      const pos = html.lastIndexOf('</body>');
      html = pos !== -1
        ? html.slice(0, pos) + injectedScript + html.slice(pos)
        : html + injectedScript;

      panel.webview.html = html;

	panel.webview.onDidReceiveMessage(msg => {
	if (msg?.kind !== 'navigate' || !msg.href) return;

	// Résoudre le chemin demandé
	let targetPath: string;

	if (msg.href.startsWith('../')) {
		// lien relatif depuis le fichier actuel
		targetPath = path.resolve(path.dirname(uri.fsPath), msg.href);
	} else if (msg.href.endsWith('.html')) {
		targetPath = path.resolve(path.dirname(uri.fsPath), msg.href);
	} else {
		// pas un fichier .html → ignore pour l’instant
		return;
	}

	if (!fs.existsSync(targetPath)) {
		vscode.window.showWarningMessage(`Fichier ${msg.href} introuvable hors-ligne`);
		return;
	}

	// Lire le nouveau HTML et le ré-injecter
	const newRaw = fs.readFileSync(targetPath, 'utf8');
	panel.webview.html = buildWebviewHtml(newRaw, injectedScript, panel.webview.cspSource);
	});
    })
  );
}