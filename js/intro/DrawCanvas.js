

class DrawCanvas {
    constructor(width, height, domEl) {
        this._domEl = domEl;

        this.canvas = document.createElement('canvas');
        this._ratio = 2;

        this.canvas.width = 1024;
        this.canvas.height = 1024; 

        this.ctx = this.canvas.getContext('2d');

        this._isDrawing = false;
    
        this._locList = [];

        this._currLoc = {
            x: 0,
            y: 0
        }

        this._domEl.addEventListener('mousemove', this.mousemove.bind(this));
        this._domEl.addEventListener('mousedown', this.mousedown.bind(this));

        // document.body.appendChild(this.canvas);

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0px';
        this.canvas.style.left = '0px';
        this.canvas.style.zIndex = '10000';
        this.canvas.style.pointerEvents = 'none';

        this.ctx.fillStyle = "rgb(255, 0, 0)";
        this.ctx.fillRect(this.canvas.width * 0.5, this.canvas.height * 0.5, 200, 200);

        this.ready = true;
    }

    mousedown(event) {
        this._isDrawing = true;

        this._domEl.style.zIndex = 1000;

        window.addEventListener('mouseup', this.mouseup.bind(this));
    }

    mousemove(event) {
        if(this._isDrawing) {
            let oldLocX = this._currLoc.x;
            let oldLocY = this._currLoc.y;


            this._currLoc.x = Math.round(event.clientX / this._domEl.offsetWidth * this.canvas.width);
            this._currLoc.y = document.body.scrollTop + Math.round(event.clientY / this._domEl.offsetHeight * this.canvas.height);

            let distX = this._currLoc.x - oldLocX;
            let distY = this._currLoc.y - oldLocY;

            let speed = Math.max(0, Math.min(1, (distX * distX + distY * distY) / 20));

            this._locList.push({
                x: this._currLoc.x,
                y: this._currLoc.y,
                speed: speed
            });
        }
    }

    mouseup(event) {
        this._isDrawing = false;

        this._domEl.style.zIndex = 1; 
        window.removeEventListener('mouseup', this.mouseup.bind(this));
    }

    render() {
        this.ctx.fillStyle = "#000000";
         this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if(this._locList.length > 0) {
            
            // this.ctx.beginPath();
            // this.ctx.moveTo(this._locList[0].x, this._locList[0].y);
            for (var i = 0; i < this._locList.length; i++) {
                this.ctx.fillStyle = 'rgb(255, 0, 0)';
                this.ctx.beginPath();
                this.ctx.arc(this._locList[i].x, this._locList[i].y, 5 + 8 * this._locList[i].speed, 0, 2 * Math.PI, true);
                this.ctx.fill();
            };

            
            // this.ctx.stroke();
        }
        

        while(this._locList.length > 600) {
            this._locList.splice(0, 1);
        }
    }
}

module.exports = DrawCanvas;
