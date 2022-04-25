const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const logger = require('../../services/logger.service')

async function query(filterBy) {
  const criteria = {}
  try {
    const collection = await dbService.getCollection('board')
    var boards = await collection.find(criteria).toArray()
    return boards
  } catch (err) {
    throw err
  }
}

async function getById(boardId) {
  try {
    const collection = await dbService.getCollection('board')
    const board = collection.findOne({ _id: ObjectId(boardId) })
    return board
  } catch (err) {
    logger.error(`cannot find board: ${boardId}`, err)
    throw err
  }
}

async function add(board) {
  try {
    const collection = await dbService.getCollection('board')
    const {ops} = await collection.insertOne(board)
    return ops[0]
  } catch (err) {
    logger.error('cannot insert board', err)
    throw err
  }
}

async function update(board) {
  try {
    var id = ObjectId(board._id)
    delete board._id
    const collection = await dbService.getCollection('board')
    await collection.updateOne({ _id: id }, { $set: { ...board } })
    board._id = id
    return board
  } catch (err) {
    logger.error(`cannot update board ${board._id}`, err)
    throw err
  }
}

async function remove(boardId) {
  try {
    const collection = await dbService.getCollection('board')
    await collection.deleteOne({ _id: ObjectId(boardId) })
    return boardId
  } catch (err) {
    logger.error(`cannot remove board ${boardId}`, err)
    throw err
  }
}

module.exports = {
  query,
  getById,
  add,
  update,
  remove,
}