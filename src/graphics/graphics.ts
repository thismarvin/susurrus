import * as WebGL from "./webGL.js";
import * as PropertyAssent from "../utilities/propertyAssent.js";
import Color from "./color.js";
// eslint-disable-next-line no-unused-vars
import Effect from "./effect.js";
// eslint-disable-next-line no-unused-vars
import Buffer from "./buffer.js";
import VertexBuffer from "./vertexBuffer.js";
// eslint-disable-next-line no-unused-vars
import IndexBuffer from "./indexBuffer.js";

export default class Graphics {
	public readonly gl: WebGLRenderingContext;
	public readonly extensions: any;

	public get drawWidth() {
		return this.#drawWidth;
	}

	public get drawHeight() {
		return this.#drawHeight;
	}

	public get scale() {
		return this.#scale;
	}

	private get isLandscape() {
		return this.#drawWidth >= this.#drawHeight;
	}

	#currentProgram: WebGLProgram | null;

	#drawWidth: number;
	#drawHeight: number;
	#scale: number;

	constructor(gl: WebGLRenderingContext) {
		this.gl = gl;

		this.extensions = {
			ANGLE_instanced_arrays: this.gl.getExtension("ANGLE_instanced_arrays"),
		};

		this.#currentProgram = null;

		this.#drawWidth = -1;
		this.#drawHeight = -1;
		this.#scale = -1;

		WebGL.enablePremultipliedAlpha(this.gl);

		Object.defineProperty(this, "gl", {
			writable: false,
		});
		Object.defineProperty(this, "extensions", {
			writable: false,
		});
	}

	public setCanvasDimensions(width: number, height: number) {
		PropertyAssent.expectType(width, "number");
		PropertyAssent.expectType(height, "number");

		this.gl.canvas.width = width;
		this.gl.canvas.height = height;
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

		// I do not trust that people will read the README, so if the resolution has not been set
		// yet then just set the resolution to the canvas' dimensions.
		if (this.#drawWidth < 0) {
			this.setResolution(width, height);
		}
	}

	public setResolution(width: number, height: number) {
		PropertyAssent.expectType(width, "number");
		PropertyAssent.expectType(height, "number");

		this.#drawWidth = Math.max(0, width);
		this.#drawHeight = Math.max(0, height);

		if (this.isLandscape) {
			this.#scale = this.gl.canvas.height / this.#drawHeight;
			// Check if pillar boxing is required.
			if (this.#drawWidth * this.#scale > this.gl.canvas.width) {
				this.#scale = this.gl.canvas.width / this.#drawWidth;
			}
		} else {
			this.#scale = this.gl.canvas.width / this.#drawWidth;
			// Check if letter boxing is required.
			if (this.#drawHeight * this.#scale > this.gl.canvas.height) {
				this.#scale = this.gl.canvas.width / this.#drawWidth;
			}
		}
	}

	public clear(color: any) {
		PropertyAssent.expectInstance(color, Color);

		WebGL.clear(this.gl, color.r, color.g, color.b, color.a);
	}

	public begin(effect: Effect) {
		this.#currentProgram = effect.program;
		this.gl.useProgram(this.#currentProgram);
	}

	public setVertexBuffer(buffer: VertexBuffer) {
		if (this.#currentProgram === null) {
			throw new Error(
				"'begin(effect)' must be called before setting a VertexBuffer."
			);
		}

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.buffer);

		for (let element of buffer.attributeSchema.elements) {
			const index = this.gl.getAttribLocation(
				this.#currentProgram,
				element.name
			);

			if (index < 0) {
				throw new Error(
					`The current program does not have a(n) '${element.name}' attribute.`
				);
			}

			this.gl.enableVertexAttribArray(index);
			this.gl.vertexAttribPointer(
				index,
				element.size,
				element.type,
				false,
				element.stride,
				element.offset
			);

			if (buffer.instanceFrequency > 0) {
				this.extensions["ANGLE_instanced_arrays"].vertexAttribDivisorANGLE(
					index,
					buffer.instanceFrequency
				);
			}
		}
	}

	public setVertexBuffers(buffers: VertexBuffer[]) {
		for (let buffer of buffers) {
			this.setVertexBuffer(buffer);
		}
	}

	public setIndexBuffer(buffer: IndexBuffer) {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer.buffer);
	}

	// ! This literally only works for setting the wvp matrix... 😞
	// TODO: implement like a giant switch for all possible uniforms???
	public setUniform(uniform: string, value: any) {
		if (this.#currentProgram === null) {
			throw new Error(
				"'begin(effect)' must be called before setting a uniform."
			);
		}

		const location = this.gl.getUniformLocation(this.#currentProgram, uniform);
		this.gl.uniformMatrix4fv(location, false, value);
	}

	public drawArrays(mode: number, offset: number, primitiveCount: number) {
		this.gl.drawArrays(mode, offset, primitiveCount);
	}

	public drawElements(mode: number, totalTriangles: number, offset: number) {
		this.gl.drawElements(
			mode,
			totalTriangles * 3,
			this.gl.UNSIGNED_SHORT,
			offset
		);
	}

	public drawInstancedElements(
		mode: number,
		totalTriangles: number,
		offset: number,
		primitiveCount: number
	) {
		this.extensions["ANGLE_instanced_arrays"].drawElementsInstancedANGLE(
			mode,
			totalTriangles * 3,
			this.gl.UNSIGNED_SHORT,
			offset,
			primitiveCount
		);
	}

	public deleteBuffer(buffer: Buffer) {
		if (this.#currentProgram === null) {
			throw new Error(
				"'begin(effect)' must be called before deleting a Buffer."
			);
		}

		if (
			PropertyAssent.expectInstance(buffer, VertexBuffer, {
				throwError: false,
			})
		) {
			const bufferVertexBuffer = buffer as VertexBuffer;

			for (let element of bufferVertexBuffer.attributeSchema.elements) {
				const index = this.gl.getAttribLocation(
					this.#currentProgram,
					element.name
				);

				if (index < 0) {
					throw new Error(
						`The current program does not have a(n) '${element.name}' attribute.`
					);
				}

				this.gl.disableVertexAttribArray(index);
			}
		}

		this.gl.deleteBuffer(buffer.buffer);
	}

	public end() {
		this.#currentProgram = null;
	}
}
