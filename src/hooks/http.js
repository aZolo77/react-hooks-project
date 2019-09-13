import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
};

const httpReducer = (crntState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      };
    case 'RESPONSE':
      return {
        ...crntState,
        loading: false,
        data: action.responseData,
        extra: action.extra
      };
    case 'ERROR':
      return { ...crntState, loading: false, error: action.errorMessage };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error();
  }
};

// * custom react hook that handles logic
const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendRequest = useCallback((url, method, body, extra, identifier) => {
    dispatchHttp({ type: 'SEND', identifier });
    fetch(url, {
      method,
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        return res.json();
      })
      .then(responseData => {
        dispatchHttp({ type: 'RESPONSE', responseData, extra });
      })
      .catch(err => {
        dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
      });
  }, []);

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest,
    reqExtra: httpState.extra,
    identifier: httpState.identifier,
    clear
  };
};

export default useHttp;
