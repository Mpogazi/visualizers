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
var scene, camera, renderer, trackBallControl, outCube, gui_control;
var cell_half_dist = 10;
var cube_size = 40;
var out_box_size = 200;
var out_box_coord_end = - (Math.floor(out_box_size / 2));
var num_cells = Math.floor(out_box_size / (cube_size + 2 * cell_half_dist));
var boxes = [];
var settings = { Expand: 15, Size: 20, Start: false };

window.addEventListener('resize', onResize);

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
    create_panel();
    create_cells();

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
 * Name: create_panel
 * Parameters: none
 * Returns: none
 * Does: Creates a dat.gui elem and adds GUI elements
 */
function create_panel() 
{
    gui_control = new dat.GUI();
    gui_control.add(settings, 'Expand', 1, 100, 0.1).onChange();
    gui_control.add(settings, 'Size', 1, 100, 1).onChange();
    gui_control.add(settings, 'Start', true).onChange();
}

/*
 *
 *
 *
 *
 */
function panel_change() 
{

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

/*
 * Name: out_box
 * Parameters: none
 * Return: none
 * Does: Creates an outer box for the cubes and adds them to
 *       scene.
 */
function out_box () 
{
    var geometry = new THREE.BoxBufferGeometry(200, 200, 200);
    var material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.06
    });

    outCube = new THREE.Mesh(geometry, material);
    scene.add(outCube);
}

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
    out_box();
    create_cell_helper();
}

/*
 * Name: create_cell_helper
 * Parameters: none
 * Return: none
 * Does: This is a helper function that creates cells
 *
 *
 */
function create_cell_helper () 
{
    for (var i = 0; i < num_cells; i++) {
        boxes[i] = new Array(num_cells);
        for (var j = 0; j < num_cells; j++) {
            boxes[i][j] = new Array(num_cells);
            for (var k = 0; k < num_cells; k++) 
            {
                var cell = new Cell();

                var position  = out_box_coord_end + (cube_size / 2 + 
                                                (cell_half_dist / 2));

                var increment = cube_size + 2 * cell_half_dist;
                
                cell.position(position + increment * k, 
                                                position + increment * j, 
                                                    position + increment * i);

                outCube.add(cell.cube);
                boxes[i][j][k] = cell;
            }
        }
    }
}

/*
 * Name: Cell
 * Type: Class
 * Represents: represents a cell which is by
 *             default alive but can be killed.
 *
 *
 *
 */
class Cell {
    constructor() 
    {
        var geometry = new THREE.BoxBufferGeometry(cube_size,
                                         cube_size, cube_size);
        var material = new THREE.MeshBasicMaterial({
                    color: Math.random() * 0xffffff
        });
        this.__cube = new THREE.Mesh(geometry, material);
        this.__life = true;
    }

    position (x, y, z) { this.__cube.position.set(x, y, z); }

    kill () { this.__life = false; }

    birth () { this.__life = true; }

    get life() { return this.__life; }

    get cube() { return this.__cube; }
}



/*
 * Name: update
 * Parameters: none
 * Return: none
 * Does: updates the state of the cells
 */
function update ()
{
    //outCube.rotation.x += 0.00009;
    outCube.rotation.y += 0.009;
}

/*
 * Name: render
 * Parameters: none
 * Return: none
 * Does: Please spare me (you can tell)
 */
function render() 
{
    update();
    renderer.render(scene, camera);
};


// Function calls
init();
animate();