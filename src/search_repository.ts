import { SearchResults } from "./search_result";

export interface SearchRepository {
  search(query: string, page: number): Promise<SearchResults>;
}