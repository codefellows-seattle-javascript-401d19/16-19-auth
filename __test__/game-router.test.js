'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');
const gameMock = require('./lib/game-mock');

const apiUrl = `http://localhost:${process.env.PORT}`;

describe('game-router.js', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(gameMock.remove);

  describe('POST /games', () => {
    test('should respond with a 200 status and profile if no errors', () => {
      let accountMock = null;

      return accountMock.create()
        .then(mock => {
          accountMock = mock;

          return superagent.post(`${apiUrl}/games`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .send({
              title: 'Hot Rod',
              type: 'Andy Samberg',
              year: 2007,
            });
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('Hot Rod');
          expect(response.body.type).toEqual('Andy Samberg');
          expect(response.body.year).toEqual(2007);
        });
    });

    test('should respond with a 400 status if no auth header present', () => {
      return accountMock.create()
        .then(() => {
          return superagent.post(`${apiUrl}/games`)
            .send({
              title: 'Hot Rod',
              lead: 'Andy Samberg',
              year: 2007,
              synopsis: 'Hot Rod is a super silly game of stuntman Rod Kimble and his journey to be the best stunt man he can be.',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('should respond with a 400 status if no Bearer auth present in header', () => {
      return accountMock.create()
        .then(() => {
          return superagent.post(`${apiUrl}/games`)
            .set('Authorization', 'schmooop')
            .send({
              title: 'Hot Rod',
              lead: 'Andy Samberg',
              year: 2007,
              synopsis: 'Hot Rod is a super silly game of stuntman Rod Kimble and his journey to be the best stunt man he can be.',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('should respond with a 401 status if an unauthorized request is made', () => {
      return accountMock.create()
        .then(() => {
          return superagent.post(`${apiUrl}/games`)
            .set('Authorization', 'Bearer wuh-oh!')
            .send({
              title: 'Hot Rod',
              lead: 'Andy Samberg',
              year: 2007,
              synopsis: 'Hot Rod is a super silly game of stuntman Rod Kimble and his journey to be the best stunt man he can be.',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });

    test('should respond with a 404 status if an token is sent that doesn\'t match a user account token seed', () => {
      return accountMock.create()
        .then(() => {
          return superagent.post(`${apiUrl}/games`)
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblNlZWQiOiI4NWRmMzJhMzk2ZDcwNjIzZmZjZDg5ZjZmNGFmMGQ0MjI4ZGFhMDY0ZDIwNjk1ZWZiODRjMjhhZjQzOTQyMGVlYjBhODVmMzQzMTJjYzVmZmVhNzE0MzA3MjI5MzcxODA1MDllMDgyYWY2YTVjM2Q4Njk2MTUwYzFiZWE2MzdjZSIsImlhdCI6MTUxMzg0MTU3N30.9zkVSZqYblNMY1UO9TnTPYL259MRJgj3twKKtu-f8s0')
            .send({
              title: 'Hot Rod',
              lead: 'Andy Samberg',
              year: 2007,
              synopsis: 'Hot Rod is a super silly game of stuntman Rod Kimble and his journey to be the best stunt man he can be.',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('GET /games/<game id>', () => {
    test('should respond with a 200 and the game if no errors', () => {
      let resultMock = null;

      return gameMock.create()
        .then(mock => {
          resultMock = mock;

          return superagent.get(`${apiUrl}/games/${mock.game._id}`)
            .set('Authorization', `Bearer ${mock.accountMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual(resultMock.game.title);
          expect(response.body.lead).toEqual(resultMock.game.lead);
          expect(response.body.year).toEqual(resultMock.game.year);
          expect(response.body.synopsis).toEqual(resultMock.game.synopsis);
        });
    });

    test('should respond with a 404 if no game with the given id exists', () => {
      return gameMock.create()
        .then(mock => {
          return superagent.get(`${apiUrl}/games/123123123`)
            .set('Authorization', `Bearer ${mock.accountMock.token}`);
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('should respond with a 401 status if an unauthorized request is made', () => {
      return accountMock.create()
        .then(() => {
          return superagent.post(`${apiUrl}/games`)
            .set('Authorization', 'Bearer wuh-oh!');
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });
});