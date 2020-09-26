import * as d3 from 'd3';
import { RefObject } from "react";

type D3MapProps = {
    data: any;
}
const width = 100;
const height = 100;

type Point = {
    x: number;
    y: number;
}

const lineData2: Point[] = [ { "x":  5, "y":  30 },{ "x":  75, "y":  30 },
    { "x":  75, "y":  90 },{ "x": 150, "y":  90 },
    { "x": 150, "y": 150 },{ "x": 190, "y": 150 }];

const lineData = [[0, 20], [50, 30], [100, 50], [200, 60], [300, 90]];

const linePathGenerator = d3.line();

export default class D3Map {

    svgRef: RefObject<SVGSVGElement>;

    constructor(svgRef: RefObject<SVGSVGElement>, props: D3MapProps) {
        this.svgRef = svgRef;
        this.draw(props.data);
    }

    draw(data: any) {

        console.log('data', data);
        let context = d3.select(this.svgRef.current);

        // let svgPath = context.append("path")
        //     .attr("stroke", "blue")
        //     .attr("stroke-width", "4px")
        //     .attr("fill", "none");
        //
        // svgPath
        //     .attr("d", linePathGenerator(lineData));
        //
        // const pathString = linePathGenerator(lineData);

        // d3.select('path').attr('d', pathString);

        // World map

        const projection = d3.geoOrthographic()
            .scale(248)
            .clipAngle(90);

        const centroid = d3.geoPath(projection).centroid;

        const path = d3.geoPath(projection);

        const graticule = d3.geoGraticule()
            .extent([[-180, -90], [180 - .1, 90 - .1]]);

        const line = context.append("path")
            .datum(graticule)
            .attr("class", "graticule")
            .attr("d", path);
    }

}