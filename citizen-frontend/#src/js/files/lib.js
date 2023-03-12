const addRemoveClass = function (el, elClass) {
  if (el.classList.contains(elClass)) {
    el.classList.remove(elClass);
  } else {
    el.classList.add(elClass);
  }
};