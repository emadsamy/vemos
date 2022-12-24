import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import ReduxThunk from "redux-thunk";
import { reducer } from "./store/reducer";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Toaster } from "react-hot-toast"
// import "@styles/react/libs/react-hot-toasts/react-hot-toasts.scss"

window.baseURL = 'http://127.0.0.1:8000/api/v1';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const store = configureStore({ reducer: reducer, composeEnhancers });

// const store = createStore(
//   reducer,
//   composeEnhancers(applyMiddleware(ReduxThunk))
// );

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Suspense fallback={'Loading...'}>
        <Toaster
          position={'top-right'}
          toastOptions={{ className: "react-hot-toast" }}
        />
        <App />
      </Suspense>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
