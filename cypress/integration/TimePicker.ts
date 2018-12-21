describe("TimePicker", () => {
    beforeEach(() => {
        cy.visit("/iframe.html?selectedKind=TimePicker&selectedStory=Interactive");
    });

    describe("default", () => {
        it("should not show the time picker by default", () => {
            cy.get(".rdtPicker").should("not.be.visible");
        });

        it("should show the correct value", () => {
            cy.get("input").should("have.value", "01:00");
        });
    });

    describe("on button click", () => {
        it("should show the time picker", () => {
            cy.get("button").click();
            cy.get(".rdtPicker").should("be.visible");
        });

        it("should emit an onEnter event", () => {
            cy.addEmitActionSpy();
            cy.get("button").click();
            cy.getEmittedActionName().should("equal", "onEnter");
        });

        it("should not emit onEnter when switching between button and text input", () => {
            cy.get("button").click();
            cy.addEmitActionSpy();
            cy.get("input").focus();
            cy.get("button").click();
            cy.get<sinon.SinonSpy>("@emitAction").should("not.be.called");
        });

        it("esc should close the picker", () => {
            cy.get("button").click();
            cy.get(".rdtPicker").should("be.visible");
            cy.get(".widget-time-picker").type("{esc}");
            cy.get(".rdtPicker").should("not.be.visible");
        });
    });

    describe("on input focus", () => {
        it("should not show the time picker", () => {
            cy.get("input").focus();
            cy.get(".rdtPicker").should("not.be.visible");
        });

        it("should emit an onEnter event", () => {
            cy.addEmitActionSpy();
            cy.get("input").focus();
            cy.getEmittedActionName().should("equal", "onEnter");
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
            cy.addEmitActionSpy();
            cy.get("body").click("topRight");
            cy.getEmittedActionName().should("equal", "onLeave");
        });
    });

    describe("controls", () => {
        it("should add an hour", () => {
            cy.get("button").click();
            cy.get(".rdtCounter:nth-of-type(1) .rdtBtn:first-child").click();
            cy.get("input").should("have.value", "02:00");
        });

        it("should emit an onChange event", () => {
            cy.get("button").click();
            cy.addEmitActionSpy();
            cy.get(".rdtCounter:nth-of-type(1) .rdtBtn:first-child").click();
            cy.getEmittedActionName().should("equal", "onChange");
        });
    });

    describe("manual text input", () => {
        it("invalid format shows an error after blur", () => {
            cy.get("input").type("asd");
            cy.get(".alert-danger").should("not.exist");
            cy.get("body").click("topRight");
            cy.get(".alert-danger")
                .should("be.visible")
                .should("contain", "HH:mm");
        });

        it("empty input should not show an error", () => {
            cy.get("input").clear();
            cy.get("body").click("topRight");
            cy.get(".alert-danger").should("not.exist");
        });

        it("valid format sets the date", () => {
            cy.get("input")
                .clear()
                .type("02:05");
            cy.get("body").click("topRight");
            cy.get(".alert-danger").should("not.exist");
            cy.get("input").should("have.value", "02:05");
        });
    });
});
