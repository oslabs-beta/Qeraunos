# Qeraunos Client Side Caching

1. [Prerequisites](#prerequisites)
2. [Getting Started](#getting-started)
3. [Contributing](#contributing)
4. [Authors](#authors)

## Overview

Qeraunos, a lightweight GraphQL caching algorithm to meet your GraphQL caching needs.
Qeraunos is a custom built middleware cache based on a mix of LFU and LRU eviction policies that adds the ability to cache GraphQL queries and mutations. With Qeraunos you have the option to either implement it utilizing client side or server side caching.

Note: if you want to cache utilizing your server please download Qeraunos/Server

**Features**

- Client side caching abilities harnessing the power of IndexedDB through localForage
- Efficient design with O(1) insertion, deletion, and lookup
  See more complete documentation at http://qeraunos.com and https://github.com/oslabs-beta/Qeraunos.

## Prerequisites Client Side Caching

- GraphQL integration: setting up GraphQL schemas and resolvers
- Fullstack Application: frontend sending query requests to the backend

## Getting Started

**Client Side Caching Installation**

1. Install Qeraunos from npm

   ```sh
   npm install @qeraunos/client
   ```

2. Import QeraunosClient from '@qeraunos/client' within a component that will be requiring a cache

   ```js
   import qeraunosClient from '@qeraunos/client';
   ```

3. Declare a new instance of QeraunosClient passing in the desired size of the cache as a number

   ```js
   const qeraunos = new qeraunosClient(size);
   ```

4. To initiate the cache and query GraphQL, simply call the qeraunos.query method within an asynchronous function and pass in a query string and /grapphql endpoint as parameters

   ```js
   qeraunos.query('queryString', 'GraphQL Endpoint');
   ```

5. When the .query method has finished executing, a response with the results returned from GraphQL will be provided. If this is the first time this has been executed, LocalForage will create a new cache within IndexedDB labeled "qeraunos", and the GraphQL query and result will be cached as key value pairs within "qeraunos".

6. To access the cache, open the console on your browser and navigate to Application -> Storage -> IndexedDB -> localforage -> keyvaluepairs.

7. You're set to go and you should find your response times drastically reduced for cached queries. Enjoy impressing your fellow software engineers with a cached implementation of GraphQL!

## Contributing

We are constantly trying to improve our code so we actively welcome all pull requests! Learn how to [contribute](https://github.com/oslabs-beta/Qeraunos).

## License

Qeraunos is [MIT-licensed](https://github.com/oslabs-beta/Qeraunos/blob/dev/LICENSE).

## Authors

- Amrit Ramos
- Arthur Huynh
- Dennis Cheung
- Jason Hwang
