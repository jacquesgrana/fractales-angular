import { Matrix } from "../classes/matrix";

export class MatrixLibrary {
  /**
   * Transpose of a matrix - Swap the columns with rows
   * @param matrix
   * @return
   */
  static transpose(matrix: Matrix): Matrix {
    let transposedMatrix = new Matrix(matrix.getNcols(), matrix.getNrows());
    for (let i=0;i<matrix.getNrows();i++) {
      for (let j=0;j<matrix.getNcols();j++) {
        transposedMatrix.setValueAt(j, i, matrix.getValueAt(i, j));
      }
    }
    return transposedMatrix;
  }

  /**
   * Inverse of a matrix - A-1 * A = I where I is the identity matrix
   * A matrix that have inverse is called non-singular or invertible. If the matrix does not have inverse it is called singular.
   * For a singular matrix the values of the inverted matrix are either NAN or Infinity
   * Only square matrices have inverse.
   * @param matrix
   * @return
   * @throws NoSquareException
   */
  static inverse(matrix: Matrix): Matrix {
    //console.log('inverse : matrix :', matrix);
//console.log("déterminant : ", MatrixLibrary.determinant(matrix));

    return (MatrixLibrary.transpose(MatrixLibrary.cofactor(matrix)).multiplyByConstant(1.0/MatrixLibrary.determinant(matrix)));
  }

  /**
   * Determinant of a square matrix
   * The following function find the determinant in a recursively loop.
   * @param matrix
   * @return
   * @throws NoSquareException
   */
  static determinant(matrix: Matrix): number {
    //if (!matrix.isSquare())
      //throw new NoSquareException("matrix need to be square.");
      //console.log("size :", matrix.getSize());

    if (matrix.getSize() === 1){
      return matrix.getValueAt(0, 0);
    }

    if (matrix.getSize() === 2) {
      //console.log("calcul pour cas 2 ", (matrix.getValueAt(0, 0) * matrix.getValueAt(1, 1)) - ( matrix.getValueAt(0, 1) * matrix.getValueAt(1, 0)));

      return (matrix.getValueAt(0, 0) * matrix.getValueAt(1, 1)) - ( matrix.getValueAt(0, 1) * matrix.getValueAt(1, 0));
    }
    let sum = 0.0;
    for (let i=0; i<matrix.getNcols(); i++) {
      sum += MatrixLibrary.changeSign(i) * matrix.getValueAt(0, i) * MatrixLibrary.determinant(MatrixLibrary.createSubMatrix(matrix, 0, i));
    }
    return sum;
  }

  /**
   * Determine the sign; i.e. even numbers have sign + and odds -
   * @param i
   * @return
   */
  static changeSign(i: number): number {
    if (i%2 === 0) {
      return 1;
    }
    return -1;
  }

  /**
   * Creates a submatrix excluding the given row and column
   * @param matrix
   * @param excluding_row
   * @param excluding_col
   * @return
   */
  static createSubMatrix(matrix: Matrix, excluding_row: number, excluding_col: number): Matrix {
    let mat = new Matrix(matrix.getNrows() - 1, matrix.getNcols() - 1);
    let r = -1;
    for (let i=0;i<matrix.getNrows();i++) {
      if (i === excluding_row) {
        continue;
      }
        r++;
        let c = -1;

      for (let j=0;j<matrix.getNcols();j++) {
        if (j == excluding_col) {
          continue;
        }
        mat.setValueAt(r, ++c, matrix.getValueAt(i, j));
      }
    }
    //console.log("qub matrix :", mat.toString());

    return mat;
  }

  /**
   * The cofactor of a matrix
   * @param matrix
   * @return
   */
  static cofactor(matrix: Matrix): Matrix { //  throws NoSquareException
    let mat = new Matrix(matrix.getNrows(), matrix.getNcols());
    for (let i=0;i<matrix.getNrows();i++) {
      for (let j=0; j<matrix.getNcols();j++) {
        mat.setValueAt(i, j, MatrixLibrary.changeSign(i) * MatrixLibrary.changeSign(j) * MatrixLibrary.determinant(MatrixLibrary.createSubMatrix(matrix, i, j)));
      }
    }
    return mat;
  }

  /**
   * Adds two matrices of the same dimension
   * @param matrix1
   * @param matrix2
   * @return
   */
  static add(matrix1: Matrix, matrix2: Matrix): Matrix { //  throws IllegalDimensionException
  /*
    if (matrix1.getNcols() != matrix2.getNcols() || matrix1.getNrows() != matrix2.getNrows())
      throw new IllegalDimensionException("Two matrices should be the same dimension.");
     */
    let sumMatrix = new Matrix(matrix1.getNrows(), matrix1.getNcols());

    for (let i=0; i<matrix1.getNrows(); i++) {
      for (let j=0; j<matrix1.getNcols(); j++) {
        sumMatrix.setValueAt(i, j, matrix1.getValueAt(i, j) + matrix2.getValueAt(i, j));
      }
    }
    return sumMatrix;
  }

  /**
   * subtract two matrices using the above addition method. Matrices should be the same dimension.
   * @param matrix1
   * @param matrix2
   * @return
   */
  static subtract(matrix1: Matrix, matrix2: Matrix): Matrix { // throws IllegalDimensionException
    return MatrixLibrary.add(matrix1,matrix2.multiplyByConstant(-1));
  }

    /**
   * Multiply two matrices
   *
   * @param matrix1
   * @param matrix2
   * @return
   */
  static multiply(matrix1: Matrix, matrix2: Matrix): Matrix  {
    let multipliedMatrix = new Matrix(matrix1.getNrows(), matrix2.getNcols());

    for (let i=0; i<multipliedMatrix.getNrows(); i++) {
      for (let j=0; j<multipliedMatrix.getNcols(); j++) {
        let sum = 0.0;
        for (let k=0; k<matrix1.getNcols(); k++) {
          sum += matrix1.getValueAt(i, k) * matrix2.getValueAt(k, j);
        }
        multipliedMatrix.setValueAt(i, j, sum);
      }
    }
    return multipliedMatrix;
  }
}
