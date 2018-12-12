import React from "react";

interface Props {
  label: string;
  width: number;
  orientation?: "horizontal" | "vertical";
}

const Label: React.FunctionComponent<Props> = ({
  children,
  label,
  width,
  orientation
}) => {
  width = width > 10 || width < 1 ? 3 : width;
  const labelWidthClass = orientation === "horizontal" ? `col-sm-${width}` : "";
  const childrenWidthClass =
    orientation === "horizontal" ? `col-sm-${12 - width}` : "";

  return (
    <div className="form-group clearfix">
      <label className={`control-label ${labelWidthClass}`}>{label}</label>
      <div className={childrenWidthClass}>{children}</div>
    </div>
  );
};

Label.defaultProps = { width: 6 };

Label.displayName = "Label";

export default Label;
