const pomodoroTimer = document.querySelector("#timer");
const startBtn = document.querySelector("#btn-start");
const pauseBtn = document.querySelector("#btn-pause");
const stopBtn = document.querySelector("#btn-stop");

let isClockStopped = true;
let isClockRunning = false;
let workSessionDuration = 1500;
let currentTimeLeftInSession = 1500;
let breakSessionDuration = 300;
let type = "Work";
let timeSpentInCurrentSession = 0;
let currentTaskLabel = document.querySelector("#pomodoro-clock-task");

let updatedWorkSessionDuration;
let updatedBreakSessionDuration;

let workDurationInput = document.querySelector('#input-work-duration');
let breakDurationInput = document.querySelector('#input-break-duration'); 


startBtn.addEventListener("click", () =>  {
    toggleClock();
})


pauseBtn.addEventListener("click", () =>  {
    toggleClock();
})


stopBtn.addEventListener("click", () =>  {
    toggleClock(true);
})

workDurationInput.addEventListener('input', () => {
  updatedWorkSessionDuration = minuteToSeconds(workDurationInput.value)
})

breakDurationInput.addEventListener('input', () => {
  updatedBreakSessionDuration = minuteToSeconds(
    breakDurationInput.value
  )
})

const minuteToSeconds = mins => {
    return mins * 60
}

const toggleClock = (reset) =>  {
    if(reset) {
        // Stop the timer
        stopClock();
    } else {
        if(isClockStopped) {
            setUpdatedTimers();
            isClockStopped = false;
        }

        if(isClockRunning === true) {
            // Pause the timer
            clearInterval(clockTimer)
            isClockRunning = false;
        } else {
            // Start the timer
            isClockRunning = true;

            clockTimer = setInterval(() => {
                // currentTimeLeftInSession--;
                stepDown();
                displayCurrentTimeLeftInSession();
            }, 1000)
        }     
    }
}

const displayCurrentTimeLeftInSession = () => {
    const secondsLeft = currentTimeLeftInSession;
    let result = "";
    const seconds = secondsLeft % 60;
    const minutes = parseInt(secondsLeft / 60) % 60;
    // let hours = parseInt(secondsLeft / 3600);

    function addLeadingZeros(time) {
        return time < 10 ? `0${time}` : time
    }

    result += `${addLeadingZeros(minutes)}:${addLeadingZeros(seconds)}`
    pomodoroTimer.innerText = result.toString();
}

const stopClock = () =>  {
    setUpdatedTimers();
    displaySessionLog(type);
    clearInterval(clockTimer);
    isClockStopped = true;
    isClockRunning = false;
    currentTimeLeftInSession = workSessionDuration;
    displayCurrentTimeLeftInSession();
    type = "Work";
    timeSpentInCurrentSession = 0;
}

const stepDown = () => {
    if (currentTimeLeftInSession > 0) {
      // decrease time left / increase time spent
      currentTimeLeftInSession--;
      timeSpentInCurrentSession++;
      } else if (currentTimeLeftInSession === 0) {
          timeSpentInCurrentSession = 0;
        // Timer is over -> if work switch to break, viceversa
        if (type === 'Work') {
          currentTimeLeftInSession = breakSessionDuration;
          displaySessionLog('Work');
          type = 'Break';

          setUpdatedTimers();

          currentTaskLabel.value = "Break";
          currentTaskLabel.disabled = true;
        } else {
          currentTimeLeftInSession = workSessionDuration;
          type = 'Work';

          setUpdatedTimers();

          if(currentTaskLabel.value === "Break") {
              currentTaskLabel.value = workSessionLabel;
          }
          currentTaskLabel.disabled = false;
          displaySessionLog('Break');
        }
      }
      displayCurrentTimeLeftInSession();
    }

const displaySessionLog = (type) => {
    // const sessionsList = document.querySelector('#pomodoro-sessions');
    // // append li to it
    // const li = document.createElement('li');


    // if (type === 'Work') {
    //     sessionLabel = currentTaskLabel.value
    //       ? currentTaskLabel.value
    //       : 'Work'
    //     workSessionLabel = sessionLabel
    //   } else {
    //     sessionLabel = 'Break'
    //   }
    
    
    // let elapsedTime = parseInt(timeSpentInCurrentSession / 60)
    // elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1';
  
    // const text = document.createTextNode(
    //   `${sessionLabel} : ${elapsedTime} min`
    // )
    // li.appendChild(text);
    // sessionsList.appendChild(li);


    const sessionsList = document.querySelector('#pomodoro-sessions');
    // append li to it
    const li = document.createElement('li');

    if (type === 'Work') {
        sessionLabel = currentTaskLabel.value
          ? currentTaskLabel.value
          : 'Work'
        workSessionLabel = sessionLabel
    } else {
        sessionLabel = 'Break'
    }
    

    // let elapsedTime = parseInt(timeSpentInCurrentSession / 60)
    // elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1';
  
    // const text = document.createTextNode(
    //   `${sessionLabel} : ${elapsedTime} min`
    // )
    const text = document.createTextNode(sessionLabel);



    li.appendChild(text);
    sessionsList.appendChild(li);
}

const setUpdatedTimers = () =>  {
    if(type === "Work") {
        currentTimeLeftInSession = updatedWorkSessionDuration ? 
                        updatedWorkSessionDuration
                        : workSessionDuration
        workSessionDuration = currentTimeLeftInSession;
    } else {
        currentTimeLeftInSession = updatedBreakSessionDuration
                ? updatedBreakSessionDuration
                : breakSessionDuration
         breakSessionDuration = currentTimeLeftInSession
    }
}