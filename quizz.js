
const questionContainer = document.querySelector('#js-question-container');

const quizz = document.querySelector('.js-quizz');

const result = document.querySelector('.js-score');

const getQuestions = (callback) => {
    const request = new XMLHttpRequest();
    request.addEventListener('readystatechange', (() => {
        // console.log(request, request.readyState);
        if (request.readyState === 4 && request.status === 200) {
            const data = JSON.parse(request.responseText);
            callback(undefined, data);

        } else if (request.readyState === 4) {
            callback("Les données n'ont pas pu etre chargées", undefined);
        }

    }))
    request.open('GET', './questions.json');
    request.send();
}

getQuestions((err, data) => {
    console.log('callback fired !');
    console.log(err, data);

    let output = '';
    data.forEach(question => {
        output += `<p class="lead">${question.title}</p>`;
        question.answers.forEach(answer => {
            output += `<div class="form-check ${answer.value}">
            <input type="radio" class="form-radio answer${question.id}" name="q${question.id}" "value=${answer.value} ${shouldBeChecked(answer.id)}>
                <label class="form-check-label" for= "q${question.id}">${answer.sentence}</label>
        </div >`;
        });
        questionContainer.innerHTML = output;
        tryToDelegate();
        formSubmission(question);
    })
});

const formSubmission = (question) => {

    quizz.addEventListener('submit', e => {
        e.preventDefault();
        let score = 0;
        const userAnswers = [quizz.q0.value, quizz.q1.value, quizz.q2.value, quizz.q3.value];
        
        console.log('useranswers',userAnswers[3]);
        const correctAnswers = ["A", "B", "B", "B"];
        const nbQuestions = correctAnswers.length;
        let commentText = document.querySelector('.js-comment-text');

        userAnswers.forEach((answer, index) => {
            if (answer === correctAnswers[index]) {
                score += 1 / nbQuestions;
            }
            console.log('answer',answer, score);
            result.classList.remove('d-none');
            switch (score * 100) {
                case 0:
                    commentText.textContent = "Flatten by the ninja";
                    scrollToTop();
                    break;
                case 25:
                    commentText.textContent = "That's a pity score, please improve !";
                    scrollToTop();
                    break;
                case 50:
                    commentText.textContent = "On the way to the success !";
                    scrollToTop();
                    break;
                case 75:
                    commentText.textContent = "You nearly beat the ninja !";
                    scrollToTop();
                    break;
                case 100:
                    commentText.textContent = "The ninja is KO !";
                    scrollToTop();
                    break;
                default:
                    commentText.textContent = '';
            }

            let outputScore = 0;
            const timer = setInterval(() => {
                result.querySelector('.js-score-inner').innerHTML = `Your score is < span class="display-4 text-primary" > ${outputScore} %</span > `;
                if (outputScore === (score * 100)) {
                    clearInterval(timer)
                } else {
                    outputScore++;
                }

            }, 10);
        });
    })
}

let scrollToTop = () => {
    const topXOffset = document.querySelector('#top').offsetLeft;
    const topYOffset = document.querySelector('#top').offsetTop;

    window.scrollTo(topXOffset, topYOffset);
}
const tryToDelegate = () => {
    quizz.querySelectorAll('.form-check').forEach(item => {
        item.addEventListener('click', () => {
            item.querySelector('input[type="radio"]').setAttribute('checked', 'checked');
            var el = item.nextElementSibling;
            console.log(el);
        });
    })
}
const shouldBeChecked = element => {
    if (element === 0) {
        return 'checked';
    } else {return '';}
}