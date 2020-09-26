import React, { RefObject } from 'react'
import D3Map from './D3Map';
import styled from 'styled-components';
import { MapStyle } from './Map.style';

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

type MapProps = {
    data: any;
    className: string;
};
type MapState = {
    chart: D3Map | null;
    data: any[];
};
class MapWithoutStyle extends React.Component<MapProps, MapState> {
    svgRef: RefObject<SVGSVGElement> = React.createRef<SVGSVGElement>();

    state = {
        chart: null,
        data: []
    };

    shouldComponentUpdate(nextProps: Readonly<MapProps>, nextState: Readonly<MapState>, nextContext: any): boolean {
        return false;
    }

    componentDidMount(): void {
        this.setState({
            chart: new D3Map(this.svgRef, { data: []}),
            data: []
        });
    }

    static getDerivedStateFromProps(nextProps: MapProps, prevState: MapState ) {
        const newData = false; //!arraysEqual(nextProps.data, prevState.data); // todo find out if new data available equals(nextProps.data, prevState.chart.data)
        if (prevState.chart && newData) {
            const { data } = nextProps;
            prevState.chart.draw(data);
        }
        return prevState;
    }



    render() {
        const { className } = this.props;
        return <div className={className}>
            <svg ref={this.svgRef} width={'100%'} height={'100%'} />
        </div>
    }

}

export const Map = styled(MapWithoutStyle)`
    ${MapStyle}
`;