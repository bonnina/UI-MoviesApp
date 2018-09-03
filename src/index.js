import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './index.css';
import SPA from './App';
import registerServiceWorker from './registerServiceWorker';




ReactDOM.render(<SPA />, document.getElementById('root'));
registerServiceWorker();
