class HomePage {

    public get badge() { return browser.element(".widget-badge.badge.mx-name-badge1"); }

    public get label() { return browser.element(".widget-timepicker.label.mx-name-timepicker2"); }

    public open(): void {
        browser.url("/");
    }
}
const homepage = new HomePage();
export default homepage;
