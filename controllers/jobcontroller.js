const Express = require('express');
const router = Express.Router();
const { JobModel } = require('../models');
const validateSession = require("../middleware/validate-session")

router.get('/', async (req, res) => {
    try {
        const Job = await JobModel.findAll()
        res.status(201).json(Job)
    } catch(err) {
        console.log(err)
    }
});

router.get('/mine',  validateSession, async (req, res) => {
    const { id } = req.user
    try {
        const allJobs = await JobModel.findAll({
            where:
            {
                userId: id
            }
        })
        res.status(201).json(allJobs)
    } catch(err) {
        console.log(err)
    }
});

router.post('/create', validateSession, async(req,res) => {

    const { id } = req.user

    const { company, jobtitle, description, link } = req.body

    const JobEntry = {
        company,
        jobtitle,
        description,
        link,
        userId: id
    }

    try {
        const newJob = await JobModel.create(JobEntry);

        res.status(201).json({
            message: "New Job created",
            newJob
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to create Story: ${err}`
        })
    }
});

router.put("/:id", validateSession, async (req,res) => {
    const {
        company,
        jobtitle,
        description,
        link
    } = req.body;

    const jobId = req.params.id
    const userId = req.user.id

    const query = {
        where: {
            id: jobId,
            userId: userId
        }
    };

    const updatedJob = {
        jobId,
        company,
        jobtitle,
        description,
        link
    };

    try {
        const update = await JobModel.update(updatedJob, query);
        res.status(200).json({ 
            message: "Job successfully updated",
            updatedJob })

    } catch (err) {
        res.status(500).json({ message: err})
    }
});

router.delete("/:id", validateSession, async (req,res) => {
    try {
        await JobModel.destroy({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        })
        .then((result) => {
            if (result) {
                res.status(200).json({
                    message: "Job listing deleted",
                    jobDeleted: result
                })
            } else {
                res.status(400).json({
                    message: "Job listing does not exist"
                })
            }
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to delete job: ${err}`
        })
    }
})

router.delete("/admin/:id", async (req,res) => {
    try {
        await JobModel.destroy({
            where: {
                id: req.params.id,
            }
        })
        .then((result) => {
            if (result) {
                res.status(200).json({
                    message: "Job listing deleted",
                    jobDeleted: result
                })
            } else {
                res.status(400).json({
                    message: "Job listing does not exist"
                })
            }
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to delete job: ${err}`
        })
    }
})

module.exports = router