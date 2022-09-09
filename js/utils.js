
function getRandomNumber(min, max){
    const range = max - min + 1;
    const random = Math.floor(Math.random()*range) + min;
    return random;
}

function getUnivoqueNumbersArray(length, min, max){
    const array = []
    
    while(array.length < length){
        const number = getRandomNumber(min, max);
        if (!array.includes(number)){
            array.push(number);
        }
    }

    return array;
}