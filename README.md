# susurrus

a simple lightweight javascript library intended to help create highly performant visualizations for the web.

...

Well that’s the plan at least.

In reality, Susurrus is essentially a blank slate that will be etched as I learn WebGL. Moving forward Susurrus will take inspiration from much cooler libraries (e.g. MonoGame, p5.js, three.js) and design principles from morro (another open-source project I am working on).

## Usage

// TODO: write a paragraph or something too

```javascript
import * as Susurrus from "./dist/susurrus.min.js";

class Sketch extends Susurrus.Sketch {
  constructor() {
    super("//TODO: replace with a valid id");
  }

  initialize() {
    this.camera = new Susurrus.Camera();
    this.basicEffect = new Susurrus.BasicEffect(this.graphics);

    this.squareData = new Susurrus.PolygonData(
      this.graphics,
      [0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0],
      [0, 1, 2, 0, 2, 3]
    );

    this.square = new Susurrus.Polygon(this.graphics, this.squareData);
  }

  update() {}

  draw() {
    this.graphics.clear(Susurrus.Colors.SkyBlue);

    this.square.draw(this.graphics, this.basicEffect, this.camera);
  }
}

const sketch = new Sketch();
sketch.run();
```
