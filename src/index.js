import React from 'react';
import ReactDOM from 'react-dom';
import './css/style.css';
import './css/csshake.min.css';
import App from './App';
import Maintenance from './ui/Maintenance';
import {} from './func/stringExt';
import registerServiceWorker from './registerServiceWorker';

let maintenance = process.env.MAINTENANCE;

if (maintenance) {
    ReactDOM.render(<Maintenance />, document.querySelector("#root"));
} else {
    ReactDOM.render(<App />, document.querySelector("#root") )
}
registerServiceWorker();
