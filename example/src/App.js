import React, { useCallback, useLayoutEffect, useState } from 'react';

import { BarcodeReader, BoletoBarcodeReader, BoletoBarcodeReaderProvider, BoletoBarcodeReaderSupport, isSmartDevice } from 'react-boleto-reader';
import 'react-boleto-reader/dist/index.css'; /** The default styles. It's optional. */

import './index.css'; /** Not important: example styles. */

export default function App() {
  /** Not important: example definitions */
  const tabs = [ 'boleto', 'barcode' ];
  const tabsId = 'example_tabs';
  const headerId = 'example_header';
  const [tab, setTab] = useState(tabs[0]);
  const [boleto, setBoleto] = useState(null);
  const [barcode, setBarcode] = useState(null);
  const [reading, setReading] = useState(false);
  const [readersHeight, setReadersHeight] = useState(0);

  /**
   * Not important: example stuff
   */
  const reset = useCallback(() => {
    setBoleto(null);
    setBarcode(null);
    setReading(false);
  }, []);

  /**
   * Not important: example stuff
   */
  const restart = useCallback(() => {
    setBoleto(null);
    setBarcode(null);
    setReading(true);
  }, []);

  /**
   *
   */
  const onCancel = useCallback(() => {
    reset();
  }, [reset]);

  /**
   * Important:
   *
   * This is the callback defined to receive boleto data
   * when the reader have sucesse identifying that big barcode.
   *
   * In this example we have the `reading` variable,
   * who helps to render or not render the BoletoBarcodeReader component.
   *
   * You don't need to do like this.
   *
   * @param {Object} detectedBoleto
   */
  const onDetectBoleto = useCallback((detectedBoleto) => {
    setReading(false);

    const {
      barcode,
      banks,
      expired,
      expiredDays,
      expirationDate,
      prettyAmount,
      type,
    } = detectedBoleto;

    const confirmed = window.confirm(
      'Estes são os dados do boleto? '.toUpperCase()
      + `\n\nTipo: \n${type} `
      + `\n\nBanco: \n${banks} `
      + `\n\nValor: \n${prettyAmount} `
      + `\n\nVencimento: \n${expirationDate}`
      + `\n\nVencido: \n${expired ? 'SIM' : 'NÃO'}`
      + `\n\nDias Vencido: \n${expiredDays}`
      + `\n\nCódigo de Barras: \n${barcode}`
      + '\n(É diferente do número impresso no boleto, o chamado "linha digitável")'
    );

    if (!confirmed) {
      setReading(true);

      return;
    }

    setReading(false);
    setBoleto(detectedBoleto);
  }, []);

  /**
   * Important:
   *
   * This is the callback defined to receive barcode number
   * when the reader have sucesse identifying.
   *
   * In this example we have the `reading` variable,
   * who helps to render or not render the BarcodeReader component.
   *
   * You don't need to do like this.
   *
   * @param {Object} detectedBoleto
   */
  const onDetectBarcode = useCallback((result, code) => {
    setReading(false);

    const confirmed = window.confirm(
      `It's the correct code? `.toUpperCase()
      + `\n\n${code} `
    );

    if (!confirmed) {
      setReading(true);

      return;
    }

    setReading(false);
    setBarcode({ code, ...result });
  }, []);

  /**
   *
   * @param {String} tabName
   */
  const selectTab = useCallback((tabName) => {
    if (tab === tabName) {
      return;
    }

    reset();
    setTab(tabName);
  }, [reset, tab]);

  /**
   * Not important: example stuff
   */
  const getElementHeight = useCallback((elementId = '') => {
    const element = document.getElementById(elementId);

    return !element || !element.offsetHeight ? 0 : element.offsetHeight;
  }, []);

  /**
   * Not important: example stuff
   */
  useLayoutEffect(() => {
    function calcReaderHeight() {
      const tabsHeight = getElementHeight(tabsId);
      const headerHeight = getElementHeight(headerId);

      setReadersHeight(`${window.innerHeight - (tabsHeight + headerHeight)}px`);
    }

    calcReaderHeight();

    window.addEventListener('resize', calcReaderHeight);

    return () => {
      window.removeEventListener('resize', calcReaderHeight);
    }
  }, [getElementHeight]);

  return (
    <main>
      <header
        id={headerId}
        className="header"
      >
        <h1>
          Ler código de barras de boleto
        </h1>
      </header>
      <section>
        <div
          id={tabsId}
          className="tabs"
        >
          {tabs.map((tabName) => (
            <button
              type="button"
              id={`${tabsId}_btn_${tabName}`}
              key={`${tabsId}_btn_${tabName}`}
              className={`btn ${tabName === tab ? ' active' : ''}`}
              onClick={() => selectTab(tabName)}
              disabled={tab === tabName}
            >
              {tabName}
            </button>
          ))}
        </div>
        <BoletoBarcodeReaderProvider>
          <BoletoBarcodeReaderSupport>
            {!isSmartDevice ? (
              <article id="not-smart-device">
                <div>
                  Requer um dispositivo com câmera de alta qualidade.
                </div>
              </article>
            ) : (
              <>
                {reading ? (
                  <div id="readers">
                    {tab === 'boleto' && (
                      <div id={`${tabsId}_reader_boleto`}>
                        <BoletoBarcodeReader
                          height={readersHeight}
                          onCancel={onCancel}
                          onDetected={onDetectBoleto}
                        />
                      </div>
                    )}
                    {tab === 'barcode' && (
                      <div id={`${tabsId}_reader_barcode`}>
                        <BarcodeReader
                          height={readersHeight}
                          onCancel={onCancel}
                          onDetected={onDetectBarcode}
                        />
                      </div>
                    )}
                  </div>
                ) : ((!boleto && !barcode) ? (
                  <article id="start">
                    <button
                      type="button"
                      className="btn"
                      onClick={restart}
                    >
                      Começar Leitura
                    </button>
                  </article>
                ) : (
                  <article id="result">
                    <pre
                      dangerouslySetInnerHTML={{
                        __html: (
                          JSON
                            .stringify(boleto || barcode || {})
                            .replace(/{/g, '{<br />  ')
                            .replace(/":/g, '": ')
                            .replace(/,"/g, ',<br />  "')
                            .replace(/}/g, '<br />}')
                        )
                      }}
                    />
                    <footer id="result_footer">
                      <button
                        type="button"
                        className="btn"
                        onClick={restart}
                      >
                        Read Again
                      </button>
                    </footer>
                  </article>
                ))}
              </>
            )}
          </BoletoBarcodeReaderSupport>
        </BoletoBarcodeReaderProvider>
      </section>
    </main>
  )
}
