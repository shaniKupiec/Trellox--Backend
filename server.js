const express = require('express');
const cors = require('cors');
const path = require('path');
const expressSession = require('express-session')
const app = express();
const http = require('http').createServer(app);

const session = expressSession({
    secret: 'trellox best app ever',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})

app.use(express.json());
app.use(session);
app.use(express.static('public'));


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true,
        "Access-Control-Allow-Headers":true
    };
    app.use(cors(corsOptions));
}

const boardRoutes = require('./api/board/board.routes');
const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const {connectSockets} = require('./services/socket.service')

app.use('/api/board', boardRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
connectSockets(http, session)

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const logger = require('./services/logger.service');
const port = process.env.PORT || 3030;
http.listen(port, () => {
    logger.info('Server is running on port: ' + port);
});
