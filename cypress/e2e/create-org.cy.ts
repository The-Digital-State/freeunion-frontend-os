/// <reference types='cypress' />
import '../support/commands';

import { IOrganisation } from '../../src/interfaces/organisation.interface';
import { LS_KEY } from '../../src/shared/constants/lsKey';
import { unionPage, dashboardPage } from '../../src/constans/cypress';

/*
  1. логин текущим юзером через бек +
  2. создание орги +
  3. заполнение всех полей +
  4. сабмит +
  5. перехват запроса на создание и проверка что все поля что заполнили там сохранились на беке +
  6. что success экран показался +
  7. на нем есть ссылка на админку +
  8. переход на страницу орги (нужно не через запрос, а через ui) +
  9. верхняя кнопка - пригласить друга +
  11. тайт такой же как мы и создавали (нужно ли?) +
  12. что кол-во участников в блоке - 1 +
  13. УЧАСТНИКИ ОБЪЕДИНЕНИЯ - 1 участник +
  14. есть кнопка выйти из объединения +
  15. есть ссылка на админку в меню +
*/

describe('Organization creation', () => {
  it('created union', () => {
    localStorage.setItem(LS_KEY, String(Date.now())); //do not show Feedback form

    cy.prepareNewUser();

    cy.visit('/dashboard');

    const text = 'test';

    cy.getBySel('burger-menu', { timeout: 7500 }).click();
    cy.getBySel('all-unions-btn').click();
    cy.getBySel('create-union').click();

    // union creation
    cy.getBySel('name-of-union').type(text).should('have.value', text);

    cy.getBySel('interests-select').click();
    cy.getBySel('Социальная').click();
    cy.getBySel('interests-select').click();

    cy.getBySel('areas-of-work').type(text).should('have.value', text);

    // TODO: fix here
    // const orgTypeValue = 3;
    // cy.getBySel('org-type').find(`input[value='${orgTypeValue}']`).click();
    cy.getBySel('org-type').find(`input`).first().click({ force: true });

    cy.getBySel('create-union').click();

    cy.intercept('POST', 'https://api.tradeunion.online/api/me/organization').as('createUnion');

    const orgId = cy.wait('@createUnion').should((response) => {
      const { statusCode, body } = response.response;

      const org = body.data as IOrganisation;

      expect(statusCode).equal(201);

      expect(org.members_count).equal(1);
      expect(org.description).equal(text);
      expect(org.short_name).equal(text);

      // return org.id;
      // тут проверить что есть кнопка на админку (написал в слаке)
    });

    cy.getBySel('admin-btn').should('be.visible');
    cy.getBySel('description-created-union-success').should('be.visible');

    // cy.intercept('GET', `https://api.tradeunion.online/api/me/organizations/${orgId}`).as('getUnion');
    // cy.wait('@getUnion');
    // костыль пока, чтобы выбралась орга
    cy.wait(4000);

    cy.getBySel('go-back-the-page', { timeout: 10000 }).click();

    cy.getBySel(dashboardPage.inviteFriendBtn, { timeout: 10000 }).should('be.visible');

    cy.getBySel('union-menu-btn', { timeout: 10000 }).click();
    // нужно проверить что в урле id такое же как и из запроса на создание (нужно его сохранить выше)

    // cy.wait('@getOrganization').should(({ response }) => {
    //   // мы на создании уже это проверили, этот запрос не нужен
    //   // тут нужно проверить на ui после перехода на стр орги
    //   expect(response.body.data.description).equal(text);
    //   expect(response.body.data.members_count).equal(1);
    //   expect(response.body.data.members_new_count).equal(1);
    // });

    cy.getBySel(unionPage.inviteFriendBtn, { timeout: 10000 }).should('be.visible');
    cy.getBySel('leave-organization').should('be.visible');

    cy.getBySel('admin-menu-btn').should('be.visible');
  });
});
