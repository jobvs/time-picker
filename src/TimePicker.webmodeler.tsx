import React from "react";
import TimePickerContainer, { Props as TimePickerContainerProps } from "./components/TimePickerContainer";

// tslint:disable-next-line class-name
export class preview extends React.Component<TimePickerContainerProps, {}> {
    render() {
        return <TimePickerContainer {...this.props} />;
    }
}

export function getPreviewCss() {
    return require("./ui/TimePicker.css") + require("react-datetime/css/react-datetime.css");
}
