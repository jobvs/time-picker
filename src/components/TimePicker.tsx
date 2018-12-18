import moment from "moment";
import * as React from "react";
import Datetime from "react-datetime";
import { hot } from "react-hot-loader";

import "react-datetime/css/react-datetime.css";

import "../ui/TimePicker.css";
import { Label } from "./Label";

export interface Props {
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
    inputValue?: PluginWidget.EditableValue<Date | undefined>;
    editable: "default" | "never";
    placeholder: PluginWidget.DynamicValue<string>;

    hoursStep?: number;
    minutesStep?: number;
    secondsStep?: number;

    onChange?: PluginWidget.ActionValue;
    onEnter?: PluginWidget.ActionValue;
    onLeave?: PluginWidget.ActionValue;
}

interface State {
    invalidInput: boolean;
}

export class TimePicker extends React.Component<Props, State> {
    state: State = {
        invalidInput: false
    };

    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleFocus() {
        if (this.props.onEnter && this.props.onEnter.canExecute) {
            this.props.onEnter.execute();
        }
    }

    handleBlur() {
        if (this.state.invalidInput && this.props.inputValue) {
            this.props.inputValue.setValidation("Invalid time");
            this.setState({ invalidInput: true });
        }

        if (this.props.onLeave && this.props.onLeave.canExecute) {
            this.props.onLeave.execute();
        }
    }

    handleChange(input: string | moment.Moment) {
        if (this.props.inputValue === undefined) {
            return;
        }

        if (typeof input === "string" && input.length > 0) {
            this.setState({ invalidInput: true });
            return;
        }

        const value = typeof input === "string" ? undefined : input.toDate();
        this.props.inputValue.setValidation();
        this.props.inputValue.setValue(value);
        this.setState({ invalidInput: false });

        if (this.props.onChange && this.props.onChange.canExecute) {
            this.props.onChange.execute();
        }
    }

    render() {
        return (
            <div className={this.props.class} style={this.props.style}>
                {this.props.showLabel ? this.renderInputWithLabel() : this.renderInput()}
            </div>
        );
    }

    renderInputWithLabel() {
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
                {this.renderInput()}
            </Label>
        );
    }

    renderInput() {
        const placeholder = !this.props.inputValue ? "No attribute selected" : this.props.placeholder.value;
        const disabled = this.props.editable === "never" || !this.props.inputValue || this.props.inputValue.readOnly;
        const validation = (this.props.inputValue && this.props.inputValue.validation) || [];
        const value = this.props.inputValue && this.props.inputValue.value;

        return (
            <>
                <div className="widget-timepicker">
                    <Datetime
                        value={value}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        dateFormat={false}
                        timeFormat={timeFormat(this.props.timeNotation, this.props.timeFormat)}
                        timeConstraints={timeConstraints(
                            this.props.hoursStep,
                            this.props.minutesStep,
                            this.props.secondsStep
                        )}
                        inputProps={{
                            className: "form-control",
                            name: this.props.name,
                            tabIndex: this.props.tabIndex,
                            placeholder,
                            disabled
                        }}
                    />
                    <span className="glyphicon glyphicon-time form-control-feedback" aria-hidden="true" />
                </div>
                {validation.map(message => (
                    <div key={message} className="alert alert-danger mx-validation-message">
                        {message}
                    </div>
                ))}
            </>
        );
    }
}

function timeConstraints(hoursStep?: number, minutesStep?: number, secondsStep?: number) {
    return {
        hours: { step: hoursStep || 1, min: 0, max: 23 },
        minutes: { step: minutesStep || 1, min: 0, max: 59 },
        seconds: { step: secondsStep || 1, min: 0, max: 59 }
    };
}

function timeFormat(notation: "h12" | "h24", detail: "minutes" | "seconds" | "milliseconds") {
    const hourFormat = notation === "h12" ? "hh" : "HH";
    const seconds = detail === "seconds" ? ":ss" : "";
    const milliseconds = detail === "milliseconds" ? ":ss.SSS" : "";
    const suffix = notation === "h12" ? " A" : "";

    return `${hourFormat}:mm${seconds}${milliseconds}${suffix}`;
}

// tslint:disable-next-line:no-default-export
export default hot(module)(TimePicker);
