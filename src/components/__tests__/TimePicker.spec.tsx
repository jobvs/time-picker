import { shallow } from "enzyme";
import * as React from "react";

import TimePicker, { TimePickerProps } from "../TimePicker";

describe("TimePicker", () => {
    const createTimePicker = (props: TimePickerProps) => shallow(<TimePicker {...props} />);

    it("should render the structure", () => {
        const timepickerProps: TimePickerProps = {
            timepickerType: "badge",
            bootstrapStyle: "default",
            onClickAction: jasmine.createSpy("onClick"),
            value: "0"
        };
        const timepicker = createTimePicker(timepickerProps);

        expect(timepicker).toBeElement(
            <span className={("widget-timepicker badge label-default")}
                onClick={jasmine.any(Function) as any}
                style={timepickerProps.style}>0</span>
        );
    });

    it("should show no value when no value or default value provided", () => {
        const value = "value";
        const timepicker = createTimePicker({ timepickerType: "label", value, defaultValue: "default value" });

        expect(timepicker.text()).toBe(value);
    });

    it("should show default value when no value is provided", () => {
        const defaultValue = "default";
        const timepicker = createTimePicker({ timepickerType: "label", value: undefined, defaultValue });

        expect(timepicker.text()).toBe(defaultValue);
    });

    it("should show no value when no value or default value provided", () => {
        const timepicker = createTimePicker({ timepickerType: "label", value: undefined });

        expect(timepicker.text()).toBe("");
    });

    it("configured as a label should have the class label", () => {
        const timepicker = createTimePicker({ timepickerType: "label" });

        expect(timepicker.hasClass("label")).toBe(true);
    });

    it("configured as a badge should have the class badge", () => {
        const timepicker = createTimePicker({ timepickerType: "badge" });

        expect(timepicker.hasClass("badge")).toBe(true);
    });

    it("with a click action should respond to click events", () => {
        const timepickerProps: TimePickerProps = { onClickAction: jasmine.createSpy("onClick"), timepickerType: "badge" };
        const onClick = timepickerProps.onClickAction = jasmine.createSpy("onClick");
        const timepicker = createTimePicker(timepickerProps);

        timepicker.simulate("click");

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("with the Bootstrap style default should have the class label-default", () => {
        const timepicker = createTimePicker({ bootstrapStyle: "default", timepickerType: "badge" });

        expect(timepicker.hasClass("label-default")).toBe(true);
    });

    it("with the Bootstrap style primary should have the class label-primary", () => {
        const timepicker = createTimePicker({ bootstrapStyle: "primary", timepickerType: "badge" });

        expect(timepicker.hasClass("label-primary")).toBe(true);
    });

    it("with the Bootstrap style success should have the class label-success", () => {
        const timepicker = createTimePicker({ bootstrapStyle: "success", timepickerType: "badge" });

        expect(timepicker.hasClass("label-success")).toBe(true);
    });

    it("with the Bootstrap style info should have the class label-info", () => {
        const timepicker = createTimePicker({ bootstrapStyle: "info", timepickerType: "badge" });

        expect(timepicker.hasClass("label-info")).toBe(true);
    });

    it("with the Bootstrap style warning should have the class label-warning", () => {
        const timepicker = createTimePicker({ bootstrapStyle: "warning", timepickerType: "badge" });

        expect(timepicker.hasClass("label-warning")).toBe(true);
    });

    it("with the Bootstrap style danger should have the class label-danger", () => {
        const timepicker = createTimePicker({ bootstrapStyle: "danger", timepickerType: "badge" });

        expect(timepicker.hasClass("label-danger")).toBe(true);
    });
});
