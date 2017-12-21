'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const profileMockFactory = require('./lib/profile-mock-factory');

const apiUrl =`http://localhost:${process.env.PORT}`; //TODO : give/signup to post routes

describe('POST /profiles', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMockFactory.remove);

  test('POST should return 200 and profile if no errors', () => {
    let accountMock = null;

    return accountMockFactory.create()
      .then(mock => {
        accountMock = mock;
        return superagent.post(`${apiUrl}/profiles`)
          .set('Authorization', `Bearer ${accountMock.token}`)
          .send({
            bio : 'I am a nicholas',
            firstName : 'Nicholas',
            lastName : 'Carignan',
          });
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());//TODO: remove this NOTE: we would need to call a .populate to have account be the actual object instead of an id
        expect(response.body.firstName).toEqual('Nicholas');
      });
  });

  test('GET should return 200 and profile with id if no errors', () => {
    let xToTest = null;
    return profileMockFactory.create()
      .then(profile => {
        xToTest = profile;
        return superagent.get(`${apiUrl}/profiles/${profile.profile._id}`)
          .set('Authorization', `Bearer ${profile.accountMock.token}`); //NOTE: nicholas- we used auth before for basic http auth- we now use set to give it a header matching the format of the bearer-token
      })
      .then(response => {
        console.log(xToTest, 'is xtotest');
        expect(response.status).toEqual(200);
        expect(response.body.firstName).toEqual(xToTest.profile.firstName);
      });


  });
});
// TODO: remove this NOTE: this is the profile returned
// { accountMock:
//          { request:
//             { username: 'Itzel53',
//               email: 'Nelle_Collins@yahoo.com',
//               password: 'et omnis voluptas' },
//            account: { _id: 5a3b7f94e8dfef14c0a5c0e6,
//               username: 'Itzel53',
//               email: 'Nelle_Collins@yahoo.com',
//               passwordHash: '$2a$08$fOmFx5O7e36htDS3Q3R80OoYaB6kgR5iuUYbwsdSDbMDLFplAJj5i',
//               tokenSeed: 'bb35876efbc9f2fae9e9aa1859bcd3828d8e00d8e43e4a6117f4ee65b3ee87729dad737b5d9cdbbbfc5790bc21fab909063031f86effd576cfa7921fcf2cc635',
//               __v: 0,
//               created: 2017-12-21T09:32:04.873Z },
//            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlblNlZWQiOiJiYjM1ODc2ZWZiYzlmMmZhZTllOWFhMTg1OWJjZDM4MjhkOGUwMGQ4ZTQzZTRhNjExN2Y0ZWU2NWIzZWU4NzcyOWRhZDczN2I1ZDljZGJiYmZjNTc5MGJjMjFmYWI5MDkwNjMwMzFmODZlZmZkNTc2Y2ZhNzkyMWZjZjJjYzYzNSIsImlhdCI6MTUxMzg0ODcyNH0.aupw2p7_t_drMsUEoB_KlfGJs3mVdkb2lRRi90BmAMU' },
//         profile: { __v: 0,
//            bio: 'voluptatem ut a tempora temporibus tempora quasi id aut sed necessitatibus vel aut et et quia voluptates et qui dolores dolor aliquid qui beatae aut cumque dolores repellat a repudiandae labore in nam eum ut debitis corporis voluptates ut repudiandae saepe eum possimus vel veritatis nesciunt ab est eveniet et voluptatem omnis ipsam et rem assumenda cum velit et rerum dolor sed mollitia qui sit vero a voluptatem voluptas ut esse quia error non accusamus ipsa vero explicabo consequatur accusantium voluptatem sunt impedit alias sint sit iusto animi velit vitae asperiores illo qui magni inventore et voluptatem a alias quo',
//            avatar: 'http://lorempixel.com/640/480/people',
//            lastName: 'Satterfield',
//            firstName: 'Jeremie',
//            account: 5a3b7f94e8dfef14c0a5c0e6,
//            _id: 5a3b7f94e8dfef14c0a5c0e7 } }
