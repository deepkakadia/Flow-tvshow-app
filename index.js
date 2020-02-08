const express = require("express");
const app = express();
const configRoutes = require("./routes");
const bodyParser = require("body-parser");
const exphbs = require('express-handlebars');
const static = express.static(__dirname + '/public');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', static);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
configRoutes(app);


app.listen(3000, () => {
    console.log("We have a Server Now!");
    console.log("Your routes will be running on port 3000")
});