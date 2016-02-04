'use strict';

var select = require('dom-select');
var classes = require('dom-classes');
var Tween = require('gsap/src/uncompressed/TweenLite');
var ScrollToPlugin = require('gsap/src/uncompressed/plugins/ScrollToPlugin');
var EasePack = require('gsap/src/uncompressed/easing/EasePack');

var Intro = require('./intro/');
 
class GlobalPage {
    constructor() {
        this.init();
    }

    init() {
        _gaq.push(['_trackPageview', '/nowebgl']);

        var intro = new Intro(); 

        classes(select('html')).add('no-threejs');
        select('.overlay-nowebgl').style.display = 'none';
            
        /*Buttons*/
        classes(select('#projects-buttons')).add("show");
        var buttons = select.all('#projects-buttons a');

        for (let i = 0; i < buttons.length; ++i) {
            let button = buttons[i];
            classes(button).add('show');
            button.setAttribute("href", "#" + button.getAttribute("href"));
            var self = this;
            button.addEventListener("click", function(event) {
                self.clickProject(event, this);
            });
        }

        /*Projects*/
        classes(select('#projects')).add('show');
        var projects = select.all('#projects .project');

        for (let i = 0; i < projects.length; ++i) {
            let project = projects[i];
            classes(project).add('show');
            classes(select('.text', project)).add('show');

            var images = select.all('img', project);
            for (let j = 0; j < images.length; ++j) {
                let img = images[j];
                img.setAttribute("src", img.getAttribute("data-src"));
            }
        }

        window.addEventListener('scroll', this.scroll.bind(this));

        window.setTimeout(function() { this.checkScroll(); }.bind(this), 1000);
    }

    scroll(event) {
        this.checkScroll();
    }

    checkScrollAnim() {
        this.checkScroll();
    }

    checkScroll() {
        let h = window.innerHeight;
        let projects = select.all('#projects .project');
        let cProject = null;  
        let biggest = -1;
        let big = 0; 

        for (let i = 0; i < projects.length; ++i) {
            let node = projects[i];
            let br = node.getBoundingClientRect();
            let t = br.top;
            let b = br.bottom;
            let perc = Math.max(0, t);
            if(t - h < 0 && b - h > 0) {
                if(!classes.has(node, 'anim')) {
                    classes.add(node, 'anim');
                }

                biggest = i;
                
            }

        }
        if(biggest !== -1) {
            let btn = select.all('#projects-buttons a')[biggest];
            if(!classes.has(btn, 'active')) {
                let btnList = select.all('#projects-buttons a');
                for (let i = 0; i < btnList.length; ++i) {
                    classes.remove(btnList[i], 'active');
                }
                classes.add(btn, 'active');
            }

        }
    }

    clickProject(event, link) {
        event.preventDefault();

        let name = link.getAttribute('name');

        let project = select('#projects .project.' + name);
        let ctnTop = select('#projects').offsetTop;
        Tween.to(window, 1, {scrollTo:{ y: ctnTop + project.offsetTop }, ease: Expo.easeInOut, onComplete:this.checkScrollAnim.bind(this)});
    }
} 


module.exports = GlobalPage;
