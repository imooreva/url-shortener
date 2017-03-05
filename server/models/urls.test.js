const Urls = require('./urls.js');
const {app} = require('./../server.js');
const {validateURL} = require('.././functions.js');
const expect = require('expect');
const request = require('supertest');

describe('GET /new', () => {
    
    it('should create a new shortened URL', (done) => {
        request(app.listen())
            .get('/new/http://www.wikipedia.org')
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
            .get('/1um4pg')
            .on('response', (res) => {
                expect(302)
            })
            .end(done);
    });
    
    it('should forward user when generated shortened URL passed in app URL', (done) => {
        var newUrl;
        request(app.listen())
            .get('/new/http://www.wikipedia.org')
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
