class Config {
    constructor() {
        this.calendarFields = {
            title: {
                azure: 'title',
                rest: 'title',
                regex: '^.{1,100}$',
                type: 'string'
            },
            year: {
                azure: 'year',
                rest: 'year',
                regex: '^(20[0-9]{2}|19[0-9]{2})$',
                type: 'int'
            },
            month: {
                azure: 'month',
                rest: 'month',
                regex: '^(0?[0-9]|1[0-1])$',
                type: 'int'
            },
            day: {
                azure: 'day',
                rest: 'day',
                regex: '^(0?[1-9]|[12][0-9]|3[01])',
                type: 'int'
            },
            hour: {
                azure: 'hour',
                rest: 'hour',
                regex: '^([01][0-9]|2[0-3])$',
                type: 'int'
            },
            minute: {
                azure: 'minute',
                rest: 'minute',
                regex: '^([0-5]?[0-9])$',
                type: 'int'
            },
            guid: {
                azure: 'RowKey',
                rest: 'guid',
                regex: '^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$',
                type: 'string'
            }
        }
    }
}

module.exports = Config;