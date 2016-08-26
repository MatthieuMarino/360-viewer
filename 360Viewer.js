var updateImage, scene, camera, video, videoImage, videoImageContext, sphere, newVideo, material, texture;

var rotation = {x: 0, y: 0, z: 0};
var width = config360.rendererSize ? config360.rendererSize.width : window.innerWidth;
var height = config360.rendererSize ? config360.rendererSize.height : window.innerHeight;

var keyboardMode = false;
var index = 0;
var nextImage, previousImage, lastDioramaInterval;

//keyboard events change the scene
document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;
    // console.log('e', e);

    if (e.keyCode == '38') {
        // up arrow
        rotation.x = enclosed(rotation.x + config360.speedIncrement, config360.minSpeed, config360.maxSpeed);
    }
    else if (e.keyCode == '40') {
        // down arrow
        rotation.x = enclosed(rotation.x - config360.speedIncrement, config360.minSpeed, config360.maxSpeed);
    }
    else if (e.keyCode == '37') {
        // left arrow
        rotation.y = enclosed(rotation.y - config360.speedIncrement, config360.minSpeed, config360.maxSpeed);
        if (!keyboardMode) {
            previousImage();
        }
    }
    else if (e.keyCode == '39') {
        // right arrow
        rotation.y = enclosed(rotation.y + config360.speedIncrement, config360.minSpeed, config360.maxSpeed);
        if (!keyboardMode) {
            nextImage();
        }
    } else if (e.keyCode == '32') {
        rotation.x = 0;
        rotation.y = 0;
        rotation.z = 0;
        lastDioramaInterval = Date.now();
    } else if (e.keyCode == '17') {
        keyboardMode = !keyboardMode;
        lastDioramaInterval = Date.now();
    }
    // newGroup(config360.group[Math.floor(Math.random() * config360.group.length)]);
    //     console.log('rotation', rotation);
}

//mouse event
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var mouseX, mouseY;


var targetRotationX = 0;
var targetRotationOnMouseDownX = 0;

var targetRotationY = 0;
var targetRotationOnMouseDownY = 0;

var mouseXOnMouseDown = 0;
var mouseYOnMouseDown = 0;
var finalRotationY;


function enclosed(data, min, max) {
    if (data <= min) {
        return min
    } else if (data >= max) {
        return max
    } else {
        return data;
    }
}


function onDocumentMouseDown(event) {

    event.preventDefault();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDownX = targetRotationX;

    mouseYOnMouseDown = event.clientY - windowHalfY;
    targetRotationOnMouseDownY = targetRotationY;

    lastDioramaInterval = Date.now();

}

function onDocumentMouseMove(event) {

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

    targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.02;
    targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;

}

function onDocumentMouseUp(event) {

    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);

}

function onDocumentMouseOut(event) {

    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);

}

function onDocumentTouchStart(event) {

    if (event.touches.length == 1) {

        event.preventDefault();

        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
        targetRotationOnMouseDownX = targetRotationX;

        mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
        targetRotationOnMouseDownY = targetRotationY;

    }

}

function onDocumentTouchMove(event) {

    if (event.touches.length == 1) {

        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        targetRotationX = targetRotationOnMouseDownX + ( mouseX - mouseXOnMouseDown ) * 0.05;

        mouseY = event.touches[0].pageY - windowHalfY;
        targetRotationY = targetRotationOnMouseDownY + (mouseY - mouseYOnMouseDown) * 0.05;

        // lastDioramaInterval = Date.now();

    }

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    width = config360.rendererSize ? config360.rendererSize.width : window.innerWidth;
    height = config360.rendererSize ? config360.rendererSize.height : window.innerHeight;

    if (camera) {
        camera.aspect = (width) / (height);
        camera.updateProjectionMatrix();
    }
    if (renderer) {
        renderer.setSize(width, height);
    }
}

nextImage = function () {
    // console.log('config360.diorama.length', config360.diorama.length);
    index++;
    if (index >= config360.diorama.length) {
        index = 0;
    }
    if(config360.diorama[index].video){
        newVideo = true;
    }
    if(video){
        video.pause();
    }
    updateImage(config360.diorama[index]);
    // console.log('config360.diorama[index]', config360.diorama[index]);
    lastDioramaInterval = Date.now();
};

previousImage = function () {
    index--;
    if (index < 0) {
        index = config360.diorama.length - 1;
    }
    if(config360.diorama[index].video){
        newVideo = true;
    }
    if(video){
        video.pause();
    }
    updateImage(config360.diorama[index]);
    lastDioramaInterval = Date.now();
};

