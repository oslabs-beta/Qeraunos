const db = require('../models/starwarsModel');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} = require('graphql');

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    _id: { type: GraphQLInt },
    name: { type: GraphQLString },
    mass: { type: GraphQLString },
    hair_color: { type: GraphQLString },
    skin_color: { type: GraphQLString },
    eye_color: { type: GraphQLString },
    birth_year: { type: GraphQLString },
    gender: { type: GraphQLString },
    species_id: { type: GraphQLInt },
    homeworld_id: { type: GraphQLInt },
    height: { type: GraphQLInt },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    people: {
      type: new GraphQLList(PersonType),
      resolve: async (parent, args) => {
        const sqlQuery = `SELECT * FROM people`;
        const data = await db.query(sqlQuery);
        return data.rows;
      },
    },
    person: {
      type: new GraphQLList(PersonType),
      args: { id: { type: GraphQLInt } },
      resolve: async (parent, args) => {
        const sqlQuery = `SELECT * FROM people WHERE _id=${args.id}`;
        const data = await db.query(sqlQuery);
        return data.rows;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
