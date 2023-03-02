import { List } from "@raycast/api";
import { useState } from "react";
import { debounce } from "ts-debounce";
import { SearchResults } from "./search_result";
import { SearchRepository } from "./search_repository";
import { GoogleSearchRepository } from "./google_search";
import { ResultItemTile, ResultItemViewMode } from "./result_item_tile";

export default function Command() {
  const searchRepository: SearchRepository = new GoogleSearchRepository();
  const [searchState, setSearchState] = useState<SearchResults>({ items: [], query: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ResultItemViewMode>("standard");
  var currentSearchText = '';

  const search = async function (query: string) {
    setIsLoading(true);
    setSearchState(await searchRepository.search(query, 0));
    setIsLoading(false);
    const secondPage = await searchRepository.search(query, 1);
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
    isShowingDetail={viewMode === "detailed" && searchState.items.length > 0}
    searchBarAccessory={
      <List.Dropdown
        tooltip="View mode"
        storeValue={true}
        onChange={(value) => { setViewMode(value as ResultItemViewMode) }}
      >
        <List.Dropdown.Item title="Compact" value="compact" />
        <List.Dropdown.Item title="Standard" value="standard" />
        <List.Dropdown.Item title="Detailed" value="detailed" />
      </List.Dropdown>
    }
  >
    <List.Section
      title={`Results for: ${searchState.query}`}
    >
      {
        searchState.items.map((item) => (
          <ResultItemTile item={item} viewMode={viewMode} key={item.url} />
        ))
      }
    </List.Section>
  </List >
}
