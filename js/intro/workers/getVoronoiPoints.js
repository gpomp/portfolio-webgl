var voronoi = require("voronoi-diagram");

module.exports = function (self) {
    self.addEventListener('message',function (ev){

        var obj = ev.data;
        var vW = obj[0];
        var vH = obj[0];

        var w = obj[1];
        var h = obj[2];

        var vW1 = vW + 1; 
        var vH1 = vH + 1;
 
        var widthHalf = w / 2;
        var heightHalf = h / 2;

        var wGap = w / vW;
        var hGap = h / vH;

        var maxDistance = Math.sqrt(widthHalf * widthHalf);
        var maxDistanceX = Math.sqrt(heightHalf * heightHalf);
        var maxDistanceSquared = widthHalf * widthHalf + heightHalf * heightHalf;
        var maxDistanceT = Math.sqrt(heightHalf * heightHalf + heightHalf * heightHalf);

        var vorPoints = [];

        var xP = 0;
        var yP = 0;


        var vertices = [];

        while(yP < h) {
            while(xP < w) {
                var thetaX = Math.PI * 2 * Math.random();
                var thetaY = Math.PI * 2 * Math.random();

                var x = Math.round(xP + Math.cos(thetaX) * wGap - widthHalf);
                var y = Math.round(yP + Math.sin(thetaY) * hGap - heightHalf);

                var distSquared = 1 - (x * x + y * y) / maxDistanceSquared;

                vorPoints.push([x, y]);

                xP += wGap * 2 + wGap * 0.7 + distSquared * Math.random() * wGap;
            }

            xP = 0;
            yP += hGap * 2 + hGap * 0.7 + distSquared * Math.random() * hGap;
        }

        var vor = voronoi(vorPoints);
        vor.bbox = [];

        var voronois = [];

        for (var i = 0; i < vor.cells.length; i++) {
            var cell = vor.cells[i];

            var minX = 999999999;
            var maxX = -999999999; 
            var minY = 999999999;
            var maxY = -999999999;
            var y = 0;
            var cPoint = 0;
            var totalX = 0;
            var totalY = 0;

            var isOut = false;

            for (var j = 0; j < cell.length; j++) {
                if(cell[j] === -1) continue;
               var x = vor.positions[cell[j]][0];
               var y = vor.positions[cell[j]][1];
               minX = Math.min(minX, x);
               maxX = Math.max(maxX, x);
               minY = Math.min(minY, y);
               maxY = Math.max(maxY, y);

               if(Math.abs(x) > widthHalf || Math.abs(y) > heightHalf) {
                isOut = true;
                break;
               }

               totalX += x;
               totalY += y;

               cPoint++;
            };

            var bbox = {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            }


            bbox.center = [totalX / cPoint, totalY / cPoint];
            vor.bbox.push(bbox);

            if(isOut || isNaN(totalX) || isNaN(totalY) || Math.abs(totalX / cPoint) > widthHalf || Math.abs(totalY / cPoint) > heightHalf) continue;
            

            var cellVertices = [];

            for (var j = 0; j < cell.length; j++) {
                if(cell[j] === -1) continue;
                var k = j < cell.length - 1 ? j + 1 : 0;

                if(cell[k] === -1) continue;

                var x = vor.positions[cell[j]][0];
                var y = vor.positions[cell[j]][1];
                var x1 = vor.positions[cell[k]][0];
                var y1 = vor.positions[cell[k]][1];

                var j3 = j * 3;

                cellVertices.push(Math.round(bbox.center[0]), 0, Math.round(bbox.center[1]));
                cellVertices.push(Math.round(x), 0, Math.round(y));
                cellVertices.push(Math.round(x1), 0, Math.round(y1));
                cellVertices.push(bbox.x, bbox.y, bbox.width, bbox.height);
                


            }

            voronois.push(cellVertices);
        };
        self.postMessage(voronois);

        
    });
}
