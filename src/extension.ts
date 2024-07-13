import * as vscode from "vscode";
import { API as BuiltInGitApi, GitExtension } from "../@types/vscode.git";
import { PrTrainLinkProvider } from "./provider";

export function activate(context: vscode.ExtensionContext) {
  const dispose = vscode.languages.registerDocumentLinkProvider(
    {
      language: "yaml",
      scheme: "file",
      pattern: "**/.pr-train.yml",
    },
    new PrTrainLinkProvider()
  );

  vscode.commands.registerCommand(
    "prTrain.checkout",
    async ({ branchName }: { branchName?: string }) => {
      if (!branchName) throw new Error("branchName required");

      try {
        const gitExtension = vscode.extensions.getExtension("vscode.git");

        if (!gitExtension) throw new Error("vscode.git not found");

        const gitApi = await getBuiltInGitApi();

        if (!gitApi) throw new Error("git API V1 not available");

        // TODO: choose a repo?
        const repo = gitApi.repositories[0];

        if (!repo) throw new Error("No repository found");

        await repo.checkout(branchName);
      } catch (error) {
        vscode.window.showErrorMessage(
          `PR Train couldn't switch to ${branchName}: ${
            (error as Error).message
          }`
        );
        throw error;
      }
    }
  );

  context.subscriptions.push(dispose);
}

async function getBuiltInGitApi(): Promise<BuiltInGitApi | undefined> {
  const extension = vscode.extensions.getExtension(
    "vscode.git"
  ) as vscode.Extension<GitExtension>;

  if (extension) {
    const gitExtension = extension.isActive
      ? extension.exports
      : await extension.activate();

    return gitExtension.getAPI(1);
  }
}
