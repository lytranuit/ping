module.exports = function (io) {
    'use strict';
    io.on('connection', function (socket) {
        console.log("connection");
    });
};