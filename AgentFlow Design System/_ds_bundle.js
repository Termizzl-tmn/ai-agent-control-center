/* @ds-bundle: {"format":3,"namespace":"AgentFlowDesignSystem_98d862","components":[{"name":"AgentCard","sourcePath":"components/data/AgentCard.jsx"},{"name":"LogLine","sourcePath":"components/data/LogLine.jsx"},{"name":"Panel","sourcePath":"components/data/Panel.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"StatusBadge","sourcePath":"components/feedback/StatusBadge.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Slider","sourcePath":"components/forms/Slider.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"PixelOffice","sourcePath":"components/scene/PixelOffice.jsx"}],"sourceHashes":{"components/data/AgentCard.jsx":"0679f6db6b13","components/data/LogLine.jsx":"b8eebab7d144","components/data/Panel.jsx":"fd1e450d8af9","components/data/StatCard.jsx":"897bfd7c5247","components/feedback/ProgressBar.jsx":"a44a42b87a19","components/feedback/StatusBadge.jsx":"fc8085f0b392","components/feedback/Tag.jsx":"18e905c9e4c0","components/forms/Button.jsx":"4ce8f1de8160","components/forms/Input.jsx":"6104c54d459e","components/forms/Select.jsx":"c97845a5b272","components/forms/Slider.jsx":"e7c81c2e2951","components/forms/Switch.jsx":"8359aedad4c2","components/navigation/Tabs.jsx":"93df9cf1a6a4","components/scene/PixelOffice.jsx":"6bd9c285f7e2","ui_kits/agentflow/AgentDetail.jsx":"9aa353d2ee90","ui_kits/agentflow/Dashboard.jsx":"c39cc98bdd83","ui_kits/agentflow/Office.jsx":"ee083563645f","ui_kits/agentflow/PipelineBuilder.jsx":"79a83509ba8c","ui_kits/agentflow/QAView.jsx":"9b14ec10e371","ui_kits/agentflow/Settings.jsx":"e43664e0e615","ui_kits/agentflow/Shell.jsx":"b59ae5543fa3"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AgentFlowDesignSystem_98d862 = window.AgentFlowDesignSystem_98d862 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/data/LogLine.jsx
try { (() => {
const LEVEL = {
  info: {
    color: 'var(--text-secondary)',
    tag: 'INFO',
    tagColor: 'var(--text-muted)'
  },
  warn: {
    color: 'var(--status-waiting)',
    tag: 'WARN',
    tagColor: 'var(--status-waiting)'
  },
  error: {
    color: 'var(--status-error)',
    tag: 'ERR ',
    tagColor: 'var(--status-error)'
  },
  success: {
    color: 'var(--status-running)',
    tag: 'OK  ',
    tagColor: 'var(--status-running)'
  }
};

/**
 * AgentFlow LogLine — one monospace activity-log row: time │ level │ [agent] message.
 * `current` highlights the row with a neon left border (latest entry).
 */
function LogLine({
  time,
  level = 'info',
  agent,
  message,
  lineNo,
  current = false,
  style
}) {
  const l = LEVEL[level] || LEVEL.info;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 10,
      padding: '2px 8px 2px 10px',
      borderLeft: current ? '2px solid var(--status-running)' : '2px solid transparent',
      background: current ? 'rgba(0,229,160,0.06)' : 'transparent',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      lineHeight: 1.7,
      ...style
    }
  }, lineNo != null && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      opacity: 0.5,
      minWidth: 28,
      textAlign: 'right',
      userSelect: 'none'
    }
  }, String(lineNo).padStart(3, '0')), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      flexShrink: 0
    }
  }, time), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "\u2502"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: l.tagColor,
      flexShrink: 0,
      whiteSpace: 'pre'
    }
  }, l.tag), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "\u2502"), agent && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      flexShrink: 0
    }
  }, "[", agent, "]"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: l.color,
      wordBreak: 'break-word'
    }
  }, message));
}
Object.assign(__ds_scope, { LogLine });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/LogLine.jsx", error: String((e && e.message) || e) }); }

// components/data/Panel.jsx
try { (() => {
/**
 * AgentFlow Panel — surface container with optional mono title bar, meta slot
 * and CRT scanline texture. The structural building block for every screen.
 */
function Panel({
  title,
  meta,
  children,
  scanlines = false,
  padding = 16,
  accent,
  style,
  bodyStyle
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      borderTop: accent ? `2px solid ${accent}` : '1px solid var(--border)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, (title || meta) && /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 14px',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-label)',
      color: 'var(--text-muted)'
    }
  }, title), meta && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, meta)), /*#__PURE__*/React.createElement("div", {
    className: scanlines ? 'af-scanlines' : undefined,
    style: {
      position: 'relative',
      padding,
      flex: 1,
      minHeight: 0,
      ...bodyStyle
    }
  }, children, scanlines && /*#__PURE__*/React.createElement("span", {
    style: {
      content: '""',
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      background: 'var(--scanlines)',
      mixBlendMode: 'overlay'
    }
  })));
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Panel.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
/**
 * AgentFlow StatCard — mono label + large value, optional accent + delta/sub.
 * Used in the dashboard stats row and agent-detail metrics.
 */
function StatCard({
  label,
  value,
  sub,
  accent = 'var(--text-primary)',
  bar,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-label)',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 'var(--text-2xl)',
      lineHeight: 1,
      letterSpacing: 'var(--tracking-tight)',
      color: accent
    }
  }, value), bar !== undefined && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      height: 3,
      width: '100%',
      background: 'var(--bg-sunken)',
      borderRadius: 'var(--radius-pill)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${Math.max(0, Math.min(100, bar))}%`,
      background: accent,
      boxShadow: `0 0 6px ${accent}`,
      borderRadius: 'var(--radius-pill)'
    }
  })), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, sub));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
const TINT = {
  running: 'var(--status-running)',
  waiting: 'var(--status-waiting)',
  done: 'var(--status-done)',
  error: 'var(--status-error)',
  brand: 'var(--brand)',
  idle: 'var(--status-idle)'
};

/**
 * AgentFlow ProgressBar — 4px track that glows in its status color.
 * Pass `value` 0..100. `status` picks the fill+glow color.
 */
function ProgressBar({
  value = 0,
  status = 'running',
  height = 4,
  showLabel = false,
  style
}) {
  const color = TINT[status] || TINT.running;
  const v = Math.max(0, Math.min(100, value));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height,
      background: 'var(--bg-sunken)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-pill)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      width: `${v}%`,
      background: color,
      borderRadius: 'var(--radius-pill)',
      boxShadow: `0 0 8px ${color}, 0 0 2px ${color}`,
      transition: 'width 400ms cubic-bezier(.4,0,.2,1)'
    }
  })), showLabel && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 5,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      textAlign: 'right'
    }
  }, v, "%"));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusBadge.jsx
