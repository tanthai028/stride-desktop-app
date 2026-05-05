function DashboardTitle({ icon: Icon, children, className = "" }) {
  return (
    <span className={`dashboard-title-with-icon ${className}`}>
      <Icon className="dashboard-title-icon" />
      <span>{children}</span>
    </span>
  );
}

export default DashboardTitle;
