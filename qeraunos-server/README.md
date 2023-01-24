# Qeraunos

Qeraunos, a lightweight GraphQL caching algorithm to meet your GraphQL caching needs.

Qeraunos is a custom built middleware cache based on a mix of LFU and LRU eviction policies that adds the ability to cache GraphQL queries and mutations. With Qeraunos you have the option to either implement it utilizing client side or server side caching.

**Features**

- Client side caching abilities harnessing the power of IndexedDB through localForage
- Server side caching abilities with our custom cache, or with the option to add Redis to extend your server side caching capacity
- Caching mutations on server side
- Efficient design with O(1) insertion, deletion, and lookup

See more complete documentation at https://qeraunos.com and https://github.com/oslabs-beta/Qeraunos.

## Prerequisites

- GraphQL integration: setting up GraphQL schemas and resolvers
- Fullstack Application: frontend sending query requests to the backend
- (Optional) Redis: If you want to integrate Redis DB into Qeraunos

## Getting Started

**Server Side Caching Installation**

1. Install Qeraunos from npm.
   ```
   npm install @qeraunos/server
   ```
2. Import Qeraunos into your server file.
   ```
   const Qeraunos = require('@qeraunos/server');
   ```
3. If not using Redis, create an instance of Qeraunos by inputting just your schema if you’re not using redis. Below your instance, set what size you’d want your cache to be by calling qeraunos.setSize. Then skip step 4.

   ```
   const qeraunos = new Qeraunos(schema);
   qeraunos.setSize(num);
   ```

4. If using Redis, create an instance of qeraunos by passing in your schema, redis host, redis port, and redis password respectively, like below.

   ```
   const qeraunos = new Qeraunos(schema, RedisHost, RedisPort, RedisPassword);
   ```

5. On your server file for your graphQL endpoint of "/graphql", simply put in qeraunos.query as your middleware and return res.locals back to your front end like this.

   ```
   app.use('/graphql', qeraunos.query, (req: Request, res: Response) => {
     return res.status(200).send(res.locals);
     });
   ```

6. You're set to go and should find your query reponse times drastically reduced for cached queries!

## Contributing

We are constantly trying to improve our code so we actively welcome all pull requests! Learn how to [contribute](https://github.com/oslabs-beta/Qeraunos).

## License

Qeraunos is [MIT-licensed](https://github.com/oslabs-beta/Qeraunos/blob/dev/LICENSE).

## Authors

- Amrit Ramos
- Arthur Huynh
- Dennis Cheung
- Jason Hwang
