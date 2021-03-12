import { createContext } from 'react'

export const boletoReaderDefaultState = {
  supported: true,
  textLandscape: ' Largura de tela insuficiente. <br/><br/> Coloque o dispositivo em posição horizontal ou maximize a janela. <br/><br/> Se ainda assim não funcionar, utilize outro dispositivo com resolução superior a #minWidth. <br/><br/> Esta janela atualmente tem largura de #wWidth.',
  textNotSupported: ' Aparentemente este dispositivo não tem suporte a câmera ou o uso dela foi negado, <br /> o quê impossibilita a leitura de códigos de barras. ',
  textValidating: ' Buscando por dispositivo de vídeo... ',
  validating: true,
  windowHeight: window.innerHeight,
  windowWidth: window.innerWidth,
}

export const BoletoReaderContext = createContext(boletoReaderDefaultState)
