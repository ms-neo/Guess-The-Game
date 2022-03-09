import AudioController from './audioGame.js'
import {
    imagesSrc
} from './gameData.js'
import {
    charNames
} from './gameData.js';


class GuessWho {
    constructor(totalTime, squres, btns, screens, imagesSrc, stars) {
        this.gameInfo = imagesSrc;
        this.images = this.gameInfo;
        this.usedImages = []
        this.screens = screens
        this.squres = squres;
        this.btns = btns;
        this.stars = stars
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer;
        this.sum = [];
        this.numOfWins = [];
        this.timerElem = document.getElementById("time-remaining");
        this.removedSqr = document.getElementById('Removed-squres');
        this.socre = document.getElementById('socre');
        this.audioController = new AudioController()
    }

    startGame() {
        this.images = this.gameInfo;
        this.usedImages;
        this.newImage();
        this.nameGenerator();
        this.totalClick = 0
        this.timeRemaining = this.totalTime;

        setTimeout(() => {
            this.countDown = this.setCountDown();

        }, 100);

        this.timerElem.innerText = this.timeRemaining;
        this.removedSqr.innerText = this.totalClick;
        this.audioController.play()
    }


    // get new image everytime the game refreshed
    newImage() {

        let randIndex;

        if (this.images.length === 0) this.endTheGame()

        randIndex = Math.floor(Math.random() * this.images.length)

        let img = new Image(310, 460);
        img.src = this.images[randIndex].src
        img.alt = randIndex;
        img.style.objectFit = 'cover'
        img.classList.add('img')
        document.getElementById('image').appendChild(img)

        let randNum = Math.floor(Math.random() * 3) + 1 //so the 0 won't be one of the random numbers
        let nameOfChar = document.getElementById(randNum)
        nameOfChar.innerText = this.images[randIndex].charName;
        nameOfChar.classList.add('Correct')

        this.squres.forEach(sqr => sqr.classList.remove("hidden"))
    }

    reset() {
        this.btns.forEach(btn => {
            btn.style.cursor = 'pointer';
            btn.style.pointerEvents = "auto";
            btn.classList.remove('correct')
            btn.classList.remove('false')
            btn.innerText = ''
            btn.style.color = "#fff"
        })
        document.querySelector('.play-again').classList.remove('hidden')
        document.getElementsByClassName('play-again')[1].classList.remove('hidden')
        document.querySelector('.win-screen').classList.remove('freeze')
        document.querySelector('.lose-screen').classList.remove('freeze')
        document.querySelector('.socre-container').classList.remove('hidden')
        document.getElementById('lose-game').classList.remove('show')
        this.stars.forEach(star => star.classList.remove('show'))

        let getIndex = document.querySelector('.img').alt
        let imageIndex = this.images.indexOf(this.images[getIndex])
        this.usedImages.push(this.images[imageIndex])
        this.images.splice(imageIndex, 1);

        //remove class and name of char 
        let correctAns = document.querySelector('.Correct')
        correctAns.classList.remove('Correct')
        // remove the img tag so thre will be only one image to be be shown
        document.getElementById('image').removeChild(document.querySelector('.img'))
    }

          //to hide the squres when clicked
    removeSqures(squre) {
        squre.classList.add('hidden')
        this.audioController.flipCardSound()
    }

            // to count the squres that has been removed
    countSqr() {
        this.totalClick++
        this.removedSqr.innerText = this.totalClick;
    }

    // to count the number of squers that removed per picture
    theScore() {
        //    convert the innertext to a number then push it to new array
        let sqrNum = parseInt(this.removedSqr.innerText)
        // then push it to an array
        this.sum.push(sqrNum)
    }

    checkOfBtnMatchThePic(btn) {
        // to disable the buttons after the user choose the answer
        this.btns.forEach(btn => {
            btn.style.cursor = 'not-allowed';
            btn.style.pointerEvents = "none";
        })
        this.theScore(); // to push the amount of removed squres

        // to check if the chosen answer is matche the correct answer
        if (btn.innerText === this.getTheCorrectAnswer()) {
            btn.classList.add('correct')
            // to remove the whole squers when the player chose the answer
            this.squres.forEach(sqr => sqr.classList.add("hidden"))
            this.winGame()
            this.numOfWins.push('win')
        } else {
            btn.classList.add('false')
            this.squres.forEach(sqr => sqr.classList.add("hidden"))
            this.loseGame()
            this.numOfWins.push('lose')
        }

    }

    getTheCorrectAnswer() {
        let correctAnswer = document.querySelector('.Correct').innerText;
        return correctAnswer
    }

