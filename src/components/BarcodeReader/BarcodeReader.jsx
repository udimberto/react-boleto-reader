import React, { useCallback, useLayoutEffect, useState } from 'react'
import {
  init as quaggaInit,
  start as quaggaStart,
  stop as quaggaStop,
  canvas as quaggaCanvas,
  ImageDebug as quaggaImageDebug,
  onDetected as quaggaOnDetected,
  onProcessed as quaggaOnProcessed,
  offProcessed as quaggaOffProcessed,
  offDetected as quaggaOffDetected
} from '@ericblade/quagga2'
import genericStyles from '../../css/index.css'
import styles from './styles.module.css'

export function BarcodeReader({
  id = 'react-boleto-reader--barcode',
  init = {},
  inputStream = {},
  decoder = {},
  readers = [
    { format: 'ean_reader', config: {} },
    { format: 'code_128_reader', config: {} }
  ],
  height = window.innerHeight,
  canvasWidth = 1280,
  canvasHeight = 720,
  aspectRatio = {
    min: 0,
    max: 1
  },
  onInit = () => {},
  onError = () => {},
  onDetected = () => {},
  onCancel = () => {},
  onProcessed = () => {},
  svgDetectingBoxesCoords = {
    x: 0,
    y: 1
  },
  svgDetectingBoxes = {
    color: 'rgba(255, 0, 0, .25)',
    lineWidth: 2
  },
  svgDetectingBox = {
    color: 'transparent',
    lineWidth: 2
  },
  svgDetectingLine = {
    color: 'rgb(255, 0, 0, .8)',
    lineWidth: 4
  },
  textHeader = 'Com boa iluminação, posicione o código de barras na área delimitada:',
  textCancel = 'Cancelar',
  frequency = 5
}) {
  const [compareWidth, setCompare] = useState(window.innerWidth)
  const [resizing, setResizing] = useState(null)
  const [reading, setReading] = useState(true)
  const videoHeight = parseInt(height, 10)
  const videoHeightHalf = videoHeight / 2
  const canvasHeightHalf = canvasHeight / 2
  const canvasY = canvasHeightHalf - parseInt(height, 10) / 2
  const canvasTop =
    videoHeight > canvasHeight
      ? `${videoHeightHalf - canvasHeightHalf}px`
      : `-${canvasY - 40}px`

  /**
   * Initialize Quagga2 and set the listeners
   */
  const run = useCallback(() => {
    try {
      quaggaInit(
        {
          inputStream: {
            type: 'LiveStream',
            target: `#${id}`,
            constraints: {
              width: canvasWidth,
              height: canvasHeight,
              facingMode: 'environment',
              aspectRatio
            },
            ...inputStream
          },
          frequency: frequency,
          singleChannel: true,
          locate: true,
          locator: {
            patchSize: 'medium',
            halfSample: true
          },
          ...init,
          decoder: {
            readers,
            ...decoder
          }
        },
        (err) => {
          if (err) {
            onError(err)
            console.error(err)
            return
          }

          quaggaStart()
          onInit()
        }
      )

      quaggaOnDetected((result) => {
        const {
          codeResult: { code }
        } = result || {}

        onDetected(result, code)
      })

      quaggaOnProcessed((result) => {
        onProcessed(result)

        const shouldDrawGuides =
          !!svgDetectingBoxes || svgDetectingBox || svgDetectingLine

        if (!shouldDrawGuides || !result || typeof result !== 'object') {
          return
        }

        const drawingCtx = quaggaCanvas.ctx.overlay
        const drawingCanvas = quaggaCanvas.dom.overlay
        const {
          box: guideBox,
          boxes: guideBoxes,
          codeResult,
          line: guideLine
        } = result
        const { code: readedCode } = codeResult || {}

        if (guideBoxes && svgDetectingBoxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute('width')),
            parseInt(drawingCanvas.getAttribute('height'))
          )

          guideBoxes
            .filter((guideBoxItem) => guideBoxItem !== guideBox)
            .forEach((guideBoxItem) => {
              quaggaImageDebug.drawPath(
                guideBoxItem,
                svgDetectingBoxesCoords,
                drawingCtx,
                svgDetectingBoxes
              )
            })
        }

        if (guideBox && svgDetectingBox) {
          quaggaImageDebug.drawPath(
            guideBox,
            { x: 0, y: 1 },
            drawingCtx,
            svgDetectingBox
          )
        }

        if (readedCode && svgDetectingLine) {
          quaggaImageDebug.drawPath(
            guideLine,
            { x: 'x', y: 'y' },
            drawingCtx,
            svgDetectingLine
          )
        }
      })
    } catch (error) {
      onError(error)
    }
  }, [onInit, onDetected, onProcessed, onError])

  /**
   * Turn camera off
   */
  const cameraOff = useCallback(() => {
    try {
      const video = document.querySelector('video')
      const mediaStream = video.srcObject
      const tracks = mediaStream.getTracks()

      tracks.forEach((track) => {
        track.stop()
      })
    } catch (e) {
      console.error('BoletoBarcodeReader could not stop the camera',)
    }
  })

  /**
   * Stop the party
   */
  const stop = useCallback(() => {
    quaggaOffDetected()
    quaggaOffProcessed()
    quaggaStop()
    cameraOff()
  }, [])

  /**
   * Listener to screen resize, restarting the reader
   */
  const handleScreenResize = useCallback(() => {
    clearTimeout(resizing)

    if (compareWidth === window.innerWidth) {
      return
    }

    stop()
    setResizing(
      setTimeout(() => {
        run()
        setCompare(window.innerWidth)
      }, 1500)
    )
  }, [run, stop, compareWidth])

  /**
   * User cancel callback
   */
  const handleCancel = useCallback(() => {
    onCancel()
    quaggaStop()
    setTimeout(() => setReading(false), 2000)
  }, [onCancel, stop, run])

  /**
   * Start the party at the first component render call
   */
  useLayoutEffect(() => {
    run()
    window.addEventListener('resize', handleScreenResize)

    /**
     * Unmount
     */
    return () => {
      window.removeEventListener('resize', handleScreenResize)
    }
  }, [run, handleScreenResize])

  return !reading ? null : (
    <div
      id={id}
      className={styles.rbr}
      style={{
        '--rbr-canvas-top': canvasTop,
        '--rbr-height': height,
        height
      }}
    >
      <div className={styles.rbr__overlay}>
        <div className={styles.rbr__overlay__item}>
          <small>
            {textHeader}
          </small>
        </div>
        <div className={styles.rbr__overlay__line}>
          <hr />
        </div>
        <div className={styles.rbr__overlay__item}>
          <button
            type='button'
            className={`${genericStyles.rbr__btn} rbr__btn`}
            onClick={handleCancel}
          >
            {textCancel}
          </button>
        </div>
      </div>
    </div>
  )
}
