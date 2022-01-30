

export const createTimePartition = (time: string) => {
    const milliSecondsSinceEpoch = new Date(time).getTime()
    const minute = 60 * 1000;
    return Math.floor((milliSecondsSinceEpoch)/(5 * minute))
}