class JoystickController {
    constructor() {
        this.container = document.querySelector('.joystick-container');
        this.handle = document.querySelector('.joystick-handle');
        this.radius = this.container.offsetWidth / 2;
        this.center = {
            x: this.container.offsetLeft + this.radius,
            y: this.container.offsetTop + this.radius
        };
        this.isActive = false;
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.container.addEventListener('mousedown', (e) => this.handleStart(e));
        document.addEventListener('mousemove', (e) => this.handleMove(e));
        document.addEventListener('mouseup', () => this.handleEnd());
        
        this.container.addEventListener('touchstart', (e) => this.handleStart(e));
        document.addEventListener('touchmove', (e) => this.handleMove(e));
        document.addEventListener('touchend', () => this.handleEnd());
    }

    handleStart(e) {
        this.isActive = true;
        this.handleMove(e);
    }

    handleMove(e) {
        if (!this.isActive) return;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const dx = clientX - this.center.x;
        const dy = clientY - this.center.y;
        const distance = Math.min(Math.sqrt(dx*dx + dy*dy), this.radius);
        const angle = Math.atan2(dy, dx);
        
        const posX = (distance * Math.cos(angle)) / this.radius;
        const posY = (distance * Math.sin(angle)) / this.radius;
        
        this.handle.style.transform = `translate(${dx}px, ${dy}px)`;
        this.sendCommand(posX.toFixed(2), posY.toFixed(2));
    }

    handleEnd() {
        this.isActive = false;
        this.handle.style.transform = 'translate(0, 0)';
        this.sendCommand(0, 0);
    }

    sendCommand(x, y) {
        $.ajax({
            type: 'POST',
            url: '/api/v1/driver',
            contentType: 'application/json',
            data: JSON.stringify({ x, y })
        });
    }
}

$(document).ready(() => {
    new JoystickController();
    
    let isLampOn = false;
    $('#lamp-switch').click(function() {
        isLampOn = !isLampOn;
        $(this).text(isLampOn ? 'Lamp OFF' : 'Lamp ON');
        
        $.ajax({
            type: 'POST',
            url: '/api/v1/lamp',
            data: JSON.stringify({ state: isLampOn }),
            contentType: 'application/json'
        });
    });
});