"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
/**
 * Load the native addon produced by the Rust crate (cppdoc_core).
 * The file must be copied/renamed as:
 *    <extension-root>/native/cppdoc_core.node
 */
function loadNative() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(path.join(__dirname, '..', 'native', 'cppdoc_core.node'));
}
/**
 * Called by VS Code when the extension is activated.
 */
function activate(context) {
    const { ping } = loadNative();
    const disposable = vscode.commands.registerCommand('cpp-doc.ping', () => {
        vscode.window.showInformationMessage(ping());
    });
    context.subscriptions.push(disposable);
}
/**
 * Cleanup (nothing for now).
 */
function deactivate() {
    /* noop */
}
//# sourceMappingURL=extension.js.map