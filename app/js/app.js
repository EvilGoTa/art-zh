import axios from 'axios'
import animateCss from './_animateCss'

window.modalOpen = false;

const toggleModal = e => {
    e.preventDefault();
    document.getElementsByClassName('modal')[0].classList.toggle('display')
    document.getElementById("file").value = ''
    document.getElementById("file-label").innerText = 'Загрузить файл'
    document.getElementById("name-input").focus()
}

document.getElementById('modal-close').addEventListener('click', toggleModal);

Array.prototype.map.call(
    document.getElementsByClassName('start-project'),
    el => el.addEventListener('click', toggleModal)
)

document.getElementById("file").onchange = function() {
    let input = this.files[0];
    if (input && input.name) {
        document.getElementById("file-label").innerText = input.name
    } else {
        document.getElementById("file-label").innerText = 'Загрузить файл'
    }
}

document.getElementById('submit-form').onclick = function() {
    const form = document.getElementById('form');
    const fields = document.querySelectorAll('.group .required');

    let checkForm = true;
    fields.forEach(el => {
        if (el.value === '') {
            checkForm = false;
            animateCss(el.parentNode, 'shakeX')
        }
    })

    if (checkForm) {
        axios.post('/form_send/', new FormData(form)).then(response => {
            if (response.data.status === 'ok') {
                animateCss('#form', 'bounceOut').then(_ => _.classList.add('d-none'))
                animateCss('#submit-form-wrapper', 'bounceOut')
                    .then(_ => {
                        _.classList.add('d-none')
                        animateCss('#success', 'bounceIn');
                    })
            } else {
                console.log(response);
            }
        }).catch(console.error)
    }
}