const {Router} = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const router = Router();

router.get('/login', async (req, res) => {
    res.render('auth/login',{
        title: 'Log in',
        isLogin: true
    });
});

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    });

});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const candidate = await User.findOne({ email });

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password);

            if (areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if (err) {
                        throw err;
                    } else {
                        res.redirect('/');
                    }
                });
            } else {
                res.redirect('/auth/login#login')
            }
        } else {
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log('Error', e)
    }


});

router.post('/register', async (req, res) => {
    try {
        const {name, email, password, repeat} = req.body;
        console.log('AAA', password);
        const candidate = await User.findOne({ email });

        if (candidate) {
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
               email, name, password: hashPassword, cart: {items:[]}
            });
            await user.save();
            res.redirect('/auth/login#login')
        }

    } catch (e) {
        console.log('Error', e)
    }
})

module.exports = router;