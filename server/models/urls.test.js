const Urls = require('./urls.js');
const {app} = require('./../server.js');
const {validateURL} = require('.././functions.js');
const expect = require('expect');
const request = require('supertest');

describe('GET /new', () => {
    
    it('should generate a new shortened URL as a string with six characters', (done) => {
        request(app.listen())
            .get('/new/http://www.wikipedia.org')
            .expect(200)
            .expect((res) => {
                expect(validateURL(res.body.url)).toBe(true)
                expect(res.body.shortlink).toBeA('string')
                expect(res.body.shortlink.length).toBe(6)
            })
            done();
    });
    
    it('should forward user when existing shortened URL passed in app URL', (done) => {
        request(app.listen())
            //shortlink g3i067 is stored in local database and redirects to grubhub.com
            .get('/g3i067')
            .on('response', (res) => {
                expect(302)
                console.log(res)
            })
            done();
    });
    
    it('should forward user when generated shortened URL passed in app URL', (done) => {
        var newUrl;
        request(app.listen())
            .get('/new/http://www.facebook.com')
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
