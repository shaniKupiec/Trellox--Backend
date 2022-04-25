const boardService = require('./board.service.js')
const logger = require('../../services/logger.service')
const socketService = require('../../services/socket.service')

async function getBoards(req, res) {
  try {
    var filterBy = req.query
    logger.info('filterBy', filterBy)
    const boards = await boardService.query(filterBy)
    res.json(boards)
  } catch (err) {
    logger.error('Failed to add boards', err)
    res.status(500).send({ err: 'Failed to get boards' })
  }
}

async function getBoardById(req, res) {
  try {
    var filterBy = req.query
    const boardId = req.params.id
    var board = await boardService.getById(boardId)
    if (filterBy.type === 'sort') {
      var idx = board.groups.findIndex((g) => g.id === filterBy.groupId)
      logger.info('idx', idx)
      var newGroup = _sort(board.groups[idx], filterBy)
      logger.info('newGroup', newGroup)
      board.groups.splice(idx, 1, newGroup)
    }
    res.json(board)
  } catch (err) {
    logger.error('Failed to get board', err)
    res.status(500).send({ err: 'Failed to get board' })
  }
}

async function addBoard(req, res) {
  try {
    const board = req.body
    const addedBoard = await boardService.add(board)
    res.json(addedBoard)
  } catch (err) {
    logger.error('Failed to add board', err)
    res.status(500).send({ err: 'Failed to add board' })
  }
}

async function updateBoard(req, res) {
  try {
    logger.info('Backend updateBoard')
    const board = req.body
    const updatedBoard = await boardService.update(board)
    socketService.emitTo({ type: 'board-changed', data: board })
    res.json(updatedBoard)
  } catch (err) {
    logger.error('Failed to update board', err)
  }
}

async function removeBoard(req, res) {
  try {
    const boardId = req.params.id
    const removedId = await boardService.remove(boardId)
    res.send(removedId)
  } catch (err) {
    logger.error('Failed to remove board', err)
    res.status(500).send({ err: 'Failed to remove board' })
  }
}

module.exports = {
  getBoards,
  getBoardById,
  addBoard,
  updateBoard,
  removeBoard,
}

function _sort(group, { sortBy }) {
  if (!sortBy) return

  switch (sortBy) {
    case 'createdNew':
      group.cards.sort((c1, c2) => c2.createdAt - c1.createdAt)
      break
    case 'createdOld':
      group.cards.sort((c1, c2) => c1.createdAt - c2.createdAt)
      break
    case 'name':
      group.cards.sort((c1, c2) => c1.title.localeCompare(c2.title))
      break
    case 'dueDate':
      logger.info('dueDate')
      var cardsDue = []
      var cardsWithoutDue = []
      group.cards.forEach((c) => {
        c.dueDate ? cardsDue.push(c) : cardsWithoutDue.push(c)
      })
      ;(c) => !c.dueDate
      cardsDue.sort((c1, c2) => c1.dueDate - c2.dueDate)
      group.cards = cardsDue.concat(cardsWithoutDue)
      break
  }
  return group
}