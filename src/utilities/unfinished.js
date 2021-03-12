export const spacer = ' '

/**
 * Calc the verifier digit from a specific barcode part
 *
 * @param {String} barCodePart
 *
 * @returns {String}
 */
export function getBoletoBarCodePartVerifier(barCodePart) {
  if (!barCodePart) {
    return ''
  }

  let verifier = 0
  let isEven = true

  for (let i = barCodePart.length; i > 0; i--) {
    const digit = parseInt(barCodePart[i - 1])
    verifier += !isEven
      ? digit
      : Math.floor((digit * 2) / 10) + ((digit * 2) % 10)
    isEven = !isEven
  }

  verifier = verifier % 10

  if (verifier !== 0) {
    verifier = 10 - verifier
  }

  return String(verifier || 0)
}

/**
 * Get the barcode of essential service type
 * (Eg.: Watter or Energy bills)
 *
 * @param {String} barCode
 *
 * @returns {String}
 */
export function getBoletoBarCodeEssentialService(barCode = '') {
  const part1 = barCode.slice(0, 11)
  const part2 = barCode.slice(11, 22)
  const part3 = barCode.slice(22, 33)
  const part4 = barCode.slice(33, 44)

  return [
    part1,
    getBoletoBarCodePartVerifier(part1),
    spacer,
    part2,
    getBoletoBarCodePartVerifier(part2),
    spacer,
    part3,
    getBoletoBarCodePartVerifier(part3),
    spacer,
    part4,
    getBoletoBarCodePartVerifier(part4)
  ].join('')
}

/**
 * Get the barcode of generic type
 * (Eg.: Credit Card bills)
 *
 * @param {String} barCode
 *
 * @returns {String}
 */
export function getBoletoBarCodeGeneric(barCode) {
  const partBank = barCode.slice(0, 3)
  const partCurrency = barCode.slice(3, 4)
  const partFreeField1 = barCode.slice(19, 24)
  const partFreeField2 = barCode.slice(24, 34)
  const partFreeField3 = barCode.slice(34, 44)
  const partVerifier4 = barCode.slice(4, 5)
  const partExpiration = barCode.slice(5, 9)
  const partAmount = barCode.slice(9, 19)

  return [
    partBank,
    partCurrency,
    partFreeField1,
    getBoletoBarCodePartVerifier(`${partBank}${partCurrency}${partFreeField1}`),
    spacer,
    partFreeField2,
    getBoletoBarCodePartVerifier(partFreeField2),
    spacer,
    partFreeField3,
    getBoletoBarCodePartVerifier(partFreeField3),
    spacer,
    partVerifier4,
    spacer,
    partExpiration,
    partAmount
  ].join('')
}

/**
 * Validate boleto barCode from the code detected by browser camera
 *
 * @param {String} detected - detect value from quagga interpretation
 *
 * @returns {String} barCode
 */
export function getBoletoBarCode(detected = '') {
  const barCode = String(detected).replace(/\D/g, '')

  if (barCode.length !== 44) {
    return ''
  }

  return barCode[0] !== '8'
    ? getBoletoBarCodeGeneric(barCode)
    : getBoletoBarCodeEssentialService(barCode)
}
