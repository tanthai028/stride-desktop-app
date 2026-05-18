function PageScrollbar({ isVisible, scrollMetrics, onPointerDown }) {
  const isInteractive = scrollMetrics.isScrollable && isVisible;

  return (
    <div
      className={`absolute bottom-1 -right-3 top-1 w-2.5 transition-opacity duration-300 ease-out ${
        isInteractive
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onPointerDown={onPointerDown}
      role="presentation"
    >
      <div className="absolute inset-y-0 right-0 w-1.5 rounded-full bg-black/5" />

      <div
        data-page-scrollbar-thumb="true"
        className="absolute right-0 w-1.5 cursor-grab rounded-full bg-slate-400/70 shadow-[0_0_0_1px_rgba(255,255,255,0.18)] transition-[transform,height] duration-300 ease-out active:cursor-grabbing"
        style={{
          height: `${scrollMetrics.thumbHeight}px`,
          transform: `translateY(${scrollMetrics.thumbTop}px)`,
        }}
      />
    </div>
  );
}

export default PageScrollbar;
