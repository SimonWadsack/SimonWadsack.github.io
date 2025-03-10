import { Vector3, Color } from 'three';
import { TextElement } from '../../lacery/elements/textElement.js';
import { ColorElement } from '../../lacery/elements/colorElement.js';
import { Vec3Element } from '../../lacery/elements/vec3Element.js';
import { EventBus } from '../../core/events.js';

class BezierCurveInspectorParams {
    name;
    position;
    color;
    constructor() {
        this.name = "";
        this.position = new Vector3(0, 0, 0);
        this.color = new Color(0x000000);
    }
}
class BezierCurveInspector {
    lace;
    group;
    params;
    currentObject;
    constructor(lace) {
        this.lace = lace;
        this.params = new BezierCurveInspectorParams();
        this.currentObject = null;
        this.group = this.lace.addGroup();
        this.group.add(new TextElement("Name", this.params, 'name'));
        this.group.add(new Vec3Element("Position", this.params.position, 'x', 'y', 'z'));
        this.group.add(new ColorElement("Color", this.params, 'color'));
        this.group.onChange(() => this.inspectorChanged());
        this.lace.hide(this.group);
    }
    select(object) {
        this.lace.hideAll();
        const position = object.getPosition();
        const color = object.getColor();
        if (!position || !color) {
            console.error("BezierCurveInspector:select failed");
            return;
        }
        this.currentObject = object;
        this.params.name = object.getName();
        this.params.position.set(position.x, position.y, position.z);
        this.params.color.set(color);
        this.group.update();
        this.lace.show(this.group);
    }
    objectChanged() {
        if (!this.currentObject)
            return;
        const position = this.currentObject.getPosition();
        const color = this.currentObject.getColor();
        if (!position || !color) {
            console.error("BezierCurveInspector:update failed");
            return;
        }
        this.params.name = this.currentObject.getName();
        this.params.position.set(position.x, position.y, position.z);
        this.params.color.set(color);
        this.group.update();
    }
    inspectorChanged() {
        if (!this.currentObject)
            return;
        this.currentObject.setName(this.params.name);
        this.currentObject.setPosition(this.params.position);
        this.currentObject.updateColor(this.params.color);
        EventBus.notify('objectChanged');
    }
}

export { BezierCurveInspector };
