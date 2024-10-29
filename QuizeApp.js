// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let theResults = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
// Set options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let qCount = questionsObject.length;

            // Create Bullets + Set Questions count
            createBullets(qCount);

            console.log(questionsObject[0]);

            // Add Question Data
            addQuestionData(questionsObject[currentIndex], qCount);

            // CountDown
            countdown(30, qCount);


            // Click On Submit
            submitButton.onclick = () => {
                let theRightAnswer = questionsObject[currentIndex].correct_answer;



                // Check The Answer
                checkAnswer(theRightAnswer, qCount);

                // Remove Previous Question
                quizArea.innerHTML = "";

                // Remove Answers Area
                answerArea.innerHTML = "";

                // Increase Index;
                currentIndex++;

                // Add New Question
                addQuestionData(questionsObject[currentIndex], qCount);

                // Handle Bullets Class
                handleBullets();

                // countdown
                clearInterval(countdownInterval);
                countdown(30, qCount);

                //show Results
                showResult(qCount);
            }
        }
    };

    myRequest.open("GET", "QuizQuestions.json", true);
    myRequest.send();
}
getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;

    // Create Spans
    for (let i = 0; i < num; i++) {
        // Create Span
        let theBullet = document.createElement("span");

        //Check if this is the first span
        if (i === 0) {
            theBullet.className = "On";
        }

        // Append Bullets To Main Bullet Container
        bulletsSpanContainer.appendChild(theBullet);


    }
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {

        // Create H2 Quesion Title
        let questionTitle = document.createElement("h2");

        // Create Question Text
        let questionText = document.createTextNode(obj["question"]);

        console.log(obj["correct_answer"]);

        // Append Text To H2
        questionTitle.appendChild(questionText);

        // Appen The H2 To The Quiz Area
        quizArea.appendChild(questionTitle);

        // Create Answer Options
        for (let i = 1; i <= 4; i++) {
            // Create Main Answer Div
            let answerDiv = document.createElement("div");

            // Add Class To answer Div
            answerDiv.className = "answer";

            // Create Radio Input
            let radioInput = document.createElement("input");

            // Add Type + Name + Id + Data-Attribute
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer${i}`;
            radioInput.dataset.answer = obj[`answer${i}`];

            // Make First Option Selected
            if (i === 1) {
                radioInput.checked = true;
            }
            // Create Label
            let thelabel = document.createElement("label");

            // Add For Attribute
            thelabel.htmlFor = `answer${i}`;

            // Create Text Node
            let theLabelTex = document.createTextNode(obj[`answer${i}`]);

            // Add The Text To label
            thelabel.appendChild(theLabelTex);

            // Add Input + Label To Main Div
            answerDiv.appendChild(radioInput);
            answerDiv.appendChild(thelabel);

            // Append All Divs To Answer Area
            answerArea.appendChild(answerDiv);
        }
    }
}

function checkAnswer(ranswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }


    if (ranswer === theChoosenAnswer) {
        rightAnswers++;
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "On";
        }
    })
}

function showResult(count) {
    if (currentIndex === count) {
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResults.innerHTML = `<span class="good">Good</span>, ${rightAnswers} From ${count} Is Good.`;
        } else if (rightAnswers === count) {
            theResults.innerHTML = `<span class="perfect">Excellent</span>, You Got Them All Right!`;
        } else {
            theResults.innerHTML = `<span class="bad">Try Again</span>, ${rightAnswers} From ${count} Needs Improvement.`;
        }

    }
}
function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? "0" + minutes : minutes;

            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                // Clear Interval on completion
                clearInterval(countdownInterval);
                // click on submit
                submitButton.click();
            }

        }, 1000);//1000 ms is 1 second
    }
}