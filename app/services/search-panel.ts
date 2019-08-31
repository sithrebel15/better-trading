// Vendor
import Service from '@ember/service';
import window from 'ember-window-mock';

// Constants
const NULL_RARITY = 'Any';
const NULL_CATEGORY = 'Any';
const DEFAULT_RECOMMEND_TITLE = '¯_(ツ)_/¯';

// Selectors
const SEARCH_INPUT_SELECTOR = '.search-panel .search-bar .search-left input';
const CATEGORY_INPUT_SELECTOR =
  '.search-advanced-items .filter-group:nth-of-type(1) .filter-property:nth-of-type(1) input';
const RARITY_INPUT_SELECTOR =
  '.search-advanced-items .filter-group:nth-of-type(1) .filter-property:nth-of-type(2) input';

interface ScrapedSearchPanel {
  name: string | null;
  category: string | null;
  rarity: string | null;
}

export default class SearchPanel extends Service {
  recommendTitle() {
    const {name, category, rarity} = this._scrape();

    if (name) return name;
    if (!category) return DEFAULT_RECOMMEND_TITLE;
    if (!rarity) return category;

    return `${category} (${rarity})`;
  }

  _scrape(): ScrapedSearchPanel {
    return {
      category: this._scrapeValue(CATEGORY_INPUT_SELECTOR, NULL_CATEGORY),
      name: this._scrapeValue(SEARCH_INPUT_SELECTOR),
      rarity: this._scrapeValue(RARITY_INPUT_SELECTOR, NULL_RARITY)
    };
  }

  _scrapeValue(selector: string, nullValue?: string): string | null {
    const input: HTMLInputElement | null = window.document.querySelector(
      selector
    );
    if (!input) return null;

    const value = input.value;
    if (!value) return null;
    if (nullValue && nullValue === value) return null;

    return value;
  }
}

declare module '@ember/service' {
  interface Registry {
    'search-panel': SearchPanel;
  }
}