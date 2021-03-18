# React Boleto Reader

Utility to read, via browser camera, brazilian-banking barcode.

[![NPM](https://img.shields.io/npm/v/react-boleto-reader.svg)](https://www.npmjs.com/package/react-boleto-reader) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Install

```bash
npm install --save react-boleto-reader
```

## Recommendation

Use this component with smart devices, witch probably have high quality cameras.


## Important

The project was built with **React Hooks** features, requiring versions starting from `16.8.x`.

Browser camera only will be available to use if:

  1. The device have a camera (KKK, sorry);
  2. Your application is running over HTTPS

To apps initializeds by `create-react-app`, this should works:
```
HTTPS=true npm start
```


## Usage

Examples at this [codesandbox](https://codesandbox.io/s/react-boleto-reader-example-r1ork).


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
