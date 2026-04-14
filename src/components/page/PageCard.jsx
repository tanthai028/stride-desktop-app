function PageCard({
  children,
  className = "",
  onClick,
  disableMotion = false,
}) {
  const baseClass = `surface-card page-card rounded-[30px] p-6 ${
    onClick ? "cursor-pointer" : ""
  } ${disableMotion ? "page-card-static" : ""} ${className}`;

  return (
    <div onClick={onClick} className={baseClass}>
      {children}
    </div>
  );
}

export default PageCard;
