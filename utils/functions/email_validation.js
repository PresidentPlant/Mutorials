// functions for email validation

const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
var db = mongoose.connection;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mutorialsproject@gmail.com',
        pass: 'Eejklmrrv$16'
    }
});

module.exports = {
    email_code_send: function(username, code) {
        const mailOptions = {
            from: 'mutorialsproject@gmail.com',
            to: username,
            subject: 'Mutorials Email Confirmation',
            text: 'Here is your code: ' + code
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(errror);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    },
    check_code: function(username, entered_code) {
        debugger;
        db.collection('users').findOne({ username: username }).then((user) => {
            return user.email_confirm_code == entered_code;
        });
    },

    clear_confirm_code: function(username) {
        db.collection('users').findOneAndUpdate({ username: req.user.username }, { $set: { email_confirm_code: "0" } });
    },

    regex_check: function(username) {
        // returns true if the email conforms to RFC 5322
        // see https://stackoverflow.com/questions/201323

        const regex = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm;
        if (username.length < 1) { return false; }
        return regex.test(username);
    }
};
