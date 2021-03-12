import { boletoReaderDefaultState } from './context'

export function boletoReaderReducer(state = boletoReaderDefaultState, action = {}) {
  const { type, content } = action

  switch (type) {
    case 'set':
      return {
        ...state,
        ...(content || {})
      }

    default:
      return state
  }
}
