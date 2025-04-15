import { LaceElement } from '../LaceElement.js';

class TextureElement extends LaceElement {
    obj;
    key;
    img;
    name;
    size;
    constructor(label, obj, key, options = {}) {
        const { size = 80 } = options;
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexDirection = 'row';
        div.style.alignItems = 'flex-start';
        div.style.justifyContent = 'space-between';
        const labelElement = document.createElement('label');
        labelElement.innerHTML = label;
        const imageContainer = document.createElement('div');
        imageContainer.style.position = 'relative';
        imageContainer.style.cursor = 'pointer';
        const img = document.createElement('img');
        img.style.width = size + 'px';
        img.style.height = size + 'px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '3px';
        img.style.border = '1px solid var(--sl-color-neutral-300)';
        img.style.transition = 'filter 0.1s ease';
        imageContainer.appendChild(img);
        const uploadIcon = document.createElement('sl-icon');
        uploadIcon.name = 'arrow-up-from-line';
        uploadIcon.library = 'lucide';
        uploadIcon.style.position = 'absolute';
        uploadIcon.style.top = '50%';
        uploadIcon.style.left = '50%';
        uploadIcon.style.transform = 'translate(-50%, -50%)';
        uploadIcon.style.color = 'white';
        uploadIcon.style.opacity = '0';
        uploadIcon.style.transition = 'opacity 0.1s ease';
        imageContainer.appendChild(uploadIcon);
        div.appendChild(labelElement);
        div.appendChild(imageContainer);
        super(label, div);
        this.obj = obj;
        this.key = key;
        this.img = img;
        this.name = label;
        this.size = size;
        imageContainer.onclick = this.uploadImage.bind(this);
        imageContainer.onmouseover = () => {
            this.img.style.filter = 'brightness(50%)';
            uploadIcon.style.opacity = '1';
        };
        imageContainer.onmouseout = () => {
            this.img.style.filter = 'none';
            uploadIcon.style.opacity = '0';
        };
        this.update();
    }
    getObj() {
        return this.obj;
    }
    getKeys() {
        return [this.key];
    }
    update() {
        const dataURL = this.obj[this.key];
        this.img.src = this.isValidDataURL(dataURL) ? dataURL : `https://placehold.co/${this.size}?text=${this.name}&font=roboto`;
    }
    setSize(size) { }
    uploadImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.png, .jpg, .jpeg';
        input.onchange = (event) => {
            try {
                const target = event.target;
                const file = target.files?.item(0);
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.obj[this.key] = reader.result;
                        this.update();
                        this.changed();
                    };
                    reader.readAsDataURL(file);
                }
            }
            catch (e) {
                console.warn("Error while loading image file: ", e);
            }
        };
        input.click();
    }
    isValidDataURL(dataURL) {
        const pattern = /^data:image\/(png|jpg|jpeg);base64,[A-Za-z0-9+/]+={0,2}$/;
        return pattern.test(dataURL);
    }
}

export { TextureElement };
