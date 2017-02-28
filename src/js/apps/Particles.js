"use strict";
const THREE = require('three');
const glslify = require('glslify');

function mobilechek() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

export default class Particles extends THREE.Object3D {
    constructor(params) {
        super()

        let isMobile = mobilechek();
        this.data = params.data;
        this.particles = isMobile ? 30000 : 120000;
        this.partcielsSize = 1;
        let geo = this.createGeometry();
        let mat = new THREE.MeshBasicMaterial({
            color : 0xffff00,
            side : THREE.DoubleSide
        })
        let uniforms = {
            uTheta : {value : 0},
            uTargetRate : {value : 0.92},
            // uTime : {value : 0},
            uTime : {value : 0},
        };
        mat = new THREE.RawShaderMaterial({
            uniforms : uniforms,
            vertexShader : glslify('../shaders/particle.vert'),
            fragmentShader : glslify('../shaders/particle.frag'),
            depthTest: false,
            side : THREE.DoubleSide,
            transparent : true,
            blending : THREE.AdditiveBlending
        });
        let mesh = new THREE.Mesh(geo, mat);
        this.add(mesh);

        this.uniforms = uniforms;

    }
    createGeometry(){
        let geometry = new THREE.BufferGeometry();

        let indices = [];
        let position = [];
        let uvs = [];
        let data = [];
        let data2 = [];

        let ii;
        for(ii = 0; ii < this.particles; ii++){
            let theta = THREE.Math.randFloat(0, Math.PI * 2);
            let speed =  THREE.Math.randFloat(0.01, 0.5);
            let size =  THREE.Math.randFloat(1, 10);
            let directionRandom = THREE.Math.randFloat(0, 1);
            for(let jj = 0; jj < 4; jj++){
                let xPos = parseInt(jj/2);
                let yPos = jj % 2;

                uvs.push(xPos);uvs.push(yPos); uvs.push(directionRandom);
                position.push(0);position.push(0);position.push(0);
                data.push(theta);
                data.push(speed);
                data.push(size);
                data.push(Math.random());
            }

            indices.push(ii * 4 + 0);
            indices.push(ii * 4 + 1);
            indices.push(ii * 4 + 2);
            indices.push(ii * 4 + 1);
            indices.push(ii * 4 + 3);
            indices.push(ii * 4 + 2);
        }

        let letterPosition = [];
        for(ii = 0; ii < this.data.length; ii++){
            let letterData = this.data[ii];

            if(ii % 2 == 0){
                letterPosition = [];
            }


            for(let jj = 0; jj < this.particles; jj++){

                let randomUv = uvs[jj * 12 + 2];
                // console.log(randomUv);
                let random = THREE.Math.randInt(0, letterData.length);

                let xPos = letterData[random] %64;
                let yPos =  parseInt(letterData[random]/64);

                for(let kk = 0; kk < 4; kk++){
                    if(ii % 2== 0){
                        letterPosition[2 * (jj * 8 + 2 * kk)] = xPos/64+ THREE.Math.randFloat(-1/64, 1/64);;
                        letterPosition[2 * (jj * 8 + 2 * kk) + 1] = -yPos/64 + 0.5+ THREE.Math.randFloat(-1/64, 1/64);;
                    }else{
                        letterPosition[2 * (jj * 8 + 2 * kk) + 2] = xPos/64 + THREE.Math.randFloat(-1/64, 1/64);
                        letterPosition[2 * (jj * 8 + 2 * kk) + 3] = -yPos/64 + 0.5+ THREE.Math.randFloat(-1/64, 1/64);;
                    }
                }
            }

            if(ii % 2 == 1){
                letterPosition = new Float32Array(letterPosition)
                geometry.addAttribute(`letterPosition${ (ii -1)/2 }`, new THREE.BufferAttribute( letterPosition, 4));
            }

        }

        indices = new Uint16Array(indices);
        position = new Float32Array(position);
        uvs = new Float32Array(uvs);
        data = new Float32Array(data);
        // data2 = new Float32Array(data2);

        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.addAttribute('position', new THREE.BufferAttribute(position, 3));
        geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 3));
        geometry.addAttribute('data', new THREE.BufferAttribute(data, 4));
        // geometry.addAttribute('data2', new THREE.BufferAttribute(data2, 1));

        console.log(geometry);

        return geometry;
    }
    update(){
        this.uniforms.uTheta.value -= 1/120;
        // this.uniforms.uTheta.value += Math.PI * 2
    }
    keydown(value){
        let count = -1;
        let targetValue = -2 * Math.PI * count-value/26 * Math.PI * 2;

        while( Math.abs(this.uniforms.uTheta.value - targetValue) > Math.PI){
            count++;
            targetValue = -Math.PI * 2 * count -value/26 * Math.PI * 2;
        }

        TweenMax.to(this.uniforms.uTargetRate, 1, {value: 1.0});
        TweenMax.to(this.uniforms.uTheta, 0.6, {value:  targetValue});
    }
    keyup(){
        TweenMax.killTweensOf([this.uniforms.uTargetRate]);
        TweenMax.to(this.uniforms.uTargetRate, 1.0, {value: 0.92 });
    }
}