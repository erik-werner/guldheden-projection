import * as d3 from 'd3';
import { ChartData } from "./BarChart";
import {RefObject} from "react";

export type D3BarChartProps = {
    data: ChartData[];
    chartRef: RefObject<SVGSVGElement>;
    width: number;
    height: number;
}

const ALL_BARS_LABEL_CLASS = 'bars';

export default class D3BarChart {

    context: any;
    svgRef: RefObject<SVGSVGElement>;
    props: D3BarChartProps;


    constructor(props: D3BarChartProps) {
        this.props = props;
        this.svgRef = props.chartRef;

        this.context = d3.select(this.svgRef.current);

        const { data, width, height } = this.props;
        this.draw(data, width, height);
    }

    draw(data: ChartData[], width: number, height: number) {
        const chart = this.context;

        chart.attr(
            "transform",
            `translate(${width / 2}, ${height / 2})`
        );

        const barsGroup = this.context.append('g').attr('class', ALL_BARS_LABEL_CLASS);

        const maxValueX = d3.max(data, (d: ChartData) => d.value);
        const x = d3
            .scaleLinear()
            .domain([0, maxValueX ? maxValueX + 1 : 1])
            .range([0, width]);

        const y = d3.scaleBand().domain(data.map((d: ChartData) => d.label)).range([0, 10]);

        // DATA JOIN
        const rects = barsGroup.selectAll('rect').data(data);

        // EXIT
        rects.exit().transition().duration(500).attr('width', 0).attr('x',0).remove();

        // UPDATE
        rects
            .transition()
            .duration(500)
            .attr('x', 0)
            .attr('y', (d: ChartData) => y(d.label))
            .attr('width', (d: ChartData) => x(d.value))
            .attr('height', y.bandwidth)
            .attr('fill', (d: ChartData, i: number) => '#ffaabb');

        // ENTER
        rects
            .enter()
            .append('rect')
            .attr('y', (d: ChartData) => y(d.label))
            .attr('height', y.bandwidth)
            .attr('fill', (d: ChartData, i: number) => '#ffaabb')
            .transition()
            .duration(1000)
            .attr('x', 0)
            .attr('width', (d: ChartData) => x(d.value));

    }
}