import * as React from "react";
import TimePicker, { TimePickerProps } from "./components/TimePicker";
import { TimePickerContainerProps } from "./components/TimePickerContainer";

declare function require(name: string): string;

// tslint:disable-next-line class-name
export class preview extends React.Component<TimePickerContainerProps, {}> {
    render() {
        return (
            <div ref={this.parentInline}>
                <TimePicker {...this.transformProps(this.props)}></TimePicker>
            </div>
        );
    }

    private parentInline(node?: HTMLElement | null) {
        // Temporary fix, the web modeler add a containing div, to render inline we need to change it.
        if (node && node.parentElement) {
            node.parentElement.style.display = "inline-block";
        }
    }

    private transformProps(props: TimePickerContainerProps): TimePickerProps {
        const valueAttribute = props.valueAttribute && props.valueAttribute.value ? props.valueAttribute.value : "";
        return {
            timepickerType: props.timepickerType,
            bootstrapStyle: props.bootstrapStyle,
            className: props.class,
            clickable: false,
            style: props.style,
            value: valueAttribute ? "[" + valueAttribute + "]" : props.timepickerValue ? props.timepickerValue.value : ""
        };
    }
}

export function getPreviewCss() {
    return require("./ui/TimePicker.css");
}
