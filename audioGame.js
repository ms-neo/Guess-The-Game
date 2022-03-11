
export default class AudioController {
    constructor(){
      this.bgMusic = new Audio('audio/bg.mp3');
      this.flipCard= new Audio('audio/card.wav');
      this.btnAudio = new Audio('audio/btn.wav');
      this.endGameAudio = new Audio('audio/end-game.mp3');
      this.loseAudio = new Audio('audio/lose.wav');
      this.winAudio = new Audio('audio/win.wav');
      this.failAudio = new Audio('audio/fail.wav');
      this.bgMusic.volume=0.1;
      this.loseAudio.volume=.3;
      this.bgMusic.loop =true;
    }

    play(){
        this.bgMusic.play()
    }

    stop(){
        this.bgMusic.pause()
    }

    flipCardSound(){
        this.flipCard.play()
    }

    btnSound(){
        this.btnAudio.play()
    }

    endGameSound(){
        this.endGameAudio.play()
    }

    loseSound(){
        this.loseAudio.play()
    }

    winSound(){
        this.winAudio.play()
    }

    failSound(){
        this.failAudio.play()
    }
}