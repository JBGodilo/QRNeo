var user = require('./controller.js');

module.exports = function (app) {
    app.get('/api/getuser/:id', function (req, res) {
        user.get_user(req, res);
    });
    app.get('/api/adduser/:user', function (req, res) {
        user.add_user(req, res);
    });
    app.get('/api/getalluser', function (req, res) {
        user.get_all_user(req, res);
    });
    app.get('/api/updateuser/:user', function (req, res) {
        user.update_user(req, res);
    });
}