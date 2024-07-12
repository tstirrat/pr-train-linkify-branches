import { languages, ExtensionContext } from "vscode";
import { PrTrainLinkProvider } from "./provider";

export function activate(context: ExtensionContext) {
  const provider = new PrTrainLinkProvider();
  const dispose = languages.registerDocumentLinkProvider("yaml", provider);

  context.subscriptions.push(dispose);
}
