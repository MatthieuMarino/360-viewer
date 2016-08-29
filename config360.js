var config360 = {
    //CONTROL
    maxSpeed : 0.1, //max speed of rotation
    minSpeed : -0.1, //min speed of rotation
    speedIncrement : 0.01,

    //SCENE PROPERTIES
    transparentBackground : false, // choose if the background is transparent
    lightsIntensity : 3, // change light intensity
    ambientLight : true, //on/off the ambient light
    // rendererSize: {width : window.innerWidth, height : window.innerHeight}, //setup the size of the openGL renderer

    //DOM
    //warning, don't touch this one if you don't know what you are doing
    // elementId: 'idElement', //set the id of the element where the renderer is gonna be append

    //Gallerie
    diorama : [
        {image:true,src:'../images/R0010232.jpg'},{image:true,src:'../images/R0010233.jpg'},
        {image:true,src:'../images/R0010234.jpg'},{image:true,src:'../images/R0010235.jpg'},
        {image:true,src:'../images/R0010236.jpg'},{image:true,src:'../images/R0010237.jpg'},
        {image:true,src:'../images/R0010238.jpg'},{image:true,src:'../images/R0010239.jpg'},
        {image:true,src:'../images/R0010240.jpg'},{image:true,src:'../images/R0010241.jpg'},
        {image:true,src:'../images/R0010242.jpg'},{image:true,src:'../images/R0010243.jpg'},
        {image:true,src:'../images/R0010244.jpg'},
        {video:true,src:'../images/R0010245_er.MP4'}], //list of file
    dioramaInterval : 6 // interval in seconds

};