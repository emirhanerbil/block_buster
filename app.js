const express = require('express');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const connectDB = require('./config/database');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const trackVisits = require('./middlewares/trackVisitsMiddleware');
const http = require('http');
const requestIp = require('request-ip');
const generateSitemap = require('./middlewares/siteMapMiddleware'); // Eklediğiniz sitemap middleware

// Load environment variables
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

connectDB();

app.use(trackVisits);
app.use(requestIp.mw());

let onlineUsers = 0;

io.on('connection', (socket) => {
  onlineUsers++;
  io.emit('onlineUsers', onlineUsers);

  socket.on('disconnect', () => {
    onlineUsers--;
    io.emit('onlineUsers', onlineUsers);
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'public/admin-dashboard/admin/dist')));
app.use('/staticUser', express.static(path.join(__dirname, 'public/user-dashboard/dest')));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routerlar
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/', authRouter);

app.get('/admin', (req, res) => {
  res.render('admin/homePage', { onlineUsers: onlineUsers });
});

// Sitemap route
app.get('/sitemap.xml', generateSitemap);

app.use('*', (req, res) => {
  if (req.originalUrl.startsWith('/admin')) {
    res.status(404).render('./admin/404', {
      layout: false
    });
  } else if (req.originalUrl.startsWith('/user')) {
    res.status(404).render('./user/404', {
      layout: false
    });
  } else {
    res.status(404).render('./user/404', {
      layout: false
    });
  }
});

server.listen(3000, () => {
  console.log('server running');
});