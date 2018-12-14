import React from "react";
import Datetime from "react-datetime";
import moment from "moment";

import "../ui/TimePicker.css";
import "react-datetime/css/react-datetime.css";

export interface TimePickerProps {
  name: string;
  tabIndex?: number;

  timeFormat: "minutes" | "seconds" | "milliseconds";
  timeNotation: "h12" | "h24";
  timeConstraints: Datetime.TimeConstraints;
  inputValue: PluginWidget.EditableValue<Date>;
  editable: "default" | "never";
  placeholder: PluginWidget.DynamicValue<string>;

  onChange?: PluginWidget.ActionValue;
  onEnter?: PluginWidget.ActionValue;
  onLeave?: PluginWidget.ActionValue;
}

interface State {
  value?: Date;
}

class TimePicker extends React.Component<TimePickerProps, State> {
  readonly state: State = {
    value: this.props.inputValue.value
  };

  handleChange(input: string | moment.Moment) {
    if (typeof input === "string") {
      // Invalid input, user might still be typing
      return;
    }

    const value = input.toDate();
    this.setState({ value }, () => {
      if (this.props.onChange && this.props.onChange.canExecute) {
        this.props.onChange.execute();
      }
    });
  }

  handleFocus() {
    if (this.props.onEnter && this.props.onEnter.canExecute) {
      this.props.onEnter.execute();
    }
  }

  handleBlur() {
    if (this.props.onLeave && this.props.onLeave.canExecute) {
      this.props.onLeave.execute();
    }
  }

  render() {
    const disabled =
      this.props.editable === "never" || this.props.inputValue.readOnly;

    return (
      <div className="widget-timepicker">
        <Datetime
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
          onFocus={this.handleFocus.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          dateFormat={false}
          timeFormat={timeFormat(
            this.props.timeNotation,
            this.props.timeFormat
          )}
          timeConstraints={this.props.timeConstraints}
          viewDate={this.state.value || new Date()}
          inputProps={{
            className: "form-control",
            name: this.props.name,
            placeholder: this.props.placeholder.value,
            tabIndex: this.props.tabIndex,
            disabled
          }}
        />
        <span className="glyphicon glyphicon-time form-control-feedback" aria-hidden="true"></span>
      </div>
    );
  }
}

export function timeFormat(
  notation: "h12" | "h24",
  detail: "minutes" | "seconds" | "milliseconds"
) {
  const hourFormat = notation === "h12" ? "hh" : "HH";
  const seconds = detail === "seconds" ? ":ss" : "";
  const milliseconds = detail === "milliseconds" ? ":ss.SSS" : "";
  const suffix = notation === "h12" ? " A" : "";

  return `${hourFormat}:mm${seconds}${milliseconds}${suffix}`;
}

export default TimePicker;
