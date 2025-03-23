/**
 * @module controller
 */

export { normalize, swapXZ, swapYZ };

const normalize = tetro => {
    const minX = Math.min(...tetro.map(box => box.x));
    const minY = Math.min(...tetro.map(box => box.y));
    const minZ = Math.min(...tetro.map(box => box.z));
    return tetro.map( box => ({x: box.x - minX, y: box.y - minY, z: box.z - minZ}));
};

const swapXZ        = tetro => tetro.map( box => ({x:  -box.z, y: box.y, z:  box.x}));
const swapYZ        = tetro => tetro.map( box => ({x:   box.x, y: box.z, z: -box.y}));
