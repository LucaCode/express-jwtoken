/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import chai     = require('chai');
import chaiHttp = require('chai-http');
import app        from "./expressServer";

chai.use(chaiHttp);

describe('JwtEngine tests', () => {

    describe('Normal Api', () => {
        it('Should block access to API path without a token.', async () => {
            const res = await chai.request(app)
                .get('/api/data')
                .send();
            chai.expect(res).to.have.status(403);
        });

        it('Should deny access with a not valid token.', async () => {
            const res = await chai.request(app)
                .get('/api/data')
                .set('Cookie', 'jwtToken=123433;')
                .send();
            chai.expect(res).to.have.status(403);
        });

        it('Should allow access to secure API after authenticating.', async () => {
            const agent =  chai.request.agent(app);

            const loginRes = await agent.post('/login')
                .send();
            chai.expect(loginRes).to.have.cookie('jwtToken');

            const res = await agent.get('/api/data')
                .send();

            chai.expect(res).to.have.status(200);
        });

        it('Should deny access to secure API after authenticating and deauthenticating.', async () => {
            const agent =  chai.request.agent(app);

            const loginRes = await agent.post('/login')
                .send();
            chai.expect(loginRes).to.have.cookie('jwtToken');

            const logoutRes = await agent.post('/logout')
                .send();
            chai.expect(logoutRes).to.not.have.cookie('jwtToken');

            const res = await agent.get('/api/data')
                .send();

            chai.expect(res).to.have.status(403);
        });
    });

    describe('Admin Api', () => {
        it('Should block access to admin path without a token.', async () => {
            const res = await chai.request(app)
                .get('/admin/data')
                .send();
            chai.expect(res).to.have.status(403);
        });

        it('Should allow access to admin path after authenticating with admin rights.', async () => {
            const agent =  chai.request.agent(app);

            const loginRes = await agent.post('/login')
                .send({admin : true});
            chai.expect(loginRes).to.have.cookie('jwtToken');

            const res = await agent.get('/admin/data')
                .send();
            chai.expect(res).to.have.status(200);
        });

        it('Should deny access to admin path after authenticating without admin rights.', async () => {
            const agent =  chai.request.agent(app);

            const loginRes = await agent.post('/login')
                .send();
            chai.expect(loginRes).to.have.cookie('jwtToken');

            const res = await agent.get('/admin/data')
                .send();
            chai.expect(res).to.have.status(403);
        });

    });

    describe('Guest Api', () => {
        it('Should allow access to guest path without a token.', async () => {
            const res = await chai.request(app)
                .get('/guest/data')
                .send();
            chai.expect(res).to.have.status(200);
        });

        it('Should deny access to guest path after authenticating.', async () => {
            const agent =  chai.request.agent(app);

            const loginRes = await agent.post('/login')
                .send();
            chai.expect(loginRes).to.have.cookie('jwtToken');

            const res = await agent.get('/guest/data')
                .send();
            chai.expect(res).to.have.status(403);
        });
    });

});