import { UrlWithStringQuery } from "url";

export interface SearchResults {
  items: SearchResultItem[];
  query: string;
}

export interface SearchResultItem {
  favicon: string;
  url: string;
  hostShort: string;
  title: string;
  description: string;
}