import React, { forwardRef, useId } from "react";
import "./input.css";

const Input = forwardRef(
  (
    {
      type = "text",
      label,
      error,
      helperText,
      className = "",
      inputClassName = "",
      fullWidth = true,
      required = false,
      id,
      leftIcon,
      rightIcon,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || props.name || generatedId;

    const wrapperClass = ["input-group", fullWidth && "input-full", className]
      .filter(Boolean)
      .join(" ");

    const fieldClass = [
      "input-field",
      error && "input-error",
      props.disabled && "input-disabled",
      inputClassName,
    ]
      .filter(Boolean)
      .join(" ");

    const describedBy = error
      ? `${inputId}-error`
      : helperText
        ? `${inputId}-helper`
        : undefined;

    return (
      <div className={wrapperClass}>
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
            {required && (
              <span className="input-required" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="input-wrapper">
          {leftIcon && (
            <span className="input-icon input-icon-left">{leftIcon}</span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            className={fieldClass}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            required={required}
            {...props}
          />

          {rightIcon && (
            <span className="input-icon input-icon-right">{rightIcon}</span>
          )}
        </div>

        {!error && helperText && (
          <small id={`${inputId}-helper`} className="input-helper">
            {helperText}
          </small>
        )}

        {error && (
          <small id={`${inputId}-error`} className="input-error-text">
            {error}
          </small>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
