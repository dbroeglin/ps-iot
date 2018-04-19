/*

Generate 3D render using serial data from IMU

*/

'use strict';

// Declare required variables

var functionUrl = 'https://powershell-iot.azurewebsites.net/api/RpiData'

var dataRollx = 0;
var dataRolly = 0;
var dataRollz = 0;
var dataRollxArray = [];
var dataRollyArray = [];
var dataRollzArray = [];
var accuracy = 2;
var orderOfMag = (Math.PI/180);
var container;
var camera, scene, renderer;
var cube, plane;
var targetRotation = 0;
var targetRotationOnMouseDown = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

//Connect to socket.io
var serverIP = "localhost";
//var socket = io.connect(serverIP + ':5000');
console.log('socket connected to: ' + serverIP);

// Start reading IMU data
init();
animate();


function normalize(val) {
    return val;
}

function doPoll(){
    $.get(functionUrl, function(data) {
        console.log("Data: " + JSON.stringify(data));
        setTimeout(doPoll, 250);
        dataRollx = normalize(data.x);
        dataRolly = normalize(data.y);
        dataRollz = normalize(data.z); 
    });
}
doPoll();




function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = 'PowerShell IOT - Demo';
    info.setAttribute('id', 'pourHeading');
    container.appendChild( info );

    $("#pourHeading").append("<div id='subHeading'></div>");

    // Set up camera
    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.y = 250;
    camera.position.z = 700;

    scene = new THREE.Scene();

    // Create cube
    var geometry = new THREE.BoxGeometry( 400, 400, 400 );

    for ( var i = 0; i < geometry.faces.length; i += 2 ) {

        var hex = Math.random() * 0xffffff;
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );

    }

    var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
    var img = new THREE.MeshLambertMaterial({
        map:THREE.ImageUtils.loadTexture('/psconf.jpg'),
        color: new THREE.Color( 0xff0000 )
    });

    cube = new THREE.Mesh( geometry, img );
    cube.position.y = 150;
    scene.add( cube );

    // Create background plane
    var geometry = new THREE.PlaneBufferGeometry( 600, 200 );
    geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

    var material = new THREE.MeshBasicMaterial( { color: 0xe0e0e0, overdraw: 0.5 } );
    plane = new THREE.Mesh( geometry, material);
    //scene.add( plane );

    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
        requestAnimationFrame( animate );
        render();
}

function render() {
    cube.rotation.x = -dataRollx;
    cube.rotation.y = 0;
    cube.rotation.z = -dataRolly;
    renderer.render( scene, camera );
}
