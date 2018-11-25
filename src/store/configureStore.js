import { createStore, compose, applyMiddleware } from 'redux';
import { reduxReactRouter } from 'redux-router';
import { createHashHistory as createHistory } from 'history';
import { config } from '../config/config';
import thunk from 'redux-thunk';
import routes from '../config/routes';
import rootReducer from '../reducers/rootReducer';
import { authToken, checkOnline, checkForServerError } from '../middleware/utils';

export default function configureStore(initialState) {
  const finalCreateStore = compose(
      applyMiddleware(
        thunk,
        authToken,
        checkOnline,
        checkForServerError),
      reduxReactRouter({
        routes,
        createHistory
      }),
      (window.devToolsExtension && config().devTool) ? window.devToolsExtension() : f => f
  )(createStore);

  const store = finalCreateStore(rootReducer, initialState);

  return store;
}
