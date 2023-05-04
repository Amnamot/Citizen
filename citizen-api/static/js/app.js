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

var ua = window.navigator.userAgent;
var msie = ua.indexOf("MSIE ");
var isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
function isIE() {
	ua = navigator.userAgent;
	var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
	return is_ie;
}
if (isIE()) {
	document.querySelector('html').classList.add('ie');
}
if (isMobile.any()) {
	document.querySelector('html').classList.add('_touch');
}

function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
testWebP(function (support) {
	if (support === true) {
		document.querySelector('html').classList.add('_webp');
	} else {
		document.querySelector('html').classList.add('_no-webp');
	}
});

function ibg() {
	if (isIE()) {
		let ibg = document.querySelectorAll("._ibg");
		for (var i = 0; i < ibg.length; i++) {
			if (ibg[i].querySelector('img') && ibg[i].querySelector('img').getAttribute('src') != null) {
				ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
			}
		}
	}
}
ibg();

window.addEventListener("load", function () {
	if (document.querySelector('.wrapper')) {
		setTimeout(function () {
			document.querySelector('.wrapper').classList.add('_loaded');
		}, 0);
	}
});

let unlock = true;

//Menu
let iconMenu = document.querySelector(".icon-menu");
if (iconMenu != null) {
	let delay = 500;
	let menuBody = document.querySelector(".menu__body");
	iconMenu.addEventListener("click", function (e) {
		if (unlock) {
			body_lock(delay);
			iconMenu.classList.toggle("_active");
			menuBody.classList.toggle("_active");
		}
	});
};
function menu_close() {
	let iconMenu = document.querySelector(".icon-menu");
	let menuBody = document.querySelector(".menu__body");
	iconMenu.classList.remove("_active");
	menuBody.classList.remove("_active");
}
//=================
//BodyLock
function body_lock(delay) {
	let body = document.querySelector("body");
	if (body.classList.contains('_lock')) {
		body_lock_remove(delay);
	} else {
		body_lock_add(delay);
	}
}
function body_lock_remove(delay) {
	let body = document.querySelector("body");
	if (unlock) {
		let lock_padding = document.querySelectorAll("._lp");
		setTimeout(() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = '0px';
			}
			body.style.paddingRight = '0px';
			body.classList.remove("_lock");
		}, delay);

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}
function body_lock_add(delay) {
	let body = document.querySelector("body");
	if (unlock) {
		let lock_padding = document.querySelectorAll("._lp");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight = window.innerWidth - document.querySelector('.site').offsetWidth + 'px';
		}
		body.style.paddingRight = window.innerWidth - document.querySelector('.site').offsetWidth + 'px';
		body.classList.add("_lock");

		unlock = false;
		setTimeout(function () {
			unlock = true;
		}, delay);
	}
}
//=================
// LettersAnimation
let title = document.querySelectorAll('._letter-animation');
if (title) {
	for (let index = 0; index < title.length; index++) {
		let el = title[index];
		let txt = el.innerHTML;
		let txt_words = txt.replace('  ', ' ').split(' ');
		let new_title = '';
		for (let index = 0; index < txt_words.length; index++) {
			let txt_word = txt_words[index];
			let len = txt_word.length;
			new_title = new_title + '<p>';
			for (let index = 0; index < len; index++) {
				let it = txt_word.substr(index, 1);
				if (it == ' ') {
					it = '&nbsp;';
				}
				new_title = new_title + '<span>' + it + '</span>';
			}
			el.innerHTML = new_title;
			new_title = new_title + '&nbsp;</p>';
		}
	}
}
//=================
//Tabs
let tabs = document.querySelectorAll("._tabs");
for (let index = 0; index < tabs.length; index++) {
	let tab = tabs[index];
	let tabs_items = tab.querySelectorAll("._tabs-item");
	let tabs_blocks = tab.querySelectorAll("._tabs-block");
	for (let index = 0; index < tabs_items.length; index++) {
		let tabs_item = tabs_items[index];
		tabs_item.addEventListener("click", function (e) {
			for (let index = 0; index < tabs_items.length; index++) {
				let tabs_item = tabs_items[index];
				tabs_item.classList.remove('_active');
				tabs_blocks[index].classList.remove('_active');
			}
			tabs_item.classList.add('_active');
			tabs_blocks[index].classList.add('_active');
			e.preventDefault();
		});
	}
}
//=================
//Spollers
let spollers = document.querySelectorAll("._spoller");
let spollersGo = true;
if (spollers.length > 0) {

	function spollerCLick(e) {
		const spoller = e.target;
		if (spollersGo) {
			spollersGo = false;

			if (spoller.closest('._spollers').classList.contains('_one')) {
				let curent_spollers = spoller.closest('._spollers').querySelectorAll('._spoller');
				for (let i = 0; i < curent_spollers.length; i++) {
					let el = curent_spollers[i];
					if (el != spoller) {
						el.classList.remove('_active');
						_slideUp(el.nextElementSibling);
					}
				}
			}
			spoller.classList.toggle('_active');
			_slideToggle(spoller.nextElementSibling);

			setTimeout(function () {
				spollersGo = true;
			}, 500);
		}
	}
	function spollersInit() {
		for (let index = 0; index < spollers.length; index++) {
			const spoller = spollers[index];
			let spollerMax = spoller.getAttribute('data-max');

			if (spollerMax && window.innerWidth > spollerMax) {
				if (spoller.classList.contains('_init')) {
					spoller.classList.remove('_active');
					spoller.classList.remove('_init');
					spoller.nextElementSibling.style.cssText = '';
					spoller.removeEventListener("click", spollerCLick);
				}
			} else if (!spoller.classList.contains('_init')) {
				spoller.classList.add('_init');
				spoller.addEventListener("click", spollerCLick);
			}
		}
	}
	function spollersShowActive() {
		for (let index = 0; index < spollers.length; index++) {
			const spoller = spollers[index];
			if (spoller.classList.contains('_active')) {
				_slideToggle(spoller.nextElementSibling);
			}
		}
	}
	window.addEventListener("resize", spollersInit);

	setTimeout(function () {
		spollersShowActive();
		spollersInit();
	}, 0);
}

