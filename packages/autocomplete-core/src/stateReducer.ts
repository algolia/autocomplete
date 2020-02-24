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
        highlightedIndex: null,
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
