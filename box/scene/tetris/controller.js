/**
 * @module controller
 */

export { normalize, xzSwaps, yzSwaps };

const normalize = tetro => {
    const minZ = Math.min(...tetro.map(box => box.z));
    return tetro.map( box => ({x: box.x, y: box.y, z: box.z - minZ}));
};

const swapXZ        = tetro => tetro.map( box => ({x:  box.z, y: box.y, z:   box.x}));
const swapXZ2       = tetro => tetro.map( box => ({x:  box.z, y: box.y, z:  -box.x}));

const xzSwaps = [swapXZ, swapXZ2];

const swapYZ        = tetro => tetro.map( box => ({x: box.x, y:  box.z, z:   box.y}));
const swapYZ2       = tetro => tetro.map( box => ({x: box.x, y:  box.z, z:  -box.y}));
const yzSwaps = [swapYZ, swapYZ2];
