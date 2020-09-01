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

export default class PolygonElements extends PolygonGroup {
	#sharedGeometry: GeometryData;

	#vertexPositions: number[];
	#transforms: number[];
	#colors: number[];

	#indices: number[];
	#indexBuffer: Graphics.IndexBuffer;

	#count: number;
	#totalPrimitives: number;

	#dataModified: boolean;

	#vertexPositionBuffer: Graphics.VertexBuffer | null;
	#transformBuffer: Graphics.VertexBuffer | null;
	#colorBuffer: Graphics.VertexBuffer | null;

	constructor(
		graphics: Graphics.GraphicsManager,
		polygonEffect: PolygonEffect,
		batchSize: number,
		sharedGeometry: GeometryData
	) {
		super(graphics, polygonEffect, BatchExecution.DRAW_ELEMENTS, batchSize);

		this.#sharedGeometry = sharedGeometry;

		const totalVertices = this.#sharedGeometry.mesh.totalVertices;
		const totalIndices = this.#sharedGeometry.mesh.totalIndices;

		this.#vertexPositions = new Array(this.batchSize * totalVertices * 3).fill(
			0
		);
		this.#transforms = new Array(this.batchSize * totalVertices * 12).fill(0);
		this.#colors = new Array(this.batchSize * totalVertices * 4).fill(0);

		this.#indices = new Array(this.batchSize * totalIndices).fill(0);
		for (let i = 0; i < this.batchSize; i++) {
			const start = totalIndices * i;
			const buffer = totalVertices * i;

			for (let j = 0; j < totalIndices; j++) {
				this.#indices[start + j] =
					buffer + this.#sharedGeometry.mesh.indices[j];
			}
		}

		this.#indexBuffer = new Graphics.IndexBuffer(
			this.graphics,
			this.#indices.length
		);
		this.#indexBuffer.setData(this.#indices);

		this.#count = 0;
		this.#totalPrimitives = 0;

		this.#dataModified = false;

		this.#vertexPositionBuffer = null;
		this.#transformBuffer = null;
		this.#colorBuffer = null;
	}

	public add(polygon: Polygon) {
		if (this.#count >= this.batchSize) return false;

		if (!(polygon.geometryData == this.#sharedGeometry)) return false;

		const transform = [
			polygon.width * polygon.scale.x,
			polygon.height * polygon.scale.y,
			polygon.scale.z,
			polygon.position.x + polygon.translation.x,
			polygon.position.y + polygon.translation.y,
			polygon.position.z + polygon.translation.z,
			polygon.origin.x,
			polygon.origin.y,
			polygon.origin.z,
			polygon.rotation.x,
			polygon.rotation.y,
			polygon.rotation.z,
		];
		const color = polygon.color.toArray();

		let vertexPositionIndex =
			this.#count * this.#sharedGeometry.mesh.vertices.length;

		for (let i = 0; i < this.#sharedGeometry.mesh.vertices.length; i++) {
			this.#vertexPositions[
				vertexPositionIndex + i
			] = this.#sharedGeometry.mesh.vertices[i];
		}

		let transformIndex =
			this.#count * transform.length * this.#sharedGeometry.totalVertices;

		for (let i = 0; i < this.#sharedGeometry.totalVertices; i++) {
			for (let j = 0; j < transform.length; j++) {
				this.#transforms[transformIndex + i * transform.length + j] =
					transform[j];
			}
		}

		let colorIndex =
			this.#count * color.length * this.#sharedGeometry.totalVertices;

		for (let i = 0; i < this.#sharedGeometry.totalVertices; i++) {
			for (let j = 0; j < color.length; j++) {
				this.#colors[colorIndex + i * color.length + j] = color[j];
			}
		}

		this.#dataModified = true;

		this.#count++;
		this.#totalPrimitives += this.#sharedGeometry.totalTriangles;

		return true;
	}

	public applyChanges() {
		if (!this.#dataModified) {
			return;
		}

		const vertexCount = this.#count * this.#sharedGeometry.totalVertices;

		this.#vertexPositionBuffer = new Graphics.VertexBuffer(
			this.graphics,
			new Graphics.AttributeSchema([
				new Graphics.AttributeElement(
					"a_vertexPosition",
					3,
					Graphics.AttributeType.FLOAT
				),
			]),
			vertexCount * 3,
			Graphics.VertexUsage.STATIC
		);
		this.#vertexPositionBuffer.setData(
			this.#vertexPositions.slice(0, vertexCount * 3)
		);

		console.log(this.#vertexPositions);
		console.log(this.#transforms);
		console.log(this.#colors);

		this.#transformBuffer = new Graphics.VertexBuffer(
			this.graphics,
			new Graphics.AttributeSchema([
				new Graphics.AttributeElement(
					"a_scale",
					3,
					Graphics.AttributeType.FLOAT
				),
				new Graphics.AttributeElement(
					"a_translation",
					3,
					Graphics.AttributeType.FLOAT
				),
				new Graphics.AttributeElement(
					"a_origin",
					3,
					Graphics.AttributeType.FLOAT
				),
				new Graphics.AttributeElement(
					"a_rotation",
					3,
					Graphics.AttributeType.FLOAT
				),
			]),
			vertexCount * 12,
			Graphics.VertexUsage.STATIC
		);
		this.#transformBuffer.setData(this.#transforms.slice(0, vertexCount * 12));

		this.#colorBuffer = new Graphics.VertexBuffer(
			this.graphics,
			new Graphics.AttributeSchema([
				new Graphics.AttributeElement(
					"a_color",
					3,
					Graphics.AttributeType.FLOAT
				),
			]),
			vertexCount * 4,
			Graphics.VertexUsage.STATIC
		);
		this.#colorBuffer.setData(this.#colors.slice(0, vertexCount * 4));

		this.#dataModified = false;
	}

	public draw(camera: Camera) {
		if (
			this.#vertexPositionBuffer === null ||
			this.#transformBuffer === null ||
			this.#colorBuffer === null
		) {
			return;
		}

		this.graphics
			.begin(this.polygonEffect)
			.setVertexBuffer(
				this.#vertexPositionBuffer,
				this.#transformBuffer,
				this.#colorBuffer
			)
			.setIndexBuffer(this.#indexBuffer)
			.setUniform("worldViewProjection", camera.wvp.data)
			.drawElements(Graphics.DrawMode.TRIANGLES, this.#totalPrimitives, 0)
			.end();
	}
}
