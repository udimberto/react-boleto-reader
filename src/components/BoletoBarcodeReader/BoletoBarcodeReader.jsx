import React, { useCallback } from 'react'
import { BarcodeReader } from '../BarcodeReader'
import { RequireLandscape } from '../RequireLandscape'
import { getBoletoByCode } from '../../utilities'

export function BoletoBarcodeReader({
  id = 'react-boleto-reader',
  readers = ['i2of5_reader'],
  height,
  minWidth = 640,
  aspectRatio = {
    min: 1,
    max: 2
  },
  onDetected = () => {},
  onCancel,
  landscape = true,
  textLandscape = '',
  ...props
}) {
  const Wrapper = landscape ? RequireLandscape : Fragment;
  const wrapperProps = !landscape ? {} : {
    height: height,
    minWidth: minWidth,
    onCancel: onCancel,
    textLandscape: textLandscape
  }

  /**
   * Intercept the readed code, validating if it's a valid boleto.
   *
   * @param {Object} result - Quagga lib result data
   */
  const handleDetected = useCallback((result, code) => {
    const boleto = getBoletoByCode(code)

    if (!boleto) {
      return
    }

    onDetected(boleto, code, result)
  }, [])

  return (
    <Wrapper {...wrapperProps}>
      <BarcodeReader
        id={id}
        height={height || wHeight}
        readers={readers}
        aspectRatio={aspectRatio}
        onCancel={onCancel}
        onDetected={handleDetected}
        {...props}
      />
    </Wrapper>
  )
}
