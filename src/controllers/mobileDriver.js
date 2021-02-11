import nipplejs from 'nipplejs';

const nippleManager = nipplejs.create({zone: document.getElementById('controls-overlay'), color: '#333', maxNumberOfNipples: 1});

export default (controls) => {
    nippleManager.on('start', (e, vJoystick) => {
        vJoystick.on('move', (e, {direction}) => {
            if(direction) {
                if(direction.x === "right") {
                    controls.right.press();
                } else {
                    controls.left.press();
                }
            }
        });
    });

    nippleManager.on('end', () => {
        controls.left.release();
        controls.right.release();
    });
};