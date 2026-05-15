function getDate() {
    const date1 = new Date(Date.now() + 9 * 60 * 60 * 1000);

    const date2 = date1.getUTCFullYear() + "年" +
        (date1.getUTCMonth() + 1) + "月" +
        date1.getUTCDate() + "日" +
        date1.getUTCHours() + "時" +
        date1.getUTCMinutes() + "分" +
        date1.getUTCSeconds() + "秒";

    return date2;
}

module.exports = {
    getDate
}