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
    return (x >= 0 && x <= 7) && (y >= 0 && y <= 7)
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

const findKnightsTourPath = (depth, path, position) => {
  const [x, y] = position
  const currentNode = newGraph.nodes[x][y]
  currentNode.visited = true
  path.push(currentNode)
  let done
  if (depth < SIDE_LENGTH * SIDE_LENGTH) {
    done = false
    const potentialMoves = currentNode.unvisitedNeighborsWarnsdorfRanked()
    let i = 0
    while (i < potentialMoves.length && !done) {
      done = findKnightsTourPath(depth + 1, path, potentialMoves[i].position)
      i += 1
    }
    if (!done) {
      path.pop()
      currentNode.visited = false
    }
  } else {
    done = true
  }
  truePath = path.map((node) => {
    return node.position
  })
  return done
}


const newGraph = new Graph

const startingPosition = [0, 0]
let truePath = []
findKnightsTourPath(1, [], [0,0])

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
