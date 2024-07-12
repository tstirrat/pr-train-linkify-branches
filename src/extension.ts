import {
  Extension,
  ExtensionContext,
  commands,
  extensions,
  languages,
  window,
  workspace,
} from "vscode";
import { API as BuiltInGitApi, GitExtension } from "../@types/vscode.git";
import { PrTrainLinkProvider } from "./provider";

export function activate(context: ExtensionContext) {
  const dispose = languages.registerDocumentLinkProvider(
    {
      language: "yaml",
      scheme: "file",
      pattern: "**/pr-train.yml",
    },
    new PrTrainLinkProvider()
  );

  commands.registerCommand(
    "prTrain.checkout",
    async ({ branchName }: { branchName?: string }) => {
      if (!branchName) throw new Error("branchName required");

      try {
        const gitExtension = extensions.getExtension("vscode.git");

        if (!gitExtension) throw new Error("vscode.git not found");

        const gitApi = await getBuiltInGitApi();

        if (!gitApi) throw new Error("git API V1 not available");

        // TODO: choose a repo?
        const repo = gitApi.repositories[0];

        if (!repo) throw new Error("No repository found");

        await repo.checkout(branchName);
      } catch (error) {
        // TODO: better errors
        console.error(error);
        throw error;
      }
    }
  );

  context.subscriptions.push(dispose);
}

async function getBuiltInGitApi(): Promise<BuiltInGitApi | undefined> {
  try {
    const extension = extensions.getExtension(
      "vscode.git"
    ) as Extension<GitExtension>;

    if (extension) {
      const gitExtension = extension.isActive
        ? extension.exports
        : await extension.activate();

      return gitExtension.getAPI(1);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
