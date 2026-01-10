import { useMemo } from 'react';
import { skills, type SkillKey, type SkillLabel } from '../data/skills';

type ArcDatum = {
  value: number;
  lines: string[];
  startAngle: number;
  endAngle: number;
};

const CHART_SIZE = 420;
const INNER_RADIUS = 70;
const OUTER_RADIUS = 170;
const LABEL_OFFSET = 24;

const toLabelLines = (label: SkillLabel) => (Array.isArray(label) ? label : [label]);

export default function SkillsRadialBar({ activeSkill }: { activeSkill: SkillKey }) {
  const d3 = typeof window === 'undefined' ? undefined : (window as { d3?: any }).d3;
  const { label, labels, data } = skills[activeSkill];

  const arcData = useMemo(() => {
    const angleStep = (Math.PI * 2) / data.length;

    return labels.map((skillLabel, index) => ({
      value: data[index],
      lines: toLabelLines(skillLabel),
      startAngle: index * angleStep,
      endAngle: (index + 1) * angleStep
    }));
  }, [data, labels]);

  const maxValue = d3 ? d3.max(data) ?? 100 : 100;
  const radiusScale = useMemo(() => {
    if (!d3) return null;
    return d3
      .scaleLinear()
      .domain([0, Math.max(100, maxValue)])
      .range([INNER_RADIUS, OUTER_RADIUS]);
  }, [d3, maxValue]);

  const arcGenerator = useMemo(() => {
    if (!d3 || !radiusScale) return null;
    return d3
      .arc<ArcDatum>()
      .innerRadius(INNER_RADIUS)
      .outerRadius((datum: ArcDatum) => radiusScale(datum.value))
      .startAngle((datum: ArcDatum) => datum.startAngle)
      .endAngle((datum: ArcDatum) => datum.endAngle)
      .padAngle(0.03)
      .padRadius(INNER_RADIUS);
  }, [d3, radiusScale]);

  if (!d3 || !radiusScale || !arcGenerator) {
    return null;
  }

  return (
    <svg
      className="skills-radial-chart"
      viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
      role="img"
      aria-labelledby="skills-radial-title"
    >
      <title id="skills-radial-title">{label} skill overview</title>
      <g transform={`translate(${CHART_SIZE / 2} ${CHART_SIZE / 2})`}>
        {arcData.map(datum => {
          const path = arcGenerator(datum);
          const labelRadius = radiusScale(datum.value) + LABEL_OFFSET;
          const angle = (datum.startAngle + datum.endAngle) / 2;
          const x = Math.sin(angle) * labelRadius;
          const y = -Math.cos(angle) * labelRadius;
          const anchor = x >= 0 ? 'start' : 'end';

          return (
            <g key={`${datum.lines.join('-')}-${datum.startAngle}`}>
              {path && (
                <path
                  d={path}
                  fill="rgba(16, 185, 129, 0.35)"
                  stroke="rgba(15, 118, 110, 0.95)"
                  strokeWidth={3}
                />
              )}
              <text x={x} y={y} textAnchor={anchor} className="skills-radial-label">
                {datum.lines.map((line, lineIndex) => (
                  <tspan
                    key={line}
                    x={x}
                    dy={lineIndex === 0 ? '0em' : '1.1em'}
                    className="skills-radial-label-line"
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
