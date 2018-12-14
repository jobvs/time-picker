import * as React from "react";
import { hot } from "react-hot-loader";

import Label from "./Label";
import TimePicker from "./TimePicker";

export interface TimePickerContainerProps {
  name: string;
  class?: string;
  style?: React.CSSProperties;
  tabIndex?: number;

  showLabel: boolean;
  labelCaption: string;
  labelOrientation: "horizontal" | "vertical";
  labelWidth: number;

  timeFormat: "minutes" | "seconds" | "milliseconds";
  timeNotation: "h12" | "h24";
  inputValue?: PluginWidget.EditableValue<Date>;
  editable: "default" | "never";
  placeholder: PluginWidget.DynamicValue<string>;

  hoursStep?: number;
  minutesStep?: number;
  secondsStep?: number;

  onChange?: PluginWidget.ActionValue;
  onEnter?: PluginWidget.ActionValue;
  onLeave?: PluginWidget.ActionValue;
}

export class TimePickerContainer extends React.Component<
  TimePickerContainerProps
> {
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
    const hasError =
      this.props.inputValue && this.props.inputValue.validation
        ? this.props.inputValue.validation.length > 0
        : false;

    return (
      <Label
        label={this.props.labelCaption}
        orientation={this.props.labelOrientation}
        width={this.props.labelWidth}
        hasError={hasError}
      >
        {this.renderTimePicker()}
      </Label>
    );
  }

  renderTimePicker() {
    const timeConstraints = {
      hours: {
        step: this.props.hoursStep || 1,
        min: 0,
        max: 23
      },
      minutes: {
        step: this.props.minutesStep || 1,
        min: 0,
        max: 59
      },
      seconds: {
        step: this.props.secondsStep || 1,
        min: 0,
        max: 59
      }
    };

    return (
      <>
        <TimePicker
          tabIndex={this.props.tabIndex}
          name={this.props.name}
          timeFormat={this.props.timeFormat}
          timeNotation={this.props.timeNotation}
          timeConstraints={timeConstraints}
          inputValue={this.props.inputValue}
          editable={this.props.editable}
          placeholder={this.props.placeholder}
          onChange={this.props.onChange}
          onEnter={this.props.onEnter}
          onLeave={this.props.onLeave}
        />
        {this.props.inputValue && this.props.inputValue.validation &&
          this.props.inputValue.validation.map(message => (
            <div
              key={message}
              className="alert alert-danger mx-validation-message"
            >
              {message}
            </div>
          ))}
      </>
    );
  }
}

export default hot(module)(TimePickerContainer);