//=================
//DigiFormat
function digi(str) {
	var r = str.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, "$1 ");
	return r;
}
//=================
//DiGiAnimate
function digi_animate(digi_animate) {
	if (digi_animate.length > 0) {
		for (let index = 0; index < digi_animate.length; index++) {
			const el = digi_animate[index];
			const el_to = parseInt(el.innerHTML.replace(' ', ''));
			if (!el.classList.contains('_done')) {
				digi_animate_value(el, 0, el_to, 1500);
			}
		}
	}
}
function digi_animate_value(el, start, end, duration) {
	var obj = el;
	var range = end - start;
	// no timer shorter than 50ms (not really visible any way)
	var minTimer = 50;
	// calc step time to show all interediate values
	var stepTime = Math.abs(Math.floor(duration / range));

	// never go below minTimer
	stepTime = Math.max(stepTime, minTimer);

	// get current time and calculate desired end time
	var startTime = new Date().getTime();
	var endTime = startTime + duration;
	var timer;

	function run() {
		var now = new Date().getTime();
		var remaining = Math.max((endTime - now) / duration, 0);
		var value = Math.round(end - (remaining * range));
		obj.innerHTML = digi(value);
		if (value == end) {
			clearInterval(timer);
		}
	}

	timer = setInterval(run, stepTime);
	run();

	el.classList.add('_done');
}
//=================
//Popups
let popup_link = document.querySelectorAll('._popup-link');
let popups = document.querySelectorAll('.popup');

document.addEventListener('click',
	function (e) {
		if (!e.target.classList.contains('_popup-link')) {
			return;
		}

			if (unlock) {
				window.localStorage.setItem('popupColor', e.target.getAttribute('popupcolor') || '');
				let item = e.target.getAttribute('href').replace('#', '');
				let video = e.target.getAttribute('data-video');
				if (['Describe','ChangeTheTies','Thank','ThankNo'].find((elm) => { return elm == item }) || 0) {
					window.localStorage.setItem('selectOtherUser', e.target.getAttribute('user_id') || '');
				}
				popup_open(item, video);
			}
			e.preventDefault();
		}
);

for (let index = 0; index < popups.length; index++) {
	const popup = popups[index];
	popup.addEventListener("click", function (e) {
		if (!e.target.closest('.popup__body')) {
			popup_close(e.target.closest('.popup'));
		}
	});
}
function popup_open(item, video = '') {
	if (['Describe','ChangeTheTies','Thank','ThankNo'].find((elm) => { return elm == item }) || 0) {
		if (!window.otherUserList) {
			history.pushState('', '', window.location.href.split('#')[0]);
			return;
		}
		let user = otherUserList[window.localStorage.getItem('selectOtherUser') || 0]||null;
		if (user) {
			switch (item) {
				case 'Describe':
					user?.popupDescribeRender();
					break;
					case 'ChangeTheTies':
						user?.popupChangeTheTiesRender();
					break;
					case 'Thank':
						user?.popupThankRender();
					break;
					case 'ThankNo':
						user?.popupThankNoRender();
					break;
			
				default:
					break;
			}
		}
	}
	let activePopup = document.querySelectorAll('.popup._active');
	if (activePopup.length > 0) {
		popup_close('', false);
	}
	let curent_popup = document.querySelector('.popup_' + item);
	if (curent_popup && unlock) {
		if (video != '' && video != null) {
			let popup_video = document.querySelector('.popup_video');
			popup_video.querySelector('.popup__video').innerHTML = '<iframe src="https://www.youtube.com/embed/' + video + '?autoplay=1"  allow="autoplay; encrypted-media" allowfullscreen></iframe>';
		}
		if (!document.querySelector('.menu__body._active')) {
			body_lock_add(500);
		}
		curent_popup.classList.add('_active');
		window.localStorage.getItem('popupColor') ? curent_popup.classList.add(window.localStorage.getItem('popupColor')) : null;
		history.pushState('', '', '#' + item);
	}
}
function popup_close(item, bodyUnlock = true, history = true) {
	if (unlock) {
		if (!item) {
			for (let index = 0; index < popups.length; index++) {
				const popup = popups[index];
				let video = popup.querySelector('.popup__video');
				if (video) {
					video.innerHTML = '';
				}
				popup.classList.remove('_active');
				popup.classList.remove(window.localStorage.getItem('popupColor')||'');
			}
		} else {
			let video = item.querySelector('.popup__video');
			if (video) {
				video.innerHTML = '';
			}
			item.classList.remove('_active');
			window.localStorage.getItem('popupColor') && item.classList.remove(window.localStorage.getItem('popupColor')||'');
		}
		if (!document.querySelector('.menu__body._active') && bodyUnlock) {
			body_lock_remove(500);
		}
		if (history) {
			window.history.pushState('', '', window.location.href.split('#')[0]);
		}
		
	}
}
let popup_close_icon = document.querySelectorAll('.popup__close,._popup-close');
if (popup_close_icon) {
	for (let index = 0; index < popup_close_icon.length; index++) {
		const el = popup_close_icon[index];
		el.addEventListener('click', function () {
			popup_close(el.closest('.popup'));
		})
	}
}
document.addEventListener('keydown', function (e) {
	if (e.code === 'Escape') {
		popup_close();
	}
});

