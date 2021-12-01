const app = require('./app')
const path = require("path")
const PORT = process.env.PORT || 5000

//routes
app
.use(require("./routes/index"))

//views
app
.set('view engine', 'ejs')

app.listen(PORT, () => console.log(`Escuchando el puerto ${ PORT }`))