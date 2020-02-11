import { getItemsCount, getNextHighlightedIndex } from './utils';

import { AutocompleteState, AutocompleteOptions } from './types';

type ActionType =
  | 'setHighlightedIndex'
  | 'setQuery'
  | 'setSuggestions'
  | 'setIsOpen'
  | 'setStatus'
  | 'setContext'
  | 'ArrowUp'
  | 'ArrowDown'
  | 'Escape'
  | 'Enter'
  | 'submit'
  | 'reset'
  | 'focus'
  | 'mousemove'
  | 'mouseleave'
  | 'click'
  | 'blur';

interface Action {
  type: ActionType;
  value: any;
}

export const stateReducer = <TItem>(
  state: AutocompleteState<TItem>,
  action: Action,
  props: AutocompleteOptions<TItem>
): AutocompleteState<TItem> => {
  switch (action.type) {
    case 'setHighlightedIndex': {
      return {
        ...state,
        highlightedIndex: action.value,
      };
    }

    case 'setQuery': {
      return {
        ...state,
        query: action.value,
      };
    }

    case 'setSuggestions': {
      return {
        ...state,
        suggestions: action.value,
      };
    }

    case 'setIsOpen': {
      return {
        ...state,
        isOpen: action.value,
      };
    }

    case 'setStatus': {
      return {
        ...state,
        status: action.value,
      };
    }

    case 'setContext': {
      return {
        ...state,
        context: {
          ...state.context,
          ...action.value,
        },
      };
    }

    case 'ArrowDown': {
      return {
        ...state,
        highlightedIndex: getNextHighlightedIndex(
          action.value.shiftKey ? 5 : 1,
          state.highlightedIndex,
          getItemsCount(state)
        ),
      };
    }

    case 'ArrowUp': {
      return {
        ...state,
        highlightedIndex: getNextHighlightedIndex(
          action.value.shiftKey ? -5 : -1,
          state.highlightedIndex,
          getItemsCount(state)
        ),
      };
    }

    case 'Escape': {
      if (state.isOpen) {
        return {
          ...state,
          isOpen: false,
        };
      }

      return {
        ...state,
        query: '',
        status: 'idle',
        statusContext: {},
        suggestions: [],
      };
    }

    case 'submit': {
      return {
        ...state,
        highlightedIndex: -1,
        isOpen: false,
        status: 'idle',
        statusContext: {},
      };
    }

    case 'reset': {
      return {
        ...state,
        highlightedIndex: -1,
        isOpen: false,
        status: 'idle',
        statusContext: {},
        query: '',
      };
    }

    case 'focus': {
      return {
        ...state,
        highlightedIndex: props.defaultHighlightedIndex,
        isOpen: state.query.length >= props.minLength,
      };
    }

    case 'blur': {
      // In development mode, we prefer keeping the dropdown open on blur
      // to use the browser dev tools.
      return {
        ...state,
        isOpen: __DEV__ ? state.isOpen : false,
        highlightedIndex: -1,
      };
    }

    case 'mousemove': {
      return {
        ...state,
        highlightedIndex: action.value,
      };
    }

    case 'mouseleave': {
      return {
        ...state,
        highlightedIndex: props.defaultHighlightedIndex,
      };
    }

    default:
      return state;
  }
};
