import React from "react";
import TimePicker, { Props as TimePickerProps } from "./components/TimePicker";

// tslint:disable-next-line class-name
export class preview extends React.Component<TimePickerProps, {}> {
    render(): JSX.Element {
        return <TimePicker {...this.props} />;
    }
}

export function getPreviewCss(): string {
    return require("./components/TimePicker.css") + require("react-datetime/css/react-datetime.css");
}
