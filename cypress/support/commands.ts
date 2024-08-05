// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// @ts-check
/// <reference types="cypress" />
/// <reference path="../global.d.ts" />

import axios from 'axios';

axios.defaults.baseURL = Cypress.env('apiUrl');

Cypress.Commands.add('registerByApi', (): any => {
  return cy.wrap(
    axios.post('/auth/register2', {
      email: `aqa-cypress-user-${Date.now()}@mail.com`,
      password: 'secret-aqa-password-123',
    })
  );
});

Cypress.Commands.add('loginByApi', (email: string, password: string) => {
  return cy.wrap(
    axios.post('/auth/login', {
      device_name: 'cypress',
      email,
      password,
    })
  );
});

Cypress.Commands.add('createUnion', (description, name, short_name, type_id, type_name) => {
  const token = localStorage.getItem('token');
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/me/organization`,
    body: { description, name, short_name, type_id, type_name },
    auth: {
      bearer: token,
    },
  });
});

Cypress.Commands.add('setToken', (token) => {
  cy.visit('/');
  localStorage.setItem('token', token);
});

Cypress.Commands.add('prepareNewUser', (): any => {
  return cy.registerByApi().then((data) => {
    const { email, password } = JSON.parse(data.config.data);

    return cy.loginByApi(email, password).then((data) => {
      return cy.setToken(data.data.token);
    });
  });
});

Cypress.Commands.add('createInviteByApi', (): any => {
  const token = localStorage.getItem('token');

  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/invite_link`,
    auth: {
      bearer: token,
    },
  });
});

Cypress.Commands.add('getBySel', (selector, ...args): any => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});
