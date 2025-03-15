/**
 * @module controller
 */

export { rotateLeft, toppleLeft, newEmptyCube, tetrominoToCube, cubeAsTetromino,
         toppleTetroLeft, normalize };


const rotateLeft = face =>
    face.map((row, rowIndex) => // rows (left-to-right) become columns (bottom-to-top)
        row.map((_, colIndex) =>
            face[colIndex][face.length - 1 - rowIndex]
        )
    );

const toppleLeft = cube => cube.map(frontFace => rotateLeft(frontFace));

const newEmptyCube = n =>
    Array.from({length:n},
       _x => Array.from({length:n},
           _y=> Array.from({length:n})));

const tetrominoToCube = (tetromino, cubeSize) => {
    const cube = newEmptyCube(cubeSize);
    tetromino.forEach( box => cube[box.x][box.y][box.z] = 1);
    return cube;
}

const cubeAsTetromino = cube => {
    const result = [];
    cube.forEach( (xPlane,x) =>
        xPlane.forEach( (yRow,y) =>
            yRow.forEach( (zCell,z) => {
                if (zCell === 1) {
                    result.push( {x,y,z} );
                }
            })));
    return result;
}

const toppleTetroLeft = (tetromino,size) => cubeAsTetromino(toppleLeft(tetrominoToCube(tetromino,size)));

const normalize = tetro => {
    const minZ = Math.min(...tetro.map(box => box.z));
    const minY = Math.min(...tetro.map(box => box.y));
    return tetro.map( box => ({x: box.x, y: box.y - minY, z: box.z - minZ}));
};
