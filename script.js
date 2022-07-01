class NumberSlot {
    constructor(){

        this.bigCardPool = [25,50,75,100];
        this.smallCardPool = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];

        this.target = 100;
        this.slot = [0,0,0,0,0,0];
        this.slotElement = document.getElementsByClassName("number");
        this.targetElement = document.getElementsByClassName("target")[0];
        this.availableSlots = 6;
    }

    shuffle(){
        for (let i = this.bigCardPool.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.bigCardPool[i];
            this.bigCardPool[i] = this.bigCardPool[j];
            this.bigCardPool[j] = temp;
        }
        for (let i = this.smallCardPool.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.smallCardPool[i];
            this.smallCardPool[i] = this.smallCardPool[j];
            this.smallCardPool[j] = temp;
        }
    }

    retry(){
        for (let i = 0; i<6; i++){
            this.slotElement[i].innerHTML = this.slot[i];
        }
        this.targetElement.style.color = "yellow";
        this.resetAllSlots();
    }
    setSlot(numBigCards){
        if (numBigCards == -1){
            numBigCards = Math.floor(Math.random() * 5)
        }
        this.shuffle();
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
        var target = Math.floor(Math.random()*900) + 100;
        this.target = target; 
        var randomAnimation = setInterval(function(){
            if(counter < 20){
                temp.innerHTML = Math.floor(Math.random()*900) + 100;
                counter++;
            } else {
                clearInterval(randomAnimation);
                temp.innerHTML = target;
            }
        }, 20);     
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

    replaceCard(slot1, slot2, newNum){
        if(slot1.classList.contains("comp"))
        slot1.classList.remove("comp");
        this.unselectSlot(slot1);
        this.disableSlot(slot1);
        this.selectSlot(slot2);
        slot1.innerHTML = "";
        slot2.innerHTML = newNum;
        if(!slot2.classList.contains("comp"))
            slot2.classList.add("comp");
        // alert(newNum + " = " + this.target + "?");
        let isGameDone = (newNum == this.target);
        if(isGameDone){
            this.targetElement.style.color = "lime";
        } else if (this.availableSlots<=1){
            //this.targetElement.style.color = "lightcoral";
        }
        return isGameDone;
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
        if (Op=="-") {
            return (num1 > num2);
        }
        if (Op=="÷") {
            return (num1 % num2 == 0);
        }
        return true;
    }

    operate(slot1, operator, slot2) {
        let num1 = parseInt(slot1.innerHTML), Op = operator.innerHTML, num2 = parseInt(slot2.innerHTML);
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
        this.scratchArchive = [];
        this.archiveStatus = 0;
    }

    archiveScratch(scratchString,){
        this.scratchArchive.push(scratchString);
    }

    archiveCard(cardArray){
        this.cardArchive.push(cardArray);
    }




}

class ScratchBoard {
    constructor(){
        this.scratchLines = [];
        this.scratchBoardElement = document.getElementsByClassName("scratch")[0];
    }

    addScratch(text){
        this.scratchBoardElement.innerHTML += text;
    }
    undoScratch(){

    }    

    clearScratch(){
        this.scratchBoardElement.innerHTML = "";
    }

}

class Gameboard {

    constructor(){
        this.state = 0;
        // state could be:
        // 0 - No ongoing game. e.g. initial state. Disable all buttons.
        // 1 - Ongoing game, no element selected. Disable all operators.
        // 2 - Ongoing game, first operand selected.
        // 3 - Ongoing game, operator selected. Disable all operators.
        // 4 - Ongoing game, second operand selected and proceed to check.
        this.card = new NumberSlot();
        this.scratchBoard = new ScratchBoard();
        this.history = new HistoryRecorder();
        this.operator = new Operator();
        this.operandHeld = false;
        this.operatorHeld = false;
        this.func = document.getElementsByClassName("func");
        this.numBigCards = -1;
    }
    
    disableFunc(isRetry){
        if(!this.func[isRetry].classList.contains("disabled")){
            this.func[isRetry].classList.add("disabled");
        }
    }

    enableFunc(isRetry){
        if(this.func[isRetry].classList.contains("disabled")){
            this.func[isRetry].classList.remove("disabled");
        }
    }

    reset(isNewGame){
        if(isNewGame){
            this.card.setSlot(this.numBigCards);
        } else {
            this.card.retry();            
            this.enableFunc(0);
        }
        this.disableFunc(1); 
        this.state = 1;    
        this.scratchBoard.clearScratch();
        this.operandHeld = false;
        this.operatorHeld = false;
        this.processState();
    }


    processState(){
        switch (this.state) {
            case 0:
                this.card.disableAllSlots();
                this.enableFunc(0); 
                this.operator.disableAllOperators();
                break;
            case 1:
                this.operator.disableAllOperators();
                break;
            case 2:
                this.operator.enableAllOperators();
                break;
            case 3:
                this.enableFunc(1);
                this.disableFunc(0);                
                this.operator.disableAllOperators();          
                break;

            
        }
    }

    onclick(element){
        switch (this.state) {
            case 1:
                this.card.selectSlot(element);
                this.state++;
                this.operandHeld = element;
                this.processState();
                break;
            case 2:
                if (element.classList.contains("number")){
                    this.card.unselectSlot(this.operandHeld);
                    this.card.selectSlot(element);
                    this.operandHeld = element;
                } else {
                    this.scratchBoard.addScratch(this.operandHeld.innerHTML + element.innerHTML);
                    this.state++;
                    this.operatorHeld = element;
                    this.processState();
                    break;
                }
                break;
            case 3:
                /*if(element == this.operandHeld){
                    this.operandHeld = false;
                    this.state=1;
                    this.processState();
                }*/
                if(this.operandHeld==element)
                    break;
                let result = this.operator.operate(this.operandHeld, this.operatorHeld, element);
                if(result){
                    this.scratchBoard.addScratch(element.innerHTML);
                    let isTargetAchieved = this.card.replaceCard(this.operandHeld, element, result);
                    let isCardExhausted = (this.card.availableSlots <= 1);
                    if(isTargetAchieved){
                        this.state = 0;
                        result = "<font style='border-bottom: 3px double;'>" + result + "</font>"; 
                    } else if (isCardExhausted) {
                        this.state = 3; 
                    } else {
                        this.state = 2;
                    }
                    this.processState();    
                    if(isTargetAchieved){
                        element.classList.remove("disabled");
                        element.classList.remove("selected");
                        element.classList.add("done");
                    }                
                    this.scratchBoard.addScratch("=" + result + "<br>");
                    this.operandHeld = element;
                    this.operatorHeld = false;
                }
                break;
            case 4:
                break;
        }
    }

}

var board = new Gameboard();