//=================
//SlideToggle
let _slideUp = (target, duration = 500) => {
	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = duration + 'ms';
	target.style.height = target.offsetHeight + 'px';
	target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout(() => {
		target.style.display = 'none';
		target.style.removeProperty('height');
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.classList.remove('_slide');
	}, duration);
}
let _slideDown = (target, duration = 500) => {
	target.style.removeProperty('display');
	let display = window.getComputedStyle(target).display;
	if (display === 'none')
		display = 'block';

	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + 'ms';
	target.style.height = height + 'px';
	target.style.removeProperty('padding-top');
	target.style.removeProperty('padding-bottom');
	target.style.removeProperty('margin-top');
	target.style.removeProperty('margin-bottom');
	window.setTimeout(() => {
		target.style.removeProperty('height');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.classList.remove('_slide');
	}, duration);
}
let _slideToggle = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (window.getComputedStyle(target).display === 'none') {
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	}
}
//========================================
//Wrap
function _wrap(el, wrapper) {
	el.parentNode.insertBefore(wrapper, el);
	wrapper.appendChild(el);
}
//========================================
//RemoveClasses
function _removeClasses(el, class_name) {
	for (var i = 0; i < el.length; i++) {
		el[i].classList.remove(class_name);
	}
}
//========================================
//IsHidden
function _is_hidden(el) {
	return (el.offsetParent === null)
}
// ShowMore Beta ========================
let moreBlocks = document.querySelectorAll('._more-block');
if (moreBlocks.length > 0) {
	let wrapper = document.querySelector('.wrapper');
	for (let index = 0; index < moreBlocks.length; index++) {
		const moreBlock = moreBlocks[index];
		let items = moreBlock.querySelectorAll('._more-item');
		if (items.length > 0) {
			let itemsMore = moreBlock.querySelector('._more-link');
			let itemsContent = moreBlock.querySelector('._more-content');
			let itemsView = itemsContent.getAttribute('data-view');
			if (getComputedStyle(itemsContent).getPropertyValue("transition-duration") === '0s') {
				itemsContent.style.cssText = "transition-duration: 1ms";
			}
			itemsMore.addEventListener("click", function (e) {
				if (itemsMore.classList.contains('_active')) {
					setSize();
				} else {
					setSize('start');
				}
				itemsMore.classList.toggle('_active');
				e.preventDefault();
			});

			let isScrollStart;
			function setSize(type) {
				let resultHeight;
				let itemsContentHeight = 0;
				let itemsContentStartHeight = 0;

				for (let index = 0; index < items.length; index++) {
					if (index < itemsView) {
						itemsContentHeight += items[index].offsetHeight;
					}
					itemsContentStartHeight += items[index].offsetHeight;
				}
				resultHeight = (type === 'start') ? itemsContentStartHeight : itemsContentHeight;
				isScrollStart = window.innerWidth - wrapper.offsetWidth;
				itemsContent.style.height = `${resultHeight}px`;
			}

			itemsContent.addEventListener("transitionend", updateSize, false);

			function updateSize() {
				let isScrollEnd = window.innerWidth - wrapper.offsetWidth;
				if (isScrollStart === 0 && isScrollEnd > 0 || isScrollStart > 0 && isScrollEnd === 0) {
					if (itemsMore.classList.contains('_active')) {
						setSize('start');
					} else {
						setSize();
					}
				}
			}
			window.addEventListener("resize", function (e) {
				if (!itemsMore.classList.contains('_active')) {
					setSize();
				} else {
					setSize('start');
				}
			});
			setSize();
		}
	}
}
//========================================
//Animate
function animate({ timing, draw, duration }) {
	let start = performance.now();
	requestAnimationFrame(function animate(time) {
		// timeFraction изменяется от 0 до 1
		let timeFraction = (time - start) / duration;
		if (timeFraction > 1) timeFraction = 1;

		// вычисление текущего состояния анимации
		let progress = timing(timeFraction);

		draw(progress); // отрисовать её

		if (timeFraction < 1) {
			requestAnimationFrame(animate);
		}

	});
}

//Полифилы
(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// реализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function () {
	// проверяем поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector;
	}
})();
let scr_body = document.querySelector('body');
let scr_blocks = document.querySelectorAll('._scr-sector');
let scr_items = document.querySelectorAll('._scr-item');
let scr_fix_block = document.querySelectorAll('._side-wrapper');
let scr_min_height = 750;

let scrolling = true;
let scrolling_full = true;

let scrollDirection = 0;

let currentScroll;

