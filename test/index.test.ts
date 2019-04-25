/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import chai     = require('chai');
import chaiHttp = require('chai-http');
import app        from "./testServer/expressServer";

chai.use(chaiHttp);

describe('JwtEngine tests', () => {

    describe('Default MTE',async  () => {
        describe('Normal Api', () => {
            it('Should block access to API path without a token.', async () => {
                const res = await chai.request(app)
                    .get('/1/api/data')
                    .send();
                chai.expect(res).to.have.status(403);
            });

            it('Should deny access with a not valid token.', async () => {
                const res = await chai.request(app)
                    .get('/1/api/data')
                    .set('Cookie', 'jwt=123433;')
                    .send();
                chai.expect(res).to.have.status(403);
            });

            it('Should allow access to secure API after authenticating.', async () => {
                const agent =  chai.request.agent(app);

                const loginRes = await agent.post('/1/login')
                    .send();
                chai.expect(loginRes).to.have.cookie('jwt');

                const res = await agent.get('/1/api/data')
                    .send();

                chai.expect(res).to.have.status(200);
            });

            it('Should deny access to secure API after authenticating and deauthenticating.', async () => {
                const agent =  chai.request.agent(app);

                const loginRes = await agent.post('/1/login')
                    .send();
                chai.expect(loginRes).to.have.cookie('jwt');

                const logoutRes = await agent.post('/1/logout')
                    .send();
                chai.expect(logoutRes).to.not.have.cookie('jwt');

                const res = await agent.get('/1/api/data')
                    .send();

                chai.expect(res).to.have.status(403);
            });
        });

        describe('Admin Api', () => {
            it('Should block access to admin path without a token.', async () => {
                const res = await chai.request(app)
                    .get('/1/admin/data')
                    .send();
                chai.expect(res).to.have.status(403);
            });

            it('Should allow access to admin path after authenticating with admin rights.', async () => {
                const agent =  chai.request.agent(app);

                const loginRes = await agent.post('/1/login')
                    .send({admin : true});
                chai.expect(loginRes).to.have.cookie('jwt');

                const res = await agent.get('/1/admin/data')
                    .send();
                chai.expect(res).to.have.status(200);
            });

            it('Should deny access to admin path after authenticating without admin rights.', async () => {
                const agent =  chai.request.agent(app);

                const loginRes = await agent.post('/1/login')
                    .send();
                chai.expect(loginRes).to.have.cookie('jwt');

                const res = await agent.get('/1/admin/data')
                    .send();
                chai.expect(res).to.have.status(403);
            });

        });

        describe('Guest Api', () => {
            it('Should allow access to guest path without a token.', async () => {
                const res = await chai.request(app)
                    .get('/1/guest/data')
                    .send();
                chai.expect(res).to.have.status(200);
            });

            it('Should deny access to guest path after authenticating.', async () => {
                const agent =  chai.request.agent(app);

                const loginRes = await agent.post('/1/login')
                    .send();
                chai.expect(loginRes).to.have.cookie('jwt');

                const res = await agent.get('/1/guest/data')
                    .send();
                chai.expect(res).to.have.status(403);
            });
        });
    });

    describe('AuthorizationHeadersMTE', () => {

        describe('Normal Api', () => {
            it('Should block access to API path without a token.', async () => {
                const res = await chai.request(app)
                    .get('/2/api/data')
                    .send();
                chai.expect(res).to.have.status(403);
            });

            it('Should deny access with a not valid token.', async () => {
                const res = await chai.request(app)
                    .get('/2/api/data')
                    .set('Authorization', 'Bearer 32942380')
                    .send();
                chai.expect(res).to.have.status(403);
            });

            it('Should allow access to secure API after authenticating.', async () => {
                const agent =  chai.request.agent(app);

                const loginRes = await agent.post('/2/login')
                    .send();

                chai.assert.typeOf(loginRes.body,'object');
                chai.assert.typeOf(loginRes.body.token,'string');

                const res = await agent.get('/2/api/data')
                    .set('Authorization', 'Bearer '+loginRes.body.token)
                    .send();

                chai.expect(res).to.have.status(200);
            });
        });
    });

});