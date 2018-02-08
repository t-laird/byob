process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(error => {
        throw error;
      });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/sadpath')
      .then(() => {
        // response.should.have.status(404);
      })
      .catch(error => {
        error.should.have.status(404);
      });
  });
});

describe('API routes', () => {
  beforeEach( (done) => {
    knex.seed.run()
      .then( () => {
        done();
      });
  });

  describe('GET /api/v1/shapes', () => {
    it('should return all the shapes from the shapes table', () => {
      return chai.request(server)
        .get('/api/v1/shapes')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.shapes.should.be.a('array');
          response.body.shapes.length.should.equal(4);
          response.body.shapes.every(shape => {
            shape.hasOwnProperty('type') && shape.hasOwnProperty('count')
          });
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('GET /api/v1/locations', () => {
    it('should return all the locations from the locations table', () => {
      return chai.request(server)
        .get('/api/v1/locations')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.locations.should.be.a('array');
          response.body.locations.length.should.equal(4);
          response.body.locations.every(location => {
            location.hasOwnProperty('city') 
            && location.hasOwnProperty('state') 
            && location.hasOwnProperty('count')
          });
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('GET /api/v1/sightings/location?city={city}&state={state}', () => {
    it('should return all sightings that match the location query params', () => {
      return chai.request(server)
        .get('/api/v1/sightings/location?city=Vero%20Beach&state=FL')
        .then((response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.sightings.should.be.a('array');
          response.body.sightings.length.should.equal(1);
          response.body.sightings.every(sighting => {
            sighting.hasOwnProperty('duration') 
            && sighting.hasOwnProperty('summary') 
            && sighting.hasOwnProperty('reported_time')
            && sighting.hasOwnProperty('location_id')
            && sighting.hasOwnProperty('shape_id')
          });
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return status of 404 if there are no matches to the query params', () => {
      return chai.request(server)
        .get('/api/v1/sightings/location?city=Denver&state=CO')
        .then((response) => {
          response.should.have.status(404);
          response.should.be.json;
        })
        .catch(error => {
          error.response.should.have.status(404);
        });
    });
  });

  describe('GET /api/v1/sightings/shape?shape={shape}', () => {
    it('should return all sightings that match the shape query params', () => {
      return chai.request(server)
        .get('/api/v1/sightings/shape?shape=Triangle')
        .then((response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.sightings.should.be.a('array');
          response.body.sightings.length.should.equal(2);
          response.body.sightings.every(sighting => {
            sighting.hasOwnProperty('duration') 
            && sighting.hasOwnProperty('summary') 
            && sighting.hasOwnProperty('reported_time')
            && sighting.hasOwnProperty('location_id')
            && sighting.hasOwnProperty('shape_id')
          });
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return status of 404 if there are no matches to the query params', () => {
      return chai.request(server)
        .get('/api/v1/sightings/shape?shape=blob')
        .then((response) => {
          response.should.have.status(404);
          response.should.be.json;
        })
        .catch(error => {
          error.response.should.have.status(404);
        });
    });
  });
});