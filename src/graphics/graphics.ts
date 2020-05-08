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

	#currentProgram: WebGLProgram | null;

	constructor(gl: WebGLRenderingContext) {
		this.gl = gl;

		this.extensions = {
			ANGLE_instanced_arrays: this.gl.getExtension("ANGLE_instanced_arrays"),
		};

		this.#currentProgram = null;

		WebGL.enablePremultipliedAlpha(this.gl);

		Object.defineProperty(this, "gl", {
			writable: false,
		});
		Object.defineProperty(this, "extensions", {
			writable: false,
		});
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
