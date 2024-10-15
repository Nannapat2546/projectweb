import express from 'express';
import { Pool } from 'pg'; // ตรวจสอบว่าไม่มีการประกาศนี้ซ้ำ
import bodyParser from 'body-parser';
const app = express();

// ตั้งค่า EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// เชื่อมต่อกับฐานข้อมูล PostgreSQL
const pool = new Pool({
    user: 'postgres',  // เปลี่ยนให้ตรงกับข้อมูลของคุณ
    host: 'localhost',
    database: 'attendance_db',
    password: '0994150630',  // เปลี่ยนให้ตรงกับข้อมูลของคุณ
    port: 5432,
});

// ใช้ body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// หน้าแรก
app.get('/', (req, res) => {
    res.render('index');
});

// บันทึกข้อมูลเช็คชื่อ
app.post('/attendance', async (req, res) => {
    const { name, date, status } = req.body;
    const isPresent = status === 'on';

    await pool.query('INSERT INTO attendance (name, date, status) VALUES ($1, $2, $3)', [name, date, isPresent]);
    res.redirect('/attendance');
});

// ดูบันทึกเช็คชื่อ
app.get('/attendance', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM attendance ORDER BY date DESC');
    res.render('attendance', { records: rows });
});

// เริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
