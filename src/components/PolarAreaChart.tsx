import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { SkillLabel } from '../data/skills';

interface PolarAreaChartProps {
  labels: SkillLabel[];
  data: number[];
}

interface ChartDatum {
  value: number;
  label: string;
  startAngle: number;
  endAngle: number;
}

const formatLabels = (labels: SkillLabel[], isCompact: boolean) =>
  labels.map(label => {
    if (Array.isArray(label)) {
      return isCompact ? label[0] : label.join(' ');
    }
    return label;
  });

export default function PolarAreaChart({ labels, data }: PolarAreaChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [chartSize, setChartSize] = useState(0);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const width = entry.contentRect.width;
        if (!width) return;
        setChartSize(width);
        setIsCompact(width < 520);
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const displayLabels = useMemo(() => formatLabels(labels, isCompact), [labels, isCompact]);

  useEffect(() => {
    if (!svgRef.current || !chartSize || !data.length) return;

    const svg = d3.select(svgRef.current);
    const size = Math.max(240, chartSize);
    const radius = size / 2 - 48;
    const maxValue = Math.max(100, ...data);
    const angleStep = (Math.PI * 2) / data.length;

    const chartData: ChartDatum[] = data.map((value, index) => ({
      value,
      label: displayLabels[index] ?? '',
      startAngle: index * angleStep - Math.PI / 2,
      endAngle: (index + 1) * angleStep - Math.PI / 2
    }));

    const radiusScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]);
    const arcGenerator = d3
      .arc<ChartDatum>()
      .innerRadius(0)
      .outerRadius(datum => radiusScale(datum.value));

    svg.attr('viewBox', `0 0 ${size} ${size}`)
      .attr('role', 'img')
      .attr('aria-label', 'Skills chart');

    const root = svg
      .selectAll<SVGGElement, null>('g.chart-root')
      .data([null])
      .join('g')
      .attr('class', 'chart-root')
      .attr('transform', `translate(${size / 2}, ${size / 2})`);

    const sectorPath = (datum: ChartDatum) => arcGenerator(datum) ?? '';

    root
      .selectAll<SVGPathElement, ChartDatum>('path.skill-sector')
      .data(chartData)
      .join(
        enter =>
          enter
            .append('path')
            .attr('class', 'skill-sector')
            .attr('fill', 'rgba(16, 185, 129, 0.35)')
            .attr('stroke', 'rgba(15, 118, 110, 0.95)')
            .attr('stroke-width', 2)
            .each(function assignStartAngle(datum) {
              (this as SVGPathElement & { __current?: ChartDatum }).__current = {
                ...datum,
                value: 0
              };
            })
            .attr('d', sectorPath)
            .call(selection =>
              selection
                .transition()
                .duration(750)
                .attrTween('d', function animatePath(datum) {
                  const previous =
                    (this as SVGPathElement & { __current?: ChartDatum }).__current ?? datum;
                  const interpolator = d3.interpolate(previous, datum);
                  (this as SVGPathElement & { __current?: ChartDatum }).__current = datum;
                  return step => sectorPath(interpolator(step));
                })
            ),
        update =>
          update.call(selection =>
            selection
              .transition()
              .duration(750)
              .attrTween('d', function animatePath(datum) {
                const previous =
                  (this as SVGPathElement & { __current?: ChartDatum }).__current ?? datum;
                const interpolator = d3.interpolate(previous, datum);
                (this as SVGPathElement & { __current?: ChartDatum }).__current = datum;
                return step => sectorPath(interpolator(step));
              })
          ),
        exit => exit.transition().duration(400).attr('opacity', 0).remove()
      );

    root
      .selectAll<SVGTextElement, ChartDatum>('text.skill-label')
      .data(chartData)
      .join(
        enter =>
          enter
            .append('text')
            .attr('class', 'skill-label')
            .attr('opacity', 0)
            .attr('x', datum => {
              const angle = (datum.startAngle + datum.endAngle) / 2;
              return Math.cos(angle) * (radiusScale(datum.value) + 16);
            })
            .attr('y', datum => {
              const angle = (datum.startAngle + datum.endAngle) / 2;
              return Math.sin(angle) * (radiusScale(datum.value) + 16);
            })
            .attr('text-anchor', datum => {
              const angle = (datum.startAngle + datum.endAngle) / 2;
              return Math.cos(angle) >= 0 ? 'start' : 'end';
            })
            .text(datum => datum.label)
            .call(selection => selection.transition().duration(600).attr('opacity', 1)),
        update =>
          update.call(selection =>
            selection
              .text(datum => datum.label)
              .transition()
              .duration(600)
              .attr('x', datum => {
                const angle = (datum.startAngle + datum.endAngle) / 2;
                return Math.cos(angle) * (radiusScale(datum.value) + 16);
              })
              .attr('y', datum => {
                const angle = (datum.startAngle + datum.endAngle) / 2;
                return Math.sin(angle) * (radiusScale(datum.value) + 16);
              })
              .attr('text-anchor', datum => {
                const angle = (datum.startAngle + datum.endAngle) / 2;
                return Math.cos(angle) >= 0 ? 'start' : 'end';
              })
              .attr('opacity', 1)
          ),
        exit => exit.transition().duration(300).attr('opacity', 0).remove()
      );
  }, [chartSize, data, displayLabels]);

  return (
    <div className="skill-chart__frame" ref={containerRef}>
      <svg ref={svgRef} className="skill-chart__svg" />
    </div>
  );
}
