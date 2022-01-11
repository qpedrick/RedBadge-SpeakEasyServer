const Express = require('express');
const app = Express();

app.listen(7770, () => {
    console.log(`[Server]: App is listening on 7770.`);
});