// GraphQL
const { importSchema } = require("graphql-import");
const { makeExecutableSchema } = require("graphql-tools");
const typeDefs = importSchema("./src/controllers/blog/type-system.graphql");
const resolvers = require("./resolver");
const blog_schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = {
  blog_schema,
};
