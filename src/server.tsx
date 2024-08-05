import * as React from 'react';
import express from 'express';
import serialize from 'serialize-javascript';
import { promises as fs } from 'fs';
import Boot from './Boot';
import { matchPath, StaticRouter } from 'react-router-dom';
import { routes } from './Routes';
import { DeviceService } from './services/device.service';
import { serverRender } from '@issr/core';
import compression from 'compression';
import { Helmet } from 'react-helmet';
import { getUrl } from 'modules/notifications';
import { getNotificationRedirectUrl } from 'shared/modules/notifications';
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

const app = express();

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(compression());

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN_SERVER,
  environment: process.env.REACT_APP_ENV,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({
      app,
    }),
  ],
  tracesSampleRate: 1.0,
});

const templatePath = '../build/index.html';

async function returnSSR(req, res) {
  console.log('Render url', req.url);

  DeviceService.userAgent = req.get('User-Agent');
  const { html, state } = await serverRender(() => (
    <StaticRouter location={req.url}>
      <Boot />
    </StaticRouter>
  ));

  const helmet = Helmet.renderStatic();
  let template = await fs.readFile(templatePath, 'utf8');

  template = template
    .replace(`<div id="root"></div>`, `<div id="root" class="">${html}</div>`)

    // minified after build
    .replace('window.SSR_DATA={}', `window.SSR_DATA = ${serialize(state, { isJSON: true })}`)
    .replace(
      '</head>',
      `
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    </head>
    `
    );

  res.send(template);
}

const SsrRoutes = [
  '/index.html',
  routes.HOME,
  routes.PRIVACY_POLICY,
  routes.RULES_SERVICE,
  routes.SECURITY,
  routes.LOGIN,
  routes.FORGET_PASSWORD,

  routes.STICKERS,
  routes.CONTACT_US,
  routes.ABOUT_US,
  routes.SUPPORT_US,

  routes.task.route,

  routes.UNIONS,
  routes.UNION,
  routes.UNION_FU,
  routes.union.route,
  routes.NEWS,
  routes.TAGS_NEWS,
  routes.NEWS_BELARUS_FOR_UKRAINE,
  routes.newsDetails.route,

  routes.sectionMaterials.route,
  routes.materialDetails.route,
  routes.KNOWLEDGE_BASE_MATERIALS,
  routes.KNOWLEDGE_BASE_SECTIONS,
];

app.get('/*', async (req, res, next) => {
  if (req.url.includes('/handle-push')) {
    const url = getNotificationRedirectUrl(req.url.split('?')[1], getUrl);
    res.redirect(url || routes.HOME);
    return;
  }

  // kostyl, need to fix matching in routing
  if (
    matchPath(req.url, {
      path: routes.newsSuggest.route,
      exact: true,
      strict: true,
    })
  ) {
    next();
    return;
  }

  const isSsrRoute =
    SsrRoutes.find(
      (route) =>
        matchPath(req.url, {
          path: route,
          exact: true,
          strict: true,
        })
      // not matching query params
    ) || req.url.includes(routes.TAGS_NEWS);

  if (isSsrRoute) {
    try {
      await returnSSR(req, res);
      return;
    } catch (error) {
      next(error);
    }
  }
  next();
});

app.use(express.static('../build'));
app.use('/storybook', express.static('../storybook-static'));

app.get('/*', async (req, res) => {
  const template = await fs.readFile(templatePath, 'utf8');
  res.send(template);
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(err + '\n' + res.sentry);
});

app.listen(4000, () => {
  console.log('Listening on port 4000');
});
