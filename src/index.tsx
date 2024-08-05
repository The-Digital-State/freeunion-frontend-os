import React, { FunctionComponent, PropsWithChildren } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.scss';
import reportWebVitals from './reportWebVitals';

import Boot from './Boot';
import createSsr from '@issr/core';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

window.dataLayer = window.dataLayer || [];
window.name = 'freeunion-app';

// @ts-ignore
const SSR: FunctionComponent<PropsWithChildren<{}>> = createSsr(window.SSR_DATA);

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    environment: process.env.REACT_APP_ENV,
    tracesSampleRate: 1.0,
  });
}

ReactDOM.hydrate(
  <SSR>
    <React.StrictMode>
      <Router>
        <Boot />
      </Router>
    </React.StrictMode>
  </SSR>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

window.OneSignal.push(function () {
  window.OneSignal.on('popoverShown', function () {
    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'push_notifications',
        action: 'subscription_form_showed',
        label: 'profile_page',
      },
    });
  });

  window.OneSignal.on('popoverAllowClick', function () {
    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'push_notifications',
        action: 'subscription_form_click_confirm',
        label: 'profile_page',
      },
    });
  });

  window.OneSignal.on('popoverCancelClick', function () {
    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'push_notifications',
        action: 'subscription_form_click_cancel',
        label: 'profile_page',
      },
    });
  });

  window.OneSignal.on('popoverClosed', function () {
    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'push_notifications',
        action: 'subscription_form_closed',
        label: 'profile_page',
      },
    });
  });
});
