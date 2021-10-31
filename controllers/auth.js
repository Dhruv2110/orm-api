const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users')
const Token = require('../models/token')
const config = require('../config/' + process.env.NODE_ENV);
const Keywords = require('../models/keywords');
const Connection = require('../models/connection');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


exports.signup = async(req,res,next) => {
    console.log(req.body)
    const  {name , email, password, type} = req.body;

    try {
        const isMatch = await User.findOne({ email })
        if(isMatch){
            return res.send({
                msg: "Please enter unique username!",
                status: 401,
                code: -1
            })
        }

        const hashed = await bcrypt.hash(password, 12)
        const newUser = new User({
            name,
            email,
            password: hashed,
            type
        })
        await newUser.save()
                     .then(result => {
                        //  console.log("Inside Result : ",result);
                        return result._id;
                     })
                     .then((userId) => {
                        Keywords.create({ 
                            keywords: { items: []},
                            userId: userId
                        })
                        Connection.create({
                            twitter: {
                                URL: '',
                                useHttps: false,
                                pageSpeedIndex: 0,
                                hasTitle: false,
                                hasMetaDesc: false,
                                hasCanTag: false,
                                isValid: false
                            },
                            facebook: {
                                URL: '',
                                useHttps: false,
                                pageSpeedIndex: 0,
                                hasTitle: false,
                                hasMetaDesc: false,
                                hasCanTag: false,
                                isValid: false
                            },
                            linkedin: {
                                URL: '',
                                useHttps: false,
                                pageSpeedIndex: 0,
                                hasTitle: false,
                                hasMetaDesc: false,
                                hasCanTag: false,
                                isValid: false

                            },
                            website: {
                                URL: '',
                                useHttps: false,
                                pageSpeedIndex: 0,
                                hasTitle: false,
                                hasMetaDesc: false,
                                hasCanTag: false,
                                isValid: false
                           },
                            pinterest: {
                                URL: '',
                                useHttps: false,
                                pageSpeedIndex: 0,
                                hasTitle: false,
                                hasMetaDesc: false,
                                hasCanTag: false,
                                isValid: false
                            },
                            youtube: {
                                URL: '',
                                useHttps: false,
                                pageSpeedIndex: 0,
                                hasTitle: false,
                                hasMetaDesc: false,
                                hasCanTag: false,
                                isValid: false
                            },
                            crunchbase: {
                                URL: '',
                                useHttps: false,
                                pageSpeedIndex: 0,
                                hasTitle: false,
                                hasMetaDesc: false,
                                hasCanTag: false,
                                isValid: false
                            },
                            medium: {
                                URL: '',
                                useHttps: false,
                                pageSpeedIndex: 0,
                                hasTitle: false,
                                hasMetaDesc: false,
                                hasCanTag: false,
                                isValid: false
                            },
                            userId: userId,
                        });
                        console.log('Collections Created!');
                     })
                     .catch(err => {
            console.log(err);
        })

        return res.status(200).send({
            msg: "user has registered successfully.",
            status: 200,
            code: 1
        })

    } catch (err) {
        res.status(500).send({
            msg: 'Internal server error',
            status: 500
        })
    }
    


}

exports.logout = async (req,res,next) => {

    const {refreshToken} = req.body;

    Token.findOneAndDelete({refreshToken}).then(() => {
        res.status(200).send({status: 200})
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({status: 500})
    })
}

exports.login = async (req,res,next) => {

    const {email, password} = req.body;

    let user = await User.findOne({ email: email })
    if(!user){
        return res.status(403).send({ msg: "User does not exists!", status: 400, code: -1 })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(403).send({ msg: "Incorrect password!", status: 400, code: -2  })
    }

    const accessToken = jwt.sign({ user: user.email }, config.jwt.accessToken.secretKey, { expiresIn:  '7d' })
    const refreshToken = jwt.sign({ user: user.email }, config.jwt.refreshToken.secretKey)

    const newToken = new Token({
        refreshToken
    })
    await newToken.save()


    res.status(200).send({
        user: {
            name: user.name,
            email: user.email
        },
        accessToken:  accessToken,
        refreshToken: refreshToken,
        expiresIn: '10m',
        code:1
    })
}

