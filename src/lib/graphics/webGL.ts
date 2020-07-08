//#region Public
export function getWebGLContext(canvas: HTMLCanvasElement) {
	const gl = canvas.getContext("webgl");

	if (gl === null) {
		throw new Error("WebGL is not supported on this device.");
	}

	return gl;
}

export function createProgram(
	gl: WebGLRenderingContext,
	vertexShaderSource: string,
	fragmentShaderSource: string
) {
	const vertexShader = _createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	const fragmentShader = _createShader(
		gl,
		gl.FRAGMENT_SHADER,
		fragmentShaderSource
	);

	return _createProgram(gl, vertexShader, fragmentShader);
}

export function allocateVertexBuffer(
	gl: WebGLRenderingContext,
	size: number,
	usage: number
) {
	return _allocateBuffer(gl, gl.ARRAY_BUFFER, size, usage);
}

export function setVertexBufferData(
	gl: WebGLRenderingContext,
	buffer: WebGLBuffer,
	data: BufferSource
) {
	_setBufferData(gl, gl.ARRAY_BUFFER, buffer, data);
}

export function allocateIndexBuffer(gl: WebGLRenderingContext, size: number) {
	return _allocateBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, size, gl.STATIC_DRAW);
}

export function setIndexBufferData(
	gl: WebGLRenderingContext,
	buffer: WebGLBuffer,
	data: BufferSource
) {
	_setBufferData(gl, gl.ELEMENT_ARRAY_BUFFER, buffer, data);
}

export async function loadImage(url: string) {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		try {
			const image = new Image();

			image.onload = () => {
				resolve(image);
			};

			image.src = url;
		} catch (error) {
			reject(error);
		}
	});
}

export function createTexture2D(
	gl: WebGLRenderingContext,
	width: number,
	height: number,
	pixels: Uint8Array
) {
	const texture = gl.createTexture();

	if (texture === null) {
		throw new Error("Something went wrong; could not create WebGLTexture.");
	}

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,
		gl.RGBA,
		width,
		height,
		0,
		gl.RGBA,
		gl.UNSIGNED_BYTE,
		pixels
	);

	if (_isPowerOfTwo(width) && _isPowerOfTwo(height)) {
		gl.generateMipmap(gl.TEXTURE_2D);
	} else {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	}

	return texture;
}

export function createTexture2DFromImage(
	gl: WebGLRenderingContext,
	image: HTMLImageElement
) {
	const texture = gl.createTexture();

	if (texture === null) {
		throw new Error("Something went wrong; could not create WebGLTexture.");
	}

	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

	if (_isPowerOfTwo(image.width) && _isPowerOfTwo(image.height)) {
		gl.generateMipmap(gl.TEXTURE_2D);
	} else {
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	}

	return texture;
}

export function enablePremultipliedAlpha(gl: WebGLRenderingContext) {
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
}

export function clear(
	gl: WebGLRenderingContext,
	r: number,
	g: number,
	b: number,
	a: number
) {
	gl.clearColor(r, g, b, a);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
//#endregion

//#region Private
function _allocateBuffer(
	gl: WebGLRenderingContext,
	target: number,
	size: number,
	usage: number
) {
	const buffer = gl.createBuffer();

	if (buffer === null) {
		throw new Error("Something went wrong; could not create WebGLBuffer.");
	}

	gl.bindBuffer(target, buffer);
	gl.bufferData(target, size, usage);

	return buffer;
}

function _setBufferData(
	gl: WebGLRenderingContext,
	target: number,
	buffer: WebGLBuffer,
	data: BufferSource
) {
	gl.bindBuffer(target, buffer);
	gl.bufferSubData(target, 0, data);
}

function _createShader(
	gl: WebGLRenderingContext,
	type: number,
	source: string
) {
	const shader = gl.createShader(type);

	if (shader === null) {
		throw new TypeError(`'${type}' is not a valid WebGL shader type.`);
	}

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		const error = new Error(
			`An error occurred will compiling the shader: ${gl.getShaderInfoLog(
				shader
			)}`
		);
		gl.deleteShader(shader);
		throw error;
	}

	return shader;
}

function _createProgram(
	gl: WebGLRenderingContext,
	vertexShader: WebGLShader,
	fragmentShader: WebGLShader
) {
	const program = gl.createProgram();

	if (program === null) {
		throw new Error("Something went wrong; could not create WebGLProgram.");
	}

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(
			`An error occurred while initializing the shader program: ${gl.getProgramInfoLog(
				program
			)}`
		);
	}

	return program;
}

function _isPowerOfTwo(value: number) {
	return (value & (value - 1)) === 0;
}
//#endregion
