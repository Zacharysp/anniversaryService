var create;

logger.info('in create actions');

create = function (req) {
    var User = req.model.User;

    var username = req.body.username;
    var password = req.body.password;

    var user = new User({
      username: username,
      password: password
    });

    user.save(function (err, user) {
        if (err) {
            console.log(err);
            throw err;
        } else {
            console.log(user);
        }
    });


};

module.exports = create;