    setCountDown() {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.timerElem.innerText = this.timeRemaining;
            if (this.timeRemaining === 0) this.timeUp();
        }, 1000);
    }

    // to calculate the sum of the array of removed squres
    calculateScore() {
        let sum = this.sum.reduce((a, c) => a + c, 1)
        let i = 0;
        console.log(sum, 'sum', 'calc')

        if (sum <= 10) {
            console.log(this.stars, 'do')
            this.stars.forEach(star => star.classList.add('show'))
        } else if (sum > 10 && sum <= 20) {
            do {
                this.stars[i].classList.add('show')
                console.log(this.stars[i], 'do')
                i++
            } while (i < 4)
        } else if (sum > 20 && sum <= 30) {
            do {
                this.stars[i].classList.add('show')
                console.log(this.stars[i], 'do')
                i++
            } while (i < 3)
        } else if (sum > 30 && sum <= 40) {
            do {
                this.stars[i].classList.add('show')
                i++
            } while (i < 2)
        } else {
            do {
                this.stars[i].classList.add('show')
                i++
            } while (i < 1)
        }

    }

    // to count the number of win and loses 
    countNumOfWins() {
        let count = 0;
        this.numOfWins.forEach(win => {
            if (win === "win") count++
        })
        return count
    }

    endTheGame() {
        this.audioController.stop()
        // to prevent the player of clcicking before the music finish and to give som time to see the result
        document.querySelector('.congrat-screen').style.pointerEvents = "none"
        document.getElementById('correct-guess').innerText = this.countNumOfWins()
        this.reset()

        if (this.countNumOfWins() >= this.numOfWins.length / 2) {
            this.audioController.endGameSound()
            this.calculateScore()
            document.querySelector('.congrat-screen').classList.add('visible')
        } else {
            this.audioController.failSound()
            document.querySelector('.socre-container').classList.add('hidden')
            document.querySelector('.congrat-screen').classList.add('visible')
            document.getElementById('lose-game').classList.add('show')

        }
        // to alloaw the player to start a game
        setTimeout(() => {
            document.querySelector('.congrat-screen').style.pointerEvents = 'auto'
        }, 4000)

        this.sum = []
        this.numOfWins = [];
        // to fill the array again with the data
        if (this.images.length === 0) {
            for (let i = 0; i < this.usedImages.length; i++) {
                this.images.push(this.usedImages[i])
            }
            this.usedImages = []
        }
        clearInterval(this.timer)
    }

    winGame() {
        this.audioController.winSound()
        clearInterval(this.timer)

        if (this.images.length <= 1) {
            document.querySelector('.win-screen').classList.add('visible')
            document.querySelector('.win-screen').classList.add('freeze')
            document.querySelector('.play-again').classList.add('hidden')

            console.log('sure-win')
            setTimeout(() => {
                document.querySelector('.win-screen').classList.remove('visible')
                this.endTheGame()
            }, 1500)
        } else {
            setTimeout(() => {
                document.querySelector('.win-screen').classList.add('visible')
                this.reset()
            }, 1400);
        }
    }

    loseGame() {
        this.audioController.loseSound()
        clearInterval(this.timer)
        if (this.images.length <= 1) {
            document.querySelector('.lose-screen').classList.add('freeze')
            document.getElementsByClassName('play-again')[1].classList.add('hidden')
            document.querySelector('.lose-screen').classList.add('visible')
            console.log('sure-lose')
            setTimeout(() => {
                document.querySelector('.lose-screen').classList.remove('visible')
                this.endTheGame()
            }, 1500)
        } else {
            setTimeout(() => {
                document.querySelector('.lose-screen').classList.add('visible')
                this.reset()
            }, 1400);
        }
    }

    timeUp() {
        clearInterval(this.timer)
        this.numOfWins.push('lose')
        if (this.images.length <= 1) {
            this.endTheGame()
        } else {
            this.reset()
            document.querySelector('.game-over-screen').classList.add('visible')
        }
    }

    // generating random names of game and avoiding repeated name
    nameGenerator() {

        let excludedIndex = document.querySelector('.Correct');
        let j = charNames.length
        let expceptBtn = this.btns.filter(btn => btn !== excludedIndex)

        for (let i = 0; i < this.btns.length - 1; i++) {
            // console.log(charNames[i])
            if (charNames[i] !== excludedIndex.innerText) {
                expceptBtn[i].innerText = charNames[i]
            } else {
                j--
                expceptBtn[i].innerText = charNames[j]
            }
        }
    }

}


const ready = () => {

    let buttons = document.getElementsByClassName('char-name')
    let btns = [...buttons]
    let squreCards = document.getElementsByClassName('squre');
    let squres = [...squreCards]
    let gameScreens = document.getElementsByClassName('screen')
    let screens = [...gameScreens]
    let star = document.querySelectorAll('.fa-star')
    let stars = [...star]

    let game = new GuessWho(200, squres, btns, screens, imagesSrc, stars)

    screens.forEach(screen => {
        screen.addEventListener('click', () => {
            screen.classList.remove('visible')
            game.startGame()
        })
    })

    squres.forEach(squre => {
        squre.addEventListener('click', () => {
            game.removeSqures(squre)
            game.countSqr(squre)
        })
    })

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            game.checkOfBtnMatchThePic(btn)
        })
    })
}

// to load all the html elements before js
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", ready())
} else {
    ready()
}