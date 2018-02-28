// const Node = require('./Node')

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
    return (x >= 0 && x < 7) && (y >= 0 && y < 7)
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
}

const newGraph = new Graph
let truePath = []
// console.log(newGraph.nodes[0][0].neighbors)

const findKnightsTourPath = (position, path = []) => {
  const [x, y] = position
  const currentNode = newGraph.nodes[x][y]
  currentNode.visited = true
  path.push(currentNode)

  // base case
  if (path.length === (SIDE_LENGTH * SIDE_LENGTH)) {
    truePath = path.map((node) => {
      return node.position
    })
  }

  // recursive step
  currentNode.unvisitedNeighbors().forEach((neighbor) => {
    return findKnightsTourPath(neighbor.position, path)
  })
}

const run = () => {
  const startingPosition = [0, 0]
  findKnightsTourPath(startingPosition)

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

  const knight = document.createElement("img")
  knight.src = "knight.png"
  knight.id = "knight-image"

  truePath.forEach((position, idx) => {
    setTimeout(() => {
      if (knight.parentNode) { knight.parentNode.innerHTML = "" }
      const target = document.getElementById(position.join("-"))
      target.classList.add("visited")
      target.appendChild(knight)
    }, 1000 * idx)
  })
}

run()
