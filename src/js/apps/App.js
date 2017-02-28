'use strict';

const THREE = require('three');
import  {PerspectiveCamera, Scene, WebGLRenderer, BoxGeometry, Clock, ShaderMaterial, MeshBasicMaterial, Mesh} from 'three';
import Particles from './Particles';
const OrbitControls = require('three-orbit-controls')(THREE);

const dat = require('dat.gui/build/dat.gui.js');
const TweenMax = require('gsap');
const glslify = require('glslify');
const Stats = require('stats.js');
const letters = {start: 97, end: 122};

export default class App {
    constructor(params){
        this.params = params || {};
        this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.x = 1000/1.5;
        this.camera.position.z = 300/1.5;
        this.camera.position.y = 300/1.5;
        this.camera.lookAt(new THREE.Vector3())

        this.scene = new Scene();

        // this.mesh = this.createMesh();
        // this.scene.add(this.mesh);
        this._createLetters();

        this.renderer = new WebGLRenderer({
            antialias: true
        });
        this.dom = this.renderer.domElement;

        if(this.params.isDebug){
            this.stats = new Stats();
            document.body.appendChild(this.stats.dom);
            this._addGui();
        }

        this.clock = new Clock();
        this.control = new OrbitControls(this.camera);

        this.resize();
    }

    _createLetters(){
        let ii;
        this.canvases = [];
        let size = 64;
        for(ii = letters.start; ii <= letters.end; ii++){
            let canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;

            let ctx = canvas.getContext('2d');
            ctx.fillStyle = '#000';
            ctx.font = `${size - 5}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String.fromCharCode(ii), canvas.width/2, canvas.height/2 - 10);
            this.canvases.push(ctx)
        }

        this.letterDatas = [];

        this.canvases.forEach((canvas, index)=>{
            let canvasData = canvas.getImageData(0, 0, size, size);
            this.letterDatas.push([]);

            for(let jj = 0; jj < canvasData.data.length; jj+=4){
                let data = canvasData.data[jj + 3];
                if(data > 0){
                    this.letterDatas[index].push(jj/4);
                }
            }

        });

        this.particles = new Particles({data : this.letterDatas});
        this.scene.add(this.particles);

    }
    
    _addGui(){
        this.gui = new dat.GUI();
        this.gui.add(this.particles.uniforms.uTheta, 'value', 0.0, Math.PI * 2).step('0.01');
    }
    
    createMesh(){
        let geometry = new BoxGeometry(200, 200, 200);
        let shaderMaterial = new ShaderMaterial({
            vertexShader: glslify('../shaders/shader.vert'),
            fragmentShader: glslify('../shaders/shader.frag')
        });
        // let mat = new MeshBasicMaterial({ color : 0xff0000})
        let mesh = new Mesh(geometry, shaderMaterial);
        return mesh;
    }

    animateIn(){
        TweenMax.ticker.addEventListener('tick', this.loop, this);
    }

    loop(){
        let delta = this.clock.getDelta();
        this.particles.uniforms.uTime.value += delta;
        this.particles.update();

        // this.mesh.rotation.x += 0.01;
        // this.mesh.rotation.y += 0.02;


        this.renderer.render(this.scene, this.camera);
        if(this.stats) this.stats.update();

    }

    animateOut(){
        TweenMax.ticker.removeEventListener('tick', this.loop, this);
    }

    onMouseMove(mouse){

    }

    onKeyDown(ev){
        // console.log(ev.which);
        if(ev.which >= 65 && ev.which <= 90 ){
            let target = ev.which -  65;
            this.particles.keydown(target);
        }


        switch(ev.which){
            case 27:
                this.isLoop = !this.isLoop;
                if(this.isLoop){
                    this.clock.stop();
                    TweenMax.ticker.addEventListener('tick', this.loop, this);
                }else{
                    this.clock.start();
                    TweenMax.ticker.removeEventListener('tick', this.loop, this);
                }
                break;
        }
    }
    onKeyup(ev){
        this.particles.keyup();
    }
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    destroy(){

    }

}
