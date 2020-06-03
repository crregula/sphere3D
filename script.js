// Get the canvas element from the DOM
const canvas = document.getElementById("scene");

// Get the canvas dimensions
canvas.width = canvas.clientWidth; // Width of the scene
canvas.height = canvas.clientHeight; // Height of the scene

// Store the 2D context
const ctx = canvas.getContext("2d");

if (window.devicePixelRatio > 1) {
     canvas.width = canvas.clientWidth * 2;
     canvas.height = canvas.clientHeight * 2;
     ctx.scale(2, 2);
}

let width = canvas.offsetWidth;
let height = canvas.offsetHeight;
const dots = [];

let DOTS_AMOUNT = 1000;
let PERSPECTIVE = width * 0.8; // The field of view of our 3D scene
let PROJECTION_CENTER_X = width / 2; // x center of the canvas
let PROJECTION_CENTER_Y = height / 2; // y center of the canvas

const DOT_RADIUS = 10;
let GLOBE_RADIUS = width / 3; // Radius of the globe

class Dot {
     constructor() {
          this.theta = Math.random() * 2 * Math.PI; // Random value between [0, 2Pi]
          this.phi = Math.acos(Math.random() * 2 - 1); // Random value between [0, Pi]

          // The x, y, z coordinates will be calculated in the project() function
          this.x = 0;
          this.y = 0;
          this.z = 0;

          // The projected coordinates will be calculated in the project() function
          this.xProjected = 0; // x coordinate on the 2D plane
          this.yProjected = 0; // y coordinate on the 2D plane
          this.scaleProjected = 0; // Scale of the element on the 2D plane (further = smaller)

          gsap.to(this, 20 + Math.random() * 10, {
               theta: this.theta + Math.PI * 2,
               repeat: -1,
               ease: Power0.easeNone,
          });
     }

     // Project our element from the 3D plane to the 2D plane
     project() {
          // Calculate the x, y, z coordinates in the 3d plane
          this.x = GLOBE_RADIUS * Math.sin(this.phi) * Math.cos(this.theta);
          this.y = GLOBE_RADIUS * Math.cos(this.phi);
          this.z =
               GLOBE_RADIUS * Math.sin(this.phi) * Math.sin(this.theta) +
               GLOBE_RADIUS;

          // The scaleProjected will store the scale of the element based on its distance from the 'camera'
          this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);
          // The xProjected is the x position on the 2D plane
          this.xProjected = this.x * this.scaleProjected + PROJECTION_CENTER_X;
          // The yProjected is the y position on the 2D plane
          this.yProjected = this.y * this.scaleProjected + PROJECTION_CENTER_Y;
     }

     // Draw the dot on the canvas
     draw() {
          // Calculate the projected values of the dot
          this.project();
          // Define opacity based on its distance
          ctx.globalAlpha = Math.abs(1 - this.z / width);

          // Draw a circle
          ctx.beginPath();

          // The arc function takes 5 parameters (x,y,radius,angle start,angle end)
          ctx.arc(
               this.xProjected,
               this.yProjected,
               DOT_RADIUS * this.scaleProjected,
               0,
               Math.PI * 2
          );

          // Fill the circle in black
          ctx.fill();
     }
}

function createDots() {
     // Empty the array of dots
     dots.length = 0;

     // Create 800 dots
     for (let i = 0; i < DOTS_AMOUNT; i++) {
          dots.push(new Dot());
     }
}

function render() {
     // Clear the scene
     ctx.clearRect(0, 0, width, height);

     for (var i = 0; i < dots.length; i++) {
          dots[i].project();
     }

     // Sort dots array based on their projected size
     dots.sort((dot1, dot2) => {
          return dot1.sizeProjection - dot2.sizeProjection;
     });

     // Loop through the dots array and draw every dot
     for (let i = 0; i < dots.length; i++) {
          dots[i].draw();
     }

     // Request the browser to call render onces it's ready for a new frame
     window.requestAnimationFrame(render);
}

function afterResize() {
     width = canvas.offsetWidth;
     height = canvas.offsetHeight;
     if (window.devicePixelRatio > 1) {
          canvas.width = canvas.clientWidth * 2;
          canvas.height = canvas.clientHeight * 2;
          ctx.scale(2, 2);
     } else {
          canvas.width = width;
          canvas.height = height;
     }

     PROJECTION_CENTER_X = width / 2;
     PROJECTION_CENTER_Y = height / 2;
     PERSPECTIVE = width * 0.8;

     createDots();
}

let resizeTimeout;
// Function called right after user resized its screen
function onResize() {
     // Clear the timeout variable
     resizeTimeout = window.clearTimeout(resizeTimeout);

     // Store a new timeout to avoid calling afterResize for every resize event
     resizeTimeout = window.setTimeout(afterResize, 500);

     canvas.width = canvas.clientWidth;
     canvas.height = canvas.clientHeight;

     // If the screen device has a pixel ratio over 1
     if (window.devicePixelRatio > 1) {
          canvas.width = canvas.clientWidth * 2;
          canvas.height = canvas.clientHeight * 2;
          ctx.scale(2, 2);
     } else {
          canvas.width = width;
          canvas.height = height;
     }
}

// Listen to resize events
window.addEventListener("resize", onResize);
onResize();

// Populate the dots array with random dots
createDots();

// Render the scene
window.requestAnimationFrame(render);
