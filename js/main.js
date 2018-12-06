"use strict";
//boiler plate set up

/*
 *      WebGLAvailability Check
 *  This piece of code is supposed to check
 *  the availability of WebGL.
 * 
 *  If WebGL is not available, an error is spit
 *  out in the Dom Tree.
 *  
 *  Three.js can work in Browsers without WebGL,
 *  however implementation of this script in non-WebGL
 *  browsers is beyond the scope of this work.
 *
 *  Therefore this script may work in Chrome, Firefox,
 *  IE > 9, Opera and Safari
 *
 *  In some cases WebGL might fail due to lack of required
 *  GPU features or hardware problems.
 *  
 *  
 *  To check WebGL support in your browser:
 *  visit https://get.webgl.org
 *
 */
if (!WEBGL.isWebGLAvailable()) {
    var warning = WEBGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}

/*
 *  Declaration of globals to the application
 */
var scene, camera, renderer, trackBallControl, stats;
var boxes = [];

/*
 * Name: init
 * Parameters: none
 * Returns: none
 * Does: Initiates the scene and adds camera,
 *       renderer, lights, controls and boxes.
 */
function init() 
{
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    create_camera();
    set_renderer();
    create_lights();
    create_controls();
    create_cells();

    window.addEventListener('resize', onResize);
}

/*
 * Name: create_controls
 * Parameters: none
 * Returns: none
 * Does: Initiates all the controls
 */
function create_controls() 
{
    trackBallControl = new THREE.TrackballControls(camera);
    
    trackBallControl.rotateSpeed = 1.0;
    trackBallControl.zoomSpeed = 1.2;
    trackBallControl.panSpeed = 0.8;

    trackBallControl.noZoom = false;
    trackBallControl.noPan = false;

    trackBallControl.staticMoving = true;
    trackBallControl.dynamicDampingFactor = 0.3;
    trackBallControl.keys = [65, 68, 83];

    trackBallControl.addEventListener('change', render);
}

/*
 * Name: create_camera
 * Parameters: none
 * Return: none
 * Does: Initiates the camera object
 */
function create_camera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / 
                                            window.innerHeight ,1 , 1000);
    camera.position.z = 400;
}

/*
 * Name: set_renderer
 * Parameters: none
 * Return: None
 * Does: Initializes the renderer object
 */
function set_renderer () 
{
    renderer = new THREE.WebGLRenderer({antialiasing: true});

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setClearColor()
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.shadowMapSoft = true;
    document.body.appendChild(renderer.domElement);
}

/*
 * Name: create_lights
 * Parameters: None
 * Return: none
 * Does: adds different lights to the canvas
 */
function create_lights () 
{

}

/*
 *  Name: onResize()
 *  Parameters: None
 *  Return: None
 *  Does: Updates the screen when screen size changes
 */
function onResize () 
{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = (window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
}


//
//  This part will be turned into a class
//  of a cube
//
var geometry = new THREE.BoxGeometry(30, 30, 30);
var material = new THREE.MeshBasicMaterial({color: 0xfffff, wireframe: true});	

/*
 * Name: animate
 * Parameters: none
 * Return: none
 * Does: Requests frame, updates the scene, and 
 *       renders everything. Also measures the 
 *       performance of the code using stats.
 */
var animate = function () 
{
    requestAnimationFrame(animate);
    trackBallControl.update();
    //update();
    render();
}

/*
 * Name: create_boxes
 * Parameters: none
 * Return: none
 * Does: create cells for the game
 */

function create_cells () 
{
    for (var i = 0; i < 10; i++)
    {
        var x = Math.random() * 150 - 70;
        var y = Math.random() * 150 - 70;
        var z = Math.random() * 150 - 70;

        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(x,y,z);
        scene.add(cube);
        boxes.push(cube);
    }
}

/*
 * Name: update
 * Parameters: none
 * Return: none
 * Does: updates the state of the cells
 */
function update ()
{

}

/*
 * Name: render
 * Parameters: none
 * Return: none
 * Does: Please spare me (you can tell)
 */
function render() 
{
    length = boxes.length;

    for (var i = 0; i < length; i++)
    {
        boxes[i].rotation.x += 0.01;
        boxes[i].rotation.y += 0.01;
    };

    renderer.render(scene, camera);
};


// Function calls
init();
animate();