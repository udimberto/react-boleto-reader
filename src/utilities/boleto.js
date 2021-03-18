import { Boleto } from 'broleto'

/**
 * Get boleto data by barcode or line code
 *
 * @param {String} code
 *
 * @returns {Object}
 */
export function getBoletoByCode(code) {
  const detected = new Boleto(String(code))

  if (!detected || !detected.valid()) {
    return null
  }

  const boleto            = detected.toJSON()
  const expiration        = new Date(boleto.expirationDate)
  const expirationYear    = expiration.getFullYear()
  const expirationInvalid = !expirationYear || expirationYear < 2000
  const expirationDate    = (expirationInvalid ? '' : boleto.expirationDate)
  const expiredDays       = (expirationInvalid ? '' : boleto.expiredDays)
  const expired           = (expirationInvalid ? false : boleto.expired)

  return {
    ...detected,
    ...boleto,
    expirationDate,
    expired,
    expiredDays,
    barcodeTyped: code
  }
}
