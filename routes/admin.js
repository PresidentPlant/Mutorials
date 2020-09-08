// FUNCTION IMPORTS
const { tags } = require('../utils/constants/tags');
const { subjectUnitDictionary } = require('../utils/constants/subjects');
const { adminList, contributorList } = require('../utils/constants/sitesettings');
const { parseDelimiter } = require('../utils/functions/general');

const VIEWS = "../views/"

module.exports = (app, mongo) => {
    app.post('/admin/addquestion', (req, res, next) => {
        //const questionStore =  new MongoStore({mongooseConnection: mongo.db, collection: 'questions'});

        if (req.isAuthenticated() && (adminList.includes(req.user.username))) {
            if (req.body.question.length < 1
                || parseDelimiter(req.body.tags).length < 1
                || req.body.rating.length < 1
                || parseDelimiter(req.body.answer)[0].length < 1
                || req.body.answerEx.length < 1
                || req.body.author.length < 1
                || req.body.type.length < 1
                || req.body.extSource.length < 1
                || req.body.subject.length < 1
                || req.body.units.length < 1) {
                req.flash('errorFlash', 'You\'re forgetting a field.');
                res.redirect('/admin/addedFailure');
                return;
            }

            // append unique unit tags to taglist
            req.body.subject.forEach((subject) => {
                Object.keys(tags[subject]['Units']).forEach((unitTag) => {
                    if (req.body.units.includes(subject + ' - ' + tags[subject]['Units'][unitTag])) {
                        if(req.body.tags.length >= 1) {
                            req.body.tags = unitTag + '@' + req.body.tags;
                        } else {
                            req.body.tags = unitTag;
                        }
                    }
                });
            });

            const newQ = new mongo.Ques({
                question: req.body.question,
                choices: parseDelimiter(req.body.choices),
                tags: parseDelimiter(req.body.tags),
                rating: req.body.rating,
                answer: parseDelimiter(req.body.answer),
                answerEx: req.body.answerEx,
                author: req.body.author,
                type: req.body.type,
                extSource: req.body.extSource,
                subject: req.body.subject,
                units: req.body.units,
                stats: {
                    pass: 0,
                    fail: 0
                }
            })
            //collection.insertOne({})
            newQ.save();
        } else {
            res.redirect('/');
        }
    });


    //ADMIN GET ROUTES

    app.get('/admin/addquestion', (req, res) => {
        if (req.isAuthenticated() && (adminList.includes(req.user.username))) {
            res.render(VIEWS + 'admin/train/addQuestion.ejs', { subjectUnitDictionary: subjectUnitDictionary });
        }
        else {
            res.redirect('/');
        }
    });

    app.get('/admin/addedSuccess', (req, res) => {
        if (req.isAuthenticated() && (adminList.includes(req.user.username))) {
            res.render(VIEWS + 'admin/train/addQuestionSuccess.ejs');
        }
        else {
            res.redirect('/');
        }
    });

    app.get('/admin/addedFailure', (req, res) => {
        if (req.isAuthenticated() && (adminList.includes(req.user.username))) {
            res.render(VIEWS + 'admin/train/addQuestionFailure.ejs');
        }
        else {
            res.redirect('/');
        }
    });
}