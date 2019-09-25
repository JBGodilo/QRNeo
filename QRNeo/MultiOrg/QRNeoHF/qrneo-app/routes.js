var user = require('./controller.js');

module.exports = function (app) {
    app.post('/api/getuser/', function (req, res) {
        user.get_user(req, res);
    });
    app.post('/api/adduser/', function (req, res) {
        user.add_user(req, res);
    });
    app.get('/api/getalluser/', function (req, res) {
        user.get_all_user(req, res);
    });
    app.post('/api/updateuser/', function (req, res) {
        user.update_user(req, res);
    });
}