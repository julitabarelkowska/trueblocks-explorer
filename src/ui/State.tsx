import { toSuccessfulData, useCommand } from '@hooks/useCommand';
import { Accountname, address as Address } from '@modules/types';
import Cookies from 'js-cookie';
import React, { createContext, useContext, useReducer } from 'react';
import { ReactNode } from 'react-markdown';

const THEME = Cookies.get('theme');
const ADDRESS = Cookies.get('address');

type State = {
  theme?: string,
  currentAddress?: string,
  namesMap?: Map<Address, Accountname>
  namesArray?: Accountname[],
  namesEditModal: boolean,
  transactions: ReturnType<typeof useCommand>,
  totalRecords: number,
}

const createDefaultTransaction = () => toSuccessfulData({
  data: [], meta: {},
});

const initialState: State = {
  theme: THEME,
  currentAddress: ADDRESS,
  namesMap: new Map(),
  namesArray: [],
  namesEditModal: false,
  transactions: [createDefaultTransaction(), false],
  totalRecords: 0,
};

type SetTheme = {
  type: 'SET_THEME',
  theme: Pick<State, 'theme'>,
};

type SetCurrentAddress = {
  type: 'SET_CURRENT_ADDRESS',
  address: State['currentAddress'], // Pick<State, 'currentAddress'>,
};

type SetNamesMap = {
  type: 'SET_NAMES_MAP',
  namesMap: State['namesMap'],
};

type SetNamesArray = {
  type: 'SET_NAMES_ARRAY',
  namesArray: State['namesArray'],
};

type SetNamesEditModal = {
  type: 'SET_NAMES_EDIT_MODAL',
  val: State['namesEditModal'],
};

type SetTransactions = {
  type: 'SET_TRANSACTIONS',
  transactions: State['transactions'],
};

type SetTotalRecords = {
  type: 'SET_TOTAL_RECORDS',
  records: State['totalRecords'],
};

type GlobalAction =
  | SetTheme
  | SetCurrentAddress
  | SetNamesMap
  | SetNamesArray
  | SetNamesEditModal
  | SetTransactions
  | SetTotalRecords;

const GlobalStateContext = createContext<[
  typeof initialState,
  React.Dispatch<GlobalAction>
]>([initialState, () => { }]);

const GlobalStateReducer = (state: any, action: GlobalAction) => {
  switch (action.type) {
    case 'SET_THEME':
      Cookies.set('theme', action.theme);
      return {
        ...state,
        theme: action.theme,
      };
    case 'SET_CURRENT_ADDRESS':
      Cookies.set('address', action.address || '');

      if (action.address !== state.address) {
        return {
          ...state,
          currentAddress: action.address,
          transactions: null,
          totalRecords: null,
        };
      }

      return {
        ...state,
        currentAddress: action.address,
      };
    case 'SET_NAMES_MAP':
      return {
        ...state,
        namesMap: action.namesMap,
      };
    case 'SET_NAMES_ARRAY':
      return {
        ...state,
        namesArray: action.namesArray,
      };
    case 'SET_NAMES_EDIT_MODAL':
      return {
        ...state,
        namesEditModal: action.val,
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.transactions,
      };
    case 'SET_TOTAL_RECORDS':
      return {
        ...state,
        totalRecords: action.records,
      };
    default:
      return state;
  }
};

export const useGlobalState = () => {
  const [state, dispatch] = useContext(GlobalStateContext);

  const setTheme = (theme: any) => {
    dispatch({ type: 'SET_THEME', theme });
  };

  const setCurrentAddress = (address: string) => {
    dispatch({ type: 'SET_CURRENT_ADDRESS', address });
  };

  const setNamesMap = (namesMap: any) => {
    dispatch({ type: 'SET_NAMES_MAP', namesMap });
  };

  const setNamesArray = (namesArray: any) => {
    dispatch({ type: 'SET_NAMES_ARRAY', namesArray });
  };

  const setNamesEditModal = (val: any) => {
    dispatch({ type: 'SET_NAMES_EDIT_MODAL', val });
  };

  const setTransactions = (transactions: any) => {
    dispatch({ type: 'SET_TRANSACTIONS', transactions });
  };

  const setTotalRecords = (records: any) => {
    dispatch({ type: 'SET_TOTAL_RECORDS', records });
  };

  return {
    theme: state.theme,
    setTheme,
    currentAddress: state.currentAddress,
    setCurrentAddress,
    namesMap: state.namesMap,
    setNamesMap,
    namesArray: state.namesArray,
    setNamesArray,
    namesEditModal: state.namesEditModal,
    setNamesEditModal,
    transactions: state.transactions,
    setTransactions,
    totalRecords: state.totalRecords,
    setTotalRecords,
  };
};

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(GlobalStateReducer, initialState);

  // TODO: wrap [state, dispatch] into useMemo for better performance (test it and note the diff!)
  return <GlobalStateContext.Provider value={[state, dispatch]}>{children}</GlobalStateContext.Provider>;
};

export const useGlobalNames = () => {
  const {
    namesMap, setNamesMap, namesArray, setNamesArray,
  } = useGlobalState();
  return {
    namesMap, setNamesMap, namesArray, setNamesArray,
  };
};
