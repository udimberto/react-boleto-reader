import React, { useEffect } from 'react'
import { useBoletoReader } from '../../hooks'
import { getCamera } from '../../utilities'
import styles from '../../css/index.css'

export function BoletoBarcodeReaderSupport({ children }) {
  const {
    setter,
    onValidate,
    validating,
    supported,
    textNotSupported,
    textValidating
  } = useBoletoReader()

  useEffect(() => {
    setter({ supported: null, validating: true })

    getCamera()
      .then((cameraDevice) => {
        setter({ supported: cameraDevice || null, validating: false })
        onValidate(cameraDevice || null)
      })
      .catch((error) => {
        setter({ supported: null, validating: true })
        onValidate(null, error)
        console.error(error)
      })
  }, [])

  return !validating && supported ? children : (
    <div
      id="rbr_support"
      className={styles.rbr__segment}
    >
      {validating && (
        <div
          id="rbr_support_validating"
          dangerouslySetInnerHTML={{ __html: textValidating }}
        />
      )}
      {!supported && (
        <div
          id="rbr_support_not_supported"
          dangerouslySetInnerHTML={{ __html: textNotSupported }}
        />
      )}
    </div>
  )
}
