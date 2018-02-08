process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

let userData = {
  email: 'abcd@gmail.com',
  appName: 'jkl'
};

let adminData = {
  email: 'admin@turing.io',
  appName: 'zyx'
};

let userToken,
    adminToken;

describe('API routes', () => {
  beforeEach( (done) => {
    chai.request(server)
      .post('/api/v1/authenticate')
      .send(userData)
      .then(res => {
        userToken = res.body;
      })
      .then(() => {
        chai.request(server)
          .post('/api/v1/authenticate')
          .send(adminData)
          .then(res => {
            adminToken = res.body;
          });
      })
      .then(() => {
        knex.seed.run()
          .then( () => {
            done();
          });
      });
  });

  describe('GET /api/v1/shapes', () => {
    it('should return all the shapes from the shapes table', () => {

    });
  });

  describe('GET /api/v1/locations', () => {
    it('should return all the locations from the locations table', () => {
      
    });
  });

  describe('GET /api/v1/sightings/?city={city}&state={state}', () => {

  });

  
  
  
  
  
  
  
  
  
  
  describe('PATCH /api/v1/sightings/:id/summary', () => {
    it('should return a 200 and the successfully updated id', () => {
      return chai.request(server)
        .patch('/api/v1/sightings/3/summary')
        .send({ summary: 'it was crazy'})
        .set('token', adminToken)
        .then((response) => {
          response.should.have.status(200);
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return a 422 given an invalid summary', () => {
      return chai.request(server)
        .patch('/api/v1/sightings/3/summary')
        .send({cat: '123'})
        .set('token', adminToken)
        .then(() => {

        })
        .catch(error => {
          error.should.have.status(422);
          error.response.body.error.should.match(/Error invalid summary/);
        });
    });
  });

  describe('PATCH /api/v1/sightings/:id/duration', () => {
    it('should return a 200 and the successfully updated id', () => {
      return chai.request(server)
        .patch('/api/v1/sightings/3/duration')
        .send({ duration: 'i passed out and woke up 3 years later'})
        .set('token', adminToken)        
        .then((response) => {
          response.should.have.status(200);
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return a 422 given an invalid duration', () => {
      return chai.request(server)
        .patch('/api/v1/sightings/3/duration')
        .send({cat: '123'})
        .set('token', adminToken)
        .then(() => {

        })
        .catch(error => {
          error.should.have.status(422);
          error.response.body.error.should.match(/Error invalid duration/);
        });
    })
  });

  describe('DELETE /api/v1/sightings', () => {
    it('should delete all sightings for a location', () => {
      return chai.request(server)
        .del('/api/v1/sightings?city=Roanoke&state=VA')
        .set('token', adminToken)        
        .then((response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.status.should.match(/Successfully deleted/);
        })
        .catch(error => {
          throw error;
        });
    });

    it.skip('should return an error when trying to delete all sightings from a location that doesn\'t exist', () => {
      return chai.request(server)
        .del('/api/v1/sightings?city=sdlkfj&state=ZZ')
        .then(() => {

        })
        .catch(error => {
          error.should.have.status(404);
          error.body.error.should.match(/Could not find location /);
        });
    });
  });


  describe('DELETE /api/v1/sightings/:id', () => {
    it('should delete all sightings for a location', () => {
      return chai.request(server)
        .del('/api/v1/sightings/4')
        .set('token', adminToken)        
        .then((response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.status.should.match(/Success deleting/);
        })
        .catch(error => {
          throw error;
        });
    });

    it('should return an error when trying to delete a sighting that doesn\'t exist', () => {
      return chai.request(server)
        .del('/api/v1/sightings/5')
        .set('token', adminToken)
        .then(() => {

        })
        .catch(error => {
          error.should.have.status(404);
          error.body.error.should.match(/Error deleting/);
        });
    });
  });

  describe('POST /api/v1/authenticate', () => {
    it ('should response with the generated token', () => {
      return chai.request(server)
        .post('/api/v1/authenticate')
        .send({ email: 'abc', appName: '123'})
        .then(response => {
          response.should.have.status(200);
          response.body.should.be.a('string');
        })
        .catch(error => {
          throw error;
        });
    });

    it ('should respond with an error if missing a param', () => {
      return chai.request(server)
        .post('/api/v1/authenticate')
        .send({email: 'abc'})
        .then(() => {

        })
        .catch(error => {
          error.should.have.status(422);
          error.body.status.should.match(/Please submit the require parameter/);
        });
    })
  });
});