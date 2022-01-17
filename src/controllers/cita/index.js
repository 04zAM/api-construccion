// GraphQL
const { importSchema } = require("graphql-import");
const { makeExecutableSchema } = require("graphql-tools");
const typeDefs = importSchema("./src/controllers/cita/type-system.graphql");
const resolvers = require("./resolver");
const cita_schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = {
  cita_schema,
};
