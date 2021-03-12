import React from 'react'
import { useBoletoReader } from '../../hooks'
import styles from '../../css/index.css'

export function RequireLandscape({
  children,
  height,
  minWidth = 640,
  onCancel,
  textLandscape
}) {
  const { windowWidth, textLandscape: textFromContext } = useBoletoReader()
  const requireLargeWidth = windowWidth < minWidth

  return !requireLargeWidth ? children : (
    <div
      className={styles.rbr__segment}
      style={{
        '--rbr-height': height
      }}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: String(textLandscape || textFromContext)
            .replace('#minWidth', `${minWidth} pixels`)
            .replace('#wWidth', `${windowWidth} pixels`)
        }}
      />
      {onCancel && (
        <button
          type="button"
          style={{ marginTop: '40px' }}
          className={styles.rbr__btn}
          onClick={onCancel}
        >
          Cancelar
        </button>
      )}
    </div>
  )
}
