import * as React from "react";
import * as classNames from "classnames";

export interface AlertProps {
    message?: string;
    className?: string;
    bootstrapStyle: "default" | "primary" | "success" | "info" | "inverse" | "warning" | "danger";
}

export const Alert: React.FunctionComponent<AlertProps> = ({ className, bootstrapStyle, message }) =>
    message
        ? (<div className={classNames(`alert alert-${bootstrapStyle}`, className)}>{message}</div>)
        : null;

Alert.displayName = "Alert";