//ScrollOnScroll
window.addEventListener('scroll', scroll_scroll);
function scroll_scroll() {
	let src_value = currentScroll = pageYOffset;
	let header = document.querySelector('header.header');
	if (header !== null) {
		if (src_value > 10) {
			header.classList.add('_scroll');
		} else {
			header.classList.remove('_scroll');
		}
	}
	if (scr_blocks.length > 0) {
		for (let index = 0; index < scr_blocks.length; index++) {
			let block = scr_blocks[index];
			let block_offset = offset(block).top;
			let block_height = block.offsetHeight;

			if ((pageYOffset > block_offset - window.innerHeight / 1.5) && pageYOffset < (block_offset + block_height) - window.innerHeight / 5) {
				block.classList.add('_scr-sector_active');
			} else {
				if (block.classList.contains('_scr-sector_active')) {
					block.classList.remove('_scr-sector_active');
				}
			}
			if ((pageYOffset > block_offset - window.innerHeight / 2) && pageYOffset < (block_offset + block_height) - window.innerHeight / 5) {
				if (!block.classList.contains('_scr-sector_current')) {
					block.classList.add('_scr-sector_current');
				}
			} else {
				if (block.classList.contains('_scr-sector_current')) {
					block.classList.remove('_scr-sector_current');
				}
			}
		}
	}
	if (scr_items.length > 0) {
		for (let index = 0; index < scr_items.length; index++) {
			let scr_item = scr_items[index];
			let scr_item_offset = offset(scr_item).top;
			let scr_item_height = scr_item.offsetHeight;


			let scr_item_point = window.innerHeight - (window.innerHeight - scr_item_height / 3);
			if (window.innerHeight > scr_item_height) {
				scr_item_point = window.innerHeight - scr_item_height / 3;
			}

			if ((src_value > scr_item_offset - scr_item_point) && src_value < (scr_item_offset + scr_item_height)) {
				scr_item.classList.add('_active');
				scroll_load_item(scr_item);
			} else {
				scr_item.classList.remove('_active');
			}
			if (((src_value > scr_item_offset - window.innerHeight))) {
				if (scr_item.querySelectorAll('._lazy').length > 0) {
					scroll_lazy(scr_item);
				}
			}
		}
	}
	if (scr_fix_block.length > 0) {
		fix_block(scr_fix_block, src_value);
	}
	let custom_scroll_line = document.querySelector('._custom-scroll__line');
	if (custom_scroll_line) {
		let window_height = window.innerHeight;
		let content_height = document.querySelector('.wrapper').offsetHeight;
		let scr_procent = (pageYOffset / (content_height - window_height)) * 100;
		let custom_scroll_line_height = custom_scroll_line.offsetHeight;
		custom_scroll_line.style.transform = "translateY(" + (window_height - custom_scroll_line_height) / 100 * scr_procent + "px)";
	}
	if (src_value > scrollDirection) {
		// downscroll code
	} else {
		// upscroll code
	}
	scrollDirection = src_value <= 0 ? 0 : src_value;
}
setTimeout(function () {
	scroll_scroll();
}, 100);

function scroll_lazy(scr_item) {
	let lazy_src = scr_item.querySelectorAll('*[data-src]');
	if (lazy_src.length > 0) {
		for (let index = 0; index < lazy_src.length; index++) {
			const el = lazy_src[index];
			if (!el.classList.contains('_loaded')) {
				el.setAttribute('src', el.getAttribute('data-src'));
				el.classList.add('_loaded');
			}
		}
	}
	let lazy_srcset = scr_item.querySelectorAll('*[data-srcset]');
	if (lazy_srcset.length > 0) {
		for (let index = 0; index < lazy_srcset.length; index++) {
			const el = lazy_srcset[index];
			if (!el.classList.contains('_loaded')) {
				el.setAttribute('srcset', el.getAttribute('data-srcset'));
				el.classList.add('_loaded');
			}
		}
	}
}
function scroll_load_item(scr_item) {
	if (scr_item.classList.contains('_load-map') && !scr_item.classList.contains('_loaded-map')) {
		let map_item = document.getElementById('map');
		if (map_item) {
			scr_item.classList.add('_loaded-map');
			map();
		}
	}
}
function scrParallax(block, scrProcent, blockHeight) {
	let prlxItems = block.querySelectorAll('._prlx-item');
	if (prlxItems.length > 0) {
		for (let index = 0; index < prlxItems.length; index++) {
			const prlxItem = prlxItems[index];
			let prlxItemAttr = (prlxItem.dataset.prlx) ? prlxItem.dataset.prlx : 3;
			const prlxItemValue = -1 * (blockHeight / 100 * scrProcent / prlxItemAttr);
			prlxItem.style.cssText = `transform: translateY(${prlxItemValue}px);`;
		}
	}
}
//FullScreenScroll
if (scr_blocks.length > 0 && !isMobile.any()) {
	disableScroll();
	window.addEventListener('wheel', full_scroll);

	let swiperScrolls = document.querySelectorAll('._swiper_scroll');

	if (swiperScrolls.length > 0) {
		for (let index = 0; index < swiperScrolls.length; index++) {
			const swiperScroll = swiperScrolls[index];
			swiperScroll.addEventListener("mouseenter", function (e) {
				window.removeEventListener('wheel', full_scroll);
			});
			swiperScroll.addEventListener("mouseleave", function (e) {
				window.addEventListener('wheel', full_scroll);
			});
		}
	}
}
function getPrevBlockPos(current_block_prev) {
	let viewport_height = window.innerHeight;
	let current_block_prev_height = current_block_prev.offsetHeight;
	let block_pos = offset(current_block_prev).top;

	if (current_block_prev_height >= viewport_height) {
		block_pos = block_pos + (current_block_prev_height - viewport_height);
	}
	return block_pos;
}
function full_scroll(e) {
	let viewport_height = window.innerHeight;
	if (viewport_height >= scr_min_height) {
		if (scrolling_full) {
			let current_block = document.querySelector('._scr-sector._scr-sector_current');
			let current_block_pos = offset(current_block).top;
			let current_block_height = current_block.offsetHeight;
			let current_block_next = current_block.nextElementSibling;
			let current_block_prev = current_block.previousElementSibling;
			if (e.keyCode == 40 || e.keyCode == 34 || e.deltaX > 0 || e.deltaY < 0) {
				if (current_block_height <= viewport_height) {
					if (current_block_prev) {
						full_scroll_to_sector(getPrevBlockPos(current_block_prev));
					}
				} else {
					enableScroll();
					if (currentScroll <= current_block_pos) {
						if (current_block_prev) {
							full_scroll_to_sector(getPrevBlockPos(current_block_prev));
						}
					}
				}
			} else if (e.keyCode == 38 || e.keyCode == 33 || e.deltaX < 0 || e.deltaY > 0) {
				if (current_block_height <= viewport_height) {
					if (current_block_next) {
						let block_pos = offset(current_block_next).top;
						full_scroll_to_sector(block_pos);
					}
				} else {
					enableScroll();
					if (current_block_next) {
						let block_pos = offset(current_block_next).top;
						if (currentScroll >= block_pos - viewport_height) {
							full_scroll_to_sector(block_pos);
						}
					}
				}
			}
		} else {
			disableScroll();
		}
	} else {
		enableScroll();
	}
}
function full_scroll_to_sector(pos) {
	disableScroll();
	scrolling_full = false;
	_goto(pos, 800);

	let scr_pause = 500;
	if (navigator.appVersion.indexOf("Mac") != -1) {
		scr_pause = 1000;
	};
	setTimeout(function () {
		scrolling_full = true;
	}, scr_pause);
}
function full_scroll_pagestart() { }
function full_scroll_pageend() { }

