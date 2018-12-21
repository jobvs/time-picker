describe("TimePicker mobile", () => {
    beforeEach(() => {
        cy.visit("/iframe.html?selectedKind=TimePicker&selectedStory=Interactive");
    });

    it("uses a native time input", () => {
        cy.get("input").should("have.attr", "type", "time");
        cy.get("button").should("not.be.visible");
    });

    it("emits an onEnter event on focus", () => {
        cy.addEmitActionSpy();
        cy.get("input").focus();
        cy.getEmittedActionName().should("equal", "onEnter");
    });

    it("emits an onChange event when changing time", () => {
        cy.get("input").focus();
        cy.addEmitActionSpy();
        cy.get("input").type("23:15");
        cy.getEmittedActionName().should("equal", "onChange");
    });

    it("emits an onLeave event on blur", () => {
        cy.get("input").focus();
        cy.addEmitActionSpy();
        cy.get("body").click("topRight");
        cy.getEmittedActionName().should("equal", "onLeave");
    });
});
