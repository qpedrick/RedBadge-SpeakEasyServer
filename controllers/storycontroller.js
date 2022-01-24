const Express = require('express');
const router = Express.Router();
const { StoryModel } = require('../models');
const validateSession = require("../middleware/validate-session")

router.get('/', async (req, res) => {
    try {
        const Story = await StoryModel.findAll()
        res.status(201).json(Story)
    } catch(err) {
        console.log(err)
    }
});

router.get('/mine',  validateSession, async (req, res) => {
    const { id } = req.user
    try {
        const allStory = await StoryModel.findAll({
            where:
            {
                userId: id
            }
        })
        res.status(201).json(allStory)
    } catch(err) {
        console.log(err)
    }
});

router.post("/create", validateSession, async (req, res) => {

    const { id } = req.user

    const { title, description} = req.body

    const StoryEntry = {
        title,
        description,
        userId: id
    }

    try {
        const newStory = await StoryModel.create(StoryEntry);

        res.status(201).json({
            message: "New Story created",
            newStory
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to create Story: ${err}`
        })
    }
});

router.delete("/:id", validateSession, async (req,res) => {
    try {
        await StoryModel.destroy({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        })
        .then((result) => {
            if (result) {
                res.status(200).json({
                    message: "Story deleted",
                    storyDeleted: result
                })
            } else {
                res.status(400).json({
                    message: "Story does not exist"
                })
            }
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to delete story: ${err}`
        })
    }
})

router.put("/:id", validateSession, async (req,res) => {
    const {
        title,
        description
    } = req.body;

    const storyId = req.params.id
    const userId = req.user.id

    const query = {
        where: {
            id: storyId,
            userId: userId
        }
    };

    const updatedStory = {
        storyId,
        title,
        description
    };

    try {
        const update = await StoryModel.update(updatedStory, query);
        res.status(200).json({ 
            message: "Story successfully updated",
            updatedStory })

    } catch (err) {
        res.status(500).json({ message: err})
    }
})

module.exports = router