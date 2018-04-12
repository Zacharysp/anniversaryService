/**
 * Created by dzhang on 2/28/17.
 */

const expect = require('chai').expect;
const User = require('../../app/models/user');

const userId = 'ef8f9b40-6bca-11e5-9241-59e0ce395c8a';

describe('User', function() {
    it('should successfully find user by user id', function(done) {
        let user = new User();
        user.findById(userId, function(err, result) {
            expect(err).to.be.null;
            expect(result).to.be.an('array');
            done();
        });
    });
});
