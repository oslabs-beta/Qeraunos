import React from 'react';
import { ReactComponent as Overview } from '../resources/icons/overviewIcon.svg';

function About() {
  return (
    <div className='installation-display'>
      <div className='installation-header'>
        <h1>About Qeraunos</h1>
      </div>
      <div className='installation-container'>
        <h2>Overview</h2>
        <p>
          Qeraunos is a custom built middleware cache based on a mix of LFU and
          LRU eviction policies that adds the ability to cache GraphQL queries
          and mutations. With Qeraunos you have the option to either implement
          it utilizing client side or server side caching.
        </p>
        <p>
          For more complete documentation see our
          <a href='https://github.com/oslabs-beta/Qeraunos' target='blank'>
            &nbsp;Github.
          </a>
        </p>
        <h2>How it works</h2>
        <p>
          Qeraunos can be implemented on both the client side and server side,
          utilizing our custom caching algorithm to effectively store GraphQL
          queries. Our algorithm uses a mixture of LFU and LRU eviction policies
          to keep the queries you use the most, while evicting the least
          frequently and recently used for a robust and effective eviction
          policy. This efficient design allowed for the most optimal time
          complexity of O(1) for insertion, deletion, and lookup. On the client
          side, we employed LocalForage to provide faster access and larger
          storage capacity alongside our algorithm to bring query speeds down to
          under 1ms, an average decrease of around 99.8%. In fact, it's so fast,
          we thought it was an error when we saw a response time of 0ms.
          However, at this time, client side caching does not support mutations.
        </p>
        <p>
          Qeraunos utilizes the same efficient technology on the server side
          with our own custom cache. Response times are just a bit slower than
          the client side of course, but are still blazing fast with an average
          of 10ms, for an average decrease in response times of around 98%. It
          has the additional capability to cache mutations as well. With each
          mutation you make, every associated item in the cache will be updated
          with the new values from the mutation. Our custom key generator uses
          GraphQL's AST to parse through queries and join together data in a
          meaningful way that allows for advanced queries such as mutations.
        </p>
        <p>
          Additionally, since Redis is a popular database to use for caching, we
          integrated full Redis compatibility in Qeraunos on the server side.
          However, if you do choose to use Redis to cache your GraphQL queries,
          please take note that it's not nearly as fast as ours since it clocks
          in at approximately 20ms, for an average decrease of around 96%. It
          does have the benefit of a larger storage space solution if you need
          to scale though.
        </p>

        <h2>Features</h2>
        <ul>
          <li>
            Client side caching abilities harnessing the power of IndexedDB
            through localForage
          </li>
          <li>
            Server side caching abilities with our custom cache, or with the
            option to add Redis to extend your server side caching capacity
          </li>
          <li>Caching mutations on server side</li>
          <li>Efficient design with O(1) insertion, deletion, and lookup</li>
        </ul>

        <h2>Installation Guide</h2>
        <h3>Server Side Caching Installation</h3>
        <ol>
          <li>
            Install Qeraunos from npm <br />
            <code>npm install @qeraunos/server</code>
          </li>
          <li>
            Import Qeraunos into your server file. <br />
            <code> const Qeraunos = require('@qeraunos/server');</code>
          </li>
          <li>
            If not using Redis, create an instance of Qeraunos by inputting just
            your schema if you're not using redis. Below your instance, set what
            size you'd want your cache to be by calling qeraunos.setSize. Then
            skip step 4. <br />
            <code>
              const qeraunos = new Qeraunos(schema); qeraunos.setSize(num);
            </code>
          </li>
          <li>
            If using Redis, create an instance of qeraunos by passing in your
            schema, redis host, redis port, and redis password respectively,
            like below. <br />
            <code>
              const qeraunos = new Qeraunos(schema, RedisHost, RedisPort,
              RedisPassword);
            </code>
          </li>
          <li>
            On your server file for your graphQL endpoint of "/graphql", simply
            put in qeraunos.query as your middleware and return res.locals back
            to your front end like this. <br />
            <code>
              app.use&#40;'/graphql', qeraunos.query, &#40;req: Request, res:
              Response &#41; =&gt; &#123; return
              res.status(200).send(res.locals);&#125; &#41;
            </code>
          </li>
          <li>
            You're set to go and should find your query reponse times
            drastically reduced for cached queries!
          </li>
        </ol>

        <h3>Client Side Caching Installation</h3>
        <ol>
          <li>
            Install Qeraunos from npm
            <br />
            <code>npm install @qeraunos/client</code>
          </li>
          <li>
            Import QeraunosClient from ‘@qeraunos/client’ within a component
            that will be requiring a cache.
            <br />
            <code>import qeraunosClient from '@qeraunos/client';</code>
          </li>
          <li>
            Declare a new instance of QeraunosClient passing in the desired size
            of the cache as a number <br />
            <code> const qeraunos = new qeraunosClient(size)</code>
          </li>
          <li>
            To initiate the cache and query GraphQL, simply call the
            qeraunos.query method within an asynchronous function and pass in a
            query string and /grapphql endpoint as parameters <br />
            <code>qeraunos.query('queryString', 'GraphQL Endpoint');</code>
          </li>
          <li>
            When the .query method has finished executing, a response with the
            results returned from GraphQL will be provided. If this is the first
            time this has been executed, LocalForage will create a new cache
            within IndexedDB labeled “qeraunos”, and the GraphQL query and
            result will be cached as key value pairs within “qeraunos”.
          </li>
          <li>
            To access the cache, open the console on your browser and navigate
            to Application -> Storage -> IndexedDB -> localforage ->
            keyvaluepairs.
          </li>
        </ol>
      </div>
    </div>
  );
}

export default About;
