function PageCard({
  children,
  className = "",
  onClick,
  onMouseDown,
  onAuxClick,
  title,
  disableMotion = false,
}) {
  const baseClass = `surface-card page-card ${
    onClick ? "cursor-pointer" : ""
  } ${disableMotion ? "page-card-static" : ""} ${className}`;

  return (
    <div
      onClick={onClick}
      onMouseDown={onMouseDown}
      onAuxClick={onAuxClick}
      title={title}
      className={baseClass}
    >
      {children}
    </div>
  );
}

export default PageCard;
