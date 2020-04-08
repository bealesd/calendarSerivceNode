class Helper {
    constructor() {
        this.fields = {
            title: { azure: 'title', rest: 'title' },
            year: { azure: 'year', rest: 'year' },
            month: { azure: 'month', rest: 'month' },
            day: { azure: 'day', rest: 'day' },
            hour: { azure: 'hour', rest: 'hour' },
            minute: { azure: 'minute', rest: 'minute' },
            guid: { azure: 'RowKey', rest: 'guid' }
        }
    }

    isValidRecord(record) {
        const fieldKeys = Object.keys(this.fields);
        for (let i = 0; i < fieldKeys.length; i++) {
            const fieldKey = fieldKeys[i];
            const azureField = this.fields[fieldKey].azure;
            if (!record.hasOwnProperty(azureField)) {
                return false;
            }
        }
        return true;
    };

    isNull(value) {
        return value === '' || value === null || value === undefined;
    }

    parseRecord(record) {
        const parsedRecord = {};
        Object.keys(this.fields).forEach((key) => {
            let azureField = this.fields[key].azure;
            parsedRecord[key] = record[azureField]['_'];
        });
        return parsedRecord;
    }

    parseRecords(records) {
        const parsedResults = [];
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            if (this.isValidRecord(record))
                parsedResults.push(this.parseRecord(record));
        }
        return parsedResults;
    };

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

module.exports = Helper;