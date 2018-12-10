import * as React from "react";
import { hot } from "react-hot-loader";

import TimePicker, { BootstrapStyle } from "./TimePicker";

export interface TimePickerContainerProps {
    class: string;
    style: React.CSSProperties;
    valueAttribute?: PluginWidget.EditableValue<string>;
    bootstrapStyle: BootstrapStyle;
    timepickerType: "badge" | "label";
    timepickerValue: PluginWidget.DynamicValue<string>;
    onClickAction: PluginWidget.ActionValue;
}

type Handler = () => void;

class TimePickerContainer extends React.Component<TimePickerContainerProps> {
    private readonly clickHandler: Handler = this.handleOnClick.bind(this);

    render() {
        return (
            <TimePicker
                    timepickerType={this.props.timepickerType}
                    bootstrapStyle={this.props.bootstrapStyle}
                    className={this.props.class}
                    clickable={!!this.props.onClickAction}
                    defaultValue={this.props.timepickerValue ? this.props.timepickerValue.value : ""}
                    onClickAction={this.clickHandler}
                    style={this.props.style}
                    value={this.props.valueAttribute ? this.props.valueAttribute.value : ""}>
            </TimePicker>
            );
    }

    private handleOnClick() {
        if (this.props.onClickAction) {
            this.props.onClickAction.execute();
        }
    }
}

export default hot(module)(TimePickerContainer);