exports.otpCheck = async (req,res,next) => {

    const {email, otp} = req.body;
    console.log(req.body.email)
    let user = await User.findOne({ email: email })
    if(!user){
        return res.send({ msg: "User does not exists!", status: 400,code: -1 })
    }

    const isMatch = user.resetOtp==otp ? true: false
    if(!isMatch){
        return res.send({ msg: "Incorrect otp!", status: 400, code: -2  })
    }

    const accessToken = jwt.sign({ user: user.email }, config.jwt.accessToken.secretKey, { expiresIn:  '7d' })
    const refreshToken = jwt.sign({ user: user.email }, config.jwt.refreshToken.secretKey)

    //console.log(accessToken)
    const newToken = new Token({
        refreshToken
    })
    await newToken.save()


    res.status(200).send({
        user: {
            name: user.name,
            email: user.email
        },
        accessToken:  accessToken,
        refreshToken: refreshToken,
        expiresIn: '10m',
        code:1
    })
}

exports.checkToken = async (req,res,next) => {

    let {token} = req.body;
    token = token.split(' ')[1];

    jwt.verify(token, config.jwt.accessToken.secretKey, (err, user) => {
        if (err) {
            if(err.message === 'jwt expired') {
                return res.status(400).send({msg: 'expired'}) 
            }

            return res.status(403).send({msg: 'forbidden'});
        }

        console.log(user)

        return res.status(200).send({msg: 'ok'})
    })
}

exports.token = async (req,res,next) => {
    const { token } = req.body;
    console.log(token)
    if (!token) {
        return res.status(401).send({msg: 'unauthorized'});
    }

    tokenExists = await Token.findOne({refreshToken: token})

    if( !tokenExists) {
        return res.status(403).send({msg: 'forbidden'});
    }

    jwt.verify(token, config.jwt.refreshToken.secretKey, (err, user) => {
        if (err) {
            return res.status(403).send({msg: 'forbidden'});
        }

        const accessToken = jwt.sign({ username: user.email }, config.jwt.accessToken.secretKey, { expiresIn: '7d' });

        res.json({
            accessToken
        });
    });
}

exports.postForgot = async (req, res, next) => {

    const { email } = req.body;
    console.log(email)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.transport.email,
            pass: config.transport.password
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        },
    });

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString('hex');
        const otp = Math.floor(100000 + Math.random() * 900000);
        User.findOne({ email: email })
            .then(user => {
                console.log(user)

                if (!user) {
                    return res.send({code : -1})
                }
                user.resetToken = token;
                user.resetOtp = otp;
                console.log(new Date() * 3600000);
                user.resetTokenExpiration = new Date() * 3600000; // for 1 hour
                return user.save();
            })
            .then(result => {
                const mailOptions = {
                    from: config.transport.email,
                    to: email,
                    subject: 'Reset Password OTP!',
                    html: `<h1 style = "text-align:center;">Reset password OTP for ORM Optimizer</h1>
                            <pre>The OTP to reset your password is ${otp} </pre>`,
                };

                transporter.sendMail(mailOptions)
                    .then(info => {
                        res.status(200).send({code: 1})
                        console.log(info);
                    })
                    .catch(err => {
                        res.send({ code: -2 })
                        console.log(err);
                    });
            })
            .catch(err => console.log(err))
        })
}

exports.postResetCheck = async (req, res, next) => {

    console.log("Reset body",req.body)
    User.findOne({
            resetToken: req.body.token,
            resetTokenExpiration: {
                $gt: Date.now(),
            },
        }).then(user => {
            //console.log(user)
            if(user == null){
                console.log('Reset Link Invalid');
                res.send({code: -1})
            } else {
                res.status(200).send({ code: 1, email: user.email})
            }
        }).catch(err => console.log(err))
}

exports.postReset = async (req, res, next) => {

    console.log("Reset body", req.body)
    User.findOne({
        email: req.body.email,
        // resetTokenExpiration: {
        //     $gt: Date.now(),
        // },
    }).then(async (user) => {
        if(user != null)
        {
            const hashed = await bcrypt.hash(req.body.password, 12)
            user.updateOne({
                password: hashed,
                resetToken: null,
                resetTokenExpiration: null,
                resetOtp: ''
            }).then(user => {
                console.log("Password Changed Successfully")
                res.status(200).send({code:1})
            }).catch(err => {
                console.log(err)
                res.send({ code: -2 })
            })
        }
        else {
            console.log("User Not Found")
            res.send({ code: -1 })
        }
    }).catch(err => console.log(err))
}