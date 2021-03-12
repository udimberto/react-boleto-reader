import { Boleto } from 'broleto'

/**
 * Get boleto data by barcode or line code
 *
 * @param {String} code
 *
 * @returns {Object}
 */
export function getBoletoByCode(code) {
  const boleto = new Boleto(String(code))

  if (!boleto || !boleto.valid()) {
    return null
  }

  return {
    ...boleto.toJSON(),
    barcodeTyped: code
  }
}
