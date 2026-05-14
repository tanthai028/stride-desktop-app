function PageScrollbar({ isVisible, scrollMetrics }) {
  return (
    <div
      className={`pointer-events-none absolute bottom-1 -right-3 top-1 w-2.5 transition-opacity duration-300 ease-out ${
        scrollMetrics.isScrollable && isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-y-0 right-0 w-1.5 rounded-full bg-black/5" />

      <div
        className="absolute right-0 w-1.5 rounded-full bg-slate-400/70 shadow-[0_0_0_1px_rgba(255,255,255,0.18)] transition-[transform,height] duration-300 ease-out"
        style={{
          height: `${scrollMetrics.thumbHeight}px`,
          transform: `translateY(${scrollMetrics.thumbTop}px)`,
        }}
      />
    </div>
  );
}

export default PageScrollbar;
