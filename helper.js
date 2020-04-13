class Helper {
    constructor(calendarFields) {
        if (!Helper.instance) {
            Helper.instance = this;
            this.calendarFields = calendarFields;
        }
        return Helper.instance;
    }

    isValidRecord(record) {
        const calendarFieldNames = Object.keys(this.calendarFields);
        for (let i = 0; i < calendarFieldNames.length; i++) {
            const calendarFieldName = calendarFieldNames[i];
            const azureField = this.calendarFields[calendarFieldName].azure;
            if (!record.hasOwnProperty(azureField)) {
                return false;
            }
        }
        return true;
    };

    isNull(value) {
        return value === '' || value === null || value === undefined;
    }

    normaliseRecordNames(record) {
        const normaliseRecordNames = {};
        Object.keys(this.calendarFields).forEach((calendarFieldName) => {
            let azureField = this.calendarFields[calendarFieldName].azure;
            normaliseRecordNames[calendarFieldName] = record[azureField]['_'];
        });
        return normaliseRecordNames;
    }

    normaliseAllRecordNames(records) {
        const normaliseRecordNames = [];
        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            if (this.isValidRecord(record))
                normaliseRecordNames.push(this.normaliseRecordNames(record));
        }
        return normaliseRecordNames;
    };

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    safeParseInt(value) {
        try {
            const parsedInt = parseInt(value);
            if (isNaN(parsedInt))
                throw Error;
            else
                return parsedInt;
        }
        catch {
            return null;
        }
    }

    validateArgs(calendarKwargs) {
        const validatedArgs = {};
        const calendarArgNames = Object.keys(calendarKwargs);
        for (let i = 0; i < calendarArgNames.length; i++) {
            const calendarArgName = calendarArgNames[i].toLowerCase();
            
            const index = Object.keys(this.calendarFields).findIndex((calendarField) => {
                return calendarField === calendarArgName;
            })
            if (index === -1)
                throw Error(`Method: validateArgs.\nMessage: Bad argument.Argument "${calendarArgName}" is not a calendar field.`);

            // does unvalidatedCalendarArgValue have a value
            const unvalidatedCalendarArgValue = calendarKwargs[calendarArgName];
            if (this.isNull(unvalidatedCalendarArgValue))
                validatedArgs[calendarArgName] = '';
            else {
                const regex = new RegExp(this.calendarFields[calendarArgName].regex)
                const isValidArg = regex.test(unvalidatedCalendarArgValue);
                if (!isValidArg) {
                    throw Error(`Method: validateArgs.\nMessage: Invalid value for: "${calendarArgName}".`);
                }
                else {
                    // get valid arg
                    const type = this.calendarFields[calendarArgName].type;
                    let validValue = null;
                    switch (type) {
                        case 'string':
                            validValue = this.escapeHtml(unvalidatedCalendarArgValue);
                            break;
                        case 'int':
                            validValue = this.safeParseInt(unvalidatedCalendarArgValue);
                            break;
                        default:
                            validValue = null;
                            break;
                    }
                    validatedArgs[calendarArgName] = validValue;
                }
            }
        }
        return validatedArgs;
    }
}

module.exports = Helper;