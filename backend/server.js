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


app.use(cors({ 
  origin: ['http://localhost:3000'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true,
}));
const oneWeek = 1000 * 60 * 60 * 24 * 7;
app.use(express.json());  
app.use(cookieParser()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(session({ 
  key:"userId", 
  secret:"subscribe", 
  resave: false, 
  saveUninitialized: false, 
  cookie:{ 
      
    maxAge: oneWeek,
    httpOnly: true,  // Tarayıcıdan JS ile erişilmesin (güvenlik için iyi)
    secure: false,   // HTTPS'te true yapman lazım prod'da
    sameSite: 'lax' 
    
  }
}))

app.get('/', (req, res) => {
  res.send('Backend is running!');
});
 
app.use('/com',communityRoutes);
app.use('/api', dataRoutes); 
app.use('/user', userRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
