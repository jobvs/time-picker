import React from "react";
import Datetime from "react-datetime";
import moment from "moment";

import "../ui/TimePicker.css";
import "react-datetime/css/react-datetime.css";

export interface TimePickerProps {
  tabIndex?: number;
  name: string;
  format: string;
  inputValue: PluginWidget.EditableValue<Date>;
  placeholder: PluginWidget.DynamicValue<string>;
  onChange?: PluginWidget.ActionValue;
}

interface State {
  value?: Date;
  open: boolean;
}

class TimePicker extends React.Component<TimePickerProps, State> {
  readonly state: State = {
    value: this.props.inputValue.value,
    open: false
  };

  handleChange(value: string | moment.Moment) {
    if (typeof value === "string") {
      // Invalid input, user might still be typing
      return;
    }

    this.setState(
      {
        value: value.toDate()
      },
      () => {
        if (this.props.onChange && this.props.onChange.canExecute) {
          this.props.onChange.execute();
        }
      }
    );
  }

  // handleFocus() {
  //   this.setState({ open: true });
  // }

  // handleBlur() {
  //   // This is not working in the current version of react-datetime
  //   // https://github.com/YouCanBookMe/react-datetime/issues/509
  //   this.setState({ open: false });
  // }

  handleButtonClick() {
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <div className="widget-timepicker">
        <Datetime
          className="widget-timepicker-input"
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
          // onFocus={this.handleFocus.bind(this)}
          // onBlur={this.handleBlur.bind(this)}
          dateFormat={false}
          timeFormat={this.props.format}
          viewDate={this.state.value || new Date()}
          open={this.state.open}
          inputProps={{
            className: "form-control",
            name: this.props.name,
            placeholder: this.props.placeholder.value || "hh:mm AM/PM",
            tabIndex: this.props.tabIndex,
            disabled: this.props.inputValue.readOnly
          }}
        />
        <button
          type="button"
          className="btn mx-button widget-timepicker-button"
          aria-label="Show time picker"
          tabIndex={-1}
          disabled={this.props.inputValue.readOnly}
          onClick={this.handleButtonClick.bind(this)}
        >
          <span className="glyphicon glyphicon-time" />
        </button>
      </div>
    );
  }
}

export default TimePicker;
