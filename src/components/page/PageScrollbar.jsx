function PageScrollbar({ isVisible, scrollMetrics, onPointerDown, insetRight = "-0.5rem" }) {
  const isInteractive = scrollMetrics.isScrollable && isVisible;

  return (
    <div
      style={{ right: insetRight }}
      className={`page-scrollbar${isInteractive ? " is-interactive" : ""}`}
      onPointerDown={onPointerDown}
      role="presentation"
    >
      <div className="page-scrollbar-track" />

      <div
        data-page-scrollbar-thumb="true"
        className="page-scrollbar-thumb"
        style={{
          height: `${scrollMetrics.thumbHeight}px`,
          transform: `translateY(${scrollMetrics.thumbTop}px)`,
        }}
      />
    </div>
  );
}

export default PageScrollbar;
