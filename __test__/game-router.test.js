'use strict';

require('./lib/setup');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');
const gameMock = require('./lib/game-mock');

const apiURL = `http://localhost:${process.env.PORT}`;

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

          return superagent.post(`${apiURL}/games`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .send({
              title: 'Title',
              type: 'The type',
              year: 2007,
            });
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('Title');
          expect(response.body.type).toEqual('The type');
          expect(response.body.year).toEqual(2007);
        });
    });

    test('should respond with a 400 status if no auth header present', () => {
      return accountMock.create()
        .then(() => {
          return superagent.post(`${apiURL}/games`)
            .send({
              title: 'Title',
              lead: 'The type',
              year: 2007,
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
          return superagent.post(`${apiURL}/games`)
            .set('Authorization', 'lol')
            .send({
              title: 'Title',
              lead: 'The type',
              year: 2007,
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
          return superagent.post(`${apiURL}/games`)
            .set('Authorization', 'Bearer')
            .send({
              title: 'Title',
              lead: 'The type',
              year: 2007,
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
          return superagent.post(`${apiURL}/games`)
            .set('Authorization', 'Bearer 182937asdjaklsdjasdj1283782173')
            .send({
              title: 'Title',
              lead: 'The type',
              year: 2007,
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

          return superagent.get(`${apiURL}/games/${mock.game._id}`)
            .set('Authorization', `Bearer ${mock.accountMock.token}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual(resultMock.game.title);
          expect(response.body.lead).toEqual(resultMock.game.lead);
          expect(response.body.year).toEqual(resultMock.game.year);
        });
    });

    test('should respond with a 404 if no game with the given id exists', () => {
      return gameMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/games/123123123`)
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
          return superagent.post(`${apiURL}/games`)
            .set('Authorization', 'Bearer');
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });
});