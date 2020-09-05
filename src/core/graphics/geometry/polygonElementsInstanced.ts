import * as AttributeSchemas from "./attributeSchemas.js";
import BatchExecution from "../batchExecution.js";
import PolygonGroup from "./polygonGroup.js";
// eslint-disable-next-line no-unused-vars
import GeometryData from "./geometryData.js";
// eslint-disable-next-line no-unused-vars
import Polygon from "./polygon.js";
// eslint-disable-next-line no-unused-vars
import PolygonEffect from "./polygonEffect.js";
// eslint-disable-next-line no-unused-vars
import Camera from "../../camera.js";
import * as Graphics from "../../../lib/graphics.js";

export default class PolygonElementsInstanced extends PolygonGroup {
	#sharedGeometry: GeometryData;

	#transforms: number[];
	#colors: number[];

	#count: number;
	#dataModified: boolean;

	#transformBuffer: Graphics.VertexBuffer | null;
	#colorBuffer: Graphics.VertexBuffer | null;

	constructor(
		graphics: Graphics.GraphicsManager,
		polygonEffect: PolygonEffect,
		batchSize: number,
		sharedGeometry: GeometryData
	) {
		super(
			graphics,
			polygonEffect,
			BatchExecution.DRAW_ELEMENTS_INSTANCED,
			batchSize
		);

		this.#sharedGeometry = sharedGeometry;

		this.#transforms = new Array(this.batchSize * this.transformSize).fill(0);
		this.#colors = new Array(this.batchSize * this.colorSize).fill(0);

		this.#count = 0;
		this.#dataModified = false;

		this.#transformBuffer = null;
		this.#colorBuffer = null;
	}

	public add(polygon: Polygon) {
		if (this.#count >= this.batchSize) return false;

		if (polygon.geometryData != this.#sharedGeometry) return false;

		const transform = this.calculateTransformData(polygon);
		const color = this.calculateColorData(polygon);

		const transformIndex = this.#count * transform.length;

		for (let i = 0; i < transform.length; i++) {
			this.#transforms[transformIndex + i] = transform[i];
		}

		const colorIndex = this.#count * color.length;

		for (let i = 0; i < color.length; i++) {
			this.#colors[colorIndex + i] = color[i];
		}

		this.#count++;

		this.#dataModified = true;

		return true;
	}

	public applyChanges() {
		if (!this.#dataModified) {
			return;
		}

		this.#transformBuffer = new Graphics.VertexBuffer(
			this.graphics,
			AttributeSchemas.TRANSFORM,
			this.#count * this.transformSize,
			Graphics.VertexUsage.DYNAMIC,
			1
		);
		this.#colorBuffer = new Graphics.VertexBuffer(
			this.graphics,
			AttributeSchemas.COLOR,
			this.#count * this.colorSize,
			Graphics.VertexUsage.DYNAMIC,
			1
		);

		this.#transformBuffer.setData(
			this.#transforms.slice(0, this.#count * this.transformSize)
		);
		this.#colorBuffer.setData(
			this.#colors.slice(0, this.#count * this.colorSize)
		);

		this.#dataModified = false;
	}

	public draw(camera: Camera) {
		if (this.#dataModified) {
			throw new Error(
				"The polygon group was modified, but applyChanges() was never called."
			);
		}

		if (this.#transformBuffer === null || this.#colorBuffer === null) {
			return;
		}

		this.graphics
			.begin(this.polygonEffect)
			.setVertexBuffer(
				this.#sharedGeometry.vertexBuffer,
				this.#transformBuffer,
				this.#colorBuffer
			)
			.setIndexBuffer(this.#sharedGeometry.indexBuffer)
			.setUniform("worldViewProjection", camera.wvp.data)
			.drawElementsInstanced(
				Graphics.DrawMode.TRIANGLES,
				this.#sharedGeometry.totalTriangles,
				0,
				this.#count
			)
			.end();
	}

	protected onDispose() {
		this.#transformBuffer?.dispose();
		this.#colorBuffer?.dispose();
	}
}