//ScrollOnClick (Navigation)
let link = document.querySelectorAll('._goto-block');
if (link) {
	let blocks = [];
	for (let index = 0; index < link.length; index++) {
		let el = link[index];
		let block_name = el.getAttribute('href').replace('#', '');
		if (block_name != '' && !~blocks.indexOf(block_name)) {
			blocks.push(block_name);
		}
		el.addEventListener('click', function (e) {
			if (document.querySelector('.menu__body._active')) {
				menu_close();
				body_lock_remove(500);
			}
			let target_block_class = el.getAttribute('href').replace('#', '');
			let target_block = document.querySelector('.' + target_block_class);
			_goto(target_block, 300);
			e.preventDefault();
		})
	}

	window.addEventListener('scroll', function (el) {
		let old_current_link = document.querySelectorAll('._goto-block._active');
		if (old_current_link) {
			for (let index = 0; index < old_current_link.length; index++) {
				let el = old_current_link[index];
				el.classList.remove('_active');
			}
		}
		for (let index = 0; index < blocks.length; index++) {
			let block = blocks[index];
			let block_item = document.querySelector('.' + block);
			if (block_item) {
				let block_offset = offset(block_item).top;
				let block_height = block_item.offsetHeight;
				if ((pageYOffset > block_offset - window.innerHeight / 3) && pageYOffset < (block_offset + block_height) - window.innerHeight / 3) {
					let current_links = document.querySelectorAll('._goto-block[href="#' + block + '"]');
					for (let index = 0; index < current_links.length; index++) {
						let current_link = current_links[index];
						current_link.classList.add('_active');
					}
				}
			}
		}
	})
}
//ScrollOnClick (Simple)
let goto_links = document.querySelectorAll('._goto');
if (goto_links) {
	for (let index = 0; index < goto_links.length; index++) {
		let goto_link = goto_links[index];
		goto_link.addEventListener('click', function (e) {
			let target_block_class = goto_link.getAttribute('href').replace('#', '');
			let target_block = document.querySelector('.' + target_block_class);
			_goto(target_block, 300);
			e.preventDefault();
		});
	}
}
function _goto(target_block, speed, offset = 0) {
	let header = '';
	let options = {
		speedAsDuration: true,
		speed: speed,
		header: header,
		offset: offset,
		easing: 'easeOutQuad',
	};
	let scr = new SmoothScroll();
	scr.animateScroll(target_block, '', options);
}

//SameFunctions
function offset(el) {
	var rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}
function disableScroll() {
	if (window.addEventListener) // older FF
		window.addEventListener('DOMMouseScroll', preventDefault, false);
	document.addEventListener('wheel', preventDefault, { passive: false }); // Disable scrolling in Chrome
	window.onwheel = preventDefault; // modern standard
	window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
	window.ontouchmove = preventDefault; // mobile
	document.onkeydown = preventDefaultForScrollKeys;
}
function enableScroll() {
	if (window.removeEventListener)
		window.removeEventListener('DOMMouseScroll', preventDefault, false);
	document.removeEventListener('wheel', preventDefault, { passive: false }); // Enable scrolling in Chrome
	window.onmousewheel = document.onmousewheel = null;
	window.onwheel = null;
	window.ontouchmove = null;
	document.onkeydown = null;
}
function preventDefault(e) {
	e = e || window.event;
	if (e.preventDefault)
		e.preventDefault();
	e.returnValue = false;
}
function preventDefaultForScrollKeys(e) {
}

function fix_block(scr_fix_block, scr_value) {
	let window_width = parseInt(window.innerWidth);
	let window_height = parseInt(window.innerHeight);
	let header_height = parseInt(document.querySelector('header').offsetHeight) + 15;
	for (let index = 0; index < scr_fix_block.length; index++) {
		const block = scr_fix_block[index];
		let block_width = block.getAttribute('data-width');
		const item = block.querySelector('._side-block');
		if (!block_width) { block_width = 0; }
		if (window_width > block_width) {
			if (item.offsetHeight < window_height - (header_height + 30)) {
				if (scr_value > offset(block).top - (header_height + 15)) {
					item.style.cssText = "position:fixed;bottom:auto;top:" + header_height + "px;width:" + block.offsetWidth + "px;left:" + offset(block).left + "px;";
				} else {
					gotoRelative(item);
				}
				if (scr_value > (block.offsetHeight + offset(block).top) - (item.offsetHeight + (header_height + 15))) {
					block.style.cssText = "position:relative;";
					item.style.cssText = "position:absolute;bottom:0;top:auto;left:0px;width:100%";
				}
			} else {
				gotoRelative(item);
			}
		}
	}
	function gotoRelative(item) {
		item.style.cssText = "position:relative;bottom:auto;top:0px;left:0px;";
	}
}

function custom_scroll(event) {
	scr_body.style.overflow = 'hidden';
	let window_height = window.innerHeight;
	let custom_scroll_line = document.querySelector('._custom-scroll__line');
	let custom_scroll_content_height = document.querySelector('.wrapper').offsetHeight;
	let custom_cursor_height = Math.min(window_height, Math.round(window_height * (window_height / custom_scroll_content_height)));
	if (custom_scroll_content_height > window_height) {
		if (!custom_scroll_line) {
			let custom_scroll = document.createElement('div');
			custom_scroll_line = document.createElement('div');
			custom_scroll.setAttribute('class', '_custom-scroll');
			custom_scroll_line.setAttribute('class', '_custom-scroll__line');
			custom_scroll.appendChild(custom_scroll_line);
			scr_body.appendChild(custom_scroll);
		}
		custom_scroll_line.style.height = custom_cursor_height + 'px';
	}
}

