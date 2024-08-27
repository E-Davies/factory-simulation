/*
    | W | W | W |           | W | W | W | W | W | W |
   ——————-——————-—         ——————-——————-——————-——————-
    | A |   | B |           | A |   | B | P | B |   |
   ——————-——————-—         ——————-——————-——————-——————-
    | W | W | W |           | W | W | W | W | W | W |

Task:
◦ The simulation will run 100 times (for loop)
◦ 3 pairs of workers (6 peps total)
◦ How many products are made?
◦ How many components of each type go through without being picked?

Can a worker hold a finished product AND one component piece??
    ◦ I assume that once a worker has built the product it goes from 2 items (A&B) to 
      one item (P) and therefore can pick another component while waiting for a space to place down the product

*/

const numOfWorkStations = 3;
const numOfCyclesToBuild = 4;

const NONE = 'None';
const COM_A = 'ComA'; //Component A
const COM_B = 'ComB'; //Component B
const PRODUCT = 'Product';

let beltItem;
let itemsOnBelt = [];
let itemsThatLeftBelt = [];
let finishedProducts = 0;
let unpickedComA = 0;
let unpickedComB = 0;
let workStations = [];

const createWorkStations = numOfWorkStations => {
    for(let i = 0; i < numOfWorkStations; i++){
        workStations.push({
            employeeA: {
                isHolding: [],
                isBuilding: false, 
                buildCycle: 0,
            },
            employeeB: {
                isHolding: [],
                isBuilding: false,
                buildCycle: 0,
            }
        });
    };
};

// belt items will be as follows -> 
//      0 = none, 
//      1 = component A, 
//      2 = component B

const generateBeltItem = () => {
    beltItem = Math.floor(Math.random()* 3)
    if (beltItem === 0){
        itemsOnBelt.unshift(NONE);
    } else if (beltItem === 1){
        itemsOnBelt.unshift(COM_A);
    }else {
        itemsOnBelt.unshift(COM_B);
    };
};

const checkEmployeeStatus = () => {
    
    for(let i = 0; i < numOfWorkStations; i++){ // loop through each work station (each work station has employee A & employee B)
        const employeeA = workStations[i].employeeA;
        const employeeB = workStations[i].employeeB;
   
        // if item on belt = none -> check if employees at that station have product to put down on the conveyor belt
        if(itemsOnBelt[i] === NONE && employeeA.isHolding.includes(PRODUCT)) {
            employeeA.isHolding.shift();
            itemsOnBelt[i] = PRODUCT;
        }else if(itemsOnBelt[i] === NONE && employeeB.isHolding.includes(PRODUCT)) {
            employeeB.isHolding.shift();
            itemsOnBelt[i] = PRODUCT;
        };

        //if item on belt = ComA or ComB ->  see if either employee needs that item and if one of them does, they can pick it up
        if((itemsOnBelt[i] == COM_A || itemsOnBelt[i] == COM_B) && (employeeA.isHolding.length < 2 && !employeeA.isHolding.includes(itemsOnBelt[i]))){
            employeeA.isHolding.push(itemsOnBelt[i])
            itemsOnBelt[i] = NONE;
        }else if((itemsOnBelt[i] == COM_A || itemsOnBelt[i] == COM_B) && (employeeB.isHolding.length < 2 && !employeeB.isHolding.includes(itemsOnBelt[i]))){
            employeeB.isHolding.push(itemsOnBelt[i])
            itemsOnBelt[i] = NONE;
        };

        //Now check if employee A can start building or update their build cycle if already building
        if(employeeA.isHolding.length === 2 && !employeeA.isHolding.includes(PRODUCT)){
            employeeA.isBuilding = true
            employeeA.buildCycle++;
                
            if(employeeA.buildCycle === numOfCyclesToBuild) {
                employeeA.isHolding = [PRODUCT];
                employeeA.isBuilding = false;
                employeeA.buildCycle = 0;
            };
        };

        //Now check if employee B can start building or update their build cycle if already building
        if(employeeB.isHolding.length === 2 && !employeeB.isHolding.includes(PRODUCT)){
            employeeB.isBuilding = true
            employeeB.buildCycle++;
                
            if(employeeB.buildCycle === numOfCyclesToBuild) {
                employeeB.isHolding = [PRODUCT];
                employeeB.isBuilding = false;
                employeeB.buildCycle = 0;
            };
        };
    };
};


const calcItemsLeavingBelt = () => {
    if (itemsOnBelt.length > numOfWorkStations){ //remove last item on the conveyor belt if it passes the last work station
        let itemLeavingBelt = itemsOnBelt.pop();
        itemsThatLeftBelt.unshift(itemLeavingBelt); 

        //store num of items that left the conveyor belt so we can see totals at end of the production run
        if (itemLeavingBelt === COM_A){
            unpickedComA++
        }else if (itemLeavingBelt === COM_B){
            unpickedComB++
        }else if (itemLeavingBelt === PRODUCT){
            finishedProducts++
        }
    };
};

const runProduction = numOfCycles => {
    createWorkStations(numOfWorkStations);

    for (let i = 0; i < numOfCycles; i++){
        generateBeltItem();        
        calcItemsLeavingBelt();
        checkEmployeeStatus();
    };

    //Once production run is complete - provide the stats
    console.log(`Items that left the conveyor belt:`);
    console.log(`Products: ${finishedProducts}`);
    console.log(`Component A: ${unpickedComA}`);
    console.log(`Component B: ${unpickedComB}`);
};

runProduction(100);


