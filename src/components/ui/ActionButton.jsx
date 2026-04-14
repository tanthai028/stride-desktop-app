import { getHoverFeedbackHandlers } from "../../lib/uiFeedback.js";

const actionButtonToneClassNames = {
  default: "action-button-default",
  pink: "action-button-pink",
  violet: "action-button-violet",
  sky: "action-button-sky",
};

function ActionButton({
  children,
  className = "",
  onClick,
  tone = "default",
  withIcon = false,
  type = "button",
}) {
  const toneClassName =
    actionButtonToneClassNames[tone] || actionButtonToneClassNames.default;

  const hoverFeedbackHandlers = getHoverFeedbackHandlers();

  return (
    <button
      type={type}
      onClick={onClick}
      className={[
        "action-button",
        withIcon ? "action-button--with-icon" : "",
        toneClassName,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...hoverFeedbackHandlers}
    >
      {children}
    </button>
  );
}

export default ActionButton;
