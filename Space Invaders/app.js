const grid = document.querySelector(".grid")
const resultsDisplay = document.querySelector("#result")
let currentShooterIndex = 202
let width = 15
let direction = 1
let invadersId
let goingRight = true
let aliensRemoved = []


//crear los divs en javascript
for (let i = 0; i < 225; i++) {
    const square = document.createElement("div")
    grid.appendChild(square)
}

//selecciona los divs (todos)
const squares = Array.from(document.querySelectorAll(".grid div"))

const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

//dibuja los aliens en los divs que corresponden
function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.add("invader")
    }
}

draw()

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove("invader")
    }
}

squares[currentShooterIndex].classList.add("shooter")

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter")
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
            break
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break
    }
    console.log(currentShooterIndex)
    squares[currentShooterIndex].classList.add("shooter")
}

document.addEventListener("keydown", moveShooter)

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1 
    remove()

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            goingRight = false
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width -1
            direction = 1
            goingRight = true
        }
    }
    

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    if (squares[currentShooterIndex].classList.contains("invader", "shooter")) {
        resultsDisplay.innerHTML = "Perdiste! Tu puntaje: " + aliensRemoved.length
        clearInterval(invadersId)
        document.removeEventListener("keydown", moveShooter)
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        if (alienInvaders[i] > squares.length) {
            resultsDisplay.innerHTML = "Perdiste! Tu puntaje: " + aliensRemoved.length
            clearInterval(invadersId)
            document.removeEventListener("keydown", moveShooter)
        }
    }

}

invadersId = setInterval(moveInvaders, 300)

function shoot(e) {
    let laserId
    let currentLaserIndex = currentShooterIndex
    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser")
        if (currentLaserIndex - width >= 0) {
            currentLaserIndex -= width
            squares[currentLaserIndex].classList.add("laser")
            if (squares[currentLaserIndex].classList.contains("invader")) {
                squares[currentLaserIndex].classList.remove("laser")
                squares[currentLaserIndex].classList.remove("invader")
                squares[currentLaserIndex].classList.add("boom")

                setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 200)
                clearInterval(laserId)

                const alienRemoval = alienInvaders.indexOf(currentLaserIndex)
                alienInvaders.splice(alienRemoval,1)
                aliensRemoved.push(alienRemoval)
                resultsDisplay.innerHTML = aliensRemoved.length
                console.log(aliensRemoved)
            }

            if (alienInvaders.length <= 0) {
                resultsDisplay.innerHTML = "Ganaste!"
                clearInterval(invadersId)
                document.removeEventListener("keydown", moveShooter)
                document.removeEventListener("keydown", shoot)
            }
        }
    }
    switch(e.key) {
        case "ArrowUp":
            laserId = setInterval(moveLaser, 100)
            break
    }
}



document.addEventListener("keyup", shoot)