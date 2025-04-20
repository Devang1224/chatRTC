import moment from "moment";

export function getTimeAgo(date){
    const now = new Date();
    const created = new Date(date);;
    const diffTime = Math.abs(now - created);
     
    // Convert milliseconds to minutes by dividing by 1000 (ms to sec) * 60 (sec to min) = 60000
    const minutes = Math.floor(diffTime/60000);
    // Convert milliseconds to hours: 60000 (ms to min) * 60 (min to hour) = 3600000
    const hours = Math.floor(diffTime/3600000); 
    // Convert milliseconds to days: 3600000 (ms to hour) * 24 (hour to day) = 86400000
    const days = Math.floor(diffTime/86400000);
    
   
 if (days < 1) {
    return moment(created).format("hh:mm A");
} else if (days == 1) {
    return "Yesterday";
} else if (days > 1) {
    return moment(created).format("DD/MM/YY");
} else {
    return moment(created).format("DD/MM/YY");
}


}


