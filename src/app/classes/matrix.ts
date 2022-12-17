export class Matrix {

  private nrows!: number;
  private ncols!: number;
  private data: number[][] | null;


  //if (arguments.length === 0) {
  /*
  constructor(data) {
   this.data = data;
   this.nrows = dat.length;
   this.ncols = dat[0].length;
   }

   constructor(nrow, ncol) {
   this.nrows = nrow;
   this.ncols = ncol;
   this.data = new double[nrow][ncol];
   }
   */

  constructor(nrows: number, ncols: number) {

      //print("matrice choix 2");
      this.nrows = nrows;
      this.ncols = ncols;
      //print("nrows : " + this.nrows + " ncols : " + this.ncols);
      this.data = new Array(this.nrows);
      for (let i=0; i<this.nrows; i++) {
        this.data[i] = new Array(this.ncols);
      }
  }

  getNrows(): number {
    return this.nrows;
  }

  setNrows(nrows: number): void {
    this.nrows = nrows;
  }

  getNcols(): number {
    return this.ncols;
  }

  setNcols(ncols: number): void {
    this.ncols = ncols;
  }

  getValues(): number[][] | null {
    return this.data;
  }

  setValues(values: number[][]): void {
    this.data = values;
  }

  setValueAt(row: number, col: number, value: number): void {
    if(this.data != null) {
      this.data[row][col] = value;
    }
  }

  getValueAt(row: number, col: number): number | any {
    if(this.data != null) {
      //console.log("get value at : ", row, ":", col, ":", this.data[row][col]);

      return this.data[row][col];
    }
    return null as any;
  }

  isSquare(): boolean {
    if (this.nrows === this.ncols) {
      return true;
    }
    else {
     return false;
    }
  }

  getSize(): number {
    if (this.isSquare()) {
      return this.nrows;
    }
    return -1;
  }

  multiplyByConstant(constant: number): Matrix {
    let mat = new Matrix(this.nrows, this.ncols);
    for (let i = 0; i < this.nrows; i++) {
      for (let j = 0; j < this.ncols; j++) {
        if (this.data != null) {
          mat.setValueAt(i, j, this.data[i][j] * constant);
        }

      }
    }
    return mat;
  }

  insertColumnWithValue1() {
    let X_ = new Matrix(this.getNrows(), this.getNcols()+1);
    for (let i=0; i<X_.getNrows(); i++) {
      for (let j=0; j<X_.getNcols(); j++) {
        if (j === 0) {
          X_.setValueAt(i, j, 1.0);
        } else {
          if(this.getValueAt(i, j-1) !== null) {
            X_.setValueAt(i, j, this.getValueAt(i, j-1));
          }

        }
      }
    }
    return X_;
  }

  toString() {
    let textToReturn = "";
    for (let i=0; i<this.getNrows(); i++) {
      textToReturn += "l" + i + " :: ";
      for (let j=0; j<this.getNcols(); j++) {
        textToReturn += this.getValueAt(i, j) + " : ";
      }
      textToReturn += "\n";
    }
    textToReturn += "\n";
    return textToReturn;
  }
}