try { (() => {
const STATUS = {
  running: {
    color: 'var(--status-running)',
    bg: 'var(--status-running-bg)',
    label: 'Running'
  },
  waiting: {
    color: 'var(--status-waiting)',
    bg: 'var(--status-waiting-bg)',
    label: 'Waiting'
  },
  idle: {
    color: 'var(--status-idle)',
    bg: 'var(--status-idle-bg)',
    label: 'Idle'
  },
  done: {
    color: 'var(--status-done)',
    bg: 'var(--status-done-bg)',
    label: 'Done'
  },
  error: {
    color: 'var(--status-error)',
    bg: 'var(--status-error-bg)',
    label: 'Error'
  },
  /* aliases matching the codebase AgentStatus enum */
  success: {
    color: 'var(--status-done)',
    bg: 'var(--status-done-bg)',
    label: 'Done'
  }
};

/**
 * AgentFlow StatusBadge — pill with a status dot. Dot pulses when running.
 * Statuses: running | waiting | idle | done | error (success aliases done).
 */
function StatusBadge({
  status = 'idle',
  size = 'md',
  label,
  style
}) {
  const s = STATUS[status] || STATUS.idle;
  const text = label || s.label;
  const pulsing = status === 'running';
  const sizes = {
    sm: {
      pad: '2px 7px',
      font: 'var(--text-2xs)',
      dot: 5
    },
    md: {
      pad: '3px 9px',
      font: 'var(--text-xs)',
      dot: 6
    },
    lg: {
      pad: '5px 12px',
      font: 'var(--text-sm)',
      dot: 8
    }
  };
  const z = sizes[size] || sizes.md;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: z.pad,
      background: s.bg,
      border: `1px solid ${s.color}55`,
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-mono)',
      fontSize: z.font,
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)',
      color: s.color,
      whiteSpace: 'nowrap',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: z.dot,
      height: z.dot,
      borderRadius: 'var(--radius-pill)',
      background: s.color,
      boxShadow: `0 0 6px ${s.color}`,
      animation: pulsing ? 'af-pulse 1.1s ease-in-out infinite' : 'none'
    }
  }), text, /*#__PURE__*/React.createElement("style", null, `@keyframes af-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}`));
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/data/AgentCard.jsx
try { (() => {
const ROLE = {
  po: {
    color: 'var(--role-po)',
    icon: '📋'
  },
  pm: {
    color: 'var(--role-pm)',
    icon: '📅'
  },
  techlead: {
    color: 'var(--role-techlead)',
    icon: '🏗️'
  },
  dev: {
    color: 'var(--role-dev)',
    icon: '💻'
  },
  qa: {
    color: 'var(--role-qa)',
    icon: '🧪'
  },
  devops: {
    color: 'var(--role-devops)',
    icon: '⚙️'
  },
  notifier: {
    color: 'var(--role-notifier)',
    icon: '🔔'
  }
};
const PROGRESS_STATUS = {
  running: 'running',
  waiting: 'waiting',
  done: 'done',
  success: 'done',
  error: 'error',
  idle: 'idle'
};

/**
 * AgentFlow AgentCard — the dashboard's primary unit. Role-tinted card with
 * agent id, name, role line, status badge, glowing progress bar and task count.
 * Composes StatusBadge + ProgressBar.
 */
function AgentCard({
  agentId = 'AGT-000',
  name = 'Agent',
  role = 'dev',
  description,
  status = 'idle',
  progress = 0,
  tasksDone,
  tasksTotal,
  selected = false,
  onClick,
  style
}) {
  const r = ROLE[role] || ROLE.dev;
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      padding: 14,
      background: selected ? 'var(--bg-elevated)' : 'var(--bg-surface)',
      border: `1px solid ${selected || hover ? r.color : 'var(--border)'}`,
      borderLeft: `2px solid ${r.color}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: selected ? `0 0 0 1px ${r.color}55, 0 0 14px ${r.color}33` : 'var(--shadow-card)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'border-color 140ms ease, box-shadow 140ms ease, background 140ms ease',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      lineHeight: 1,
      filter: 'saturate(1.1)'
    }
  }, r.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-label)',
      color: 'var(--text-muted)',
      marginBottom: 2
    }
  }, agentId), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-md)',
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, name))), /*#__PURE__*/React.createElement(__ds_scope.StatusBadge, {
    status: status,
    size: "sm"
  })), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      lineHeight: 1.4,
      color: 'var(--text-secondary)'
    }
  }, description), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ProgressBar, {
    value: progress,
    status: PROGRESS_STATUS[status] || 'idle'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, tasksTotal != null ? `${tasksDone ?? 0}/${tasksTotal} tasks` : ''), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, progress, "%"))));
}
Object.assign(__ds_scope, { AgentCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/AgentCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag.jsx
try { (() => {
const TONES = {
  neutral: {
    color: 'var(--text-secondary)',
    border: 'var(--border-strong)',
    bg: 'var(--bg-elevated)'
  },
  brand: {
    color: 'var(--brand)',
    border: 'rgba(0,180,216,0.4)',
    bg: 'rgba(0,180,216,0.10)'
  },
  running: {
    color: 'var(--status-running)',
    border: 'rgba(0,229,160,0.4)',
    bg: 'var(--status-running-bg)'
  },
  waiting: {
    color: 'var(--status-waiting)',
    border: 'rgba(245,197,66,0.4)',
    bg: 'var(--status-waiting-bg)'
  },
  done: {
    color: 'var(--status-done)',
    border: 'rgba(77,159,255,0.4)',
    bg: 'var(--status-done-bg)'
  },
  error: {
    color: 'var(--status-error)',
    border: 'rgba(255,77,109,0.4)',
    bg: 'var(--status-error-bg)'
  }
};
const SEVERITY = {
  HIGH: 'error',
  MED: 'waiting',
  LOW: 'done'
};

/**
 * AgentFlow Tag — small square-cornered chip. Severity helper maps
 * HIGH/MED/LOW to error/waiting/done tones.
 */
function Tag({
  children,
  tone = 'neutral',
  severity,
  style
}) {
  const t = TONES[severity ? SEVERITY[severity] : tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 7px',
      background: t.bg,
      border: `1px solid ${t.border}`,
      borderRadius: 'var(--radius-xs)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-wide)',
      color: t.color,
      whiteSpace: 'nowrap',
      ...style
    }
  }, severity || children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * AgentFlow Button — sharp-cornered developer-tool button.
 * Variants: primary (neon green), brand (cyan), secondary, ghost, danger.
 */
function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  disabled = false,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '5px 10px',
      font: 'var(--text-xs)',
      gap: 6
    },
    md: {
      padding: '8px 14px',
      font: 'var(--text-sm)',
      gap: 8
    },
    lg: {
      padding: '11px 18px',
      font: 'var(--text-md)',
      gap: 8
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: 'var(--status-running)',
      color: 'var(--text-inverse)',
      border: '1px solid var(--status-running)'
    },
    brand: {
      background: 'var(--brand)',
      color: 'var(--text-inverse)',
      border: '1px solid var(--brand)'
    },
    secondary: {
      background: 'var(--bg-elevated)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent'
    },
    danger: {
      background: 'var(--status-error-bg)',
      color: 'var(--status-error)',
      border: '1px solid rgba(255,77,109,0.4)'
    }
  };
  const v = variants[variant] || variants.secondary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      padding: s.padding,
      fontFamily: 'var(--font-mono)',
      fontSize: s.font,
      fontWeight: 500,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'filter 120ms ease, transform 80ms ease',
      whiteSpace: 'nowrap',
      ...v,
      ...style
    },
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.filter = 'brightness(1.12)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.filter = 'none';
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'translateY(1px)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'none';
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      fontSize: '1.1em',
      lineHeight: 1
    }
  }, icon), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * AgentFlow Input — sunken well, mono text, cyan focus border.
 * Optional uppercase mono label and a trailing addon (e.g. Show / Test button).
 */
function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  mono = true,
  addon,
  hint,
  disabled = false,
  style,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginBottom: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-label)',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      background: 'var(--bg-sunken)',
      border: `1px solid ${focused ? 'var(--brand)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-sm)',
      boxShadow: focused ? '0 0 0 1px rgba(0,180,216,0.35)' : 'none',
      transition: 'border-color 120ms ease, box-shadow 120ms ease'
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      flex: 1,
      width: '100%',
      background: 'transparent',
      border: 'none',
      outline: 'none',
      padding: '9px 12px',
      color: 'var(--text-primary)',
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
      fontSize: 'var(--text-sm)'
    }
  }, rest))), addon), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 6,
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * AgentFlow Select — native dropdown styled as a sunken field with chevron.
 */
function Select({
  label,
  value,
  onChange,
  options = [],
  disabled = false,
  style,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginBottom: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-label)',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    value: value,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      width: '100%',
      appearance: 'none',
      WebkitAppearance: 'none',
      background: 'var(--bg-sunken)',
      border: `1px solid ${focused ? 'var(--brand)' : 'var(--border)'}`,
      boxShadow: focused ? '0 0 0 1px rgba(0,180,216,0.35)' : 'none',
      borderRadius: 'var(--radius-sm)',
      padding: '9px 34px 9px 12px',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      outline: 'none',
      cursor: 'pointer',
      transition: 'border-color 120ms ease, box-shadow 120ms ease'
    }
  }, rest), options.map(o => {
    const opt = typeof o === 'string' ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--text-muted)',
      fontSize: 11
    }
  }, "\u25BE")));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Slider.jsx
