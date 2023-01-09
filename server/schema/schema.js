const db = require('../models/starwarsModel');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
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
    homeworld: {
      type: GraphQLString,
      resolve: async (person) => {
        const id = [person.homeworld_id];
        const sqlQuery = 'SELECT p.name FROM planets p WHERE p._id = $1';
        const data = await db.query(sqlQuery, id);
        return data.rows[0].name;
      },
    },
  }),
});

const PlanetType = new GraphQLObjectType({
  name: 'Planet',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLString },
    rotation_period: { type: GraphQLInt },
    orbital_period: { type: GraphQLInt },
    diameter: { type: GraphQLInt },
    climate: { type: GraphQLString },
    gravity: { type: GraphQLString },
    terrain: { type: GraphQLString },
    surface_water: { type: GraphQLString },
    population: { type: GraphQLString },
  }),
});

const FilmType = new GraphQLObjectType({
  name: 'Film',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLString },
    episode_id: { type: GraphQLInt },
    opening_crawl: { type: GraphQLString },
    director: { type: GraphQLString },
    producer: { type: GraphQLString },
    release_date: { type: GraphQLString },
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
      type: PersonType,
      args: { id: { type: GraphQLInt } },
      resolve: async (parent, args) => {
        const sqlQuery = `SELECT * FROM people WHERE _id=${args.id}`;
        const data = await db.query(sqlQuery);
        return data.rows[0];
      },
    },
    planets: {
      type: new GraphQLList(PlanetType),
      resolve: async (parent, args) => {
        const sqlQuery = `SELECT * FROM planets`;
        const data = await db.query(sqlQuery);
        return data.rows;
      },
    },
    planet: {
      type: PlanetType,
      args: { id: { type: GraphQLInt } },
      resolve: async (parents, args) => {
        const sqlQuery = `SELECT * FROM planets WHERE _id=${args.id}`;
        const data = await db.query(sqlQuery);
        return data.rows[0];
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
