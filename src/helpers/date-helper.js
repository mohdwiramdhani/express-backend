import moment from 'moment-timezone';

const formatDate = (date) => {
    if (!date) return null;
    return moment(date).format('YYYY-MM-DD');
};

const formatTimezone = (date, timezone = 'Asia/Singapore') => {
    if (!date) return null;
    return moment(date).tz(timezone).format();
};

export {
    formatDate,
    formatTimezone
}