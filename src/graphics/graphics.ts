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
	}

	clear(color: any) {
		PropertyAssent.expectInstance(color, Color);

		WebGL.clear(this.gl, color.r, color.g, color.b, color.a);
	}

	begin(effect: Effect) {
		this.#currentProgram = effect.program;
		this.gl.useProgram(this.#currentProgram);
	}

	setVertexBuffer(buffer: VertexBuffer) {
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

	setVertexBuffers(buffers: VertexBuffer[]) {
		for (let buffer of buffers) {
			this.setVertexBuffer(buffer);
		}
	}

	setIndexBuffer(buffer: IndexBuffer) {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer.buffer);
	}

	// ! This literally only works for setting the wvp matrix... 😞
	// TODO: implement like a giant switch for all possible uniforms???
	setUniform(uniform: string, value: any) {
		if (this.#currentProgram === null) {
			throw new Error(
				"'begin(effect)' must be called before setting a uniform."
			);
		}

		const location = this.gl.getUniformLocation(this.#currentProgram, uniform);
		this.gl.uniformMatrix4fv(location, false, value);
	}

	drawArrays(mode: number, offset: number, primitiveCount: number) {
		this.gl.drawArrays(mode, offset, primitiveCount);
	}

	drawElements(mode: number, totalTriangles: number, offset: number) {
		this.gl.drawElements(
			mode,
			totalTriangles * 3,
			this.gl.UNSIGNED_SHORT,
			offset
		);
	}

	drawInstancedElements(
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

	deleteBuffer(buffer: Buffer) {
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

	end() {
		this.#currentProgram = null;
	}
}
