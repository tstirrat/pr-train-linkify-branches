import {
  DocumentLink,
  DocumentLinkProvider,
  Range,
  TextDocument,
  Uri,
} from "vscode";

/** Matches " - [branch-name_etc] # but not comments after" */
const BRANCH_NAME_REGEX = /\s+-\s+([\w-\.]+)/g;

/**
 * Provide links for the given regex and target template.
 */
export class PrTrainLinkProvider implements DocumentLinkProvider {
  constructor() {}

  public provideDocumentLinks(
    document: Pick<TextDocument, "getText" | "positionAt">
  ): DocumentLink[] {
    const text = document.getText();

    const links: DocumentLink[] = [];
    const matches = text.matchAll(BRANCH_NAME_REGEX);

    return [...matches].map((match) => {
      const [line, branchName] = match;

      const start = match.index + line.indexOf(branchName);
      const end = start + branchName.length;

      const range = new Range(
        document.positionAt(start),
        document.positionAt(end)
      );

      return new DocumentLink(
        range,
        Uri.parse(
          `command:prTrain.checkout?${encodeURIComponent(
            JSON.stringify({ branchName })
          )}`
        )
      );
    });
  }
}
