var storage = require('azure-storage');
const Helper = require('./helper.js');

class CalendarRepo {
    constructor(storageAccount, storageKey, storageTable) {
        this.storageAccount = storageAccount;
        this.storageKey = storageKey;
        this.storageTable = storageTable;

        this.storageClient = storage.createTableService(this.storageAccount, this.storageKey);

        this.helper = new Helper();
    }

    async getRecordAsync(year, month) {
        const getAllEvents = this.helper.isNull(year) || this.helper.isNull(month);

        let query = getAllEvents ? new storage.TableQuery() : new storage.TableQuery().where('year eq ?', `${year}`).and('month eq ?', `${month}`);

        let promise = new Promise((res, rej) => {
            this.storageClient.queryEntities(this.storageTable, query, null, (error, result, response) => {
                if (error) rej();
                if (result.hasOwnProperty('entries') && result.entries.length > 0) {
                    const parsedRecords = this.helper.parseRecords(result.entries);
                    res(parsedRecords);
                }
                else {
                    res([]);
                }
            });
        });
        return promise;
    };

    async insertOrReplaceRecordAsync(record) {
        return new Promise((res, rej) => {
            this.storageClient.insertOrReplaceEntity(this.storageTable, record, (error, result, response) => {
                if (!error) {
                    res(record.RowKey);
                }
                rej();
            });
        });
    };

    async getRecordByIdAsync(id) {
        return new Promise((res, rej) => {
            this.storageClient.retrieveEntity(this.storageTable, id, id, (error, result, response) => {
                if (error) rej(error);
                res(result);
            });
        });
    };

    async deleteCalendarRecordAsync(id) {
        const record = await this.getRecordByIdAsync(id);
        return new Promise((res, rej) => {
            this.storageClient.deleteEntity(this.storageTable, record, (error, result) => {
                if (error) {
                    rej();
                }
                res(id);
            });
        });
    };
}

module.exports = CalendarRepo;