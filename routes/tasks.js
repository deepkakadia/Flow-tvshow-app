const express = require("express");
const router = express.Router();
const data = require("../data");
const request = require("request-promise");
const taskData = data.tasks;
const commentsData = data.comments;


router.post("/", async (req, res) => {
    let taskInfo = req.body;
    if (!taskInfo.completed) {
        taskInfo.completed = false;
    }

    // if (!userInfo) {
    //   res.status(400).json({error: 'You must provide data to create animal'});
    //   return;
    // }

    if (!taskInfo.title) {
        res.status(400).json({ error: 'You must provide a title' });
        return;
    }

    if (!taskInfo.description) {
        res.status(400).json({ error: 'You must provide a description' });
        return;
    }
    if (!taskInfo.hoursEstimated) {
        res.status(400).json({ error: 'You must provide hoursEstimated' });
        return;
    }


    try {
        const newTask = await taskData.create(taskInfo.title, taskInfo.description, taskInfo.hoursEstimated, taskInfo.completed);
        res.json(newTask);
    } catch (e) {
        res.sendStatus(500);
    }
});


router.get("/", async (req, res) => {
    try {

        var showlist = {
            url: 'http://api.tvmaze.com/shows',
            json: true
        }
        await request.get(showlist, async function (error, response, body) {
            let a = response.body;


            res.render('shows', { body: a });

        });


    } catch (e) {
        res.status(404).json({ message: e });
    }
});

router.get("/:id", async (req, res) => {
    try {
        let id1 = req.params.id;
        let id2 = "http://api.tvmaze.com/shows/";
        let id3 = id2 + id1;
        var showlist = {
            url: id3,
            json: true
        }

        const data = await request.get(showlist, async function (error, response, body) {
            let a = response.body;




            res.render('detail', { body: a });

        });


    } catch (e) {
        res.status(404).json({ message: e });
    }
});

router.post("/search", async (req, res) => {
    try {
        let id1 = req.body;
        let id2 = "http://api.tvmaze.com/search/shows?q=";
        let id3 = id2 + id1.q;
        var showlist = {
            url: id3,
            json: true
        }

        const data = await request.get(showlist, async function (error, response, body) {

            let a = response.body;




            res.render('search', { body: a });

        });


    } catch (e) {
        res.status(404).json({ message: e });
    }
});



module.exports = router;