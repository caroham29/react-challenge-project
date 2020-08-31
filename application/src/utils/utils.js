export const formatDate = (dayTime = new Date()) => {  //Return date with two digit minutes and seconds ie. hh:mm:ss format
    let tempDayTime = new Date(dayTime);
    return tempDayTime.getHours() + ':' +
        ( !!(tempDayTime.getMinutes() > 9 ) ? tempDayTime.getMinutes() : ( '0' + tempDayTime.getMinutes() ) ) + ':' +
        ( !!(tempDayTime.getSeconds() > 9 ) ? tempDayTime.getSeconds() : ( '0' + tempDayTime.getSeconds() ) );
}