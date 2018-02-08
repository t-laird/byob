process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

describe('API routes', () => {
  beforeEach( (done) => {
    knex.seed.run()
      .then( () => {
        done();
      });
  });

  describe('GET /api/v1/shapes', () => {
    it('should return all the shapes from the shapes table', () => {
      
    })
  });

  describe('GET /api/v1/locations', () => {
    it('should return all the locations from the locations table', () => {
      
    })
  });

  describe('GET /api/v1/sightings/?city={city}&state={state}', () => {

  });
});