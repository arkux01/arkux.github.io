function shuffle(array) {
    let shuffleTimes = Math.floor(Math.random()*4)+1;
    for(let time = 0; time<shuffleTimes ;time++){
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }        
    }

}


class Timer {
    constructor(){
        this.timerElement = document.getElementById("pb");
        this.timerInner = document.getElementById("pbi");
    }

    startTimer() {
        this.timerInner.style.animationPlayState = 'running';
    }

    pauseTimer() {
        this.timerInner.style.animationPlayState = 'paused';
    }

    resetTimer() {
        this.timerInner.style.animation = "none";
        this.timerInner.offsetWidth;
        this.timerInner.style.width = "100%";
        this.timerInner.style.animation = null;
    }

}

class NumberSlot {
    constructor(){

        this.bigCardPool = [25,50,75,100];
        this.smallCardPool = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];

        this.target = 100;
        this.slot = [0,0,0,0,0,0];
        this.slotElement = document.getElementsByClassName("number");
        this.targetElement = document.getElementsByClassName("target")[0];
        this.availableSlots = 6;

        this.hardPlaceholders = {"A":0, "B":0, "C":0, "D":0 ,"E":0};
    }

    updateAvailableSlots(){
        let counter = 0;
        for(let slot of this.slotElement){
            counter += (slot.classList.contains("disabled")?0:1);
        }
        this.availableSlots = counter;
    }


    retry(){
        for (let i = 0; i<6; i++){
            this.slotElement[i].innerHTML = this.slot[i];
        }
        //this.targetElement.style.color = "yellow";
        this.resetAllSlots();
    }
    setSlot(numBigCards, timer){
        if (numBigCards == -1){
            numBigCards = Math.floor(Math.random() * 5)
        }
        shuffle(this.bigCardPool);
        shuffle(this.smallCardPool);
        this.slot = this.bigCardPool.slice(0, numBigCards).concat(this.smallCardPool.slice(0, 6 - numBigCards));

        for (let i = 0; i<6; i++){
            this.slotElement[i].innerHTML = this.slot[i];
        }
        /*for(let i = 0; i<30000; i++){
            setTimeout(function(){targetElement.innerHTML = Math.floor(Math.random()*900) + 100;}, 100)
        }*/

        this.resetAllSlots();

        let temp = document.getElementsByClassName("target")[0];
        var counter = 0;

        this.targetElement.style.color = "yellow"; 
        var target = Math.floor(Math.random()*899) + 101;
        this.target = target; 
        var randomAnimation = setInterval(function(){
            if(counter < 20){
                temp.innerHTML = Math.floor(Math.random()*899) + 101;
                counter++;
            } else {
                clearInterval(randomAnimation);
                temp.innerHTML = target;
                timer.startTimer();
            }
        }, 20);     
    }

    generateCheckpoint(){
        let content = [], isComp = [], intermedResult = {};
        for(let slot of this.slotElement){
            content.push(slot.innerHTML);
            isComp.push(slot.classList.contains("comp"));
        }
        for(let intermedKey in this.hardPlaceholders){
            intermedResult[intermedKey] = this.hardPlaceholders[intermedKey];
        }

        return [content, isComp, intermedResult];
    }

    recallCheckpoint(checkpoint){
        if(!checkpoint)
            return false;
        let content = checkpoint[0], isComp = checkpoint[1], intermedResult = checkpoint[2];
        this.resetAllSlots();
        for(let i = 0; i < 6; i++){
            this.slotElement[i].innerHTML = content[i];
            if(content[i]==""){
                this.disableSlot(this.slotElement[i]);
                this.availableSlots--;
            }
            if(isComp[i])
                this.slotElement[i].classList.add("comp");
        }
        this.hardPlaceholders=intermedResult;
        this.updateAvailableSlots();
        return true;
    }

    disableAllSlots(){
        for (let slot of this.slotElement){
            if(!slot.classList.contains("disabled"))
                slot.classList.add("disabled");
        }
        this.availableSlots = 0;
    }

    resetAllSlots(){
        for (let slot of this.slotElement){
            if(slot.classList.contains("disabled"))
            slot.classList.remove("disabled");
            if(slot.classList.contains("selected"))
            slot.classList.remove("selected");
            if(slot.classList.contains("comp"))
            slot.classList.remove("comp");
            if(slot.classList.contains("done"))
            slot.classList.remove("done");
        }
        this.availableSlots = 6;
        this.hardPlaceholders = {"A":0, "B":0, "C":0, "D":0 ,"E":0};
    }

    disableSlot(element){
        if(!element.classList.contains("disabled")){
            element.classList.add("disabled");
            this.availableSlots--;
        }
    
    }

    enableSlot(element){
        if(element.classList.contains("disabled")){
            element.classList.remove("disabled");
            this.availableSlots++;
        }
            
    }  
    
    selectSlot(element){
        if(!element.classList.contains("selected"))
            element.classList.add("selected");
    }

    unselectSlot(element){
        if(element.classList.contains("selected"))
            element.classList.remove("selected");
    }

    replaceCard(slot1, slot2, newNum, hard = false){
        /*alert(`${this.hardPlaceholders["A"]},${this.hardPlaceholders["B"]},${this.hardPlaceholders["C"]},
        ${this.hardPlaceholders["D"]},${this.hardPlaceholders["E"]}`);*/
        if(slot1.classList.contains("comp"))
        slot1.classList.remove("comp");
        this.unselectSlot(slot1);
        this.disableSlot(slot1);
        this.selectSlot(slot2);
        slot1.innerHTML = "";
        let numDisplay = newNum, p = false;
        if(hard){
            for(p in this.hardPlaceholders){
                if(this.hardPlaceholders[p] == 0){
                    this.hardPlaceholders[p] = numDisplay;
                    numDisplay = p;
                    break;                    
                }
            }
        }
        slot2.innerHTML = numDisplay;
        if(!slot2.classList.contains("comp"))
            slot2.classList.add("comp");

        let isGameDone = (newNum == this.target);
        if(isGameDone){
            slot2.innerHTML = newNum;
            this.targetElement.style.color = "lime";
        } else if (this.availableSlots<=1){
            //this.targetElement.style.color = "lightcoral";
        }
        return [isGameDone, p];
    }

}

