var config3d = {
    //LOGO PROPERTIES
    size : 4, //change the size of the logo
    translate : -0.5, //change the center of the logo
    rotation : 0.03, // change rotation speed
    rotationMax : 6.28, // set a stop to rotation, probably in radians

    //SCENE PROPERTIES
    transparentBackground : false, // choose if the background is transparent
    lightsIntensity : 3, // change light intensity

    //FILE : model handling, stl format only
    filePath : "../models/", //path to the model files
    // file : 'and', //used to force the file displayed, ignoring fileList
    //used to display a file at random
    fileList : ['file2','file3','file4','file5','file6','file7','file8','file9','file10','file11','file12','file13'],

    //COLOR : color of the logo
    // color : '#640003', // change the color, ignore colorList
    colorList : ['#74c8f0', '#f7ec5c', '#640003'], //choose a color at random

    //SLIDER
    // slider1 : 'slide1.jpg', //used to force the slider displayed, ignoring sliderList
    // slider2 : 'slide2.jpg', //used to force the slider displayed, ignoring sliderList
    sliderPath : "../sliderImages/", //path to the slider image
    sliderList : ['slide1.jpg', 'slide2.jpg', 'slide3.jpg', 'slide4.jpg', 'slide5.jpg'],
    slideSize : 10, //change size of slider image
    sliderSpeed : 0.1, //set the speed of the sliders


    //Group images
    //possible members of a group not already included :
    //position: {x,y,z} // setup the initial position of the object, override the default value
    //translate: 0 // same a global translate but only for this group
    //spritePosition : {x,y,z} // setup sprites initial position, mirrored by x coordinate, override default value
    group: [
        {
            slider1: 'slide1_gauche.jpg',
            slider2: 'slide1_droit.jpg',
            model: 'file13',
            color: '#af3034',
            position: {x:-1.8,y:0.8,z:0}
        },
        {
            slider1: 'slide2_gauche.jpg',
            slider2: 'slide2_droit.jpg',
            model: 'file3',
            color: 0x404040,
            translate : -0.35
        },
        {
            slider1: 'slide3_gauche.jpg',
            slider2: 'slide3_droit.jpg',
            model: 'file6',
            color: '#640003'
        },
        {
            slider1: 'slide4_gauche.svg',
            slider2: 'slide4_droit.svg',
            model: 'file10',
            color: '#640003'
        },
        {
            slider1: 'slide5_gauche.jpg',
            slider2: 'slide5_droit.jpg',
            model: 'file4',
            color: '#640003'
        }

    ]
};