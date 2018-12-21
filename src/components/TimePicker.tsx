import moment from "moment";
import React from "react";
import Datetime from "react-datetime";
import { hot } from "react-hot-loader/root";

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

    private readonly onChangeHandler = this.onChange.bind(this);
    private readonly onFocusHandler = this.onFocus.bind(this);
    private readonly queueBlurHandler = this.queueBlur.bind(this);
    private readonly onButtonClickHandler = this.onButtonClick.bind(this);
    private readonly onKeyUpHandler = this.onKeyUp.bind(this);

    private blurTimeoutRef: number | undefined;

    get value(): Date | undefined {
        return this.props.inputValue && this.props.inputValue.value;
    }

    get validation(): string[] {
        return (this.props.inputValue && this.props.inputValue.validation) || [];
    }

    get disabled(): boolean {
        return this.props.editable === "never" || !this.props.inputValue || this.props.inputValue.readOnly;
    }

    get placeholder(): string {
        return !this.props.inputValue
            ? "No attribute selected"
            : this.props.placeholder.value || humanReadableFormat(this.format);
    }

    get format(): string {
        return timeFormat(this.props.timeFormat, this.use12HourNotation);
    }

    onFocus(): void {
        const alreadyFocused = this.blurTimeoutRef !== undefined;

        if (alreadyFocused) {
            clearTimeout(this.blurTimeoutRef);
            this.blurTimeoutRef = undefined;
        } else {
            this.dispatchAction("onEnter");
        }
    }

    queueBlur(): void {
        if (this.blurTimeoutRef === undefined) {
            this.blurTimeoutRef = setTimeout(() => {
                this.blurTimeoutRef = undefined;
                this.onBlur();
            }, 0);
        }
    }

    onBlur(): void {
        if (this.state.invalidInput && this.props.inputValue) {
            const format = humanReadableFormat(this.format);
            const message = `${this.props.validationMessage.value || "Expected format:"} ${format}`;
            this.props.inputValue.setValidation(message);
            this.setState({ invalidInput: true });
        }

        if (this.state.open) {
            this.setState({ open: false });
        }

        this.dispatchAction("onLeave");
    }

    onChange(input: string | moment.Moment): void {
        if (typeof input === "string") {
            this.processStringInput(input);
        } else {
            this.setValue(input.toDate());
        }
    }

    private processStringInput(value: string): void {
        const invalidInput = value.length > 0;

        if (invalidInput) {
            this.setState({ invalidInput: true });
        } else {
            this.setValue(undefined);
        }
    }

    private setValue(value: Date | undefined): void {
        if (!this.props.inputValue) {
            return;
        }

        this.props.inputValue.setValue(value);
        this.props.inputValue.setValidation();
        this.setState({ invalidInput: false });
        this.dispatchAction("onChange");
    }

    onButtonClick(): void {
        this.setState({ open: !this.state.open });
    }

    onKeyUp(event: React.KeyboardEvent): void {
        if (event.key === "Escape") {
            this.setState({ open: false });
        }
    }

    render(): JSX.Element {
        return (
            <>
                <div
                    className="widget-time-picker"
                    tabIndex={-1}
                    onFocusCapture={this.onFocusHandler}
                    onBlurCapture={this.queueBlurHandler}
                    onKeyUpCapture={this.onKeyUpHandler}
                >
                    <Datetime
                        className="widget-time-picker-input"
                        value={this.value}
                        onChange={this.onChangeHandler}
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

    renderButton(): false | JSX.Element {
        return (
            !this.useNativeInput && (
                <button
                    type="button"
                    className="btn mx-button widget-time-picker-button"
                    aria-label="Show time picker"
                    tabIndex={-1}
                    disabled={this.disabled}
                    onClick={this.onButtonClickHandler}
                >
                    <span className="glyphicon glyphicon-time" />
                </button>
            )
        );
    }

    renderValidationMessages(): JSX.Element[] {
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

function useNativeInput(props: Props): boolean {
    return props.timeFormat === "minutes" && isMobileDevice() && supportsNativeInputType("time");
}

function isMobileDevice(): boolean {
    return /(iPhone|iPod|iPad|Android|Windows Phone)/.test(navigator.userAgent);
}

function supportsNativeInputType(type: string): boolean {
    const input = document.createElement("input");
    input.type = type;
    input.value = ":)";
    return input.type === type && input.value !== ":)";
}

function timeFormat(detail: "minutes" | "seconds", use12HourNotation: boolean): string {
    const hourFormat = use12HourNotation ? "hh" : "HH";
    const seconds = detail === "seconds" ? ":ss" : "";
    const suffix = use12HourNotation ? " A" : "";

    return `${hourFormat}:mm${seconds}${suffix}`;
}

function humanReadableFormat(format: string): string {
    return format.replace(" A", " AM/PM");
}

function use12HourNotation(): boolean {
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
export default hot(TimePicker);
