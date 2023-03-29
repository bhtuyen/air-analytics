function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

export const formatDate = (date) => {
    const newDate =  new Date(date);
    return (
        [
            newDate.getFullYear(),
            padTo2Digits(newDate.getMonth() + 1),
            padTo2Digits(newDate.getDate()),
        ].join('-') +
        ' ' +
        [
            padTo2Digits(newDate.getHours()),
            padTo2Digits(newDate.getMinutes()),
            padTo2Digits(newDate.getSeconds()),
        ].join(':')
    );
}