let new_pos = pageYOffset;
function scroll_animate(event) {
	let window_height = window.innerHeight;
	let content_height = document.querySelector('.wrapper').offsetHeight;
	let start_position = pageYOffset;
	let pos_add = 100;

	if (event.keyCode == 40 || event.keyCode == 34 || event.deltaX > 0 || event.deltaY < 0) {
		new_pos = new_pos - pos_add;
	} else if (event.keyCode == 38 || event.keyCode == 33 || event.deltaX < 0 || event.deltaY > 0) {
		new_pos = new_pos + pos_add;
	}
	if (new_pos > (content_height - window_height)) new_pos = content_height - window_height;
	if (new_pos < 0) new_pos = 0;

	if (scrolling) {
		scrolling = false;
		_goto(new_pos, 1000);

		let scr_pause = 100;
		if (navigator.appVersion.indexOf("Mac") != -1) {
			scr_pause = scr_pause * 2;
		};
		setTimeout(function () {
			scrolling = true;
			_goto(new_pos, 1000);
		}, scr_pause);
	}
}


const ShowHideTabList = {
  mainSelector: '.tabList',
  clickToHideSelector: '.tabList__info',
  dontClickToHideSelector: 'button__moreInfoForStat',
  hideSelector: '.tabList__more',
  needCloseMoreOne: false,
  nameSpace: 'showHideTabList',
  bindAction: function () {
    //скрываем/показывай инфу
    document.querySelectorAll(`${this.mainSelector}`).forEach((elm) => {
      elm.querySelector(`${this.clickToHideSelector}`).addEventListener(`click`, (e) => {
        if (e.target.classList.contains(`${this.dontClickToHideSelector}`)) {
          return;
        }
        addRemoveClass(elm.querySelector(`${this.hideSelector}`), 'hide');

        if (this.needCloseMoreOne && (document.querySelectorAll(`${this.mainSelector} ${this.hideSelector}.hide`).length+1 < document.querySelectorAll(`${this.mainSelector} ${this.hideSelector}`).length)) {
          document.querySelectorAll(`${this.mainSelector} ${this.hideSelector}`).forEach((elm) => {
            if (e.currentTarget == elm.parentElement.querySelector(`${this.clickToHideSelector}`)) {
              return;
            }
            elm.classList.add('hide');
          })
        }

      })
    });
  }
};

const telegramUserTabList = Object.assign({},ShowHideTabList, {
  mainSelector: '#SocialTies .field__list .user',
  clickToHideSelector: '.user__block',
  dontClickToHideSelector: 'user__value',
  hideSelector: '.user__action',
  needCloseMoreOne: true,
});

ShowHideTabList.bindAction();

/**
 * InputList - логика работы с списком
 */
