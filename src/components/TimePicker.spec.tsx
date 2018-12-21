import { mount } from "enzyme";
import React from "react";
import renderer from "react-test-renderer";

import { createActionValue, createDynamicValue, createEditableValue } from "../../tests/mocks/PluginWidget";
import { Props as TimePickerProps, TimePicker } from "./TimePicker";

const setup = (propOverrides: Partial<TimePickerProps> = {}) => {
    const props: TimePickerProps = {
        id: "unique-id",
        inputValue: createEditableValue(new Date(2018, 0, 1, 1, 2, 3, 456), false, []),
        editable: "default",
        timeFormat: "seconds",
        placeholder: createDynamicValue("Placeholder"),
        validationMessage: createDynamicValue("Expected format:"),
        tabIndex: 0,
        onChange: createActionValue(jest.fn),
        onEnter: createActionValue(jest.fn),
        onLeave: createActionValue(jest.fn),
        ...propOverrides
    };

    return <TimePicker {...props} />;
};

describe("TimePicker", () => {
    describe("snapshots", () => {
        it("should render the structure", () => {
            const el = setup();
            const tree = renderer.create(el).toJSON();
            expect(tree).toMatchSnapshot();
        });

        it("should render without a data attribute", () => {
            const el = setup({
                inputValue: undefined
            });
            const tree = renderer.create(el).toJSON();
            expect(tree).toMatchSnapshot();
        });

        it("should render 12-hour notation", () => {
            (window as any).dojo = {
                locale: "en-us"
            };
            const el = setup();
            const tree = renderer.create(el).toJSON();
            expect(tree).toMatchSnapshot();
            (window as any).dojo = undefined;
        });

        it("should render a default human readable placeholder", () => {
            const el = setup({
                placeholder: createDynamicValue("")
            });
            const tree = renderer.create(el).toJSON();
            expect(tree).toMatchSnapshot();
        });

        it("should render validation messages", () => {
            const el = setup({
                inputValue: createEditableValue(new Date(2018, 0, 1, 1, 2, 3, 456), false, ["Error1", "Error2"])
            });
            const tree = renderer.create(el).toJSON();
            expect(tree).toMatchSnapshot();
        });
    });

    describe("onEnter", () => {
        it("is called", () => {
            const mock = jest.fn();
            const el = setup({
                onEnter: createActionValue(mock)
            });
            const wrapper = mount(el);
            wrapper.find("input").simulate("focus");
            expect(mock).toHaveBeenCalledTimes(1);
        });
    });

    describe("onChange", () => {
        it("is called", () => {
            const mock = jest.fn();
            const el = setup({
                onChange: createActionValue(mock)
            });
            const wrapper = mount(el);
            wrapper.find("input").simulate("change");
            expect(mock).toHaveBeenCalledTimes(1);
        });

        it("is not called without inputValue", () => {
            const mock = jest.fn();
            const el = setup({
                onChange: createActionValue(mock),
                inputValue: undefined
            });
            const wrapper = mount(el);
            wrapper.find("input").simulate("change");
            expect(mock).toHaveBeenCalledTimes(0);
        });

        it("is not called with invalid input", () => {
            const mock = jest.fn();
            const el = setup({
                onChange: createActionValue(mock)
            });
            const wrapper = mount(el);
            wrapper.find("input").simulate("change", { target: { value: "asd" } });
            expect(mock).not.toHaveBeenCalled();
        });

        it("is called with empty input", () => {
            const mock = jest.fn();
            const el = setup({
                onChange: createActionValue(mock)
            });
            const wrapper = mount(el);
            wrapper.find("input").simulate("change", { target: { value: "" } });
            expect(mock).toHaveBeenCalledTimes(1);
        });
    });

    // describe("onLeave", () => {
    //     it("is called", () => {
    //         const mock = jest.fn();
    //         const el = setup({ onLeave: createActionValue(mock) });
    //         const wrapper = mount(el);
    //         wrapper.find("input").simulate("focus");
    //         expect(wrapper.find(".rdtPicker").length).toBe(1);
    //         wrapper.simulate("click");
    //         expect(wrapper.find(".rdtPicker").length).toBe(0);
    //         expect(mock).toHaveBeenCalledTimes(1);
    //     });
    // });
});
