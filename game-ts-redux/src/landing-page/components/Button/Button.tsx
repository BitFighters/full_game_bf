import React from "react";
import "./Button.scss";

interface ButtonProps extends React.AllHTMLAttributes<HTMLElement> {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

function Button({
  className,
  children,
  type,
  disabled,
  ...props
}: ButtonProps) {
  const cls = `btn-mint ${className}`;

  return (
    <button {...props} type={type} disabled={disabled} className={cls}>
      <span>{children}</span>
    </button>
  );
}

export default Button;
