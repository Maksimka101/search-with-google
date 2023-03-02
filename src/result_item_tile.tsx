import { Action, ActionPanel, List } from "@raycast/api";
import { SearchResultItem } from "./search_result";

export type ResultItemViewMode = "compact" | "standard" | "detailed";

export function ResultItemTile(props: { item: SearchResultItem, viewMode: ResultItemViewMode }) {
  const { item, viewMode } = props;
  let subtitle: string | undefined;
  let accessoriesText: string | undefined;
  switch (viewMode) {
    case "compact":
      accessoriesText = item.hostShort;
      break;
    case "standard":
      subtitle = item.hostShort;
      accessoriesText = item.description;
      break;
  }

  return (
    <List.Item
      title={item.title}
      icon={{ source: item.favicon }}
      accessories={[{ text: accessoriesText }]}
      subtitle={subtitle}
      detail={viewMode !== "detailed" ? undefined : <List.Item.Detail markdown={
        `# ${item.title}\n` +
        `[${item.url}](${item.url})\n\n` +
        `${item.description}`
      } />}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action.OpenInBrowser url={item.url} />
            <Action.CopyToClipboard title="Copy Url to Clipboard" content={item.url} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}