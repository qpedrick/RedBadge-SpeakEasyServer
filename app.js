require('dotenv').config();

const Express = require('express');
const app = Express();
const dbConnection = require('./db');

const controllers = require('./controllers');

app.use(Express.json());
app.use(require('./middleware/headers'))

app.use("/user", controllers.userController);
app.use("/story", controllers.storyController);
app.use("/job", controllers.jobController);

dbConnection.authenticate()
    .then(() => dbConnection.sync(/*{force: true}*/))
    .then(() => {
        app.listen(7770, () => {
            console.log(`[Server]: App is listening on ${process.env.PORT}.`);
        });
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error = ${err}`);
    });