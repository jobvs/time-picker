Cypress.Commands.add("addEmitActionSpy", () => {
    cy.window()
        .then(window =>
            cy.spy((window as any).__STORYBOOK_ADDONS_CHANNEL__, "emit").withArgs("storybook/actions/action-event")
        )
        .as("emitAction");
});

Cypress.Commands.add("getEmittedActionName", () => {
    return cy
        .get<sinon.SinonSpy>("@emitAction")
        .should("be.calledOnce")
        .then(spy => spy.args[0] && spy.args[0][1].data.name);
});

declare namespace Cypress {
    interface Chainable {
        addEmitActionSpy: () => void;
        getEmittedActionName: () => string;
    }
}
