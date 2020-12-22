import * as d3 from 'd3';
import { RefObject } from 'react';
import * as topojson from 'topojson-client';
import { areaPreserving } from "../../projection/projection";


type D3MapProps = {
    data: any;
}
const width = 800;
const height = 800;

export default class D3Map {

    svgRef: RefObject<SVGSVGElement>;

    constructor(svgRef: RefObject<SVGSVGElement>, props: D3MapProps) {
        this.svgRef = svgRef;
        this.draw(props.data);
    }

    draw(data: any) {

        console.log('data', data);
        let svg = d3.select(this.svgRef.current);

        const graticule = d3.geoGraticule();

        // @ts-ignore
        const projection = d3.geoProjection(areaPreserving)
            .fitSize([width, height], graticule())
            .rotate([-11.961058, -57.6887483, 0]).clipAngle(179.99);

        const path = d3.geoPath(projection);

        svg.append('path')
            .datum(graticule)
            .attr('class', 'graticule')
            .attr('d', path);

        svg
            .append('text')
            .attr('x', width / 2)
            .attr('y', height * 3 / 5);

        d3.json('/countries-50m.json').then(plotWorld);

        function plotWorld(world) {
            // @ts-ignore
            const countries = topojson.feature(world, world.objects.countries).features;
            svg.selectAll('.country')
                .data(countries)
                .enter().insert('path', '.graticule')
                .attr('class', 'country')
                .attr('d', path);
        }

    }

}