import React, { useCallback, useEffect } from 'react';
import { boletoReaderActions } from './actions';
import { BoletoReaderContext } from './context';
import { useBoletoReaderReducer, useWindowSizes } from './hooks';

export function BoletoBarcodeReaderProvider({
  children,
  textNotSupported,
  textValidating,
  onValidate = () => {},
}) {
  const [state, dispatch] = useBoletoReaderReducer();
  const windowSizes = useWindowSizes();
  const setter = useCallback((content) => {
    dispatch(boletoReaderActions.set(content))
  }, [dispatch])

  useEffect(() => {
    setter(windowSizes)
  }, [setter, windowSizes])

  return (
    <BoletoReaderContext.Provider
      value={{
        ...state,
        textNotSupported: textNotSupported || state.textNotSupported,
        textValidating: textValidating || state.textValidating,
        onValidate,
        dispatch,
        setter
      }}
    >
      {children}
    </BoletoReaderContext.Provider>
  );
}
