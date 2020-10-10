import { Reducer } from './types';
import { getItemsCount, getNextHighlightedIndex } from './utils';

export const stateReducer: Reducer = (state, action) => {
  switch (action.type) {
    case 'setHighlightedIndex': {
      return {
        ...state,
        highlightedIndex: action.payload,
      };
    }

    case 'setQuery': {
      return {
        ...state,
        query: action.payload,
      };
    }

    case 'setSuggestions': {
      return {
        ...state,
        suggestions: action.payload,
      };
    }

    case 'setIsOpen': {
      return {
        ...state,
        isOpen: action.payload,
      };
    }

    case 'setStatus': {
      return {
        ...state,
        status: action.payload,
      };
    }

    case 'setContext': {
      return {
        ...state,
        context: {
          ...state.context,
          ...action.payload,
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
          action.props.defaultHighlightedIndex
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
          action.props.defaultHighlightedIndex
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
          action.props.openOnFocus === true
            ? action.props.defaultHighlightedIndex
            : null,
        isOpen: action.props.openOnFocus, // @TODO: Check with UX team if we want to close the menu on reset.
        status: 'idle',
        statusContext: {},
        query: '',
      };
    }

    case 'focus': {
      return {
        ...state,
        highlightedIndex: action.props.defaultHighlightedIndex,
        isOpen: action.props.openOnFocus || state.query.length > 0,
      };
    }

    case 'blur': {
      if (action.props.debug) {
        return state;
      }

      return {
        ...state,
        isOpen: false,
        highlightedIndex: null,
      };
    }

    case 'mousemove': {
      return {
        ...state,
        highlightedIndex: action.payload,
      };
    }

    case 'mouseleave': {
      return {
        ...state,
        highlightedIndex: action.props.defaultHighlightedIndex,
      };
    }

    default:
      return state;
  }
};
