const express = require('express')

const Config = require('./config.js');
const CalendarRepo = require('./calendarRepo.js');
const Helper = require('./helper.js');

const app = express()
const port = process.env.PORT || 8080;

class Server {
    constructor() {
        const config = new Config();
        const storageAccount = config.storageAccount;
        const storageKey = config.storageKey;
        const storageTable = config.storageTable;

        this.calendarRepo = new CalendarRepo(storageAccount, storageKey, storageTable);
        this.helper = new Helper();
    }

    main() {
        app.use(express.json())

        app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            next();
        });

        app.get('/events', async (req, res) => {
            const params = req.query;
            const month = params[this.helper.fields.month.azure];
            const year = params[this.helper.fields.year.azure];
            const records = await this.calendarRepo.getRecordAsync(year, month);

            res.json(records);

        })

        app.post('/events', async (req, res) => {
            let requestBody = req.body;
            let kwargs = {
                title: requestBody[this.helper.fields.title.rest],
                year: requestBody[this.helper.fields.year.rest],
                month: requestBody[this.helper.fields.month.rest],
                day: requestBody[this.helper.fields.day.rest],
                hour: requestBody[this.helper.fields.hour.rest],
                minute: requestBody[this.helper.fields.minute.rest]
            };
            const guid = this.helper.uuidv4();

            var entity = {
                PartitionKey: guid,
                RowKey: guid,
                title: kwargs.title,
                year: kwargs.year,
                month: kwargs.month,
                day: kwargs.day,
                hour: kwargs.hour,
                minute: kwargs.minute
            };

            const id = await this.calendarRepo.insertOrReplaceRecordAsync(entity);

            res.json({ 'guid': id });
        })

        app.put('/events/:guid', async (req, res) => {
            const guid = req.params.guid;

            let requestBody = req.body;
            let kwargs = {
                title: requestBody[this.helper.fields.title.rest],
                year: requestBody[this.helper.fields.year.rest],
                month: requestBody[this.helper.fields.month.rest],
                day: requestBody[this.helper.fields.day.rest],
                hour: requestBody[this.helper.fields.hour.rest],
                minute: requestBody[this.helper.fields.minute.rest]
            };

            var entity = {
                PartitionKey: guid,
                RowKey: guid,
                title: kwargs.title,
                year: kwargs.year,
                month: kwargs.month,
                day: kwargs.day,
                hour: kwargs.hour,
                minute: kwargs.minute
            };

            const id = await this.calendarRepo.insertOrReplaceRecordAsync(entity);
            res.json({ 'Updated guid': id });
        })

        app.delete('/events/:guid', async (req, res) => {
            const guid = req.params.guid;

            const id = await this.calendarRepo.deleteCalendarRecordAsync(guid);
            res.json({ 'Deleted guid': id });
        })

        app.all('*', (req, res, next) => {
            res.send('uknown route');
        })

        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        })
    }
}

new Server().main();