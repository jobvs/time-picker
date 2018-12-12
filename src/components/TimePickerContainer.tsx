import * as React from "react";
import { hot } from "react-hot-loader";

import Label from "./Label";
import TimePicker from "./TimePicker";

export interface TimePickerContainerProps {
  class: string;
  style: React.CSSProperties;

  showLabel: boolean;
  labelCaption: string;
  labelOrientation: "horizontal" | "vertical";
  labelWidth: number;

  tabIndex: number;
  name: string;
  format: string;
  inputValue: PluginWidget.EditableValue<Date>;
  placeholder: PluginWidget.DynamicValue<string>;
  onChange?: PluginWidget.ActionValue;
}

export class TimePickerContainer extends React.Component<TimePickerContainerProps> {
  render() {
    return (
      <div className={this.props.class} style={this.props.style}>
        {this.props.showLabel
          ? this.renderTimePickerWithLabel()
          : this.renderTimePicker()}
      </div>
    );
  }

  renderTimePickerWithLabel() {
    return (
      <Label
        label={this.props.labelCaption}
        orientation={this.props.labelOrientation}
        width={this.props.labelWidth}
      >
        {this.renderTimePicker()}
      </Label>
    );
  }

  renderTimePicker() {
    return (
      <TimePicker
        tabIndex={this.props.tabIndex}
        name={this.props.name}
        format={this.props.format}
        inputValue={this.props.inputValue}
        placeholder={this.props.placeholder}
        onChange={this.props.onChange}
      />
    );
  }
}

export default hot(module)(TimePickerContainer);
