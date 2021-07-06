const express = require('express');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const homeRouter = require('./routes/home');
const coursesRouter = require('./routes/courses');
const addRouter = require('./routes/add');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const exhbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const MONGODB_URI = 'mongodb://localhost:27017/nodejs';


const app = express();

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
});

app.engine('hbs', exhbs({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.set('view engine', 'hbs');
app.set('views', 'views');


app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRouter);
app.use('/courses', coursesRouter);
app.use('/add', addRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);
app.use('/auth', authRouter);



const PORT = process.env.port || 3000;

async function start() {
    try {
        await mongoose.connect(MONGODB_URI, {  // before the server starts - it will try to connect to local mongodb server, "test" - is the DB name
            useNewUrlParser: true,  // params which should be included for proper mongodb connection
            useFindAndModify: false,  // params which should be included for proper mongodb connection
            useUnifiedTopology: true  // params which should be included for proper mongodb connection
        });

        app.listen(3000, () => {
            console.log(`Server has started at port ${PORT}`)
        });
        console.log('MongoDB Started.');

    } catch (e) {
        console.log('Error', e);
    }


}

start();






