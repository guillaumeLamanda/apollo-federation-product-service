const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Product @key(fields: "id") {
    id: ID!
    name: String!
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    products: [Product!]!
  }

  type Query {
    products: [Product!]!
  }
`;

const products = [
  {
    id: 1,
    userId: 1,
    name: "IPhone"
  }
];

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    products: (root, args, context) => products
  },
  User: {
    products: (user, args, context) => {
      console.log(user, args);
      return products.filter(({ userId }) => userId !== user.id);
    }
  },
  Product: {
    __resolveReference(product, args) {
      console.log("resolveReference", product, args);
      return products[0];
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
