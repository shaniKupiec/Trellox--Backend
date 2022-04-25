const authService = require('./auth.service')
const logger = require('../../services/logger.service')

module.exports = {
  login,
  signup,
  logout,
}

async function login(req, res) {
  const { email, password } = req.body
  try {
    const user = await authService.login(email, password)
    req.session.user = user
    res.json(user)
  } catch (err) {
    logger.error('Failed to Login ' + err)
    res.status(401).send({ err: 'Failed to Login' })
  }
}

async function signup(req, res) {
  try {
    const { fullname, username, email, password, isAdmin, boardIds, imgUrl } = req.body
    // Never log passwords
    // logger.debug(fullname + ', ' + username + ', ' + password)
    const account = await authService.signup(fullname, username, email, password, isAdmin, boardIds, imgUrl)
    logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
    const user = await authService.login(email, password)
    req.session.user = user
    res.json(user)
  } catch (err) {
    logger.error('Failed to signup ' + err)
    res.status(500).send({ err: 'Failed to signup' })
  }
}

async function logout(req, res) {
  try {
    req.session.destroy()
    res.send({ msg: 'Logged out successfully' })
  } catch (err) {
    res.status(500).send({ err: 'Failed to logout' })
  }
}
