var newGroup;

//keyboard events change the scene
document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;
    console.log('e', e);

    // if (e.keyCode == '38') {
    //     // up arrow
    // }
    // else if (e.keyCode == '40') {
    //     // down arrow
    // }
    // else if (e.keyCode == '37') {
    //     // left arrow
    // }
    // else if (e.keyCode == '39') {
    //     // right arrow
    // }
    newGroup(config3d.group[Math.floor(Math.random() * config3d.group.length)]);

}

//mouse event
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var mouseX, mouseY;
document.addEventListener('mousemove', onDocumentMouseMove, false);

function onDocumentMouseMove(event) {

    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );

}


window.onload = function () {
    var rotated = 0;

    var scene = new THREE.Scene();
    //set camera
    var camera = new THREE.PerspectiveCamera(75,
        (config3d.rendererSize ? config3d.rendererSize.width : window.innerWidth) /
        (config3d.rendererSize ? config3d.rendererSize.height : window.innerHeight),
        0.1,
        1000
    );
    camera.position.z = 5;

    //set renderer
    var renderer = new THREE.WebGLRenderer({antialias: true, alpha: config3d.transparentBackground});
    renderer.setSize(
        config3d.rendererSize ? config3d.rendererSize.width : window.innerWidth,
        config3d.rendererSize ? config3d.rendererSize.height : window.innerHeight
    );
    if (config3d.elementId) {
        document.getElementById(element).appendChild(renderer.domElement);
    } else {
        document.body.appendChild(renderer.domElement);
    }

    //add lights at both side of the logo to brighten the scene and add shadows
    // var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
    var light1 = new THREE.PointLight(0x404040, config3d.lightsIntensity, 0);
    // light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
    light1.position.y = 0;
    light1.position.z = 0;
    light1.position.x = 3;

    var light2 = new THREE.PointLight(0x404040, config3d.lightsIntensity, 0);
    // light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
    light2.position.y = 0;
    light2.position.z = 0;
    light2.position.x = -3;

    //ambient light
    if (config3d.ambientLight) {
        var light = new THREE.AmbientLight(0x404040, 4); // ambient soft white light to prevent the corners from being too dark
    }


    var loader = new THREE.STLLoader();

    var logo, sprite1, sprite2, material;
    //function to change the group displayed
    newGroup = function (group) {
        scene = new THREE.Scene();
        if (!group) {
            group = config3d.group[Math.floor(Math.random() * config3d.group.length)];
        }
        if (!group.model) {
            var file = config3d.fileList[Math.floor(Math.random() * config3d.fileList.length)];
        } else {
            var file = group.model;
        }
        //load and render the logo
        loader.load("../models/" + file + ".stl", function (geometry) {
            // var geometry = new THREE.BoxGeometry(1, 1, 1);
            if (!group.color) {
                var color = config3d.colorList[Math.floor(Math.random() * config3d.colorList.length)];
            } else {
                var color = group.color;
            }
            material = new THREE.MeshPhongMaterial({color: color, specular: 0x111111, shininess: 50});
            logo = new THREE.Mesh(geometry, material);
            logo.scale.set(config3d.size, config3d.size, config3d.size);

            if (group.position) {
                logo.position.y += group.position.y ? group.position.y : 2;
                logo.position.x += group.position.x ? group.position.x : 0;
                logo.position.z += group.position.z ? group.position.z : 0;
            } else {
                logo.position.y += 2;
            }
            //recenter the logo so that the rotation is around its center
            geometry.applyMatrix(new THREE.Matrix4().makeTranslation(group.translate ? group.translate : config3d.translate, 0, 0));
            scene.add(logo);

            //add lights to the scene
            scene.add(light1);
            scene.add(light2);
            if (config3d.ambientLight) {
                scene.add(light);
            }

            //add image left for slider
            if (!group.slider1) {
                var slider1 = config3d.sliderList[Math.floor(Math.random() * config3d.sliderList.length)];
            } else {
                var slider1 = group.slider1;
            }
            var map1 = new THREE.TextureLoader().load(config3d.sliderPath + slider1);
            var spriteMaterial1 = new THREE.SpriteMaterial({map: map1, color: 0xffffff, fog: true});
            sprite1 = new THREE.Sprite(spriteMaterial1);

            if (group.spritePosition) {
                sprite1.position.set(-group.spritePosition.x, group.spritePosition.y, group.spritePosition.z)
            } else {
                sprite1.position.set(-25, 0, -2);
            }
            // sprite.applyMatrix( new THREE.Matrix4().makeTranslation(-15, 0, 0) );
            sprite1.scale.set(config3d.slideSize * 2, config3d.slideSize, 0);
            scene.add(sprite1);

            //add image right for slider
            if (!group.slider2) {
                var slider2 = config3d.sliderList[Math.floor(Math.random() * config3d.sliderList.length)];
            } else {
                var slider2 = group.slider2;
            }
            var map2 = new THREE.TextureLoader().load(config3d.sliderPath + slider2);
            var spriteMaterial2 = new THREE.SpriteMaterial({map: map2, color: 0xffffff, fog: true});
            sprite2 = new THREE.Sprite(spriteMaterial2);

            if (group.spritePosition) {
                sprite2.position.set(group.spritePosition.x, group.spritePosition.y, group.spritePosition.z)
            } else {
                sprite2.position.set(25, 0, -2);
            }
            // sprite2.position.set(25,0,-2);
            sprite2.scale.set(config3d.slideSize * 2, config3d.slideSize, 0);
            scene.add(sprite2);
            rotated = 0;
        })
    };

    //initialise the display
    newGroup(config3d.group[Math.floor(Math.random() * config3d.group.length)]);

    //launch refresh loop
    function render() {
        // console.log('(',mouseX,':',mouseY,')' );
        //add inertia to the logo according the mouse
        if (logo && mouseY * mouseY < config3d.mouseProximity && mouseX * mouseX < config3d.mouseProximity) {
            if (logo.position.z < config3d.mouseMaxProximity) {
                logo.position.z += config3d.mouseSpeed;
            }
        } else {
            if (logo && logo.position.z > 0) {
                logo.position.z -= config3d.mouseSpeed;
            }
        }
        //animate
        requestAnimationFrame(render);
        if (logo && rotated < config3d.rotationMax) {
            // console.log('rotated', rotated);
            rotated += config3d.rotation;
            logo.rotation.y += config3d.rotation;
        }
        if (sprite1 && sprite1.getWorldPosition().x < -10) {
            sprite1.translateX(config3d.sliderSpeed);
        }
        if (sprite2 && sprite2.getWorldPosition().x > 10) {
            sprite2.translateX(-config3d.sliderSpeed);
        }
        renderer.render(scene, camera);
    }

    render();

}
;
