import * as React from "react";
import * as classNames from "classnames";

import "../ui/TimePicker.css";

export interface TimePickerProps {
    timepickerType: "badge" | "label";
    defaultValue?: string;
    className?: string;
    style?: object;
    value?: string;
    bootstrapStyle?: BootstrapStyle;
    clickable?: boolean;
    onClickAction?: () => void;
    getRef?: (node: HTMLElement) => void;
}

export type BootstrapStyle = "default" | "info" | "inverse" | "primary" | "danger" | "success" | "warning";

class TimePicker extends React.Component<TimePickerProps, {}> {
    render() {
        return (
            <span
                className={classNames("widget-timepicker", this.props.timepickerType, this.props.className, {
                [`label-${this.props.bootstrapStyle}`]: !!this.props.bootstrapStyle,
                "widget-timepicker-clickable": this.props.clickable
                })}
                onClick={this.props.onClickAction}
                ref={this.props.getRef}
                style={this.props.style}>{this.props.value || this.props.defaultValue}</span>
        );
    }
}

export default TimePicker;
