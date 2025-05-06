import { Texture } from 'three';
import { App } from '../../core/app.js';

//#region Uniform Types
var UniformType;
(function (UniformType) {
    UniformType[UniformType["INT"] = 0] = "INT";
    UniformType[UniformType["FLOAT"] = 1] = "FLOAT";
    UniformType[UniformType["BOOL"] = 2] = "BOOL";
    UniformType[UniformType["VEC2"] = 3] = "VEC2";
    UniformType[UniformType["VEC3"] = 4] = "VEC3";
    UniformType[UniformType["VEC4"] = 5] = "VEC4";
    UniformType[UniformType["COLOR"] = 6] = "COLOR";
    UniformType[UniformType["TEXTURE"] = 7] = "TEXTURE";
    UniformType[UniformType["CUBE_TEXTURE"] = 8] = "CUBE_TEXTURE";
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
//#endregion
//#region BoolUniform
class BoolUniform extends ShadingUniform {
    constructor(name, value) {
        super(name, UniformType.BOOL, value);
    }
}
class TextureUniform extends ShadingUniform {
    blob;
    image;
    constructor(name, blob) {
        const texture = new Texture();
        super(name, UniformType.TEXTURE, texture);
        if (blob !== null) {
            this.image = new Image();
            this.image.src = URL.createObjectURL(blob);
            this.image.onload = () => {
                texture.image = this.image;
                texture.needsUpdate = true;
            };
        }
        else {
            this.image = null;
            this.value.image = App.getDefaultImage();
            texture.needsUpdate = true;
        }
        this.blob = blob;
    }
    update() {
        if (this.image !== null && this.image.src)
            URL.revokeObjectURL(this.image.src);
        this.value.dispose();
        const texture = new Texture();
        this.value = texture;
        if (this.blob !== null) {
            if (this.image === null)
                this.image = new Image();
            this.image.src = URL.createObjectURL(this.blob);
            this.image.onload = () => {
                this.value.image = this.image;
                this.value.needsUpdate = true;
            };
        }
        else {
            this.image = null;
            this.value.image = App.getDefaultImage();
            this.value.needsUpdate = true;
        }
    }
}
//#endregion

export { BoolUniform, FloatUniform, ShadingUniform, TextureUniform, UniformType };
