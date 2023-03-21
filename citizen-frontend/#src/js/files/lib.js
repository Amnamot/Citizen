const addRemoveClass = function (el, elClass) {
  if (el.classList.contains(elClass)) {
    el.classList.remove(elClass);
  } else {
    el.classList.add(elClass);
  }
};

function throttle(func, ms) {

  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {

    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments);

    isThrottled = true;

    setTimeout(function() {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

function debounce(f, ms) {

  let isCooldown = false;

  return function() {
    if (isCooldown) return;

    f.apply(this, arguments);

    isCooldown = true;

    setTimeout(() => isCooldown = false, ms);
  };

}

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