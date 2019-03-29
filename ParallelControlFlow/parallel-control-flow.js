const fs = require('fs');
const DictionaryList = [];
const totalFrequency = {}

//Implement parallel flow control for async calls
function parallel(tasks, handler) {
    let doneCounter = 0;
    if (tasks.length < 1) return;
    if (typeof handler !== 'function') return;
    for (let task of tasks) {
        if (typeof task !== 'function') return;
    }
    for(let task of tasks) {
        //Run all task simultaneously
        task(done);
    }

    function done(){
        //Check done all and run handler
        doneCounter++;
        if(doneCounter === tasks.length) handler();
    }
}

//Async functions in an array
parallel([
    countFrequencyPerFile('./TextFiles/firstStory.txt'),
    countFrequencyPerFile('./TextFiles/secondStory.txt'),
    countFrequencyPerFile('./TextFiles/thirdStory.txt'),
], countFrequencyAll);

//Count all word frequency in one file
function countFrequencyPerFile(path){
    return function (done) {
        fs.readFile(path, (err, data) => {
            const textArray = data.toString().match(/\S+/g);
            const wordFrequencyDictionary = textArray.reduce((dictionary, word) => {
                if(dictionary.hasOwnProperty(word)) {
                    dictionary[word]++;
                } else {
                    dictionary[word] = 1;
                }
                return dictionary;
            }, {});
            DictionaryList.push(wordFrequencyDictionary);
            done();
        });
    }
}

//Count word frequency in all files
function countFrequencyAll(){
    for(let dictionary of DictionaryList){
        for(let word in dictionary){
            if(totalFrequency.hasOwnProperty(word)){
                totalFrequency[word] += dictionary[word];
            } else {
                totalFrequency[word] = dictionary[word];
            }
        }
    }
    console.log(totalFrequency);
}
