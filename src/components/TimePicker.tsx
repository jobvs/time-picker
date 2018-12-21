import moment from "moment";
import React from "react";
import Datetime from "react-datetime";
import { hot } from "react-hot-loader";

import "react-datetime/css/react-datetime.css";

import "./TimePicker.css";

interface ActionProps {
    onChange?: PluginWidget.ActionValue;
    onEnter?: PluginWidget.ActionValue;
    onLeave?: PluginWidget.ActionValue;
}

export interface Props extends ActionProps {
    id: string;
    tabIndex?: number;
    timeFormat: "minutes" | "seconds";
    inputValue?: PluginWidget.EditableValue<Date | undefined>;
    editable: "default" | "never";
    placeholder: PluginWidget.DynamicValue<string>;
    validationMessage: PluginWidget.DynamicValue<string>;
}

interface State {
    readonly invalidInput: boolean;
    readonly open: boolean;
}

export class TimePicker extends React.Component<Props, State> {
    readonly state: State = {
        invalidInput: false,
        open: false
    };

    private readonly use12HourNotation = use12HourNotation();
    private readonly useNativeInput = useNativeInput(this.props);

    private blurTimeoutRef: number | undefined;

    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.queueBlur = this.queueBlur.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    get value() {
        return this.props.inputValue && this.props.inputValue.value;
    }

    get validation() {
        return (this.props.inputValue && this.props.inputValue.validation) || [];
    }

    get disabled() {
        return this.props.editable === "never" || !this.props.inputValue || this.props.inputValue.readOnly;
    }

    get placeholder() {
        return !this.props.inputValue
            ? "No attribute selected"
            : this.props.placeholder.value || humanReadableFormat(this.format);
    }

    get format() {
        return timeFormat(this.props.timeFormat, this.use12HourNotation);
    }

    handleFocus() {
        const alreadyFocused = this.blurTimeoutRef !== undefined;

        if (alreadyFocused) {
            clearTimeout(this.blurTimeoutRef);
            this.blurTimeoutRef = undefined;
        } else {
            this.dispatchAction("onEnter");
        }
    }

    queueBlur() {
        if (this.blurTimeoutRef === undefined) {
            this.blurTimeoutRef = setTimeout(() => {
                this.blurTimeoutRef = undefined;
                this.handleBlur();
            }, 0);
        }
    }

    handleBlur() {
        if (this.state.invalidInput && this.props.inputValue) {
            const format = humanReadableFormat(this.format);
            this.props.inputValue.setValidation(
                `${this.props.validationMessage.value || "Expected format:"} ${format}`
            );
            this.setState({ invalidInput: true });
        }

        if (this.state.open) {
            this.setState({ open: false });
        }

        this.dispatchAction("onLeave");
    }

    handleChange(input: string | moment.Moment) {
        if (typeof input === "string") {
            this.handleStringInput(input);
        } else {
            this.setValue(input.toDate());
        }
    }

    handleStringInput(value: string) {
        const invalidInput = value.length > 0;

        if (invalidInput) {
            this.setState({ invalidInput: true });
        } else {
            this.setValue(undefined);
        }
    }

    private setValue(value: Date | undefined) {
        if (!this.props.inputValue) {
            return;
        }

        this.props.inputValue.setValue(value);
        this.props.inputValue.setValidation();
        this.setState({ invalidInput: false });
        this.dispatchAction("onChange");
    }

    handleButtonClick() {
        this.setState({ open: !this.state.open });
    }

    handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Escape") {
            this.setState({ open: false });
        }
    }

    render() {
        return (
            <>
                <div
                    className="widget-timepicker"
                    tabIndex={-1}
                    onFocusCapture={this.handleFocus}
                    onBlurCapture={this.queueBlur}
                    onKeyDownCapture={this.handleKeyDown}
                >
                    <Datetime
                        className="widget-timepicker-input"
                        value={this.value}
                        onChange={this.handleChange}
                        dateFormat={false}
                        timeFormat={this.useNativeInput ? "HH:mm" : this.format}
                        open={this.useNativeInput ? false : this.state.open}
                        inputProps={{
                            id: this.props.id,
                            className: "form-control",
                            tabIndex: this.props.tabIndex,
                            placeholder: this.placeholder,
                            disabled: this.disabled,
                            type: this.useNativeInput ? "time" : "text"
                        }}
                    />
                    {this.renderButton()}
                </div>
                {this.renderValidationMessages()}
            </>
        );
    }

    renderButton() {
        return (
            !this.useNativeInput && (
                <button
                    type="button"
                    className="btn mx-button widget-timepicker-button"
                    aria-label="Show time picker"
                    tabIndex={-1}
                    disabled={this.disabled}
                    onClick={this.handleButtonClick}
                >
                    <span className="glyphicon glyphicon-time" />
                </button>
            )
        );
    }

    renderValidationMessages() {
        return this.validation.map(message => (
            <div key={message} className="alert alert-danger mx-validation-message">
                {message}
            </div>
        ));
    }

    private dispatchAction(property: keyof ActionProps): void {
        const prop = this.props[property];
        if (prop && this.props.inputValue && this.props.inputValue.status === PluginWidget.ValueStatus.Available) {
            prop.execute();
        }
    }
}

function useNativeInput(props: Props) {
    return props.timeFormat === "minutes" && isMobileDevice() && supportsNativeInputType("time");
}

function isMobileDevice() {
    return /(iPhone|iPod|iPad|Android|Windows Phone)/.test(navigator.userAgent);
}

function supportsNativeInputType(type: string) {
    const input = document.createElement("input");
    input.type = type;
    input.value = ":)";
    return input.type === type && input.value !== ":)";
}

function timeFormat(detail: "minutes" | "seconds", use12HourNotation: boolean) {
    const hourFormat = use12HourNotation ? "hh" : "HH";
    const seconds = detail === "seconds" ? ":ss" : "";
    const suffix = use12HourNotation ? " A" : "";

    return `${hourFormat}:mm${seconds}${suffix}`;
}

function humanReadableFormat(format: string) {
    return format.replace(" A", " AM/PM");
}

function use12HourNotation() {
    const dojo = (window as any).dojo as { locale: string } | undefined;

    const localesWith12HourNotation = [
        "en-au",
        "en-ca",
        "en-in",
        "en-mt",
        "en-nz",
        "en-ph",
        "en-sg",
        "en-za",
        "en-us",
        "el-cy",
        "el-gr",
        "hi-in",
        "ko-kr",
        "es-do",
        "es-us"
    ];

    return dojo ? localesWith12HourNotation.indexOf(dojo.locale) !== -1 : false;
}

// tslint:disable-next-line:no-default-export
export default hot(module)(TimePicker);
