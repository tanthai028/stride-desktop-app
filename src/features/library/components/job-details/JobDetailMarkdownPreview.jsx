function JobDetailMarkdownPreview({ value }) {
  return (
    <div className="job-detail-markdown-preview">
      {String(value ?? "")
        .split(/\r?\n/)
        .map((line, index) => {
          const trimmed = line.trim();

          if (!trimmed) return null;

          if (trimmed.startsWith("## ")) {
            return <h4 key={index}>{trimmed.replace("## ", "")}</h4>;
          }

          if (trimmed.startsWith("# ")) {
            return <h3 key={index}>{trimmed.replace("# ", "")}</h3>;
          }

          if (trimmed.startsWith("- ")) {
            return <p key={index}>• {trimmed.replace("- ", "")}</p>;
          }

          return <p key={index}>{trimmed}</p>;
        })}
    </div>
  );
}

export default JobDetailMarkdownPreview;
