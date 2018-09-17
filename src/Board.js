import React from 'react'
import './Board.css';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

const CELL_SIZE = 25;

class Cell extends React.Component {
    constructor() {
        super();
        this.state = {
            numBombs: 0,
            isRevealed: false,
            isFlagged: false,
            isBomb: false,
            x: 0,
            y: 0,
        }
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRunning: true,
            isFlagClick: false,
            isWin: false,
            hadFirstClick: false,
            difficulty: 5,
            rows: 20,
            cols: 20,
            nextSize: 20,
        }
        this.board = this.makeEmptyBoard();
    }

    assignBombs = (board) => {
        for (let y = 0; y < this.state.rows; y++) {
            for (let x = 0; x < this.state.cols; x++) {
                let r = Math.floor(Math.random() * (12 - this.state.difficulty));
                if (r === 1) {
                   board[y][x].state.isBomb = true;
                }
            }
        }
    }

    calculateBombNums = (board) => {
        for (let y = 0; y < this.state.rows; y++) {
            for (let x = 0; x < this.state.rows; x++){
                if (!board[y][x].state.isBomb) {
                    let c = 0;
                    if (y > 0 && x > 0 && board[y-1][x-1].state.isBomb) { c += 1; }
                    if (y > 0 && board[y-1][x].state.isBomb) { c += 1; }
                    if (y > 0 && x < this.state.rows-1 && board[y-1][x+1].state.isBomb) { c += 1; }
                    if (x > 0 && board[y][x-1].state.isBomb) { c += 1; }
                    if (x < this.state.rows-1 && board[y][x+1].state.isBomb) { c += 1; }
                    if (y < this.state.cols-1 && x > 0 && board[y+1][x-1].state.isBomb) { c += 1; }
                    if (y < this.state.cols-1 && board[y+1][x].state.isBomb) { c += 1; }
                    if (y < this.state.cols-1 && x < this.state.rows-1 && board[y+1][x+1].state.isBomb) { c += 1; }
                    board[y][x].state.numBombs = c;
                } else {board[y][x].state.numBombs = -1;}
            }
        }
    }

    makeEmptyBoard = () => {
        var s = this.state.nextSize;
        this.state.rows = s;
        this.state.cols = s;
        let board = [];
        for (let y0 = 0; y0 < this.state.rows; y0++) {
            board[y0] = [];
            for (let x0 = 0; x0 < this.state.cols; x0++) {
                board[y0][x0] = new Cell();
                board[y0][x0].state.y = y0;
                board[y0][x0].state.x = x0;
            }
        }
        this.assignBombs(board);
        this.calculateBombNums(board);
        return board;
    }
    changeType = () => {
        if (this.state.isFlagClick) {
            this.setState({isFlagClick: false});
        } else {
            this.setState({isFlagClick: true});
        }
    }
    checkKeyPress = (e) => {
        if (e.keyCode === 32) {
            this.changeType();
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.checkKeyPress, false);
    }
    componentWillUnmount(){
        document.removeEventListener("keydown", this.checkKeyPress, false);
    }
    renderCell = (o) => {
        return (
            <div className="cell">
            {o.isRevealed ? 
                <div className={o.isBomb? "cellBomb" : "cellRevealed"} style={{
                    left: `${CELL_SIZE * o.x + 1}px`,
                    top: `${CELL_SIZE * o.y + 1}px`,
                    width: `${CELL_SIZE - 1}px`,
                    height: `${CELL_SIZE - 1}px`,
                    }}><div className={"square"+o.numBombs}>{o.numBombs > 0? o.numBombs: ''}</div>
                </div>
                :
                <div className={o.isFlagged ? "cellFlagged" : "cellNotRevealed"} style={{
                    left: `${CELL_SIZE * o.x + 1}px`,
                    top: `${CELL_SIZE * o.y + 1}px`,
                    width: `${CELL_SIZE - 1}px`,
                    height: `${CELL_SIZE - 1}px`,
                    }}>
                </div>
            }
            </div>
        );
    }
    clearBoardReverse = () => {
        for (let y = this.state.rows-1; y >= 0; y--) {
            for (let x = this.state.cols-1; x >= 0; x--) {
                //if board[y][x] has any neighbors that are numBomb=0, reveal board[x][y]
                if (y > 0 && x > 0) {
                    if (this.board[y-1][x-1].state.numBombs === 0 && this.board[y-1][x-1].state.isRevealed) { this.board[y][x].state.isRevealed = true; }
                }
                if (y > 0) {
                    if (this.board[y-1][x].state.numBombs === 0 && this.board[y-1][x].state.isRevealed) { this.board[y][x].state.isRevealed = true; }
                }
                if (y > 0 && x < this.state.rows-1) {
                    if (this.board[y-1][x+1].state.numBombs === 0 && this.board[y-1][x+1].state.isRevealed) { this.board[y][x].state.isRevealed = true; }
                }
                if (x > 0) {
                    if (this.board[y][x-1].state.numBombs === 0 && this.board[y][x-1].state.isRevealed) { this.board[y][x].state.isRevealed = true; }
                }
                if (x < this.state.rows-1) {
                    if (this.board[y][x+1].state.numBombs === 0 && this.board[y][x+1].state.isRevealed) { this.board[y][x].state.isRevealed = true; }
                }
                if (y < this.state.cols-1 && x > 0) {
                    if (this.board[y+1][x-1].state.numBombs === 0 && this.board[y+1][x-1].state.isRevealed) { this.board[y][x].state.isRevealed = true; }
                }
                if (y < this.state.cols-1) {
                    if (this.board[y+1][x].state.numBombs === 0 && this.board[y+1][x].state.isRevealed) { this.board[y][x].state.isRevealed = true; }
                }
                if ( y < this.state.cols-1 && x < this.state.rows-1) {
                    if (this.board[y+1][x+1].state.numBombs === 0 && this.board[y+1][x+1].state.isRevealed) { this.board[y][x].state.isRevealed = true; }
                }
            }
        }
    }
    clearBoard = () => {
        for (let y = 0; y < this.state.rows; y++) {
            for (let x = 0; x < this.state.cols; x++) {
                //if board[y][x] has any neighbors that are numBomb=0, reveal board[x][y]
                if (y > 0 && x > 0) {
                    if (this.board[y-1][x-1].state.numBombs === 0 && this.board[y-1][x-1].state.isRevealed) { this.board[y][x].state.isRevealed = true; }
                }
                if (y > 0) {
                    if (this.board[y-1][x].state.numBombs === 0 && this.board[y-1][x].state.isRevealed) { this.board[y][x].state.isRevealed = true; }
                }
                if (y > 0 && x < this.state.rows-1) {
                    if (this.board[y-1][x+1].state.numBombs === 0 && this.board[y-1][x+1].state.isRevealed) { this.board[y][x].state.isRevealed = true; }
                }
                if (x > 0) {
                    if (this.board[y][x-1].state.numBombs === 0 && this.board[y][x-1].state.isRevealed) { this.board[y][x].state.isRevealed = true; }
                }
                if (x < this.state.rows-1) {
                    if (this.board[y][x+1].state.numBombs === 0 && this.board[y][x+1].state.isRevealed) { this.board[y][x].state.isRevealed = true; }
                }
                if (y < this.state.cols-1 && x > 0) {
                    if (this.board[y+1][x-1].state.numBombs === 0 && this.board[y+1][x-1].state.isRevealed) { this.board[y][x].state.isRevealed = true; }
                }
                if (y < this.state.cols-1) {
                    if (this.board[y+1][x].state.numBombs === 0 && this.board[y+1][x].state.isRevealed) { this.board[y][x].state.isRevealed = true; }
                }
                if ( y < this.state.cols-1 && x < this.state.rows-1) {
                    if (this.board[y+1][x+1].state.numBombs === 0 && this.board[y+1][x+1].state.isRevealed) { this.board[y][x].state.isRevealed = true; }
                }
            }
        }
    }

    aroundZeros = (y, x) => {
        if (!(y > 0 && x > 0 && x < this.state.rows-1 && y < this.state.cols-1)) {
            return;
        } else {
            this.board[y-1][x-1].state.isRevealed = true;
            this.board[y-1][x].state.isRevealed = true;
            this.board[y-1][x+1].state.isRevealed = true;
            this.board[y][x-1].state.isRevealed = true;
            this.board[y][x+1].state.isRevealed = true;
            this.board[y+1][x-1].state.isRevealed = true;
            this.board[y+1][x].state.isRevealed = true;
            this.board[y+1][x+1].state.isRevealed = true;
            this.clearBoard();
            this.clearBoardReverse();
            this.clearBoard();
            this.clearBoardReverse();
        }
    }
    handleClick = (event) => {
        let x = Math.floor(event.clientX / CELL_SIZE);
        let y = Math.floor(event.clientY / CELL_SIZE);

        // Make sure first click is not a bomb and readjust
        if (!this.state.hadFirstClick && !this.state.isFlagClick) {
            this.setState({hadFirstClick: true})
            this.board[y][x].state.isBomb = false;
            this.calculateBombNums(this.board);
        }
        if (!this.state.isFlagClick) {
            this.board[y][x].state.isRevealed = true;
            if (this.board[y][x].state.numBombs === 0) {
                this.aroundZeros(y, x)
            }
            this.checkWin();
            if (this.board[y][x].state.isBomb) {
                this.setState({isRunning: false})
                this.setState({isWin: false})
                this.setState({isRunning: false})
                for (let i = 0; i < this.state.cols; i++) {
                    for (let j = 0; j < this.state.rows; j++) {
                        this.board[i][j].state.isRevealed = true;
                    }
                }
            }
        } else {
            if (this.board[y][x].state.isFlagged) {
                this.board[y][x].state.isFlagged = false;
            } else { this.board[y][x].state.isFlagged = true; }
        }
        this.setState({board: this.board});
    }
    checkWin = () => {
        let c = true;
        if (this.state.isRunning) {
            for (let i = 0; i < this.state.cols; i++) {
                for (let j = 0; j < this.state.rows; j++) {
                    if (!this.board[i][j].state.isRevealed && !this.board[i][j].state.isFlagged) {c = false;}
                }
            }
            if (c) {
                this.setState({isWin: true})
            }
        }
    }
    handleNew = () => {
        this.setState({board: [], isWin: false, isRunning: true, hadFirstClick: false, rows: this.state.nextSize, cols: this.state.nextSize});
        this.board = this.makeEmptyBoard();
    }
    renderBoard = () => {
        return this.board.map((datarow) => {
            return datarow.map((dataitem) => {
                return (
                    <div onClick={this.handleClick.bind(this)}>
                        {this.renderCell(this.board[dataitem.state.y][dataitem.state.x].state)}
                    </div>
                );
            });
        });
    }
    render(props) {
        const { isRunning, isFlagClick, isWin} = this.state;
        return (
            <div className="wrapper">
                <div className="board"
                style={{ width: CELL_SIZE*this.state.cols, height: CELL_SIZE*this.state.rows, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}>
                    <div>
                        {this.renderBoard()}
                    </div>
                </div>
                <div className="controls">
                    <div className="controlsItem">
                        {isFlagClick ?
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={this.changeType}
                                data-toggle="tooltip" data-placement="top" title="Press spacebar to toggle">
                                Change to Regular Click
                            </button> :
                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={this.changeType}
                                data-toggle="tooltip" data-placement="top" title="Press spacebar to toggle">
                                Change to Flag Click
                            </button>
                        }
                        {isWin ?
                            <div className="alert alert-success">You Win!</div> : <div className={isRunning? "alert alert-primary" : "alert alert-danger"}>
                                {isRunning ? "Keep going!" : "Game Over!"}
                            </div>
                        }
                        <form className="form">
                        <p>Difficulty</p>
                            <InputRange
                            maxValue={10}
                            minValue={1}
                            value={this.state.difficulty}
                            onChange={value => this.setState({ difficulty: value })}
                            />
                        </form>
                        <form className="form">
                        <p>Grid Size</p>
                            <InputRange
                            maxValue={30}
                            minValue={5}
                            value={this.state.nextSize}
                            onChange={value => this.setState({ nextSize: value })}
                            />
                        </form>
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={this.handleNew}>
                            New Game
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Board;