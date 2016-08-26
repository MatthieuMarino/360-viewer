var newImage, scene, camera, video, videoImage, videoImageContext, videoTexture, movieScreen, getVideo;
//ricoh data //tried to get live feed from device but didn't work as intended, and CORS...
var sessionId, getState, lastContact, status, newStatus, checkingStatus, capturing;

var rotation = {x: 0, y: 0, z: 0};
var width = config360.rendererSize ? config360.rendererSize.width : window.innerWidth;
var height = config360.rendererSize ? config360.rendererSize.height : window.innerHeight;

var keyboardMode = false;

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
        if(!keyboardMode){
            video.pause();
        }
    }
    else if (e.keyCode == '37') {
        // left arrow
        rotation.y = enclosed(rotation.y - config360.speedIncrement, config360.minSpeed, config360.maxSpeed);
        if(!keyboardMode){
            video.currentTime = 0;
        }
    }
    else if (e.keyCode == '39') {
        // right arrow
        rotation.y = enclosed(rotation.y + config360.speedIncrement, config360.minSpeed, config360.maxSpeed);
        if(!keyboardMode){
            if(video.paused){
            video.play();
            }else{
                video.stop();
            }
        }
    } else if (e.keyCode == '32') {
        rotation.x = 0;
        rotation.y = 0;
        rotation.z = 0;
    } else if (e.keyCode == '17') {
        keyboardMode = !keyboardMode;
    }

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

document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(event) {

    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );

}


function enclosed(data, min, max) {
    if (data <= min) {
        return min
    } else if (data >= max) {
        return max
    } else {
        return data;
    }
}

//mouse event
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var mouseX, mouseY;
document.addEventListener('mousemove', onDocumentMouseMove, false);

function onDocumentMouseDown(event) {

    event.preventDefault();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);

    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDownX = targetRotationX;

    mouseYOnMouseDown = event.clientY - windowHalfY;
    targetRotationOnMouseDownY = targetRotationY;

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

    }

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    width = config360.rendererSize ? config360.rendererSize.width : window.innerWidth;
    height = config360.rendererSize ? config360.rendererSize.height : window.innerHeight;

    camera.aspect = (width) / (height);
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

}

window.onload = function () {
    // var rotated = 0;


    scene = new THREE.Scene();
    //set camera
    camera = new THREE.PerspectiveCamera(75, (width) / (height), 0.1, 1000);
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


    //create video element and configure
    video = document.createElement('video');
    video.src = 'http://localhost:3436/images/R0010245_er.MP4';
    videoImage = document.createElement('canvas');
    videoImage.width = 1920;
    videoImage.height = 960;
    videoImageContext = videoImage.getContext('2d');

    // background color as placeholder
    videoImageContext.fillStyle = '#000000';
    videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

    // set texture
    videoTexture = new THREE.Texture(videoImage);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    var loader = THREE.TextureLoader();

    var geometry = new THREE.SphereGeometry(40, 32, 16);

    //create the sphere material
    var movieMaterial = new THREE.MeshBasicMaterial({map: videoTexture, overdraw: true, side: THREE.DoubleSide});
    // the geometry on which the movie will be displayed;
    // 		movie image will be scaled to fit these dimensions.
    // var geometry = new THREE.SphereGeometry( 0.5, 16, 8 );
    movieScreen = new THREE.Mesh(geometry, movieMaterial);
    // movieScreen.position.set(0,50,0);
    scene.add(movieScreen);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    window.addEventListener('resize', onWindowResize, false);

    // var material, texture;
    //function to change the image displayed
    newImage = function () {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            videoImageContext.drawImage(video, 0, 0);
            if (videoTexture)
                videoTexture.needsUpdate = true;
        }

    };

    getVideo = function () {


        console.log('Preparing to connect');
        $.ajax({
            type: 'POST',
            url: 'http://192.168.1.1:80/osc/commands/execute',
            data: {
                "name": "camera.startSession"
            },
            success: function (res) {
                console.log('Session created');
                if (res.state == 'done') {
                    sessionId = res.sessionId;
                    lastContact = Date.now();
                    $.ajax({
                        type: 'POST',
                        url: 'http://192.168.1.1:80/osc/commands/execute',
                        data: {
                            "name": "camera.setOptions",
                            "parameters": {
                                "sessionId": sessionId,
                                "options": {
                                    "clientVersion": 2.1
                                }
                            }
                        },
                        success: function (answer) {
                            console.log('Options sent');
                            if (answer.state == 'done') {
                                lastContact = Date.now();
                                var connection = $.ajax({
                                    type: 'POST',
                                    url: 'http://192.168.1.1:80/osc/commands/execute',
                                    data: {
                                        "name": "camera.getLivePreview"
                                    },
                                    success: function (answer) {
                                        console.log('preview launched');
                                        if (answer.state == 'inProgress') {
                                            lastContact = Date.now();
                                            capturing = true;
                                            console.log('answer', answer);
                                        }
                                    }
                                });

                                connection.addEventListener('readystatechange', function (videopart) {
                                    video = videopart;
                                })
                            }
                        }
                    });
                }
            }
        });
    };

    getState = function () {
        checkingStatus = true;
        $.ajax({
            type: 'POST',
            url: 'http://192.168.1.1:80/osc/state',
            success: function (res) {
                newStatus = false;
                checkingStatus = false;
                status = res;
                lastContact = Date.now();
            }
        });
    };

    checkStatus = function () {
        if (!checkingStatus) {
            $.ajax({
                type: 'POST',
                url: 'http://192.168.1.1:80/osc//checkForUpdates',
                success: function (res) {
                    if (status.stateFingerprint == res.stateFingerprint) {
                        newStatus = true;
                    }
                }
            });
        }
    };

    //launch refresh loop
    function render() {
        // console.log('(',mouseX,':',mouseY,')' );

        //animate
        requestAnimationFrame(render);

        newImage();

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


    window.onunload = function(){
        //set stop capture here if you should
    }
}
;
