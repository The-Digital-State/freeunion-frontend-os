/// <reference types='cypress' />
import '../support/commands';

describe('login', () => {
  it('login via form', () => {
    cy.visit('/login');
    cy.get('#login').type(Cypress.env('email'));
    cy.get('#password').type(Cypress.env('password'));

    cy.get('form .button-login').click();

    cy.intercept('POST', 'https://api.tradeunion.online/api/auth/login').as('login');
    cy.intercept('GET', 'https://api.tradeunion.online/api/auth/user').as('getUser');

    cy.wait('@login').should((response) => {
      expect(response.response.statusCode).equal(200);
      expect(response.request.body.email).equal(Cypress.env('email'));
      expect(response.request.body.password).equal(Cypress.env('password'));
    });

    cy.wait('@getUser').should((response) => {
      expect(response.response.statusCode).equal(200);
    });

    cy.location('pathname', { timeout: 10000 }).should('include', '/dashboard');
  });
});
