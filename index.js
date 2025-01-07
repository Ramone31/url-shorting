const express = require('express');

const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport=require('./config/passport')


const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// app.use(session({
//   secret: process.env.JWT_SECRET,
//   resave: false,
//   saveUninitialized: true
// }));


app.use(session({
    secret:  process.env.JWT_SECRET || 'default_secret', // You can store it in your .env file
    resave: false,
    saveUninitialized: true,
   
  }));
  

app.use(passport.initialize());
app.use(passport.session());

 const authRoutes = require('./routers/auth_route');
const urlRoutes = require('./routers/url_control_route');
const analyticsRoutes = require('./routers/analytics_route');

app.use(authRoutes);
app.use(urlRoutes);
app.use(analyticsRoutes);

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');


// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description: 'API documentation for the URL Shortener service',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
      },
    ],
  },
  apis: ['./routers/*.js'],
};


const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