class Solver {
    constructor(target=0, numbers=[0,0,0,0,0,0]){
        this.target = target;
        this.numbers = numbers;
        this.operators = ["÷","÷","-","-","+","×"]
        this.solutionScratch = [];
        this.solved = false;
        this.perfectlySolved = false;
    }

    set(target,numbers=false){
        this.target = target;
        if(numbers){
            this.numbers = numbers.slice();
        }
            
        this.solutionScratch = [];
        this.solved = false;
    }

    operate(num1, num2, mode){
        switch (mode){
            case 0: 
                return (num1 % num2 == 0)? num1/num2:0;
            case 1:
                return (num2 % num1 == 0)? num2/num1:0;
            case 2: 
                return Math.max(num1-num2,0);
            case 3: 
                return Math.max(num2-num1,0);
            case 4:
                return num1+num2;
            case 5:
                return num1*num2;
            default:
                return 0; 
        }
    }

    /*
        The recursive sub-routine on solving the number's game.
    */
    solve(depth = 5, numbers = this.numbers, target = this.target){           //[1, 2, 3, 4, 5, 6]
        this.solutionScratch = [];
        let numbersSize = numbers.length;
        if(depth == 0){
            return numbers.includes(target);
        }
        for (let i = 0; i < numbersSize; i ++){
            for(let j = i + 1; j < numbersSize;j++){
                let operationOrder = [0,1,2,3,4,5];
                shuffle(operationOrder);
                for (let mode of operationOrder){
                    let result = this.operate(numbers[i],numbers[j],mode);
                    if(!result) // Invalid Operation
                        continue;
                    let newNumbers = numbers.slice();
                    //newNumbers[i] = result;
                    newNumbers.splice(j, 1);
                    newNumbers.splice(i, 1);
                    newNumbers.unshift(result);
                    let recur = this.solve(depth-1,newNumbers, target);
                    if(!recur) // Subproblem cannot be solved
                        continue;
                    if(result==this.target)
                        result = "<font style='border-bottom: 3px double;'>" + result + "</font>"; 
                    switch(mode){
                        case 0: case 2:case 4: case 5:
                            this.solutionScratch.unshift(numbers[i]+this.operators[mode]+numbers[j]+"="+result);
                            break;
                        case 1: case 3:
                            this.solutionScratch.unshift(numbers[j]+this.operators[mode]+numbers[i]+"="+result);
                            break;
                    }
                    this.solved = true;
                    return true;
                }
                
            }
        }
        return false;
    }

