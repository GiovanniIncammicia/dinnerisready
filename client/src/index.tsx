import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import "@reach/tooltip/styles.css";
import "@reach/menu-button/styles.css";
import "@reach/slider/styles.css";
import "@reach/listbox/styles.css";
import "@reach/dialog/styles.css";
import App from './App';
import * as serviceWorker from './serviceWorker';
import './fontawesome';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.register();
