process.env.NODE_ENV = 'testing'

const { expect } = require('chai')
const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const server = require('../app')
const knex = require('../db')

describe('routes', () => {
  before((done) => {
    knex.migrate.rollback().then(() => {
      knex.migrate.latest().then(() => {
        done()
      })
    })
  })

  // beforeEach((done) => {
  //   knex.migrate.rollback().then(() => {
  //     knex.migrate.latest().then(() => {
  //       done()
  //     })
  //   })
  // })

  after((done) => {
    knex.migrate.rollback().then(() => {
      done()
    })
  })

  it('should create a link', (done) => {
    chai
      .request(server)
      .post('/cli')
      .send({
        address: 'http://www.amazon.com',
      })
      .then((res) => {
        res.status.should.equal(200)
        res.type.should.equal('application/json')
        res.body.should.include.keys('direct_link', 'page_link')
        done()
      })
      .catch((err) => {
        should.not.exist(err)
      })
  })

  it('should respond with all links', (done) => {
    chai
      .request(server)
      .get('/links/hello')
      .end((err, res) => {
        // there should be no errors
        should.not.exist(err)
        // there should be a 200 status code
        res.status.should.equal(200)
        // the response should be JSON
        res.type.should.equal('application/json')
        // the JSON response body should have a
        // key-value pair of {"status": "success"}
        res.body.length.should.eql(1)
        res.body[0].should.include.keys('code')
        res.body[0].code.length.should.eql(9)
        // the JSON response body should have a
        // key-value pair of {"data": [2 user objects]}
        // res.body.data.length.should.eql(2)
        // the first object in the data array should
        // have the right keys
        // res.body.data[0].should.include.keys('id', 'username', 'email', 'created_at')
        done()
      })
  })

  it('should redirect to target page', (done) => {
    chai
      .request(server)
      .get('/links/hello')
      .then((res) => {
        res.status.should.equal(200)
        const link = res.body[0]
        // console.log(link.code, link.address)
        chai.request(server)
          .get(`/g/${link.code}`)
          .redirects(0)
          .then((res) => {
            expect(res).to.redirectTo(link.address)
            // console.log("Got res")
            // const site = res.text.split(' ').slice(-1)
            // console.log(site[0])
            // expect(site[0]).to.equal(link.address)
            done()
          })
          .catch((err) => {
            console.log(err)
            done(err)
            // done()
          })
      })
      .catch((err) => {
        should.not.exist(err)
        done(err)
      })
  })
})
