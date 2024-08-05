/// <reference types="cypress" />

import '../support/commands';

import { dashboardPage } from '../../src/constans/cypress';
import { LS_KEY } from '../../src/shared/constants/lsKey';

/*
  1. логин через бек
  2. создание орги через бек (с любыми данными)
  3. переход на страницу профиля
  4. там должна быть кнопка пригласить друга
  5. при нажатии на нее переход на экран инвайта
  6. там должен быть тайтл что приглашаем в эту оргу что создали
  7. и кнопка генерации ссылки
  8. при нажатии показывается ссылка
  9. и она копируется в буфер обмена
*/

describe('Invites', () => {
  it('invite without org', () => {
    localStorage.setItem(LS_KEY, String(Date.now())); //do not show Feedback form

    cy.prepareNewUser();
    cy.visit('/dashboard');

    cy.getBySel(dashboardPage.inviteFriendBtn, { timeout: 10000 }).click();
    cy.getBySel('generate-link', { timeout: 10000 }).click();

    // cy.get('header').find('.SimpleRoutingContainer_title__1lN7e');
    // все селекторы через data-cy

    cy.getBySel('copy-link').click();
    cy.getBySel('invite-url').contains(/http/);
    // поверить что длина больше 10

    cy.window().its('navigator.clipboard').invoke('readText').should('contain', 'http');
  });

  it('invite to org', () => {
    // проверить что работают инвайты в оргу
    // тоже самое что выше + создание орги через апи + проверить тайтл на скрине и что на бек ушел параметр организации
  });
});
