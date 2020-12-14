import { guldhedenProjection } from "./projection";

const TEST_POINTS: Array<[number, number]> = [
    [0, 0],
    [0, 1],
    [0, -1],
    [1, 0],
    [1, 1],
    [1, -1],
];

function norm2(arr1: Array<number>, arr2: Array<number>): number {
    return arr1
        .map((v1, i) => arr2[i] - v1)
        .map(diff => diff ** 2)
        .reduce((prev, curr) => prev + curr);
}

test('the prime meridian maps to x = 0', () => {
    const lon = 0;
    const lat = 1;
    expect(guldhedenProjection(lon, lat)[0]).toBeCloseTo(0);
});

test('the equator maps to y = 0', () => {
    const lon = 1;
    const lat = 0;
    expect(guldhedenProjection(lon, lat)[1]).toBeCloseTo(0);
});

test('the projection is an even function', () => {
    function mirror(point: [number, number]): [number, number] {
        return [-point[0], -point[1]];
    }
    TEST_POINTS.forEach((point) => {
        const projectedMirrored = mirror(guldhedenProjection(...point));
        const mirroredProjected = guldhedenProjection(...mirror(point));
        expect(norm2(projectedMirrored, mirroredProjected)).toBeCloseTo(0);
    });
});

test('the projection inverse works', () => {
    TEST_POINTS.forEach((point) => {
        const projected = guldhedenProjection(...point);
        const inverted = guldhedenProjection.invert(...projected);
        expect(inverted[0]).toBeCloseTo(point[0]);
        expect(inverted[1]).toBeCloseTo(point[1]);
    });

});
