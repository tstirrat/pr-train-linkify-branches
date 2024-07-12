import {
  CancellationToken,
  DocumentLink,
  DocumentLinkProvider,
  Range,
  TextDocument,
  Uri,
} from "vscode";

/** Matches " - [branch-name_etc] # but not comments after" */
const BRANCH_NAME_REGEX = /\s+-([\w-]+)/s;

/**
 * Provide links for the given regex and target template.
 */
export class PrTrainLinkProvider implements DocumentLinkProvider {
  constructor() {}

  public provideDocumentLinks(
    document: Pick<TextDocument, "getText" | "positionAt">,
    token: CancellationToken
  ): DocumentLink[] {
    const text = document.getText();
    let match: RegExpExecArray | null;

    const links: DocumentLink[] = [];

    // is this while loop necessary?
    while ((match = BRANCH_NAME_REGEX.exec(text))) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      const range = new Range(startPos, endPos);
      links.push(new DocumentLink(range, Uri.parse("https://canva.com")));
    }

    return links;
  }
}
