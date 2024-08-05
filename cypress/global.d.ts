/// <reference types="cypress" />

import { AxiosResponse } from 'axios';

declare global {
  namespace Cypress {
    interface Chainable {
      getBySel(dataTestAttribute: string, args?: any): Chainable<Element>;

      registerByApi(): Chainable<any>;
      loginByApi(email: string, password: string): Chainable<AxiosResponse<any>>;

      setToken(token: string): void;
      prepareNewUser(): Chainable<any>;

      createInviteByApi(): Chainable<any>;
      createUnion(description: string, name: string, short_name: string, type_id: number, type_name: string): Chainable<any>;
    }
  }
}