    optimalSolve(){
        /*
            Formal solving process starts here.
        */
        this.solved = false;
        this.perfectlySolved = false;
        shuffle(this.numbers);
        this.solutionScratch = [];
        for(let i = 0; i<6; i++){
            if(this.solve(i)){
                this.perfectlySolved = true;
                break;
            }
                
        }
        /*
            If the exact target cannot be obtained, try using smaller depths to
            achieve as close to the target as possible.
        */
       
        if(!this.solved){
            let noise = Math.floor(Math.random()*2)*2-1;
            let newDepth = 0, newTarget = 0;
            for(let error = 6; error < 36; error++){
                newDepth = error % 6;
                newTarget = this.target + (error-newDepth)/6 * noise;
                if(this.solve(newDepth,this.numbers,newTarget))
                    break;
                newTarget = this.target - (error-newDepth)/6 * noise;
                if(this.solve(newDepth,this.numbers,newTarget))
                    break;
            }
        }
        return this.solutionToString();

    }

    solutionToString(){
        if(this.solved)
            return this.solutionScratch.join('<br>');
        return false;
    }
}

class Operator {

    constructor(){
        this.operatorElement = document.getElementsByClassName("operator");
    }


    disableAllOperators(){
        for (let operator of this.operatorElement){
            if(!operator.classList.contains("disabled"))
            operator.classList.add("disabled");
        }
    }

    enableAllOperators(){
        for (let operator of this.operatorElement){
            if(operator.classList.contains("disabled"))
            operator.classList.remove("disabled");
        }
    }

    isValidOperation(num1, Op, num2){
        if(num1*num2 == 0)
            return false;
        if (Op=="-") {
            return (num1 > num2);
        }
        if (Op=="÷") {
            return (num1 % num2 == 0);
        }
        return true;
    }

    operate(slot1, operator, slot2, placeholders = {"A":0,"B":0,"C":0,"D":0,"E":0}) {
        let s1 = slot1.innerHTML, s2 = slot2.innerHTML, keys = ["A","B","C","D","E"];
        if(keys.includes(s1))
            s1 = placeholders[s1];
        if(keys.includes(s2))
            s2 = placeholders[s2];
        let num1 = parseInt(s1), Op = operator.innerHTML, num2 = parseInt(s2);
        if (!this.isValidOperation(num1, Op, num2))
            return false;
        switch (Op){
            case "+":
                return num1 + num2;
            case "-":
                return num1 - num2;
            case "×":
                return num1 * num2;
            case "÷":
                return num1 / num2;
                                        
        }
    }
}

class HistoryRecorder {
    constructor(){
        this.cardArchive = [];
    }

    archiveCard(cardArray){
        this.cardArchive.push(cardArray);
    }

    popArchive(){
        if(this.cardArchive.length==0)
            return false;
        return this.cardArchive.pop();
    }

}

class Settings {
    constructor(){
        this.isHidden = true;
        this.numBigCards = [true,true,true,true,true];
        this.showGameInfo = false;
        this.showSol = false;
        this.showTimer = false;
        this.showManual = false;
        this.hideIntermediateResult = false;
        this.canGoBack = true;
    }

