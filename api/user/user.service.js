const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const { ObjectId } = require('mongodb')

module.exports = {
  query,
  getById,
  getByEmail,
  add,
}

async function query() {
  try {
    const criteria = {}
    const collection = await dbService.getCollection('user')
    var users = await collection.find(criteria).toArray()
    users = users.map((user) => {
      delete user.password
      user.createdAt = ObjectId(user._id).getTimestamp()

      return user
    })
    return users
  } catch (err) {
    logger.error('cannot find users', err)
    throw err
  }
}

async function getById(userId) {
  try {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ _id: ObjectId(userId) })
    delete user.password
    return user
  } catch (err) {
    logger.error(`while finding user ${userId}`, err)
    throw err
  }
}
async function getByEmail(email) {
  try {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ email })
    return user
  } catch (err) {
    logger.error(`while finding user ${email}`, err)
    throw err
  }
}

async function add(user) {
  console.log('user', user)
  try {
    const userToAdd = {
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin,
      boardIds: user.boardIds,
      imgUrl: user.imgUrl,
    }
    const collection = await dbService.getCollection('user')
    await collection.insertOne(userToAdd)
    return userToAdd
  } catch (err) {
    logger.error('cannot insert user', err)
    throw err
  }
}
