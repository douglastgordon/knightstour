const SIDE_LENGTH = 8

class Graph {
  constructor() {
    this.nodes = this.makeGraph()
  }

  makeGraph() {
    const nodeBoard = Array.from(new Array(SIDE_LENGTH), () => Array.from(new Array(SIDE_LENGTH), () => new Node))
    nodeBoard.forEach((row, x) => {
      row.forEach((currentNode, y) => {
        currentNode.setPosition(x, y)
        const possibleMoves = this.findMoves(x, y)
        possibleMoves.forEach((move) => {
          const [moveX, moveY] = move
          nodeBoard[moveX][moveY].addNeighbor(currentNode)
        })
      })
    })
    return nodeBoard
  }

  findMoves(x, y) {
    const allMoves = this.findAllMoves(x, y)
    return allMoves.filter((move) => {
      return this.moveInRange(move)
    })
  }

  findAllMoves(x, y) {
    return [
      [x + 1, y + 2],
      [x + 1, y - 2],
      [x - 1, y + 2],
      [x - 1, y - 2],
      [x + 2, y + 1],
      [x + 2, y - 1],
      [x - 2, y + 1],
      [x - 2, y - 1],
    ]
  }

  moveInRange(move) {
    const [x, y] = move
    return (x >= 0 && x < SIDE_LENGTH) && (y >= 0 && y < SIDE_LENGTH)
  }
}

class Node {
  constructor() {
    this.position = [null, null]
    this.neighbors = []
    this.visited = false
  }

  setPosition(x, y) {
    this.position = [x, y]
  }

  addNeighbor(node) {
    this.neighbors.push(node)
  }

  unvisitedNeighbors() {
    return this.neighbors.filter((neighbor) => !neighbor.visited)
  }

  unvisitedNeighborsWarnsdorfRanked() {
    return this.unvisitedNeighbors().sort((fst, snd) => {
      return fst.neighbors.length - snd.neighbors.length
    })
  }
}

const findKnightsTourPath = (currentNode, path=[]) => {
  currentNode.visited = true
  path.push(currentNode)
  if (path.length < SIDE_LENGTH * SIDE_LENGTH || (!currentNode.neighbors.includes(startingNode))) {
    let done = false
    currentNode.unvisitedNeighborsWarnsdorfRanked().forEach((potentialMove) => {
      if (!done) {
        done = findKnightsTourPath(potentialMove, path)
      }
    })
    if (!done) {
      path.pop()
      currentNode.visited = false
      return false
    }
  }
  return path
}

const randomInt = (max) => {
  return Math.floor(Math.random() * max)
}

const randomNode = () => {
  return newGraph.nodes[randomInt(SIDE_LENGTH)][randomInt(SIDE_LENGTH)]
}

const newGraph = new Graph
const startingNode = newGraph.nodes[0][0]
const truePath = findKnightsTourPath(startingNode).map((node) => {
  return node.position
})

const run = () => {
  const ul = document.getElementById("list")
  newGraph.nodes.forEach((row, x) => {
    row.forEach((el, y) => {
      const li = document.createElement("li")
      li.id = `${x}-${y}`
      const fileClass = x % 2 === 0 ? "even-file" : "odd-file"
      const rankClass = y % 2 === 0 ? "even-rank" : "odd-rank"
      li.classList.add(fileClass)
      li.classList.add(rankClass)
      ul.appendChild(li)
    })
  })
  const moveLength = 1000 // ms

  const knight = document.createElement("img")
  knight.src = "knight.png"
  knight.id = "knight-image"

  const runTour = () => {
    truePath.forEach((position, idx) => {
      setTimeout(() => {
        if (knight.parentNode) { knight.parentNode.innerHTML = "" }
        const target = document.getElementById(position.join("-"))
        if (Array.from(target.classList).includes("visited")) {
          target.classList.remove("visited")
        } else {
          target.classList.add("visited")
        }
        target.appendChild(knight)
      }, moveLength * idx)
    })
  }

  runTour()
  setInterval(() => {
    runTour()
  }, moveLength * truePath.length)
}

run()
