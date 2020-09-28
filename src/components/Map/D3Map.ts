import * as d3 from 'd3';
import { RefObject } from 'react';
import * as topojson from 'topojson-client';
import { world } from './data/readme-world-110m';

type D3MapProps = {
    data: any;
}
const width = 100;
const height = 100;

function linearised_log(x, cutoff) {
    return x < cutoff ? x : Math.log(x / cutoff) + cutoff;
}


function project(x, y) {
    let distance = y + Math.PI/2;
    let r = linearised_log(distance, 0.00001);
    r /= 5; // Not the prettiest way to fit to the screen...
    let theta = -x + Math.PI / 2;
    return [r * Math.cos(theta), r * Math.sin(theta)];
}


export default class D3Map {

    svgRef: RefObject<SVGSVGElement>;

    constructor(svgRef: RefObject<SVGSVGElement>, props: D3MapProps) {
        this.svgRef = svgRef;
        this.draw(props.data);
    }

    draw(data: any) {

        console.log('data', data);
        let svg = d3.select(this.svgRef.current);

        // @ts-ignore
        const projection = d3.geoProjection(project)
            // .scale(248)
            // .clipAngle(180)
            // .center([-111.961058, -1057.6887483])
            .rotate([-11.961058, -57.6887483 - 90, 0])
            ; // TODO: Figure out what all this does...

        const centroid = d3.geoPath(projection).centroid;

        const path = d3.geoPath(projection);

        const graticule = d3.geoGraticule()
            .extent([[-180, -90], [180 - .1, 90 - .1]]);

        const line = svg.append('path')
            .datum(graticule)
            .attr('class', 'graticule')
            .attr('d', path);

        // svg.append('circle')
        //     .attr('class', 'graticule-outline')
        //     .attr('cx', width)
        //     .attr('cy', height)
        //     .attr('r', projection.scale());

        const title = svg
            .append('text')
            .attr('x', width / 2)
            .attr('y', height * 3 / 5);

        console.log('world', world);

        // @ts-ignore
        const countries = topojson.feature(world, world.objects.countries).features;
        svg.selectAll('.country')
            .data(countries)
            .enter().insert('path', '.graticule')
            .attr('class', 'country')
            .attr('d', path);

    }

}