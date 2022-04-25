const logger = require('./logger.service')

var gIo = null
var membersInBoards = {};

function connectSockets(http, session) {
  gIo = require('socket.io')(http, {
    cors: {
      origin: '*',
    },
  })
  gIo.on('connection', (socket) => {
    console.log('New socket', socket.id)

    socket.on('disconnect', (socket) => {
      console.log('Someone disconnected')
    })

    socket.on('board room', (boardId) => {
      if (socket.myRoom === boardId) return
      if (socket.myRoom) {
        socket.leave(socket.myRoom)
      }
      socket.join(boardId)
      socket.myRoom = boardId
      logger.info('borad room is', boardId)
    })

    socket.on('setMemberJoin', (memberId) => {
      socket.memberId = memberId

      if (!Object.keys(membersInBoards).includes(socket.myRoom)) {
        membersInBoards[socket.myRoom] = []
      }
      if(!membersInBoards[socket.myRoom].includes(memberId)){
        membersInBoards[socket.myRoom].push(memberId)
      }

      gIo.in(socket.myRoom).emit('updateMembersCount', membersInBoards[socket.myRoom])
    })

    socket.on('setMemberLeave', (memberId) => {
      socket.memberId = null
      const boardId = socket.myRoom
      socket.leave(socket.myRoom)
      socket.myRoom = null
      const idx = membersInBoards[boardId].findIndex((mId) => mId === memberId)
      membersInBoards[boardId].splice(idx, 1)

      gIo.in(boardId).emit('updateMembersCount', membersInBoards[boardId])
    })
  })
}

function emitTo({ type, data, label }) {
  if (label) gIo.to('watching:' + label).emit(type, data)
  else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
  logger.debug('Emiting to user socket: ' + userId)
  const socket = await _getUserSocket(userId)
  if (socket) socket.emit(type, data)
  else {
    console.log('User socket not found')
    _printSockets()
  }
}

// Send to all sockets BUT not the current socket
async function broadcast({ type, data, room = null, userId }) {
  console.log('BROADCASTING', JSON.stringify(arguments))
  const excludedSocket = await _getUserSocket(userId)
  if (!excludedSocket) {
    // logger.debug('Shouldnt happen, socket not found'
    // _printSockets();
    return
  }
  logger.debug('broadcast to all but user: ', userId)
  if (room) {
    excludedSocket.broadcast.to(room).emit(type, data)
  } else {
    excludedSocket.broadcast.emit(type, data)
  }
}

async function _getUserSocket(userId) {
  const sockets = await _getAllSockets()
  const socket = sockets.find((s) => s.userId == userId)
  return socket
}
async function _getAllSockets() {
  // return all Socket instances
  const sockets = await gIo.fetchSockets()
  return sockets
}

async function _printSockets() {
  const sockets = await _getAllSockets()
  console.log(`Sockets: (count: ${sockets.length}):`)
  sockets.forEach(_printSocket)
}
function _printSocket(socket) {
  console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}

module.exports = {
  connectSockets,
  emitTo,
  emitToUser,
  broadcast,
}
