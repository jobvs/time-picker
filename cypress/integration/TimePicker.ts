describe("TimePicker", () => {
    beforeEach(() => {
        cy.visit("/iframe.html?selectedKind=TimePicker&selectedStory=Interactive");
    });

    describe("default", () => {
        it("should not show the time picker by default", () => {
            cy.get(".rdtPicker").should("not.be.visible");
        });

        it("should show the correct value", () => {
            cy.get("input").should("have.value", "01:00:00 AM");
        });
    });

    describe("on focus", () => {
        it("should show the time picker", () => {
            cy.get("input").focus();
            cy.get(".rdtPicker").should("be.visible");
        });

        it("should emit an onEnter event", () => {
            addEmitActionSpy();
            cy.get("input").focus();
            getEmittedActionName().should("equal", "onEnter");
        });
    });

    describe("on blur", () => {
        it("should hide the time picker", () => {
            cy.get("input").focus();
            cy.get("body").click("topRight");
            cy.get(".rdtPicker").should("not.be.visible");
        });

        it("should emit an onLeave event", () => {
            cy.get("input").focus();
            addEmitActionSpy();
            cy.get("body").click("topRight");
            getEmittedActionName().should("equal", "onLeave");
        });
    });

    describe("controls", () => {
        it("should add an hour", () => {
            cy.get("input").focus();
            cy.get(".rdtCounter:nth-of-type(1) .rdtBtn:first-child").click();
            cy.get("input").should("have.value", "02:00:00 AM");
        });

        it("should emit an onChange event", () => {
            cy.get("input").focus();
            addEmitActionSpy();
            cy.get(".rdtCounter:nth-of-type(1) .rdtBtn:first-child").click();
            getEmittedActionName().should("equal", "onChange");
        });
    });

    describe("manual text input", () => {
        it("invalid format shows an error after blur", () => {
            cy.get("input").type("asd");
            cy.get(".alert-danger").should("not.exist");
            cy.get("body").click("topRight");
            cy.get(".alert-danger").should("be.visible");
        });

        it("empty input should not show an error", () => {
            cy.get("input").clear();
            cy.get("body").click("topRight");
            cy.get(".alert-danger").should("not.exist");
        });

        it("valid format sets the date", () => {
            cy.get("input")
                .clear()
                .type("02:05:01 P");
            cy.get("body").click("topRight");
            cy.get(".alert-danger").should("not.exist");
            cy.get("input").should("have.value", "02:05:01 PM");
        });
    });
});

function addEmitActionSpy() {
    cy.window()
        .then(window =>
            cy.spy((window as any).__STORYBOOK_ADDONS_CHANNEL__, "emit").withArgs("storybook/actions/action-event")
        )
        .as("emitAction");
}

function getEmittedActionName() {
    return cy
        .get<sinon.SinonSpy>("@emitAction")
        .should("be.calledOnce")
        .then(spy => spy.args[0] && spy.args[0][1].data.name);
}
