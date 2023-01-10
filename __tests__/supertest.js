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
          query: `query { people { _id, name } }`,
        })
        .expect('Content-Type', /json/)
        .expect(200);
    });
    it('should response with correct response body', () => {
      const response =
        '{"data":{"people":[{"_id":1,"name":"Luke Skywalker"},{"_id":2,"name":"C-3PO"},{"_id":3,"name":"R2-D2"},{"_id":4,"name":"Darth Vader"},{"_id":5,"name":"Leia Organa"},{"_id":6,"name":"Owen Lars"},{"_id":7,"name":"Beru Whitesun lars"},{"_id":8,"name":"R5-D4"},{"_id":9,"name":"Biggs Darklighter"},{"_id":10,"name":"Obi-Wan Kenobi"},{"_id":11,"name":"Anakin Skywalker"},{"_id":12,"name":"Wilhuff Tarkin"},{"_id":13,"name":"Chewbacca"},{"_id":14,"name":"Han Solo"},{"_id":15,"name":"Greedo"},{"_id":16,"name":"Jabba Desilijic Tiure"},{"_id":18,"name":"Wedge Antilles"},{"_id":19,"name":"Jek Tono Porkins"},{"_id":20,"name":"Yoda"},{"_id":21,"name":"Palpatine"},{"_id":22,"name":"Boba Fett"},{"_id":23,"name":"IG-88"},{"_id":24,"name":"Bossk"},{"_id":25,"name":"Lando Calrissian"},{"_id":26,"name":"Lobot"},{"_id":27,"name":"Ackbar"},{"_id":28,"name":"Mon Mothma"},{"_id":29,"name":"Arvel Crynyd"},{"_id":30,"name":"Wicket Systri Warrick"},{"_id":31,"name":"Nien Nunb"},{"_id":32,"name":"Qui-Gon Jinn"},{"_id":33,"name":"Nute Gunray"},{"_id":34,"name":"Finis Valorum"},{"_id":36,"name":"Jar Jar Binks"},{"_id":37,"name":"Roos Tarpals"},{"_id":38,"name":"Rugor Nass"},{"_id":39,"name":"Ric Olié"},{"_id":40,"name":"Watto"},{"_id":41,"name":"Sebulba"},{"_id":42,"name":"Quarsh Panaka"},{"_id":43,"name":"Shmi Skywalker"},{"_id":44,"name":"Darth Maul"},{"_id":45,"name":"Bib Fortuna"},{"_id":46,"name":"Ayla Secura"},{"_id":48,"name":"Dud Bolt"},{"_id":49,"name":"Gasgano"},{"_id":50,"name":"Ben Quadinaros"},{"_id":51,"name":"Mace Windu"},{"_id":52,"name":"Ki-Adi-Mundi"},{"_id":53,"name":"Kit Fisto"},{"_id":54,"name":"Eeth Koth"},{"_id":55,"name":"Adi Gallia"},{"_id":56,"name":"Saesee Tiin"},{"_id":57,"name":"Yarael Poof"},{"_id":58,"name":"Plo Koon"},{"_id":59,"name":"Mas Amedda"},{"_id":60,"name":"Gregar Typho"},{"_id":61,"name":"Cordé"},{"_id":62,"name":"Cliegg Lars"},{"_id":63,"name":"Poggle the Lesser"},{"_id":64,"name":"Luminara Unduli"},{"_id":65,"name":"Barriss Offee"},{"_id":66,"name":"Dormé"},{"_id":67,"name":"Dooku"},{"_id":68,"name":"Bail Prestor Organa"},{"_id":69,"name":"Jango Fett"},{"_id":70,"name":"Zam Wesell"},{"_id":71,"name":"Dexter Jettster"},{"_id":72,"name":"Lama Su"},{"_id":73,"name":"Taun We"},{"_id":74,"name":"Jocasta Nu"},{"_id":47,"name":"Ratts Tyerell"},{"_id":75,"name":"R4-P17"},{"_id":76,"name":"Wat Tambor"},{"_id":77,"name":"San Hill"},{"_id":78,"name":"Shaak Ti"},{"_id":79,"name":"Grievous"},{"_id":80,"name":"Tarfful"},{"_id":81,"name":"Raymus Antilles"},{"_id":82,"name":"Sly Moore"},{"_id":83,"name":"Tion Medon"},{"_id":84,"name":"Finn"},{"_id":85,"name":"Rey"},{"_id":86,"name":"Poe Dameron"},{"_id":87,"name":"BB8"},{"_id":88,"name":"Captain Phasma"},{"_id":35,"name":"Padmé Amidala"}]}}';
      return request(server)
        .post('/graphql')
        .send({
          query: `query { people { _id, name } }`,
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(response);
    });
  });

  //   describe('Cache response time', () => {
  //     it('Cache hit response time should be under 30 ms', () => {
  //       const firstStart = Date.now();
  //       request(server)
  //         .post('/graphql')
  //         .send({
  //           query: `query { people { _id, name, mass } }`,
  //         })
  //         .then(() => {
  //           console.log(Date.now() - firstStart);
  //         });
  //       const startTime = Date.now();
  //       console.log(startTime);
  //       return (
  //         request(server)
  //           .post('/graphql')
  //           .send({
  //             query: `query { people { _id, name, mass } }`,
  //           })
  //           .then(() => {
  //             console.log(Date.now() - startTime);
  //           })
  //           // .expect('Content-Type', /json/)
  //           .expect(Date.now() - startTime < 60)
  //       );
  //     });
  //   });
});

// describe('POST /users', function () {
//   it('responds with json', function (done) {
//     request(app)
//       .post('/users')
//       .send({ name: 'john' })
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .end(function (err, res) {
//         if (err) return done(err);
//         return done();
//       });
//   });
// });
