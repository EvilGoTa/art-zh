export default (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = typeof element === 'object' ? element : document.querySelector(element);

        node.classList.add(`${prefix}animated`, animationName);
        node.classList.remove('d-none');

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd() {
            node.classList.remove(`${prefix}animated`, animationName);
            node.removeEventListener('animationend', handleAnimationEnd);

            resolve(node);
        }

        node.addEventListener('animationend', handleAnimationEnd);
});

