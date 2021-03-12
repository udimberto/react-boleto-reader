import { useContext, useLayoutEffect, useReducer, useState } from 'react';
import { boletoReaderDefaultState, BoletoReaderContext } from './context';
import { boletoReaderReducer } from './reducer';

export function useBoletoReader() {
  return useContext(BoletoReaderContext);
}

export function useBoletoReaderReducer() {
  return useReducer(boletoReaderReducer, boletoReaderDefaultState);
}

export function useWindowSizes(delay = 500) {
  const [sizes, setSizes] = useState({
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  })

  useLayoutEffect(() => {
    let resizeDelay = null

    function handleResize() {
      clearTimeout(resizeDelay)

      resizeDelay = setTimeout(() => {
        setSizes({
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight
        })
      }, delay);
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return sizes
}

