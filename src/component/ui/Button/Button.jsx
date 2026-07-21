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
  const hasChildren =
    children !== undefined && children !== null && children !== "";

  const iconOnly = !hasChildren && Boolean(leftIcon || rightIcon);

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
      {loading ? (
        <>
          <span className="btn-text">Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="btn-icon">{leftIcon}</span>}

          {hasChildren && <span className="btn-text">{children}</span>}

          {rightIcon && <span className="btn-icon">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
