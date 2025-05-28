class JoystickController {
    constructor() {
        this.container = $('.joystick-container')[0];
        this.handle = $('.joystick-handle')[0];
        this.radius = this.container.offsetWidth / 2;
        this.isDragging = false;

        // Touch events
        this.container.addEventListener('touchstart', this.start.bind(this), { passive: false });
        this.container.addEventListener('touchmove', this.move.bind(this), { passive: false });
        this.container.addEventListener('touchend', this.end.bind(this));

        // Mouse events
        this.container.addEventListener('mousedown', this.start.bind(this));
        this.container.addEventListener('mousemove', this.move.bind(this));
        this.container.addEventListener('mouseup', this.end.bind(this));
    }

    getPosition(event) {
        const rect = this.container.getBoundingClientRect();
        return {
            x: (event.touches ? event.touches[0].clientX : event.clientX) - rect.left - this.radius,
            y: (event.touches ? event.touches[0].clientY : event.clientY) - rect.top - this.radius
        };
    }

    start(event) {
        this.isDragging = true;
        this.move(event);
    }

    move(event) {
        if (!this.isDragging) return;
        
        const pos = this.getPosition(event);
        const distance = Math.min(Math.sqrt(pos.x*pos.x + pos.y*pos.y), this.radius);
        const angle = Math.atan2(pos.y, pos.x);
        
        const x = distance * Math.cos(angle);
        const y = distance * Math.sin(angle);
        
        this.handle.style.transform = `translate(${x}px, ${y}px)`;
        
        // Send control data to backend
        const data = {
            x: (x / this.radius).toFixed(2),
            y: (y / this.radius).toFixed(2)
        };
        $.post('/api/v1/control', data);
    }

    end() {
        this.isDragging = false;
        this.handle.style.transform = 'translate(-50%, -50%)'; // Fixed extra parenthesis
        $.post('/api/v1/control', { x: 0, y: 0 }); // Reset position
    }
}

$(document).ready(() => {
    $("#navbar-container").load("navbar.html", function() {
        new bootstrap.Offcanvas(document.getElementById('sidebar'))
    });

    // Initialize joystick
    new JoystickController();

    // Lamp switch control
    $('#lamp-switch').change(function() {
        const state = this.checked;
        $.ajax({
            type: 'POST',
            url: '/api/v1/lamp',
            contentType: 'application/json',
            data: JSON.stringify({ state: state }),
            success: () => showToast(state ? 'Lamp ON' : 'Lamp OFF'),
            error: () => showToast('Control failed')
        });
    });

    // Toast notification
    function showToast(message) {
        const toast = new bootstrap.Toast($('#liveToast'));
        $('.toast-body').text(message);
        toast.show();
    }
});