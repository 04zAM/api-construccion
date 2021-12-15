const app = require("./app");
const path = require("path");
const PORT = process.env.PORT || 5000;

//routes
app.use(require(path.join(__dirname, "routes")));

//views
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Escuchando el puerto ${PORT}`);
  console.log(`GraphQL-API Pizza listen http://localhost:${PORT}/graphql/movie`);
  console.log(`GraphiQL listen http://localhost:${PORT}/graphql/graphiql`);
});