    setMode(toHard) {
        let buttons = document.getElementsByClassName("mode");
        let bg = document.getElementById("interface"),
            pb = document.getElementsByClassName("progressbar")[0],
            pbi = document.getElementsByClassName("inner")[0],
            st = document.getElementById("setting");
        this.hideIntermediateResult = toHard;
        buttons[0].disabled = toHard;
        buttons[1].disabled = !toHard;
        bg.style.backgroundColor = toHard? "rgb(241, 210, 210)":"rgb(193, 210, 241)";
        bg.style.borderColor = toHard? "brown":"darkcyan";
        pb.style.borderColor = toHard? "#c55":"#55c";
        pbi.style.backgroundColor = toHard? "#c55":"#55c";
        st.style.backgroundColor = toHard? "rgba(200,0,0,0.2)":"rgba(0,0,200,0.2)";
    }




}

class ScratchBoard {
    constructor(){
        this.scratchBoardElement = document.getElementsByClassName("scratch")[0];
        this.scratchCheckpoint = [];
    }

    revealScratch(placeholder){
        let text = this.scratchBoardElement.innerHTML;
        //console.log(text);
        for(let key in placeholder)
            text = text.replaceAll(key, placeholder[key]);
        this.scratchBoardElement.innerHTML = text;
        this.scratchCheckpoint = [];
    }

    addScratch(text){
        this.scratchCheckpoint.push(this.scratchBoardElement.innerHTML.length);
        this.scratchBoardElement.innerHTML += text;
    }

    undoScratch(){
        if(this.scratchCheckpoint.length==0) return;
        let k = this.scratchCheckpoint.pop();
        this.scratchBoardElement.innerHTML = this.scratchBoardElement.innerHTML.slice(0,k);
    }    

    clearScratch(){
        this.scratchBoardElement.innerHTML = "";
        this.scratchCheckpoint = [];
    }

}

class Gameboard {

    constructor(){
        this.state = 0;
        // state could be:
        // 0 - No ongoing game. e.g. first time loading / a game just finished. Disable all buttons.
        // 1 - Ongoing game, no element selected. Disable all operators.
        // 2 - Ongoing game, first operand selected.
        // 3 - Ongoing game, operator selected. Disable all operators.
        this.card = new NumberSlot();
        this.scratchBoard = new ScratchBoard();
        this.history = new HistoryRecorder();
        this.operator = new Operator();
        this.setting = new Settings();
        this.solver = new Solver();
        this.timer = new Timer();
        this.operandHeld = false;
        this.operatorHeld = false;
        this.func = document.getElementsByClassName("func");
        this.numBigCards = -1;
    }
    
    disableFunc(i){
        if(!this.func[i].classList.contains("disabled")){
            this.func[i].classList.add("disabled");
        }
    }

    enableFunc(i){
        if(this.func[i].classList.contains("disabled")){
            this.func[i].classList.remove("disabled");
        }
    }

    reset(isNewGame){
        this.scratchBoard.clearScratch();        
        if(isNewGame){
            this.timer.resetTimer();
            this.card.setSlot(this.numBigCards, this.timer);
            this.solver.set(this.card.target, this.card.slot);
            var boardCopy = this;
            this.timer.timerInner.addEventListener("animationend", function(){
                boardCopy.gotoState(0);
                boardCopy.enableFunc(2);
                boardCopy.card.targetElement.style.color = "pink";
                
                
            });
            this.disableFunc(0);            
            this.disableFunc(2);
        } else {
            this.card.retry();
        }

        this.disableFunc(1); 
        this.disableFunc(3); 
        this.gotoState(1);
    }

    undo(){
        switch (this.state) {
            case 0:
                return;
            case 1:case 2: case 4:
                this.scratchBoard.undoScratch();
                this.scratchBoard.undoScratch();
                this.scratchBoard.undoScratch();                
                this.card.recallCheckpoint(this.history.popArchive());
                this.gotoState(1);

                break;
            /*case 2: case 4:

                return;*/
            case 3:
                //let held = this.operandHeld.innerHTML + this.operatorHeld.innerHTML;
                this.scratchBoard.undoScratch();
                this.card.unselectSlot(this.operandHeld);
                this.gotoState(1);
                break;
            //case 4:
                /*this.scratchBoard.undoScratch();
                this.scratchBoard.undoScratch();

                this.gotoState(1); 
                return;*/
        }
        
        if(this.card.availableSlots==6){
            this.disableFunc(1); 
            this.disableFunc(3); 
        }
    }


