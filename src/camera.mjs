import Matrix from "./matrix.mjs";
import Vector3 from "./vector3.mjs";

export default class Camera {
    constructor() {
        this.world = Matrix.createTranslation(1, 0, 0);
        this.view = Matrix.createLookAt(new Vector3(0, 0, 1), new Vector3(0, 0, 0), new Vector3(0, 1, 0));
        this.projection = Matrix.createOrthographic(4, 4, 0, 16);                
        
        this.worldViewProjection = Matrix.multiply(Matrix.multiply(this.view, this.world), this.projection);;
    }
}