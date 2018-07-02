'use strict'

const clockFace = document.querySelector('.js-time');
const startBtn = document.querySelector('.js-start');
const lapBtn = document.querySelector('.js-take-lap')
const resetBtn = document.querySelector('.js-reset');
const lapsUl = document.querySelector('.js-laps')


class CountTimer {
    constructor(object) {
        this.object = object;
        this.isActive = false;
        this.time = 0;
        this.startTime = null;
        this.id = null;

        this.getFormattedTime = function (millisecond) {
            const time = new Date(millisecond);
            let min = time.getMinutes().toString()
            let sec = time.getSeconds().toString()
            let ms = Number.parseInt(time.getMilliseconds() / 100)
            if (min.length < 2) {
                min = '0' + min;
            }
            if (sec.length < 2) {
                sec = '0' + sec;
            }
            return `${min}:${sec}.${ms}`;

        };


        this.deltaTime = function () {
            let now = Date.now();
            let timePass = now - this.startTime;
            this.startTime = now;
            return timePass;
        };

        this.updateTime = function () {
            let timeFormat = this.getFormattedTime(this.time)
            this.time += this.deltaTime();
            this.object.textContent = timeFormat;
        };
    }



    start() {
        if (!this.isActive) {
            this.id = setInterval(this.updateTime.bind(this), 100);
            this.startTime = Date.now();
            this.isActive = true;
        }
    };
    stop() {
        if (this.isActive) {
            clearInterval(this.id);
            this.id = null;
            this.isActive = false;

        }
    };
    reset() {
        if (!this.isActive) {
            this.time = 0;
            this.updateTime();
        }
    };
    lap() {
        let dataTime = this.getFormattedTime(this.time);
        return dataTime;
    };
}


const myTimer = new CountTimer(clockFace)

function start({target}) {
    if (!myTimer.isActive) {
        setActive(target);
        myTimer.start()
        startBtn.textContent = 'Pause'
    } else {  
        setActive(target);  
        myTimer.stop()
        startBtn.textContent = 'Start'
    }
}

let timerArr = []
let count = 0;

function lapData({target}) {
    if(myTimer.lap() === '00:00.0' || resetBtn.classList.contains('active')) {
        return
    }
    setActive(target);
    count++;
    timerArr.push(myTimer.lap())
    creatLiElement(timerArr, count)
}

function creatLiElement(arr, count) {
    const li = document.createElement('li');
    lapsUl.append(li)
    li.textContent = `Lap ${count}: ${arr.slice(-1)[0]}`
}

function reset({target}) {
    if (!myTimer.isActive) {
        setActive(target);
        myTimer.reset();
        if (lapsUl.firstChild) {
            count = 0;
            while (lapsUl.firstChild) {
                lapsUl.removeChild(lapsUl.firstChild)
            }

        }
    }
}

function setActive (target) {
    if(target.classList.contains('active')) {
        return;
    }
    startBtn.classList.remove('active')
    resetBtn.classList.remove('active')
    lapBtn.classList.remove('active')

    target.classList.add('active')

}

startBtn.addEventListener('click', start);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lapData)