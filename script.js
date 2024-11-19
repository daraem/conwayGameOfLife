const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const viewportHeight = window.innerHeight;
const canvasHeight = viewportHeight - (0.07 * viewportHeight) - (0.20 * viewportHeight);

canvas.width = canvas.offsetWidth;
canvas.height = canvasHeight;

ctx.fillStyle = '#808080';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const gridSize = 50;
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 1;

function drawGrid() {
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }    
}

function drawGridRect(x, y) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(x, y, 50, 50)

    ctx.beginPath();
    ctx.moveTo(x, y)
    ctx.lineTo(x + 50, y)
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + 50)
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 50, y)
    ctx.lineTo(x + 50, y + 50)
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y + 50)
    ctx.lineTo(x + 50, y + 50)
    ctx.stroke();
}

let lifeGrids = new Array;
function drawLife(x, y) {
    const rect = canvas.getBoundingClientRect()
    let mouseX = x - rect.left
    let mouseY = y - rect.top

    let col = Math.floor(mouseX / gridSize)
    let row = Math.floor(mouseY / gridSize)

    let point = [row * 50, col * 50]
    if(ctx.getImageData(mouseX, mouseY, 1, 1).data[0] == 128) {
        ctx.fillStyle = "yellow"
        ctx.fillRect(point[1], point[0], 50, 50)
        lifeGrids.push(point)
    } else {
        drawGridRect(point[1], point[0])
        lifeGrids = lifeGrids.filter(item => item !== lifeGrids.find((e) => e[0] == point[0] && e[1] == point[1]))
    }
}

function simulation() {
    const interval = setInterval(() => {
        if(document.getElementsByTagName("button")[0].innerHTML === "Stop") {
            const rows = canvas.height / gridSize; 
            const cols = canvas.width / gridSize; 
            let gridState = []

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = col * gridSize;
                    const y = row * gridSize;
                    let color = ctx.getImageData(x + 25, y - 25,1,1).data[0]
                    gridState.push({x: col, y: row, color: color})
                }
            }

            gridState.forEach((cell, index) => {
                const directions = [
                    { dx: 0, dy: 1 },  { dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
                    { dx: 1, dy: 1 },  { dx: -1, dy: 1 }, { dx: 1, dy: -1 }, { dx: -1, dy: -1 },
                ];
            
                const getNeighborState = (dx, dy) => {
                    const neighbor = gridState.find(n => n.x === cell.x + dx && n.y === cell.y + dy);
                    return neighbor ? (neighbor.color === 255 ? 1 : 0) : null;
                };
            
                const nearStates = directions.map(({ dx, dy }) => getNeighborState(dx, dy)).filter(state => state !== null);
            
                const nearAlive = nearStates.filter(state => state === 1).length;
                const nearDeath = nearStates.filter(state => state === 0).length;
            
                const drawCell = (color) => {
                    ctx.fillStyle = color;
                    const x = cell.x * 50, y = (cell.y - 1) * 50;
                    ctx.fillRect(x, y, 50, 50);
                    ctx.strokeRect(x, y, 50, 50);
                };
            
                if (cell.color === 255) {
                    if (nearAlive < 2 || nearAlive > 3) {
                        drawCell("#808080");
                    }
                } else if (nearAlive === 3) {
                    drawCell("yellow");
                }
            });
        } else {
            clearInterval(interval)
        }
    }, 500)
    document.getElementsByTagName("button")[0].innerHTML = document.getElementsByTagName("button")[0].innerHTML === "Stop" ? "Start" : "Stop"
}

document.addEventListener("mousedown", (e) => {
    drawLife(e.clientX, e.clientY)
})

drawGrid()


