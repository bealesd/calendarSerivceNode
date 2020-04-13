const express = require('express')

const Config = require('./config.js');
const Secrets = require('./secrets.js');
const CalendarRepo = require('./calendarRepo.js');
const Helper = require('./helper.js');

const app = express()
const port = process.env.PORT || 8080;

class Server {
    constructor() {
        const config = new Config();
        this.calendarFields = config.calendarFields;
        this.helper = new Helper(config.calendarFields);

        const secrets = new Secrets();
        const storageAccount = secrets.storageAccount;
        const storageKey = secrets.storageKey;
        const storageTable = secrets.storageTable;

        this.calendarRepo = new CalendarRepo(storageAccount, storageKey, storageTable);
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
            try {
                const params = req.query;

                const kwargs = {};
                kwargs[this.helper.calendarFields.month.rest] = params[this.helper.calendarFields.month.rest];
                kwargs[this.helper.calendarFields.year.rest] = params[this.helper.calendarFields.year.rest];

                const validatedArgs = this.helper.validateArgs(kwargs);
                const validatedYear = validatedArgs[this.helper.calendarFields.year.rest];
                const validatedMonth = validatedArgs[this.helper.calendarFields.month.rest];

                const records = await this.calendarRepo.getRecordAsync(validatedYear, validatedMonth);

                res.json(records);
            } catch (error) {
                res.status(400).send(error.message);
            }
        })

        app.post('/events', async (req, res) => {
            try {
                let requestBody = req.body;

                const kwargs = {};
                kwargs[this.helper.calendarFields.title.rest] = requestBody[this.helper.calendarFields.title.rest];
                kwargs[this.helper.calendarFields.year.rest] = requestBody[this.helper.calendarFields.year.rest];
                kwargs[this.helper.calendarFields.month.rest] = requestBody[this.helper.calendarFields.month.rest];
                kwargs[this.helper.calendarFields.day.rest] = requestBody[this.helper.calendarFields.day.rest];
                kwargs[this.helper.calendarFields.hour.rest] = requestBody[this.helper.calendarFields.hour.rest];
                kwargs[this.helper.calendarFields.minute.rest] = requestBody[this.helper.calendarFields.minute.rest];

                const validatedArgs = this.helper.validateArgs(kwargs);
                const validatedTitle = validatedArgs[this.helper.calendarFields.title.rest];
                const validatedYear = validatedArgs[this.helper.calendarFields.year.rest];
                const validatedMonth = validatedArgs[this.helper.calendarFields.month.rest];
                const validatedDay = validatedArgs[this.helper.calendarFields.day.rest];
                const validatedHour = validatedArgs[this.helper.calendarFields.hour.rest];
                const validatedMinute = validatedArgs[this.helper.calendarFields.minute.rest];

                const guid = this.helper.uuidv4();

                var entity = {
                    PartitionKey: guid,
                    RowKey: guid,
                    title: validatedTitle,
                    year: validatedYear,
                    month: validatedMonth,
                    day: validatedDay,
                    hour: validatedHour,
                    minute: validatedMinute
                };

                const id = await this.calendarRepo.insertOrReplaceRecordAsync(entity);

                res.json({ 'guid': id });
            } catch (error) {
                res.status(400).send(error.message);
            }

        })

        app.put('/events/:guid', async (req, res) => {
            try {
                const guid = req.params.guid;
                let requestBody = req.body;

                const kwargs = {};
                kwargs[this.helper.calendarFields.guid.rest] = guid;
                kwargs[this.helper.calendarFields.title.rest] = requestBody[this.helper.calendarFields.title.rest];
                kwargs[this.helper.calendarFields.year.rest] = requestBody[this.helper.calendarFields.year.rest];
                kwargs[this.helper.calendarFields.month.rest] = requestBody[this.helper.calendarFields.month.rest];
                kwargs[this.helper.calendarFields.day.rest] = requestBody[this.helper.calendarFields.day.rest];
                kwargs[this.helper.calendarFields.hour.rest] = requestBody[this.helper.calendarFields.hour.rest];
                kwargs[this.helper.calendarFields.minute.rest] = requestBody[this.helper.calendarFields.minute.rest];

                const validatedArgs = this.helper.validateArgs(kwargs);
                const validatedGuid = validatedArgs[this.helper.calendarFields.guid.rest];
                const validatedTitle = validatedArgs[this.helper.calendarFields.title.rest];
                const validatedYear = validatedArgs[this.helper.calendarFields.year.rest];
                const validatedMonth = validatedArgs[this.helper.calendarFields.month.rest];
                const validatedDay = validatedArgs[this.helper.calendarFields.day.rest];
                const validatedHour = validatedArgs[this.helper.calendarFields.hour.rest];
                const validatedMinute = validatedArgs[this.helper.calendarFields.minute.rest];

                var entity = {
                    PartitionKey: validatedGuid,
                    RowKey: validatedGuid,
                    title: validatedTitle,
                    year: validatedYear,
                    month: validatedMonth,
                    day: validatedDay,
                    hour: validatedHour,
                    minute: validatedMinute
                };

                const id = await this.calendarRepo.insertOrReplaceRecordAsync(entity);
                res.json({ 'Updated guid': id });
            } catch (error) {
                res.status(400).send(error.message);
            }

        })

        app.delete('/events/:guid', async (req, res) => {
            try {
                const guid = req.params.guid;

                const id = await this.calendarRepo.deleteCalendarRecordAsync(guid);
                res.json({ 'Deleted guid': id });
            } catch (error) {
                res.status(400).send(error.message);
            }

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