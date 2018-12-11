import React from "react";
import TimePickerContainer, { TimePickerContainerProps } from "./components/TimePickerContainer";

// tslint:disable-next-line class-name
export class preview extends React.Component<TimePickerContainerProps, {}> {
    render() {
        return (
            <TimePickerContainer {...this.props}></TimePickerContainer>
        );
    }
}

export function getPreviewCss() {
    return require("./ui/TimePicker.css");
}
