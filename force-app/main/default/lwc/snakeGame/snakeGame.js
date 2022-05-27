import { LightningElement, track } from 'lwc';

export default class SnakeGame extends LightningElement {
    score = 0;
    blockSize = 20;

    @track gameBlocks = [];

    isStarted = false;
    isRendered = false;

    xSpeed = 1;
    ySpeed = 0;

    xHead = 0;
    yHead = 0;

    xMax;
    yMax;

    tail = [];

    startGame(){
        setInterval(() => {
            this.move();
        }, 200);
    }

    move(){
        let lastElement = this.tail[this.tail.length - 1];
        if(lastElement !== `${this.xHead}:${this.yHead}`){
            this.tail.push(`${this.xHead}:${this.yHead}`);
            let removedElement = this.tail.shift();
            let curPosIndex = this.gameBlocks.findIndex(x => x.id === removedElement);
            this.gameBlocks[curPosIndex].snake = false;
            this.gameBlocks[curPosIndex].class = '';    
        }
        

        this.xHead += this.xSpeed;
        this.yHead += this.ySpeed;

        if(this.xHead >= this.xMax){
            this.xHead = 0;
        }

        if(this.xHead < 0){
            this.xHead = this.xMax - 1;
        }

        if(this.yHead >= this.yMax){
            this.yHead = 0;
        }

        if(this.yHead < 0){
            this.yHead = this.yMax - 1;
        }

        if(this.tail.includes(`${this.xHead}:${this.yHead}`)){
            alert(`Game Over!! Your Score: ${this.score}`);
            this.isRendered = false;
            this.tail = [];
            this.xHead = 0;
            this.yHead = 0;
            this.score = 0;
        }


        let newPosIndex = this.gameBlocks.findIndex(x => x.id === `${this.xHead}:${this.yHead}`);
        this.gameBlocks[newPosIndex].snake = true;
        this.gameBlocks[newPosIndex].class = 'snake';

        if(this.gameBlocks[newPosIndex].food){
            this.score++;
            this.tail.push(`${this.xHead}:${this.yHead}`);
            this.gameBlocks[newPosIndex].food = false;
            this.generateFood();
        }
    }

    generateFood(){
        let xFood = Math.floor(Math.random() * this.xMax);
        let yFood = Math.floor(Math.random() * this.yMax);

        let foodPosIndex = this.gameBlocks.findIndex(x => x.id === `${xFood}:${yFood}`);
        this.gameBlocks[foodPosIndex].food = true;
        this.gameBlocks[foodPosIndex].class = 'food';
    }

    keyBoardControls(){
        window.addEventListener('keydown', (keyEvent) => {
            keyEvent.preventDefault();
            console.log(keyEvent.key);
            switch(keyEvent.key) {
                case 'ArrowDown':
                    this.xSpeed = 0;
                    this.ySpeed = 1;
                    break;
                case 'ArrowUp':
                    this.xSpeed = 0;
                    this.ySpeed = -1;
                  break;
                case 'ArrowLeft':
                    this.xSpeed = -1;
                    this.ySpeed = 0;
                    break;
                case 'ArrowRight':
                    this.xSpeed = 1;
                    this.ySpeed = 0;
                    break;
              }
        });
    }

    renderedCallback(){
        if(!this.isRendered){
            let eWidth = this.template.querySelector(".game-container").clientWidth;
            let eHeight = this.template.querySelector(".game-container").clientHeight;

            this.xMax = Math.floor(eWidth/this.blockSize);
            this.yMax = Math.floor(eHeight/this.blockSize);

            let tempBlocks = [];

            for(let y = 0; y < this.yMax; y++){
                for(let x = 0; x < this.xMax; x++){
                    let obj;
                    if(x == 0 && y == 0){
                        obj = {id : `${x}:${y}`, snake : true, food : false, class : 'snake'};
                    }
                    else{
                        obj = {id : `${x}:${y}`, snake : false, food : false, class : ''};
                    }
                    
                    tempBlocks.push(obj);
                }
            }

            this.isRendered = true;
            this.gameBlocks = tempBlocks;
            this.keyBoardControls();
            this.generateFood();
            if(!this.isStarted){
                this.isStarted = true;
                this.startGame();
            }
        }
    }
}