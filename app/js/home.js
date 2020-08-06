import animateScrollTo from 'animated-scroll-to';

// modern Chrome requires { passive: false } when adding event
let supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; }
    }));
} catch(e) {}

const wheelOpt = supportsPassive ? { passive: false } : false;
const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

const sliderLength = document.getElementById('slider-titles').childElementCount;
const sliderWrapper = document.getElementById('slider-titles');
let sliderElements = [];
for (let i = 0; i < sliderLength; i++) {
    sliderElements.push(`slider.${i}`);
}

const scrollPoints = ['header', 'slider', ...sliderElements, 'features'];

let scrollPointsPositions = scrollPoints.map(el => {
    if (el.split('.').length === 1) {
        return document.getElementById(el).offsetTop
    } else {
        const elements = el.split('.');
        let offset = sliderWrapper.offsetTop
        let elOffset = document.getElementById(`slider-${elements[1]}`).offsetTop
        return elOffset - offset
    }
});

let enableScrollAnimation = true;
let currentScrollY = window.scrollY;
let currentPoint = 0;

let deltaPointsCurrent = scrollPointsPositions.map(el => Math.abs(el - currentScrollY));
let minDelta = deltaPointsCurrent.reduce((carry, el) => el < carry ? el : carry, window.outerHeight);
currentPoint = deltaPointsCurrent.indexOf(minDelta);

let scrollControl = true;

const scrollListener = (e) => {

    scrollControl && e.preventDefault();

    if (enableScrollAnimation) {
        let direction = e.deltaY > 0 ? 'down' : 'up';

        if (window.scrollY <= scrollPointsPositions[scrollPointsPositions.length - 1]) {
            direction === 'up' ? currentPoint -- : currentPoint ++;

            scrollControl = true;
        }

        if (currentPoint < 0) {
            currentPoint = 0;
            return;
        }
        if (currentPoint >= scrollPoints.length) {
            currentPoint = scrollPoints.length - 1;
            scrollControl = false;
        }

        if (scrollControl) {
            enableScrollAnimation = false;

            let scrollImages = false;

            let scrollElement = window;
            let currentPointTitle =  scrollPoints[currentPoint];
            let scrollValue = scrollPointsPositions[currentPoint];
            let sliderPoint = 1;
            if (currentPointTitle.split('.').length > 1) {
                sliderPoint = currentPointTitle.split('.')[1] * 1
                scrollElement = sliderWrapper;
                scrollImages = true;
                if (currentPointTitle.split('.')[1] === '0' && direction === 'down') {
                    currentPoint ++;
                    sliderPoint ++;
                    scrollValue = scrollPointsPositions[currentPoint];
                }
                if (currentPointTitle.split('.')[1] === '0' && direction === 'up') {
                    currentPoint --;
                }
                if (currentPointTitle.split('.')[1] === ('' + (sliderLength - 1)) && direction === 'up') {
                    scrollValue = scrollPointsPositions[scrollPoints.indexOf('slider')];
                    scrollElement = window;
                    scrollImages = false;
                }
            }
            // console.log(currentPoint, currentPointTitle, scrollPointsPositions[currentPoint], scrollElement)
            animateScrollTo(scrollValue, {
                cancelOnUserAction: false,
                elementToScroll: scrollElement
            }).then(hasScrolledToPosition => {
                enableScrollAnimation = true;
            })

            if (scrollImages) {
                document.getElementById('images-counter').innerHTML = `0${sliderPoint + 1}.`;
                animateScrollTo(scrollValue - 20, {
                    cancelOnUserAction: false,
                    elementToScroll: document.getElementById('slider-images')
                })
            }

        }
    }

    currentScrollY = window.scrollY;
}

window.addEventListener(wheelEvent, scrollListener, wheelOpt); // modern desktop
// window.addEventListener('touchmove', scrollListener, wheelOpt); // mobile