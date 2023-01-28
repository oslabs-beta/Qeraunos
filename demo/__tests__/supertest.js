const request = require('supertest');
const server = 'http://localhost:8080';

describe('GraphQL integration', () => {
  beforeAll((done) => {
    done();
  });

  describe('POST with GraphQL', () => {
    it('should respond with a json object from graphql', () => {
      return request(server)
        .post('/graphql')
        .send({
          query: `query { person(id:89) { _id} }`,
        })
        .expect('Content-Type', /json/)
        .expect(200);
    });
    it('should response with correct response body', () => {
      const response =
        '{"graphql":{"data":{"person":{"_id":89}}},"response":"Cached"}';
      return request(server)
        .post('/graphql')
        .send({
          query: `query { person(id:89) { _id} }`,
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(response);
    });
  });
});
