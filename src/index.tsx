import { Action, ActionPanel, Detail, List } from "@raycast/api";
import { subtle } from "crypto";
import * as google from 'googlethis';
import * as url from "url";
import { useState } from "react";
import { debounce } from "ts-debounce";
import { SearchResults } from "./search_result";

async function searchInGoogle(query: string, page: number = 0) {
  console.log(`Searching for: ${query}, page: ${page}`);
  const response = await google.search(query,
    { safe: false, parse_ads: false, page: page },
  );
  return {
    query: query,
    items: response.results.map((result) => {
      return {
        favicon: result.favicons.low_res,
        title: result.title,
        hostShort: url.parse(result.url).host!.split('.').slice(-2).join('.'),
        url: result.url,
        description: result.description,
      }
    })
  };
}

export default function Command() {
  const [searchState, setSearchState] = useState<SearchResults>({ items: [], query: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  var currentSearchText = '';

  const search = async function (query: string) {
    setIsLoading(true);
    setSearchState(await searchInGoogle(query));
    setIsLoading(false);
    const secondPage = await searchInGoogle(query, 1);
    if (searchState.query === query) {
      setSearchState({
        query: query,
        items: [...searchState.items, ...secondPage.items]
      });
    }
  }

  const debouncedSearch = debounce(search, 350);

  const onSearchTextChanged = (text: string) => {
    currentSearchText = text;
    debouncedSearch(text);
  }

  return <List onSearchTextChange={
    onSearchTextChanged
  }
    isLoading={isLoading}
    searchBarPlaceholder="Search query..."
  >
    <List.Section title={`Results for: ${searchState.query}`}>
      {
        searchState.items.map((item) => (
          <List.Item
            title={item.title}
            key={item.url}
            icon={{ source: item.favicon }}
            accessories={[{ text: item.hostShort }]}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action.OpenInBrowser url={item.url} />
                  <Action.CopyToClipboard title="Copy URL" content={item.url} />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))
      }
    </List.Section>
  </List >
}
