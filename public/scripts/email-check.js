const Validate = {
    apply(input, func) {
        Validate.clearErrors(input);

        let results = Validate[func](input.value);
        input.value = results.value;

        if (results.error) {
            Validate.displayError(input, results.error)
        }

    },
    displayError(input, error) {
        const div = document.createElement('div');
        div.classList.add('error');
        div.innerHTML = error;
        input.parentNode.appendChild(div);
        
        input.focus();
    },
    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector(".error");
        
        if(errorDiv) {
            errorDiv.remove();
        }
    },
    isItEmail(value) {
        let error = null;
        const mailFormat = /^\w+([\._-]?\w+)*@\w+([\._-]?\w+)*(\.\w{2,3})+$/;

        if (!value.match(mailFormat)) {
            error = "Email inválido";
        }

        return {
            error,
            value
        }
    }
}