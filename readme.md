This project is copied from
https://www.basedesign.com/blog/how-to-render-3d-in-2d-canvas

To create a glob out of particles, we need to calculate their coordinates on its surface.
The coordinates of a point along a sphere doesn't use the class Cartesian Coordinates (x,y,z)
but three different values from the Polar Coordinate System:

Radius: The radius of the sphere
Theta: The polar angle (between 0 and 360 degrees)
Phi: The azimuth angle (between -90 and 90 degrees)
