// TODO: Revisar cada función y solucionar errores
// TODO: Crear individuos legales

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
        this.size = this.col * this.row
        this.evalIndex = this.row
    }
    createNewIndividual() {
        let ind = []
        for (let i=0;i<this.row;i++) {
            ind.push([])
            for (let j=0;j<this.col;j++) {
                if (Math.floor(Math.random() * 11) > 7) {
                    ind[i].push(true)
                } else {
                    ind[i].push(false)
                }
            }
        }
        ind[this.evalIndex] = this.evaluateInd(ind)
        return ind
    }
    crossover(ind1,ind2) {
        let turn = true
        let ind = []
        for (let i=0;i<this.row;i++) {
            ind[i] = []
            for (let j=0;j<this.col;j++) {
                if (turn) {
                    ind[i][j] = ind1[i][j]
                } else {
                    ind[i][j] = ind2[i][j]
                }
                turn = !turn
            }
        }
        return ind
    }
    mutation(ind) {
        let row = Math.floor(Math.random() * this.row)
        let col = Math.floor(Math.random() * this.col)
        ind[row][col] = !ind[row][col]
        ind[this.evalIndex] = this.evaluateInd(ind)
    }
    evaluateRows(ind) {
        let evaluation = 0
        for (let i=0; i<this.row; i++) {
            // Comparar repeticiones
            for (let j=0; j<this.col-1; j++) {
                if (!ind[i][j] && !ind[i][j+1] && this.grid[i][j] == this.grid[i][j+1]) {
                    evaluation++
                }
            }
        }
        return evaluation * 100
    }
    evaluateColumns(ind) {
        let evaluation = 0
        for (let i=0; i<this.col; i++) {
            // Comparar repeticiones
            for (let j=0; j<this.row-1; j++) {
                if (!ind[j][i] && !ind[j+1][i] && this.grid[j][i] == this.grid[j+1][i]) {
                    evaluation++
                }
            }
        }
        return evaluation * 100
    }
    countBlacks(ind) {
        let count = 0
        for (let i=0;i<this.row;i++) {
            for (let j=0;j<this.col;j++) {
                if (ind[i][j]) {
                    count++
                }
            }
        }
        return count
    }
    countBlackErrors(ind) {
        let total = 0
        for (let i=0;i<this.row;i++) {
            for (let j=0;j<this.col;j++) {
                if (ind[i][j]) {
                    if (i+1 < this.row && ind[i+1][j]) {
                        total++
                    }
                    if (j+1 < this.col && ind[i][j+1]) {
                        total++
                    }
                }
            }
        }
        return total * 100
    }
    // Enviar una copia de ind
    countConnected(row,col,ind) { // Flood fill
        if (row >= 0 && row < this.row && col >= 0 && col < this.col) {
            if (!ind[row][col]) {
                ind[row][col] = true
                let total = 1 + this.countConnected(row-1,col,ind) +
                    this.countConnected(row+1,col,ind) +
                    this.countConnected(row,col-1,ind) +
                    this.countConnected(row,col+1,ind)
                //ind[row][col] = false
                return total
            }
        }
        
        return 0
    }
    evaluateInd(ind) {
        let row = 0
        let col = 0
        for (let i=0;i<this.col;i++) {
            if (!ind[row][i]) {
                col = i
                break
            }
        }
        return this.evaluateColumns(ind) + this.evaluateRows(ind) +
            this.countBlackErrors(ind) + this.countBlacks(ind) -
            this.countConnected(row,col,this.copyInd(ind))
    }
    getBestInd(inds) {
        let best = inds[0]
        for (const ind of inds) {
            if (ind[this.evalIndex] < best[this.evalIndex]) {
                best = ind
            }
        }
        return best
    }
    terminationCondition(bestInd) {
        let blacks = this.countBlacks(bestInd)
        let row = 0
        let col = 0
        for (let i=0;i<this.col;i++) {
            if (!bestInd[row][i]) {
                col = i
                break
            }
        }
        let connecteds = this.countConnected(row,col,this.copyInd(bestInd))
        if (this.evaluateColumns(bestInd) == 0 && this.evaluateRows(bestInd) == 0 && this.countBlackErrors(bestInd) == 0 && blacks+connecteds == this.size) {
            return true
        }
        return false
    }
    searchSolution() {
        // Inicialización y evaluación
        let inds = []
        for (let i=0; i<1000;i++) {
            inds.push(this.createNewIndividual())
        }
        let bestInd = this.getBestInd(inds)
        //this.printInd(bestInd)
        // Condición de término
        while (!this.terminationCondition(bestInd)) {
            // Selección
            inds.sort(function(ind1,ind2) {
                return ind1[ind1.length] - ind2[ind2.length]
            })
            //console.log(inds.length)
            inds.splice(200,800)
            // Cruzamiento y Mutación
            for (let i=0;i<800;i++) {
                let ind1 = inds[Math.floor(Math.random() * inds.length)]
                let ind2 = inds[Math.floor(Math.random() * inds.length)]
                let crossover = this.crossover(ind1,ind2)
                this.mutation(crossover)
                inds.push(crossover)
            }
            bestInd = this.getBestInd(inds)
        }
        return bestInd
    }
    copyInd(ind) {
        let copy = [];
        for (let i = 0; i < this.row; i++) {
            copy[i] = ind[i].slice()
        }
        return copy
    }
    printInd(ind) {
        let str = ""
        for (let i=0;i<this.row;i++) {
            for (let j=0;j<this.col;j++) {
                if (ind[i][j]) {
                    str += "1"
                } else {
                    str += "0"
                }
            }
            str += "\n"
            //
        }
        console.log(str)
    }
}

let hitori = new HitoriSolver("12443/15414/43211/14325/51143")

let sol = hitori.searchSolution()
hitori.printInd(sol)