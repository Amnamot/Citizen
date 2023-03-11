@@include('files/lib.js', {})

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