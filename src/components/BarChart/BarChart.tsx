import React, { RefObject } from 'react'
import D3BarChart from "./D3BarChart";

export type ChartData = {
    label: string; // y-value, label of bar
    value: number; // x-value,s value of bar
};

export type BarChartProps = {
    data: ChartData[];
    width: number;
    height: number;
};
export type BarChartState = {
    chart: D3BarChart | null;
};

export class BarChart extends React.Component<BarChartProps, BarChartState> {

    svgRef: RefObject<SVGSVGElement> = React.createRef<SVGSVGElement>();

    state = {
        chart: null
    };

    static getDerivedStateFromProps(nextProps: BarChartProps, prevState: BarChartState ) {
        const newData = false; // todo find out if new data available equals(nextProps.data, prevState.chart.data)
        if (prevState.chart && newData) {
            const { data, width, height } = nextProps;
            prevState.chart.draw(data, width, height);
        }
        return prevState;
    }

    // Let D3 handle update the svg, to get transitions etc...
    shouldComponentUpdate(nextProps: Readonly<BarChartProps>, nextState: Readonly<BarChartState>, nextContext: any): boolean {
        return false;
    }

    componentDidMount(): void {
        const { data, width, height } = this.props;

        const chartProps = {
            chartRef: this.svgRef,
            data: data,
            width: width,
            height: height
        };
        this.setState({
            chart: new D3BarChart(chartProps)
        });
    }

    render() {
        return <div>
            <svg ref={this.svgRef} width={'100px'} height={'50%'} />
        </div>
    }
}