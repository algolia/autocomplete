<template>
  <div>
    <ais-instant-search
      :search-client="searchClient"
      :index-name="indexName"
      :routing="routing"
    >
      <header class="header">
        <div class="header-wrapper wrapper">
          <nav class="header-nav">
            <a href="/">Home</a>
          </nav>
          <Autocomplete />
        </div>
      </header>

      <ais-configure
        :attributes-to-snippet.camel="['name:7', 'description:15']"
        :snippet-ellipsis-text.camel="'…'"
      ></ais-configure>
      <div class="container wrapper">
        <div>
          <ais-panel>
            <template v-slot:header>Categories</template>
            <ais-hierarchical-menu
              :attributes="[
                'hierarchicalCategories.lvl0',
                'hierarchicalCategories.lvl1',
              ]"
            ></ais-hierarchical-menu>
          </ais-panel>
        </div>
        <div>
          <ais-hits>
            <template v-slot:item="{ item }">
              <article class="hit">
                <div class="hit-image">
                  <img :src="item.image" :alt="item.name" />
                </div>
                <div>
                  <h1>
                    <ais-snippet :hit="item" attribute="name" />
                  </h1>
                  <div>
                    By <strong>{{ item.brand }}</strong> in
                    <strong>{{ item.categories[0] }}</strong>
                  </div>
                </div>
              </article>
            </template>
          </ais-hits>
          <ais-pagination :show-first="false" :show-last="false" />
        </div>
      </div>
    </ais-instant-search>
  </div>
</template>

<script>
import { history as historyRouter } from 'instantsearch.js/es/lib/routers';
import { singleIndex as singleIndexMapping } from 'instantsearch.js/es/lib/stateMappings';

import Autocomplete from './Autocomplete.vue';
import { INSTANT_SEARCH_INDEX_NAME } from './constants';
import { searchClient } from './searchClient';

export default {
  components: { Autocomplete },
  data() {
    return {
      searchClient,
      indexName: INSTANT_SEARCH_INDEX_NAME,
      routing: {
        router: historyRouter(),
        stateMapping: singleIndexMapping(INSTANT_SEARCH_INDEX_NAME),
      },
    };
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  background-color: rgb(244, 244, 249);
  color: rgb(65, 65, 65);
}

a {
  color: var(--aa-primary-color);
  text-decoration: none;
}

.header {
  background: rgb(252 252 255 / 92%);
  box-shadow: 0 0 0 1px rgba(35, 38, 59, 0.05),
    0 1px 3px 0 rgba(35, 38, 59, 0.15);
  padding: 0.5rem 0;
  position: fixed;
  top: 0;
  width: 100%;
}

.header-wrapper {
  align-items: center;
  display: grid;
  grid-template-columns: 100px 1fr;
}

.header-nav {
  font-weight: 500;
}

.wrapper {
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 1.5rem;
  width: 100%;
}

.container {
  margin-top: 3.5rem;
  padding: 1.5rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 3fr;
}

/* Autocomplete */

.aa-Panel {
  position: fixed;
}

/* InstantSearch */

.ais-Hits-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr 1fr;
}

.ais-Hits-item {
  padding: 1rem !important;
}

.hit {
  align-items: center;
  display: grid;
  gap: 1rem;
}

.hit h1 {
  font-size: 1rem;
}

.hit p {
  font-size: 0.8rem;
  opacity: 0.8;
}

.hit-image {
  align-items: center;
  display: flex;
  height: 100px;
  justify-content: center;
}

.hit-image img {
  max-height: 100%;
}

.ais-HierarchicalMenu-item--selected.ais-HierarchicalMenu-item--parent
  > div:first-of-type
  .ais-HierarchicalMenu-label {
  font-weight: bold;
}

.ais-HierarchicalMenu-item--selected:not(.ais-HierarchicalMenu-item--parent)
  .ais-HierarchicalMenu-label {
  font-weight: bold;
}

.ais-Pagination {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}
</style>
