import * as d3 from 'd3';
import { RefObject } from 'react';
import * as topojson from 'topojson-client';

type D3MapProps = {
    data: any;
}
const width = 1000;
const height = 1000;
const CUTOFF = 0.00001;

function linearised_log(x, cutoff) {
    return x < cutoff ? x/cutoff : Math.log(x / cutoff) + 1;
}

function linearised_log_inverse(r, cutoff) {
    return r < cutoff ? r * cutoff : cutoff * Math.exp((r - 1));
}

function guldheden_projection(lon, lat) {
    let distance = d3.geoDistance([0, 0], [lon * 180 / Math.PI, lat * 180 / Math.PI]);
    let r = linearised_log(distance, CUTOFF);
    const b = Math.sin(lon) * Math.cos(lat);
    const a = Math.sin(lat);
    const theta = -Math.atan2(b, a) + Math.PI / 2;
    return [r * Math.cos(theta), r * Math.sin(theta)];
}

guldheden_projection.invert = function(x, y) {
    const r = Math.sqrt(x**2 + y**2);
    const distance = linearised_log_inverse(r, CUTOFF);
    const theta = Math.atan2(y, x);
    const bearing = Math.PI / 2 - theta;
    const lat2 = Math.asin(Math.sin(distance) * Math.cos(bearing));
    const lon2 = Math.atan2(Math.sin(bearing) * Math.sin(distance), Math.cos(distance))
    return [lon2, lat2];
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

        const graticule = d3.geoGraticule();

        // @ts-ignore
        const projection = d3.geoProjection(guldheden_projection)
            .fitSize([width, height], graticule())
            .rotate([-11.961058, -57.6887483, 0]);

        const path = d3.geoPath(projection);

        svg.append('path')
            .datum(graticule)
            .attr('class', 'graticule')
            .attr('d', path);

        svg
            .append('text')
            .attr('x', width / 2)
            .attr('y', height * 3 / 5);

        d3.json('/mapshaper_10m.topojson').then(plotWorld);

        function plotWorld(world) {
            // @ts-ignore
            const countries = topojson.feature(world, world.objects.ne_10m_admin_0_countries).features;
            svg.selectAll('.country')
                .data(countries)
                .enter().insert('path', '.graticule')
                .attr('class', 'country')
                .attr('d', path);
        }

    }

}