import { useEffect, useRef, useState } from "react";
import JobDetailMarkdownPreview from "./JobDetailMarkdownPreview.jsx";
import JobDetailTextBlock from "./JobDetailTextBlock.jsx";

function EmptyText({ children }) {
  return <p className="job-detail-empty">{children}</p>;
}

function EditableJobDetailCard({
  title,
  value,
  placeholder,
  emptyText,
  onSave,
  multiline = true,
}) {
  const [draft, setDraft] = useState(value ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const cardRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setDraft(value ?? "");
    setIsEditing(false);
  }, [value]);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  async function exitEditMode() {
    setIsEditing(false);

    if (draft !== (value ?? "")) {
      await onSave(draft);
    }
  }

  useEffect(() => {
    if (!isEditing) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        exitEditMode();
      }
    }

    function handlePointerDown(event) {
      if (!cardRef.current?.contains(event.target)) {
        exitEditMode();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isEditing, draft, value]);

  const hasText = draft.trim().length > 0;

  return (
    <JobDetailTextBlock
      title={title}
      cardRef={cardRef}
      className={isEditing ? "is-editing" : "is-click-editable"}
      onClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        multiline ? (
          <textarea
            ref={inputRef}
            className="job-detail-notes-editor"
            value={draft}
            placeholder={placeholder}
            spellCheck={false}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setDraft(event.target.value)}
          />
        ) : (
          <input
            ref={inputRef}
            className="job-detail-contact-editor"
            value={draft}
            placeholder={placeholder}
            spellCheck={false}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setDraft(event.target.value)}
          />
        )
      ) : hasText ? (
        <JobDetailMarkdownPreview value={draft} />
      ) : (
        <EmptyText>{emptyText}</EmptyText>
      )}
    </JobDetailTextBlock>
  );
}

export default EditableJobDetailCard;
