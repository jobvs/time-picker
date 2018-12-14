import React from "react";
import renderer from "react-test-renderer";

import TimePickerContainer, { TimePickerContainerProps } from "../TimePickerContainer";
import { createActionValue, createDynamicValue, createEditableValue } from "../../__mocks__/PluginWidget";

const setup = (propOverrides: Partial<TimePickerContainerProps>) => {
  const props: TimePickerContainerProps = {
    inputValue: createEditableValue(new Date(1544793796784), false, []),
    editable: "default",
    timeFormat: "milliseconds",
    timeNotation: "h12",
    placeholder: createDynamicValue("Placeholder"),
    showLabel: false,
    labelCaption: "Default caption",
    labelOrientation: "vertical",
    labelWidth: 3,
    name: "custom-name",
    class: "custom-class",
    style: { backgroundColor: "transparent" },
    tabIndex: 0,
    hoursStep: 0,
    minutesStep: 0,
    secondsStep: 0,
    onChange: createActionValue(jest.fn),
    onEnter: createActionValue(jest.fn),
    onLeave: createActionValue(jest.fn),
    ...propOverrides
  };

  return renderer.create(<TimePickerContainer {...props} />);
};

describe("TimePicker", () => {
  it("should render the structure", () => {
    const tree = setup({}).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should render without a data attribute", () => {
    const tree = setup({
      inputValue: undefined
    }).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it("should render 24-hour notation", () => {
    const tree = setup({
      timeNotation: "h24"
    }).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe("label", () => {
    it("should render a vertical label", () => {
      const tree = setup({
        showLabel: true
      }).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it("should render a horizontal label", () => {
      const tree = setup({
        showLabel: true,
        labelOrientation: "horizontal"
      }).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it("should render a horizontal label with a specified width", () => {
      const tree = setup({
        showLabel: true,
        labelOrientation: "horizontal",
        labelWidth: 6
      }).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it("should render with a different caption", () => {
      const tree = setup({
        showLabel: true,
        labelCaption: "Different"
      }).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });
});
