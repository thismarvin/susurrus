# susurrus

a simple lightweight javascript library intended to help create highly performant visualizations for the web.

...

Well that’s the plan at least.

In reality, Susurrus is essentially a blank slate that will be etched as I learn WebGL. Moving forward Susurrus will take inspiration from much cooler libraries (e.g. MonoGame, p5.js, three.js) and design principles from morro (another open-source project I am working on).

## Usage

// TODO: write a paragraph or something too

```javascript
import * as Susurrus from "./dist/susurrus.esm.min.js";

class Sketch extends Susurrus.Sketch {
  constructor() {
    super("//TODO: replace with a valid id");
  }

  initialize() {
    this.graphics.setCanvasDimensions(400, 400);
    this.graphics.setSketchResolution(4, 4);

    this.camera = new Susurrus.Camera(
      this.canvas.width / this.graphics.scale,
      this.canvas.height / this.graphics.scale
    );

    this.basicEffect = new Susurrus.BasicEffect(this.graphics);

    this.triangleData = new Susurrus.PolygonData(
      this.graphics,
      [0, 0, 0, 0, 1, 0, 1, 1, 0],
      [0, 1, 2]
    );

    this.triangle = new Susurrus.Polygon(this.graphics, this.triangleData);
    this.triangle.color = new Susurrus.Color(0xffffff);
    this.triangle.scale = new Susurrus.Vector3(1, 1, 1);
    this.triangle.applyChanges();
  }

  update(deltaTime) {
    this.triangle.rotation += 0.5 * deltaTime;
    this.triangle.applyChanges();
  }

  draw() {
    this.graphics.clear(Susurrus.Colors.SkyBlue);

    this.triangle.draw(this.graphics, this.basicEffect, this.camera);
  }
}

const sketch = new Sketch();
sketch.run();
```
