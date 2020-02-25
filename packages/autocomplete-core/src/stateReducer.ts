import { getItemsCount, getNextHighlightedIndex } from './utils';

import { Reducer } from './types';

export const stateReducer: Reducer = (action, state, props) => {
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
          1,
          state.highlightedIndex,
          getItemsCount(state),
          props.defaultHighlightedIndex
        ),
      };
    }

    case 'ArrowUp': {
      return {
        ...state,
        highlightedIndex: getNextHighlightedIndex(
          -1,
          state.highlightedIndex,
          getItemsCount(state),
          props.defaultHighlightedIndex
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
        highlightedIndex: null,
        isOpen: false,
        status: 'idle',
        statusContext: {},
      };
    }

    case 'reset': {
      return {
        ...state,
        highlightedIndex:
          // Since we open the menu on reset when openOnFocus=true
          // we need to restore the highlighted index to the defaultHighlightedIndex. (DocSearch use-case)

          // Since we close the menu when openOnFocus=false
          // we lose track of the highlighted index. (Query-suggestions use-case)
          props.openOnFocus === true ? props.defaultHighlightedIndex : null,
        isOpen: props.openOnFocus, // @TODO: Check with UX team if we want to close the menu on reset.
        status: 'idle',
        statusContext: {},
        query: '',
      };
    }

    case 'focus': {
      return {
        ...state,
        highlightedIndex: props.defaultHighlightedIndex,
        isOpen: props.openOnFocus || state.query.length > 0,
      };
    }

    case 'blur': {
      return {
        ...state,
        isOpen: false,
        highlightedIndex: null,
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