    gotoState(state = this.state){
        this.state = state;
        switch (state) {
            case 0:

                this.card.disableAllSlots();
                this.operator.disableAllOperators();
                this.operandHeld = false;
                this.operatorHeld = false; 
                this.enableFunc(0); 
                this.disableFunc(1); 
                this.disableFunc(2);
                this.disableFunc(3); 
                
                break;
            case 1:
                this.operandHeld = false;
                this.operatorHeld = false; 
                this.operator.disableAllOperators();

                break;
            case 2:
                this.operatorHeld = false; 
                this.operator.enableAllOperators();
                break;

            case 3: case 4:
                this.enableFunc(3); 
                this.enableFunc(1);
                this.disableFunc(0);                
                this.operator.disableAllOperators();          
                break;
        }
    }

    showSolution(){  
        if(this.setting.hideIntermediateResult)
            this.scratchBoard.revealScratch(this.card.hardPlaceholders);
        let currentScratch = this.scratchBoard.scratchBoardElement.innerHTML;                
        this.reset(false);
        this.gotoState(0);
        let solution = this.solver.optimalSolve();
        let color = "";
        if(!solution){
            solution = `There is no solution within <br> ${this.card.target-5} and ${this.card.target+5}! :(`;
            color = "gray";
        } else if (this.solver.perfectlySolved){
            color = "darkblue";
        } else {
            color = "firebrick";
        }
        //let solStyle = (currentScratch?`border-left: 2px solid ${color};`:"")+`color:${color};`;
        let solStyle =`color:${color};border: 2px solid;border-radius:5px;`;
        let inner = `<table class="sol" style="font-size:22px;"><tr><td>${currentScratch}</td><td style="${solStyle}">${solution}</td></tr></table>`;
        this.scratchBoard.addScratch(inner);
    }

    onclick(element){
        switch (this.state) {
            case 1:
                this.card.selectSlot(element);
                this.operandHeld = element;
                this.gotoState(2);
                return;
            case 2:
                if (element.classList.contains("number")){
                    this.card.unselectSlot(this.operandHeld);
                    if(this.operandHeld == element){
                        this.gotoState(1);
                        return;
                    }
                    this.card.selectSlot(element);
                    this.operandHeld = element;
                } else {
                    this.scratchBoard.addScratch(this.operandHeld.innerHTML + element.innerHTML);
                    this.operatorHeld = element;
                    this.gotoState(3);
                }
                return;
            case 3:
                if(this.operandHeld==element){
                    this.undo();
                    return;
                }

                let result = this.operator.operate(this.operandHeld, this.operatorHeld, element, this.card.hardPlaceholders);
                if(!result)
                    return;
                this.history.archiveCard(this.card.generateCheckpoint());
                this.scratchBoard.addScratch(element.innerHTML);
                let [isTargetAchieved, placeholder] = this.card.replaceCard(this.operandHeld, element, result, this.setting.hideIntermediateResult);

                let isCardExhausted = (this.card.availableSlots <= 1);
                if(isTargetAchieved)
                    this.gotoState(0);
                else if (isCardExhausted)
                    this.gotoState(4);
                else
                    this.gotoState(2);
                if(isTargetAchieved){
                    this.enableFunc(2);
                    this.timer.pauseTimer();
                    element.classList.remove("disabled");
                    element.classList.remove("selected");
                    element.classList.add("done");
                    result = "<font style='border-bottom: 3px double;'>" + result + "</font>"; 
                }else if(this.setting.hideIntermediateResult){
                    result = placeholder;
                }                
                this.scratchBoard.addScratch("=" + result + "<br>");
                this.operandHeld = element;
                break;
            case 4:
                return;
        }
        /*////////////////////////
        let text = `${this.card.hardPlaceholders["A"]},${this.card.hardPlaceholders["B"]},${this.card.hardPlaceholders["C"]},
        ${this.card.hardPlaceholders["D"]},${this.card.hardPlaceholders["E"]}`;

        document.getElementById("debug").innerHTML = text;
        ////////////////////////*/
    }

}

var board = new Gameboard();
