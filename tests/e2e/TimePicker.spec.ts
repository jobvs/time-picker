import homepage from "./pages/home.page";

const badgeValue = "Badge";

describe("TimePicker", () => {
    it("should render a badge with a caption", () => {
        homepage.open();
        homepage.badge.waitForVisible();

        const widgetValue = homepage.badge.getText();
        expect(widgetValue).toContain(badgeValue);
    });
});

describe("label", () => {
    it("should render a label with a caption", () => {
        homepage.open();
        homepage.label.waitForVisible();

        const labelValue = homepage.badge.getText();
        expect(labelValue).toContain(badgeValue);
    });
});
