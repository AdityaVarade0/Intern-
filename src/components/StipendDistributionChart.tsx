import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { TrendingUp, BarChart3, MapPin, Briefcase, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Internship } from '../types';

interface StipendDistributionChartProps {
  internships: Internship[];
}

type GroupByMode = 'category' | 'city';

interface GroupData {
  label: string;
  count: number;
  avgStipend: number;
  minStipend: number;
  maxStipend: number;
  companies: string[];
}

export const StipendDistributionChart: React.FC<StipendDistributionChartProps> = ({ internships }) => {
  const [groupBy, setGroupBy] = useState<GroupByMode>('category');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [hoveredItem, setHoveredItem] = useState<GroupData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Compute aggregated data
  const aggregatedData: GroupData[] = useMemo(() => {
    if (internships.length === 0) return [];

    const map = new Map<string, { total: number; min: number; max: number; count: number; companies: Set<string> }>();

    internships.forEach(item => {
      const key = groupBy === 'category' 
        ? item.category.replace(' (SDE)', '').replace(' (UI/UX)', '').replace(' (APM)', '')
        : (item.city || item.location.split(',')[0]);

      const stipend = item.stipendNumeric;
      const existing = map.get(key);

      if (existing) {
        existing.total += stipend;
        existing.count += 1;
        existing.min = Math.min(existing.min, stipend);
        existing.max = Math.max(existing.max, stipend);
        existing.companies.add(item.company);
      } else {
        map.set(key, {
          total: stipend,
          count: 1,
          min: stipend,
          max: stipend,
          companies: new Set([item.company])
        });
      }
    });

    const result: GroupData[] = [];
    map.forEach((val, key) => {
      result.push({
        label: key,
        count: val.count,
        avgStipend: Math.round(val.total / val.count),
        minStipend: val.min,
        maxStipend: val.max,
        companies: Array.from(val.companies)
      });
    });

    // Sort descending by average stipend
    return result.sort((a, b) => b.avgStipend - a.avgStipend);
  }, [internships, groupBy]);

  // Overall statistics
  const stats = useMemo(() => {
    if (internships.length === 0) {
      return { overallAvg: 0, highest: 0, lowest: 0, totalRoles: 0 };
    }
    const stipends = internships.map(i => i.stipendNumeric);
    const sum = stipends.reduce((acc, curr) => acc + curr, 0);
    return {
      overallAvg: Math.round(sum / stipends.length),
      highest: Math.max(...stipends),
      lowest: Math.min(...stipends),
      totalRoles: internships.length
    };
  }, [internships]);

  // D3 Render Effect
  useEffect(() => {
    if (!svgRef.current || aggregatedData.length === 0 || !isExpanded) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const margin = { top: 30, right: 30, bottom: 65, left: 80 };
    const width = 850;
    const height = 300;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(aggregatedData.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.35);

    const maxVal = d3.max(aggregatedData, d => d.avgStipend) || 100000;
    const yScale = d3
      .scaleLinear()
      .domain([0, maxVal * 1.15])
      .range([innerHeight, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(
        d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
          .ticks(5)
      )
      .selectAll('line')
      .attr('stroke', '#f1f5f9')
      .attr('stroke-dasharray', '3 3');

    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat((d) => `₹${Number(d) / 1000}k`);

    // X-Axis render
    const gx = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    gx.selectAll('text')
      .attr('transform', 'rotate(-18)')
      .attr('text-anchor', 'end')
      .attr('dx', '-0.5em')
      .attr('dy', '0.6em')
      .attr('fill', '#475569')
      .style('font-size', '11px')
      .style('font-weight', '500');

    gx.select('.domain').attr('stroke', '#cbd5e1');

    // Y-Axis render
    const gy = g.append('g').call(yAxis);
    gy.selectAll('text')
      .attr('fill', '#64748b')
      .style('font-size', '11px')
      .style('font-family', 'JetBrains Mono, monospace');
    gy.select('.domain').attr('stroke', 'transparent');

    // Gradient definitions
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'bar-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#4f46e5');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#6366f1');

    const gradientHover = defs.append('linearGradient')
      .attr('id', 'bar-gradient-hover')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradientHover.append('stop').attr('offset', '0%').attr('stop-color', '#312e81');
    gradientHover.append('stop').attr('offset', '100%').attr('stop-color', '#4338ca');

    // Overall Average Reference Line
    const avgY = yScale(stats.overallAvg);
    g.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', avgY)
      .attr('y2', avgY)
      .attr('stroke', '#10b981')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5 4');

    g.append('text')
      .attr('x', innerWidth - 6)
      .attr('y', avgY - 6)
      .attr('text-anchor', 'end')
      .attr('fill', '#047857')
      .style('font-size', '10px')
      .style('font-weight', '600')
      .style('font-family', 'JetBrains Mono, monospace')
      .text(`Filtered Avg: ₹${(stats.overallAvg / 1000).toFixed(1)}k/mo`);

    // Render Bars
    const bars = g.selectAll('.bar')
      .data(aggregatedData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.label) || 0)
      .attr('width', xScale.bandwidth())
      .attr('y', innerHeight) // Start at bottom for animated pop
      .attr('height', 0)
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('fill', 'url(#bar-gradient)')
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('fill', 'url(#bar-gradient-hover)');

        const target = event.currentTarget as SVGRectElement | null;
        const containerBounds = containerRef.current?.getBoundingClientRect();

        if (target && containerBounds) {
          const rectBounds = target.getBoundingClientRect();
          setTooltipPos({
            x: rectBounds.left - containerBounds.left + rectBounds.width / 2,
            y: rectBounds.top - containerBounds.top - 10
          });
        }
        setHoveredItem(d);
      })
      .on('mouseleave', function () {
        d3.select(this)
          .transition()
          .duration(150)
          .attr('fill', 'url(#bar-gradient)');
        setHoveredItem(null);
      });

    // Animate bars growing upwards
    bars.transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr('y', d => yScale(d.avgStipend))
      .attr('height', d => innerHeight - yScale(d.avgStipend));

    // Bar top value labels (Formatted cleanly)
    g.selectAll('.bar-label')
      .data(aggregatedData)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', d => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.avgStipend) - 7)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .style('font-size', '10px')
      .style('font-weight', '700')
      .style('font-family', 'JetBrains Mono, monospace')
      .style('opacity', 0)
      .text(d => `₹${Math.round(d.avgStipend / 1000)}k`)
      .transition()
      .delay(400)
      .duration(400)
      .style('opacity', 1);

  }, [aggregatedData, stats, isExpanded]);

  if (internships.length === 0) return null;

  return (
    <div ref={containerRef} className="relative bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all">
      
      {/* Chart Header & Mode Switcher */}
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Stipend Distribution & Earnings Benchmark (D3)
              </h3>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                Live Dynamic
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Visualizing compensation across {internships.length} currently filtered cohorts in India
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Segmented Control: Category vs City */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setGroupBy('category')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap shrink-0 ${
                groupBy === 'category'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>By Role Category</span>
            </button>

            <button
              onClick={() => setGroupBy('city')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap shrink-0 ${
                groupBy === 'city'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>By City Hub</span>
            </button>
          </div>

          {/* Toggle Expand / Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title={isExpanded ? 'Collapse chart' : 'Expand chart'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-5 space-y-5">
          
          {/* 4-Item Quick Benchmark Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 font-medium block">Average Stipend:</span>
              <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                ₹{stats.overallAvg.toLocaleString('en-IN')}/mo
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 font-medium block">Top Available Stipend:</span>
              <span className="text-base font-bold text-indigo-600 font-mono tabular-nums">
                ₹{stats.highest.toLocaleString('en-IN')}/mo
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 font-medium block">Highest Paying {groupBy === 'category' ? 'Discipline' : 'City'}:</span>
              <span className="text-base font-bold text-slate-800 truncate block">
                {aggregatedData[0]?.label || 'AI & Machine Learning'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 font-medium block">Lowest Entry Baseline:</span>
              <span className="text-base font-bold text-slate-700 font-mono tabular-nums">
                ₹{stats.lowest.toLocaleString('en-IN')}/mo
              </span>
            </div>
          </div>

          {/* D3 SVG Chart Container */}
          <div className="w-full overflow-x-auto relative pt-2">
            <svg
              ref={svgRef}
              viewBox="0 0 850 300"
              className="w-full h-[260px] md:h-[290px] min-w-[620px]"
              preserveAspectRatio="xMidYMid meet"
            />

            {/* Interactive Tooltip */}
            {hoveredItem && tooltipPos && (
              <div
                className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-800 min-w-[210px]"
                style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                  <span className="font-bold text-white">{hoveredItem.label}</span>
                  <span className="text-[11px] text-indigo-300 font-medium">
                    {hoveredItem.count} {hoveredItem.count === 1 ? 'role' : 'roles'}
                  </span>
                </div>

                <div className="space-y-0.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Monthly:</span>
                    <span className="font-bold text-emerald-400">₹{hoveredItem.avgStipend.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Range:</span>
                    <span>₹{(hoveredItem.minStipend / 1000).toFixed(0)}k – ₹{(hoveredItem.maxStipend / 1000).toFixed(0)}k</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span className="text-slate-500 block">Hiring companies:</span>
                  <span className="text-slate-200 line-clamp-1">{hoveredItem.companies.join(', ')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Legend and Note */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-indigo-600" />
                <span>Average Monthly Stipend (₹)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 border-t-2 border-dashed border-emerald-500" />
                <span>Overall Filtered Average</span>
              </div>
            </div>
            <span>Hover on any bar to inspect role counts, ranges, and hiring companies.</span>
          </div>

        </div>
      )}

    </div>
  );
};
