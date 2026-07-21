import "./Button.css";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  const iconOnly = !children && Boolean(leftIcon || rightIcon);

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        "btn",
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && "btn-full",
        loading && "btn-loading",
        iconOnly && "btn-icon-only",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {leftIcon && <span className="btn-icon">{leftIcon}</span>}

      {children && (
        <span className="btn-text">{loading ? "Loading..." : children}</span>
      )}

      {rightIcon && <span className="btn-icon">{rightIcon}</span>}
    </button>
  );
};

export default Button;
