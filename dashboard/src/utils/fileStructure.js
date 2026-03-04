export function lastItem(item){
    return item.length - 1
}

export function countArrBackwards(arr, stop = 0){
    const newArray = []
    for(let i = arr.length - 1; i >= 0; i--){
        const newStop = (arr.length - stop) - 1
        if(stop > 0){
            if(newStop === i){
                break
            }
        }
        
        newArray.push(arr[i])
    }
    return newArray
}

export function toDateString(date) {
    const d = new Date(date);
    return d.toLocaleDateString();
}

export function formattedDate(date) {
    const d = new Date(date);
    return d.toLocaleString();
}
//The function loops through the parent array to the child array which holds the events of the session and calculates the total saves or exports or prints
export function totalItems(sum, operation){
   let total = 0
    sum.event.forEach((item) => {
        if(item.type === operation){
            total++
        }
    })
    return total
}

export function countObjectItems(obj) {
    let objectString = [];
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) {
            objectString.push(`${key}: ${obj[key]}`)
        }
    }
    return objectString;
}
