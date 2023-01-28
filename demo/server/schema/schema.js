const db = require('../models/starwarsModel');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
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
      type: PlanetType,
      resolve: async (prevProps) => {
        const id = [prevProps.homeworld_id];
        const sqlQuery = 'SELECT p.* FROM planets p WHERE p._id = $1';
        const data = await db.query(sqlQuery, id);
        return data.rows[0];
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

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    addPerson: {
      type: PersonType,
      description: 'Add a prevProps',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        mass: { type: GraphQLString },
        hair_color: { type: GraphQLString },
        skin_color: { type: GraphQLString },
        eye_color: { type: GraphQLString },
        birth_year: { type: GraphQLString },
        gender: { type: GraphQLString },
        species_id: { type: GraphQLString },
        homeworld_id: { type: GraphQLString },
        height: { type: GraphQLInt },
      },
      resolve: async (parent, args) => {
        const {
          name,
          mass,
          hair_color,
          skin_color,
          eye_color,
          birth_year,
          gender,
          species_id,
          homeworld_id,
          height,
        } = args;
        const arr = [
          name,
          mass,
          hair_color,
          skin_color,
          eye_color,
          birth_year,
          gender,
          species_id,
          homeworld_id,
          height,
        ];
        const sqlStr = `INSERT INTO 
        people (name, mass, hair_color, skin_color, eye_color, birth_year, gender, species_id, homeworld_id, height)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
        const newSQL = `SELECT * FROM people p WHERE p.name = $1 AND p.mass = $2`;
        await db.query(sqlStr, arr);
        const searchArr = [name, mass];
        const prevProps = await db.query(newSQL, searchArr);
        return prevProps.rows[0];
      },
    },
    updatePerson: {
      type: PersonType,
      args: {
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        mass: { type: GraphQLString },
        hair_color: { type: GraphQLString },
        skin_color: { type: GraphQLString },
        eye_color: { type: GraphQLString },
        birth_year: { type: GraphQLString },
        gender: { type: GraphQLString },
        species_id: { type: GraphQLString },
        homeworld_id: { type: GraphQLString },
        height: { type: GraphQLInt },
      },
      resolve: async (parent, args) => {
        //should we use coalesce instead for queries
        const searchArr = [args.id];
        const searchSQL = 'SELECT * FROM people p WHERE p._id = $1';
        const prevProps = await db.query(searchSQL, searchArr);
        let {
          id,
          name,
          mass,
          hair_color,
          skin_color,
          eye_color,
          birth_year,
          gender,
          species_id,
          homeworld_id,
          height,
        } = args;

        const legitProperties = {};
        for (let key in args) {
          if (args[key]) {
            legitProperties[key] = args[key];
          }
        }
        const updatedPerson = { ...prevProps.rows[0], ...legitProperties };
        id = updatedPerson.id;
        name = updatedPerson.name;
        mass = updatedPerson.mass;
        hair_color = updatedPerson.hair_color;
        skin_color = updatedPerson.skin_color;
        eye_color = updatedPerson.eye_color;
        birth_year = updatedPerson.birth_year;
        gender = updatedPerson.gender;
        species_id = updatedPerson.species_id;
        homeworld_id = updatedPerson.homeworld_id;
        height = updatedPerson.height;

        const arr = [
          id,
          name,
          mass,
          hair_color,
          skin_color,
          eye_color,
          birth_year,
          gender,
          species_id,
          homeworld_id,
          height,
        ];

        const sqlQuery = `UPDATE people p
        SET name = $2, mass = $3, hair_color = $4, skin_color = $5, eye_color = $6, birth_year = $7, gender = $8, species_id = $9, homeworld_id = $10, height = $11
        WHERE p._id = $1`;
        await db.query(sqlQuery, arr);
        const data = await db.query(searchSQL, searchArr);
        return data.rows[0];
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
