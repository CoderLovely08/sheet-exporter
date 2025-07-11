const express = require('express');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const sheetService = require('./utils/sheet.service');
const ejs = require('ejs');

const app = express();
const port = 8000;

// In-memory store for session data
const sessions = {};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/', limits: { fileSize: 5e6 } });

app.get('/', (req, res) => {
    // Render the upload view within the layout
    res.render('layout', { 
        body: ejs.render(fs.readFileSync(path.join(__dirname, 'views', 'upload.ejs'), 'utf-8'))
    });
});

app.post('/upload', upload.single('sheet'), async (req, res) => {
    if (!req.file) {
        return res.status(400).render('layout', { 
            body: ejs.render(fs.readFileSync(path.join(__dirname, 'views', 'error.ejs'), 'utf-8'), { message: 'No file uploaded.' })
        });
    }

    try {
        const data = await sheetService.parseSheet(req.file.path, req.file.originalname);
        const id = uuidv4();
        sessions[id] = data;

        // Clean up the uploaded file immediately after parsing
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting uploaded file:", err);
        });

        res.redirect(`/preview/${id}`);
    } catch (error) {
        res.status(500).render('layout', { 
            body: ejs.render(fs.readFileSync(path.join(__dirname, 'views', 'error.ejs'), 'utf-8'), { message: error.message })
        });
    }
});

app.get('/preview/:id', (req, res) => {
    const { id } = req.params;
    const data = sessions[id];

    if (!data) {
        return res.status(404).render('layout', { 
            body: ejs.render(fs.readFileSync(path.join(__dirname, 'views', 'error.ejs'), 'utf-8'), { message: 'File not found or session expired.' })
        });
    }

    res.render('layout', {
        body: ejs.render(fs.readFileSync(path.join(__dirname, 'views', 'preview.ejs'), 'utf-8'), { ...data, id })
    });
});

app.post('/export/:id', async (req, res) => {
    const { id } = req.params;
    const { cols } = req.body;
    const sessionData = sessions[id];

    if (!sessionData) {
        return res.status(404).render('layout', { 
            body: ejs.render(fs.readFileSync(path.join(__dirname, 'views', 'error.ejs'), 'utf-8'), { message: 'File not found or session expired.' })
        });
    }

    if (!cols) {
        return res.status(400).render('layout', { 
            body: ejs.render(fs.readFileSync(path.join(__dirname, 'views', 'error.ejs'), 'utf-8'), { message: 'No columns selected.' })
        });
    }

    const selectedColumns = Array.isArray(cols) ? cols : [cols];
    const filteredRows = sheetService.filterColumns(sessionData.rows, selectedColumns);
    
    const tmpPath = path.join('uploads', `${uuidv4()}.xlsx`);

    try {
        await sheetService.writeXlsx(selectedColumns, filteredRows, tmpPath);
        res.download(tmpPath, 'selected-columns.xlsx', (err) => {
            if (err) {
                console.error("Error sending file:", err);
            }
            // Clean up the temporary file
            fs.unlink(tmpPath, (unlinkErr) => {
                if (unlinkErr) console.error("Error deleting temporary export file:", unlinkErr);
            });
            // Clean up the session data
            delete sessions[id];
        });
    } catch (error) {
        res.status(500).render('layout', { 
            body: ejs.render(fs.readFileSync(path.join(__dirname, 'views', 'error.ejs'), 'utf-8'), { message: error.message })
        });
    }
});

app.listen(port, (error) => {
    if (error) {
        console.error("Error starting server:", error);
    }
    console.log(`Server listening at http://localhost:${port}`);
});