const Express = require('express');
const router = Express.Router();
const { UserModel } = require('../models');
// const validateSession = require("../middleware/validate-session")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize');

router.get('/', async (req, res) => {
    try {
        const User = await UserModel.findAll()
        res.status(201).json(User)
    } catch(err) {
        console.log(err)
    }
});

router.post('/register', async (req, res) => {
    let { firstName, lastName, email, password, member, role } = req.body.user;
    try {
        const User = await UserModel.create({
            firstName,
            lastName,
            email,
            password: bcrypt.hashSync(password, 10),
            member,
            role
        });

        let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        res.status(201).json({
            message: "User successfully registered",
            user: User,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use",
            });
        } else {
            res.status(500).json({
                message: `Failed to register user: ${err}`,
            });
        }
    }
});

router.post("/login", async (req,res) => {
    let { email, password } = req.body.user;

    try {
        let loginUser = await UserModel.findOne({
            where: {
                email: email,
            },
        });

        if (loginUser) {

            let passwordComparison = await bcrypt.compare(password, loginUser.password);

                if (passwordComparison) {
                    
                    let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                    res.status(200).json({
                        user: loginUser,
                        message: "User successfully logged in",
                        sessionToken: token,
                        role: loginUser.role
                    });
                } else {
                    res.status(401).json({
                        message: "Incorrect email or password"
                    });
                }
        } else {
            res.status(401).json({
                message: "Incorrect email or password"
            })
        }
        } catch (error) {
            res.status(500).json({
                message: "Failed to log user in"
            })
        }
});

router.put("/:id", async (req, res) => {
    const {
        role
    } = req.body.user

    const query = {
        where: {
            id: req.params.id
        }
    };

    const updatedUser = {
        role
    };

    try {
        const update = await UserModel.update(updatedUser, query);
        res.status(200).json({ message: "User updated"})
    } catch (err) {
        res.status(500).json({ error: `${err}` })
    }
})

router.delete("/:id", async (req,res) => {
    try {
        await UserModel.destroy({
            where: {
                id: req.params.id
            }
        }) 
        .then ((result) => {
            if (result) {
                res.status(200).json({
                    message: "User successfully deleted",
                    deletedUser: result
                })
            } else {
                res.status(400).json({
                    message: "User does not exist"
                })
            }
        })
    } catch (err) {
        res.status(500).json({
            message: `${err}`
        })
    }
})

// Different requests for searching by a parameter

    // router.get("/:email", async (req, res) => {
    //     try {
    //         const User = await UserModel.findOne({
    //             where: {
    //                 email: req.params.email
    //             }
    //         })
    //         res.status(200).json({
    //             message: User
    //         })
    //     } catch (err) {
    //         res.status(500).json({
    //             message: `${err}`
    //         })
    //     }
    // })

module.exports = router;