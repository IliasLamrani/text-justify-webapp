const Utils = require('../server/modules/utils');
const justifyText = require('../server/modules/justify-text');
const assert = require('assert');
const fs = require('fs');
const axios = require('axios');

describe('modulesTesting', () => {
    describe('stringToWordArray', () => {
        it('should return an array of words', () => {
            assert.deepEqual(Utils.stringToWordArray('Hello world this is a test!'),
                ['Hello', 'world', 'this', 'is', 'a', 'test!']);
        })
        it('should return an array of words and remove the whitespaces', () => {
            assert.deepEqual(Utils.stringToWordArray('Hello     world this     is a test!'),
                ['Hello', 'world', 'this', 'is', 'a', 'test!']);
        })
    })
    
    describe('fillStringWithSpaces', () => {
        it('should fill the string with whitespaces', () => {
            assert.equal(Utils.fillStringWithSpaces('Hello world', 2), 'Hello   world');
        })
        it('should fill the string with whitespaces at the end', () => {
            assert.equal(Utils.fillStringWithSpaces('HelloWorld', 2), 'HelloWorld  ');
        })
    })
    
    describe('justifyText', () => {
        it('should correctly justify the given text', () => {
            const fileName = './test/output';
            const input = fs.readFileSync('./test/input.txt').toString();
    
            justifyText(fileName, input, 80);
            const expectedOutput = fs.readFileSync('./test/expected_output.txt').toString();
            const givenOutput = fs.readFileSync(fileName).toString();
            assert.equal(expectedOutput, givenOutput);
            fs.unlink(fileName, err => {
                if (err)
                    console.log(err);
            });
        })
    })
})

describe('serverTesting', () => {
    describe('/api/token endpoint', () => {
        it ('should sent an error back because no email was provided', async () => {
            try {
                const res = await axios.post('http://localhost:3000/api/token');
                assert.equal('fail', 'Fail'); //failing test on purpose because axios should throw an error
            } catch(e) {
                assert.equal(e.response.status, 400);
            }
        })
        it ('should sent an error back because no password was provided', async () => {
            try {
                const res = await axios.post('http://localhost:3000/api/token',
                {
                    email: "toto@gmail.com"
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                assert.equal('fail', 'Fail'); //failing test on purpose because axios should throw an error
            } catch(e) {
                console.log(e.response.data);
                assert.equal(e.response.status, 400);
            }
        })
        it ('server will give use a token back', async () => {
            try {
                const res = await axios.post('http://localhost:3000/api/token',
                {
                    email: "t@gmail.com",
                    password: "123"
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                assert.equal(res.data.split(':')[0], 'This is your token. Keep it safely');
            } catch(e) {
                assert.equal('fail', 'Fail'); //failing test on purpose because axios shouldn't throw an error
            }
        })
    })
    describe('/api/justify endpoint', () => {
        it ('should sent an error back because no token was provided', async () => {
            try {
                const res = await axios.post('http://localhost:3000/api/justify');
                assert.equal('fail', 'Fail'); //failing test on purpose because axios should throw an error
            } catch(e) {
                assert.equal(e.response.status, 401);
            }
        })
        it ('should justify the given text', async () => {
            try {
                const input = fs.readFileSync('./test/input.txt').toString();
                const expectedOutput = fs.readFileSync('./test/expected_output.txt').toString();

                const tokenRes = await axios.post('http://localhost:3000/api/token',
                {
                    email: "michaelJackson@gmail.com",
                    password: "heehee"
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const justifyTextRes = await axios.post('http://localhost:3000/api/justify', input, 
                {
                    headers: {
                        'Content-Type': 'text/plain',
                        'Authorization': 'Bearer ' + tokenRes.data.split(' ')[7]
                    }
                });
                assert.equal(expectedOutput, justifyTextRes.data);
            } catch(e) {
                console.log(e);
                assert.equal('fail', 'Fail'); //failing test on purpose because axios shouldn't throw an error
            }
        })
    })
})