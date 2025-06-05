const express = require('express'); 
const cors = require('cors'); 
const dotenv = require('dotenv'); 
const session = require('express-session');
const bodyParser = require('body-parser'); 
const cookieParser = require('cookie-parser');
const dataRoutes = require('./routers/dataRoutes');
const userRoutes = require('./routers/userRoutes'); 
const communityRoutes = require('./routers/communityRoutes');

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: isProduction 
    ? 'https://gamebox-2ccdf.web.app' 
    : 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

const oneWeek = 1000 * 60 * 60 * 24 * 7;

app.use(express.json());  
app.use(cookieParser()); 
app.use(bodyParser.urlencoded({ extended: true })); 
if (isProduction) {
  app.set('trust proxy', 1);
}


app.use(session({ 
  key: "userId", 
  secret: "subscribe",  
  resave: false, 
  saveUninitialized: true, 
  cookie: { 
    maxAge: oneWeek,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax' 
  }
}));

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use('/com', communityRoutes);
app.use('/api', dataRoutes); 
app.use('/user', userRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
