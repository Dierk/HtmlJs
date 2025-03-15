/**
 * @module controller
 */

export { normalize, swapXZ, swapYZ };

const normalize = tetro => {
    const minZ = Math.min(...tetro.map(box => box.z));
    // const minY = Math.min(...tetro.map(box => box.y)); // commented since it might feel better to not normalize y
    // return tetro.map( box => ({x: box.x, y: box.y - minY, z: box.z - minZ}));
    return tetro.map( box => ({x: box.x, y: box.y, z: box.z - minZ}));
};

const swapXZ = tetro => tetro.map( box => ({x: box.z, y: box.y, z: box.x}));
const swapYZ = tetro => tetro.map( box => ({x: box.x, y: box.z, z: box.y}));
