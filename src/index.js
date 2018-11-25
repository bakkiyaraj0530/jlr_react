import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { ReduxRouter } from 'redux-react-router';
import { Provider } from 'react-redux';
import '../node_modules/foundation-sites/dist/foundation.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/fonts.css';
import configureStore from './store/configureStore';
import routes from './config/routes';
const store = configureStore(window.__initialState);
const rootView = (
  <div>
    <ReduxRouter routes={ routes } />
  </div>
);

ReactDOM.render(
    <Provider store={ store }>
      { rootView }
    </Provider>,
    document.getElementById('app')
);
