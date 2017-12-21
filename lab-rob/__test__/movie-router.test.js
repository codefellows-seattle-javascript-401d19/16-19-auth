'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const movieMockFactory = require('./lib/movie-mock-factory');

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('movie-router.js', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(movieMockFactory.remove);

  describe('POST /movies', () => {
    test('should respond with a 200 status and profile if no errors', () => {
      let accountMock = null;

      return accountMockFactory.create()
        .then(mock => {
          accountMock = mock;

          return superagent.post(`${apiUrl}/movies`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .send({
              title: 'Hot Rod',
              lead: 'Andy Samberg',
              year: 2007,
              synopsis: 'Hot Rod is a super silly movie of stuntman Rod Kimble and his journey to be the best stunt man he can be.',
            });
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('Hot Rod');
          expect(response.body.lead).toEqual('Andy Samberg');
          expect(response.body.year).toEqual(2007);
          expect(response.body.synopsis).toEqual('Hot Rod is a super silly movie of stuntman Rod Kimble and his journey to be the best stunt man he can be.');
        });
    });

    test('should respond with a 400 status if no auth header present', () => {
      return accountMockFactory.create()
        .then(() => {
          return superagent.post(`${apiUrl}/movies`)
            .send({
              title: 'Hot Rod',
              lead: 'Andy Samberg',
              year: 2007,
              synopsis: 'Hot Rod is a super silly movie of stuntman Rod Kimble and his journey to be the best stunt man he can be.',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('should respond with a 400 status if no Bearer auth present in header', () => {
      return accountMockFactory.create()
        .then(() => {
          return superagent.post(`${apiUrl}/movies`)
            .set('Authorization', 'schmooop')
            .send({
              title: 'Hot Rod',
              lead: 'Andy Samberg',
              year: 2007,
              synopsis: 'Hot Rod is a super silly movie of stuntman Rod Kimble and his journey to be the best stunt man he can be.',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('should respond with a 401 status if an unauthorized request is made', () => {
      return accountMockFactory.create()
        .then(() => {
          return superagent.post(`${apiUrl}/movies`)
            .set('Authorization', 'Bearer wuh-oh!')
            .send({
              title: 'Hot Rod',
              lead: 'Andy Samberg',
              year: 2007,
              synopsis: 'Hot Rod is a super silly movie of stuntman Rod Kimble and his journey to be the best stunt man he can be.',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });
});