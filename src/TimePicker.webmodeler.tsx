import React from "react";
import TimePicker, { Props as TimePickerProps } from "./components/TimePicker";

// tslint:disable-next-line class-name
export class preview extends React.Component<TimePickerProps, {}> {
    render() {
        return <TimePicker {...this.props} />;
    }
}

export function getPreviewCss() {
    return require("./ui/TimePicker.css") + require("react-datetime/css/react-datetime.css");
}
