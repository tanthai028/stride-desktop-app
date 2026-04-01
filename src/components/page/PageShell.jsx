function PageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
}) {
  return (
    <div className="rounded-[36px] border border-white/50 bg-white/45 p-5 shadow-[0_20px_80px_rgba(180,180,255,0.12)] backdrop-blur-3xl">
      <div className="flex flex-col gap-4 border-b border-white/40 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          {eyebrow ? (
            <p className="text-sm font-medium text-pink-400">{eyebrow}</p>
          ) : null}

          <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>

          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>

        {actions ? <div className="flex gap-3">{actions}</div> : null}
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}

export default PageShell;