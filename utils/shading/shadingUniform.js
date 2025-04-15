import { TextureLoader } from 'three';

//#region Uniform Types
var UniformType;
(function (UniformType) {
    UniformType[UniformType["INT"] = 0] = "INT";
    UniformType[UniformType["FLOAT"] = 1] = "FLOAT";
    UniformType[UniformType["VEC2"] = 2] = "VEC2";
    UniformType[UniformType["VEC3"] = 3] = "VEC3";
    UniformType[UniformType["VEC4"] = 4] = "VEC4";
    UniformType[UniformType["COLOR"] = 5] = "COLOR";
    UniformType[UniformType["TEXTURE"] = 6] = "TEXTURE";
    UniformType[UniformType["CUBE_TEXTURE"] = 7] = "CUBE_TEXTURE";
})(UniformType || (UniformType = {}));
//#endregion
//#region ShadingUniform
class ShadingUniform {
    name;
    type;
    value;
    constructor(name, type, value) {
        this.name = name;
        this.type = type;
        this.value = value;
    }
    getName() {
        return this.name;
    }
    getType() {
        return this.type;
    }
}
//#endregion
//#region FloatUniform
class FloatUniform extends ShadingUniform {
    constructor(name, value) {
        super(name, UniformType.FLOAT, value);
    }
}
class Vec3Uniform extends ShadingUniform {
    constructor(name, value) {
        super(name, UniformType.VEC3, value);
    }
}
class ColorUniform extends ShadingUniform {
    constructor(name, value) {
        super(name, UniformType.COLOR, value);
    }
}
class TextureUniform extends ShadingUniform {
    dataURL;
    constructor(name, dataURL) {
        super(name, UniformType.TEXTURE, new TextureLoader().load(dataURL));
        this.dataURL = dataURL;
    }
    update() {
        this.value = new TextureLoader().load(this.dataURL);
    }
}
//#endregion

export { ColorUniform, FloatUniform, ShadingUniform, TextureUniform, UniformType, Vec3Uniform };
