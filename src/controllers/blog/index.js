// GraphQL
const { importSchema } = require("graphql-import");
const { makeExecutableSchema } = require("graphql-tools");
const typeDefs = importSchema("./src/controllers/blog/type-system.graphql");
const { resolver } = require("./resolver");
const blog_schema = makeExecutableSchema({
  typeDefs,
  resolver,
});

module.exports = {
  blog_schema,
};
