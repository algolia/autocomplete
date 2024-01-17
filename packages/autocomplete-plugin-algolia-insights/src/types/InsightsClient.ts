import type {
  InsightsMethodMap as _InsightsMethodMap,
  InsightsClient as _InsightsClient,
} from 'search-insights';

export type {
  Init as InsightsInit,
  AddAlgoliaAgent as InsightsAddAlgoliaAgent,
  SetUserToken as InsightsSetUserToken,
  GetUserToken as InsightsGetUserToken,
  OnUserTokenChange as InsightsOnUserTokenChange,
  InsightsEvent,
} from 'search-insights';

export type InsightsMethodMap = _InsightsMethodMap;
export type InsightsClientMethod = keyof InsightsMethodMap;

export type InsightsClientPayload = {
  eventName: string;
  queryID: string;
  index: string;
  objectIDs: string[];
  positions?: number[];
};

type QueueItemMap = Record<string, unknown>;

type QueueItem = QueueItemMap[keyof QueueItemMap];

export type InsightsClient = _InsightsClient & {
  queue?: QueueItem[];
  version?: string;
};
