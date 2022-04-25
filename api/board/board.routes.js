const express = require('express')
const { getBoards, getBoardById, addBoard, updateBoard, removeBoard } = require('./board.controller')
const router = express.Router()

router.get('/', getBoards)
router.get('/:id', getBoardById)
router.post('/', addBoard)
router.put('/:id', updateBoard)
router.delete('/:id', removeBoard)

module.exports = router