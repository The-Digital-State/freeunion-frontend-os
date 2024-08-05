/// <reference types="cypress" />
import '../support/commands';

// TODO: delete skip
describe('Help offers', () => {
  it("help offer's logic is working correct", () => {
    /* 
    - рега нового пользака через апи +
    - создание орги через апи +

    - переход на профиль (тут нужно проверить что она выбирается, вопрос) +
    - в нем есть блок что готов делать +
    - нажатие на кнопку открывает модалку +
    - проверяем что есть дефолтные значения (минимум 1)
    - выбираем рандомные 2-3 значения. рандом в тестах не оч, но тут он мне кажется норм и проблем не доставит
    - перехватываем запрос на обновление через cy.intercept
    - самбитим форму

    - проверяем что выбранные значения есть в ответе бека на этот запрос (для того чтобы проверить что бек сохранил их ок)
    - после чего модалка закрыта
    - и в блоке есть значения. тут хорошо проверить что текст совпадает с тем что мы выбирали (нужно как то сохранить в переменную на модалке)

    - после чего открывае модалку еще раз
    - убираем выбранные
    - сохраняем
    - так же проверяется что бек все сохранил
    - и на ui тоже пропали

    - после всего удаляем оргу
*/

    cy.prepareNewUser();

    cy.visit('/dashboard');

    cy.createUnion('description', 'name', 'union', 1, 'type_name').then(response => {

      expect(response.status).equal(201);
      expect(response.body.data.members_count).equal(1);
      expect(response.body.data.description).equal('description');
      expect(response.body.data.short_name).equal('union');

      cy.visit(`/union/${response.body.data.id}`);
    })
    cy.getBySel('user-menu-btn', { timeout: 10000 }).click();
    cy.getBySel('ready-to-do', { timeout: 10000 }).should('be.visible');
    cy.getBySel('choose-help-btn', { timeout: 10000 }).click();
    cy.getBySel('help-offers-modal', { timeout: 10000 }).should('be.visible');
  });
});
