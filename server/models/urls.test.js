var Urls = require('./urls.js');
var {app} = require('./../server.js');
var {router} = require('./../routes-api.js');
var {validateURL} = require('./../functions.js');
var expect = require('expect');
var request = require('supertest');

describe('URL tests', () => {
    
    it('should generate a new shortened URL as a string with six characters', (done) => {
        request(app.listen())
            .get('api/new/http://www.wikipedia.org')
            .expect(200)
            .expect((res) => {
                expect(validateURL(res.body.url)).toBe(true)
                expect(res.body.shortlink).toBeA('string')
                expect(res.body.shortlink.length).toBe(6)
            })
            .end(done);
    });
    
    it('should forward user when existing shortened URL passed in app URL', (done) => {
        request(app.listen())
            //shortlink g3i067 is stored in local database and redirects to grubhub.com
            .get('api/g3i067')
            .expect(302)
            .end(done);
    });
    
    it('should forward user when generated shortened URL passed in app URL', (done) => {
        var newUrl;
        request(app.listen())
            .get('api/new/http://www.facebook.com')
            .on('response', (res) => {
                expect(200)
                newUrl = res.body.shortlink
            }).then((res) => {
                request(app.listen())
                .get(`/${newUrl}`)
                .expect(302)
                done()
            }).catch((e)=> done(e));
    });
});
