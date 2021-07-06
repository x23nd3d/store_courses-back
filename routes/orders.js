const {Router} = require('express');
const Orders = require('../models/orders');
const auth = require('../middleware/auth');
const router = Router();


router.get('/', auth, async (req, res) => {

    const user = await Orders.find({
        'user': req.user
    }).populate('user');

    const orders = user.map(o => ({
        ...o._doc,
        price: o.courses.reduce((total, order) => {
            return total += order.count * order.course.price
        }, 0)
    }));

    res.render('orders', {
        title: 'My orders',
        isOrders: true,
        orders
    });
});

router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.courseId').execPopulate();
        const courses = user.cart.items.map(o => ({
            course: {...o.courseId._doc},
            count: o.count
        }));

        const order = new Orders({
            courses,
            user: req.user
        });

        await order.save();
        await req.user.clearCart();
        res.redirect('/orders');
    } catch (e) {
        console.log('Error', e);
    }



});


module.exports = router;