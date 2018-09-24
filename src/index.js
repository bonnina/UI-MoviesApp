import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SPA from './components/App';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(<SPA />, document.getElementById('root'));
registerServiceWorker();



