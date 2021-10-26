export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  setTimeout(hideAlert, 4000);
};

var dialog;

export const showConfirmation = function (header, message, callback) {
  dialog = getDialogElement(header, message, callback);
  document.querySelector('body').appendChild(dialog);
  document.querySelector('.freeze__layer').style.display = '';
};

const hideDialog = () => {
  dialog.remove();
  document.querySelector('.freeze__layer').style.display = 'none';
};

const okayHandler = (callback) => async () => {
    hideDialog();
    await callback();
}

const getDialogElement = (title, msg, callback) => {
  const container = document.createElement('div');
  container.className = 'dialog__container';

  const header = document.createElement('div');
  header.className = 'dialog__header';
  header.textContent = title;
  container.appendChild(header);

  const body = document.createElement('div');
  body.className = 'dialog__body';
  body.textContent = msg;
  container.appendChild(body);

  const footer = document.createElement('div');
  footer.className = 'dialog__footer';

  const okbtn = document.createElement('a');
  okbtn.className = 'btn btn--green btn-small';
  okbtn.textContent = 'OK';
  okbtn.addEventListener('click', okayHandler(callback));
  footer.appendChild(okbtn);

  const cnclbtn = document.createElement('a');
  cnclbtn.className = 'btn btn--red btn-small';
  cnclbtn.textContent = 'Cancel';
  cnclbtn.addEventListener('click', hideDialog);
  footer.appendChild(cnclbtn);

  body.appendChild(footer);

  return container;
};

/*  `<div class='dialog__container>
      <div class='dialog__header>${title}</div>
      <div class='dialog__body>${msg}</div>
      <div class='dialog__footer>
          <a class='btn btn--red btn-small'>Cancel</a>
          <a class='btn btn--green btn-small'>OK</a>
      </div>
  </div>`; */
