import { SearchRepository } from "./search_repository";
import { SearchResults } from "./search_result";
import * as google from 'googlethis';
import * as url from "url";

export class GoogleSearchRepository implements SearchRepository {
  async search(query: string, page: number): Promise<SearchResults> {
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

}