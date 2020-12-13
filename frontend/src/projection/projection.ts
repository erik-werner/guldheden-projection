import { geoDistance } from "d3";

const CUTOFF = 0.00001;

export function geoToTheta(lon: number, lat: number) {
    const b = Math.sin(lon) * Math.cos(lat);
    const a = Math.sin(lat);
    const bearing = Math.atan2(b, a);
    const theta = Math.PI / 2 - bearing;
    return theta;
}

function geoToDistance(lon: number, lat: number) {
    return geoDistance([0, 0], [lon * 180 / Math.PI, lat * 180 / Math.PI]);
}

function linearisedLog(x, cutoff) {
    return x < cutoff ? x / cutoff : Math.log(x / cutoff) + 1;
}

function linearisedLogInverse(r, cutoff) {
    return r < cutoff ? r * cutoff : cutoff * Math.exp((r - 1));
}

function geoToRadius(lon: number, lat: number) {
    return linearisedLog(geoToDistance(lon, lat), CUTOFF);
}

export function guldhedenProjection(lon: number, lat: number): [number, number] {
    const r = geoToRadius(lon, lat);
    const theta = geoToTheta(lon, lat);
    return [r * Math.cos(theta), r * Math.sin(theta)];
}

guldhedenProjection.invert = function (x: number, y: number): [number, number] {
    const r = Math.sqrt(x ** 2 + y ** 2);
    const distance = linearisedLogInverse(r, CUTOFF);
    const theta = Math.atan2(y, x);
    const bearing = Math.PI / 2 - theta;
    const lat = Math.asin(Math.sin(distance) * Math.cos(bearing));
    const lon = Math.atan2(Math.sin(bearing) * Math.sin(distance), Math.cos(distance));
    return [lon, lat];
}
