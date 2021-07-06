const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');
const Course = require('../models/course');

router.get('/', async (req, res) => {
    const courses = await Course.find().
        populate('userId', 'email name').select('title price img')

    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses
    });
});

router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        res.render('course', {
            layout: 'empty',
            title: `Course ${course.title}`,
            course
        })
    } catch (e) {
        console.log(e);
      }

});

router.get('/:id/edit', auth, async (req, res) => {

    if (!req.query.allowed) {
        return res.status(403).redirect('/');
    }

    const course = await Course.findById(req.params.id);
    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
});

router.post('/:id/edit', auth, async (req, res) => {
    try {
        const { id } = req.body;
        delete req.body.id;
        await Course.findByIdAndUpdate(id, req.body);
        res.redirect('/courses');
    } catch (e) {
        console.log('Error', e)
    }
});

router.delete('/:id/remove', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        console.log('COURSE', course);
        await Course.findByIdAndDelete(course);
        const newCourses = await Course.find();
        console.log('NEW COURSES', newCourses);
        res.status(200).json(newCourses);
    } catch (e) {
        console.log('Error', e);
    }
});



module.exports = router;
