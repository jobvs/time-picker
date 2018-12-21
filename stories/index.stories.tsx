import { action } from "@storybook/addon-actions";
import { date, number, select, text } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";
import React from "react";

import TimePicker from "../src/components/TimePicker";
import { createActionValue, createDynamicValue, createEditableValue } from "../tests/mocks/PluginWidget";

const stories = storiesOf("TimePicker", module);

stories.add("Interactive", () => (
    <TimePicker
        inputValue={createEditableValue(date("Input value", new Date(2018, 0, 1, 1, 0, 0, 0), "General"), false, [])}
        editable={select("Editable", { Default: "default", Never: "never" }, "default", "General")}
        timeFormat={select("Time format", { Minutes: "minutes", Seconds: "seconds" }, "minutes", "General")}
        placeholder={createDynamicValue(text("Custom placeholder", "Placeholder", "General"))}
        validationMessage={createDynamicValue(text("Validation message", "Expected value:", "General"))}
        id={text("Input ID", "unique-id", "Common")}
        tabIndex={number("Tab index", 0, {}, "Common")}
        onChange={createActionValue(action("onChange"))}
        onEnter={createActionValue(action("onEnter"))}
        onLeave={createActionValue(action("onLeave"))}
    />
));

stories.add("Undefined input", () => (
    <TimePicker
        id="unique-id"
        inputValue={createEditableValue(undefined, false, [])}
        validationMessage={createDynamicValue("Expected format:")}
        editable="default"
        timeFormat="minutes"
        placeholder={createDynamicValue("Placeholder")}
    />
));

stories.add("Validation feedback", () => (
    <TimePicker
        id="unique-id"
        inputValue={createEditableValue(new Date(2018, 0, 1, 1, 0, 0, 0), false, ["Feedback message"])}
        validationMessage={createDynamicValue("Expected format:")}
        editable="default"
        timeFormat="seconds"
        placeholder={createDynamicValue("Placeholder")}
    />
));

stories.add("No attribute selected", () => (
    <TimePicker
        id="unique-id"
        inputValue={undefined}
        validationMessage={createDynamicValue("Expected format:")}
        editable="default"
        timeFormat="minutes"
        placeholder={createDynamicValue("Placeholder")}
    />
));

stories.add("12 hour notation", () => {
    (window as any).dojo = {
        locale: "en-us"
    };

    return (
        <TimePicker
            id="unique-id"
            inputValue={createEditableValue(new Date(2018, 0, 1, 1, 0, 0, 0), false, [])}
            validationMessage={createDynamicValue("Expected format:")}
            editable="default"
            timeFormat="minutes"
            placeholder={createDynamicValue("Placeholder")}
        />
    );
});
