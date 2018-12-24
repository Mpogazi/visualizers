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
var scene, camera, renderer, trackBallControl, outCube, gui_control,
    num_cells, out_box_coord_end;
var cell_half_dist = 10;
var cube_size = 20;
var out_box_size = 250;
var boxes = [];
var settings = {
    Expand: cell_half_dist,
    Cellsize: cube_size,
    Start: false
};

var start = false;


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
    create_panel();
    create_camera();
    set_renderer();
    create_lights();
    create_controls();
    create_cells();
    window.addEventListener('resize', onResize);
    window.setInterval(next_round, 1200);
}

/*
 * Name: create_controls
 * Parameters: none
 * Returns: none
 * Does: Initiates all the controls
 */
function create_controls() 
{
    trackBallControl = new THREE.TrackballControls(camera, renderer.domElement);
    
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
    gui_control = new dat.GUI({ width: 200 });
    gui_control.add(settings, 'Expand', 10, 30).listen().onChange(set_expansion);
    gui_control.add(settings, 'Cellsize', 20, 30).listen().onChange(set_cellsize);
    gui_control.add(settings, 'Start').onChange(set_start);
    gui_control.open();
}

/*
 * Name: set_cell_size
 * Parameters: value
 * Returns: none
 * Does: Sets the cell size and Repaint the canvas
 */
function set_cellsize (value) 
{
    cube_size = value;
    change_cell_size(value);
}

function change_cell_size (value) 
{
    for(var i = 0; i < num_cells; i++) 
    {
        for(var j = 0; j < num_cells; j++) 
        {
            for(var k = 0; k < num_cells; k++) 
            {
                boxes[i][j][k].change_size(value);
            }
        }
    }
}


/*
 * Name: set_start
 * Parameters: value
 * Returns: none
 * Does: Sets start global var to the param passed
 */
function set_start(value) 
{
    start = value;
}

/*
 * Name: set_expansion
 * Parameters: value
 * Returns: none
 * Does: Sets the expand size and Repaint the canvas
 */

function set_expansion(value) 
{
    cell_half_dist = value;
    change_position(value);
}

/*
 * Name: change_position
 * Parameters: value
 * Returns: none
 * Does: Changes the position of every cell and expands
 *       the distance between the cells.
 */
function change_position(value) 
{
    for(var i = 0; i < num_cells; i++) 
    {
        for(var j = 0; j < num_cells; j++) 
        {
            for(var k = 0; k < num_cells; k++) 
            {
                if (boxes[i][j][k] != null) {
                    var position  = out_box_coord_end + (cube_size / 2 + (value / 2));
                    var increment = cube_size + 2 * value;
                    boxes[i][j][k].position(position + increment * k, position + increment * j, position + increment * i);
                }
            }
        }
    }
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
    camera.position.z = 500;
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
        opacity: 0.001
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
    update();
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
    out_box_coord_end = - (Math.floor(out_box_size / 2));
    num_cells = Math.floor(out_box_size / (cube_size + 2 * cell_half_dist));
    
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

                var rand_num = Math.round(Math.random());
                if (!rand_num) {
                    cell.kill();
                }
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
        this.__alive_neighbors = 0;
    }

    change_size (value) {
        var geom = new THREE.BoxBufferGeometry(value, value, value);
        this.__cube.geometry.dispose();
        this.__cube.geometry = geom;   
    }

    get neighbors() { return this.__alive_neighbors; }

    set_neighbors (value) { this.__alive_neighbors = value; }

    position (x, y, z) { this.__cube.position.set(x, y, z); }

    kill () { 
        this.__life = false;
        this.__cube.material.opacity = 0.00;
        this.__cube.material.transparent = true;
    }

    birth () { 
        this.__life = true;
        this.__cube.material.transparent = false;
        this.__cube.material.opacity = 1.0;
    }

    get life() { return this.__life; }

    get cube() { return this.__cube; }
}

/*
 * Name: next_round
 * Parameters: none
 * Return: none
 * Does: Computes the number of neighbors and 
 *       Call the life_or_death function.
 */
function next_round() 
{
    if (start) {
        for (var i = 0; i < num_cells; i++) {
            for (var j = 0; j < num_cells; j++) {
                for (var k = 0; k < num_cells; k++) {
                    var neighbors = count_neighbors (i, j, k);
                    boxes[i][j][k].set_neighbors(neighbors);
                }
            }
        }
        life_or_death();
    }
}

/*
 * Name: life_or_death
 * Parameters: none
 * Return: none
 * Does: Checks which cells are to survice or Die based
 *       on the number of neighbors.
 */
function life_or_death() 
{
    for (var i = 0; i < num_cells; i++) {
        for (var j = 0; j < num_cells; j++) {
            for (var k = 0; k < num_cells; k++) {
                var n_bor = boxes[i][j][k].neighbors;
                if (n_bor <= 8 && n_bor >= 5) {
                    boxes[i][j][k].birth();
                } else if ( n_bor <= 7 && n_bor >= 4) {
                    boxes[i][j][k].birth();
                } else {
                    boxes[i][j][k].kill();
                }
            }
        }
    }
}

/*
 * Name: count_neighbors
 * Parameters: i, j, k (3D coordinates)
 * Return: number of nieghbors
 * Does: Counts the number of neighbors of a certain cell
 */
function count_neighbors (i, j, k) 
{
    var count = 0;

    if (i != 0)
        if (boxes[i - 1][j][k].life)
            count++;
    
    if (i != 0 && j != 0)
        if (boxes[i - 1][j - 1][k].life)
            count++;
    
    if (i != 0 && j != 0 && k != 0)
        if (boxes[i - 1][j - 1][k - 1].life)
            count++;

    if (j != 0)
        if (boxes[i][j - 1][k].life)
            count++;

    if (k != 0)
        if (boxes[i][j][k - 1].life)
            count++;

    if (j != 0 && k != 0)
        if (boxes[i][j - 1][k - 1].life)
            count++;

    if (j != (num_cells - 1))
        if (boxes[i][j + 1][k].life)
            count++;

    if (k != (num_cells - 1))
        if (boxes[i][j][k + 1].life)
            count++;

    if (i != (num_cells - 1))
        if (boxes[i + 1][j][k].life)
            count++;

    if (i != (num_cells - 1) && j != (num_cells - 1))
        if (boxes[i + 1][j + 1][k].life)
            count++;

    if (i != (num_cells - 1) && j != (num_cells - 1) && k != (num_cells - 1))
        if (boxes[i + 1][j + 1][k + 1].life)
            count++;

    if (j != (num_cells - 1) && k != (num_cells - 1))
        if (boxes[i][j + 1][k + 1].life)
            count++;


    return count;
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
    if (start) {
        outCube.rotation.y += 0.004;    
    }
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