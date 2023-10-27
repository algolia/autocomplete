import { getItemsCount, invariant } from '@algolia/autocomplete-shared';

import { getCompletion } from './getCompletion';
import { Reducer } from './types';
import { getNextActiveItemId } from './utils';

export const stateReducer: Reducer = (state, action) => {
  switch (action.type) {
    case 'setActiveItemId': {
      return {
        ...state,
        activeItemId: action.payload,
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
        activeItemId: action.payload.hasOwnProperty('nextActiveItemId')
          ? action.payload.nextActiveItemId
          : getNextActiveItemId(
              1,
              state.activeItemId,
              getItemsCount(state),
              action.props.defaultActiveItemId
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
        activeItemId: getNextActiveItemId(
          -1,
          state.activeItemId,
          getItemsCount(state),
          action.props.defaultActiveItemId
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
          activeItemId: null,
          isOpen: false,
          completion: null,
        };
      }

      return {
        ...state,
        activeItemId: null,
        query: '',
        status: 'idle',
        collections: [],
      };
    }

    case 'submit': {
      return {
        ...state,
        activeItemId: null,
        isOpen: false,
        status: 'idle',
      };
    }

    case 'reset': {
      return {
        ...state,
        activeItemId:
          // Since we open the panel on reset when openOnFocus=true
          // we need to restore the highlighted index to the defaultActiveItemId. (DocSearch use-case)

          // Since we close the panel when openOnFocus=false
          // we lose track of the highlighted index. (Query-suggestions use-case)
          action.props.openOnFocus === true
            ? action.props.defaultActiveItemId
            : null,
        status: 'idle',
        completion: null,
        query: '',
      };
    }

    case 'focus': {
      return {
        ...state,
        activeItemId: action.props.defaultActiveItemId,
        isOpen:
          (action.props.openOnFocus || Boolean(state.query)) &&
          action.props.shouldPanelOpen({ state }),
      };
    }

    case 'blur': {
      if (action.props.debug) {
        return state;
      }

      return {
        ...state,
        isOpen: false,
        activeItemId: null,
      };
    }

    case 'mousemove': {
      return {
        ...state,
        activeItemId: action.payload,
      };
    }

    case 'mouseleave': {
      return {
        ...state,
        activeItemId: action.props.defaultActiveItemId,
      };
    }

    default:
      invariant(
        false,
        `The reducer action ${JSON.stringify(action.type)} is not supported.`
      );

      return state;
  }
};
