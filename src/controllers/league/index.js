// GraphQL
const { importSchema } = require("graphql-import");
const { makeExecutableSchema } = require("graphql-tools");
const typeDefs = importSchema("./src/controllers/league/type-system.graphql");
const resolvers = require("./resolver");
const league_schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = {
  league_schema,
};
