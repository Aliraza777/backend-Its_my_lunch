
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dishroutes from './routes/routes.js';
import nodemailer from 'nodemailer';

const app = express();

const corsOptions = {
    origin: "http://localhost:8080"
  };



app.use(cors(corsOptions));
const PORT = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




app.get('/', (req, res) => {
    res.redirect('/dishes');
});

app.get('/featured', (req, res) => {
    res.redirect('/dishes/featured');
});



app.use('/dishes', dishroutes);

// app.use('/featured' , dishroutes);
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });


app.post('/contact', (req, res) => {
    res.send(req.body);
}
);

app.get('/contact', (req, res) => {
    res.send('mail sent');
    res.send(req.body);
}
);
app.listen(PORT, () => {
    console.log(`Server is listening on port : http://localhost:${PORT}`);
    });