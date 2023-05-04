const addRemoveClass = function (el, elClass) {
  if (el.classList.contains(elClass)) {
    el.classList.remove(elClass);
  } else {
    el.classList.add(elClass);
  }
};


document.querySelectorAll('.copy__value').forEach((elm) => {
  elm.addEventListener('click', (e) => {
    let inp = document.createElement('input')
    inp.value = e.currentTarget.getAttribute('copy')
    document.body.appendChild(inp)
    inp.select()
    
    if (document.execCommand('copy')) {
      console.log("Done!")
    } else {
      console.log("Failed...")
    }
    
    document.body.removeChild(inp)
  });
}) 

const questionContent = document.querySelectorAll('.question_content');

questionContent.forEach((item) => {
  item.addEventListener('click', (e) => {
    addRemoveClass(e.currentTarget.querySelector('.arrow'), 'arrow_down');
    addRemoveClass(e.currentTarget.parentElement.querySelector('.question_answer'), 'hide');
  });
})

const FAQTab = document.querySelectorAll('.FAQ__tab');

FAQTab.forEach((item) => {
  item.addEventListener('click', (e) => {
    if (e.currentTarget.classList.contains('FAQ__select')) {
      return;
    }
    FAQTab.forEach(
      (tab) => {
        if (tab == e.currentTarget || tab.classList.contains('FAQ__select')) {
          addRemoveClass(tab, 'FAQ__select');
          addRemoveClass(document.querySelector(`.${tab.id.slice(5)}__page`), 'hide');
        }
      }
    );
    const header = document.querySelector('header');
    header.classList = [];
    header.classList.add(`${e.currentTarget.id.slice(5)}__colorGR`);
  });
})