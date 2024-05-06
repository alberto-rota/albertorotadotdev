/**
 * @file yourScript.js
 * @description 
 * @author 
 * @copyright 
 */

document.addEventListener('DOMContentLoaded', function () {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('objContainer').appendChild(renderer.domElement);

    var objLoader = new THREE.OBJLoader();

    objLoader.load(
        'textured.obj', // Path to your .OBJ file
        function (object) {
            scene.add(object);
            object.position.set(0, -100, 0); // Adjust position as needed
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.log('An error happened');
        }
    );

    camera.position.z = 500; // Adjust camera position

    var animate = function () {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();
});
