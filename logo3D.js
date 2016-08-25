var logoConf = config3d.group[Math.floor(Math.random() * config3d.group.length)];

window.onload = function () {
    var rotated = 0;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer({antialias: true, alpha: config3d.transparentBackground});
    renderer.setSize(window.innerWidth, window.innerHeight);
    // document.getElementById('logoCanva').appendChild(renderer.domElement);
    document.body.appendChild(renderer.domElement);


    //load and render the logo
    var loader = new THREE.STLLoader();
    if (!logoConf) {
        var file = config3d.fileList[Math.floor(Math.random() * config3d.fileList.length)];
    } else {
        var file = logoConf.model;
    }
    loader.load("../models/" + file + ".stl", function (geometry) {
        // var geometry = new THREE.BoxGeometry(1, 1, 1);
        if (!logoConf.color) {
            var color = config3d.colorList[Math.floor(Math.random() * config3d.colorList.length)];
        } else {
            var color = logoConf.color;
        }
        var material = new THREE.MeshPhongMaterial({color: color, specular: 0x111111, shininess: 50});
        var logo = new THREE.Mesh(geometry, material);
        logo.scale.set(config3d.size, config3d.size, config3d.size);

        if(logoConf.position){
            logo.position.y += logoConf.position.y;
            logo.position.x += logoConf.position.x;
            logo.position.z += logoConf.position.z;
        }else{
            logo.position.y += 2;
        }
        //recenter the logo so that the rotation is around its center
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(logoConf.translate ? logoConf.translate : config3d.translate, 0, 0));
        scene.add(logo);
        camera.position.z = 5;

        //add lights at both side of the logo to brighten the scene and add shadows
        // var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
        var light1 = new THREE.PointLight(0x404040, config3d.lightsIntensity, 0);
        // light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
        light1.position.y = 0;
        light1.position.z = 0;
        light1.position.x = 3;
        scene.add(light1);

        var light2 = new THREE.PointLight(0x404040, config3d.lightsIntensity, 0);
        // light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
        light2.position.y = 0;
        light2.position.z = 0;
        light2.position.x = -3;
        scene.add(light2);

        var light = new THREE.AmbientLight(0x404040, 4); // ambient soft white light to prevent the corners from being too dark
        scene.add(light);

        //add image left for slider
        if (!logoConf.slider1) {
            var slider1 = config3d.sliderList[Math.floor(Math.random() * config3d.sliderList.length)];
        } else {
            var slider1 = logoConf.slider1;
        }
        var map1 = new THREE.TextureLoader().load(config3d.sliderPath + slider1);
        var spriteMaterial1 = new THREE.SpriteMaterial({map: map1, color: 0xffffff, fog: true});
        var sprite1 = new THREE.Sprite(spriteMaterial1);

        if (logoConf.spritePosition) {
            sprite1.position.set(-logoConf.spritePosition.x, logoConf.spritePosition.y, logoConf.spritePosition.z)
        } else {
            sprite1.position.set(-25, 0, -2);
        }
        // sprite.applyMatrix( new THREE.Matrix4().makeTranslation(-15, 0, 0) );
        sprite1.scale.set(config3d.slideSize * 2, config3d.slideSize, 0);
        scene.add(sprite1);

        //add image right for slider
        if (!logoConf.slider2) {
            var slider2 = config3d.sliderList[Math.floor(Math.random() * config3d.sliderList.length)];
        } else {
            var slider2 = logoConf.slider2;
        }
        var map2 = new THREE.TextureLoader().load(config3d.sliderPath + slider2);
        var spriteMaterial2 = new THREE.SpriteMaterial({map: map2, color: 0xffffff, fog: true});
        var sprite2 = new THREE.Sprite(spriteMaterial2);

        if (logoConf.spritePosition) {
            sprite2.position.set(logoConf.spritePosition.x, logoConf.spritePosition.y, logoConf.spritePosition.z)
        } else {
            sprite2.position.set(25, 0, -2);
        }
        // sprite2.position.set(25,0,-2);
        sprite2.scale.set(config3d.slideSize * 2, config3d.slideSize, 0);
        scene.add(sprite2);


        //launch refresh loop
        function render() {
            requestAnimationFrame(render);
            if (rotated < config3d.rotationMax) {
                // console.log('rotated', rotated);
                rotated += config3d.rotation;
                logo.rotation.y += config3d.rotation;
            }
            if (sprite1.getWorldPosition().x < -10) {
                sprite1.translateX(config3d.sliderSpeed);
            }
            if (sprite2.getWorldPosition().x > 10) {
                sprite2.translateX(-config3d.sliderSpeed);
            }
            renderer.render(scene, camera);
        }

        render();
    });
    // var material = new THREE.MeshBasicMaterial( { color: 'af3034' } );
    // var geometry =
};
