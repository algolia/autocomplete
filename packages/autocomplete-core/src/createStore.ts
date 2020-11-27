import {
  AutocompleteStore,
  BaseItem,
  InternalAutocompleteOptions,
  Reducer,
} from './types';

export function createStore<TItem extends BaseItem>(
  reducer: Reducer,
  props: InternalAutocompleteOptions<TItem>
): AutocompleteStore<TItem> {
  let state = props.initialState;

  return {
    getState() {
      return state;
    },
    dispatch(action, payload) {
      const prevState = { ...state };
      state = reducer(state, {
        type: action,
        props,
        payload,
      });

      props.onStateChange({ state, prevState });
    },
  };
}
