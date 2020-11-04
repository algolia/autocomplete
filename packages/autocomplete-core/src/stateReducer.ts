import { getCompletion } from './getCompletion';
import { Reducer } from './types';
import { getItemsCount, getNextSelectedItemId } from './utils';

export const stateReducer: Reducer = (state, action) => {
  switch (action.type) {
    case 'setSelectedItemId': {
      return {
        ...state,
        selectedItemId: action.payload,
      };
    }

    case 'setQuery': {
      return {
        ...state,
        query: action.payload,
        completion: null,
      };
    }

    case 'setCollections': {
      return {
        ...state,
        collections: action.payload,
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
      const nextState = {
        ...state,
        selectedItemId: getNextSelectedItemId(
          1,
          state.selectedItemId,
          getItemsCount(state),
          action.props.defaultSelectedItemId
        ),
      };

      return {
        ...nextState,
        completion: getCompletion({ state: nextState }),
      };
    }

    case 'ArrowUp': {
      const nextState = {
        ...state,
        selectedItemId: getNextSelectedItemId(
          -1,
          state.selectedItemId,
          getItemsCount(state),
          action.props.defaultSelectedItemId
        ),
      };

      return {
        ...nextState,
        completion: getCompletion({ state: nextState }),
      };
    }

    case 'Escape': {
      if (state.isOpen) {
        return {
          ...state,
          isOpen: false,
          completion: null,
        };
      }

      return {
        ...state,
        query: '',
        status: 'idle',
        collections: [],
      };
    }

    case 'submit': {
      return {
        ...state,
        selectedItemId: null,
        isOpen: false,
        status: 'idle',
      };
    }

    case 'reset': {
      return {
        ...state,
        selectedItemId:
          // Since we open the menu on reset when openOnFocus=true
          // we need to restore the highlighted index to the defaultSelectedItemId. (DocSearch use-case)

          // Since we close the menu when openOnFocus=false
          // we lose track of the highlighted index. (Query-suggestions use-case)
          action.props.openOnFocus === true
            ? action.props.defaultSelectedItemId
            : null,
        isOpen: action.props.openOnFocus, // @TODO: Check with UX team if we want to close the menu on reset.
        status: 'idle',
        query: '',
      };
    }

    case 'focus': {
      return {
        ...state,
        selectedItemId: action.props.defaultSelectedItemId,
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
        selectedItemId: null,
      };
    }

    case 'mousemove': {
      return {
        ...state,
        selectedItemId: action.payload,
      };
    }

    case 'mouseleave': {
      return {
        ...state,
        selectedItemId: action.props.defaultSelectedItemId,
      };
    }

    default:
      return state;
  }
};
