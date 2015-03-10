/// <reference path="../../web/app/themes/portfolio/vendors/DefinitelyTyped/dat-gui/dat-gui.d.ts" />
/// <reference path="../../web/app/themes/portfolio/vendors/DefinitelyTyped/stats/stats.d.ts" />

module webglExp {
	export class Gui {

		public static gui:webglExp.Gui;

		private _gui:dat.GUI;

		constructor() {
			this._gui = new dat.GUI();
			webglExp.Gui.gui = this;

		}

		public clear() {
			for (var folder in this._gui.__folders){
			    this.removeFolder(this._gui.__folders[folder]);
			}
		}

		private removeFolder(folder) {
			folder.close();
		    folder.domElement.parentNode.parentNode.removeChild(folder.domElement.parentNode);
		    folder = undefined;
		    this._gui.onResize();
		}

		public get_gui():dat.GUI {
			return this._gui;
		}
	}

	export class PerfStats {

		private stats:Stats;
		private currMode:number;

		constructor() {
			this.currMode = 0;
			this.stats = new Stats();
			this.stats.setMode(this.currMode);

			document.body.appendChild( this.stats.domElement );

			// align top-left
			this.stats.domElement.style.position = 'absolute';
			this.stats.domElement.style.left = '0px';
			this.stats.domElement.style.top = '0px';

			document.addEventListener('keyup', this.changeMode);
		}

		public begin() {
			this.stats.begin();
		}

		public end() {
			this.stats.end();
		}

		changeMode = (event) => {
			switch(event.keyCode) {
				case 77 :
					this.currMode = this.currMode === 1 ? 0 : 1;
					this.stats.setMode(this.currMode);
				break;
			}
		}


	}
}