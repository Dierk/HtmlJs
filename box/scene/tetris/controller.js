/**
 * @module controller
 */

export { normalize, xzSwaps, yzSwaps };

const normalize = tetro => {
    const minZ = Math.min(...tetro.map(box => box.z));
    return tetro.map( box => ({x: box.x, y: box.y, z: box.z - minZ}));
};

const swapXZ        = tetro => tetro.map( box => ({x:  box.z, y: box.y, z:  box.x}));
const negateX       = tetro => tetro.map( box => ({x: -box.x, y: box.y, z:  box.z}));
const swapNegateXZ  = tetro => tetro.map( box => ({x: -box.z, y: box.y, z: -box.x}));

const id = x => x;
const xzSwaps = [ id, swapXZ, negateX, swapNegateXZ];


const swapYZ        = tetro => tetro.map( box => ({x: box.x, y:  box.z, z:  box.y}));
const negateY       = tetro => tetro.map( box => ({x: box.x, y: -box.y, z:  box.z}));
const swapNegateYZ  = tetro => tetro.map( box => ({x: box.x, y: -box.z, z: -box.y}));

const yzSwaps = [id, swapYZ, negateY, swapNegateYZ];
