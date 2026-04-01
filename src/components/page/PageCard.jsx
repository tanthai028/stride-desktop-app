function PageCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

export default PageCard;