try { (() => {
/**
 * AgentFlow Slider — range input with neon-filled track and mono value readout.
 */
function Slider({
  label,
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  format,
  accent = 'var(--brand)',
  disabled = false,
  style
}) {
  const pct = (value - min) / (max - min) * 100;
  const display = format ? format(value) : value;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...style
    }
  }, (label || display !== undefined) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 8
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-label)',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)'
    }
  }, display)), /*#__PURE__*/React.createElement("input", {
    type: "range",
    value: value,
    min: min,
    max: max,
    step: step,
    disabled: disabled,
    onChange: onChange,
    style: {
      width: '100%',
      height: 4,
      appearance: 'none',
      WebkitAppearance: 'none',
      borderRadius: 'var(--radius-pill)',
      outline: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: `linear-gradient(to right, ${accent} 0%, ${accent} ${pct}%, var(--border) ${pct}%, var(--border) 100%)`
    },
    className: "af-slider"
  }), /*#__PURE__*/React.createElement("style", null, `
        .af-slider::-webkit-slider-thumb{
          -webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:var(--radius-pill);
          background:${accent};border:2px solid var(--bg-base);
          box-shadow:0 0 8px ${accent};cursor:pointer;margin-top:0;
        }
        .af-slider::-moz-range-thumb{
          width:14px;height:14px;border-radius:var(--radius-pill);background:${accent};
          border:2px solid var(--bg-base);box-shadow:0 0 8px ${accent};cursor:pointer;
        }
      `));
}
Object.assign(__ds_scope, { Slider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Slider.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/**
 * AgentFlow Switch — sharp-ish toggle. On = neon green; off = sunken track.
 */
function Switch({
  checked = false,
  onChange,
  label,
  accent = 'var(--status-running)',
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => {
      if (!disabled && onChange) onChange(!checked);
    },
    style: {
      position: 'relative',
      width: 38,
      height: 20,
      flexShrink: 0,
      background: checked ? accent : 'var(--bg-sunken)',
      border: `1px solid ${checked ? accent : 'var(--border-strong)'}`,
      borderRadius: 'var(--radius-pill)',
      transition: 'background 140ms ease, border-color 140ms ease',
      boxShadow: checked ? `0 0 8px ${accent}66` : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? 19 : 2,
      width: 14,
      height: 14,
      borderRadius: 'var(--radius-pill)',
      background: checked ? 'var(--text-inverse)' : 'var(--text-secondary)',
      transition: 'left 140ms cubic-bezier(.4,0,.2,1)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
/**
 * AgentFlow Tabs — underline tab strip (cyan/role active border) for views,
 * and filter chips. `variant="filter"` renders compact bracketed filter pills.
 */
function Tabs({
  tabs = [],
  value,
  onChange,
  variant = 'underline',
  accent = 'var(--status-running)',
  style
}) {
  const norm = tabs.map(t => typeof t === 'string' ? {
    id: t,
    label: t
  } : t);
  if (variant === 'filter') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        ...style
      }
    }, norm.map(t => {
      const active = t.id === value;
      return /*#__PURE__*/React.createElement("button", {
        key: t.id,
        onClick: () => onChange && onChange(t.id),
        style: {
          padding: '4px 10px',
          background: active ? 'var(--bg-elevated)' : 'transparent',
          border: `1px solid ${active ? accent : 'var(--border)'}`,
          borderRadius: 'var(--radius-xs)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wide)',
          color: active ? accent : 'var(--text-muted)',
          cursor: 'pointer',
          transition: 'all 120ms ease'
        }
      }, `[ ${t.label} ]`);
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      borderBottom: '1px solid var(--border)',
      ...style
    }
  }, norm.map(t => {
    const active = t.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => onChange && onChange(t.id),
      style: {
        position: 'relative',
        padding: '9px 14px',
        background: 'transparent',
        border: 'none',
        borderBottom: `2px solid ${active ? accent : 'transparent'}`,
        marginBottom: -1,
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-wide)',
        color: active ? 'var(--text-primary)' : 'var(--text-muted)',
        cursor: 'pointer',
        transition: 'color 120ms ease, border-color 120ms ease'
      }
    }, t.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/scene/PixelOffice.jsx
try { (() => {
/* AgentFlow — PixelOffice
   An animated pixel-art office rendered on a 2D canvas. Each agent is a
   character that sits at a desk and animates by status (typing when running,
   a "?" speech bubble when waiting, etc.), and periodically gets up and walks
   around the room. Original art, drawn pixel-by-pixel in the AgentFlow palette.
   No external sprite assets. Composable, click-selectable.

   Coordinate system: art pixels. Grid is COLS×ROWS tiles of TILE art-px.
   The canvas backing store is ART × SCALE for crispness; CSS scales it to fit.
*/

const TILE = 16;
const COLS = 22;
const ROWS = 13;
const ART_W = COLS * TILE; // 352
const ART_H = ROWS * TILE; // 208
const SCALE = 3;
const SPEED = 3.2; // tiles / second

// ---- Palette (mirrors design tokens; canvas can't read CSS vars cheaply) ----
const C = {
  floorA: '#0D1322',
  floorB: '#0A0F1C',
  grout: '#161D30',
  wallFace: '#131929',
  wallTop: '#232C44',
  baseboard: '#090D18',
  wallLine: 'rgba(0,180,216,0.25)',
  glass: '#15314A',
  glassHi: '#1E4A6B',
  frame: '#2A3552',
  deskTop: '#2C3650',
  deskEdge: '#1B2236',
  deskLeg: '#141A2B',
  monFrame: '#1B2236',
  monStand: '#2A3552',
  kbd: '#222B42',
  mug: '#4D9FFF',
  chair: '#222B42',
  chairHi: '#2E3A57',
  pot: '#5A4632',
  leafA: '#1F8A5B',
  leafB: '#2BB673',
  rug: '#0E2A30',
  rugLine: '#00B4D8',
  pants: '#243049',
  shoe: '#0A0E1B',
  eye: '#0A0E1B'
};
const SKIN = ['#E8B98C', '#D29B6E', '#A9714B', '#7A4F33'];
const HAIR = ['#23232B', '#3A2A1C', '#5A4632', '#6B7280', '#2A3552'];
const STATUS = {
  running: '#00E5A0',
  waiting: '#F5C542',
  idle: '#4A5068',
  done: '#4D9FFF',
  error: '#FF4D6D',
  success: '#4D9FFF'
};
const ROLE_SHIRT = {
  po: '#7C3AED',
  pm: '#0284C7',
  techlead: '#059669',
  dev: '#00E5A0',
  qa: '#D97706',
  devops: '#DC2626',
  notifier: '#9AA3B8'
};
const ROLE_LABEL = {
  po: 'PO',
  pm: 'PM',
  techlead: 'Tech Lead',
  dev: 'Developer',
  qa: 'QA',
  devops: 'DevOps',
  notifier: 'Notifier'
};

// ---- Scene layout ----
// Desk = table tile; seat = floor tile directly south (agent faces north/up).
const DESKS = [{
  col: 3,
  row: 4
}, {
  col: 7,
  row: 4
}, {
  col: 11,
  row: 4
}, {
  col: 15,
  row: 4
}, {
  col: 5,
  row: 9
}, {
  col: 11,
  row: 9
}, {
  col: 17,
  row: 9
}];
const SEATS = DESKS.map(d => ({
  col: d.col,
  row: d.row + 1
}));
const PLANTS = [{
  col: 1,
  row: 3
}, {
  col: 20,
  row: 3
}, {
  col: 1,
  row: 11
}, {
  col: 20,
  row: 6
}];
const COFFEE = {
  col: 20,
  row: 9
};
const HANGOUTS = [{
  col: 10,
  row: 6
}, {
  col: 19,
  row: 10
}, {
  col: 3,
  row: 8
}, {
  col: 18,
  row: 3
}, {
  col: 13,
  row: 11
}];
const DOOR = {
  col: 0,
  row: 6
};
function buildGrid() {
  // true = walkable
  const g = Array.from({
    length: ROWS
  }, () => Array(COLS).fill(true));
  for (let x = 0; x < COLS; x++) {
    g[0][x] = false;
    g[1][x] = false;
  } // wall
  DESKS.forEach(d => {
    g[d.row][d.col] = false;
  });
  PLANTS.forEach(p => {
    g[p.row][p.col] = false;
  });
  g[COFFEE.row][COFFEE.col] = false;
  return g;
}
const GRID = buildGrid();
function bfs(start, goal) {
  if (start.col === goal.col && start.row === goal.row) return [];
  const key = (c, r) => c + ',' + r;
  const q = [start];
  const prev = {
    [key(start.col, start.row)]: null
  };
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const cur = q.shift();
    if (cur.col === goal.col && cur.row === goal.row) break;
    for (const [dc, dr] of dirs) {
      const nc = cur.col + dc,
        nr = cur.row + dr;
      if (nc < 0 || nr < 0 || nc >= COLS || nr >= ROWS) continue;
      if (!GRID[nr][nc] && !(nc === goal.col && nr === goal.row)) continue;
      const k = key(nc, nr);
      if (k in prev) continue;
      prev[k] = cur;
      q.push({
        col: nc,
        row: nr
      });
    }
  }
  const gk = key(goal.col, goal.row);
  if (!(gk in prev)) return [];
  const path = [];
  let node = {
    col: goal.col,
    row: goal.row
  };
  while (node) {
    path.unshift(node);
    node = prev[key(node.col, node.row)];
  }
  path.shift(); // drop start
  return path;
}

// ---- Drawing helpers ----
function R(ctx, x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(x | 0, y | 0, Math.ceil(w), Math.ceil(h));
}
function drawFloor(ctx) {
  for (let r = 2; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      R(ctx, c * TILE, r * TILE, TILE, TILE, (c + r) % 2 ? C.floorA : C.floorB);
      R(ctx, c * TILE, r * TILE, TILE, 1, C.grout);
      R(ctx, c * TILE, r * TILE, 1, TILE, C.grout);
    }
  }
}
function drawWall(ctx) {
  R(ctx, 0, 0, ART_W, TILE * 2, C.wallFace);
  R(ctx, 0, 0, ART_W, 3, C.wallTop);
  R(ctx, 0, 3, ART_W, 1, C.wallLine);
  R(ctx, 0, TILE * 2 - 2, ART_W, 2, C.baseboard);
  // windows
  [[4, 6], [14, 17]].forEach(([a, b]) => {
    const x = a * TILE + 2,
      w = (b - a) * TILE - 4;
    R(ctx, x, 6, w, 16, C.glass);
    R(ctx, x, 6, w, 5, C.glassHi);
    R(ctx, x - 1, 5, w + 2, 1, C.frame);
    R(ctx, x - 1, 22, w + 2, 1, C.frame);
    R(ctx, x + w / 2, 6, 1, 16, C.frame);
  });
  // door on left wall
  R(ctx, DOOR.col * TILE, 4, 12, TILE * 2 - 6, C.frame);
  R(ctx, DOOR.col * TILE + 2, 6, 8, TILE * 2 - 10, '#0C1220');
  R(ctx, DOOR.col * TILE + 8, 14, 1, 2, C.mug);
}
function drawRug(ctx) {
  const x = 7 * TILE,
    y = 5 * TILE,
    w = 8 * TILE,
    h = 3 * TILE;
  R(ctx, x, y, w, h, C.rug);
  ctx.strokeStyle = C.rugLine;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  ctx.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
  ctx.globalAlpha = 1;
}
function drawPlant(ctx, p) {
  const x = p.col * TILE,
    y = p.row * TILE;
  R(ctx, x + 5, y + 10, 6, 5, C.pot);
  R(ctx, x + 5, y + 10, 6, 1, '#6B5640');
  R(ctx, x + 6, y + 3, 4, 7, C.leafA);
  R(ctx, x + 4, y + 5, 3, 4, C.leafB);
  R(ctx, x + 9, y + 4, 3, 5, C.leafB);
  R(ctx, x + 7, y + 1, 2, 3, C.leafB);
}
function drawCoffee(ctx, time) {
  const x = COFFEE.col * TILE,
    y = COFFEE.row * TILE;
  R(ctx, x + 3, y + 4, 10, 11, C.frame);
  R(ctx, x + 3, y + 4, 10, 1, C.chairHi);
  R(ctx, x + 5, y + 7, 6, 3, '#0C1220');
  const on = Math.floor(time * 2) % 2;
  R(ctx, x + 10, y + 5, 1, 1, on ? STATUS.running : STATUS.idle);
  R(ctx, x + 5, y + 12, 6, 2, '#3A2A1C'); // pot
}
function drawDesk(ctx, d, agent, time) {
  const x = d.col * TILE,
    y = d.row * TILE;
  // chair (south of desk, where agent sits)
  R(ctx, x + 3, y + TILE + 5, 10, 8, C.chair);
  R(ctx, x + 3, y + TILE + 5, 10, 2, C.chairHi);
  // desk legs + top
  R(ctx, x + 1, y + 11, 2, 5, C.deskLeg);
  R(ctx, x + 13, y + 11, 2, 5, C.deskLeg);
  R(ctx, x, y + 8, TILE, 4, C.deskTop);
  R(ctx, x, y + 8, TILE, 1, '#384665');
  R(ctx, x, y + 12, TILE, 1, C.deskEdge);
  // keyboard + mug on desk
  R(ctx, x + 4, y + 9, 8, 2, C.kbd);
  R(ctx, x + 12, y + 9, 2, 2, C.mug);
  // monitor (back of desk)
  const sc = agent ? STATUS[agent.status] || C.idle : C.idle;
  R(ctx, x + 4, y + 7, 2, 2, C.monStand);
  R(ctx, x + 2, y - 1, 12, 9, C.monFrame);
  const lit = agent && agent.status !== 'idle';
  if (lit) {
    ctx.save();
    ctx.shadowColor = sc;
    ctx.shadowBlur = 7;
  }
  R(ctx, x + 3, y, 10, 6, lit ? sc : '#0C1220');
  if (lit) ctx.restore();
  if (lit) {
    // code lines on screen
    ctx.globalAlpha = 0.35;
    const off = agent.status === 'running' ? Math.floor(time * 6) % 3 : 0;
    R(ctx, x + 4, y + 1 + off * 0, 5, 1, '#06121f');
    R(ctx, x + 4, y + 3, 7 - off, 1, '#06121f');
    R(ctx, x + 4, y + 5, 4, 1, '#06121f');
    ctx.globalAlpha = 1;
  }
}

// Character: ~12 wide, 18 tall, feet at feetY. Dark outline for contrast.
const OUT = '#05080F';
function drawChar(ctx, cx, feetY, opt) {
  const {
    shirt,
    skin,
    hair,
    dir,
    pose,
    frame,
    status,
    time
  } = opt;
  const left = Math.round(cx) - 6;
  const top = Math.round(feetY) - 18;
  const back = dir === 'up';
  const walking = pose === 'walk';
  const seated = pose === 'sit' || pose === 'type' || pose === 'read';
  const lp = walking ? frame % 2 ? 1 : -1 : 0;

  // ground shadow
  ctx.globalAlpha = 0.32;
  R(ctx, left + 2, feetY - 1, 9, 2, '#000');
  ctx.globalAlpha = 1;

  // ---- silhouette outline (drawn first, 1px larger masses) ----
  R(ctx, left + 2, top + 1, 9, 8, OUT); // head block
  R(ctx, left + 1, top + 7, 11, 8, OUT); // torso+arms block
  if (!seated) {
    R(ctx, left + 2, top + 13, 9, 4, OUT);
  } // legs block

  // legs
  if (seated) {
    R(ctx, left + 3, top + 14, 3, 2, C.pants);
    R(ctx, left + 7, top + 14, 3, 2, C.pants);
  } else {
    R(ctx, left + 3, top + 13 + (lp > 0 ? 1 : 0), 3, 4 - (lp > 0 ? 1 : 0), C.pants);
    R(ctx, left + 7, top + 13 + (lp < 0 ? 1 : 0), 3, 4 - (lp < 0 ? 1 : 0), C.pants);
    R(ctx, left + 3, top + 16, 3, 1, C.shoe);
    R(ctx, left + 7, top + 16, 3, 1, C.shoe);
  }

  // torso (shirt) + collar highlight
  R(ctx, left + 3, top + 8, 7, 6, shirt);
  R(ctx, left + 3, top + 8, 7, 1, 'rgba(255,255,255,0.18)');

  // arms
  if (pose === 'type') {
    const b = frame % 2;
    R(ctx, left + 2, top + 9, 2, 3, shirt);
    R(ctx, left + 9, top + 9, 2, 3, shirt);
    R(ctx, left + 2, top + 8 - b, 2, 1, skin);
    R(ctx, left + 9, top + 8 - (1 - b), 2, 1, skin);
  } else if (walking) {
    R(ctx, left + 2, top + 8 + lp, 2, 4, shirt);
    R(ctx, left + 9, top + 8 - lp, 2, 4, shirt);
  } else {
    R(ctx, left + 2, top + 9, 2, 4, shirt);
    R(ctx, left + 9, top + 9, 2, 4, shirt);
  }

  // neck + head
  R(ctx, left + 5, top + 7, 3, 1, skin);
  R(ctx, left + 4, top + 2, 5, 6, skin);

  // hair
  if (back) {
    R(ctx, left + 4, top + 1, 5, 6, hair);
    R(ctx, left + 3, top + 2, 1, 5, hair);
    R(ctx, left + 9, top + 2, 1, 5, hair);
  } else {
    R(ctx, left + 4, top + 1, 5, 2, hair);
    R(ctx, left + 3, top + 2, 1, 3, hair);
    R(ctx, left + 9, top + 2, 1, 3, hair);
    if (dir === 'down') {
      R(ctx, left + 5, top + 4, 1, 2, C.eye);
      R(ctx, left + 7, top + 4, 1, 2, C.eye);
    } else if (dir === 'left') {
      R(ctx, left + 5, top + 4, 1, 2, C.eye);
    } else {
      R(ctx, left + 7, top + 4, 1, 2, C.eye);
    }
  }

  // ---- status indicator above head ----
  const sc = STATUS[status] || C.idle;
  if (status === 'waiting' || status === 'error') {
    const bx = left + 6,
      by = top - 12;
    R(ctx, bx - 1, by - 1, 13, 11, OUT); // bubble outline
    ctx.save();
    ctx.shadowColor = sc;
    ctx.shadowBlur = 7;
    R(ctx, bx, by, 11, 9, '#E6ECFB');
    ctx.restore();
    R(ctx, bx + 2, by + 9, 2, 2, '#E6ECFB');
    R(ctx, bx + 2, by + 11, 1, 1, OUT);
    R(ctx, bx, by, 11, 2, sc);
    const g = status === 'waiting' ? '#1a2436' : STATUS.error;
    if (status === 'waiting') {
      R(ctx, bx + 4, by + 3, 3, 1, g);
      R(ctx, bx + 6, by + 4, 1, 1, g);
      R(ctx, bx + 5, by + 5, 1, 1, g);
      R(ctx, bx + 5, by + 7, 1, 1, g);
    } else {
      R(ctx, bx + 5, by + 3, 1, 3, g);
      R(ctx, bx + 5, by + 7, 1, 1, g);
    }
  } else {
    const pulse = status === 'running' ? 0.5 + 0.5 * Math.abs(Math.sin(time * 3)) : 0.95;
    const dx = left + 5,
      dy = top - 5;
    R(ctx, dx, dy - 1, 3, 5, OUT);
    R(ctx, dx - 1, dy, 5, 3, OUT); // dot outline
    ctx.save();
    ctx.globalAlpha = pulse;
    ctx.shadowColor = sc;
    ctx.shadowBlur = 6;
    R(ctx, dx + 1, dy, 1, 1, sc);
    R(ctx, dx, dy + 1, 3, 1, sc);
    R(ctx, dx + 1, dy + 2, 1, 1, sc);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
}
function poseFor(status) {
  if (status === 'running') return 'type';
  if (status === 'done' || status === 'success') return 'read';
  return 'sit';
}
function PixelOffice({
  agents,
  height = 360,
  selectedId,
  onSelectAgent,
  animated = true,
  style
}) {
  const canvasRef = React.useRef(null);
  const wrapRef = React.useRef(null);
  const stateRef = React.useRef(null);
  const propsRef = React.useRef({});
  propsRef.current = {
    agents,
    selectedId,
    onSelectAgent,
    animated
  };

  // (re)build runtime agents when the agent list identity changes
  const sig = (agents || []).map(a => a.id + a.status).join('|');
  React.useEffect(() => {
    const list = (propsRef.current.agents || []).slice(0, 7);
    const rt = list.map((a, i) => {
      const seat = SEATS[i];
      const prev = stateRef.current && stateRef.current.find(p => p.id === a.id);
      return prev ? Object.assign(prev, {
        status: a.status,
        name: a.name,
        role: a.role
      }) : {
        id: a.id,
        name: a.name,
        role: a.role,
        status: a.status,
        seatIndex: i,
        seat,
        x: seat.col,
        y: seat.row,
        path: [],
        goal: 'seat',
        pose: poseFor(a.status),
        dir: 'down',
        pauseT: 0,
        wanderT: 4 + Math.random() * 10,
        skin: SKIN[i % SKIN.length],
        hair: HAIR[i * 2 % HAIR.length]
      };
    });
    stateRef.current = rt;
  }, [sig]);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = ART_W * SCALE;
    canvas.height = ART_H * SCALE;
    let raf,
      last = performance.now(),
      running = true;
    function update(dt, time) {
      const rt = stateRef.current || [];
      const anim = propsRef.current.animated;
      let walkers = rt.filter(a => a.path.length).length;
      for (const a of rt) {
        if (a.path.length) {
          const t = a.path[0];
          const dx = t.col - a.x,
            dy = t.row - a.y;
          const dist = Math.hypot(dx, dy);
          const sp = SPEED * dt;
          if (dist <= sp) {
            a.x = t.col;
            a.y = t.row;
            a.path.shift();
          } else {
            a.x += dx / dist * sp;
            a.y += dy / dist * sp;
          }
          if (Math.abs(dx) > Math.abs(dy)) a.dir = dx > 0 ? 'right' : 'left';else a.dir = dy > 0 ? 'down' : 'up';
          a.pose = 'walk';
          if (!a.path.length) {
            if (a.goal === 'hangout') {
              a.pauseT = 2 + Math.random() * 3;
              a.dir = 'down';
            } else {
              a.goal = 'seat';
              a.dir = 'down';
              a.wanderT = 10 + Math.random() * 12;
            }
          }
        } else if (a.goal === 'hangout' && a.pauseT > 0) {
          a.pose = 'idle';
          a.dir = 'down';
          a.pauseT -= dt;
          if (a.pauseT <= 0) {
            a.path = bfs({
              col: Math.round(a.x),
              row: Math.round(a.y)
            }, a.seat);
            a.goal = 'seat';
          }
        } else {
          a.x = a.seat.col;
          a.y = a.seat.row;
          a.dir = 'down';
          a.pose = poseFor(a.status);
          if (anim && a.status !== 'running' && a.status !== 'waiting' && walkers < 2) {
            a.wanderT -= dt;
            if (a.wanderT <= 0) {
              const h = HANGOUTS[Math.floor(Math.random() * HANGOUTS.length)];
              const p = bfs(a.seat, h);
              if (p.length) {
                a.path = p;
                a.goal = 'hangout';
                walkers++;
              } else a.wanderT = 6;
            }
          }
        }
      }
    }
    function draw(time) {
      ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      ctx.imageSmoothingEnabled = false;
      R(ctx, 0, 0, ART_W, ART_H, C.floorB);
      drawFloor(ctx);
      drawRug(ctx);
      drawWall(ctx);
      PLANTS.forEach(p => drawPlant(ctx, p));
      drawCoffee(ctx, time);
      const rt = stateRef.current || [];
      const seatOf = {};
      rt.forEach(a => {
        seatOf[a.seatIndex] = a;
      });
      // desks (with their seated agent's monitor color)
      DESKS.forEach((d, i) => {
        const occ = seatOf[i];
        const seated = occ && !occ.path.length && occ.goal === 'seat' && occ.pauseT <= 0;
        drawDesk(ctx, d, seated ? occ : null, time);
      });

      // characters sorted by y for depth
      const sel = propsRef.current.selectedId;
      [...rt].sort((a, b) => a.y - b.y).forEach(a => {
        const cx = a.x * TILE + 8;
        const feetY = a.y * TILE + 15;
        const frame = Math.floor(time * (a.pose === 'walk' ? 7 : 4)) % 2;
        if (a.id === sel) {
          ctx.save();
          ctx.strokeStyle = '#00B4D8';
          ctx.lineWidth = 1;
          ctx.shadowColor = '#00B4D8';
          ctx.shadowBlur = 6;
          ctx.strokeRect(cx - 7.5, feetY - 17.5, 15, 18);
          ctx.restore();
        }
        drawChar(ctx, cx, feetY, {
          shirt: ROLE_SHIRT[a.role] || '#9AA3B8',
          skin: a.skin,
          hair: a.hair,
          dir: a.dir,
          pose: a.pose,
          frame,
          status: a.status,
          time
        });
      });

      // CRT scanlines
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = '#fff';
      for (let y = 0; y < ART_H; y += 3) ctx.fillRect(0, y, ART_W, 1);
      ctx.globalAlpha = 1;
      // vignette
      const g = ctx.createRadialGradient(ART_W / 2, ART_H / 2, ART_H / 3, ART_W / 2, ART_H / 2, ART_H);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(0,0,0,0.45)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, ART_W, ART_H);
    }
    function loop(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const time = now / 1000;
      if (propsRef.current.animated) update(dt, time);
      draw(time);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, []);
  function handleClick(e) {
    const onSel = propsRef.current.onSelectAgent;
    if (!onSel) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ax = (e.clientX - rect.left) / rect.width * ART_W;
    const ay = (e.clientY - rect.top) / rect.height * ART_H;
    const rt = stateRef.current || [];
    let best = null,
      bd = 14;
    for (const a of rt) {
      const cx = a.x * TILE + 8,
        cy = a.y * TILE + 7;
      const d = Math.hypot(ax - cx, ay - cy);
      if (d < bd) {
        bd = d;
        best = a;
      }
    }
    if (best) onSel(best);
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: wrapRef,
    style: {
      position: 'relative',
      width: '100%',
      height,
      overflow: 'hidden',
      background: '#0A0F1C',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    onClick: handleClick,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      imageRendering: 'pixelated',
      cursor: propsRef.current.onSelectAgent ? 'pointer' : 'default'
    }
  }));
}
Object.assign(__ds_scope, { PixelOffice });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/scene/PixelOffice.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agentflow/AgentDetail.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// AgentFlow — Agent Detail screen (Code Agent).
const DSad = window.AgentFlowDesignSystem_98d862;
const TASKS = [{
  label: 'Analyze codebase structure',
  state: 'done'
}, {
  label: 'Generate PR summary',
  state: 'done'
}, {
  label: 'Generate unit tests',
  state: 'current'
}, {
  label: 'Refactor auth module',
  state: 'pending'
}, {
  label: 'Update API docs',
  state: 'pending'
}];
const DETAIL_LOG = [{
  time: '09:40:31',
  level: 'info',
  message: 'Agent boot — model claude-sonnet-4-6'
}, {
  time: '09:40:48',
  level: 'info',
  message: 'Analyzed 142 files, 28k LOC'
}, {
  time: '09:41:02',
  level: 'info',
  message: 'PR summary committed to #482'
}, {
  time: '09:41:07',
  level: 'warn',
  message: 'Test fixture missing for authGuard()'
}, {
  time: '09:41:12',
  level: 'info',
  message: 'Generating unit tests (8/14)…'
}];
function TaskRow({
  t
}) {
  const map = {
    done: {
      glyph: '✓',
      color: 'var(--text-muted)',
      text: 'var(--text-muted)',
      deco: 'line-through'
    },
    current: {
      glyph: '→',
      color: 'var(--status-running)',
      text: 'var(--text-primary)',
      deco: 'none'
    },
    pending: {
      glyph: '○',
      color: 'var(--text-muted)',
      text: 'var(--text-muted)',
      deco: 'none'
    }
  };
  const m = map[t.state];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 11,
      padding: '8px 10px',
      background: t.state === 'current' ? 'rgba(0,229,160,0.07)' : 'transparent',
      borderLeft: `2px solid ${t.state === 'current' ? 'var(--status-running)' : 'transparent'}`,
      fontFamily: 'var(--font-mono)',
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: m.color,
      width: 14
    }
  }, m.glyph), /*#__PURE__*/React.createElement("span", {
    style: {
      color: m.text,
      textDecoration: m.deco,
      opacity: t.state === 'pending' ? 0.6 : 1
    }
  }, t.label), t.state === 'current' && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: 10,
      color: 'var(--status-running)',
      textTransform: 'uppercase',
      letterSpacing: '.1em'
    }
  }, "Current"));
}
function Sparkline({
  data,
  color = 'var(--brand)'
}) {
  const w = 200,
    h = 40,
    max = Math.max(...data);
  const pts = data.map((d, i) => `${i / (data.length - 1) * w},${h - d / max * (h - 4) - 2}`).join(' ');
  return /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: h,
    viewBox: `0 0 ${w} ${h}`,
    preserveAspectRatio: "none",
    style: {
      display: 'block',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    points: pts,
    fill: "none",
    stroke: color,
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: `0,${h} ${pts} ${w},${h}`,
    fill: color,
    opacity: "0.12"
  }));
}
function AgentDetail({
  onBack
}) {
  const [filter, setFilter] = React.useState('ALL');
  const shown = DETAIL_LOG.filter(l => filter === 'ALL' || l.level === filter.toLowerCase());
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      padding: 20,
      overflow: 'auto',
      height: '100%',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      alignSelf: 'flex-start',
      background: 'none',
      border: 'none',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '.1em',
      cursor: 'pointer',
      padding: 0
    }
  }, "\u2039 Back to Dashboard"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '.12em',
      marginBottom: 4
    }
  }, "AGT-014 \xB7 \uD83D\uDCBB Developer"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 44,
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)',
      lineHeight: 1
    }
  }, "Code Agent"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--text-secondary)',
      marginTop: 8
    }
  }, "Handles code generation and PR summaries.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(DSad.Button, {
    variant: "secondary",
    icon: "\u23F8"
  }, "Pause"), /*#__PURE__*/React.createElement(DSad.Button, {
    variant: "secondary",
    icon: "\u21BA"
  }, "Retry"), /*#__PURE__*/React.createElement(DSad.Button, {
    variant: "secondary",
    icon: "\u2699"
  }, "Config"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(DSad.StatusBadge, {
    status: "running",
    size: "lg"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "Runtime: 4m 12s"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement(DSad.ProgressBar, {
    value: 65,
    status: "running",
    height: 6,
    showLabel: true
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(DSad.Panel, {
    title: "Task List",
    meta: "2 / 5 done",
    padding: 6
  }, TASKS.map((t, i) => /*#__PURE__*/React.createElement(TaskRow, {
    key: i,
    t: t
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(DSad.StatCard, {
    label: "Tokens used",
    value: "12,450",
    sub: "of 50,000",
    bar: 25,
    accent: "var(--brand)",
    style: {
      gridColumn: '1 / -1'
    }
  }), /*#__PURE__*/React.createElement(DSad.Panel, {
    padding: 14,
    style: {
      gridColumn: '1 / -1'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: '.12em',
      color: 'var(--text-muted)'
    }
  }, "Token rate / min"), /*#__PURE__*/React.createElement(Sparkline, {
    data: [3, 6, 4, 8, 7, 11, 9, 14, 12, 16],
    color: "var(--brand)"
  })), /*#__PURE__*/React.createElement(DSad.StatCard, {
    label: "Avg run time",
    value: "3m 24s"
  }), /*#__PURE__*/React.createElement(DSad.StatCard, {
    label: "Success rate",
    value: "94%",
    accent: "var(--status-done)"
  }))), /*#__PURE__*/React.createElement(DSad.Panel, {
    title: "Activity Log",
    meta: /*#__PURE__*/React.createElement(DSad.Tabs, {
      variant: "filter",
      tabs: ['ALL', 'INFO', 'WARN', 'ERROR'],
      value: filter,
      onChange: setFilter
    }),
    scanlines: true,
    padding: 0
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 4px'
    }
  }, shown.map((l, i) => /*#__PURE__*/React.createElement(DSad.LogLine, _extends({
    key: i
  }, l, {
    lineNo: i + 1,
    current: i === shown.length - 1
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      padding: '6px 12px',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--status-running)'
    }
  }, "\u25BE auto-scroll"))));
}
Object.assign(window, {
  AgentDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agentflow/AgentDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agentflow/Dashboard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// AgentFlow — Main Dashboard screen.
const DSd = window.AgentFlowDesignSystem_98d862;
function PipelineFlow() {
  const roleColor = {
    pm: 'var(--role-pm)',
    techlead: 'var(--role-techlead)',
    dev: 'var(--role-dev)',
    notifier: 'var(--role-notifier)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'stretch',
      gap: 0
    }
  }, window.PIPELINE.map((n, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: n.id
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      background: 'var(--bg-elevated)',
      border: `1px solid ${n.status === 'running' ? 'var(--status-running)' : 'var(--border)'}`,
      borderTop: `2px solid ${roleColor[n.role]}`,
      borderRadius: 'var(--radius-sm)',
      padding: '12px 14px',
      boxShadow: n.status === 'running' ? 'var(--glow-running)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 14,
      color: 'var(--text-primary)',
      marginBottom: 8,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, n.name), /*#__PURE__*/React.createElement(DSd.StatusBadge, {
    status: n.status,
    size: "sm"
  }), n.lastRun && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)'
    }
  }, "Last run: ", n.lastRun)), i < window.PIPELINE.length - 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      width: 36,
      display: 'grid',
      placeItems: 'center',
      color: n.status === 'done' ? 'var(--status-done)' : 'var(--text-muted)',
      fontSize: 16
    }
  }, "\u2192"))));
}
function Dashboard({
  onOpenAgent
}) {
  const DASH = window.AgentFlowDesignSystem_98d862;
  const running = window.AGENTS.filter(a => a.status === 'running').length;
  const done = window.AGENTS.filter(a => a.status === 'done').length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      padding: 20,
      overflow: 'auto',
      height: '100%',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(DSd.StatCard, {
    label: "Active Agents",
    value: `${running} / 7`,
    accent: "var(--status-running)"
  }), /*#__PURE__*/React.createElement(DSd.StatCard, {
    label: "Completed",
    value: String(done),
    accent: "var(--status-done)"
  }), /*#__PURE__*/React.createElement(DSd.StatCard, {
    label: "Tasks Done",
    value: "26 / 39",
    bar: 67,
    accent: "var(--brand)"
  }), /*#__PURE__*/React.createElement(DSd.StatCard, {
    label: "Status",
    value: "On Track",
    accent: "var(--status-running)"
  })), /*#__PURE__*/React.createElement(DSd.Panel, {
    title: "Live Office",
    meta: "Click an agent",
    style: {
      flexShrink: 0
    },
    padding: 0,
    bodyStyle: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(DASH.PixelOffice, {
    agents: window.OFFICE_AGENTS,
    height: 232,
    onSelectAgent: () => onOpenAgent && onOpenAgent(),
    style: {
      border: 'none',
      borderRadius: 0
    }
  })), /*#__PURE__*/React.createElement(DSd.Panel, {
    title: "Pipeline Overview",
    meta: "My Dev Pipeline",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(PipelineFlow, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 16,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
      alignContent: 'start'
    }
  }, window.AGENTS.map(a => /*#__PURE__*/React.createElement(DSd.AgentCard, _extends({
    key: a.agentId
  }, a, {
    selected: a.agentId === 'AGT-014',
    onClick: () => onOpenAgent && onOpenAgent(a)
  })))), /*#__PURE__*/React.createElement(DSd.Panel, {
    title: "Activity Log",
    meta: `${window.LOG.length} entries`,
    scanlines: true,
    padding: 0,
    style: {
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 4px',
      overflow: 'auto',
      maxHeight: 320
    }
  }, window.LOG.map((l, i) => /*#__PURE__*/React.createElement(DSd.LogLine, _extends({
    key: i
  }, l, {
    lineNo: i + 1,
    current: i === window.LOG.length - 1
  })))))));
}
Object.assign(window, {
  Dashboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agentflow/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agentflow/Office.jsx
try { (() => {
// AgentFlow — Pixel Office screen. Live animated office + agent roster.
const DSo = window.AgentFlowDesignSystem_98d862;
const ROLE_GLYPH = {
  po: '📋',
  pm: '📅',
  techlead: '🏗️',
  dev: '💻',
  qa: '🧪',
  devops: '⚙️',
  notifier: '🔔'
};
function Office({
  onOpenAgent
}) {
  const agents = window.OFFICE_AGENTS;
  const [sel, setSel] = React.useState(null);
  const selected = sel && agents.find(a => a.id === sel.id);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 280px',
      gap: 16,
      padding: 20,
      height: '100%',
      boxSizing: 'border-box',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 24,
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)'
    }
  }, "The Office"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '.12em',
      marginTop: 3
    }
  }, "7 agents \xB7 live scene")), /*#__PURE__*/React.createElement(DSo.StatusBadge, {
    status: "running",
    label: "2 Running"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(DSo.PixelOffice, {
    agents: agents,
    height: "100%",
    selectedId: selected && selected.id,
    onSelectAgent: setSel,
    style: {
      height: '100%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-muted)',
      flexShrink: 0
    }
  }, "\u25B8 Click a character to inspect. Idle agents wander to the coffee machine. Typing = running \xB7 ? bubble = waiting \xB7 ! = error.")), /*#__PURE__*/React.createElement(DSo.Panel, {
    title: selected ? 'Agent' : 'Roster',
    style: {
      minHeight: 0
    },
    bodyStyle: {
      overflow: 'auto'
    }
  }, !selected ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, agents.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.id,
    onClick: () => setSel(a),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 10px',
      textAlign: 'left',
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, ROLE_GLYPH[a.role]), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 13,
      color: 'var(--text-primary)'
    }
  }, a.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '.1em'
    }
  }, a.id)), /*#__PURE__*/React.createElement(DSo.StatusBadge, {
    status: a.status,
    size: "sm",
    label: ""
  })))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setSel(null),
    style: {
      alignSelf: 'flex-start',
      background: 'none',
      border: 'none',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '.1em',
      cursor: 'pointer',
      padding: 0
    }
  }, "\u2039 All agents"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30
    }
  }, ROLE_GLYPH[selected.role]), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '.12em'
    }
  }, selected.id), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 22,
      color: 'var(--text-primary)',
      marginTop: 2
    }
  }, selected.name)), /*#__PURE__*/React.createElement(DSo.StatusBadge, {
    status: selected.status
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border)'
    }
  }), /*#__PURE__*/React.createElement(DSo.Button, {
    variant: "brand",
    onClick: () => onOpenAgent && onOpenAgent(selected)
  }, "Open Detail"))));
}
Object.assign(window, {
  Office
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agentflow/Office.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agentflow/PipelineBuilder.jsx
try { (() => {
// AgentFlow — Pipeline Builder screen.
const DSp = window.AgentFlowDesignSystem_98d862;
const PALETTE = [{
  role: 'po',
  label: 'PO Agent',
  glyph: '📋'
}, {
  role: 'pm',
  label: 'PM Agent',
  glyph: '📅'
}, {
  role: 'techlead',
  label: 'Tech Lead',
  glyph: '🏗️'
}, {
  role: 'dev',
  label: 'Developer',
  glyph: '💻'
}, {
  role: 'qa',
  label: 'QA Agent',
  glyph: '🧪'
}, {
  role: 'devops',
  label: 'DevOps',
  glyph: '⚙️'
}, {
  role: 'notifier',
  label: 'Notifier',
  glyph: '🔔'
}];
const ROLEVAR = {
  po: '--role-po',
  pm: '--role-pm',
  techlead: '--role-techlead',
  dev: '--role-dev',
  qa: '--role-qa',
  devops: '--role-devops',
  notifier: '--role-notifier'
};
const NODES = [{
  id: 'po',
  name: 'PO Agent',
  role: 'po',
  status: 'done',
  x: 40,
  y: 60,
  lastRun: '6 min ago'
}, {
  id: 'dev',
  name: 'Dev Agent',
  role: 'dev',
  status: 'running',
  x: 290,
  y: 150,
  lastRun: null
}, {
  id: 'qa',
  name: 'QA Agent',
  role: 'qa',
  status: 'waiting',
  x: 540,
  y: 80,
  lastRun: null
}, {
  id: 'notify',
  name: 'Notifier',
  role: 'notifier',
  status: 'idle',
  x: 540,
  y: 250,
  lastRun: null
}];
const EDGES = [['po', 'dev'], ['dev', 'qa'], ['dev', 'notify']];
function PaletteCard({
  item
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '9px 11px',
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderLeft: `2px solid var(${ROLEVAR[item.role]})`,
      borderRadius: 'var(--radius-sm)',
      cursor: 'grab',
      userSelect: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, item.glyph), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 13,
      color: 'var(--text-primary)'
    }
  }, item.label), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      color: 'var(--text-muted)',
      fontSize: 13
    }
  }, "\u22EE\u22EE"));
}
function Node({
  n,
  selected,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      position: 'absolute',
      left: n.x,
      top: n.y,
      width: 178,
      cursor: 'pointer',
      background: selected ? 'var(--bg-elevated)' : 'var(--bg-surface)',
      border: `${selected ? 2 : 1}px solid ${selected ? 'var(--status-running)' : 'var(--border-strong)'}`,
      borderTop: `2px solid var(${ROLEVAR[n.role]})`,
      borderRadius: 'var(--radius-md)',
      padding: 12,
      boxShadow: selected ? 'var(--glow-running)' : 'var(--shadow-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 13,
      color: 'var(--text-primary)'
    }
  }, n.name), /*#__PURE__*/React.createElement(DSp.StatusBadge, {
    status: n.status,
    size: "sm",
    label: ""
  })), /*#__PURE__*/React.createElement(DSp.ProgressBar, {
    value: n.status === 'done' ? 100 : n.status === 'running' ? 64 : n.status === 'waiting' ? 30 : 0,
    status: n.status === 'success' ? 'done' : n.status
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-muted)'
    }
  }, n.lastRun ? `Last run: ${n.lastRun}` : n.status === 'running' ? 'In progress…' : 'Not yet run'));
}
function Edges({
  sel
}) {
  const cx = n => n.x + 89,
    cy = n => n.y + 44;
  const byId = Object.fromEntries(NODES.map(n => [n.id, n]));
  return /*#__PURE__*/React.createElement("svg", {
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none'
    }
  }, EDGES.map(([a, b]) => {
    const A = byId[a],
      B = byId[b];
    const active = A.status === 'done' || A.status === 'running';
    const x1 = A.x + 178,
      y1 = cy(A),
      x2 = B.x,
      y2 = cy(B);
    const mx = (x1 + x2) / 2;
    return /*#__PURE__*/React.createElement("g", {
      key: a + b
    }, /*#__PURE__*/React.createElement("path", {
      d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`,
      fill: "none",
      stroke: active ? 'var(--status-running)' : 'var(--border-strong)',
      strokeWidth: "1.5",
      strokeDasharray: active ? '0' : '5 5',
      opacity: active ? 0.9 : 0.6
    }), /*#__PURE__*/React.createElement("circle", {
      cx: x2,
      cy: y2,
      r: "3",
      fill: active ? 'var(--status-running)' : 'var(--text-muted)'
    }));
  }));
}
function PipelineBuilder() {
  const [sel, setSel] = React.useState('dev');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 52,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '0 16px',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '.12em',
      color: 'var(--text-muted)'
    }
  }, "Pipeline:"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 15,
      color: 'var(--text-primary)',
      borderBottom: '1px dashed var(--border-strong)',
      paddingBottom: 2
    }
  }, "My Dev Pipeline"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(DSp.Button, {
    variant: "primary",
    icon: "\u25B6"
  }, "Run All"), /*#__PURE__*/React.createElement(DSp.Button, {
    variant: "secondary",
    icon: "\u23F8"
  }, "Pause"), /*#__PURE__*/React.createElement(DSp.Button, {
    variant: "ghost"
  }, "Clear"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flex: 1,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 220,
      flexShrink: 0,
      borderRight: '1px solid var(--border)',
      background: 'var(--bg-surface)',
      padding: 14,
      overflow: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '.12em',
      color: 'var(--text-muted)',
      marginBottom: 12
    }
  }, "Agent Palette"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, PALETTE.map(p => /*#__PURE__*/React.createElement(PaletteCard, {
    key: p.role,
    item: p
  })))), /*#__PURE__*/React.createElement("div", {
    className: "af-grid",
    style: {
      position: 'relative',
      flex: 1,
      minWidth: 0,
      overflow: 'hidden',
      background: 'var(--bg-base)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "af-grid",
    style: {
      position: 'absolute',
      inset: 0
    }
  }), /*#__PURE__*/React.createElement(Edges, {
    sel: sel
  }), NODES.map(n => /*#__PURE__*/React.createElement(Node, {
    key: n.id,
    n: n,
    selected: sel === n.id,
    onClick: () => setSel(n.id)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      flexShrink: 0,
      borderLeft: '1px solid var(--border)',
      background: 'var(--bg-surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      writingMode: 'vertical-rl',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '.16em',
      color: 'var(--text-muted)'
    }
  }, "Properties \u203A"))));
}
Object.assign(window, {
  PipelineBuilder
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agentflow/PipelineBuilder.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agentflow/QAView.jsx
try { (() => {
// AgentFlow — QA Engineer role view.
const DSqa = window.AgentFlowDesignSystem_98d862;
const ROLE_TABS = [{
  id: 'po',
  label: 'PO'
}, {
  id: 'pm',
  label: 'PM'
}, {
  id: 'tl',
  label: 'Tech Lead'
}, {
  id: 'dev',
  label: 'Developer'
}, {
  id: 'qa',
  label: 'QA'
}, {
  id: 'devops',
  label: 'DevOps'
}];
const BUGS = [{
  sev: 'HIGH',
  text: 'Auth token not invalidated on logout'
}, {
  sev: 'MED',
  text: 'Race condition in async task queue'
}, {
  sev: 'LOW',
  text: 'Missing error boundary in sidebar'
}];
const RESULTS = [{
  name: 'auth.login.spec.ts',
  status: 'done',
  dur: '1.24s',
  by: 'Test Agent'
}, {
  name: 'auth.logout.spec.ts',
  status: 'error',
  dur: '0.98s',
  by: 'Test Agent'
}, {
  name: 'queue.concurrency.spec.ts',
  status: 'waiting',
  dur: '—',
  by: 'Test Agent'
}, {
  name: 'sidebar.render.spec.ts',
  status: 'done',
  dur: '0.41s',
  by: 'Dev Agent'
}, {
  name: 'api.ratelimit.spec.ts',
  status: 'done',
  dur: '2.07s',
  by: 'Test Agent'
}];
const RES_LABEL = {
  done: 'PASS',
  error: 'FAIL',
  waiting: 'PENDING'
};
function QAView() {
  const [role, setRole] = React.useState('qa');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      padding: 20,
      overflow: 'auto',
      height: '100%',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement(DSqa.Tabs, {
    tabs: ROLE_TABS,
    value: role,
    onChange: setRole,
    accent: "var(--role-qa)",
    style: {
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 12,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(DSqa.StatCard, {
    label: "Test Coverage",
    value: "84%",
    accent: "var(--role-qa)",
    bar: 84
  }), /*#__PURE__*/React.createElement(DSqa.StatCard, {
    label: "Tests Generated",
    value: "142"
  }), /*#__PURE__*/React.createElement(DSqa.StatCard, {
    label: "Bugs Found",
    value: "7",
    accent: "var(--status-error)"
  }), /*#__PURE__*/React.createElement(DSqa.StatCard, {
    label: "Flaky Tests",
    value: "2",
    accent: "var(--status-waiting)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(DSqa.Panel, {
    accent: "var(--role-qa)",
    padding: 16,
    style: {
      borderLeft: '2px solid var(--role-qa)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: '.12em',
      color: 'var(--text-muted)'
    }
  }, "AGT-021 \xB7 \uD83E\uDDEA QA"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 22,
      color: 'var(--text-primary)',
      marginTop: 3
    }
  }, "Test Agent")), /*#__PURE__*/React.createElement(DSqa.StatusBadge, {
    status: "running"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-secondary)',
      margin: '12px 0'
    }
  }, "Generating Playwright tests for the ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-primary)'
    }
  }, "auth module"), " \u2014 8 / 14 tasks done."), /*#__PURE__*/React.createElement(DSqa.ProgressBar, {
    value: 58,
    status: "waiting"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      background: 'var(--bg-sunken)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: '6px 4px'
    }
  }, /*#__PURE__*/React.createElement(DSqa.LogLine, {
    time: "09:41:07",
    level: "info",
    message: "Spawned 4 test workers"
  }), /*#__PURE__*/React.createElement(DSqa.LogLine, {
    time: "09:41:10",
    level: "warn",
    message: "authGuard() fixture missing \u2014 stubbed"
  }), /*#__PURE__*/React.createElement(DSqa.LogLine, {
    time: "09:41:14",
    level: "info",
    message: "auth.login \u2192 PASS (1.24s)",
    current: true
  }))), /*#__PURE__*/React.createElement(DSqa.Panel, {
    title: "Bug Summary",
    meta: "3 open"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, BUGS.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      paddingBottom: 10,
      borderBottom: i < BUGS.length - 1 ? '1px solid var(--border)' : 'none'
    }
  }, /*#__PURE__*/React.createElement(DSqa.Tag, {
    severity: b.sev
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-primary)'
    }
  }, b.text), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--role-qa)',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    }
  }, "View \u2192")))))), /*#__PURE__*/React.createElement(DSqa.Panel, {
    title: "Test Results",
    meta: `${RESULTS.length} tests`,
    padding: 0
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-mono)',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      textAlign: 'left',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '.1em'
    }
  }, ['Test Name', 'Status', 'Duration', 'Triggered by'].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      padding: '9px 16px',
      fontWeight: 500,
      fontSize: 10,
      borderBottom: '1px solid var(--border)'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, RESULTS.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    style: {
      borderBottom: i < RESULTS.length - 1 ? '1px solid var(--border)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '9px 16px',
      color: 'var(--text-primary)'
    }
  }, r.name), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '9px 16px'
    }
  }, /*#__PURE__*/React.createElement(DSqa.Tag, {
    tone: r.status === 'done' ? 'done' : r.status === 'error' ? 'error' : 'waiting'
  }, RES_LABEL[r.status])), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '9px 16px',
      color: 'var(--text-secondary)'
    }
  }, r.dur), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '9px 16px',
      color: 'var(--text-muted)'
    }
  }, r.by)))))));
}
Object.assign(window, {
  QAView
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agentflow/QAView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agentflow/Settings.jsx
try { (() => {
// AgentFlow — Settings screen.
const DSs = window.AgentFlowDesignSystem_98d862;
const SECTIONS = [{
  id: 'api',
  label: 'Claude API'
}, {
  id: 'defaults',
  label: 'Agent Defaults'
}, {
  id: 'notif',
  label: 'Notifications'
}, {
  id: 'appearance',
  label: 'Appearance'
}, {
  id: 'danger',
  label: 'Danger Zone'
}];
function Divider() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border)',
      margin: '24px 0'
    }
  });
}
function GroupTitle({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 16,
      color: 'var(--text-primary)',
      marginBottom: 16
    }
  }, children);
}
function SegToggle({
  options,
  value,
  onChange,
  accent = 'var(--brand)'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden'
    }
  }, options.map(o => {
    const on = o === value;
    return /*#__PURE__*/React.createElement("button", {
      key: o,
      onClick: () => onChange(o),
      style: {
        padding: '7px 14px',
        background: on ? 'var(--bg-elevated)' : 'transparent',
        border: 'none',
        borderRight: '1px solid var(--border)',
        color: on ? accent : 'var(--text-muted)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '.08em',
        cursor: 'pointer'
      }
    }, o);
  }));
}
function Row({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '10px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-primary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, children));
}
function Settings() {
  const [section, setSection] = React.useState('api');
  const [show, setShow] = React.useState(false);
  const [model, setModel] = React.useState('claude-sonnet-4-6');
  const [tokens, setTokens] = React.useState(4096);
  const [temp, setTemp] = React.useState(0.2);
  const [timeout, setTimeoutV] = React.useState('30');
  const [slack, setSlack] = React.useState(true);
  const [line, setLine] = React.useState(false);
  const [email, setEmail] = React.useState(false);
  const [theme, setTheme] = React.useState('Dark');
  const [pixel, setPixel] = React.useState(true);
  const [fontSize, setFontSize] = React.useState('Medium');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100%',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 200,
      flexShrink: 0,
      borderRight: '1px solid var(--border)',
      background: 'var(--bg-surface)',
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '.12em',
      color: 'var(--text-muted)',
      marginBottom: 14,
      paddingLeft: 10
    }
  }, "Settings"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, SECTIONS.map(s => {
    const on = section === s.id;
    const danger = s.id === 'danger';
    return /*#__PURE__*/React.createElement("button", {
      key: s.id,
      onClick: () => setSection(s.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '9px 10px',
        textAlign: 'left',
        background: on ? 'var(--bg-elevated)' : 'transparent',
        border: 'none',
        borderLeft: `2px solid ${on ? danger ? 'var(--status-error)' : 'var(--brand)' : 'transparent'}`,
        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
        color: on ? danger ? 'var(--status-error)' : 'var(--text-primary)' : 'var(--text-muted)',
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 8,
        color: on ? danger ? 'var(--status-error)' : 'var(--brand)' : 'var(--text-muted)'
      }
    }, on ? '●' : '○'), s.label);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      overflow: 'auto',
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement(GroupTitle, null, "Claude API"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(DSs.Input, {
    label: "API Key",
    type: show ? 'text' : 'password',
    value: "sk-ant-api03-x7Kq92mNvR4pLs8w",
    addon: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DSs.Button, {
      size: "md",
      variant: "ghost",
      onClick: () => setShow(s => !s)
    }, show ? 'Hide' : 'Show'), /*#__PURE__*/React.createElement(DSs.Button, {
      size: "md"
    }, "Test"))
  }), /*#__PURE__*/React.createElement(DSs.Select, {
    label: "Model",
    value: model,
    onChange: e => setModel(e.target.value),
    options: [{
      value: 'claude-sonnet-4-6',
      label: 'claude-sonnet-4-6 (recommended)'
    }, {
      value: 'claude-opus-4-8',
      label: 'claude-opus-4-8 (powerful)'
    }, {
      value: 'claude-haiku-4-2',
      label: 'claude-haiku-4-2 (fast)'
    }]
  }), /*#__PURE__*/React.createElement(DSs.Slider, {
    label: "Max Tokens per Agent Run",
    value: tokens,
    min: 1024,
    max: 16384,
    step: 512,
    onChange: e => setTokens(+e.target.value),
    format: v => `${v.toLocaleString()} tokens`
  }), /*#__PURE__*/React.createElement(DSs.Slider, {
    label: "Temperature",
    value: temp,
    min: 0,
    max: 1,
    step: 0.1,
    onChange: e => setTemp(+e.target.value),
    accent: "var(--status-running)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 160
    }
  }, /*#__PURE__*/React.createElement(DSs.Input, {
    label: "Request Timeout",
    value: timeout,
    onChange: e => setTimeoutV(e.target.value),
    addon: /*#__PURE__*/React.createElement("span", {
      style: {
        alignSelf: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--text-muted)'
      }
    }, "sec")
  }))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(GroupTitle, null, "Notifications"), /*#__PURE__*/React.createElement(Row, {
    label: "Slack"
  }, /*#__PURE__*/React.createElement(DSs.Switch, {
    checked: slack,
    onChange: setSlack
  }), slack && /*#__PURE__*/React.createElement(DSs.Input, {
    value: "https://hooks.slack.com/services/T0\u2026",
    mono: true,
    style: {
      width: 240
    }
  })), /*#__PURE__*/React.createElement(Row, {
    label: "LINE"
  }, /*#__PURE__*/React.createElement(DSs.Switch, {
    checked: line,
    onChange: setLine
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Email"
  }, /*#__PURE__*/React.createElement(DSs.Switch, {
    checked: email,
    onChange: setEmail
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(GroupTitle, null, "Appearance"), /*#__PURE__*/React.createElement(Row, {
    label: "Theme"
  }, /*#__PURE__*/React.createElement(SegToggle, {
    options: ['Dark', 'Light'],
    value: theme,
    onChange: setTheme
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Pixel Art Scene"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "Show office scene in dashboard"), /*#__PURE__*/React.createElement(DSs.Switch, {
    checked: pixel,
    onChange: setPixel
  })), /*#__PURE__*/React.createElement(Row, {
    label: "Font Size"
  }, /*#__PURE__*/React.createElement(SegToggle, {
    options: ['Small', 'Medium', 'Large'],
    value: fontSize,
    onChange: setFontSize
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid rgba(255,77,109,0.4)',
      borderRadius: 'var(--radius-md)',
      padding: 18,
      background: 'var(--status-error-bg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 15,
      color: 'var(--status-error)',
      marginBottom: 6
    }
  }, "Danger Zone"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-secondary)',
      marginBottom: 14
    }
  }, "These actions cannot be undone."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(DSs.Button, {
    variant: "danger"
  }, "Reset All Agent Data"), /*#__PURE__*/React.createElement(DSs.Button, {
    variant: "danger"
  }, "Clear Run History"))))));
}
Object.assign(window, {
  Settings
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agentflow/Settings.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agentflow/Shell.jsx
try { (() => {
// AgentFlow app — shared chrome (top bar + sidebar) and seed data.
// Composes DS components; exposes everything on window for sibling scripts.

const DS = window.AgentFlowDesignSystem_98d862;
function Logo({
  size = 18
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      display: 'grid',
      placeItems: 'center',
      background: 'var(--brand)',
      color: 'var(--text-inverse)',
      borderRadius: 4,
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 14,
      boxShadow: 'var(--glow-brand)'
    }
  }, "A"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: size,
      letterSpacing: '-0.02em',
      color: 'var(--text-primary)'
    }
  }, "AgentFlow"));
}
function TopBar({
  online = true,
  right
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 48,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, right, /*#__PURE__*/React.createElement(DS.StatusBadge, {
    status: online ? 'running' : 'idle',
    label: online ? 'System Online' : 'Offline'
  })));
}
const NAV = [{
  id: 'dashboard',
  label: 'Dashboard',
  glyph: '◧'
}, {
  id: 'office',
  label: 'Office',
  glyph: '🏢'
}, {
  id: 'pipeline',
  label: 'Pipeline',
  glyph: '⛓'
}, {
  id: 'agent',
  label: 'Agents',
  glyph: '💻'
}, {
  id: 'qa',
  label: 'QA View',
  glyph: '🧪'
}, {
  id: 'settings',
  label: 'Settings',
  glyph: '⚙'
}];
function SideNav({
  active,
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      width: 64,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      padding: '12px 0',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)'
    }
  }, NAV.map(n => {
    const on = active === n.id;
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => onNavigate(n.id),
      title: n.label,
      style: {
        width: 44,
        height: 44,
        display: 'grid',
        placeItems: 'center',
        background: on ? 'var(--bg-elevated)' : 'transparent',
        border: `1px solid ${on ? 'var(--brand)' : 'transparent'}`,
        borderRadius: 'var(--radius-sm)',
        color: on ? 'var(--brand)' : 'var(--text-muted)',
        fontSize: 18,
        cursor: 'pointer',
        boxShadow: on ? '0 0 10px rgba(0,180,216,0.25)' : 'none',
        transition: 'all 120ms ease'
      }
    }, n.glyph);
  }));
}

// ---- Seed data ----
const AGENTS = [{
  agentId: 'AGT-001',
  name: 'Spec Agent',
  role: 'po',
  status: 'done',
  progress: 100,
  tasksDone: 6,
  tasksTotal: 6,
  description: 'Writes specs and acceptance criteria from the backlog.'
}, {
  agentId: 'AGT-007',
  name: 'Planner Agent',
  role: 'pm',
  status: 'waiting',
  progress: 40,
  tasksDone: 2,
  tasksTotal: 5,
  description: 'Sequences sprints and assigns work to delivery agents.'
}, {
  agentId: 'AGT-014',
  name: 'Code Agent',
  role: 'dev',
  status: 'running',
  progress: 72,
  tasksDone: 10,
  tasksTotal: 14,
  description: 'Handles code generation and PR summaries.'
}, {
  agentId: 'AGT-021',
  name: 'Test Agent',
  role: 'qa',
  status: 'running',
  progress: 58,
  tasksDone: 8,
  tasksTotal: 14,
  description: 'Generates Playwright tests and triages bugs.'
}];
const PIPELINE = [{
  id: 'fetch',
  name: 'Data Fetcher',
  role: 'pm',
  status: 'done',
  lastRun: '4 min ago'
}, {
  id: 'analyze',
  name: 'Analyzer',
  role: 'techlead',
  status: 'done',
  lastRun: '2 min ago'
}, {
  id: 'write',
  name: 'Report Writer',
  role: 'dev',
  status: 'running',
  lastRun: null
}, {
  id: 'notify',
  name: 'Notifier',
  role: 'notifier',
  status: 'idle',
  lastRun: null
}];
const LOG = [{
  time: '09:41:02',
  level: 'info',
  agent: 'Code',
  message: 'Fetching records from API…'
}, {
  time: '09:41:05',
  level: 'warn',
  agent: 'Code',
  message: 'Rate limit warning: 80% of quota used'
}, {
  time: '09:41:07',
  level: 'info',
  agent: 'Test',
  message: 'Generating Playwright tests for auth module'
}, {
  time: '09:41:09',
  level: 'info',
  agent: 'Spec',
  message: 'Acceptance criteria committed (6/6)'
}, {
  time: '09:41:12',
  level: 'error',
  agent: 'Code',
  message: 'Connection refused: localhost:5432 — retrying (1/3)'
}];

// Full 7-role roster for the pixel office.
const OFFICE_AGENTS = [{
  id: 'AGT-001',
  name: 'Spec Agent',
  role: 'po',
  status: 'done'
}, {
  id: 'AGT-007',
  name: 'Planner Agent',
  role: 'pm',
  status: 'waiting'
}, {
  id: 'AGT-009',
  name: 'Arch Agent',
  role: 'techlead',
  status: 'idle'
}, {
  id: 'AGT-014',
  name: 'Code Agent',
  role: 'dev',
  status: 'running'
}, {
  id: 'AGT-021',
  name: 'Test Agent',
  role: 'qa',
  status: 'running'
}, {
  id: 'AGT-028',
  name: 'Deploy Agent',
  role: 'devops',
  status: 'idle'
}, {
  id: 'AGT-033',
  name: 'Notifier',
  role: 'notifier',
  status: 'done'
}];
Object.assign(window, {
  Logo,
  TopBar,
  SideNav,
  NAV,
  AGENTS,
  PIPELINE,
  LOG,
  OFFICE_AGENTS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agentflow/Shell.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AgentCard = __ds_scope.AgentCard;

__ds_ns.LogLine = __ds_scope.LogLine;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Slider = __ds_scope.Slider;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.PixelOffice = __ds_scope.PixelOffice;

})();
