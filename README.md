# ARTE - Design-System 1.0.0

O Ama Design System é uma biblioteca de componentes para servir as seguintes aplicações:

- AccessMonitor
- MyMonitor
- Observatório
- AdminMonitorSuite - Backoffice do sistema

Para mais informações, visite o site, onde se encontra todos os componentes e os parâmetros que são possíveis passar.

## Instalação
```
    npm install @a12e/accessmonitor-ds
```

É necessário importar os estilos gerais
```
    import '@a12e/accessmonitor-ds/dist/index.css';
```

Para que os Icons funcionem devidamente, foi criada uma pasta "styles" se não existia ainda, e foi copiado um ficheiro css
chamado fontStyle onde contém os importes dos Icons.

É necessário importar estes estilos no App.js ou App.jsx

```
    import "./styles/fontStyle.css";
```


## Utilização
```
    import { Icon } from '@a12e/accessmonitor-ds'

    <Icon name={"AMA-SeloDark2-Line"} />
```