const InputList = {
  values: [],
  count: 1,
  getValues: function (element) {
  
    const val = this.element?.parent()?.children("option")?.map(function () {
      var text = $(this).text();
      if (this.value)
        return text;
    });
    return val || [];
  },
  render: function () {
    
    selector = "#params_form .form__block input.form__property";
    if ($(selector).length) {
      id = 'params_form'
      $(selector).autocomplete({
        source: this.getValues($(selector)),
        classes: {
          "ui-autocomplete": `autocomplete__${id} autoCompliteList standartText`,
        },
        open: function (event, ui) {
          $(`#ui-id-${$(event.target).attr('data-value')}.autocomplete__${id}`).width($(event.target).width() - 16);
          $(`#ui-id-${$(event.target).attr('data-value')}.autocomplete__${id}`).css(
            "top",
            +$(`#ui-id-${$(event.target).attr('data-value')}.autocomplete__${id}`).css("top").slice(0, -2) + 3 + "px"
          );
        },
      });
      this.count += 1;
    }

    selector = "#params_form .form__block #combobox";
    if ($(selector).length) {
      id = 'params_form'
      

      $(selector).append(`<option value=""></option>`);
      this.values.forEach((elm) => {
        $(selector).append(`<option value="${elm}">${elm}</option>`);
      });

      $.widget("custom.combobox", {
        _create: function () {
          this.wrapper = $("<span>")
            .addClass("custom-combobox")
            .insertAfter(this.element);

          this.element.hide();
          this._createAutocomplete();
        },

        _createAutocomplete: function () {
          var selected = this.element.children(":selected"),
            value = selected.val() ? selected.text() : "";
            $(this.input).trigger('change');
          this.input = $("<input>")
            .appendTo(this.wrapper)
            .val(value)
            .attr("title", "")
            .attr("data-value", InputList.count)
            .addClass(
              "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left standartText"
            )
            .autocomplete({
              delay: 0,
              minLength: 0,
              source: this._source.bind(this),
              classes: {
                "ui-autocomplete": `autocomplete__${id} autoCompliteList standartText`,
              },
              select: (event, ui) => {
                $(this.input).trigger('change');
                $(this.input)
                  .closest(".add__form._container")
                  .find("#add.button ")
                  .removeClass("disabled");
              },
              open: function (event, ui) {
                $(`#ui-id-${$(event.target).attr('data-value')}.autocomplete__${id}`).width($(event.target).width() - 16);
                $(`#ui-id-${$(event.target).attr('data-value')}.autocomplete__${id}`).css(
                  "max-width",
                  $(event.target).width()
                );
                $(`#ui-id-${$(event.target).attr('data-value')}.autocomplete__${id}`).css(
                  "top",
                  +$(`#ui-id-${$(event.target).attr('data-value')}.autocomplete__${id}`).css("top").slice(0, -2) + 3 + "px"
                );
              },
              close: (event, ui) => {
                $(this.input).trigger('change');
                !$(this.input).val() &&
                  $(this.input)
                    .closest(".add__form._container")
                    .find("#add.button")
                    .addClass("disabled");
              },
            });
            

          this._on(this.input, {
            autocompleteselect: function (event, ui) {
              ui.item.option.selected = true;

              this._trigger("select", event, {
                item: ui.item.option,
              });
            },

            autocompletechange: "_removeIfInvalid",
          });

          if (window.Telegram) { 
            Telegram?.app?.onEvent("viewportChanged", () => {
              $(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).width($(this.input).width() - 16); //FIXME remove repeat
              $(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).css("max-width", $(this.input).width());
              $(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).css(
                "top",
                +$(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).css("top").slice(0, -2) + 3 + "px"
              );
            });
          }


          this.input.on("focus", (e) => {
            if ($(this.input).attr('readonly') === 'readonly') {
              return;
            }
            this.input.autocomplete("search", "");
            $(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).width($(this.input).width() - 16); //FIXME remove repeat
            $(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).css("max-width", $(this.input).width());
            $(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).css(
              "top",
              +$(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).css("top").slice(0, -2) + 3 + "px"
            );
          });
          InputList.count += 1;
        },

        _source: function (request, response) {
          var matcher = new RegExp(
            $.ui.autocomplete.escapeRegex(request.term),
            "i"
          );
          response(
            this.element.children("option").map(function () {
              var text = $(this).text();
              if (this.value && (!request.term || matcher.test(text)))
                return {
                  label: text,
                  value: text,
                  option: this,
                };
            })
          );
        },

        _removeIfInvalid: function (event, ui) {
          if (ui.item) {
            return;
          }
          
          $(this.input)
            .closest(".add__form._container")
            .find("#add.button ")
            .addClass("disabled");
          var value = this.input.val(),
            valueLowerCase = value.toLowerCase(),
            valid = false;
          this.element.children("option").each(function () {
            if ($(this).text().toLowerCase() === valueLowerCase) {
              this.selected = valid = true;
              return false;
            }
          });

          if (valid) {
            return;
          }

          this.input
            .val("")
            .attr("placeholder", value + " didn't match any item");
          this.element.val("");
          $(this.input).trigger('change',false);
          this._delay(function () {
            this.input.attr("placeholder", "");
          }, 2500);
          this.input.autocomplete("instance").term = "";
        },

        _destroy: function () {
          this.wrapper.remove();
          this.element.show();
        },
      });

      $(selector).combobox({
        classes: {
          "ui-autocomplete": "highlight",
        },
      });
    }

    selector = "#params_form .form__block #combobox.form__socialRole";
    if ($(selector).length) {
      id = 'params_form'

      $(selector).append(`<option value=""></option>`);
      this.values.forEach((elm) => {
        $(selector).append(`<option value="${elm}">${elm}</option>`);
      });

      $.widget("custom.combobox", {
        _create: function () {
          this.wrapper = $("<span>")
            .addClass("custom-combobox")
            .insertAfter(this.element);

          this.element.hide();
          this._createAutocomplete();
        },

        _createAutocomplete: function () {
          var selected = this.element.children(":selected"),
            value = selected.val() ? selected.text() : "";
            $(this.input).trigger('change');
          this.input = $("<input>")
            .appendTo(this.wrapper)
            .val(value)
            .attr("title", "")
            .attr("data-value", InputList.count)
            .addClass(
              "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left standartText"
            )
            .autocomplete({
              delay: 0,
              minLength: 0,
              source: this._source.bind(this),
              classes: {
                "ui-autocomplete": `autocomplete__${id} autoCompliteList standartText`,
              },
              select: (event, ui) => {
                $(this.input).trigger('change');
                $(this.input)
                  .closest(".add__form._container")
                  .find("#add.button ")
                  .removeClass("disabled");
              },
              open: function (event, ui) {

                $(`#ui-id-${$(event.target).attr('data-value')}.autocomplete__${id}`).width($(event.target).width() - 16);
                $(`#ui-id-${$(event.target).attr('data-value')}.autocomplete__${id}`).css(
                  "max-width",
                  $(event.target).width()
                );
                $(`#ui-id-${$(event.target).attr('data-value')}.autocomplete__${id}`).css(
                  "top",
                  +$(`#ui-id-${$(event.target).attr('data-value')}.autocomplete__${id}`).css("top").slice(0, -2) + 3 + "px"
                );
              },
              close: (event, ui) => {
                $(this.input).trigger('change');
                !$(this.input).val() &&
                  $(this.input)
                    .closest(".add__form._container")
                    .find("#add.button")
                    .addClass("disabled");
              },
            });

          this._on(this.input, {
            autocompleteselect: function (event, ui) {
              ui.item.option.selected = true;

              this._trigger("select", event, {
                item: ui.item.option,
              });
            },

            autocompletechange: "_removeIfInvalid",
          });

          if (window.Telegram) {
            Telegram?.app?.onEvent("viewportChanged", () => {
              $(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).width($(this.input).width() - 16); //FIXME remove repeat
              $(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).css("max-width", $(this.input).width());
              $(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).css(
                "top",
                +$(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).css("top").slice(0, -2) + 3 + "px"
              );
            });
          }


          this.input.on("focus", (e) => {
            if ($(this.input).attr('readonly') === 'readonly') {
              return;
            }
            this.input.autocomplete("search", "");
            $(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).width($(this.input).width() - 16); //FIXME remove repeat
            $(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).css("max-width", $(this.input).width());
            $(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).css(
              "top",
              +$(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).css("top").slice(0, -2) + 3 + "px"
            );
          });
          inputList.count +=1;
        },

        _source: function (request, response) {
          var matcher = new RegExp(
            $.ui.autocomplete.escapeRegex(request.term),
            "i"
          );
          response(
            this.element.children("option").map(function () {
              var text = $(this).text();
              if (this.value && (!request.term || matcher.test(text)))
                return {
                  label: text,
                  value: text,
                  option: this,
                };
            })
          );
        },

        _removeIfInvalid: function (event, ui) {
          if (ui.item) {
            return;
          }
          
          $(this.input)
            .closest(".add__form._container")
            .find("#add.button ")
            .addClass("disabled");
          var value = this.input.val(),
            valueLowerCase = value.toLowerCase(),
            valid = false;
          this.element.children("option").each(function () {
            if ($(this).text().toLowerCase() === valueLowerCase) {
              this.selected = valid = true;
              return false;
            }
          });

          if (valid) {
            return;
          }

          this.input
            .val("")
            .attr("placeholder", value + " didn't match any item");
          this.element.val("");
          $(this.input).trigger('change');
          this._delay(function () {
            this.input.attr("placeholder", "");
          }, 2500);
          this.input.autocomplete("instance").term = "";
        },

        _destroy: function () {
          this.wrapper.remove();
          this.element.show();
        },
      });

      $(selector).combobox({
        classes: {
          "ui-autocomplete": "highlight",
        },
      });
    }

    selector = ".popup_ChangeTheTies .ChangeTheTies__add #combobox.form__Ties";
    if ($(selector).length) {
      id = 'ChangeTheTie'
      

      $(selector).append(`<option value=""></option>`);
      this.values.forEach((elm) => {
        $(selector).append(`<option value="${elm}">${elm}</option>`);
      });

      $.widget("custom.combobox", {
        _create: function () {
          this.wrapper = $("<span>")
            .addClass("custom-combobox")
            .insertAfter(this.element);

          this.element.hide();
          this._createAutocomplete();
        },

        _createAutocomplete: function () {
          var selected = this.element.children(":selected"),
            value = selected.val() ? selected.text() : "";
            $(this.input).trigger('change');
          this.input = $("<input>")
            .appendTo(this.wrapper)
            .val(value)
            .attr("title", "")
            .attr("data-value", InputList.count)
            .addClass(
              "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left standartText"
            )
            .autocomplete({
              delay: 0,
              minLength: 0,
              source: this._source.bind(this),
              classes: {
                "ui-autocomplete": `autocomplete__${id} autoCompliteList standartText`,
              },
              select: (event, ui) => {
                $(this.input).trigger('change');
                $(this.input)
                  .closest(".add__form._container")
                  .find("#add.button ")
                  .removeClass("disabled");
              },
              open: function (event, ui) {
                $(`#ui-id-${$(event.target).attr('data-value')}.autocomplete__${id}`).width($(event.target).width() - 16);
                $(`#ui-id-${$(event.target).attr('data-value')}.autocomplete__${id}`).css(
                  "max-width",
                  $(event.target).width()
                );
                $(`#ui-id-${$(event.target).attr('data-value')}.autocomplete__${id}`).css(
                  "top",
                  +$(`#ui-id-${$(event.target).attr('data-value')}.autocomplete__${id}`).css("top").slice(0, -2) + 3 + "px"
                );
              },
              close: (event, ui) => {
                $(this.input).trigger('change');
                !$(this.input).val() &&
                  $(this.input)
                    .closest(".add__form._container")
                    .find("#add.button")
                    .addClass("disabled");
              },
            });

          this._on(this.input, {
            autocompleteselect: function (event, ui) {
              ui.item.option.selected = true;

              this._trigger("select", event, {
                item: ui.item.option,
              });
            },

            autocompletechange: "_removeIfInvalid",
          });

          this.input.on("focus", (e) => {
            if ($(this.input).attr('readonly') === 'readonly') {
              return;
            }
            this.input.autocomplete("search", "");
            $(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).width($(this.input).width() - 16); //FIXME remove repeat
            $(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).css("max-width", $(this.input).width());
            $(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).css(
              "top",
              +$(`#ui-id-${$(this.input).attr('data-value')}.autocomplete__${id}`).css("top").slice(0, -2) + 3 + "px"
            );
          });
          InputList.count += 1;
        },

        _source: function (request, response) {
          var matcher = new RegExp(
            $.ui.autocomplete.escapeRegex(request.term),
            "i"
          );
          response(
            this.element.children("option").map(function () {
              var text = $(this).text();
              if (this.value && (!request.term || matcher.test(text)))
                return {
                  label: text,
                  value: text,
                  option: this,
                };
            })
          );
        },

        _removeIfInvalid: function (event, ui) {
          if (ui.item) {
            return;
          }

          $(this.input)
            .closest(".add__form._container")
            .find("#add.button ")
            .addClass("disabled");
          var value = this.input.val(),
            valueLowerCase = value.toLowerCase(),
            valid = false;
          this.element.children("option").each(function () {
            if ($(this).text().toLowerCase() === valueLowerCase) {
              this.selected = valid = true;
              return false;
            }
          });

          if (valid) {
            return;
          }

          this.input
            .val("")
            .attr("placeholder", value + " didn't match any item");
          this.element.val("");
          $(this.input).trigger('change',false);
          this._delay(function () {
            this.input.attr("placeholder", "");
          }, 2500);
          this.input.autocomplete("instance").term = "";
        },

        _destroy: function () {
          this.wrapper.remove();
          this.element.show();
        },
      });

      $(selector).combobox({
        classes: {
          "ui-autocomplete": "highlight",
        },
      });
    }
  },
};

this.inputList = InputList.render();

$('#params_form .form__block .form__more ~ span input').attr('readonly', true);
$('#params_form .form__block .form__property ~ span input, #params_form .form__block .form__property').on('change', (event) => {
  $('#params_form .form__block .form__more ~ span input').attr('readonly', !$(event.target).val())
})
