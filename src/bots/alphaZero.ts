import { Gamestate, BotSelection } from '../models/gamestate';

class Bot {
    roundsPlayed = -1;
    myDynamites = 100;
    enemyDynamites = 100;
    consecutiveDraws = 0;
    enemyLastDynamitedOn = -1;
    dynamiteOnNumberDraws = 2
    myScore = 0;
    enemyScore = 0;
    makeMove(gamestate: Gamestate): BotSelection {
        return 'W';
        this.roundsPlayed ++;
        if(this.roundsPlayed > 0){
            let lastRound = getPreviousMoves(gamestate);
            if(lastRound.p2 == 'D'){
                this.enemyDynamites--;
                this.enemyLastDynamitedOn = this.consecutiveDraws;
            }
            // In case I got caught, try to switch it up
            if(lastRound.p1 == 'D' && lastRound.p2 == 'W'){
                this.dynamiteOnNumberDraws = this.dynamiteOnNumberDraws % 3 + 1
            }

            if(lastRound.p1 == lastRound.p2){
                this.consecutiveDraws ++;
            }
            else {
                if(getLastRoundResult(lastRound)){
                    this.myScore += this.consecutiveDraws + 1;
                }
                else {
                    this.enemyScore += this.consecutiveDraws + 1;
                }
                this.consecutiveDraws = 0;
            }
        }

        // Try to throw the opponent off
        let randomDynamite = getRandomInt(500);
        if(randomDynamite == 227 && this.myDynamites > 0){
            this.myDynamites--;
            return 'D';
        }

        // In case I have too many dynamites, hopefully does not happen
        if(this.getRemainingRounds() <= this.myDynamites && this.myDynamites > 0){
            this.myDynamites --;
            return 'D';
        }

        // Try to start dynamiting
        if((this.roundsPlayed > 400 || this.myDynamites - this.enemyDynamites > 50) && this.myDynamites > 0){
            if(this.consecutiveDraws >= this.dynamiteOnNumberDraws){
                this.myDynamites --;     
                return 'D';
            }
        }
        
        // Try to water to predict a dynamite on last number of draws
        // Only try this half the time
        let randomWater = getRandomInt(2);

        // // In case enemy is unpredictable in crucial situation, either water or dynamite
        if(this.consecutiveDraws > this.enemyLastDynamitedOn && this.enemyLastDynamitedOn > 0){
            let waterOrDynamite = getRandomInt(2);
            if(this.myDynamites > 0 && waterOrDynamite == 0){
                this.myDynamites --;     
                return 'D';
            }
            if(this.enemyDynamites > 0){
             return 'W';
            }
        }
        if(this.consecutiveDraws == this.enemyLastDynamitedOn && this.consecutiveDraws > 0 && randomWater == 0 && this.enemyDynamites > 0){
            this.enemyLastDynamitedOn = -1;
            return 'W';
        }
        return getRandomBasicMove();
    }

    getRemainingRounds(){
        return Math.min(2500 - this.roundsPlayed, 1000 - this.myScore, 1000 - this.enemyScore);
    }
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function getPreviousMoves(gamestate: Gamestate){
    return gamestate.rounds[gamestate.rounds.length - 1];
}

function getRandomBasicMove(){
    let number = getRandomInt(3)
    switch(number){
        case 0: return 'P';
        case 1: return 'R';
        case 2: return 'S';
    }
}

function getLastRoundResult(lastRound){
   if(lastRound.p1 == 'D' && lastRound.p2 != 'W')return true;
   if(lastRound.p2 == 'D' && lastRound.p1 != 'W')return false;
   if(lastRound.p1 == 'D' && lastRound.p2 == 'W')return false;
   if(lastRound.p2 == 'D' && lastRound.p1 == 'W')return true;
   if(lastRound.p1 == 'W') return false;
   if(lastRound.p2 == 'W') return true;
   if(lastRound.p1 == 'R' && lastRound.p2 == 'P')return false;
   if(lastRound.p1 == 'P' && lastRound.p2 == 'S')return false;
   if(lastRound.p1 == 'S' && lastRound.p2 == 'R')return false;
   return true;
}
export = new Bot();
