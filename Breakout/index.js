const grid = document.querySelector(".grid")
const blockWidth = 100
const blockHeight = 20
const boardWidth = 560
const boardHeight = 300
const ballDiameter = 20
const scoreDisplay = document.querySelector("#score")
let timerId 
let xDirection = -2
let yDirection = 2
let score = 0

const userStart = [230, 10]
let currentPosition = userStart

const ballStart = [270, 40]
let ballCurrentPosition = ballStart

//crear bloque
class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    }
}

//todos los bloques
const blocks = [
    new Block(10,270),
    new Block(120,270),
    new Block(230,270),
    new Block(340,270),
    new Block(450,270),
    new Block(10,240),
    new Block(120,240),
    new Block(230,240),
    new Block(340,240),
    new Block(450,240),
    new Block(10,210),
    new Block(120,210),
    new Block(230,210),
    new Block(340,210),
    new Block(450,210),
]

//dibujar todos los bloques
function addBlocks() {
    for (let i = 0; i < blocks.length; i++) {
        const block = document.createElement("div") //esto va a crear los divs que van a ser los bloques a romper
        block.classList.add("block") //no hace falta poner ".block" porque ya se sabe que se añade una clase
        block.style.left = blocks[i].bottomLeft[0] + "px"
        block.style.bottom = blocks[i].bottomLeft[1] + "px"
        grid.appendChild(block) //crearle a grid un block        
    }
}

addBlocks()

//añadir jugador
const user = document.createElement("div")
user.classList.add("user")
drawUser()
grid.appendChild(user)

//dibujar jugador
function drawUser() {
    user.style.left = currentPosition[0] + "px"
    user.style.bottom = currentPosition[1] + "px"
}

//dibujar pelota
function drawBall() {
    ball.style.left = ballCurrentPosition[0] + "px"
    ball.style.bottom = ballCurrentPosition[1] + "px"
}

//move user
function moveUser(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if (currentPosition[0] > 0) {
                currentPosition[0] -= 10
                drawUser()
            }            
            break;
        case 'ArrowRight':
            if (currentPosition[0] < boardWidth - blockWidth) {
                currentPosition[0] += 10
                drawUser()
            }            
            break;
    }
}

document.addEventListener("keydown", moveUser) //<-- fundamental, hace que el programa pueda recibir la orden de tecla presionada

//añadir bola
const ball = document.createElement("div")
ball.classList.add("ball")
drawBall()
grid.appendChild(ball)

function moveBall() {
    ballCurrentPosition[0] += xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollisions()
}

timerId = setInterval(moveBall, 30)

//chequear colisiones
function checkForCollisions() { 
    //chequear colisiones bloques
    for (let i = 0; i < blocks.length; i++) {
        if (
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) && 
            ((ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1]) 
        ) {
            const allBlocks = Array.from(document.querySelectorAll(".block"))  
            allBlocks[i].classList.remove("block")
            blocks.splice(i, 1)
            changeDirection()
            score++
            scoreDisplay.innerHTML = score

            //chequear ganar
            if (blocks.length === 0) {
                scoreDisplay.innerHTML = "Ganaste!"
                clearInterval(timerId)
                document.removeEventListener("keydown", moveUser)
            }

        }
    }


    if (
        ballCurrentPosition[0] >= (boardWidth - ballDiameter) ||
        ballCurrentPosition[1] >= (boardHeight - ballDiameter) ||
        ballCurrentPosition[0] <= 0        
        ) {
        changeDirection()
    }

    //chequear colisiones usuario
    if (
        (ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)
    ) {
        changeDirection()
    }

    //game over
    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId)
        scoreDisplay.innerHTML = "Perdiste! Tu puntaje final es " + score
        document.removeEventListener("keydown", moveUser)
    }
}

function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2
        return
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2
        return
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2
        return
    }
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2
        return
    }
}