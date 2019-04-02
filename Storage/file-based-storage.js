const fs = require('fs');

switch (process.argv[2]) {
    case 'add':
        addTask(process.argv[3]);
        break;
    case 'list':
        listTasks();
        break;
}

function addTask(task){
    task += "\n";
    try{
        fs.appendFileSync('./fileBasedStorage.txt', task, 'utf8');
    } catch (e) {
        console.log(e);
    }

}

function listTasks() {
    const content = fs.readFileSync('./fileBasedStorage.txt', 'utf8');
    const list = content.split("\n");
    console.log(list);
}