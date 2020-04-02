const express = require('express');
const stripe = require('stripe')('sk_test_D8IACbwrwaWinLfOZwLZoEkK00WArrMKR7');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

//Handle bars Middleware
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));
const urlencodedParser = bodyParser.urlencoded({extended: false});

// Set Static Folder
app.use(express.static(`${__dirname}/public`));

//Index Route
app.get('/', (req, res) => {
    res.render('index');
})

//Charge Route
app.post('/charge', urlencodedParser, (req, res) => {
    const amount = req.body.donationAmount*100;
    
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
      })
      .then(customer => stripe.charges.create({
        amount,
        description: 'Website donation to Fionita project',
        currency: 'gbp',
        customer: customer.id
      }))
      .then(charge => res.render('success'));
});
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});
