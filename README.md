# Qeraunos
Qeraunos, a lightweight GraphQL caching algorithm to meet your GraphQL caching needs.

**Table of Contents**
1. Overview
2. How it works
3. Demo
4. Prerequisites
5. Installation
6. Built with
7. Roadmap
8. Contributing
9. License
10. Contact
11. Authors


## Overview
Qeraunos is a custom built middleware cache based on a mix of LFU and LRU eviction policies that adds the ability to cache GraphQL queries and mutations. With Qeraunos you have the option to either implement it utilizing client side or server side caching.

**Features**

- Client side caching abilities harnessing the power of IndexedDB through localForage
- Server side caching abilities with our custom cache, or with the option to add Redis to extend your server side caching capacity
- Caching mutations on server side
- Efficient design with O(1) insertion, deletion, and lookup

## How it works
Qeraunos can be implemented on both the client side and server side, utilizing our custom caching algorithm to effectively store GraphQL queries. Our algorithm uses a mixture of LFU and LRU eviction policies to keep the queries you use the most, while evicting the least frequently and recently used for a robust and effective eviction policy. This efficient design allowed for the most optimal time complexity of O(1) for insertion, deletion, and lookup. On the client side, we employed LocalForage to provide faster access and larger storage capacity alongside our algorithm to bring query speeds down to under 1ms, an average decrease of around 99.8%. In fact, it’s so fast, we thought it was an error when we saw a response time of 0ms. However, at this time, client side caching does not support mutations. 

Qeraunos utilizes the same efficient technology on the server side with our own custom cache. Response times are just a bit slower than the client side of course, but are still blazing fast with an average of 10ms, for an average decrease in response times of around 98%. It has the additional capability to cache mutations as well. With each mutation you make, every associated item in the cache will be updated with the new values from the mutation. Our custom key generator uses GraphQL’s AST to parse through queries and join together data in a meaningful way that allows for advanced queries such as mutations. 

Additionally, since Redis is a popular database to use for caching, we integrated full Redis compatibility in Qeraunos on the server side. However, if you do choose to use Redis to cache your GraphQL queries, please take note that it’s not nearly as fast as ours since it clocks in at approximately 20ms, for an average decrease of around 96%. It does have the benefit of a larger storage space solution if you need to scale though. 

## Demo

Please visit our website [Qeraunos](https://qeraunos.com) to see a demonstration of how our client-side and server-side caching works.

After entering our site, you will be met with our server side demonstration with the ability to run GraphQL queries and mutations with our interactive sidebar utilizing the Star Wars API.

**Server-Side Queries**
Select the fields you would like to query and a preview of the GraphQL query will be shown below. 

Click the “Run Query” button to see the GraphQL query result. The metrics on the right will show the uncached response time populated on the graph and a cache hit/miss result will be logged to the statistics below. A cache miss will be logged the first time a unique query is run indicating that the query was not found in our cache and will be stored. 

If the “Run Query” button is pressed again with the same query, you will notice that the response time has been lowered dramatically as we have a cache hit, indicating that the query data was stored in our cache instead of having to query our database.

**Server-Side Mutations**
To mutate data stored in our cache and database, select a name and property to mutate and input the updated data. Our responsive string builder will format the request into a GraphQL mutation request.

Click on “Run Mutation” to send the request for our database and cache to be updated. The data before and after the mutation will be shown below.

To test if the mutated data is stored in our cache, simply run a query with the mutated property selected to see the updated data in our cache.

**Client-side Queries**
While our client-side demonstration looks identical to the server-side, it utilizes LocalForage and IndexedDB to retrieve data even faster! Simply click on the Demo Client tab to get started.

Select the fields you would like to query and a preview of the GraphQL query will be shown below. 

Click the “Run Query” button to see the GraphQL query result. The metrics on the right will show the uncached response time populated on the graph and a cache hit/miss result will be logged to the statistics below. A cache miss will be logged the first time a unique query is run indicating that the query was not found in our cache and will be stored. 

If the “Run Query” button is pressed again with the same query, you will notice that the response time has been lowered dramatically as we have a cache hit, indicating that the query data was stored in our cache instead of having to query our database.

## Prerequisites 
GraphQL integration: setting up GraphQL schemas and resolvers

Fullstack Application: frontend sending query requests to the backend

(Optional) Redis: If you want to integrate Redis DB into Qeraunos

## Installation
**Client Side**
1. Install Qeraunos from npm
```js
npm install @qeraunos/client
```

2. Import QeraunosClient from ‘@qeraunos/client’ within a component that will be requiring a cache
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

5. When the .query method has finished executing, a response with the results returned from GraphQL will be provided. If this is the first time this has been executed, LocalForage will create a new cache within IndexedDB labeled “qeraunos”, and the GraphQL query and result will be cached as key value pairs within “qeraunos”. 

6. To access the cache, open the console on your browser and navigate to Application -> Storage -> IndexedDB -> localforage -> keyvaluepairs.

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

## Built with
- Node 
- Express 
- React 
- Recoil 
- SaSS 
- ChartJS 
- Redis 
- GraphQL 
- TypeScript 
- Jest 
- Supertest 
- Webpack 
- localForage 
- Axios

## Roadmap
**Upcoming planned features for Client Side Caching:**
- Improving efficiency of caching system so that values of database are more dynamically stored. Right now, each specific query is its own key, even when id is the same. 
- Ability to cache mutations

**Upcoming planned features for Server Side Caching:**
- Current mutation queries require a comma at the end of each listed field in order to update the cached queries. Need to clean up the key parser to remove this requirement
- Need to persist standard caching database. Currently, data is wiped out when server is killed
- Resolve N+1 graphql query problem. Calling a query with multiple fields that are object types leads to too many queries to the database from the server
- Improve efficiency of caching system so that values of database are more dynamically stored. Currently, each specific query is its own key even when id is the same
- Query parser doesn’t account for fragments, alias, operation name, or directives 
- Cache only works for POST requests and needs to account for GraphQL GET requests too
- Improve caching algorithm to remove items that have been in the cache too long if their frequency is overly large

## Contributing

We are constantly trying to improve our code so we actively welcome all pull requests! If you're interested, please follow the steps below. 
1. Fork Qeraunos
2. Pull down our dev branch with command 
```
git pull origin dev
```
3. Create your own Feature Branch with the command 
```
git checkout -b <yourFeatureName>
```
4. Add your changes with the command 
```
git add .
```
5. Stage and commit your changes with the command 
```
git commit -m "<your comment>"
```
6. Merge your branch with the dev branch locally with the command 
```
git merge dev
```
7. Resolve any merge conflicts
8. Push up your branch with the command 
```
git push origin <your feature branch name>
```
9. Open a pull request
10. Don't forget to star this repo! We look forward to your contributions!

## License

Distributed under the MIT License. See LICENSE.txt for more information.

## Contact

Visit our [website](https://qeraunos.com) to contact the team!

## Author

- Amrit Ramos
- Arthur Huynh
- Dennis Cheung
- Jason Hwang