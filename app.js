
const spanCount = document.querySelector(".count span");
const spanBullets = document.querySelector(".bullets .spans");
const questionArea = document.querySelector(".quiz-area h2");
const questionsContainer = document.querySelector(".quiz-area");
const answerArea = document.querySelector(".answer-area");
const submitBtn = document.querySelector(".submit");
const bulletsContainer = document.querySelector(".bullets");
const results = document.querySelector(".results");
const counter = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswers = 0;
let intervalCount;


function getQuestions() {
    const myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const questions = JSON.parse(this.responseText);
            const qCount = questions.length;

            getContentQuestion(questions, currentIndex, qCount);
            getBullets(qCount);
            countDown(30, qCount);
            submitBtn.onclick = () => {
                if (currentIndex < qCount) {
                    let rightAnswer = questions[currentIndex].right_answer;
                    checkAnswers(rightAnswer);
                }
                currentIndex++;
                answerArea.innerHTML = "";
                questionArea.innerHTML = "";
                getContentQuestion(questions, currentIndex, qCount);
                if (currentIndex < qCount) {

                    const spans = spanBullets.querySelectorAll("span");
                    spans[currentIndex].classList.add("on");
                }
                getResults(currentIndex, qCount);
                clearInterval(intervalCount)
                countDown(30, qCount);
            };
        }
    }
    myRequest.open("GET", "./questions.json", true);
    myRequest.send();
};
getQuestions();

function getBullets(num) {
    spanCount.innerHTML = num;
    for (i = 0; i < num; i++) {
        spanBullets.innerHTML += `<span></span>`;
        const spans = spanBullets.querySelectorAll("span");
        spans[0].classList.add("on");
    };
};
function getContentQuestion(obj, index, count) {
    if (index < count) {
        questionArea.innerHTML = obj[index].title;
        for (i = 1; i <= 4; i++) {
            answerArea.innerHTML += `<div class="answer">
            <input type="radio" id="answer_${i}" name="questions" data-answer = "${obj[index][`answer_${i}`]}">
            <label for="answer_${i}">${obj[index][`answer_${i}`]}</label>
        </div>`;
            const inputs = answerArea.querySelectorAll(".answer input");
            inputs[0].checked = true;
        };
    }
};

function checkAnswers(rAnswer) {
    const inputs = document.querySelectorAll(".answer input");
    inputs.forEach(input => {
        if (input.checked && input.dataset.answer == rAnswer) {
            rightAnswers++;
        }
    })
}
function getResults(index, count) {
    if (index === count) {
        questionArea.remove();
        answerArea.remove();
        bulletsContainer.remove();
        console.log(rightAnswers);
        questionsContainer.innerHTML = "Questions Were Finished";
        if (rightAnswers > (count / 2) && rightAnswers < count) {
            results.innerHTML = `<span class="good">Good</span> You Answered ${rightAnswers} Of ${count}`;
        } else if (rightAnswers === count) {
            results.innerHTML = `<span class = "perfect">Perfect</span> You Answered ${rightAnswers} Of ${count}`;
        } else {
            results.innerHTML = `<span class="bad">Bad</span> You Answered ${rightAnswers} Of ${count}`;
        };
    };
};

function countDown(duration, count) {
    let minutes, seconds;
    intervalCount = setInterval(() => {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);

        if(minutes < 10){
            minutes = `0${minutes}`;;
        }
        if(seconds < 10){
            seconds = `0${seconds}`;
        }

        if (currentIndex < count) {
            --duration
            counter.innerHTML = `${minutes}:${seconds}`;
        };
        if (duration < 0) {
            clearInterval(intervalCount);
            submitBtn.onclick();

        }
    }, 1000)
}