window.onload = function () {
    // var rotated = 0;


    // var scene = new THREE.Scene();
    //set camera
    var camera = new THREE.PerspectiveCamera(75, (width) / (height), 0.1, 1000);
    camera.position.z = 5;

    //set renderer
    var renderer = new THREE.WebGLRenderer({antialias: true, alpha: config360.transparentBackground});
    renderer.setSize(width, height);
    if (config360.elementId) {
        document.getElementById(element).appendChild(renderer.domElement);
    } else {
        document.body.appendChild(renderer.domElement);
    }

    //add light at the center to brighten the scene
    // var sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
    // var light1 = new THREE.PointLight(0x404040, config360.lightsIntensity, 0);
    // // light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
    // light1.position.y = 0;
    // light1.position.z = 0;
    // light1.position.x = 0;

    //ambient light
    if (config360.ambientLight) {
        var light = new THREE.AmbientLight(0x404040, 4); // ambient soft white light to prevent the corners from being too dark
    }

    // var loader = THREE.TextureLoader();

    var geometry = new THREE.SphereGeometry(40, 32, 16);
    scene = new THREE.Scene();
    // texture = new THREE.Texture();
    //function to change the image displayed
    updateImage = function (input) {
        // console.log('input', input);
        if (input && input.image) {
            imageType = false;
            //load and render the sphere and i know it's deprecated but between something that doesn't work and somthing that does...
            if(!material){
                material = new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture(input.src), overdraw: true, side: THREE.BackSide});
            }else{
                material.map = THREE.ImageUtils.loadTexture(input.src);
                // console.log('texture', texture);
            }
            material.needsUpdate = true;
        } else if (input && input.video) {
            imageType = true;
            if (!video || newVideo) {
                // console.log('newVideo', newVideo);
                newVideo = false;
                //create video element and configure
                video = document.createElement('video');
                video.src = input.src;
                video.autoplay = true;
                videoImage = document.createElement('canvas');
                videoImage.width = 1920;
                videoImage.height = 960;
                videoImageContext = videoImage.getContext('2d');

                // background color as placeholder
                videoImageContext.fillStyle = '#000000';
                videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

                // set texture
                texture = new THREE.Texture(videoImage);
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;

                if(material){
                    material.map = texture;
                }else{
                    material = new THREE.MeshBasicMaterial({map: texture, overdraw: true, side: THREE.BackSide});
                    if(sphere){
                        sphere.material = material;
                    }
                }
            }
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                videoImageContext.drawImage(video, 0, 0);
                material.needsUpdate = true;
            }
        }
        else {
            console.log('No input');
        }
        lastDioramaInterval = Date.now();

    };

    //initialise the display
    updateImage(config360.diorama[0]);
    // nextImage();

    if(!sphere){
        sphere = new THREE.Mesh(geometry, material);
    }


    scene.add(sphere);

    if (config360.ambientLight) {
        scene.add(light);
    }
    // })

    newVideo = function (videoURL) {
        if (videoURL) {
            video.src = videoURL;
        }
    };


    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    window.addEventListener('resize', onWindowResize, false);

    //launch refresh loop
    function render() {
        // console.log('(',mouseX,':',mouseY,')' );

        //animate
        requestAnimationFrame(render);

        if(imageType){
            if (video.readyState === video.HAVE_ENOUGH_DATA) {
                videoImageContext.drawImage(video, 0, 0);
                material.needsUpdate = true;
            }
        }

        //progress diorama
        if (Date.now() - lastDioramaInterval > config360.dioramaInterval * 1000) {
            nextImage();
        }

        //mouse rotation
        if (!keyboardMode) {//horizontal rotation
            camera.rotation.y += ( targetRotationX - camera.rotation.y ) * 0.1;

            //vertical rotation
            finalRotationY = (targetRotationY - camera.rotation.x);


            if (camera.rotation.x <= 1 && camera.rotation.x >= -1) {

                camera.rotation.x += finalRotationY * 0.1;
            }
            if (camera.rotation.x > 1) {

                camera.rotation.x = 1
            }
            else if (camera.rotation.x < -1) {

                camera.rotation.x = -1
            }
        } else {
            //keyboard rotation
            camera.rotation.x += rotation.x;
            camera.rotation.y += rotation.y;
            camera.rotation.z += rotation.z;
        }

        // console.log('camera.position', camera.position);
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    }

    render();

}
;
