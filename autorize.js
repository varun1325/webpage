import express from 'express';
import bodyParser from 'body-parser';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs/promises';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));



const keyPath = path.join(__dirname, 'clientid.json');
const keys = JSON.parse(await fs.readFile(keyPath, 'utf8'));

app.use(cors({
    origin: 'http://127.0.0.1:5500', // Replace with your frontend's URL
    methods: ['GET', 'POST'], // Allowed HTTP methods
    credentials: true, // Allow credentials (optional)
}));

const oauth2Client = new google.auth.OAuth2(
    keys.web.client_id,
    keys.web.client_secret,
    keys.web.redirect_uris[0] // Use appropriate redirect URI
);

google.options({ auth: oauth2Client });

app.get('/auth', async (req, res) => {
    const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/calendar.events',
        ],
    });
    res.redirect(authorizeUrl);
});

app.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.send('Authentication successful! You can now create events.');
});

 app.post('/create-event', async (req, res) => {
    console.log('Request received:', req.body);
    const { name, phone, event, startDate, endDate } = req.body;

    if (!oauth2Client.credentials.access_token) {
        return res.status(401).json({ message: 'User not authenticated!' });
    }

    try {
        const calendar = google.calendar('v3');
        const eventResponse = await calendar.events.insert({
            calendarId: 'primary',
            auth: oauth2Client,
            requestBody: {
                summary: event,
                description: `Booked by ${name}, Phone: ${phone}`,
                start: { dateTime: startDate, timeZone: 'Asia/Kolkata' },
                end: { dateTime: endDate, timeZone: 'Asia/Kolkata' },
            },
        });
        res.status(200).json({ message: 'Event created successfully!', eventResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating event.' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
