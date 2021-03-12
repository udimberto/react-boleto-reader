# react-boleto-reader

Utility to read, via browser camera, brazilian-banking barcode.

[![NPM](https://img.shields.io/npm/v/react-boleto-reader.svg)](https://www.npmjs.com/package/react-boleto-reader) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Install

```bash
npm install --save react-boleto-reader
```


## HTTPS required

Browser camera only will be available to use if:

  1. The device has camera (KKK, sorry);
  2. Your application is running over HTTPS

To apps initializeds by `create-react-app`, this should works:
```
HTTPS=true npm start
```


## Usage

```jsx
import React, { useState } from 'react';
import { BoletoBarcodeReader, BoletoBarcodeReaderProvider } from 'react-boleto-reader';
import 'react-boleto-reader/dist/index.css';

function Example() {
  const [boleto, setBoleto] = useState(null);
  const [reading, setReading] = useState(false);

  function onBoletoDetected(detectedBoleto) {
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
      return;
    }

    setReading(false)
    setBoleto(detectedBoleto)
  }

  function restart() {
    setBoleto(null);
    setReading(true);
  }

  return (
    <main style={{ textAlign: 'center' }}>
      <h1>
        React Boleto Barcode Reader example
      </h1>
      <section>

        {!reading && !boleto && (
          <button
            type="button"
            onClick={restart}
          >
            Start Reading
          </button>
        )}

        {reading && (
          <BoletoBarcodeReaderProvider>
            <BoletoBarcodeReader
              id="bora-ler-um-boleto-maroto"
              onDetected={onBoletoDetected}
              onCancel={() => setReading(false)}
            />
          </BoletoBarcodeReaderProvider>
        )}

        {boleto && (
          <article id="result">
            <pre
              dangerouslySetInnerHTML={{
                __html: (
                  JSON
                    .stringify(boleto || {})
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
                onClick={restart}
              >
                Read Again
              </button>
            </footer>
          </article>
        )}

      </section>
    </main>
  );
}
```


## Could be better, right?

Sorry.

I dedicated about 32 hours to do this package, without any previous plan and idea, only with some inspirations.
Running to delivery another company project, who is the principal and much biggier.

So, if you have any [suggestions](https://github.com/udimberto/react-boleto-reader/issues/new), or be comfortable to code some improvements, feel free to do so.


## Special thanks

All the awesome projects which made this other one possible:

  - [Quagga](https://www.npmjs.com/package/quagga)
  - [Quagga2](https://www.npmjs.com/package/@ericblade/quagga2) by @ericblade
  - [Broleto](https://www.npmjs.com/package/broleto) (vaaaaaaaai Brasil, corooooi)
  - [This functional example](https://github.com/saraiva1989/LeituraCodigoBarraBoleto) by @saraiva1989 (valeu, meu considerado)
  - [Create React Library](https://www.npmjs.com/package/create-react-library)
  - [DinoSoftLabs](https://www.flaticon.com/authors/dinosoftlabs) by icon used on example page


## License

MIT © [udimberto](https://github.com/udimberto)
