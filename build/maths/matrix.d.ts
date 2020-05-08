import DynamicMatrix from "./dynamicMatrix.js";
import Vector3 from "./vector3.js";
export default class Matrix extends DynamicMatrix {
    constructor(data: number[]);
    static identity(): Matrix;
    static createRotationZ(angle: number): Matrix;
    static createTranslation(x: number, y: number, z: number): Matrix;
    static createOrthographic(width: number, height: number, near: number, far: number): Matrix;
    static createLookAt(cameraPosition: Vector3, cameraTarget: Vector3, cameraUp: Vector3): Matrix;
}
