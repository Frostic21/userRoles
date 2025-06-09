const passport = require('passport');
const {Strategy} = require('passport-local').Strategy;
const {User, Role, Permission} = require('../models');
const md5 = require('md5');

// this function will test user's credentials
async function verifyUser(username,password, done) {
    //fetch user from database
    const user = await User.findOne({
        where: {
            email: username,
            password: md5(password)
        }
    });
    //if failure
    if(!user){
        return done(null, false, {message: 'Incorrect email or password'});
    }
    //if passed
    return done(false, {
        id: user.id,
    });
}

passport.use(
    new Strategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        verifyUser
    )
);

//
passport.serializeUser(function(user, done) {
    process.nextTick(function (){
        done(null, {id:user.id});
    });
});

//
passport.deserializeUser(async function(user, done) {
    const userModel = await User.findbyPk(user.id,{
        include: [
            {
                model: Role,
                as: 'role',
                include: [
                    {
                        model: Permission,
                        as: 'permission'
                    }
                ],
            }
        ]
    });
    process.nextTick(function (){
        return done(null, userModel);
    });
});

module.exports.passport = passport;