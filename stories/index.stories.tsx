import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { boolean, date, number, object, select, text } from "@storybook/addon-knobs";

import { TimePickerContainer } from "../src/components/TimePickerContainer";
import { createActionValue, createDynamicValue, createEditableValue } from "../src/__mocks__/PluginWidget";

const stories = storiesOf("TimePicker", module);

stories.add(
  "Default",
  () => (
    <TimePickerContainer
      inputValue={createEditableValue(
        date("Input value", undefined, "General"),
        boolean("Input readonly", false, "General"),
        [ text("Input validation", "Feedback", "General") ]
      )}
      editable={select("Editable", { Default: "default", Never: "never" }, "default", "General")}
      timeFormat={select("Time format", { Minutes: "minutes", Seconds: "seconds", Milliseconds: "milliseconds" }, "minutes", "General")}
      timeNotation={select("Time notation", { "12-hour": "h12", "24-hour": "h24" }, "h12", "General")}
      placeholder={createDynamicValue(text("Custom placeholder", "Placeholder", "General"))}
      showLabel={boolean("Show label", true, "Label")}
      labelCaption={text("Label caption", "Default caption", "Label")}
      labelOrientation={select("Label orientation", { Horizontal: "horizontal", Vertical: "vertical" }, "vertical", "Label")}
      labelWidth={number("Horizontal label width", 3, { range: true, min: 1, max: 10, step: 1 }, "Label")}
      name={text("Name", "custom-name", "Common")}
      class={text("Class", "custom-class", "Common")}
      style={object("Custom CSS", { backgroundColor: "transparent" }, "Common")}
      tabIndex={number("Tab index", 0, {}, "Common")}
      hoursStep={number("Hours step", 0, { range: true, min: 0, max: 23, step: 1 }, "Constraints")}
      minutesStep={number("Minutes step", 0, { range: true, min: 0, max: 59, step: 1 }, "Constraints")}
      secondsStep={number("Seconds step", 0, { range: true, min: 0, max: 59, step: 1 }, "Constraints")}
      onChange={createActionValue(action("onChange"))}
      onEnter={createActionValue(action("onEnter"))}
      onLeave={createActionValue(action("onLeave"))}
    />
  ),
  { info: { inline: true } }
);

stories.add("No input value", () => (
  <TimePickerContainer
    inputValue={undefined}
    editable="default"
    timeFormat="minutes"
    timeNotation="h24"
    placeholder={createDynamicValue("Placeholder")}
    showLabel
    labelCaption="Default caption"
    labelOrientation="vertical"
    labelWidth={3}
    name="custom-name"
  />
));
