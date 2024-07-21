class HitoriSolver {
    constructor(gridString) {
        let grid = [[]]
        let rowIndex = 0
        for (const char of gridString) {
            if (char == "/") {
                rowIndex++
                grid.push([])
            } else {
                grid[rowIndex].push(parseInt(char))
            }
        }
        this.grid = grid
        this.row = this.grid[0].length
        this.col = this.grid.length
    }
    evaluateRows(individual) {
        let evaluation = this.row
        for (let i = 0; i < this.row; i++) {
            // Comparar repeticiones
            let isRep = false
            for (let j=0;j<this.col; j++) {
                for (let k=j+1;k<this.col;k++) {
                    if (individual[j + i*this.row] == "0" && this.grid[i][j] == this.grid[i][k]) {
                        evaluation--
                        isRep = true
                        break
                    }
                }
                if (isRep) {
                    break
                }
                
            }
        }
        return evaluation
    }
    evaluateColumns(individual) {
        let evaluation = this.col
        for (let i=0; i<this.col; i++) {
            // Comparar repeticiones
            let isRep = false
            for (let j=0; j<this.row; j++) {
                for (let k=j+1; k<this.row; k++) {
                    if (individual[i + j*this.col] == "0" && this.grid[j][i] == this.grid[k][i]) {
                        evaluation--
                        isRep = true
                        break
                    }
                }
                if (isRep) {
                    break
                }
            }
        }
        return evaluation
    }
    isValidIndividual(individual) {
        let row = 0
        let col = 0
        let grid = []
        let countX = 0
        for (let i=0;i<this.col;i++) {
            if (individual[i] == "0") {
                col = i
                break
            }
        }
        for (let i=0;i<this.row;i++) {
            grid.push([])
            for (let j=0;j<this.col;j++) {
                grid[i].push(false)
                if (individual[j + i*this.row] == "1") {
                    grid[i][j] = true
                    countX++
                }
            }
        }
        return countX + this.countConnected(row,col,grid) == this.row*this.col
    }
    countConnected(row,col,grid) { // Flood fill
        if (row >= 0 && row < this.row && col >= 0 && col < this.col) {
            if (grid[row][col] == false) {
                grid[row][col] = true
                let total = 1 + this.countConnected(row-1,col,grid) +
                        this.countConnected(row+1,col,grid) +
                        this.countConnected(row,col-1,grid) +
                        this.countConnected(row,col+1,grid)
                return total
            }
        }
        return 0
    }
}