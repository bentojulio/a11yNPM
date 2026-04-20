import React, { useState, useId, useCallback } from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import "./styles.css";

/** Strip HTML tags to plain text (for aria-label and tooltip label) */
const stripHtml = (html) => html.replace(/<[^>]*>/g, "");

/**
 * HtmlHorizontalBar — Accessible horizontal bar chart (D3 + HTML/CSS).
 *
 * Accessibility (WCAG 2.1 AA):
 * - D3 scaleLinear for accurate bar widths + auto tick generation
 * - <figure> + <figcaption> semantic wrapper, aria-labelledby
 * - Visually-hidden <table> for screen-reader table navigation
 * - Tooltip on hover AND keyboard focus (role="tooltip" + aria-describedby)
 * - aria-live="polite" announces tooltip content to screen readers
 * - Focus-visible ring on each bar for keyboard navigation
 */
const HtmlHorizontalBar = ({
  labels = [],
  data = [],
  datasetLabel = "",
  color = "green",
  xAxisLabel = "",
  darkTheme = "light",
  title = "",
  labelHeader = "Prática",
}) => {
  const isDark = darkTheme === "dark";
  const id = useId();
  const titleId = `${id}-title`;
  const captionText = title || datasetLabel;

  const [activeIndex, setActiveIndex] = useState(null);

  const showTooltip = useCallback((i) => setActiveIndex(i), []);
  const hideTooltip = useCallback(() => setActiveIndex(null), []);

  // D3 linear scale: maps [0, max] → [0, 100] percentage
  const maxValue = max(data) || 1;
  const xScale = scaleLinear().domain([0, maxValue]).range([0, 100]);

  // Generate nice tick values (≤ 10 ticks) for the x-axis grid
  const ticks = xScale.ticks(10);

  return (
    <figure
      className={`ama html-horizontal-bar ${isDark ? "dark" : "light"}`}
      aria-labelledby={captionText ? titleId : undefined}
    >
      {/* aria-live region — announces tooltip to screen readers on focus/hover */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="html-horizontal-bar__sr-live"
      >
        {activeIndex !== null
          ? `${stripHtml(labels[activeIndex])}: ${data[activeIndex]}`
          : ""}
      </div>

      {/* Chart title / figcaption */}
      {captionText && (
        <figcaption id={titleId} className="html-horizontal-bar__title">
          {captionText}
        </figcaption>
      )}

      {/*
       * Visually-hidden table — screen readers navigate data here.
       * Complements the focusable bars below.
       */}
      <table className="html-horizontal-bar__sr-table">
        <caption>{captionText}</caption>
        <thead>
          <tr>
            <th scope="col">{labelHeader}</th>
            <th scope="col">{xAxisLabel || datasetLabel}</th>
          </tr>
        </thead>
        <tbody>
          {labels.map((label, i) => (
            <tr key={i}>
              <td dangerouslySetInnerHTML={{ __html: label }} />
              <td>{data[i]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      {datasetLabel && (
        <div className="html-horizontal-bar__legend" aria-hidden="true">
          <span
            className="html-horizontal-bar__legend-color"
            style={{ backgroundColor: color }}
          />
          <span className="html-horizontal-bar__legend-text">{datasetLabel}</span>
        </div>
      )}

      {/* Chart body: labels + bars + grid */}
      <div className="html-horizontal-bar__body">
        {/* Label column */}
        <div className="html-horizontal-bar__labels-col" aria-hidden="true">
          {labels.map((label, i) => (
            <div
              key={i}
              className="html-horizontal-bar__label"
              dangerouslySetInnerHTML={{ __html: label }}
            />
          ))}
        </div>

        {/* Bars + grid column */}
        <div className="html-horizontal-bar__chart-col">
          {/* Grid lines (behind the bars) */}
          <div className="html-horizontal-bar__grid" aria-hidden="true">
            {ticks.map((tick) => (
              <div
                key={tick}
                className="html-horizontal-bar__grid-line"
                style={{ left: `${xScale(tick)}%` }}
              />
            ))}
          </div>

          {/* Rows */}
          <div className="html-horizontal-bar__rows">
            {labels.map((label, i) => {
              const tooltipId = `${id}-tooltip-${i}`;
              const isActive = activeIndex === i;
              const plainLabel = stripHtml(label);

              return (
                <div key={i} className="html-horizontal-bar__row">
                  <div
                    className="html-horizontal-bar__track"
                    tabIndex="0"
                    role="img"
                    aria-label={`${plainLabel}: ${data[i]}`}
                    aria-describedby={isActive ? tooltipId : undefined}
                    onMouseEnter={() => showTooltip(i)}
                    onMouseLeave={hideTooltip}
                    onFocus={() => showTooltip(i)}
                    onBlur={hideTooltip}
                  >
                    <div
                      className="html-horizontal-bar__bar"
                      style={{
                        width: `${xScale(data[i])}%`,
                        backgroundColor: color,
                      }}
                    />

                    {/* Tooltip — shown on hover and focus */}
                    {isActive && (
                      <div
                        id={tooltipId}
                        role="tooltip"
                        className="html-horizontal-bar__tooltip"
                      >
                        <span className="html-horizontal-bar__tooltip-label">
                          {plainLabel}
                        </span>
                        <span className="html-horizontal-bar__tooltip-value">
                          {data[i]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-axis: tick labels */}
          <div className="html-horizontal-bar__x-axis" aria-hidden="true">
            {ticks.map((tick) => (
              <span
                key={tick}
                className="html-horizontal-bar__x-tick"
                style={{ left: `${xScale(tick)}%` }}
              >
                {tick}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* X-axis label */}
      {xAxisLabel && (
        <div className="html-horizontal-bar__x-axis-label" aria-hidden="true">
          {xAxisLabel}
        </div>
      )}
    </figure>
  );
};

HtmlHorizontalBar.propTypes = {
  /** Array of label strings — may contain HTML markup (e.g. <mark>, <code>) */
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** Array of numeric values, one per label */
  data: PropTypes.arrayOf(PropTypes.number).isRequired,
  /** Legend label and accessible table column header */
  datasetLabel: PropTypes.string,
  /** Bar fill color */
  color: PropTypes.string,
  /** X-axis label (below chart) and accessible table column header */
  xAxisLabel: PropTypes.string,
  /** Theme: "light" or "dark" */
  darkTheme: PropTypes.oneOf(["light", "dark"]),
  /** Chart title rendered as <figcaption>; also labels the <figure> */
  title: PropTypes.string,
  /** Header for the label column in the accessible table */
  labelHeader: PropTypes.string,
};

export default HtmlHorizontalBar;
export { HtmlHorizontalBar };
