const { Router } = require('express');
const Course = require('../models/course');
const auth = require('../middleware/auth');
const router = Router();

function mapCartItems(cart) {
    return cart.items.map(c => ({
         ...c.courseId._doc,
        id: c.courseId.id,
        count: c.count
    }));
}

function mapCartPrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}


router.get('/', auth, async (req, res) => {

    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate();

    const courses = mapCartItems(user.cart);


    res.render('cart', {
        title: 'Cart',
        isCart: true,
        courses,
        price: mapCartPrice(courses)
    });
});


router.post('/add', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.body.id);
        await req.user.addToCart(course);
        res.redirect('/cart');
    } catch (e) {
        console.log('Error', e);
    }
});

router.delete('/remove/:id', auth, async (req, res) => {
    console.log('DELETE', req.params.id);
    const course = await Course.findById(req.params.id);
    await req.user.removeFromCart(course);
    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate();
    const courses = mapCartItems(user.cart);
    const price = mapCartPrice(courses);

    const cart = {
        courses,
        price
    }
    res.status(200).json(cart);
})


module.exports = router;