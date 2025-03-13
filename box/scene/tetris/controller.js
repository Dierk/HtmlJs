/**
 * @module controller
 */

export { rotateLeft, toppleLeft, toppleBack };


const rotateLeft = face =>
    face.map((row, rowIndex) => // rows (left-to-right) become columns (bottom-to-top)
        row.map((_, colIndex) =>
            face[colIndex][face.length - 1 - rowIndex]
        )
    );

const toppleLeft = cube => cube.map(frontFace => rotateLeft(frontFace));

const toppleBack = cube => {
    const result = cube;
    const dim    = cube.length;
    for (let col = 0; col < dim; col++) {
        for (let i = 0; i < dim; i++) {
            result[0]      [col][i]       = cube[dim-1-i][col][0];          // front to top
            result[dim-1-i][col][dim-1]   = cube[0]      [col][dim-1-i];    // top to back
            result[dim-1]  [col][dim-1-i] = cube[i]      [col][dim-1];      // back to floor
            result[dim-1-i][col][0]       = cube[i]      [col][dim-1-i];    // floor to front
        }
    }

    return result;
}

// turn clockwise:
// - toppleBack
// - toppleLeft
// - toppleBack * 2
