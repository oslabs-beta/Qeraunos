# Qeraunos Server Side Caching

1. [Prerequisites](#prerequisites)
2. [Getting Started](#getting-started)
3. [Contributing](#contributing)
4. [Authors](#authors)

Qeraunos, a lightweight GraphQL caching algorithm to meet your GraphQL caching needs.

Qeraunos is a custom built middleware cache based on a mix of LFU and LRU eviction policies that adds the ability to cache GraphQL queries and mutations. With Qeraunos you have the option to either implement it utilizing client side or server side caching.

**Features**

- Server side caching abilities with our custom cache, or with the option to add Redis to extend your server side caching capacity
- Caching mutations on server side
- Efficient design with O(1) insertion, deletion, and lookup

For more complete documentation see our [website](http://qeraunos.com) and our [GitHub](https://github.com/oslabs-beta/Qeraunos).

## Prerequisites

- GraphQL integration: setting up GraphQL schemas and resolvers
- Fullstack Application: frontend sending query requests to the backend
- (Optional) Redis: If you want to integrate Redis DB into Qeraunos

## Getting Started

**Server Side Caching Installation**

1. Install Qeraunos from npm.
   ```js
   npm install @qeraunos/server
   ```
2. Import Qeraunos into your server file.
   ```js
   const Qeraunos = require('@qeraunos/server');
   ```
3. Import all your GraphQL schemas into one file like so.

   ```js
   const schema = require('./schema/schema');
   ```

4. If not using Redis, create an instance of Qeraunos by inputting just your schema if you're not using redis. Below your instance, set what size you'd want your cache to be by calling qeraunos.setSize. Then skip step 4.

   ```js
   const qeraunos = new Qeraunos(schema);
   qeraunos.setSize(num);
   ```

5. If using Redis, create an instance of qeraunos by passing in your schema, redis host, redis port, and redis password respectively, like below.

   ```js
   const qeraunos = new Qeraunos(schema, RedisHost, RedisPort, RedisPassword);
   ```

6. On your server file for your graphQL endpoint of "/graphql", simply put in qeraunos.query as your middleware and return res.locals back to your front end like this.

   ```js
   app.use('/graphql', qeraunos.query, (req: Request, res: Response) => {
     return res.status(200).send(res.locals);
   });
   ```

7. Overall, your server file might look something like this.
<p align="left"><img src="./resources/server-file-ex.png" width="500"/></p>

8. You're set to go and should find your query response times drastically reduced for cached queries!

## Contributing

We are constantly trying to improve our code so we actively welcome all pull requests! Learn how to [contribute](https://github.com/oslabs-beta/Qeraunos).

## License

Qeraunos is [MIT-licensed](https://github.com/oslabs-beta/Qeraunos/blob/dev/LICENSE).

## Authors

- Amrit Ramos
- Arthur Huynh
- Dennis Cheung
- Jason Hwang
