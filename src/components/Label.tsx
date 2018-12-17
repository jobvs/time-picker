import React from "react";

interface Props {
    label: string;
    width: number;
    orientation?: "horizontal" | "vertical";
    hasError: boolean;
}

export class Label extends React.Component<Props> {
    static defaultProps = {
        width: 6
    };

    render() {
        const { children, label, width, orientation, hasError } = this.props;
        const colWidth = width > 10 || width < 1 ? 3 : width;
        const labelWidthClass = orientation === "horizontal" ? `col-sm-${colWidth}` : "";
        const childrenWidthClass = orientation === "horizontal" ? `col-sm-${12 - colWidth}` : "";
        const errorClass = hasError ? "has-error" : "";

        return (
            <div className={`form-group clearfix ${errorClass}`}>
                <label className={`control-label ${labelWidthClass}`}>{label}</label>
                <div className={childrenWidthClass}>{children}</div>
            </div>
        );
    }
}
