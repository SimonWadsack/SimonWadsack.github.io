import*as l from"three";import{Color as H,SphereGeometry as ue,MeshBasicMaterial as me,Mesh as ge,Vector3 as g,MathUtils as ze,Texture as ne,RepeatWrapping as oe,Vector2 as Gt,ShaderMaterial as ke,DoubleSide as We,UniformsLib as se,Curve as It,Vector4 as B,Raycaster as J,Plane as Y,EquirectangularReflectionMapping as Ae,NearestFilter as Fe,Group as Ge}from"three";import{OrbitControls as re,TransformControls as ae,LineGeometry as le,LineMaterial as Je,Line2 as Ke,EXRLoader as $e,EffectComposer as _e,RenderPass as Xe,OutputPass as Ye,OBJExporter as qe,STLExporter as Ze,GLTFExporter as Qe}from"three/examples/jsm/Addons.js";import{TextureElement as z,Vec2Element as Jt,ButtonSelectElement as pe,SliderElement as L,LaceElement as ti,TextElement as q,Vec3Element as R,ColorElement as N,LabelElement as T,BooleanElement as Kt,TextSelectElement as Lt,ButtonElement as ei,SeperatorElement as ii,Lace as ni}from"lacery";import{registerIconLibrary as oi}from"@shoelace-style/shoelace";class $t{data;width;height;texture;columnConnectionVisuals;rowConnectionVisuals;connectionParentMesh=null;connectionMaterial;constructor(t=4,e=4,i=1.25){this.width=t,this.height=e,this.data=new Float32Array(this.width*this.height*4),this.texture=new l.DataTexture(this.data,this.width,this.height,l.RGBAFormat,l.FloatType),this.texture.minFilter=this.texture.magFilter=l.NearestFilter,this.texture.generateMipmaps=!1,this.texture.needsUpdate=!0,this.connectionMaterial=new l.LineBasicMaterial({color:U(),depthTest:!1,transparent:!0}),this.columnConnectionVisuals=[];for(let n=0;n<this.width;n++){const o=new l.BufferGeometry().setFromPoints(this.getColumn(n)),a=new l.Line(o,this.connectionMaterial);a.renderOrder=1e3,a.castShadow=!0,this.columnConnectionVisuals.push(a)}this.rowConnectionVisuals=[];for(let n=0;n<this.height;n++){const o=new l.BufferGeometry().setFromPoints(this.getRow(n)),a=new l.Line(o,this.connectionMaterial);a.renderOrder=1e3,a.castShadow=!0,this.rowConnectionVisuals.push(a)}}getTexture(){return this.texture}getWidth(){return this.width}getHeight(){return this.height}toString(){let t=`DynamicVec3Grid: ${this.width}x${this.height}
`;for(let e=0;e<this.height;e++){for(let i=0;i<this.width;i++){const n=(e*this.width+i)*4;t+=`(${this.data[n].toFixed(2)}, ${this.data[n+1].toFixed(2)}, ${this.data[n+2].toFixed(2)}, ${this.data[n+3].toFixed(2)}) `}t+=`
`}return t}addVisuals(t){if(this.connectionParentMesh===null){this.connectionParentMesh=t;for(let e=0;e<this.width;e++)this.columnConnectionVisuals[e].visible=!1,t.add(this.columnConnectionVisuals[e]);for(let e=0;e<this.height;e++)this.rowConnectionVisuals[e].visible=!1,t.add(this.rowConnectionVisuals[e])}}showVisuals(){for(let t=0;t<this.width;t++)this.columnConnectionVisuals[t].visible=!0;for(let t=0;t<this.height;t++)this.rowConnectionVisuals[t].visible=!0}hideVisuals(){for(let t=0;t<this.width;t++)this.columnConnectionVisuals[t].visible=!1;for(let t=0;t<this.height;t++)this.rowConnectionVisuals[t].visible=!1}getPoint4(t,e){if(t<0||t>=this.height||e<0||e>=this.width)throw new Error("Index out of bounds");const i=(t*this.width+e)*4;return new l.Vector4(this.data[i],this.data[i+1],this.data[i+2],this.data[i+3])}getPoint(t,e){if(t<0||t>=this.height||e<0||e>=this.width)throw new Error("Index out of bounds");const i=(t*this.width+e)*4;return new l.Vector3(this.data[i],this.data[i+1],this.data[i+2])}getPoints4(){const t=[];for(let e=0;e<this.height;e++)for(let i=0;i<this.width;i++){const n=(e*this.width+i)*4;t.push(new l.Vector4(this.data[n],this.data[n+1],this.data[n+2],this.data[n+3]))}return t}getPoints(){const t=[];for(let e=0;e<this.height;e++)for(let i=0;i<this.width;i++){const n=(e*this.width+i)*4;t.push(new l.Vector3(this.data[n],this.data[n+1],this.data[n+2]))}return t}setPoint4(t,e,i){if(t<0||t>=this.height||e<0||e>=this.width)throw new Error("Index out of bounds");const n=(t*this.width+e)*4;this.data[n]=i.x,this.data[n+1]=i.y,this.data[n+2]=i.z,this.data[n+3]=i.w,this.texture.needsUpdate=!0;const o=new l.BufferGeometry().setFromPoints(this.getColumn(e));this.columnConnectionVisuals[e].geometry.dispose(),this.columnConnectionVisuals[e].geometry=o;const a=new l.BufferGeometry().setFromPoints(this.getRow(t));this.rowConnectionVisuals[t].geometry.dispose(),this.rowConnectionVisuals[t].geometry=a}setPoint(t,e,i){this.setPoint4(t,e,new l.Vector4(i.x,i.y,i.z,1))}getColumn4(t){if(t<0||t>=this.width)throw new Error("Index out of bounds");const e=[];for(let i=0;i<this.height;i++){const n=(i*this.width+t)*4;e.push(new l.Vector4(this.data[n],this.data[n+1],this.data[n+2],this.data[n+3]))}return e}getColumn(t){if(t<0||t>=this.width)throw new Error("Index out of bounds");const e=[];for(let i=0;i<this.height;i++){const n=(i*this.width+t)*4;e.push(new l.Vector3(this.data[n],this.data[n+1],this.data[n+2]))}return e}getRow4(t){if(t<0||t>=this.height)throw new Error("Index out of bounds");const e=[];for(let i=0;i<this.width;i++){const n=(t*this.width+i)*4;e.push(new l.Vector4(this.data[n],this.data[n+1],this.data[n+2],this.data[n+3]))}return e}getRow(t){if(t<0||t>=this.height)throw new Error("Index out of bounds");const e=[];for(let i=0;i<this.width;i++){const n=(t*this.width+i)*4;e.push(new l.Vector3(this.data[n],this.data[n+1],this.data[n+2]))}return e}addColumn(t,e=!1){this.resizeBuffer(this.width+1,this.height),e&&this.shiftColumnRight();const i=e?0:this.width-1,n=e?1:this.width-2,o=new l.BufferGeometry().setFromPoints(this.getColumn(i)),a=new l.Line(o,this.connectionMaterial);a.renderOrder=1e3,a.castShadow=!0,e?this.columnConnectionVisuals.unshift(a):this.columnConnectionVisuals.push(a),this.connectionParentMesh?.add(this.columnConnectionVisuals[i]);const h=this.getColumn(n);for(let c=0;c<this.height;c++){const d=h[c].clone().sub(t);this.setPoint(c,i,d)}}removeColumn(t=!1){if(!(this.width<=2)){t&&this.shiftColumnLeft(),this.resizeBuffer(this.width-1,this.height),t?(this.connectionParentMesh?.remove(this.columnConnectionVisuals[0]),this.columnConnectionVisuals.shift()):(this.connectionParentMesh?.remove(this.columnConnectionVisuals[this.width]),this.columnConnectionVisuals.pop());for(let e=0;e<this.height;e++){const i=new l.BufferGeometry().setFromPoints(this.getRow(e));this.rowConnectionVisuals[e].geometry.dispose(),this.rowConnectionVisuals[e].geometry=i}}}addRow(t,e=!1){this.resizeBuffer(this.width,this.height+1),e&&this.shiftRowDown();const i=e?0:this.height-1,n=e?1:this.height-2,o=new l.BufferGeometry().setFromPoints(this.getRow(i)),a=new l.Line(o,this.connectionMaterial);a.renderOrder=1e3,a.castShadow=!0,e?this.rowConnectionVisuals.unshift(a):this.rowConnectionVisuals.push(a),this.connectionParentMesh?.add(this.rowConnectionVisuals[i]);const h=this.getRow(n);for(let c=0;c<this.width;c++){const d=h[c].clone().sub(t);this.setPoint(i,c,d)}}removeRow(t=!1){if(!(this.height<=2)){t&&this.shiftRowUp(),this.resizeBuffer(this.width,this.height-1),t?(this.connectionParentMesh?.remove(this.rowConnectionVisuals[0]),this.rowConnectionVisuals.shift()):(this.connectionParentMesh?.remove(this.rowConnectionVisuals[this.height]),this.rowConnectionVisuals.pop());for(let e=0;e<this.width;e++){const i=new l.BufferGeometry().setFromPoints(this.getColumn(e));this.columnConnectionVisuals[e].geometry.dispose(),this.columnConnectionVisuals[e].geometry=i}}}shiftColumnRight(){for(let t=0;t<this.height;t++)for(let e=this.width-1;e>0;e--){const i=(t*this.width+e)*4,n=(t*this.width+(e-1))*4;this.data.set(this.data.slice(n,n+4),i)}}shiftColumnLeft(){for(let t=0;t<this.height;t++)for(let e=0;e<this.width-1;e++){const i=(t*this.width+e)*4,n=(t*this.width+(e+1))*4;this.data.set(this.data.slice(n,n+4),i)}}shiftRowDown(){for(let t=this.height-1;t>0;t--)for(let e=0;e<this.width;e++){const i=(t*this.width+e)*4,n=((t-1)*this.width+e)*4;this.data.set(this.data.slice(n,n+4),i)}}shiftRowUp(){for(let t=0;t<this.height-1;t++)for(let e=0;e<this.width;e++){const i=(t*this.width+e)*4,n=((t+1)*this.width+e)*4;this.data.set(this.data.slice(n,n+4),i)}}resizeBuffer(t,e){const i=new Float32Array(t*e*4);for(let n=0;n<this.height&&!(n>=e);n++)for(let o=0;o<this.width&&!(o>=t);o++){const a=(n*this.width+o)*4,h=(n*t+o)*4;i.set(this.data.slice(a,a+4),h)}this.width=t,this.height=e,this.data=i,this.texture.dispose(),this.texture=new l.DataTexture(this.data,t,e,l.RGBAFormat,l.FloatType),this.texture.minFilter=this.texture.magFilter=l.NearestFilter,this.texture.generateMipmaps=!1,this.texture.needsUpdate=!0}}const C={allEvents:new Map,generalEvents:new Map,viewportEvents:new Map,inspectorEvents:new Map,hierarchyEvents:new Map,subscribe(s,t,e){let i;switch(t){case"all":i=this.allEvents;break;case"general":i=this.generalEvents;break;case"viewport":i=this.viewportEvents;break;case"inspector":i=this.inspectorEvents;break;case"hierarchy":i=this.hierarchyEvents;break}i.has(s)||i.set(s,[]),i.get(s).push(e)},unsubscribe(s,t,e){let i;switch(t){case"all":i=this.allEvents;break;case"general":i=this.generalEvents;break;case"viewport":i=this.viewportEvents;break;case"inspector":i=this.inspectorEvents;break;case"hierarchy":i=this.hierarchyEvents;break}if(i.has(s)){const n=i.get(s).indexOf(e);n!==-1&&i.get(s).splice(n,1)}},notify(s,t,e){let i;switch(t){case"all":{for(const n of[this.allEvents,this.generalEvents,this.viewportEvents,this.inspectorEvents,this.hierarchyEvents])if(n.has(s))for(const o of n.get(s))o(e);return}case"general":i=this.generalEvents;break;case"viewport":i=this.viewportEvents;break;case"inspector":i=this.inspectorEvents;break;case"hierarchy":i=this.hierarchyEvents;break}if(i.has(s))for(const n of i.get(s))n(e);if(this.allEvents.has(s))for(const n of this.allEvents.get(s))n(e)}};var P=(s=>(s.ALL="all",s.GENERAL="general",s.VIEWPORT="viewport",s.INSPECTOR="inspector",s.HIERARCHY="hierarchy",s))(P||{});class r{static app;static scene;static pCamera;static oCamera;static renderer;static effectComposer;static orbitControls;static oOrbitControls;static transformControls;static oTransformControls;static ambientLight;static directionalLight;static grid;static plane;static tooltip;static objectManager;static creationManager;static selectionManager;static editManager;static effectManager;static ioManager;static interactionsManager;static exportManager;static inspector;static hierarchy;static toolbar;static controls;static sceneProxy;static isOrbitingBool=!1;static isDraggingBool=!1;static is2D=!1;static isDarkMode=!1;static dimension2D(){return this.is2D}static switchDimension(){this.is2D?(this.is2D=!1,this.oTransformControls.detach(),this.orbitControls.enabled=!0,this.oOrbitControls.enabled=!1,this.directionalLight.position.set(10,25,0),this.directionalLight.target.position.set(0,0,0)):(this.is2D=!0,this.transformControls.detach(),this.orbitControls.enabled=!1,this.oOrbitControls.enabled=!0,this.directionalLight.position.set(0,100,0),this.directionalLight.target.position.set(0,0,0)),r.getEffectManager().setupRenderPass(),r.getSelectionManager().doResetSelectedEditHandle(),C.notify("dimensionSwitched",P.ALL,this.is2D)}static darkMode(){return this.isDarkMode}static setMode(t=!1){t?(this.isDarkMode=!0,this.app.classList.add("sl-theme-dark")):(this.isDarkMode=!1,this.app.classList.remove("sl-theme-dark")),r.getScene().background=new H(Ft()),r.getIOManager().setFlagCache("darkMode",this.isDarkMode),C.notify("modeSwitched",P.ALL,this.isDarkMode)}static getApp(){return this.app}static setApp(t){this.app=t}static getScene(){return this.scene}static getCamera(){return this.is2D?this.oCamera:this.pCamera}static getPerspectiveCamera(){return this.is2D?null:this.pCamera}static getRenderer(){return this.renderer}static getOrbitControls(){return this.is2D?this.oOrbitControls:this.orbitControls}static onOrbitControlsChange(t){this.orbitControls.addEventListener("change",()=>{this.is2D||t()}),this.oOrbitControls.addEventListener("change",()=>{this.is2D&&t()})}static onTransformControlsChange(t){this.transformControls.addEventListener("change",()=>{this.is2D||t()}),this.oTransformControls.addEventListener("change",()=>{this.is2D&&t()})}static onControlsChange(t){this.onOrbitControlsChange(t),this.onTransformControlsChange(t),C.subscribe("dimensionSwitched",P.ALL,()=>{t()})}static noScroll(){this.orbitControls.enableZoom=!1,this.oOrbitControls.enableZoom=!1}static scroll(){this.orbitControls.enableZoom=!0,this.oOrbitControls.enableZoom=!0}static getTransformControls(){return this.is2D?this.oTransformControls:this.transformControls}static getAmbientLight(){return this.ambientLight}static getDirectionalLight(){return this.directionalLight}static setupScene(t,e,i,n,o,a,h,c,d,m){this.scene=t,this.pCamera=e,this.oCamera=i,this.renderer=n,this.orbitControls=o,this.orbitControls.addEventListener("start",()=>this.isOrbitingBool=!0),this.orbitControls.addEventListener("end",()=>this.isOrbitingBool=!1),this.oOrbitControls=a,this.oOrbitControls.addEventListener("start",()=>this.isOrbitingBool=!0),this.oOrbitControls.addEventListener("end",()=>this.isOrbitingBool=!1),this.transformControls=h,this.transformControls.addEventListener("dragging-changed",u=>{this.orbitControls.enabled=!u.value,this.isDraggingBool=u.value}),this.scene.add(this.transformControls.getHelper()),this.oTransformControls=c,this.oTransformControls.addEventListener("dragging-changed",u=>{this.oOrbitControls.enabled=!u.value,this.isDraggingBool=u.value}),this.scene.add(this.oTransformControls.getHelper()),this.ambientLight=d,this.directionalLight=m}static getEffectComposer(){return this.effectComposer}static setEffectComposer(t){this.effectComposer=t}static getGrid(){return this.grid}static getPlane(){return this.plane}static setupGrid(t,e){this.grid=t,this.plane=e}static getTooltip(){return this.tooltip}static setTooltip(t){this.tooltip=t}static getObjectManager(){return this.objectManager}static setObjectManager(t){this.objectManager=t}static getCreationManager(){return this.creationManager}static setCreationManager(t){this.creationManager=t}static getSelectionManager(){return this.selectionManager}static setSelectionManager(t){this.selectionManager=t}static getEditManager(){return this.editManager}static setEditManager(t){this.editManager=t}static getEffectManager(){return this.effectManager}static setEffectManager(t){this.effectManager=t}static getIOManager(){return this.ioManager}static setIOManager(t){this.ioManager=t}static getInteractionsManager(){return this.interactionsManager}static setInteractionsManager(t){this.interactionsManager=t}static getExportManager(){return this.exportManager}static setExportManager(t){this.exportManager=t}static getInspector(){return this.inspector}static setInspector(t){this.inspector=t}static getHierarchy(){return this.hierarchy}static setHierarchy(t){this.hierarchy=t}static getToolbar(){return this.toolbar}static setToolbar(t){this.toolbar=t}static getControls(){return this.controls}static setControls(t){this.controls=t}static getSceneProxy(){return this.sceneProxy}static setSceneProxy(t){this.sceneProxy=t}static isOrbiting(){return this.isOrbitingBool}static isDragging(){return this.isDraggingBool}static getDefaultImage(){const t=new Image;t.width=1,t.height=1;const e=document.createElement("canvas");e.width=1,e.height=1;const i=e.getContext("2d");return i&&(i.fillStyle="#FFFFFF",i.fillRect(0,0,1,1),t.src=e.toDataURL()),t}}const F=async(s,t)=>{const e=`textures/${s}/${t}`,i=await fetch(e);if(!i.ok)return null;const n=await i.blob();return n.size===0||n.type==="text/html"?null:n};class fe{parentObject;index;radius;mesh;material;constructor(t,e,i=.2){this.parentObject=t,this.index=e,this.radius=i;const n=new ue(this.radius);this.material=new me({color:Ot(),depthTest:!1,transparent:!0}),this.mesh=new ge(n,this.material),this.mesh.castShadow=!0,this.mesh.renderOrder=1001,this.adjustScale(),r.onControlsChange(this.adjustScale.bind(this)),C.subscribe("modeSwitched",P.ALL,()=>{this.material.color.set(Ot())})}getMesh(){return this.mesh}getParentObject(){return this.parentObject}getIndex(){return this.index}getPosition(){return this.mesh.position.clone()}getWorldPosition(){return this.mesh.getWorldPosition(new g)}setPosition(t){this.mesh.position.set(t.x,t.y,t.z)}highlight(){this.material.color.set(K())}resetHighlight(){this.material.color.set(Ot())}select(){this.material.color.set(U())}resetSelect(){this.material.color.set(Ot())}hide(){this.mesh.visible=!1}show(){this.mesh.visible=!0}getActive(){return this.mesh.visible}adjustScale(){if(r.dimension2D()){this.mesh.scale.set(1,1,1);return}const t=this.mesh.position.distanceTo(r.getCamera().position),i=Math.abs(t)/10,n=Math.max(1,Math.min(i,20));this.mesh.scale.set(n,n,n)}}class A{name;mesh;uuid;type;export;color=new H(0);editHandles;constructor(t,e,i=new g(0,0,0)){this.name=t,this.mesh=e,this.mesh.position.set(i.x,i.y,i.z),this.mesh.castShadow=!0,this.uuid=ze.generateUUID(),this.type="VisualObject",this.export=null,this.editHandles=new Map}getName(){return this.name}setName(t){this.name=t}getColor(){return this.color.clone()}setColor(t){this.color.set(t)}getUUID(){return this.uuid}getType(){return this.type}getExport(){return this.export}getMesh(){return this.mesh}getPosition(){const t=new g;return t.copy(this.mesh.position),t}setPosition(t){this.mesh.position.set(t.x,t.y,t.z)}move(t,e,i){var n=this.getPosition();n&&(n.x+=t,n.y+=e,n.z+=i,this.setPosition(n))}moveX(t){this.move(t,0,0)}moveY(t){this.move(0,t,0)}moveZ(t){this.move(0,0,t)}edit(){return console.warn("VisualObject: Edit not implemented!"),()=>{console.error("VisualObject: Edit not implemented!")}}createEditHandle(t,e=.2){const i=new fe(this,t,e);this.editHandles.set(t,i),r.getObjectManager().addEditHandle(i)}hasEditHandle(t){return this.editHandles.has(t)}setEditHandlePosition(t,e){if(!this.editHandles.has(t)){console.error("VisualObject:setEditHandlePosition: Edit handle not found!");return}const i=this.editHandles.get(t);i&&i.setPosition(e)}getEditHandlePosition(t){if(!this.editHandles.has(t))return console.error("VisualObject:getEditHandlePosition: Edit handle not found!"),null;const e=this.editHandles.get(t);return e?e.getPosition():null}removeEditHandle(t){if(!this.editHandles.has(t)){console.error("VisualObject:removeEditHandle: Edit handle not found!");return}const e=this.editHandles.get(t);e&&(r.getObjectManager().removeEditHandle(e),this.editHandles.delete(t))}removeEditHandles(){this.editHandles.forEach((t,e)=>{r.getObjectManager().removeEditHandle(t)}),this.editHandles.clear()}hideEditHandle(t){if(!this.editHandles.has(t)){console.error("VisualObject:hideEditHandle: Edit handle not found!");return}const e=this.editHandles.get(t);e&&e.hide()}showEditHandle(t){if(!this.editHandles.has(t)){console.error("VisualObject:showEditHandle: Edit handle not found!");return}const e=this.editHandles.get(t);e&&e.show()}hideEditHandles(){this.editHandles.forEach((t,e)=>{t.hide()})}showEditHandles(){this.editHandles.forEach((t,e)=>{t.show()})}unedit(){console.warn("VisualObject: Unedit not implemented!")}}function si(){return`
    uniform sampler2D controlPointsTexture;
    uniform int controlPointsWidth;
    uniform int controlPointsHeight;
    uniform vec3 color;

    varying vec3 vColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUV;
    varying vec3 vViewPosition;
    varying mat3 vTBN;
    varying vec3 vWorldNormal;

    float binomial(int n, int k){
        if(k > n) return 0.0;
        if(k == 0 || k == n) return 1.0;
        float res = 1.0;
        for(int i = 0; i < k; i++){
            res *= float(n - i) / float(i + 1);
        }
        return res;
    }

    float bernstein(int n, int i, float t){
        return binomial(n, i) * pow(t, float(i)) * pow(1.0 - t, float(n - i));
    }

    // Derivative of the Bernstein polynomial with respect to t
    float bernsteinDerivative(int n, int i, float t) {
        if (i == 0) return -float(n) * bernstein(n - 1, i, t);
        if (i == n) return float(n) * bernstein(n - 1, i - 1, t);
        return float(n) * (bernstein(n - 1, i - 1, t) - bernstein(n - 1, i, t));
    }

    vec3 getControlPoint(int i, int j){
        vec2 texCoord = vec2(float(i) / float(controlPointsWidth - 1), float(j) / float(controlPointsHeight - 1));
        return texture2D(controlPointsTexture, texCoord).xyz;
    }

    void main(){
        vec2 uvClamped = clamp(uv, 0.0001, 0.9999);
        float u = uvClamped.x;
        float v = uvClamped.y;

        vec3 bezierPoint = vec3(0.0);
        vec3 tangentU = vec3(0.0);
        vec3 tangentV = vec3(0.0);

        for(int i = 0; i < controlPointsWidth; i++){
            float bernsteinU = bernstein(controlPointsWidth - 1, i, u);
            float bernsteinUDerivative = bernsteinDerivative(controlPointsWidth - 1, i, u);
            for(int j = 0; j < controlPointsHeight; j++){
                vec3 controlPoint = getControlPoint(i, j);
                float bernsteinV = bernstein(controlPointsHeight - 1, j, v);
                float bernsteinVDerivative = bernsteinDerivative(controlPointsHeight - 1, j, v);
                bezierPoint += controlPoint * bernsteinU * bernsteinV;
                tangentU += controlPoint * bernsteinUDerivative * bernsteinV;
                tangentV += controlPoint * bernsteinU * bernsteinVDerivative;
            }
        }

        vColor = color;
        vec3 normal = normalize(cross(tangentU, tangentV));
        vNormal = - normalize(normalMatrix * normal);
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vPosition = (modelMatrix * vec4(bezierPoint, 1.0)).xyz;
        vUV = uvClamped;
        vec4 mvPosition = modelViewMatrix * vec4(bezierPoint, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;

        mat3 TBN = mat3(
            normalize(normalMatrix * tangentU),
            normalize(normalMatrix * tangentV),
            vNormal
        );
        
        vTBN = TBN;
    }
`}function G(s,t,e){if(s.length!==t*e)throw console.error("Invalid points array length:",s.length,"Expected:",t*e,t,e),new Error("Points array length must match width * height");const i=new l.BufferGeometry,n=[],o=[];for(const a of s)n.push(a.x,a.y,a.z);for(let a=0;a<e-1;a++)for(let h=0;h<t-1;h++){const c=a*t+h,d=c+1,m=c+t,u=m+1;o.push(c,m,d),o.push(d,m,u)}return i.setAttribute("position",new l.Float32BufferAttribute(n,3)),i.setIndex(o),i.computeVertexNormals(),i}const nt={};function ri(s,t){if(t===0||t===s)return 1;if(nt[s]&&nt[s][t])return nt[s][t];for(var e=1,i=1;i<=t;i++)e*=(s-i+1)/i;return nt[s]||(nt[s]={}),nt[s][t]=e,e}function be(s,t,e){return new l.Vector3(Rt(s.x,t.x,e),Rt(s.y,t.y,e),Rt(s.z,t.z,e))}function ai(s,t,e){return be(s.position,t.position,e)}function Rt(s,t,e){return s+(t-s)*e}function Pe(s,t,e,i,n){return i+(s-t)*(n-i)/(e-t)}function Wt(s,t,e){return(s<0||t<0||t>s)&&console.log("berstein: Invalid arguments for n or i: ",s,t),(e<0||e>1)&&console.log("berstein: Invalid arguments for t: ",e),ri(s,t)*Math.pow(e,t)*Math.pow(1-e,s-t)}function Dt(s,t,e){const i=[];for(let n=0;n<e;n++){const o=n/(e-1);for(let a=0;a<t;a++){const h=a/(t-1);i.push(li(s,h,o))}}return i}function li(s,t,e){const i=new g(0,0,0);for(let n=0;n<s.getWidth();n++){const o=Wt(s.getWidth()-1,n,t);for(let a=0;a<s.getHeight();a++){const h=s.getPoint(a,n),c=Wt(s.getHeight()-1,a,e);i.add(h.clone().multiplyScalar(o*c))}}return i}class Ce{uniforms;constructor(){this.uniforms=new Map}add(t){const e=this.uniforms.get(t.getName());if(e&&e.getType()===t.getType()){e.value=t.value;return}this.uniforms.set(t.getName(),t)}has(t){return this.uniforms.has(t)}get(t){return this.uniforms.get(t)}getAll(){return Array.from(this.uniforms.values())}mergeFrom(t){t.getAll().forEach(e=>{this.add(e)})}getTHREEUniforms(){const t={};return this.uniforms.forEach(e=>{t[e.getName()]={value:e.value}}),t}}class _t{uniforms;enviroment;updateCallback=void 0;constructor(){this.uniforms=new Ce,this.enviroment=!1}getUniforms(){return this.uniforms}setUpdateCallback(t){this.updateCallback=t}removeUpdateCallback(){this.updateCallback=void 0}}class Vt{name;type;value;constructor(t,e,i){this.name=t,this.type=e,this.value=i}getName(){return this.name}getType(){return this.type}}class ht extends Vt{constructor(t,e){super(t,1,e)}}class k extends Vt{constructor(t,e){super(t,2,e)}}class Xt extends Vt{constructor(t,e){super(t,3,e)}}class W extends Vt{blob;image;constructor(t,e){const i=new ne;i.wrapS=i.wrapT=oe,super(t,7,i),e!==null?(this.image=new Image,this.image.src=URL.createObjectURL(e),this.image.onload=()=>{i.image=this.image,i.needsUpdate=!0}):(this.image=null,this.value.image=r.getDefaultImage(),i.needsUpdate=!0),this.blob=e}update(){this.image!==null&&this.image.src&&URL.revokeObjectURL(this.image.src),this.value.dispose();const t=new ne;t.wrapS=t.wrapT=oe,this.value=t,this.blob!==null?(this.image===null&&(this.image=new Image),this.image.src=URL.createObjectURL(this.blob),this.image.onload=()=>{this.value.image=this.image,this.value.needsUpdate=!0}):(this.image=null,this.value.image=r.getDefaultImage(),this.value.needsUpdate=!0)}}class At extends _t{tiling;useMainTexture;mainTexture;mainElement;constructor(){super(),this.tiling=new Xt("tiling",new Gt(1,1)),this.useMainTexture=new k("useMainTexture",!1),this.mainTexture=new W("mainTexture",null),this.uniforms.add(this.tiling),this.uniforms.add(this.useMainTexture),this.uniforms.add(this.mainTexture);const t=new z("Texture",this.mainTexture,"blob");t.onChange(()=>{this.useMainTexture.value=t.hasTexture(),this.mainTexture.update()}),this.mainElement=t}getName(){return"Diffuse"}getFragmentShader(){return hi()}buildUI(t){const e=new Jt("Tiling",this.tiling.value,"x","y",{xStep:.1,yStep:.1});t.add(e.onChange(()=>{this.tiling.value.x<.1&&(this.tiling.value.x=.1),this.tiling.value.y<.1&&(this.tiling.value.y=.1),e.update()})),t.add(this.mainElement)}toJSON(){return{tiling:[this.tiling.value.x,this.tiling.value.y]}}fromJSON(t){this.tiling.value.x=t.tiling[0],this.tiling.value.y=t.tiling[1]}dispose(){this.mainTexture.blob=null,this.mainTexture.update(),this.mainElement.updateBlob()}}function hi(){return`
        uniform vec2 tiling;

        uniform bool useMainTexture;
        uniform sampler2D mainTexture;

        varying vec3 vColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUV;
        varying vec3 vViewPosition;
        varying mat3 vTBN;

        #include <common>
        #include <lights_pars_begin>
    
        void main(){
            // Get the tilied UV
            vec2 uv = vUV * tiling;

            // Get the base color
            vec3 color = useMainTexture ? texture2D(mainTexture, uv).rgb : vColor;

            // Calculate the normal
            vec3 normal = normalize(vNormal);

            // Calculate the light direction
            vec3 lightDir = directionalLights[0].direction;

            // Calculate the diffuse part
            float diff = max(dot(lightDir, normal), 0.0);

            // Calculate the components
            vec3 lightColor = directionalLights[0].color;
            vec3 ambient = ambientLightColor;
            vec3 diffuse = diff * lightColor;

            vec3 finalColor = (ambient + diffuse) * color;

            // Final output
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `}class ct extends _t{tiling;useMainTexture;mainTexture;useRoughnessMap;roughnessMap;shininess;useNormalMap;normalMap;normalStrength;useAOMap;aoMap;mainElement;roughnessElement;normalElement;aoElement;constructor(){super(),this.tiling=new Xt("tiling",new Gt(1,1)),this.useMainTexture=new k("useMainTexture",!1),this.mainTexture=new W("mainTexture",null),this.useRoughnessMap=new k("useRoughnessMap",!1),this.roughnessMap=new W("roughnessMap",null),this.shininess=new ht("shininess",.5),this.useNormalMap=new k("useNormalMap",!1),this.normalMap=new W("normalMap",null),this.normalStrength=new ht("normalStrength",1),this.useAOMap=new k("useAOMap",!1),this.aoMap=new W("aoMap",null),this.uniforms.add(this.tiling),this.uniforms.add(this.useMainTexture),this.uniforms.add(this.mainTexture),this.uniforms.add(this.roughnessMap),this.uniforms.add(this.useRoughnessMap),this.uniforms.add(this.shininess),this.uniforms.add(this.useNormalMap),this.uniforms.add(this.normalMap),this.uniforms.add(this.normalStrength),this.uniforms.add(this.useAOMap),this.uniforms.add(this.aoMap);const t=new z("Albedo",this.mainTexture,"blob");t.onChange(()=>{this.useMainTexture.value=t.hasTexture(),this.mainTexture.update()}),this.mainElement=t;const e=new z("Roughness",this.roughnessMap,"blob");e.onChange(()=>{this.useRoughnessMap.value=e.hasTexture(),this.roughnessMap.update()}),this.roughnessElement=e;const i=new z("Normal",this.normalMap,"blob");i.onChange(()=>{this.useNormalMap.value=i.hasTexture(),this.normalMap.update()}),this.normalElement=i;const n=new z("Ambient Occlusion",this.aoMap,"blob");n.onChange(()=>{this.useAOMap.value=n.hasTexture(),this.aoMap.update()}),this.aoElement=n}getName(){return"Blinn-Phong"}getFragmentShader(){return ci()}buildUI(t){t.add(new pe("Load a preset...",{rock:"Rock",mossyrock:"Mossy Rock",bark:"Bark",onyx:"Onyx"},this.presetSelect.bind(this),{previews:["textures/rock/albedo.jpg","textures/mossyrock/albedo.jpg","textures/bark/albedo.jpg","textures/onyx/albedo.jpg"],previewSize:64}));const e=new Jt("Tiling",this.tiling.value,"x","y",{xStep:.1,yStep:.1});t.add(e.onChange(()=>{this.tiling.value.x<.1&&(this.tiling.value.x=.1),this.tiling.value.y<.1&&(this.tiling.value.y=.1),e.update()})),t.add(this.mainElement),t.add(this.roughnessElement),t.add(new L("Shininess",this.shininess,"value",{min:.01,max:1,step:.01})),t.add(this.normalElement),t.add(new L("Normal Strength",this.normalStrength,"value",{min:0,max:1,step:.01})),t.add(this.aoElement)}toJSON(){return{tiling:[this.tiling.value.x,this.tiling.value.y],shininess:this.shininess.value,normalStrength:this.normalStrength.value}}fromJSON(t){this.tiling.value.x=t.tiling[0],this.tiling.value.y=t.tiling[1],this.shininess.value=t.shininess,this.normalStrength.value=t.normalStrength}dispose(){this.mainTexture.blob=null,this.mainTexture.update(),this.roughnessMap.blob=null,this.roughnessMap.update(),this.normalMap.blob=null,this.normalMap.update(),this.aoMap.blob=null,this.aoMap.update(),this.mainElement.updateBlob(),this.roughnessElement.updateBlob(),this.normalElement.updateBlob(),this.aoElement.updateBlob()}async presetSelect(t){const e={albedo:"albedo.jpg",ambientocclusion:"ao.jpg",normal:"normal.jpg",roughness:"roughness.jpg"};try{const[i,n,o,a]=await Promise.all([F(t,e.albedo),F(t,e.ambientocclusion),F(t,e.normal),F(t,e.roughness)]);this.mainTexture.blob=i,this.useMainTexture.value=!0,this.mainTexture.update(),this.roughnessMap.blob=a,this.useRoughnessMap.value=!0,this.roughnessMap.update(),this.normalMap.blob=o,this.useNormalMap.value=!0,this.normalMap.update(),this.aoMap.blob=n,this.useAOMap.value=!0,this.aoMap.update(),this.mainElement.updateBlob(),this.roughnessElement.updateBlob(),this.normalElement.updateBlob(),this.aoElement.updateBlob(),this.updateCallback?.()}catch(i){console.error("Error loading textures",i);return}}}function ci(){return`
        uniform vec2 tiling;

        uniform bool useMainTexture;
        uniform sampler2D mainTexture;
        
        uniform bool useRoughnessMap;
        uniform sampler2D roughnessMap;
        uniform float shininess;
        
        uniform bool useNormalMap;
        uniform sampler2D normalMap;
        uniform float normalStrength;

        uniform bool useAOMap;
        uniform sampler2D aoMap;

        varying vec3 vColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUV;
        varying vec3 vViewPosition;
        varying mat3 vTBN;
        varying vec3 vWorldNormal;

        #include <common>
        #include <lights_pars_begin>
    
        void main(){
            // Get the tilied UV
            vec2 uv = vUV * tiling;

            // Get the base color
            vec3 albedo = useMainTexture ? texture2D(mainTexture, uv).rgb : vColor;

            // Get the normal (one minus as a weird fix beacause the vertex shader flips the sides)
            vec3 normal = normalize(vNormal);
            if(useNormalMap){
                vec3 tangentNormal = texture2D(normalMap, uv).xyz * 2.0 - 1.0;
                float nrmStrength = normalStrength;
                vec3 worldNormal = normalize(vTBN * tangentNormal);
                normal = normalize(mix(normal, worldNormal, nrmStrength));
            }

            // Calculate the ambient occlusion
            float ao = useAOMap ? texture2D(aoMap, uv).r : 1.0;

            // Calculate the light direction
            vec3 lightDir = directionalLights[0].direction;

            // Calculate the view direction
            vec3 viewDir = normalize(vViewPosition);

            // Calculate the half vector
            vec3 halfDir = normalize(lightDir + viewDir);

            // Calculate the diffuse part
            float diff = max(dot(lightDir, normal), 0.0);

            // Calculate the specular part
            float spec = pow(max(dot(halfDir, normal), 0.0), 200.0 * shininess);

            // Calculate the roughness
            float roughness = useRoughnessMap ? texture2D(roughnessMap, uv).r : 0.0;
            spec *= (1.0 - roughness);

            // Calculate the Blinn-Phong components
            vec3 lightColor = directionalLights[0].color;
            vec3 ambient = ambientLightColor * ao;
            vec3 diffuse = diff * lightColor;
            vec3 specular = spec * lightColor;

            vec3 blinnPhong = (ambient + diffuse + specular) * albedo;

            // Final output
            gl_FragColor = vec4(blinnPhong, 1.0);
        }
    `}class he extends _t{tiling;useMainTexture;mainTexture;useRoughnessMap;roughnessMap;roughness;useNormalMap;normalMap;normalStrength;useMetallicMap;metallicMap;metallic;useAOMap;aoMap;mainElement;roughnessElement;metallicElement;normalElement;aoElement;constructor(){super(),this.enviroment=!0,this.tiling=new Xt("tiling",new Gt(1,1)),this.useMainTexture=new k("useMainTexture",!1),this.mainTexture=new W("mainTexture",null),this.useRoughnessMap=new k("useRoughnessMap",!1),this.roughnessMap=new W("roughnessMap",null),this.roughness=new ht("roughness",.5),this.useMetallicMap=new k("useMetallicMap",!1),this.metallicMap=new W("metallicMap",null),this.metallic=new ht("metallic",.5),this.useNormalMap=new k("useNormalMap",!1),this.normalMap=new W("normalMap",null),this.normalStrength=new ht("normalStrength",1),this.useAOMap=new k("useAOMap",!1),this.aoMap=new W("aoMap",null),this.uniforms.add(this.tiling),this.uniforms.add(this.useMainTexture),this.uniforms.add(this.mainTexture),this.uniforms.add(this.roughnessMap),this.uniforms.add(this.useRoughnessMap),this.uniforms.add(this.roughness),this.uniforms.add(this.useMetallicMap),this.uniforms.add(this.metallicMap),this.uniforms.add(this.metallic),this.uniforms.add(this.useNormalMap),this.uniforms.add(this.normalMap),this.uniforms.add(this.normalStrength),this.uniforms.add(this.useAOMap),this.uniforms.add(this.aoMap);const t=new z("Albedo",this.mainTexture,"blob");t.onChange(()=>{this.useMainTexture.value=t.hasTexture(),this.mainTexture.update()}),this.mainElement=t;const e=new z("Roughness",this.roughnessMap,"blob");e.onChange(()=>{this.useRoughnessMap.value=e.hasTexture(),this.roughnessMap.update()}),this.roughnessElement=e;const i=new z("Metallic",this.metallicMap,"blob");i.onChange(()=>{this.useMetallicMap.value=i.hasTexture(),this.metallicMap.update()}),this.metallicElement=i;const n=new z("Normal",this.normalMap,"blob");n.onChange(()=>{this.useNormalMap.value=n.hasTexture(),this.normalMap.update()}),this.normalElement=n;const o=new z("Ambient Occlusion",this.aoMap,"blob");o.onChange(()=>{this.useAOMap.value=o.hasTexture(),this.aoMap.update()}),this.aoElement=o}getName(){return"PBR"}getFragmentShader(){return di()}buildUI(t){t.add(new pe("Load a preset...",{metal:"Metal",rustymetal:"Rusty Metal",facade:"Facade",onyx:"Onyx",rock:"Rock",mossyrock:"Mossy Rock",bark:"Bark"},this.presetSelect.bind(this),{previews:["textures/metal/albedo.jpg","textures/rustymetal/albedo.jpg","textures/facade/albedo.jpg","textures/onyx/albedo.jpg","textures/rock/albedo.jpg","textures/mossyrock/albedo.jpg","textures/bark/albedo.jpg"],previewSize:64}));const e=new Jt("Tiling",this.tiling.value,"x","y",{xStep:.1,yStep:.1});t.add(e.onChange(()=>{this.tiling.value.x<.1&&(this.tiling.value.x=.1),this.tiling.value.y<.1&&(this.tiling.value.y=.1),e.update()})),t.add(this.mainElement),t.add(this.roughnessElement),t.add(new L("Roughness",this.roughness,"value",{min:.04,max:1,step:.01})),t.add(this.metallicElement),t.add(new L("Metallic Strength",this.metallic,"value",{min:0,max:1,step:.01})),t.add(this.normalElement),t.add(new L("Normal Strength",this.normalStrength,"value",{min:0,max:1,step:.01})),t.add(this.aoElement)}toJSON(){return{tiling:[this.tiling.value.x,this.tiling.value.y],roughness:this.roughness.value,normalStrength:this.normalStrength.value,metallic:this.metallic.value}}fromJSON(t){this.tiling.value.x=t.tiling[0],this.tiling.value.y=t.tiling[1],this.roughness.value=t.roughness,this.normalStrength.value=t.normalStrength,this.metallic.value=t.metallic}dispose(){this.mainTexture.blob=null,this.mainTexture.update(),this.roughnessMap.blob=null,this.roughnessMap.update(),this.metallicMap.blob=null,this.metallicMap.update(),this.normalMap.blob=null,this.normalMap.update(),this.aoMap.blob=null,this.aoMap.update(),this.mainElement.updateBlob(),this.roughnessElement.updateBlob(),this.metallicElement.updateBlob(),this.normalElement.updateBlob(),this.aoElement.updateBlob()}async presetSelect(t){const e={albedo:"albedo.jpg",ambientocclusion:"ao.jpg",metallic:"metallic.jpg",normal:"normal.jpg",roughness:"roughness.jpg"};try{const[i,n,o,a,h]=await Promise.all([F(t,e.albedo),F(t,e.ambientocclusion),F(t,e.metallic),F(t,e.normal),F(t,e.roughness)]);this.mainTexture.blob=i,this.useMainTexture.value=!0,this.mainTexture.update(),this.roughnessMap.blob=h,this.useRoughnessMap.value=!0,this.roughnessMap.update(),this.metallicMap.blob=o,this.useMetallicMap.value=!0,this.metallicMap.update(),this.normalMap.blob=a,this.useNormalMap.value=!0,this.normalMap.update(),this.aoMap.blob=n,this.useAOMap.value=!0,this.aoMap.update(),this.mainElement.updateBlob(),this.roughnessElement.updateBlob(),this.metallicElement.updateBlob(),this.normalElement.updateBlob(),this.aoElement.updateBlob(),this.updateCallback?.()}catch(i){console.error("Error loading textures",i);return}}}function di(){return`
        uniform vec2 tiling;

        uniform bool useMainTexture;
        uniform sampler2D mainTexture;
        
        uniform bool useRoughnessMap;
        uniform sampler2D roughnessMap;
        uniform float roughness;

        uniform bool useMetallicMap;
        uniform sampler2D metallicMap;
        uniform float metallic;
        
        uniform bool useNormalMap;
        uniform sampler2D normalMap;
        uniform float normalStrength;

        uniform bool useAOMap;
        uniform sampler2D aoMap;

        uniform sampler2D envMap;
        uniform float envMapIntensity;

        varying vec3 vColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUV;
        varying vec3 vViewPosition;
        varying mat3 vTBN;
        varying vec3 vWorldNormal;

        #include <common>
        #include <lights_pars_begin>

        vec3 getEnvColor(){
            vec3 envReflect = reflect(normalize(vPosition - cameraPosition), vWorldNormal);

            vec2 uv = vec2(atan(envReflect.z, envReflect.x) / (2.0 * PI) + 0.5, 
                   asin(envReflect.y) / PI + 0.5);
    
            vec3 envColor = texture2D(envMap, uv).rgb;

            return envColor;
        }

        vec3 fresnelSchlick(vec3 F0, float VdotH){
            return F0 + (1.0 - F0) * pow(1.0 - VdotH, 5.0);
        }

        float GSchlick(float dot, float k){
            return dot / (dot * (1.0 - k) + k);
        }

        float DGGX(float NdotH, float roughness){
            float alpha = roughness * roughness;
            float a2 = alpha * alpha;
            float inDenom = NdotH * NdotH * (a2 - 1.0) + 1.0;
            return a2 / (PI * inDenom * inDenom);
        }

        float SmithGGX(float NdotV, float NdotL, float roughness){
            float roughness1 = roughness + 1.0;
            float k = roughness1 * roughness1 / 8.0;
            return GSchlick(NdotV, k) * GSchlick(NdotL, k);
        }

        void main() {
            vec2 uv = vUV * tiling;

            vec3 albedo = useMainTexture ? texture2D(mainTexture, uv).rgb : vColor;
            
            vec3 normal = normalize(vNormal);
            if(useNormalMap){
                vec3 tangentNormal = texture2D(normalMap, uv).xyz * 2.0 - 1.0;
                float nrmStrength = normalStrength;
                vec3 worldNormal = normalize(vTBN * tangentNormal);
                normal = normalize(mix(normal, worldNormal, nrmStrength));
            }

            float rough = useRoughnessMap ? texture2D(roughnessMap, uv).r * roughness : roughness;

            float ao = useAOMap ? texture2D(aoMap, uv).r : 1.0;

            float metal = useMetallicMap ? texture2D(metallicMap, uv).r * metallic : metallic;

            vec3 lightColor = directionalLights[0].color;
            vec3 ambientColor = ambientLightColor;
            vec3 envColor = getEnvColor();

            vec3 ambient = ambientColor * albedo * ao;

            vec3 N = normal;
            vec3 L = directionalLights[0].direction;
            vec3 V = normalize(vViewPosition);
            vec3 H = normalize(L + V);

            float NdotL = max(dot(N, L), 0.0);
            float NdotV = max(dot(N, V), 0.0);
            float NdotH = max(dot(N, H), 0.0);
            float VdotH = max(dot(V, H), 0.0);

            vec3 F0 = mix(vec3(0.04), albedo, metal);
            vec3 F = fresnelSchlick(F0, VdotH);
            float D = DGGX(NdotH, rough);
            float G = SmithGGX(NdotV, NdotL, rough);

            float denom = 4.0 * NdotV * NdotL + 0.001;
            vec3 specular = (D * F * G) / denom;

            vec3 kS = F;
            vec3 kD = (1.0 - kS) * (1.0 - metal);
            vec3 diffuse = kD * albedo / PI;

            vec3 Lo = (diffuse + specular) * lightColor * NdotL;

            vec3 reflection = envColor * F * envMapIntensity;

            vec3 finalColor = Lo + ambient + reflection * (1.0 - rough) * metal;

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `}function dt(){return{[At.name]:{name:"Diffuse",create:()=>new At},[ct.name]:{name:"Blinn-Phong",create:()=>new ct},[he.name]:{name:"PBR",create:()=>new he}}}class Yt{vertexShader;controlPoints;color;shadingModel;uniformSet;material;group=void 0;constructor(t,e,i,n,o={}){this.vertexShader=t,this.controlPoints=e,this.color=i.clone(),this.shadingModel=n,this.shadingModel.setUpdateCallback(this.updateUniforms.bind(this)),this.uniformSet=new Ce,this.uniformSet.mergeFrom(n.getUniforms()),this.material=new ke({vertexShader:this.vertexShader,fragmentShader:this.shadingModel.getFragmentShader(),uniforms:{...this.getUniforms(),...this.getEnviromentUniforms(),...se.common,...se.lights,...o},side:We,lights:!0}),C.subscribe("enviromentChanged",P.ALL,this.updateEnviroment.bind(this)),C.subscribe("enviromentIntensityChanged",P.ALL,this.updateEnviromentIntensity.bind(this))}update(){this.updateUniforms()}updateControlPoints(){this.material.uniforms.controlPointsTexture.value=this.controlPoints.getTexture(),this.material.uniforms.controlPointsWidth.value=this.controlPoints.getWidth(),this.material.uniforms.controlPointsHeight.value=this.controlPoints.getHeight()}getMaterial(){return this.material}setColor(t){this.color.set(t),this.material.uniforms.color.value.set(t)}setShadingModel(t){this.shadingModel.removeUpdateCallback(),this.shadingModel.dispose(),this.shadingModel=t,this.shadingModel.setUpdateCallback(this.updateUniforms.bind(this)),this.uniformSet.mergeFrom(t.getUniforms()),this.material.fragmentShader=t.getFragmentShader(),this.updateUniforms(),this.updateEnviroment(),this.material.needsUpdate=!0,this.group!==void 0&&(this.group.reset(),this.shadingModel.buildUI(this.group))}getShadingModelName(){return this.shadingModel.constructor.name}getShadingModelJSON(){return this.shadingModel.toJSON()}buildUI(t){this.group=t,this.group.onChange(this.updateUniforms.bind(this)),this.shadingModel.buildUI(this.group)}setCustomUniform(t,e){this.material.uniforms[t]?this.material.uniforms[t].value=e:this.material.uniforms[t]={value:e}}dispose(){this.shadingModel.removeUpdateCallback(),this.shadingModel.dispose(),this.material.dispose()}updateUniforms(){const t=this.getUniforms();for(const e in t)this.material.uniforms[e]&&this.material.uniforms[e].value!==t[e].value?this.material.uniforms[e].value=t[e].value:this.material.uniforms[e]=t[e]}updateEnviroment(){this.shadingModel.enviroment&&(this.material.uniforms.envMap.value=r.getScene().environment,this.material.uniforms.envMapIntensity.value=r.getScene().environmentIntensity)}updateEnviromentIntensity(){this.shadingModel.enviroment&&(this.material.uniforms.envMapIntensity.value=r.getScene().environmentIntensity)}getUniforms(){const t=this.shadingModel.getUniforms().getTHREEUniforms();return t.controlPointsTexture={value:this.controlPoints.getTexture()},t.controlPointsWidth={value:this.controlPoints.getWidth()},t.controlPointsHeight={value:this.controlPoints.getHeight()},t.color={value:this.color},t}getEnviromentUniforms(){return{envMap:{value:null},envMapIntensity:{value:1}}}}var we=(s=>(s[s.OBJECT=0]="OBJECT",s[s.CONTROL_POINTS=1]="CONTROL_POINTS",s[s.SHADING=2]="SHADING",s))(we||{});class ot extends A{mode;controlPoints;geometry;material;collisionGeometry;collisionMesh;radius=.1;constructor(t,e,i,n,o=new l.Color(0),a=new l.Vector3(0,0,0),h=1,c=new ct){const d=new $t(i,n);for(let f=0;f<i;f++)for(let y=0;y<n;y++){const v=f+y*i;d.setPoint(y,f,e[v])}const m=new l.PlaneGeometry(0,0,100,100),u=new Yt(si(),d,o,c),p=new l.Mesh(m,u.getMaterial());super(t,p,a),this.controlPoints=d,this.geometry=m,this.material=u,this.mode=h,this.color=o,this.type="BezierPatchObject",this.export=this.exportMesh.bind(this);for(let f=0;f<i;f++)for(let y=0;y<n;y++){const v=f+y*i;this.createEditHandle(v,this.radius),this.setEditHandlePosition(v,e[v])}this.hideEditHandles(),this.controlPoints.addVisuals(this.mesh);const b=this.controlPoints.getWidth()+1,w=this.controlPoints.getHeight()+1;this.collisionGeometry=G(Dt(this.controlPoints,w,b),w,b),this.collisionMesh=new l.Mesh(this.collisionGeometry,new l.MeshBasicMaterial({transparent:!0,opacity:0,visible:!1,side:l.DoubleSide})),this.collisionMesh.userData.collision=!0,this.collisionMesh.userData.object=this,this.mesh.add(this.collisionMesh)}getMode(){return this.mode}setMode(t){this.mode=t,this.mode===0?(this.hideEditHandles(),this.controlPoints.hideVisuals()):this.mode===1?(this.showEditHandles(),this.controlPoints.showVisuals()):this.mode===2&&(this.hideEditHandles(),this.controlPoints.hideVisuals())}toJSON(){return{name:this.name,type:this.type,position:{x:this.mesh.position.x,y:this.mesh.position.y,z:this.mesh.position.z},controlPoints:this.controlPoints.getPoints().map(t=>({x:t.x,y:t.y,z:t.z})),controlPointsWidth:this.controlPoints.getWidth(),controlPointsHeight:this.controlPoints.getHeight(),color:this.color.getHex(),mode:this.mode,shadingModel:{name:this.material.getShadingModelName(),params:this.material.getShadingModelJSON()}}}static fromJSON(t){const e=t.controlPoints.map(d=>new l.Vector3(d.x,d.y,d.z)),i=new l.Color(t.color),n=new l.Vector3(t.position.x,t.position.y,t.position.z),o=t.mode;if(we[o]===void 0)throw new Error("Invalid BezierPatchObjectMode mode");const h=dt()[t.shadingModel.name].create();return h.fromJSON(t.shadingModel.params),new ot(t.name,e,t.controlPointsWidth,t.controlPointsHeight,i,n,o,h)}edit(){return this.collisionMesh.userData.collision=!1,this.editUpdate.bind(this)}editUpdate(){if(this.mode===1){const t=r.getSelectionManager().getSelectedEditHandleIndex();if(t===null)return;const e=this.getEditHandlePosition(t);if(e===null)return;this.updateControlPoint(t,e)}}unedit(){this.hideEditHandles(),this.controlPoints.hideVisuals(),this.collisionMesh.userData.collision=!0}updateColor(t){super.setColor(t),this.material.setColor(t)}getMaterial(){return this.material}dispose(){this.material.dispose()}addControlPoint(t,e){if(!this.hasEditHandle(t))return;const i=this.getEditHandlePosition(t);if(i===null)return;const n=Math.floor(t/this.controlPoints.getWidth()),o=t%this.controlPoints.getWidth(),a=i.clone().sub(e),h=new l.Vector3(0,a.y,a.z),c=new l.Vector3(a.x,a.y,0);n===0&&o===0?(this.addControlPointRowCol(n,-1,h),this.addControlPointRowCol(-1,o,c)):n===0&&o===this.controlPoints.getWidth()-1?(this.addControlPointRowCol(n,-1,h),this.addControlPointRowCol(-1,o,c)):n===this.controlPoints.getHeight()-1&&o===0?(this.addControlPointRowCol(-1,o,c),this.addControlPointRowCol(n,-1,h)):n===this.controlPoints.getHeight()-1&&o===this.controlPoints.getWidth()-1?(this.addControlPointRowCol(-1,o,c),this.addControlPointRowCol(n,-1,h)):this.addControlPointRowCol(n,o,a);for(let d=0;d<this.controlPoints.getWidth();d++)for(let m=0;m<this.controlPoints.getHeight();m++){const u=d+m*this.controlPoints.getWidth();this.setEditHandlePosition(u,this.controlPoints.getPoint(m,d))}this.material.updateControlPoints(),this.updateCollisionGeometry()}addControlPointRowCol(t,e,i){var n=0,o=0;t===0?(this.controlPoints.addRow(i,!0),n=this.controlPoints.getWidth(),o=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1)):t===this.controlPoints.getHeight()-1?(this.controlPoints.addRow(i,!1),n=this.controlPoints.getWidth(),o=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1)):e===0?(this.controlPoints.addColumn(i,!0),n=this.controlPoints.getHeight(),o=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight()):e===this.controlPoints.getWidth()-1&&(this.controlPoints.addColumn(i,!1),n=this.controlPoints.getHeight(),o=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight());for(let a=0;a<n;a++)this.createEditHandle(o+a,this.radius)}removeControlPoint(t){if(this.controlPoints.getWidth()<=2||this.controlPoints.getHeight()<=2||!this.hasEditHandle(t))return;const e=Math.floor(t/this.controlPoints.getWidth()),i=t%this.controlPoints.getWidth();e===0||i===0||e===this.controlPoints.getHeight()-1||i===this.controlPoints.getWidth()-1?(this.removeControlPointRowCol(e,-1),this.removeControlPointRowCol(-1,i)):this.removeControlPointRowCol(e,i);for(let n=0;n<this.controlPoints.getWidth();n++)for(let o=0;o<this.controlPoints.getHeight();o++){const a=n+o*this.controlPoints.getWidth();this.setEditHandlePosition(a,this.controlPoints.getPoint(o,n))}this.material.updateControlPoints(),this.updateCollisionGeometry()}removeControlPointRowCol(t,e){var i=0,n=0;t===0?(i=this.controlPoints.getWidth(),n=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1),this.controlPoints.removeRow(!0)):t===this.controlPoints.getHeight()-1?(i=this.controlPoints.getWidth(),n=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1),this.controlPoints.removeRow(!1)):e===0?(i=this.controlPoints.getHeight(),n=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight(),this.controlPoints.removeColumn(!0)):e===this.controlPoints.getWidth()-1&&(i=this.controlPoints.getHeight(),n=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight(),this.controlPoints.removeColumn(!1));for(let o=0;o<i;o++)this.removeEditHandle(n+o)}updateControlPoint(t,e){const i=Math.floor(t/this.controlPoints.getWidth()),n=t%this.controlPoints.getWidth();this.controlPoints.setPoint(i,n,e),this.hasEditHandle(t)&&this.setEditHandlePosition(t,e),this.updateCollisionGeometry()}getControlPoint(t){const e=Math.floor(t/this.controlPoints.getWidth()),i=t%this.controlPoints.getWidth();return this.controlPoints.getPoint(e,i)}highlight(){this.material.setColor(K())}resetHighlight(){this.resetColor()}select(){this.resetColor()}resetSelect(){this.resetColor()}resetColor(){this.material.setColor(this.color)}updateCollisionGeometry(){this.collisionGeometry.dispose();const t=this.controlPoints.getWidth()+1,e=this.controlPoints.getHeight()+1;this.collisionGeometry=G(Dt(this.controlPoints,t,e),t,e),this.collisionMesh.geometry=this.collisionGeometry}exportMesh(){const t=Dt(this.controlPoints,100,100),e=G(t,100,100),i=new l.MeshStandardMaterial({color:this.color,side:l.DoubleSide}),n=new l.Mesh(e,i);return n.position.copy(this.mesh.position),n.rotation.copy(this.mesh.rotation),n.scale.copy(this.mesh.scale),n}}function ui(){return[-5,10,5]}function mi(){return[0,100,0]}function gi(){return 15528177}function pi(){return 3092528}function Ft(){return r.darkMode()?pi():gi()}function K(){return 15105570}function U(){return 15158332}function Ot(){return r.darkMode()?11321297:3426654}function jt(s){const t=[1752220,3066993,3447003,10181046,3426654,15844367,13849600,15158332];return t[s%t.length]}function Pt(s,t){var e=new g;return e.set(s.x+(s.x-t.x),s.y-(s.y-t.y),s.z+(s.z-t.z)),e}function ve(s){switch(s){case"LinearCurveObject":return{name:"waypoints",lucide:!0};case"BezierCurveObject":return{name:"bezier2",lucide:!1};case"BezierSplineObject":return{name:"bezier",lucide:!1};case"UniformBSplineObject":return{name:"spline",lucide:!0};case"UniformRationBSplineObject":return{name:"diameter",lucide:!0};case"BezierPatchObject":return{name:"grid-2x2",lucide:!0};case"UniformBSplineSurfaceObject":return{name:"grid-3x3",lucide:!0};case"UniformRationalBSplineSurfaceObject":return{name:"ratio",lucide:!0};default:return{name:"circle-help",lucide:!0}}}const fi=`32
3 3
1.4 0.0 2.4
1.4 -0.784 2.4
0.784 -1.4 2.4
0.0 -1.4 2.4
1.3375 0.0 2.53125
1.3375 -0.749 2.53125
0.749 -1.3375 2.53125
0.0 -1.3375 2.53125
1.4375 0.0 2.53125
1.4375 -0.805 2.53125
0.805 -1.4375 2.53125
0.0 -1.4375 2.53125
1.5 0.0 2.4
1.5 -0.84 2.4
0.84 -1.5 2.4
0.0 -1.5 2.4
3 3
0.0 -1.4 2.4
-0.784 -1.4 2.4
-1.4 -0.784 2.4
-1.4 0.0 2.4
0.0 -1.3375 2.53125
-0.749 -1.3375 2.53125
-1.3375 -0.749 2.53125
-1.3375 0.0 2.53125
0.0 -1.4375 2.53125
-0.805 -1.4375 2.53125
-1.4375 -0.805 2.53125
-1.4375 0.0 2.53125
0.0 -1.5 2.4
-0.84 -1.5 2.4
-1.5 -0.84 2.4
-1.5 0.0 2.4
3 3
-1.4 0.0 2.4
-1.4 0.784 2.4
-0.784 1.4 2.4
0.0 1.4 2.4
-1.3375 0.0 2.53125
-1.3375 0.749 2.53125
-0.749 1.3375 2.53125
0.0 1.3375 2.53125
-1.4375 0.0 2.53125
-1.4375 0.805 2.53125
-0.805 1.4375 2.53125
0.0 1.4375 2.53125
-1.5 0.0 2.4
-1.5 0.84 2.4
-0.84 1.5 2.4
0.0 1.5 2.4
3 3
0.0 1.4 2.4
0.784 1.4 2.4
1.4 0.784 2.4
1.4 0.0 2.4
0.0 1.3375 2.53125
0.749 1.3375 2.53125
1.3375 0.749 2.53125
1.3375 0.0 2.53125
0.0 1.4375 2.53125
0.805 1.4375 2.53125
1.4375 0.805 2.53125
1.4375 0.0 2.53125
0.0 1.5 2.4
0.84 1.5 2.4
1.5 0.84 2.4
1.5 0.0 2.4
3 3
1.5 0.0 2.4
1.5 -0.84 2.4
0.84 -1.5 2.4
0.0 -1.5 2.4
1.75 0.0 1.875
1.75 -0.98 1.875
0.98 -1.75 1.875
0.0 -1.75 1.875
2.0 0.0 1.35
2.0 -1.12 1.35
1.12 -2.0 1.35
0.0 -2.0 1.35
2.0 0.0 0.9
2.0 -1.12 0.9
1.12 -2.0 0.9
0.0 -2.0 0.9
3 3
0.0 -1.5 2.4
-0.84 -1.5 2.4
-1.5 -0.84 2.4
-1.5 0.0 2.4
0.0 -1.75 1.875
-0.98 -1.75 1.875
-1.75 -0.98 1.875
-1.75 0.0 1.875
0.0 -2.0 1.35
-1.12 -2.0 1.35
-2.0 -1.12 1.35
-2.0 0.0 1.35
0.0 -2.0 0.9
-1.12 -2.0 0.9
-2.0 -1.12 0.9
-2.0 0.0 0.9
3 3
-1.5 0.0 2.4
-1.5 0.84 2.4
-0.84 1.5 2.4
0.0 1.5 2.4
-1.75 0.0 1.875
-1.75 0.98 1.875
-0.98 1.75 1.875
0.0 1.75 1.875
-2.0 0.0 1.35
-2.0 1.12 1.35
-1.12 2.0 1.35
0.0 2.0 1.35
-2.0 0.0 0.9
-2.0 1.12 0.9
-1.12 2.0 0.9
0.0 2.0 0.9
3 3
0.0 1.5 2.4
0.84 1.5 2.4
1.5 0.84 2.4
1.5 0.0 2.4
0.0 1.75 1.875
0.98 1.75 1.875
1.75 0.98 1.875
1.75 0.0 1.875
0.0 2.0 1.35
1.12 2.0 1.35
2.0 1.12 1.35
2.0 0.0 1.35
0.0 2.0 0.9
1.12 2.0 0.9
2.0 1.12 0.9
2.0 0.0 0.9
3 3
2.0 0.0 0.9
2.0 -1.12 0.9
1.12 -2.0 0.9
0.0 -2.0 0.9
2.0 0.0 0.45
2.0 -1.12 0.45
1.12 -2.0 0.45
0.0 -2.0 0.45
1.5 0.0 0.225
1.5 -0.84 0.225
0.84 -1.5 0.225
0.0 -1.5 0.225
1.5 0.0 0.15
1.5 -0.84 0.15
0.84 -1.5 0.15
0.0 -1.5 0.15
3 3
0.0 -2.0 0.9
-1.12 -2.0 0.9
-2.0 -1.12 0.9
-2.0 0.0 0.9
0.0 -2.0 0.45
-1.12 -2.0 0.45
-2.0 -1.12 0.45
-2.0 0.0 0.45
0.0 -1.5 0.225
-0.84 -1.5 0.225
-1.5 -0.84 0.225
-1.5 0.0 0.225
0.0 -1.5 0.15
-0.84 -1.5 0.15
-1.5 -0.84 0.15
-1.5 0.0 0.15
3 3
-2.0 0.0 0.9
-2.0 1.12 0.9
-1.12 2.0 0.9
0.0 2.0 0.9
-2.0 0.0 0.45
-2.0 1.12 0.45
-1.12 2.0 0.45
0.0 2.0 0.45
-1.5 0.0 0.225
-1.5 0.84 0.225
-0.84 1.5 0.225
0.0 1.5 0.225
-1.5 0.0 0.15
-1.5 0.84 0.15
-0.84 1.5 0.15
0.0 1.5 0.15
3 3
0.0 2.0 0.9
1.12 2.0 0.9
2.0 1.12 0.9
2.0 0.0 0.9
0.0 2.0 0.45
1.12 2.0 0.45
2.0 1.12 0.45
2.0 0.0 0.45
0.0 1.5 0.225
0.84 1.5 0.225
1.5 0.84 0.225
1.5 0.0 0.225
0.0 1.5 0.15
0.84 1.5 0.15
1.5 0.84 0.15
1.5 0.0 0.15
3 3
-1.6 0.0 2.025
-1.6 -0.3 2.025
-1.5 -0.3 2.25
-1.5 0.0 2.25
-2.3 0.0 2.025
-2.3 -0.3 2.025
-2.5 -0.3 2.25
-2.5 0.0 2.25
-2.7 0.0 2.025
-2.7 -0.3 2.025
-3.0 -0.3 2.25
-3.0 0.0 2.25
-2.7 0.0 1.8
-2.7 -0.3 1.8
-3.0 -0.3 1.8
-3.0 0.0 1.8
3 3
-1.5 0.0 2.25
-1.5 0.3 2.25
-1.6 0.3 2.025
-1.6 0.0 2.025
-2.5 0.0 2.25
-2.5 0.3 2.25
-2.3 0.3 2.025
-2.3 0.0 2.025
-3.0 0.0 2.25
-3.0 0.3 2.25
-2.7 0.3 2.025
-2.7 0.0 2.025
-3.0 0.0 1.8
-3.0 0.3 1.8
-2.7 0.3 1.8
-2.7 0.0 1.8
3 3
-2.7 0.0 1.8
-2.7 -0.3 1.8
-3.0 -0.3 1.8
-3.0 0.0 1.8
-2.7 0.0 1.575
-2.7 -0.3 1.575
-3.0 -0.3 1.35
-3.0 0.0 1.35
-2.5 0.0 1.125
-2.5 -0.3 1.125
-2.65 -0.3 0.9375
-2.65 0.0 0.9375
-2.0 0.0 0.9
-2.0 -0.3 0.9
-1.9 -0.3 0.6
-1.9 0.0 0.6
3 3
-3.0 0.0 1.8
-3.0 0.3 1.8
-2.7 0.3 1.8
-2.7 0.0 1.8
-3.0 0.0 1.35
-3.0 0.3 1.35
-2.7 0.3 1.575
-2.7 0.0 1.575
-2.65 0.0 0.9375
-2.65 0.3 0.9375
-2.5 0.3 1.125
-2.5 0.0 1.125
-1.9 0.0 0.6
-1.9 0.3 0.6
-2.0 0.3 0.9
-2.0 0.0 0.9
3 3
1.7 0.0 1.425
1.7 -0.66 1.425
1.7 -0.66 0.6
1.7 0.0 0.6
2.6 0.0 1.425
2.6 -0.66 1.425
3.1 -0.66 0.825
3.1 0.0 0.825
2.3 0.0 2.1
2.3 -0.25 2.1
2.4 -0.25 2.025
2.4 0.0 2.025
2.7 0.0 2.4
2.7 -0.25 2.4
3.3 -0.25 2.4
3.3 0.0 2.4
3 3
1.7 0.0 0.6
1.7 0.66 0.6
1.7 0.66 1.425
1.7 0.0 1.425
3.1 0.0 0.825
3.1 0.66 0.825
2.6 0.66 1.425
2.6 0.0 1.425
2.4 0.0 2.025
2.4 0.25 2.025
2.3 0.25 2.1
2.3 0.0 2.1
3.3 0.0 2.4
3.3 0.25 2.4
2.7 0.25 2.4
2.7 0.0 2.4
3 3
2.7 0.0 2.4
2.7 -0.25 2.4
3.3 -0.25 2.4
3.3 0.0 2.4
2.8 0.0 2.475
2.8 -0.25 2.475
3.525 -0.25 2.49375
3.525 0.0 2.49375
2.9 0.0 2.475
2.9 -0.15 2.475
3.45 -0.15 2.5125
3.45 0.0 2.5125
2.8 0.0 2.4
2.8 -0.15 2.4
3.2 -0.15 2.4
3.2 0.0 2.4
3 3
3.3 0.0 2.4
3.3 0.25 2.4
2.7 0.25 2.4
2.7 0.0 2.4
3.525 0.0 2.49375
3.525 0.25 2.49375
2.8 0.25 2.475
2.8 0.0 2.475
3.45 0.0 2.5125
3.45 0.15 2.5125
2.9 0.15 2.475
2.9 0.0 2.475
3.2 0.0 2.4
3.2 0.15 2.4
2.8 0.15 2.4
2.8 0.0 2.4
3 3
0.0 0.0 3.15
0.0 0.0 3.15
0.0 0.0 3.15
0.0 0.0 3.15
0.8 0.0 3.15
0.8 -0.45 3.15
0.45 -0.8 3.15
0.0 -0.8 3.15
0.0 0.0 2.85
0.0 0.0 2.85
0.0 0.0 2.85
0.0 0.0 2.85
0.2 0.0 2.7
0.2 -0.112 2.7
0.112 -0.2 2.7
0.0 -0.2 2.7
3 3
0.0 0.0 3.15
0.0 0.0 3.15
0.0 0.0 3.15
0.0 0.0 3.15
0.0 -0.8 3.15
-0.45 -0.8 3.15
-0.8 -0.45 3.15
-0.8 0.0 3.15
0.0 0.0 2.85
0.0 0.0 2.85
0.0 0.0 2.85
0.0 0.0 2.85
0.0 -0.2 2.7
-0.112 -0.2 2.7
-0.2 -0.112 2.7
-0.2 0.0 2.7
3 3
0.0 0.0 3.15
0.0 0.0 3.15
0.0 0.0 3.15
0.0 0.0 3.15
-0.8 0.0 3.15
-0.8 0.45 3.15
-0.45 0.8 3.15
0.0 0.8 3.15
0.0 0.0 2.85
0.0 0.0 2.85
0.0 0.0 2.85
0.0 0.0 2.85
-0.2 0.0 2.7
-0.2 0.112 2.7
-0.112 0.2 2.7
0.0 0.2 2.7
3 3
0.0 0.0 3.15
0.0 0.0 3.15
0.0 0.0 3.15
0.0 0.0 3.15
0.0 0.8 3.15
0.45 0.8 3.15
0.8 0.45 3.15
0.8 0.0 3.15
0.0 0.0 2.85
0.0 0.0 2.85
0.0 0.0 2.85
0.0 0.0 2.85
0.0 0.2 2.7
0.112 0.2 2.7
0.2 0.112 2.7
0.2 0.0 2.7
3 3
0.2 0.0 2.7
0.2 -0.112 2.7
0.112 -0.2 2.7
0.0 -0.2 2.7
0.4 0.0 2.55
0.4 -0.224 2.55
0.224 -0.4 2.55
0.0 -0.4 2.55
1.3 0.0 2.55
1.3 -0.728 2.55
0.728 -1.3 2.55
0.0 -1.3 2.55
1.3 0.0 2.4
1.3 -0.728 2.4
0.728 -1.3 2.4
0.0 -1.3 2.4
3 3
0.0 -0.2 2.7
-0.112 -0.2 2.7
-0.2 -0.112 2.7
-0.2 0.0 2.7
0.0 -0.4 2.55
-0.224 -0.4 2.55
-0.4 -0.224 2.55
-0.4 0.0 2.55
0.0 -1.3 2.55
-0.728 -1.3 2.55
-1.3 -0.728 2.55
-1.3 0.0 2.55
0.0 -1.3 2.4
-0.728 -1.3 2.4
-1.3 -0.728 2.4
-1.3 0.0 2.4
3 3
-0.2 0.0 2.7
-0.2 0.112 2.7
-0.112 0.2 2.7
0.0 0.2 2.7
-0.4 0.0 2.55
-0.4 0.224 2.55
-0.224 0.4 2.55
0.0 0.4 2.55
-1.3 0.0 2.55
-1.3 0.728 2.55
-0.728 1.3 2.55
0.0 1.3 2.55
-1.3 0.0 2.4
-1.3 0.728 2.4
-0.728 1.3 2.4
0.0 1.3 2.4
3 3
0.0 0.2 2.7
0.112 0.2 2.7
0.2 0.112 2.7
0.2 0.0 2.7
0.0 0.4 2.55
0.224 0.4 2.55
0.4 0.224 2.55
0.4 0.0 2.55
0.0 1.3 2.55
0.728 1.3 2.55
1.3 0.728 2.55
1.3 0.0 2.55
0.0 1.3 2.4
0.728 1.3 2.4
1.3 0.728 2.4
1.3 0.0 2.4
3 3
0.0 0.0 0.0
0.0 0.0 0.0
0.0 0.0 0.0
0.0 0.0 0.0
1.425 0.0 0.0
1.425 0.798 0.0
0.798 1.425 0.0
0.0 1.425 0.0
1.5 0.0 0.075
1.5 0.84 0.075
0.84 1.5 0.075
0.0 1.5 0.075
1.5 0.0 0.15
1.5 0.84 0.15
0.84 1.5 0.15
0.0 1.5 0.15
3 3
0.0 0.0 0.0
0.0 0.0 0.0
0.0 0.0 0.0
0.0 0.0 0.0
0.0 1.425 0.0
-0.798 1.425 0.0
-1.425 0.798 0.0
-1.425 0.0 0.0
0.0 1.5 0.075
-0.84 1.5 0.075
-1.5 0.84 0.075
-1.5 0.0 0.075
0.0 1.5 0.15
-0.84 1.5 0.15
-1.5 0.84 0.15
-1.5 0.0 0.15
3 3
0.0 0.0 0.0
0.0 0.0 0.0
0.0 0.0 0.0
0.0 0.0 0.0
-1.425 0.0 0.0
-1.425 -0.798 0.0
-0.798 -1.425 0.0
0.0 -1.425 0.0
-1.5 0.0 0.075
-1.5 -0.84 0.075
-0.84 -1.5 0.075
0.0 -1.5 0.075
-1.5 0.0 0.15
-1.5 -0.84 0.15
-0.84 -1.5 0.15
0.0 -1.5 0.15
3 3
0.0 0.0 0.0
0.0 0.0 0.0
0.0 0.0 0.0
0.0 0.0 0.0
0.0 -1.425 0.0
0.798 -1.425 0.0
1.425 -0.798 0.0
1.425 0.0 0.0
0.0 -1.5 0.075
0.84 -1.5 0.075
1.5 -0.84 0.075
1.5 0.0 0.075
0.0 -1.5 0.15
0.84 -1.5 0.15
1.5 -0.84 0.15
1.5 0.0 0.15`;function ce(s,t){const e=fi.split(`
`),i=parseInt(e[0]);var n=1;for(let o=0;o<i;o++){const a=e[n++].split(" "),h=parseInt(a[0]),c=parseInt(a[1]),d=[];for(let p=0;p<=h;p++)for(let b=0;b<=c;b++){const w=e[n++].split(" "),f=new g(parseFloat(w[0]),parseFloat(w[2]),parseFloat(w[1]));f.multiplyScalar(s),d.push(f)}const m=t?jt(o):8359053,u=new ot(`Teapot ${o+1}`,d,h+1,c+1,new H(m));r.getObjectManager().addObject(u)}}function bi(s){const t=new l.Scene;t.background=new l.Color(255);const e=new l.PerspectiveCamera(75,s.clientWidth/s.clientHeight,.1,1e3);e.position.set(...ui());const i=100,n=new l.OrthographicCamera(s.clientWidth/-100,s.clientWidth/i,s.clientHeight/i,s.clientHeight/-100,.1,1e3);n.position.set(...mi());const o=new l.WebGLRenderer;o.setSize(s.clientWidth,s.clientHeight),o.setPixelRatio(window.devicePixelRatio),o.shadowMap.enabled=!0,s.appendChild(o.domElement);const a=new re(e,o.domElement);a.enableDamping=!0,a.dampingFactor=.25;const h=new re(n,o.domElement);h.enableDamping=!0,h.dampingFactor=.25,h.enableRotate=!1,h.mouseButtons={LEFT:l.MOUSE.PAN,MIDDLE:l.MOUSE.DOLLY,RIGHT:l.MOUSE.PAN};const c=new ae(e,o.domElement);c.setTranslationSnap(.01),c.addEventListener("objectChange",()=>C.notify("transformMoved",P.VIEWPORT));const d=new ae(n,o.domElement);d.setTranslationSnap(.01),d.addEventListener("objectChange",()=>C.notify("transformMoved",P.VIEWPORT)),d.showY=!1;const m=new l.AmbientLight(15790320,.2);t.add(m);const u=new l.DirectionalLight(16777215,1);u.position.set(15,20,0),u.castShadow=!0,u.shadow.mapSize.width=2048,u.shadow.mapSize.height=2048,u.shadow.camera.far=50,u.shadow.camera.near=.5,u.shadow.camera.left=-10,u.shadow.camera.right=10,u.shadow.camera.top=10,u.shadow.camera.bottom=-10,t.add(u),window.addEventListener("resize",()=>vi(s,e,n,i,o)),window.addEventListener("beforeunload",()=>r.getIOManager().saveSceneToCache()),r.setupScene(t,e,n,o,a,h,c,d,m,u);const p=document.createElement("div");p.style.position="absolute",p.style.bottom="1rem",p.style.right="23%",p.style.display="flex",p.style.flexDirection="column",p.style.alignItems="center",p.style.gap="0.5rem";const b=document.createElement("img");b.src="/icons/eth.svg",b.style.width="5rem",b.style.opacity="0.6",b.style.cursor="pointer",b.onclick=()=>window.open("https://inf.ethz.ch/","_blank"),p.appendChild(b);const w=document.createElement("img");w.src="/icons/cgl.svg",w.style.width="8rem",w.style.cursor="pointer",w.onclick=()=>window.open("https://www.cgl.ethz.ch/","_blank"),p.appendChild(w);const f=document.createElement("p");f.innerText="Made by Simon Wadsack",f.style.fontSize="0.7rem",f.style.color="var(--sl-color-neutral-400)",f.style.cursor="pointer",f.onclick=()=>window.open("https://github.com/SimonWadsack/","_blank"),p.appendChild(f),s.appendChild(p)}function Pi(){const s=new l.GridHelper(20,40);s.material.opacity=.75,s.material.transparent=!0,s.position.set(0,-.5,0);const t=new l.PlaneGeometry(20,20);t.rotateX(-Math.PI/2);const e=new l.ShadowMaterial({color:0,opacity:.2}),i=new l.Mesh(t,e);i.receiveShadow=!0,i.position.set(0,-.51,0),r.getScene().add(s),r.getScene().add(i),r.setupGrid(s,i)}function Ci(s){const t=document.createElement("div");t.style.position="absolute",t.style.backgroundColor="var(--sl-color-neutral-100)",t.style.color="var(--sl-input-color)",t.style.fontFamily="var(--sl-font-sans)",t.style.fontSize="var(--sl-font-size-small)",t.style.padding="0.5em",t.style.borderRadius="var(--sl-border-radius-small)",t.style.border="solid",t.style.borderWidth="1px",t.style.borderColor="var(--sl-color-neutral-300)",t.style.pointerEvents="none",t.style.display="none",t.style.zIndex="1000",t.innerText="TEST",s.appendChild(t),r.setTooltip(t)}function wi(){const s=r.getIOManager().getFlagCache("darkMode");r.setMode(s)}function vi(s,t,e,i,n){t.aspect=s.clientWidth/s.clientHeight,t.updateProjectionMatrix(),e.left=s.clientWidth/-100,e.right=s.clientWidth/i,e.top=s.clientHeight/i,e.bottom=s.clientHeight/-100,e.updateProjectionMatrix(),n.setSize(s.clientWidth,s.clientHeight)}class yi{objects;meshLookup;editHandleLookup;constructor(){this.objects=new Map,this.meshLookup=new Map,this.editHandleLookup=new Map}addObject(t){const e=t.getMesh();if(!e){console.error(`addObject: Object with id ${t.getUUID()} has no mesh!`);return}r.getScene().add(e),this.objects.set(t.getUUID(),t),this.meshLookup.set(e,t),C.notify("objectAdded",P.GENERAL,t)}addEditHandle(t){const i=t.getParentObject().getMesh();if(!i){console.error("addEditHandle: Parent has no mesh!");return}const n=t.getMesh();i.add(n),this.editHandleLookup.set(n,t),C.notify("editHandleAdded",P.GENERAL,t)}getObjectByUUID(t){return this.objects.has(t)?this.objects.get(t):(console.error(`getObjectById: Object with uuid ${t} not found!`),null)}selectable(t){return t.userData.collision&&t.userData.object?!0:this.meshLookup.has(t)}isEditHandle(t){if(this.editHandleLookup.has(t)){const e=this.editHandleLookup.get(t);if(e&&e.getActive())return!0}return!1}isVisualObject(t){return t.userData.collision&&t.userData.object?!0:this.meshLookup.has(t)}getVisualObjectByMesh(t){return this.meshLookup.has(t)?this.meshLookup.get(t):t.userData.collision&&t.userData.object?t.userData.object:(console.error(`getVisualObjectByMesh: Object with mesh ${t} not found!`),null)}getEditHandleByMesh(t){return this.editHandleLookup.has(t)?this.editHandleLookup.get(t):(console.error(`getEditHandleByMesh: Edit handle with mesh ${t} not found!`),null)}removeObject(t){const e=this.getObjectByUUID(t);if(!e){console.error(`removeObject: Object with id ${t} not found!`);return}const i=e.getMesh();if(!i){console.error(`removeObject: Object with id ${t} has no mesh!`);return}e.dispose(),r.getScene().remove(i),this.objects.delete(t),this.meshLookup.delete(i),C.notify("objectRemoved",P.ALL,e)}removeObjects(){this.objects.forEach((t,e)=>{this.removeObject(e)}),this.objects.clear(),this.meshLookup.clear(),this.editHandleLookup.clear()}removeEditHandle(t){if(!t){console.error(`removeEditHandle: Edit handle ${t} not found!`);return}const i=t.getParentObject().getMesh();if(!i){console.error("removeEditHandle: Parent has no mesh!");return}const n=t.getMesh();i.remove(n),this.editHandleLookup.delete(n),C.notify("editHandleRemoved",P.ALL,t)}getObjects(){return Array.from(this.objects.values())}isGrid(t){return t===r.getGrid()}isPlane(t){return t===r.getPlane()}}function Mi(s,t){if(!s||!Array.isArray(s)||s.length<2)return console.error("bezier: Invalid points array!"),null;if(t<0||t>1)return console.error("bezier: Invalid t value!"),null;const e=s.length-1;let i=new g(0,0,0);for(let n=0;n<=e;n++){const o=Wt(e,n,t);i.addScaledVector(s[n],o)}return i}function xi(s,t,e,i,n){if(n<0||n>1+.05)return console.error("cubicBezier: Invalid t value!",n),null;const o=1-n,a=o*o,h=a*o,c=n*n,d=c*n,m=new g(0,0,0);return m.addScaledVector(s,h),m.addScaledVector(t,3*a*n),m.addScaledVector(e,3*o*c),m.addScaledVector(i,d),m}class qt extends It{controlPoints;constructor(t=[]){super(),this.controlPoints=t}getPoint(t,e=new g){const i=e;if(this.controlPoints.length<2)return console.log("BezierCurve: Not enough control points!"),i;const n=Mi(this.controlPoints,t);return n===null?(console.log("BezierCurve:getPoint: Bezier calculation failed!"),i):(i.copy(n),i)}setPoints(t){this.controlPoints=t}copy(t){return t instanceof qt?(super.copy(t),this.controlPoints=t.controlPoints.map(e=>e.clone()),this):(console.log("BezierCurve:copy: Source is not an instance of BezierCurve!"),this)}}var ye=(s=>(s[s.OBJECT=0]="OBJECT",s[s.CONTROL_POINTS=1]="CONTROL_POINTS",s[s.DE_CASTELJAU=2]="DE_CASTELJAU",s[s.INFO=3]="INFO",s))(ye||{});class st extends A{mode;controlPoints;segments;radius;radialSegments;geometry;material;curve;connectionVisual;deCasteljauT;deCasteljauVisuals;deCasteljauCollisionMesh;constructor(t,e=[new l.Vector3(-5,0,0),new l.Vector3(0,5,0),new l.Vector3(5,0,0)],i=new l.Color(0),n=100,o=new l.Vector3(0,0,0),a=1){const h=new qt(e),c=.05,d=8,m=new l.TubeGeometry(h,n,c,d,!1),u=new l.MeshBasicMaterial({color:i});u.side=l.DoubleSide;const p=new l.Mesh(m,u);super(t,p,o),this.curve=h,this.geometry=m,this.material=u,this.controlPoints=e,this.color=i,this.segments=n,this.mode=a,this.radius=c,this.radialSegments=d,this.type="BezierCurveObject";for(let v=0;v<this.controlPoints.length;v++)this.createEditHandle(v),this.setEditHandlePosition(v,this.controlPoints[v]);const b=new l.BufferGeometry().setFromPoints(this.controlPoints),w=new l.LineBasicMaterial({color:U()});this.connectionVisual=new l.Line(b,w),this.connectionVisual.castShadow=!0,p.add(this.connectionVisual),this.connectionVisual.visible=!1,this.hideEditHandles(),this.deCasteljauT=.5,this.deCasteljauVisuals=[];const f=new l.TubeGeometry(this.curve,n,this.radius*10,this.radialSegments,!1),y=new l.MeshBasicMaterial({transparent:!0,opacity:0,visible:!1});this.deCasteljauCollisionMesh=new l.Mesh(f,y),p.add(this.deCasteljauCollisionMesh)}getMode(){return this.mode}setMode(t){this.mode=t,t===0?(this.connectionVisual.visible=!1,this.hideEditHandles(),this.disableDeCasteljau()):t===1?(this.connectionVisual.visible=!0,this.showEditHandles(),this.disableDeCasteljau()):t===2?(this.connectionVisual.visible=!1,this.hideEditHandles(),this.enableDeCasteljau()):t===3&&(this.connectionVisual.visible=!1,this.hideEditHandles(),this.disableDeCasteljau())}toJSON(){return{name:this.name,type:this.type,position:{x:this.mesh.position.x,y:this.mesh.position.y,z:this.mesh.position.z},controlPoints:this.controlPoints.map(t=>({x:t.x,y:t.y,z:t.z})),color:this.color.getHex(),segments:this.segments,mode:this.mode,deCasteljauT:this.deCasteljauT}}static fromJSON(t){const e=t.controlPoints.map(h=>new l.Vector3(h.x,h.y,h.z)),i=new l.Color(t.color),n=new l.Vector3(t.position.x,t.position.y,t.position.z),o=t.mode;if(ye[o]===void 0)throw new Error("Invalid BezierCurveObject mode");const a=new st(t.name,e,i,t.segments,n,o);return o===2&&(a.enableDeCasteljau(),a.updateDeCasteljauT(t.deCasteljauT!==void 0?t.deCasteljauT:.5)),a}edit(){return this.editUpdate.bind(this)}editUpdate(){if(this.mode===1){const t=r.getSelectionManager().getSelectedEditHandleIndex();if(t===null)return;const e=this.getEditHandlePosition(t);if(e===null)return;this.updateControlPoint(t,e),this.updateConnectionVisual()}}unedit(){this.connectionVisual.visible=!1,this.hideEditHandles()}enableDeCasteljau(){if(this.deCasteljauVisuals.length>0)return;const t=this.controlPoints.length;var e=[];const i=[],n=[];for(let c=0;c<t;c++){const d=new l.SphereGeometry(.1),m=new l.MeshBasicMaterial({color:jt(0)}),u=new l.Mesh(d,m);u.position.set(this.controlPoints[c].x,this.controlPoints[c].y,this.controlPoints[c].z),this.mesh.add(u),e.push(this.controlPoints[c]),i.push(u),n.push(this.controlPoints[c])}const o=new l.BufferGeometry().setFromPoints(n),a=new l.LineBasicMaterial({color:jt(0)}),h=new l.Line(o,a);this.mesh.add(h),this.deCasteljauVisuals[0]={points:i,line:h};for(let c=0;c<t-1;c++){const d=[],m=[],u=c===t-2?.25:.1,p=c===t-2?this.getColor():jt(c+1);for(let y=0;y<t-c-1;y++){const v=be(e[y],e[y+1],this.deCasteljauT),j=new l.SphereGeometry(u),x=new l.MeshBasicMaterial({color:p}),M=new l.Mesh(j,x);M.position.set(v.x,v.y,v.z),d.push(v),m.push(M),this.mesh.add(M)}e=d.slice();const b=new l.BufferGeometry().setFromPoints(d),w=new l.LineBasicMaterial({color:p}),f=new l.Line(b,w);this.deCasteljauVisuals[c+1]={points:m,line:f},this.mesh.add(f)}}disableDeCasteljau(){this.deCasteljauVisuals.forEach(t=>{t.points.forEach(e=>{this.mesh.remove(e)}),this.mesh.remove(t.line)}),this.deCasteljauVisuals=[]}getDeCasteljauT(){return this.deCasteljauT}updateDeCasteljauT(t){this.deCasteljauT=t,this.recomputeDeCasteljau()}getCollisionMesh(){return this.deCasteljauCollisionMesh}updateDeCasteljauFromNearestPoint(t){const e=this.curve.getPoints(500);let i=Number.MAX_VALUE,n=0;for(let o=0;o<e.length;o++){const a=e[o].distanceToSquared(t);a<i&&(i=a,n=o)}this.updateDeCasteljauT(n/500)}recomputeDeCasteljau(){if(this.mode===2){for(let t=0;t<this.deCasteljauVisuals[0].points.length;t++)this.deCasteljauVisuals[0].points[t].position.set(this.controlPoints[t].x,this.controlPoints[t].y,this.controlPoints[t].z);this.deCasteljauVisuals[0].line.geometry.setFromPoints(this.controlPoints);for(let t=0;t<this.deCasteljauVisuals.length-1;t++){const e=this.deCasteljauVisuals[t].points,i=this.deCasteljauVisuals[t+1].points;for(let n=0;n<e.length-1;n++){const o=ai(e[n],e[n+1],this.deCasteljauT);i[n].position.set(o.x,o.y,o.z)}this.deCasteljauVisuals[t+1].line.geometry.setFromPoints(i.map(n=>n.position))}}}updateSegments(t){this.segments=t,this.recompute()}updateColor(t){super.setColor(t),this.material.color.set(t)}dispose(){this.material.dispose()}addControlPoint(t,e=!1){if(e?this.controlPoints.unshift(t):this.controlPoints.push(t),this.recompute(),this.updateConnectionVisual(),e){this.createEditHandle(this.controlPoints.length-1);for(let i=0;i<this.controlPoints.length;i++)this.setEditHandlePosition(i,this.controlPoints[i])}else this.createEditHandle(this.controlPoints.length-1),this.setEditHandlePosition(this.controlPoints.length-1,t);this.controlPoints.length>100?this.updateSegments(1e3):this.controlPoints.length>40&&this.updateSegments(500)}removeControlPoint(t=!1){if(!(this.controlPoints.length<=2)){if(t?this.controlPoints.shift():this.controlPoints.pop(),this.recompute(),this.updateConnectionVisual(),t){this.removeEditHandle(this.controlPoints.length);for(let e=0;e<this.controlPoints.length;e++)this.setEditHandlePosition(e,this.controlPoints[e])}else this.removeEditHandle(this.controlPoints.length);this.controlPoints.length<40?this.updateSegments(100):this.controlPoints.length<100&&this.updateSegments(500)}}updateControlPoint(t,e){this.controlPoints[t].set(e.x,e.y,e.z),this.recompute(),this.updateConnectionVisual(),this.mode===2&&this.recomputeDeCasteljau(),this.hasEditHandle(t)&&this.setEditHandlePosition(t,e)}getControlPoint(t){return this.controlPoints[t]}getControlPoints(){return this.controlPoints.slice()}highlight(){this.material.color.set(K())}resetHighlight(){this.resetColor()}select(){this.material.color.set(U())}resetSelect(){this.resetColor()}resetColor(){this.material.color.set(this.color)}updateConnectionVisual(){this.connectionVisual!==null&&(this.connectionVisual.geometry.dispose(),this.connectionVisual.geometry=new l.BufferGeometry().setFromPoints(this.controlPoints))}recompute(){this.curve.setPoints(this.controlPoints),this.geometry&&this.geometry.dispose(),this.geometry=new l.TubeGeometry(this.curve,this.segments,this.radius,this.radialSegments,!1),this.mesh.geometry=this.geometry,this.deCasteljauCollisionMesh.geometry.dispose(),this.deCasteljauCollisionMesh.geometry=new l.TubeGeometry(this.curve,this.segments,this.radius*10,this.radialSegments,!1)}}var Me=(s=>(s[s.OBJECT=0]="OBJECT",s[s.CONTROL_POINTS=1]="CONTROL_POINTS",s))(Me||{});class ut extends A{mode;controlPoints;geometry;material;constructor(t,e=[new l.Vector3(-5,0,0),new l.Vector3(0,5,0),new l.Vector3(5,0,0)],i=new l.Color(0),n=new l.Vector3(0,0,0),o=1){const a=new le().setPositions(e.map(d=>[d.x,d.y,d.z]).flat()),h=new Je({color:i,linewidth:5});h.side=l.DoubleSide;const c=new Ke(a,h);super(t,c,n),this.geometry=a,this.material=h,this.controlPoints=e,this.color=i,this.mode=o,this.type="LinearCurveObject";for(let d=0;d<this.controlPoints.length;d++)this.createEditHandle(d),this.setEditHandlePosition(d,this.controlPoints[d]);this.hideEditHandles()}getMode(){return this.mode}setMode(t){this.mode=t,t===0?this.hideEditHandles():t===1&&this.showEditHandles()}toJSON(){return{name:this.name,type:this.type,position:{x:this.mesh.position.x,y:this.mesh.position.y,z:this.mesh.position.z},controlPoints:this.controlPoints.map(t=>({x:t.x,y:t.y,z:t.z})),color:this.color.getHex(),mode:this.mode}}static fromJSON(t){const e=t.controlPoints.map(a=>new l.Vector3(a.x,a.y,a.z)),i=new l.Color(t.color),n=new l.Vector3(t.position.x,t.position.y,t.position.z),o=t.mode;if(Me[o]===void 0)throw new Error(`Invalid LinearCurveObjectMode: ${o}`);return new ut(t.name,e,i,n,o)}edit(){return this.editUpdate.bind(this)}editUpdate(){if(this.mode===1){const t=r.getSelectionManager().getSelectedEditHandleIndex();if(t===null)return;const e=this.getEditHandlePosition(t);if(e===null)return;this.updateControlPoint(t,e)}}unedit(){this.hideEditHandles()}updateColor(t){super.setColor(t),this.material.color.set(t)}dispose(){this.material.dispose()}addControlPoint(t,e=!1){if(e?this.controlPoints.unshift(t):this.controlPoints.push(t),this.recompute(),e){this.createEditHandle(this.controlPoints.length-1);for(let i=0;i<this.controlPoints.length;i++)this.setEditHandlePosition(i,this.controlPoints[i])}else this.createEditHandle(this.controlPoints.length-1),this.setEditHandlePosition(this.controlPoints.length-1,t)}removeControlPoint(t=!1){if(!(this.controlPoints.length<=2))if(t?this.controlPoints.shift():this.controlPoints.pop(),this.recompute(),t){this.removeEditHandle(this.controlPoints.length);for(let e=0;e<this.controlPoints.length;e++)this.setEditHandlePosition(e,this.controlPoints[e])}else this.removeEditHandle(this.controlPoints.length)}updateControlPoint(t,e){this.controlPoints[t].set(e.x,e.y,e.z),this.recompute(),this.hasEditHandle(t)&&this.setEditHandlePosition(t,e)}getControlPoint(t){return this.controlPoints[t]}getControlPoints(){return this.controlPoints.slice()}highlight(){this.material.color.set(K())}resetHighlight(){this.resetColor()}select(){this.material.color.set(U())}resetSelect(){this.resetColor()}resetColor(){this.material.color.set(this.color)}recompute(){this.geometry&&this.geometry.dispose(),this.geometry=new le().setPositions(this.controlPoints.map(t=>[t.x,t.y,t.z]).flat()),this.mesh.geometry=this.geometry}}function X(s,t,e,i){if((e<i[0]||e>i[i.length-1])&&console.log("basis: Invalid arguments for t: ",e),s===0)return i[t]<=e&&e<i[t+1]?1:0;let n=i[t+s]-i[t],o=i[t+s+1]-i[t+1],a=n===0?0:(e-i[t])/n*X(s-1,t,e,i),h=o===0?0:(i[t+s+1]-e)/o*X(s-1,t+1,e,i);return a+h}function D(s,t){let e=[];for(let i=0;i<=t+s+1;i++)e.push(i);return e}function Ei(s,t,e,i,n=!1){if(!s||!Array.isArray(s)||s.length<2)return console.error("bspline: Invalid points array!"),null;if(t<i[0]||t>i[i.length-1])return console.error("bspline: Invalid t value!"),null;let o=s.length-1+(n?e:0);if(i.length!==o+e+2)return console.error("bspline: Invalid knots array!"),null;let a=new g(0,0,0);for(let h=0;h<=o;h++){const c=X(e,h,t,i);a.addScaledVector(s[h%s.length],c)}return a}class Zt extends It{controlPoints;degree;knots;closed=!1;constructor(t=[],e=2,i=!1){super(),this.controlPoints=t,this.degree=e,this.closed=i;const n=this.closed?this.degree:0;this.knots=D(this.degree,this.controlPoints.length-1+n)}getPoint(t,e=new g){const i=e;if(this.controlPoints.length<2)return console.log("UniformBSplineCurve: Not enough control points!"),i;if(this.degree<2||this.degree>this.controlPoints.length-1)return console.log("UniformBSplineCurve: Degree is out of range!"),i;t=this.knots[this.degree]+t*(this.knots[this.knots.length-this.degree-1]-this.knots[this.degree]);const n=Ei(this.controlPoints,t,this.degree,this.knots,this.closed);return n===null?(console.log("UniformBSplineCurve:getPoint: BSpline calculation failed!"),i):(i.copy(n),i)}setPoints(t){this.controlPoints=t;const e=this.closed?this.degree:0;this.knots=D(this.degree,this.controlPoints.length-1+e)}setDegree(t){if(this.degree===t)return;this.degree=t;const e=this.closed?this.degree:0;this.knots=D(this.degree,this.controlPoints.length-1+e)}setClosed(t){if(this.closed===t)return;this.closed=t;const e=this.closed?this.degree:0;this.knots=D(this.degree,this.controlPoints.length-1+e)}copy(t){return t instanceof Zt?(super.copy(t),this.controlPoints=t.controlPoints.map(e=>e.clone()),this.degree=t.degree,this.knots=t.knots.slice(),this.closed=t.closed,this):(console.log("UniformBSplineCurve:copy: Source is not an instance of UniformBSplineCurve!"),this)}}var xe=(s=>(s[s.OBJECT=0]="OBJECT",s[s.CONTROL_POINTS=1]="CONTROL_POINTS",s))(xe||{});class mt extends A{mode;controlPoints;degree;segments;radius;radialSegments;geometry;material;curve;connectionVisual;closed=!1;constructor(t,e=[new l.Vector3(-5,0,0),new l.Vector3(0,5,0),new l.Vector3(5,0,0)],i=2,n=new l.Color(0),o=100,a=new l.Vector3(0,0,0),h=1,c=!1){const d=new Zt(e,i,c),m=.05,u=8,p=new l.TubeGeometry(d,o,m,u,!1),b=new l.MeshBasicMaterial({color:n});b.side=l.DoubleSide;const w=new l.Mesh(p,b);super(t,w,a),this.curve=d,this.geometry=p,this.material=b,this.controlPoints=e,this.degree=i,this.color=n,this.segments=o,this.mode=h,this.closed=c,this.radius=m,this.radialSegments=u,this.type="UniformBSplineObject";for(let v=0;v<this.controlPoints.length;v++)this.createEditHandle(v),this.setEditHandlePosition(v,this.controlPoints[v]);const f=new l.BufferGeometry().setFromPoints(this.controlPoints),y=new l.LineBasicMaterial({color:U()});this.connectionVisual=new l.Line(f,y),this.connectionVisual.castShadow=!0,w.add(this.connectionVisual),this.connectionVisual.visible=!1,this.hideEditHandles()}getMode(){return this.mode}setMode(t){this.mode=t,t===0?(this.connectionVisual.visible=!1,this.hideEditHandles()):t===1&&(this.connectionVisual.visible=!0,this.showEditHandles())}toJSON(){return{name:this.name,type:this.type,position:{x:this.mesh.position.x,y:this.mesh.position.y,z:this.mesh.position.z},controlPoints:this.controlPoints.map(t=>({x:t.x,y:t.y,z:t.z})),degree:this.degree,color:this.color.getHex(),segments:this.segments,mode:this.mode,closed:this.closed}}static fromJSON(t){const e=t.controlPoints.map(a=>new l.Vector3(a.x,a.y,a.z)),i=new l.Color(t.color),n=new l.Vector3(t.position.x,t.position.y,t.position.z),o=t.mode;if(xe[o]===void 0)throw new Error("Invalid UniformBSplineObject mode");return new mt(t.name,e,t.degree,i,t.segments,n,o,t.closed)}edit(){return this.editUpdate.bind(this)}editUpdate(){if(this.mode===1){const t=r.getSelectionManager().getSelectedEditHandleIndex();if(t===null)return;const e=this.getEditHandlePosition(t);if(e===null)return;this.updateControlPoint(t,e),this.updateConnectionVisual()}}unedit(){this.connectionVisual.visible=!1,this.hideEditHandles()}addControlPoint(t,e=!1){if(e?this.controlPoints.unshift(t):this.controlPoints.push(t),this.recompute(),this.updateConnectionVisual(),e){this.createEditHandle(this.controlPoints.length-1);for(let i=0;i<this.controlPoints.length;i++)this.setEditHandlePosition(i,this.controlPoints[i])}else this.createEditHandle(this.controlPoints.length-1),this.setEditHandlePosition(this.controlPoints.length-1,t);this.controlPoints.length>100?this.updateSegments(1e3):this.controlPoints.length>30&&this.updateSegments(500)}removeControlPoint(t=!1){if(!(this.controlPoints.length<=3)){if(t?this.controlPoints.shift():this.controlPoints.pop(),this.controlPoints.length-1<this.degree&&(this.degree=this.controlPoints.length-1,this.curve.setDegree(this.degree)),this.recompute(),this.updateConnectionVisual(),t){this.removeEditHandle(this.controlPoints.length);for(let e=0;e<this.controlPoints.length;e++)this.setEditHandlePosition(e,this.controlPoints[e])}else this.removeEditHandle(this.controlPoints.length);this.controlPoints.length<30?this.updateSegments(100):this.controlPoints.length<100&&this.updateSegments(500)}}updateControlPoint(t,e){this.controlPoints[t].set(e.x,e.y,e.z),this.recompute(),this.updateConnectionVisual(),this.hasEditHandle(t)&&this.setEditHandlePosition(t,e)}getControlPoint(t){return this.controlPoints[t]}getControlPoints(){return this.controlPoints.slice()}getDegree(){return this.degree}setDegree(t){this.degree=t,this.curve.setDegree(t),this.recompute()}isClosed(){return this.closed}setClosed(t){this.closed=t,this.curve.setClosed(t),this.recompute()}updateSegments(t){this.segments=t,this.recompute()}updateColor(t){super.setColor(t),this.material.color.set(t)}dispose(){this.material.dispose()}highlight(){this.material.color.set(K())}resetHighlight(){this.resetColor()}select(){this.material.color.set(U())}resetSelect(){this.resetColor()}resetColor(){this.material.color.set(this.color)}updateConnectionVisual(){this.connectionVisual!==null&&(this.connectionVisual.geometry.dispose(),this.connectionVisual.geometry=new l.BufferGeometry().setFromPoints(this.controlPoints))}recompute(){this.curve.setPoints(this.controlPoints),this.geometry&&this.geometry.dispose(),this.geometry=new l.TubeGeometry(this.curve,this.segments,this.radius,this.radialSegments,!1),this.mesh.geometry=this.geometry}}function Si(s,t,e,i,n=!1){if(!s||!Array.isArray(s)||s.length<2)return console.error("bspline: Invalid points array!"),null;if(t<i[0]||t>i[i.length-1])return console.error("bspline: Invalid t value!"),null;let o=s.length-1+(n?e:0);if(i.length!==o+e+2)return console.error("bspline: Invalid knots array!"),null;let a=new g(0,0,0),h=0;for(let c=0;c<=o;c++){const d=X(e,c,t,i),m=c%s.length,u=new g(s[m].x,s[m].y,s[m].z),p=s[m].w*d;a.addScaledVector(u,p),h+=p}return h===0?null:a.divideScalar(h)}class Qt extends It{controlPoints;degree;knots;closed;constructor(t=[],e=2,i=!1){super(),this.controlPoints=t,this.degree=e,this.closed=i;const n=this.closed?this.degree:0;this.knots=D(this.degree,this.controlPoints.length-1+n)}getPoint(t,e=new g){const i=e;if(this.controlPoints.length<3)return console.log("UniformRationalBSplineCurve: Not enough control points!"),i;if(this.degree<2||this.degree>this.controlPoints.length-1)return console.log("UniformRationalBSplineCurve: Degree is out of range!"),i;t=this.knots[this.degree]+t*(this.knots[this.knots.length-this.degree-1]-this.knots[this.degree]);const n=Si(this.controlPoints,t,this.degree,this.knots,this.closed);return n===null?(console.log("UniformRationalBSplineCurve:getPoint: BSpline calculation failed!"),i):(i.copy(n),i)}setPoints(t){this.controlPoints=t;const e=this.closed?this.degree:0;this.knots=D(this.degree,this.controlPoints.length-1+e)}setDegree(t){if(this.degree===t)return;this.degree=t;const e=this.closed?this.degree:0;this.knots=D(this.degree,this.controlPoints.length-1+e)}setClosed(t){if(this.closed===t)return;this.closed=t;const e=this.closed?this.degree:0;this.knots=D(this.degree,this.controlPoints.length-1+e)}copy(t){return t instanceof Qt?(super.copy(t),this.controlPoints=t.controlPoints.map(e=>e.clone()),this.degree=t.degree,this.knots=t.knots.slice(),this.closed=t.closed,this):(console.log("UniformRationalBSplineCurve:copy: Source is not an instance of UniformBSplineCurve!"),this)}}var Ee=(s=>(s[s.OBJECT=0]="OBJECT",s[s.CONTROL_POINTS=1]="CONTROL_POINTS",s))(Ee||{});class gt extends A{mode;controlPoints;degree;segments;radius;radialSegments;geometry;material;curve;connectionVisual;weightEditIndex=-1;weightEditRing;closed=!1;constructor(t,e=[new l.Vector4(-5,0,0,1),new l.Vector4(0,5,0,1),new l.Vector4(5,0,0,1)],i=2,n=new l.Color(0),o=100,a=new l.Vector3(0,0,0),h=1,c=!1){const d=new Qt(e,i,c),m=.05,u=8,p=new l.TubeGeometry(d,o,m,u,!1),b=new l.MeshBasicMaterial({color:n});b.side=l.DoubleSide;const w=new l.Mesh(p,b);super(t,w,a),this.curve=d,this.geometry=p,this.material=b,this.controlPoints=e,this.degree=i,this.color=n,this.segments=o,this.mode=h,this.closed=c,this.radius=m,this.radialSegments=u,this.type="UniformRationBSplineObject";for(let x=0;x<this.controlPoints.length;x++){this.createEditHandle(x);const M=new l.Vector3(this.controlPoints[x].x,this.controlPoints[x].y,this.controlPoints[x].z);this.setEditHandlePosition(x,M)}const f=new l.BufferGeometry().setFromPoints(this.controlPoints.map(x=>new l.Vector3(x.x,x.y,x.z))),y=new l.LineBasicMaterial({color:U()});this.connectionVisual=new l.Line(f,y),this.connectionVisual.castShadow=!0,w.add(this.connectionVisual),this.connectionVisual.visible=!1,this.hideEditHandles();const v=new l.RingGeometry(.05,.06,32),j=new l.MeshBasicMaterial({color:U()});this.weightEditRing=new l.Mesh(v,j),w.add(this.weightEditRing),this.weightEditRing.visible=!1,r.onOrbitControlsChange(()=>{this.weightEditIndex!==-1&&this.weightEditRing.lookAt(r.getCamera().position)}),window.addEventListener("wheel",x=>{if(this.weightEditIndex!==-1){const M=this.controlPoints[this.weightEditIndex];M.w+=x.deltaY*.01,M.w<1&&(M.w=1),M.w>10&&(M.w=10),this.updateControlPoint(this.weightEditIndex,M),C.notify("objectChanged",P.VIEWPORT,this)}})}getMode(){return this.mode}setMode(t){this.mode=t,t===0?(this.connectionVisual.visible=!1,this.hideWeightEditRing(),this.hideEditHandles()):t===1&&(this.connectionVisual.visible=!0,this.showEditHandles())}toJSON(){return{name:this.name,type:this.type,position:{x:this.mesh.position.x,y:this.mesh.position.y,z:this.mesh.position.z},controlPoints:this.controlPoints.map(t=>({x:t.x,y:t.y,z:t.z,w:t.w})),degree:this.degree,color:this.color.getHex(),segments:this.segments,mode:this.mode,closed:this.closed}}static fromJSON(t){const e=t.controlPoints.map(a=>new l.Vector4(a.x,a.y,a.z,a.w)),i=new l.Color(t.color),n=new l.Vector3(t.position.x,t.position.y,t.position.z),o=t.mode;if(Ee[o]===void 0)throw new Error("Invalid UniformBSplineObject mode");return new gt(t.name,e,t.degree,i,t.segments,n,o,t.closed)}edit(){return this.editUpdate.bind(this)}editUpdate(){if(this.mode===1){const t=r.getSelectionManager().getSelectedEditHandleIndex();if(t===null)return;const e=this.getEditHandlePosition(t);if(e===null)return;this.updateControlPoint3(t,e),this.updateConnectionVisual()}}unedit(){this.connectionVisual.visible=!1,this.hideWeightEditRing(),this.hideEditHandles()}showWeightEditRing(t){this.weightEditIndex=t,this.updateWeightEditRing(),this.weightEditRing.visible=!0,r.noScroll()}hideWeightEditRing(){this.weightEditIndex=-1,this.weightEditRing.visible=!1,r.scroll()}updateWeightEditRing(){if(this.weightEditIndex===-1)return;const t=this.controlPoints[this.weightEditIndex];this.weightEditRing.position.set(t.x,t.y,t.z);const e=Pe(t.w,1,10,8,20);this.weightEditRing.scale.set(e,e,e),this.weightEditRing.lookAt(r.getCamera().position)}addControlPoint(t,e=!1){if(e?this.controlPoints.unshift(t):this.controlPoints.push(t),this.recompute(),this.updateConnectionVisual(),e){this.createEditHandle(this.controlPoints.length-1);for(let i=0;i<this.controlPoints.length;i++){const n=new l.Vector3(this.controlPoints[i].x,this.controlPoints[i].y,this.controlPoints[i].z);this.setEditHandlePosition(i,n)}}else{this.createEditHandle(this.controlPoints.length-1);const i=this.controlPoints.length-1,n=new l.Vector3(this.controlPoints[i].x,this.controlPoints[i].y,this.controlPoints[i].z);this.setEditHandlePosition(this.controlPoints.length-1,n)}this.controlPoints.length>60?this.updateSegments(1e3):this.controlPoints.length>30&&this.updateSegments(500)}removeControlPoint(t=!1){if(!(this.controlPoints.length<=3)){if(t?this.controlPoints.shift():this.controlPoints.pop(),this.controlPoints.length-1<this.degree&&(this.degree=this.controlPoints.length-1,this.curve.setDegree(this.degree)),this.recompute(),this.updateConnectionVisual(),t){this.removeEditHandle(this.controlPoints.length);for(let e=0;e<this.controlPoints.length;e++){const i=new l.Vector3(this.controlPoints[e].x,this.controlPoints[e].y,this.controlPoints[e].z);this.setEditHandlePosition(e,i)}}else this.removeEditHandle(this.controlPoints.length);this.controlPoints.length<30?this.updateSegments(100):this.controlPoints.length<60&&this.updateSegments(500)}}updateControlPoint3(t,e){this.updateControlPoint(t,new l.Vector4(e.x,e.y,e.z,this.getControlPoint(t).w))}updateControlPoint(t,e){if(this.controlPoints[t].set(e.x,e.y,e.z,e.w),this.recompute(),this.updateConnectionVisual(),this.hasEditHandle(t)){const i=new l.Vector3(this.controlPoints[t].x,this.controlPoints[t].y,this.controlPoints[t].z);this.setEditHandlePosition(t,i)}this.weightEditIndex===t&&this.updateWeightEditRing()}getControlPoint(t){return this.controlPoints[t]}getControlPoints(){return this.controlPoints.slice()}getDegree(){return this.degree}setDegree(t){this.degree=t,this.curve.setDegree(t),this.recompute()}isClosed(){return this.closed}setClosed(t){this.closed=t,this.curve.setClosed(t),this.recompute()}updateSegments(t){this.segments=t,this.recompute()}updateColor(t){super.setColor(t),this.material.color.set(t)}dispose(){this.material.dispose()}highlight(){this.material.color.set(K())}resetHighlight(){this.resetColor()}select(){this.material.color.set(U())}resetSelect(){this.resetColor()}resetColor(){this.material.color.set(this.color)}updateConnectionVisual(){this.connectionVisual!==null&&(this.connectionVisual.geometry.dispose(),this.connectionVisual.geometry=new l.BufferGeometry().setFromPoints(this.controlPoints.map(t=>new l.Vector3(t.x,t.y,t.z))))}recompute(){this.curve.setPoints(this.controlPoints),this.geometry&&this.geometry.dispose(),this.geometry=new l.TubeGeometry(this.curve,this.segments,this.radius,this.radialSegments,!1),this.mesh.geometry=this.geometry}}class te extends It{controlPoints;constructor(t=[]){super(),this.controlPoints=t}getPoint(t,e=new g){const i=e;if((this.controlPoints.length-1)%3!==0)return console.log("BezierSplineCurve: Not 3p+1 control points!"),i;const n=(this.controlPoints.length-1)/3,o=Math.min(Math.floor(t*n),n-1),a=(t-o/n)*n,h=o*3,c=xi(this.controlPoints[h],this.controlPoints[h+1],this.controlPoints[h+2],this.controlPoints[h+3],a);return c===null?(console.log("BezierSplineCurve:getPoint: Bezier calculation failed!"),i):(i.copy(c),i)}setPoints(t){this.controlPoints=t}copy(t){return t instanceof te?(super.copy(t),this.controlPoints=t.controlPoints.map(e=>e.clone()),this):(console.log("BezierSplineCurve:copy: Source is not an instance of BezierCurve!"),this)}}var Se=(s=>(s[s.OBJECT=0]="OBJECT",s[s.CONTROL_POINTS=1]="CONTROL_POINTS",s))(Se||{});class pt extends A{mode;controlPoints;segments;radius;radialSegments;geometry;material;curve;connectionVisuals;constructor(t,e=[new l.Vector3(-5,0,0),new l.Vector3(0,5,0),new l.Vector3(5,0,0)],i=new l.Color(0),n=100,o=new l.Vector3(0,0,0),a=1){const h=new te(e),c=.05,d=8,m=new l.TubeGeometry(h,n,c,d,!1),u=new l.MeshBasicMaterial({color:i});u.side=l.DoubleSide;const p=new l.Mesh(m,u);super(t,p,o),this.curve=h,this.geometry=m,this.material=u,this.controlPoints=e,this.color=i,this.segments=n,this.mode=a,this.radius=c,this.radialSegments=d,this.type="BezierSplineObject";for(let f=0;f<this.controlPoints.length;f++)f%3===0?this.createEditHandle(f,.3):this.createEditHandle(f,.15),this.setEditHandlePosition(f,this.controlPoints[f]);this.connectionVisuals=[];const b=new l.LineBasicMaterial({color:U()});this.connectionVisuals.push(new l.Line(new l.BufferGeometry().setFromPoints([this.controlPoints[0],this.controlPoints[1]]),b));const w=Math.floor((this.controlPoints.length-1)/3)+1;for(let f=1;f<w-1;f++){const y=2+(f-1)*3,v=[this.controlPoints[y],this.controlPoints[y+1],this.controlPoints[y+2]];this.connectionVisuals.push(new l.Line(new l.BufferGeometry().setFromPoints(v),b))}this.connectionVisuals.push(new l.Line(new l.BufferGeometry().setFromPoints([this.controlPoints[this.controlPoints.length-2],this.controlPoints[this.controlPoints.length-1]]),b)),this.connectionVisuals.forEach(f=>this.mesh.add(f)),this.hideConnectionVisuals(),this.hideEditHandles()}getMode(){return this.mode}setMode(t){this.mode=t,t===0?(this.hideConnectionVisuals(),this.hideEditHandles()):t===1&&(this.showConnectionVisuals(),this.showEditHandles())}toJSON(){return{name:this.name,type:this.type,position:{x:this.mesh.position.x,y:this.mesh.position.y,z:this.mesh.position.z},controlPoints:this.controlPoints.map(t=>({x:t.x,y:t.y,z:t.z})),color:this.color.getHex(),segments:this.segments,mode:this.mode}}static fromJSON(t){const e=t.controlPoints.map(a=>new l.Vector3(a.x,a.y,a.z)),i=new l.Color(t.color),n=new l.Vector3(t.position.x,t.position.y,t.position.z),o=t.mode;if(Se[o]===void 0)throw new Error("Invalid BezierCurveObject mode");return new pt(t.name,e,i,t.segments,n,o)}edit(){return this.editUpdate.bind(this)}editUpdate(){if(this.mode===1){const t=r.getSelectionManager().getSelectedEditHandleIndex();if(t===null)return;const e=this.getEditHandlePosition(t);if(e===null)return;this.updateControlPoint(t,e)}}unedit(){this.hideConnectionVisuals(),this.hideEditHandles()}updateSegments(t){this.segments=t,this.recompute()}updateColor(t){super.setColor(t),this.material.color.set(t)}dispose(){this.material.dispose()}addControlPoint(t,e=!1){if(e){const i=this.controlPoints.length-1;this.controlPoints.unshift(new l.Vector3(0,0,0)),this.createEditHandle(i+1,.15);const n=t.clone().add(this.controlPoints[1].clone().sub(t).setLength(3));this.controlPoints.unshift(n),this.createEditHandle(i+2,.15),this.controlPoints.unshift(t.clone()),this.createEditHandle(i+3,.3);for(let a=0;a<this.controlPoints.length;a++)this.setEditHandlePosition(a,this.controlPoints[a]);this.updateControlPoint(4,this.controlPoints[4]),this.updateControlPoint(0,this.controlPoints[0]);const o=new l.Line(new l.BufferGeometry().setFromPoints([this.controlPoints[0],this.controlPoints[1]]),new l.LineBasicMaterial({color:U()}));this.connectionVisuals.unshift(o),this.mesh.add(o)}else{const i=this.controlPoints.length-1;this.controlPoints.push(new l.Vector3(0,0,0)),this.createEditHandle(i+1,.15);const n=t.clone().add(this.controlPoints[i].clone().sub(t).setLength(3));this.controlPoints.push(n),this.createEditHandle(i+2,.15),this.controlPoints.push(t.clone()),this.createEditHandle(i+3,.3),this.updateControlPoint(i-1,this.controlPoints[i-1]),this.updateControlPoint(i+3,this.controlPoints[i+3]);const o=new l.Line(new l.BufferGeometry().setFromPoints([this.controlPoints[this.controlPoints.length-2],this.controlPoints[this.controlPoints.length-1]]),new l.LineBasicMaterial({color:U()}));this.connectionVisuals.push(o),this.mesh.add(o)}this.recompute(),this.updateConnectionVisuals(),this.controlPoints.length>100?this.updateSegments(1e3):this.controlPoints.length>40&&this.updateSegments(500)}removeControlPoint(t=!1){if(!(this.controlPoints.length<=6)){if(t){this.controlPoints.shift(),this.removeEditHandle(this.controlPoints.length),this.controlPoints.shift(),this.removeEditHandle(this.controlPoints.length),this.controlPoints.shift(),this.removeEditHandle(this.controlPoints.length);for(let i=0;i<this.controlPoints.length;i++)this.setEditHandlePosition(i,this.controlPoints[i]);const e=this.connectionVisuals.shift();e&&this.mesh.remove(e)}else{this.controlPoints.pop(),this.removeEditHandle(this.controlPoints.length),this.controlPoints.pop(),this.removeEditHandle(this.controlPoints.length),this.controlPoints.pop(),this.removeEditHandle(this.controlPoints.length);const e=this.connectionVisuals.pop();e&&this.mesh.remove(e)}this.recompute(),this.updateConnectionVisuals(),this.controlPoints.length<40?this.updateSegments(100):this.controlPoints.length<100&&this.updateSegments(500)}}updateControlPoint(t,e){if(t===0){const i=e.clone().sub(this.controlPoints[0]);this.controlPoints[0].set(e.x,e.y,e.z),this.setEditHandle(0),this.controlPoints[1].add(i),this.setEditHandle(1)}else if(t===1)this.controlPoints[1].set(e.x,e.y,e.z),this.setEditHandle(1);else if(t===this.controlPoints.length-1){const i=e.clone().sub(this.controlPoints[this.controlPoints.length-1]);this.controlPoints[this.controlPoints.length-1].set(e.x,e.y,e.z),this.setEditHandle(this.controlPoints.length-1),this.controlPoints[this.controlPoints.length-2].add(i),this.setEditHandle(this.controlPoints.length-2)}else if(t===this.controlPoints.length-2)this.controlPoints[this.controlPoints.length-2].set(e.x,e.y,e.z),this.setEditHandle(this.controlPoints.length-2);else if(t%3===0){const i=e.clone().sub(this.controlPoints[t]);this.controlPoints[t].set(e.x,e.y,e.z),this.setEditHandle(t),this.controlPoints[t-1].add(i),this.setEditHandle(t-1),this.controlPoints[t+1].add(i),this.setEditHandle(t+1)}else if(t%3===1){this.controlPoints[t].set(e.x,e.y,e.z),this.setEditHandle(t);const n=this.controlPoints[t-1].clone().multiplyScalar(2).sub(e);this.controlPoints[t-2].set(n.x,n.y,n.z),this.setEditHandle(t-2)}else if(t%3===2){this.controlPoints[t].set(e.x,e.y,e.z),this.setEditHandle(t);const n=this.controlPoints[t+1].clone().multiplyScalar(2).sub(e);this.controlPoints[t+2].set(n.x,n.y,n.z),this.setEditHandle(t+2)}this.recompute(),this.updateConnectionVisuals()}setEditHandle(t){this.hasEditHandle(t)&&this.setEditHandlePosition(t,this.controlPoints[t])}getControlPoint(t){return this.controlPoints[t]}getControlPoints(){return this.controlPoints.slice()}highlight(){this.material.color.set(K())}resetHighlight(){this.resetColor()}select(){this.material.color.set(U())}resetSelect(){this.resetColor()}resetColor(){this.material.color.set(this.color)}hideConnectionVisuals(){this.connectionVisuals!==null&&this.connectionVisuals.forEach(t=>t.visible=!1)}showConnectionVisuals(){this.connectionVisuals!==null&&this.connectionVisuals.forEach(t=>t.visible=!0)}updateConnectionVisuals(){if(this.connectionVisuals===null)return;this.connectionVisuals[0].geometry.dispose(),this.connectionVisuals[0].geometry=new l.BufferGeometry().setFromPoints([this.controlPoints[0],this.controlPoints[1]]);const t=Math.floor((this.controlPoints.length-1)/3)+1;for(let e=1;e<t-1;e++){const i=2+(e-1)*3,n=[this.controlPoints[i],this.controlPoints[i+1],this.controlPoints[i+2]];this.connectionVisuals[e].geometry.dispose(),this.connectionVisuals[e].geometry=new l.BufferGeometry().setFromPoints(n)}this.connectionVisuals[this.connectionVisuals.length-1].geometry.dispose(),this.connectionVisuals[this.connectionVisuals.length-1].geometry=new l.BufferGeometry().setFromPoints([this.controlPoints[this.controlPoints.length-2],this.controlPoints[this.controlPoints.length-1]])}recompute(){this.curve.setPoints(this.controlPoints),this.geometry&&this.geometry.dispose(),this.geometry=new l.TubeGeometry(this.curve,this.segments,this.radius,this.radialSegments,!1),this.mesh.geometry=this.geometry}}function Oi(){return`
    uniform sampler2D controlPointsTexture;
    uniform int controlPointsWidth;
    uniform int controlPointsHeight;
    uniform vec3 color;
    uniform int degree;
    uniform bool closedU;
    uniform bool closedV;

    varying vec3 vColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUV;
    varying vec3 vViewPosition;
    varying mat3 vTBN;
    varying vec3 vWorldNormal;

    float delta = 0.0001;

    float getUniformKnotValue(int index){
        return float(index);
    }

    float basis(int p, int i, float t) {
        float B[10]; //max degree 10
        
        for (int j = 0; j <= p; j++) {
            if (t >= getUniformKnotValue(i + j) && t < getUniformKnotValue(i + j + 1))
                B[j] = 1.0;
            else
                B[j] = 0.0;
        }
    
        for (int k = 1; k <= p; k++) {
            for (int j = 0; j <= p - k; j++) {
                float left = 0.0;
                float right = 0.0;
    
                float denomLeft = getUniformKnotValue(i + j + k) - getUniformKnotValue(i + j);
                if (denomLeft > delta)
                    left = ((t - getUniformKnotValue(i + j)) / denomLeft) * B[j];
    
                float denomRight = getUniformKnotValue(i + j + k + 1) - getUniformKnotValue(i + j + 1);
                if (denomRight > delta)
                    right = ((getUniformKnotValue(i + j + k + 1) - t) / denomRight) * B[j + 1];
    
                B[j] = left + right;
            }
        }
    
        return B[0];
    }

    float basisDerivative(int p, int i, float t) {
        if(p == 0) return 0.0;

        float left = 0.0;
        float right = 0.0;

        float denomLeft = getUniformKnotValue(i + p) - getUniformKnotValue(i);
        if(denomLeft > delta)
            left = (float(p) / denomLeft) * basis(p - 1, i, t);

        float denomRight = getUniformKnotValue(i + p + 1) - getUniformKnotValue(i + 1);
        if(denomRight > delta)
            right = (float(p) / denomRight) * basis(p - 1, i + 1, t);

        return left - right;
    }

    vec3 getControlPoint(int i, int j){
        int modI = i % controlPointsWidth;
        int modJ = j % controlPointsHeight;
        vec2 texCoord = vec2(float(modI) / float(controlPointsWidth - 1), float(modJ) / float(controlPointsHeight - 1));
        return texture2D(controlPointsTexture, texCoord).xyz;
    }

    void main(){
        vec2 uvClamped = clamp(uv, 0.0, 1.0);
        float u = uvClamped.x;
        float v = uvClamped.y;

        vec3 basisPoint = vec3(0.0);
        vec3 tangentU = vec3(0.0);
        vec3 tangentV = vec3(0.0);

        int closedAddU = closedU ? degree : 0;
        int closedAddV = closedV ? degree : 0;

        int knotsULength = controlPointsWidth - 1 + degree + 2 + closedAddU;
        int knotsVLength = controlPointsHeight - 1 + degree + 2 + closedAddV;

        for(int i = 0; i < controlPointsWidth + closedAddU; i++){
            float modU = getUniformKnotValue(degree) + u * (getUniformKnotValue(knotsULength - degree - 1) - getUniformKnotValue(degree));
            float basisU = basis(degree, i, modU);
            float basisUDerivative = basisDerivative(degree, i, modU);
            for(int j = 0; j < controlPointsHeight + closedAddV; j++){
                vec3 controlPoint = getControlPoint(i, j);
                float modV = getUniformKnotValue(degree) + v * (getUniformKnotValue(knotsVLength - degree - 1) - getUniformKnotValue(degree));
                float basisV = basis(degree, j, modV);
                float basisVDerivative = basisDerivative(degree, j, modV);
                basisPoint += controlPoint * basisU * basisV;
                tangentU += controlPoint * basisUDerivative * basisV;
                tangentV += controlPoint * basisU * basisVDerivative;
            }
        }

        vColor = color;
        vec3 normal = normalize(cross(tangentU, tangentV));
        vNormal = - normalize(normalMatrix * normal);
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vPosition = (modelMatrix * vec4(basisPoint, 1.0)).xyz;
        vUV = uvClamped;
        vec4 mvPosition = modelViewMatrix * vec4(basisPoint, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;

        mat3 TBN = mat3(
            normalize(normalMatrix * tangentU),
            normalize(normalMatrix * tangentV),
            vNormal
        );
        
        vTBN = TBN;
    }
`}function Nt(s,t,e,i,n=!1,o=!1){const a=[],h=n?i:0,c=o?i:0,d=D(i,s.getWidth()-1+h),m=D(i,s.getHeight()-1+c);for(let u=0;u<e;u++){const p=u/(e-1);for(let b=0;b<t;b++){const w=b/(t-1);a.push(ji(s,w,p,i,d,m,n,o))}}return a}function ji(s,t,e,i,n,o,a=!1,h=!1){const c=new g(0,0,0),d=a?i:0,m=h?i:0;for(let u=0;u<s.getWidth()+d;u++){const p=n[i]+t*(n[n.length-i-1]-n[i]),b=X(i,u,p,n);for(let w=0;w<s.getHeight()+m;w++){const f=s.getPoint(w%s.getHeight(),u%s.getWidth()),y=o[i]+e*(o[o.length-i-1]-o[i]),v=X(i,w,y,o);c.add(f.clone().multiplyScalar(b*v))}}return c}function zt(s,t,e,i,n=!1,o=!1){const a=[],h=n?i:0,c=o?i:0,d=D(i,s.getWidth()-1+h),m=D(i,s.getHeight()-1+c);for(let u=0;u<e;u++){const p=u/(e-1);for(let b=0;b<t;b++){const w=b/(t-1);a.push(Hi(s,w,p,i,d,m,n,o))}}return a}function Hi(s,t,e,i,n,o,a=!1,h=!1){const c=new g(0,0,0);var d=0;const m=a?i:0,u=h?i:0;for(let p=0;p<s.getWidth()+m;p++){const b=n[i]+t*(n[n.length-i-1]-n[i]),w=X(i,p,b,n);for(let f=0;f<s.getHeight()+u;f++){const y=s.getPoint(f%s.getHeight(),p%s.getWidth()),v=s.getPoint4(f%s.getHeight(),p%s.getWidth()).w,j=o[i]+e*(o[o.length-i-1]-o[i]),x=X(i,f,j,o),M=v*w*x;c.add(y.clone().multiplyScalar(M)),d+=M}}return c.divideScalar(d)}var Oe=(s=>(s[s.OBJECT=0]="OBJECT",s[s.CONTROL_POINTS=1]="CONTROL_POINTS",s[s.SHADING=2]="SHADING",s))(Oe||{});class ft extends A{mode;controlPoints;degree;geometry;material;collisionGeometry;collisionMesh;radius=.1;closedU;closedV;constructor(t,e,i,n,o=2,a=new l.Color(0),h=new l.Vector3(0,0,0),c=1,d=new ct,m=!1,u=!1){if(m&&u)throw new Error("Cannot have both closedU and closedV set to true. Please set one of them to false.");const p=new $t(i,n);for(let j=0;j<i;j++)for(let x=0;x<n;x++){const M=j+x*i;p.setPoint(x,j,e[M])}const b=new l.PlaneGeometry(0,0,100,100),w=new Yt(Oi(),p,a,d,{degree:{value:o},closedU:{value:m},closedV:{value:u}}),f=new l.Mesh(b,w.getMaterial());super(t,f,h),this.controlPoints=p,this.geometry=b,this.material=w,this.mode=c,this.color=a,this.degree=o,this.closedU=m,this.closedV=u,this.type="UniformBSplineSurfaceObject",this.export=this.exportMesh.bind(this);for(let j=0;j<i;j++)for(let x=0;x<n;x++){const M=j+x*i;this.createEditHandle(M,this.radius),this.setEditHandlePosition(M,e[M])}this.hideEditHandles(),this.controlPoints.addVisuals(this.mesh);const y=this.controlPoints.getWidth()+3,v=this.controlPoints.getHeight()+3;this.collisionGeometry=G(Nt(this.controlPoints,y,v,this.degree,this.closedU,this.closedV),y,v),this.collisionMesh=new l.Mesh(this.collisionGeometry,new l.MeshBasicMaterial({transparent:!0,opacity:0,visible:!1,side:l.DoubleSide})),this.collisionMesh.userData.collision=!0,this.collisionMesh.userData.object=this,this.mesh.add(this.collisionMesh)}getMode(){return this.mode}setMode(t){this.mode=t,this.mode===0?(this.hideEditHandles(),this.controlPoints.hideVisuals()):this.mode===1?(this.showEditHandles(),this.controlPoints.showVisuals()):this.mode===2&&(this.hideEditHandles(),this.controlPoints.hideVisuals())}toJSON(){return{name:this.name,type:this.type,position:{x:this.mesh.position.x,y:this.mesh.position.y,z:this.mesh.position.z},controlPoints:this.controlPoints.getPoints().map(t=>({x:t.x,y:t.y,z:t.z})),controlPointsWidth:this.controlPoints.getWidth(),controlPointsHeight:this.controlPoints.getHeight(),degree:this.degree,color:this.color.getHex(),mode:this.mode,closedU:this.closedU,closedV:this.closedV,shadingModel:{name:this.material.getShadingModelName(),params:this.material.getShadingModelJSON()}}}static fromJSON(t){const e=t.controlPoints.map(d=>new l.Vector3(d.x,d.y,d.z)),i=new l.Color(t.color),n=new l.Vector3(t.position.x,t.position.y,t.position.z),o=t.mode;if(Oe[o]===void 0)throw new Error("Invalid UniformBSplineSurfaceObjectMode mode");const h=dt()[t.shadingModel.name].create();return h.fromJSON(t.shadingModel.params),new ft(t.name,e,t.controlPointsWidth,t.controlPointsHeight,t.degree,i,n,o,h,t.closedU,t.closedV)}edit(){return this.collisionMesh.userData.collision=!1,this.editUpdate.bind(this)}editUpdate(){if(this.mode===1){const t=r.getSelectionManager().getSelectedEditHandleIndex();if(t===null)return;const e=this.getEditHandlePosition(t);if(e===null)return;this.updateControlPoint(t,e)}}unedit(){this.hideEditHandles(),this.controlPoints.hideVisuals(),this.collisionMesh.userData.collision=!0}updateColor(t){super.setColor(t),this.material.setColor(t)}getMaterial(){return this.material}dispose(){this.material.dispose()}addControlPoint(t,e){if(!this.hasEditHandle(t))return;const i=this.getEditHandlePosition(t);if(i===null)return;const n=Math.floor(t/this.controlPoints.getWidth()),o=t%this.controlPoints.getWidth(),a=i.clone().sub(e),h=new l.Vector3(0,a.y,a.z),c=new l.Vector3(a.x,a.y,0);n===0&&o===0?(this.addControlPointRowCol(n,-1,h),this.addControlPointRowCol(-1,o,c)):n===0&&o===this.controlPoints.getWidth()-1?(this.addControlPointRowCol(n,-1,h),this.addControlPointRowCol(-1,o,c)):n===this.controlPoints.getHeight()-1&&o===0?(this.addControlPointRowCol(-1,o,c),this.addControlPointRowCol(n,-1,h)):n===this.controlPoints.getHeight()-1&&o===this.controlPoints.getWidth()-1?(this.addControlPointRowCol(-1,o,c),this.addControlPointRowCol(n,-1,h)):this.addControlPointRowCol(n,o,a);for(let d=0;d<this.controlPoints.getWidth();d++)for(let m=0;m<this.controlPoints.getHeight();m++){const u=d+m*this.controlPoints.getWidth();this.setEditHandlePosition(u,this.controlPoints.getPoint(m,d))}this.material.updateControlPoints(),this.updateCollisionGeometry()}addControlPointRowCol(t,e,i){var n=0,o=0;t===0?(this.controlPoints.addRow(i,!0),n=this.controlPoints.getWidth(),o=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1)):t===this.controlPoints.getHeight()-1?(this.controlPoints.addRow(i,!1),n=this.controlPoints.getWidth(),o=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1)):e===0?(this.controlPoints.addColumn(i,!0),n=this.controlPoints.getHeight(),o=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight()):e===this.controlPoints.getWidth()-1&&(console.log("Adding column to the right"),this.controlPoints.addColumn(i,!1),n=this.controlPoints.getHeight(),o=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight());for(let a=0;a<n;a++)this.createEditHandle(o+a,this.radius)}removeControlPoint(t){if(this.controlPoints.getWidth()<=3||this.controlPoints.getHeight()<=3||!this.hasEditHandle(t))return;const e=Math.floor(t/this.controlPoints.getWidth()),i=t%this.controlPoints.getWidth();e===0||i===0||e===this.controlPoints.getHeight()-1||i===this.controlPoints.getWidth()-1?(this.removeControlPointRowCol(e,-1),this.removeControlPointRowCol(-1,i)):this.removeControlPointRowCol(e,i);for(let n=0;n<this.controlPoints.getWidth();n++)for(let o=0;o<this.controlPoints.getHeight();o++){const a=n+o*this.controlPoints.getWidth();this.setEditHandlePosition(a,this.controlPoints.getPoint(o,n))}this.getMaxDegree()<this.degree&&(this.degree=this.getMaxDegree()),this.material.updateControlPoints(),this.updateCollisionGeometry()}removeControlPointRowCol(t,e){var i=0,n=0;t===0?(i=this.controlPoints.getWidth(),n=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1),this.controlPoints.removeRow(!0)):t===this.controlPoints.getHeight()-1?(i=this.controlPoints.getWidth(),n=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1),this.controlPoints.removeRow(!1)):e===0?(i=this.controlPoints.getHeight(),n=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight(),this.controlPoints.removeColumn(!0)):e===this.controlPoints.getWidth()-1&&(i=this.controlPoints.getHeight(),n=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight(),this.controlPoints.removeColumn(!1));for(let o=0;o<i;o++)this.removeEditHandle(n+o)}updateControlPoint(t,e){const i=Math.floor(t/this.controlPoints.getWidth()),n=t%this.controlPoints.getWidth();this.controlPoints.setPoint(i,n,e),this.hasEditHandle(t)&&this.setEditHandlePosition(t,e),this.updateCollisionGeometry()}getControlPoint(t){const e=Math.floor(t/this.controlPoints.getWidth()),i=t%this.controlPoints.getWidth();return this.controlPoints.getPoint(e,i)}highlight(){this.material.setColor(K())}resetHighlight(){this.resetColor()}select(){this.resetColor()}resetSelect(){this.resetColor()}resetColor(){this.material.setColor(this.color)}setDegree(t){this.degree=t,this.material.setCustomUniform("degree",this.degree),this.updateCollisionGeometry()}getDegree(){return this.degree}getMaxDegree(){return Math.min(this.controlPoints.getWidth(),this.controlPoints.getHeight())-1}setClosedU(t){this.closedU=t,this.closedV=!1,this.material.setCustomUniform("closedU",this.closedU),this.material.setCustomUniform("closedV",this.closedV),this.updateCollisionGeometry()}setClosedV(t){this.closedV=t,this.closedU=!1,this.material.setCustomUniform("closedU",this.closedU),this.material.setCustomUniform("closedV",this.closedV),this.updateCollisionGeometry()}getClosedU(){return this.closedU}getClosedV(){return this.closedV}updateCollisionGeometry(){this.collisionGeometry.dispose();const t=this.controlPoints.getWidth()+3,e=this.controlPoints.getHeight()+3;this.collisionGeometry=G(Nt(this.controlPoints,t,e,this.degree,this.closedU,this.closedV),t,e),this.collisionMesh.geometry=this.collisionGeometry}exportMesh(){const t=Nt(this.controlPoints,100,100,this.degree,this.closedU,this.closedV),e=G(t,100,100),i=new l.MeshStandardMaterial({color:this.color,side:l.DoubleSide}),n=new l.Mesh(e,i);return n.position.copy(this.mesh.position),n.rotation.copy(this.mesh.rotation),n.scale.copy(this.mesh.scale),n}}function Ii(){return`
    uniform sampler2D controlPointsTexture;
    uniform int controlPointsWidth;
    uniform int controlPointsHeight;
    uniform vec3 color;
    uniform int degree;
    uniform bool closedU;
    uniform bool closedV;

    varying vec3 vColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUV;
    varying vec3 vViewPosition;
    varying mat3 vTBN;
    varying vec3 vWorldNormal;

    float delta = 0.0001;

    float getUniformKnotValue(int index){
        return float(index);
    }

    float basis(int p, int i, float t) {
        float B[10]; //max degree 10
        
        for (int j = 0; j <= p; j++) {
            if (t >= getUniformKnotValue(i + j) && t < getUniformKnotValue(i + j + 1))
                B[j] = 1.0;
            else
                B[j] = 0.0;
        }
    
        for (int k = 1; k <= p; k++) {
            for (int j = 0; j <= p - k; j++) {
                float left = 0.0;
                float right = 0.0;
    
                float denomLeft = getUniformKnotValue(i + j + k) - getUniformKnotValue(i + j);
                if (denomLeft > delta)
                    left = ((t - getUniformKnotValue(i + j)) / denomLeft) * B[j];
    
                float denomRight = getUniformKnotValue(i + j + k + 1) - getUniformKnotValue(i + j + 1);
                if (denomRight > delta)
                    right = ((getUniformKnotValue(i + j + k + 1) - t) / denomRight) * B[j + 1];
    
                B[j] = left + right;
            }
        }
    
        return B[0];
    }

    float basisDerivative(int p, int i, float t) {
        if(p == 0) return 0.0;

        float left = 0.0;
        float right = 0.0;

        float denomLeft = getUniformKnotValue(i + p) - getUniformKnotValue(i);
        if(denomLeft > delta)
            left = (float(p) / denomLeft) * basis(p - 1, i, t);

        float denomRight = getUniformKnotValue(i + p + 1) - getUniformKnotValue(i + 1);
        if(denomRight > delta)
            right = (float(p) / denomRight) * basis(p - 1, i + 1, t);

        return left - right;
    }

    vec4 getControlPoint(int i, int j){
        int modI = i % controlPointsWidth;
        int modJ = j % controlPointsHeight;
        vec2 texCoord = vec2(float(modI) / float(controlPointsWidth - 1), float(modJ) / float(controlPointsHeight - 1));
        return texture2D(controlPointsTexture, texCoord);
    }

    void main(){
        vec2 uvClamped = clamp(uv, 0.0, 1.0);
        float u = uvClamped.x;
        float v = uvClamped.y;

        vec3 numerator = vec3(0.0);
        float denominator = 0.0;
        vec3 numeratorU = vec3(0.0);
        float denominatorU = 0.0;
        vec3 numeratorV = vec3(0.0);
        float denominatorV = 0.0;

        int closedAddU = closedU ? degree : 0;
        int closedAddV = closedV ? degree : 0;

        int knotsULength = controlPointsWidth - 1 + degree + 2 + closedAddU;
        int knotsVLength = controlPointsHeight - 1 + degree + 2 + closedAddV;

        for(int i = 0; i < controlPointsWidth + closedAddU; i++){
            float modU = getUniformKnotValue(degree) + u * (getUniformKnotValue(knotsULength - degree - 1) - getUniformKnotValue(degree));
            float basisU = basis(degree, i, modU);
            float basisUDerivative = basisDerivative(degree, i, modU);

            for(int j = 0; j < controlPointsHeight + closedAddV; j++){
                vec4 controlPoint = getControlPoint(i, j);
                float modV = getUniformKnotValue(degree) + v * (getUniformKnotValue(knotsVLength - degree - 1) - getUniformKnotValue(degree));
                float basisV = basis(degree, j, modV);
                float basisVDerivative = basisDerivative(degree, j, modV);

                float weightedBasis = controlPoint.w * basisU * basisV;
                float weightedBasisU = controlPoint.w * basisUDerivative * basisV;
                float weightedBasisV = controlPoint.w * basisU * basisVDerivative;

                numerator += controlPoint.xyz * weightedBasis;
                denominator += weightedBasis;

                numeratorU += controlPoint.xyz * weightedBasisU;
                denominatorU += weightedBasisU;

                numeratorV += controlPoint.xyz * weightedBasisV;
                denominatorV += weightedBasisV;
            }
        }

        vec3 basisPoint = numerator / denominator;
        vec3 tangentU = (numeratorU / denominator) - (numerator * denominatorU / (denominator * denominator));
        vec3 tangentV = (numeratorV / denominator) - (numerator * denominatorV / (denominator * denominator));

        vColor = color;
        vec3 normal = normalize(cross(tangentU, tangentV));
        vNormal = - normalize(normalMatrix * normal);
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vPosition = (modelMatrix * vec4(basisPoint, 1.0)).xyz;
        vUV = uvClamped;
        vec4 mvPosition = modelViewMatrix * vec4(basisPoint, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;

        mat3 TBN = mat3(
            normalize(normalMatrix * tangentU),
            normalize(normalMatrix * tangentV),
            vNormal
        );
        
        vTBN = TBN;
    }
`}var je=(s=>(s[s.OBJECT=0]="OBJECT",s[s.CONTROL_POINTS=1]="CONTROL_POINTS",s[s.SHADING=2]="SHADING",s))(je||{});class bt extends A{mode;controlPoints;degree;geometry;material;collisionGeometry;collisionMesh;radius=.1;weightEditIndex=-1;weightEditRing;closedU;closedV;constructor(t,e,i,n,o=2,a=new l.Color(0),h=new l.Vector3(0,0,0),c=1,d=new ct,m=!1,u=!1){if(m&&u)throw new Error("Cannot have both closedU and closedV set to true. Please set one of them to false.");const p=new $t(i,n);for(let M=0;M<i;M++)for(let I=0;I<n;I++){const _=M+I*i;p.setPoint4(I,M,e[_])}const b=new l.PlaneGeometry(0,0,100,100),w=new Yt(Ii(),p,a,d,{degree:{value:o},closedU:{value:m},closedV:{value:u}}),f=new l.Mesh(b,w.getMaterial());super(t,f,h),this.controlPoints=p,this.geometry=b,this.material=w,this.mode=c,this.color=a,this.degree=o,this.closedU=m,this.closedV=u,this.type="UniformRationalBSplineSurfaceObject",this.export=this.exportMesh.bind(this);for(let M=0;M<i;M++)for(let I=0;I<n;I++){const _=M+I*i;this.createEditHandle(_,this.radius),this.setEditHandlePosition(_,this.controlPoints.getPoint(I,M))}this.hideEditHandles(),this.controlPoints.addVisuals(this.mesh);const y=this.controlPoints.getWidth()+1,v=this.controlPoints.getHeight()+1;this.collisionGeometry=G(zt(this.controlPoints,y,v,this.degree,this.closedU,this.closedV),y,v),this.collisionMesh=new l.Mesh(this.collisionGeometry,new l.MeshBasicMaterial({transparent:!0,opacity:0,visible:!1,side:l.DoubleSide})),this.collisionMesh.userData.collision=!0,this.collisionMesh.userData.object=this,this.mesh.add(this.collisionMesh);const j=new l.RingGeometry(.05,.06,32),x=new l.MeshBasicMaterial({color:U(),depthTest:!1,side:l.DoubleSide});this.weightEditRing=new l.Mesh(j,x),f.add(this.weightEditRing),this.weightEditRing.visible=!1,r.onOrbitControlsChange(()=>{this.weightEditIndex!==-1&&this.weightEditRing.lookAt(r.getCamera().position)}),window.addEventListener("wheel",M=>{if(this.weightEditIndex!==-1){const I=this.getControlPoint(this.weightEditIndex);I.w+=M.deltaY*.01,I.w<1&&(I.w=1),I.w>10&&(I.w=10),this.updateControlPoint(this.weightEditIndex,I),C.notify("objectChanged",P.VIEWPORT,this)}})}getMode(){return this.mode}setMode(t){this.mode=t,this.mode===0?(this.hideEditHandles(),this.controlPoints.hideVisuals(),this.hideWeightEditRing()):this.mode===1?(this.showEditHandles(),this.controlPoints.showVisuals()):this.mode===2&&(this.hideEditHandles(),this.controlPoints.hideVisuals(),this.hideWeightEditRing())}toJSON(){return{name:this.name,type:this.type,position:{x:this.mesh.position.x,y:this.mesh.position.y,z:this.mesh.position.z},controlPoints:this.controlPoints.getPoints4().map(t=>({x:t.x,y:t.y,z:t.z,w:t.w})),controlPointsWidth:this.controlPoints.getWidth(),controlPointsHeight:this.controlPoints.getHeight(),degree:this.degree,color:this.color.getHex(),mode:this.mode,closedU:this.closedU,closedV:this.closedV,shadingModel:{name:this.material.getShadingModelName(),params:this.material.getShadingModelJSON()}}}static fromJSON(t){const e=t.controlPoints.map(d=>new l.Vector4(d.x,d.y,d.z,d.w)),i=new l.Color(t.color),n=new l.Vector3(t.position.x,t.position.y,t.position.z),o=t.mode;if(je[o]===void 0)throw new Error("Invalid UniformRationalBSplineSurfaceObjectMode mode");const h=dt()[t.shadingModel.name].create();return h.fromJSON(t.shadingModel.params),new bt(t.name,e,t.controlPointsWidth,t.controlPointsHeight,t.degree,i,n,o,h,t.closedU,t.closedV)}edit(){return this.collisionMesh.userData.collision=!1,this.editUpdate.bind(this)}editUpdate(){if(this.mode===1){const t=r.getSelectionManager().getSelectedEditHandleIndex();if(t===null)return;const e=this.getEditHandlePosition(t);if(e===null)return;this.updateControlPoint3(t,e)}}unedit(){this.hideEditHandles(),this.controlPoints.hideVisuals(),this.hideWeightEditRing(),this.collisionMesh.userData.collision=!0}showWeightEditRing(t){this.weightEditIndex=t,this.updateWeightEditRing(),this.weightEditRing.visible=!0,r.noScroll()}hideWeightEditRing(){this.weightEditIndex=-1,this.weightEditRing.visible=!1,r.scroll()}updateWeightEditRing(){if(this.weightEditIndex===-1)return;const t=this.getControlPoint(this.weightEditIndex);this.weightEditRing.position.set(t.x,t.y,t.z);const e=Pe(t.w,1,10,8,20);this.weightEditRing.scale.set(e,e,e),this.weightEditRing.lookAt(r.getCamera().position)}updateColor(t){super.setColor(t),this.material.setColor(t)}getMaterial(){return this.material}dispose(){this.material.dispose()}addControlPoint(t,e){if(!this.hasEditHandle(t))return;const i=this.getEditHandlePosition(t);if(i===null)return;const n=Math.floor(t/this.controlPoints.getWidth()),o=t%this.controlPoints.getWidth(),a=i.clone().sub(e),h=new l.Vector3(0,a.y,a.z),c=new l.Vector3(a.x,a.y,0);n===0&&o===0?(this.addControlPointRowCol(n,-1,h),this.addControlPointRowCol(-1,o,c)):n===0&&o===this.controlPoints.getWidth()-1?(this.addControlPointRowCol(n,-1,h),this.addControlPointRowCol(-1,o,c)):n===this.controlPoints.getHeight()-1&&o===0?(this.addControlPointRowCol(-1,o,c),this.addControlPointRowCol(n,-1,h)):n===this.controlPoints.getHeight()-1&&o===this.controlPoints.getWidth()-1?(this.addControlPointRowCol(-1,o,c),this.addControlPointRowCol(n,-1,h)):this.addControlPointRowCol(n,o,a);for(let d=0;d<this.controlPoints.getWidth();d++)for(let m=0;m<this.controlPoints.getHeight();m++){const u=d+m*this.controlPoints.getWidth();this.setEditHandlePosition(u,this.controlPoints.getPoint(m,d))}this.material.updateControlPoints(),this.updateCollisionGeometry()}addControlPointRowCol(t,e,i){var n=0,o=0;t===0?(this.controlPoints.addRow(i,!0),n=this.controlPoints.getWidth(),o=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1)):t===this.controlPoints.getHeight()-1?(this.controlPoints.addRow(i,!1),n=this.controlPoints.getWidth(),o=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1)):e===0?(this.controlPoints.addColumn(i,!0),n=this.controlPoints.getHeight(),o=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight()):e===this.controlPoints.getWidth()-1&&(console.log("Adding column to the right"),this.controlPoints.addColumn(i,!1),n=this.controlPoints.getHeight(),o=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight());for(let a=0;a<n;a++)this.createEditHandle(o+a,this.radius)}removeControlPoint(t){if(this.controlPoints.getWidth()<=3||this.controlPoints.getHeight()<=3||!this.hasEditHandle(t))return;const e=Math.floor(t/this.controlPoints.getWidth()),i=t%this.controlPoints.getWidth();e===0||i===0||e===this.controlPoints.getHeight()-1||i===this.controlPoints.getWidth()-1?(this.removeControlPointRowCol(e,-1),this.removeControlPointRowCol(-1,i)):this.removeControlPointRowCol(e,i);for(let n=0;n<this.controlPoints.getWidth();n++)for(let o=0;o<this.controlPoints.getHeight();o++){const a=n+o*this.controlPoints.getWidth();this.setEditHandlePosition(a,this.controlPoints.getPoint(o,n))}this.getMaxDegree()<this.degree&&(this.degree=this.getMaxDegree()),this.material.updateControlPoints(),this.updateCollisionGeometry()}removeControlPointRowCol(t,e){var i=0,n=0;t===0?(i=this.controlPoints.getWidth(),n=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1),this.controlPoints.removeRow(!0)):t===this.controlPoints.getHeight()-1?(i=this.controlPoints.getWidth(),n=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1),this.controlPoints.removeRow(!1)):e===0?(i=this.controlPoints.getHeight(),n=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight(),this.controlPoints.removeColumn(!0)):e===this.controlPoints.getWidth()-1&&(i=this.controlPoints.getHeight(),n=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight(),this.controlPoints.removeColumn(!1));for(let o=0;o<i;o++)this.removeEditHandle(n+o)}updateControlPoint3(t,e){this.updateControlPoint(t,new l.Vector4(e.x,e.y,e.z,this.getControlPoint(t).w))}updateControlPoint(t,e){const i=Math.floor(t/this.controlPoints.getWidth()),n=t%this.controlPoints.getWidth();if(this.controlPoints.setPoint4(i,n,e),this.hasEditHandle(t)){const o=new l.Vector3(e.x,e.y,e.z);this.setEditHandlePosition(t,o)}this.updateCollisionGeometry(),this.weightEditIndex===t&&this.updateWeightEditRing()}getControlPoint(t){const e=Math.floor(t/this.controlPoints.getWidth()),i=t%this.controlPoints.getWidth();return this.controlPoints.getPoint4(e,i)}highlight(){this.material.setColor(K())}resetHighlight(){this.resetColor()}select(){this.resetColor()}resetSelect(){this.resetColor()}resetColor(){this.material.setColor(this.color)}setDegree(t){this.degree=t,this.material.setCustomUniform("degree",this.degree),this.updateCollisionGeometry()}getDegree(){return this.degree}getMaxDegree(){return Math.min(this.controlPoints.getWidth(),this.controlPoints.getHeight())-1}setClosedU(t){this.closedU=t,this.closedV=!1,this.material.setCustomUniform("closedU",this.closedU),this.material.setCustomUniform("closedV",this.closedV),this.updateCollisionGeometry()}setClosedV(t){this.closedV=t,this.closedU=!1,this.material.setCustomUniform("closedU",this.closedU),this.material.setCustomUniform("closedV",this.closedV),this.updateCollisionGeometry()}getClosedU(){return this.closedU}getClosedV(){return this.closedV}updateCollisionGeometry(){this.collisionGeometry.dispose();const t=this.controlPoints.getWidth()+1,e=this.controlPoints.getHeight()+1;this.collisionGeometry=G(zt(this.controlPoints,t,e,this.degree,this.closedU,this.closedV),t,e),this.collisionMesh.geometry=this.collisionGeometry}exportMesh(){const t=zt(this.controlPoints,100,100,this.degree,this.closedU,this.closedV),e=G(t,100,100),i=new l.MeshStandardMaterial({color:this.color,side:l.DoubleSide}),n=new l.Mesh(e,i);return n.position.copy(this.mesh.position),n.rotation.copy(this.mesh.rotation),n.scale.copy(this.mesh.scale),n}}class Li{constructor(){}createBasicLinearCurve(){const t=[new g(-5,0,0),new g(0,5,-5),new g(5,0,0)],e=new ut("Linear Curve",t,new H("#7f8c8d"));return r.getObjectManager().addObject(e),e}createJSONLinearCurve(t){const e=ut.fromJSON(t);return r.getObjectManager().addObject(e),e}createBasicBezierCurve(){const t=[new g(-5,0,0),new g(0,5,-5),new g(5,0,0)],e=new st("Bezier Curve",t,new H("#7f8c8d"));return r.getObjectManager().addObject(e),e}createJSONBezierCurve(t){const e=st.fromJSON(t);return r.getObjectManager().addObject(e),e}createBasicBezierSpline(){const t=[new g(-5,0,0),new g(-2,5,-5),new g(2,5,-5),new g(5,0,0)],e=new pt("Bezier Spline",t,new H("#7f8c8d"));return r.getObjectManager().addObject(e),e}createJSONBezierSpline(t){const e=pt.fromJSON(t);return r.getObjectManager().addObject(e),e}createBasicUniformBSpline(){const t=[new g(-5,0,0),new g(0,5,-5),new g(5,0,0)],e=new mt("Uniform B-Spline",t,2,new H("#7f8c8d"));return r.getObjectManager().addObject(e),e}createJSONUniformBSpline(t){const e=mt.fromJSON(t);return r.getObjectManager().addObject(e),e}createBasicURBS(){const t=[new B(-5,0,0,1),new B(0,5,-5,1),new B(5,0,0,1)],e=new gt("Uniform Rational B-Spline",t,2,new H("#7f8c8d"));return r.getObjectManager().addObject(e),e}createJSONURBS(t){const e=gt.fromJSON(t);return r.getObjectManager().addObject(e),e}createBasicBezierPatch(){const t=[new g(-5,0,-5),new g(0,0,-5),new g(5,0,-5),new g(-5,0,0),new g(0,5,0),new g(5,0,0),new g(-5,0,5),new g(0,0,5),new g(5,0,5)],e=new ot("Bezier Patch",t,3,3,new H("#7f8c8d"));return r.getObjectManager().addObject(e),e}createJSONBezierPatch(t){const e=ot.fromJSON(t);return r.getObjectManager().addObject(e),e}createBasicUniformBSplineSurface(){const t=[new g(-5,0,-5),new g(0,0,-5),new g(5,0,-5),new g(-5,0,0),new g(0,5,0),new g(5,0,0),new g(-5,0,5),new g(0,0,5),new g(5,0,5)],e=new ft("Uniform B-Spline Surface",t,3,3,2,new H("#7f8c8d"));return r.getObjectManager().addObject(e),e}createJSONUniformBSplineSurface(t){const e=ft.fromJSON(t);return r.getObjectManager().addObject(e),e}createBasicUniformRationalBSplineSurface(){const t=[new B(-5,0,-5,1),new B(0,0,-5,1),new B(5,0,-5,1),new B(-5,0,0,1),new B(0,5,0,1),new B(5,0,0,1),new B(-5,0,5,1),new B(0,0,5,1),new B(5,0,5,1)],e=new bt("Uniform Rational B-Spline Surface",t,3,3,2,new H("#7f8c8d"));return r.getObjectManager().addObject(e),e}createJSONUniformRationalBSplineSurface(t){const e=bt.fromJSON(t);return r.getObjectManager().addObject(e),e}}class Vi{raycaster;mouse;mouseDown;hoveredObject;hoveredEditHandle;selectedObject;selectedEditHandle;active;canEdit;constructor(){this.raycaster=new l.Raycaster,this.mouse=new l.Vector2,this.mouseDown=new l.Vector2,this.hoveredObject=null,this.hoveredEditHandle=null,this.selectedObject=null,this.selectedEditHandle=null,this.active=!1,this.canEdit=!0;const t=r.getRenderer().domElement;t.addEventListener("mousemove",e=>this.onMouseMove(e)),t.addEventListener("mousedown",e=>this.onMouseDown(e)),t.addEventListener("mouseup",e=>this.onMouseUp(e)),t.addEventListener("mouseenter",()=>this.active=!0),t.addEventListener("mouseleave",()=>this.active=!1),C.subscribe("objectRemoved",P.ALL,e=>{this.selectedObject&&this.selectedObject===e&&this.resetSelected(),this.hoveredObject&&this.hoveredObject===e&&this.resetHovered()})}isActive(){return this.active}getMouse(){return this.mouse}getSelectedObject(){return this.selectedObject}getSelectedEditHandleIndex(){return this.selectedEditHandle?this.selectedEditHandle.getIndex():null}onMouseMove(t){const e=r.getRenderer().domElement;this.mouse.x=t.clientX/e.clientWidth*2-1,this.mouse.y=-(t.clientY/e.clientHeight)*2+1;const i=r.getTooltip();i.style.left=t.clientX+10+"px",i.style.top=t.clientY+10+"px"}onMouseDown(t){this.mouseDown.x=t.clientX,this.mouseDown.y=t.clientY}onMouseUp(t){var e=!1;if(!(Math.abs(this.mouseDown.x-t.clientX)>=5||Math.abs(this.mouseDown.y-t.clientY)>=5)){if(this.hoveredEditHandle){this.selectEditHandle(this.hoveredEditHandle);return}else this.selectedEditHandle&&(this.resetSelectedEditHandle(),e=!0);this.hoveredObject?this.select(this.hoveredObject):e||this.resetSelected()}}update(){if(!this.active)return;this.raycaster.setFromCamera(this.mouse,r.getCamera());const t=this.raycaster.intersectObjects(r.getScene().children,!0),e=r.getObjectManager();if(t.length>0){const i=this.findMesh(t);if(i==null){this.resetHovered(),this.resetHoveredEditHandle();return}if(e.isEditHandle(i)){if(!this.canEdit)return;const o=e.getEditHandleByMesh(i);if(o==null){this.resetHoveredEditHandle();return}else if(this.selectedEditHandle&&this.selectedEditHandle===o)return;this.hoverEditHandle(o);return}else this.resetHoveredEditHandle();const n=e.getVisualObjectByMesh(i);if(n==null){this.resetHovered();return}else if(e.selectable(i)&&!r.isDragging()){if(this.selectedObject&&this.selectedObject===n)return;this.resetHovered(),this.hover(n)}else this.resetHovered()}else this.resetHovered(),this.resetHoveredEditHandle()}enableEditing(){this.canEdit=!0}disableEditing(){this.canEdit=!1,this.resetSelectedEditHandle()}hover(t){r.getHierarchy().viewportHover(t.getUUID()),this.doHover(t),this.showTooltip(t)}hoverEditHandle(t){this.doHoverEditHandle(t),this.showTooltip(t)}doHover(t){this.hoveredObject&&this.hoveredObject!==t&&this.hoveredObject.resetHighlight(),this.hoveredObject=t,this.hoveredObject.highlight()}doHoverEditHandle(t){this.hoveredEditHandle&&this.hoveredEditHandle!==t&&this.hoveredEditHandle.resetHighlight(),this.hoveredEditHandle=t,this.hoveredEditHandle.highlight()}resetHovered(){r.getHierarchy().viewportDehover(),this.doResetHovered(),this.hideTooltip()}resetHoveredEditHandle(){this.doResetHoveredEditHandle(),this.hideTooltip()}doResetHovered(){this.hoveredObject&&(this.hoveredObject.resetHighlight(),this.hoveredObject=null)}doResetHoveredEditHandle(){this.hoveredEditHandle&&(this.hoveredEditHandle.resetHighlight(),this.hoveredEditHandle=null)}select(t){r.getHierarchy().viewportSelect(t.getUUID()),this.doSelect(t)}selectEditHandle(t){this.doSelectEditHandle(t)}doSelect(t){this.selectedObject&&this.selectedObject!==t&&this.doResetSelected(),this.hoveredObject=null,this.selectedObject=t,this.selectedObject.select(),C.notify("objectSelected",P.VIEWPORT,this.selectedObject)}doSelectEditHandle(t){this.selectedEditHandle&&this.selectedEditHandle!==t&&this.doResetSelectedEditHandle(),this.hoveredEditHandle=null,this.selectedEditHandle=t,this.selectedEditHandle.select(),r.getTransformControls().attach(t.getMesh()),C.notify("editHandleSelected",P.VIEWPORT,this.selectedEditHandle)}resetSelected(){r.getHierarchy().viewportDeselect(),this.doResetSelected()}resetSelectedEditHandle(){this.doResetSelectedEditHandle()}doResetSelected(){this.selectedObject&&(this.selectedObject.resetSelect(),this.selectedObject=null,r.getTransformControls().detach(),C.notify("objectUnselected",P.ALL))}doResetSelectedEditHandle(){this.selectedEditHandle&&(this.selectedEditHandle.resetSelect(),this.selectedEditHandle=null,r.getTransformControls().detach(),C.notify("editHandleUnselected",P.ALL))}showTooltip(t){t instanceof A?(r.getTooltip().innerHTML="<b>"+t.getName()+"</b></br><i>Type:</i> "+t.getType(),r.getTooltip().style.display="block"):t instanceof fe&&(r.getTooltip().innerHTML="<b>Control Point - "+(t.getIndex()+1)+"</b></br><i>Object:</i> "+t.getParentObject().getName(),r.getTooltip().style.display="block")}hideTooltip(){r.getTooltip().style.display="none"}findMesh(t){for(const e of t)if(e.object instanceof l.Mesh&&(r.getObjectManager().selectable(e.object)||r.getObjectManager().isEditHandle(e.object)))return e.object;return null}}class Ti{updateCallback;selectedObject;constructor(){this.updateCallback=null,this.selectedObject=null,C.subscribe("objectSelected",P.ALL,t=>this.selectObject(t)),C.subscribe("objectUnselected",P.ALL,()=>this.unselectObject()),C.subscribe("objectChanged",P.ALL,()=>this.update()),C.subscribe("transformMoved",P.VIEWPORT,()=>this.update())}update(){this.updateCallback&&this.updateCallback()}selectObject(t){if(!t){console.error("editManager:selectObject: Object is null!");return}this.selectedObject=t,this.updateCallback=this.selectedObject.edit()}unselectObject(){if(!this.selectedObject){console.error("editManager:unselectObject: Object is null!");return}this.updateCallback=null,this.selectedObject.unedit(),this.selectedObject=null}}class Ui{controls=[];details;constructor(t){const e=document.createElement("div");e.className="controls",this.details=document.createElement("sl-details"),this.details.open=!r.getIOManager().getFlagCache("controlsClosed"),this.details.style.minWidth="120px",this.details.summary="Controls",e.appendChild(this.details),t.appendChild(e),this.initControls(),this.redraw(),C.subscribe("dimensionSwitched",P.ALL,i=>this.redraw()),this.details.addEventListener("sl-after-show",()=>r.getIOManager().setFlagCache("controlsClosed",!1)),this.details.addEventListener("sl-after-hide",()=>r.getIOManager().setFlagCache("controlsClosed",!0))}add(t){this.controls.includes(t)||(this.controls.push(t),this.redraw())}remove(t){const e=this.controls.indexOf(t);e!==-1&&(this.controls.splice(e,1),this.redraw())}redraw(){this.details.innerHTML="",this.controls.forEach(t=>{const e=document.createElement("div");e.innerHTML=t.getHTML(),this.details.appendChild(e)})}initControls(){const t=new S;t.add(new He("Viewport Controls",!1)),t.add(new kt(r.dimension2D.bind(r),"Press <b>D</b> to switch to <b>2D</b>.","Press <b>D</b> to switch to <b>3D</b>.")),t.add(new kt(r.dimension2D.bind(r),"Hold the <b>LMB</b> to <b>orbit</b> around the scene.","Hold the <b>LMB / RMB</b> to pan the camera.")),t.add(new kt(r.dimension2D.bind(r),"Hold the <b>RMB</b> (or shift + LMB) to <b>pan</b> the camera.","")),t.add(new E("<b>Scroll</b> the mouse wheel to <b>zoom</b> in and out.")),t.add(new E("<b>Click</b> on an object to <b>select</b> it.")),this.add(t)}}class Ct{}class He extends Ct{constructor(t,e=!0){super(),this.text=t,this.breakLine=e}getHTML(){return(this.breakLine?"<br>":"")+`<strong>${this.text}</strong>`}}class E extends Ct{constructor(t){super(),this.text=t}getHTML(){return`<span>${this.text}</span>`}}class kt extends Ct{constructor(t,e,i){super(),this.bool=t,this.textFalse=e,this.textTrue=i}getHTML(){return this.bool()?`<span>${this.textTrue}</span>`:`<span>${this.textFalse}</span>`}}class V extends Ct{constructor(t,e){super(),this.key=t,this.value=e}getHTML(){return`<span><strong>${this.key}</strong>: <span>${this.value}</span></span>`}}class S extends Ct{controls=[];constructor(){super()}add(t){this.controls.push(t)}getHTML(){let t="<div>";return this.controls.forEach(e=>{t+=`<div>${e.getHTML()}</div>`}),t+="</div>",t}}class ${constructor(t,e,i){this.name=t,this.lace=e,this.modes=i,this.currentObject=null,this.currentMode=-1,this.controls=new S,this.controls.add(new He(t)),this.controls.add(new V("Q","Switch between modes.")),r.getControls().add(this.controls),r.getInteractionsManager().addKeydown("q",()=>{if(this.currentObject===null||this.currentMode===-1)return;const n=(this.currentMode+1)%this.modes.length;this.showTab(n),this.currentObject.setMode(n)}),this.tab=e.addTab({vertical:!0,onTabChange:()=>C.notify("inspectorTabChanged",P.INSPECTOR)}),i.forEach((n,o)=>{n.disableEditing&&n.objectMode&&console.error("Object mode cannot disable editing.");const a=this.tab.addTab(`Tab-${o}`,n.getIcon(),"lucide");n.build(a),a.registerOnSelected(()=>{this.modeSelected(o),this.resetControls(),r.getControls().add(n.getControls())}),a.registerOnDeSelected(()=>{this.modeDeselected(o),this.resetControls()})}),this.tab.onChange(()=>this.inspectorChanged()),this.hideInspector()}currentObject;currentMode;tab;controls;select(t){this.lace.hideAll(),this.currentObject=t,this.modes.forEach(i=>i.select(t)),this.objectChanged();const e=t.getMode();this.currentMode=e,this.modes[e].setActive(!0),this.showInspector(),this.showTab(e)}deselect(){this.hideInspector(),this.modes.forEach(t=>t.deselect()),this.modes[this.currentMode].setActive(!1),this.currentObject=null}objectChanged(){this.currentObject===null||this.currentMode===-1||(this.modes[this.currentMode].objectChanged(this.currentObject),this.updateTab())}inspectorChanged(){this.currentObject===null||this.currentMode===-1||(this.modes[this.currentMode].inspectorChanged(this.currentObject),C.notify("objectChanged",P.INSPECTOR))}modeSelected(t){this.currentObject===null||t>=this.modes.length||(this.modes[t].objectMode&&this.enableObjectMode(this.currentObject),this.modes[t].disableEditing?r.getSelectionManager().disableEditing():r.getSelectionManager().enableEditing(),this.currentObject.setMode(t),this.currentMode=t,this.modes[t].setActive(!0),this.objectChanged())}modeDeselected(t){t>=this.modes.length||(this.modes[t].objectMode&&this.disableObjectMode(),r.getSelectionManager().enableEditing(),this.modes[t].setActive(!1))}showTab(t){this.tab.show(`Tab-${t}`)}showInspector(){this.lace.show(this.tab),r.getControls().add(this.controls)}hideInspector(){this.lace.hide(this.tab),this.resetControls(),r.getControls().remove(this.controls)}updateTab(){this.tab.update()}resetControls(){this.modes.forEach(t=>r.getControls().remove(t.getControls()))}enableObjectMode(t){r.getTransformControls().attach(t.getMesh()),r.getSelectionManager().disableEditing()}disableObjectMode(){r.getTransformControls().detach(),r.getSelectionManager().enableEditing()}}class O{constructor(t,e,i,n=!1){this.icon=t,this.objectMode=e,this.controls=i,this.disableEditing=n}active=!1;getIcon(){return this.icon}getControls(){return this.controls}setActive(t){this.active=t}}class wt extends ti{container;elements;changeCallback;addCallback;removeCallback;divElements=[];editorElements=[];constructor(t,e,i,n,o,a={}){const{scrollFix:h=!1}=a,c=document.createElement("div");c.style.display="flex",c.style.flexDirection="column",c.style.width="100%",c.style.alignItems="center",c.style.justifyContent="space-between",h&&(c.style.maxHeight="calc(50vh - 2rem)"),super(t,c),this.container=c,this.label=t,this.elements=e,this.changeCallback=i,this.addCallback=n,this.removeCallback=o,this.drawList()}drawList(){this.container.innerHTML="";const t=document.createElement("span");t.innerHTML=this.label,t.style.width="100%",t.style.textAlign="left",t.style.marginBottom="0.5em",t.style.fontSize="var(--sl-input-label-font-size-small)",this.container.appendChild(t),this.elements.forEach((o,a)=>{this.drawElement(a)});const e=document.createElement("sl-button-group");e.style.width="100%";const i=document.createElement("sl-button");i.innerText="Add",i.size="small",i.variant="success",i.outline=!0,i.style.width="50%",i.onclick=()=>this.addCallback();const n=document.createElement("sl-button");n.innerText="Remove",n.size="small",n.variant="danger",n.outline=!0,n.style.width="50%",n.onclick=()=>this.removeCallback(),e.appendChild(i),e.appendChild(n),this.container.appendChild(document.createElement("br")),this.container.appendChild(e),this.container.appendChild(document.createElement("br"))}changedIndex(t){this.changeCallback(t),this.changed()}updateIndex(t){this.editorElements[t].forEach(e=>e.update())}getObj(){return null}getKeys(){return[]}update(){this.drawNewElements(),this.removeOldElements(),this.editorElements.forEach((t,e)=>{t.forEach(i=>i.update())})}setSize(t){}drawNewElements(){const t=this.elements.length-this.divElements.length;for(let e=0;e<t;e++)this.drawElement(this.elements.length-t+e)}removeOldElements(){const t=this.divElements.length-this.elements.length;for(let e=0;e<t;e++)this.divElements.pop().remove()}drawElement(t){const e=document.createElement("div");e.classList.add("list-item"),e.style.width="100%",e.style.display="flex",e.style.flexDirection="row",e.style.justifyContent="space-between",e.style.alignItems="center",e.style.padding="0.5em";const i=document.createElement("span");i.innerHTML="<i>"+(t+1).toString()+"</i>: ",i.style.width="20%",i.style.textAlign="center",i.style.marginRight="1em",e.appendChild(i);const n=document.createElement("div");n.style.display="flex",n.style.flexDirection="column",n.style.minWidth="0",n.style.flexGrow="1",this.editorElements[t]=[];var o=0;this.elements[t].getEditor().forEach(h=>{if(this.editorElements[t].push(h),h.registerUpdateCallback(()=>this.changedIndex(t)),h.setSize("small"),o>0){const c=document.createElement("br");n.appendChild(c)}n.appendChild(h.element),o++}),e.appendChild(n),this.divElements.push(e),this.container.appendChild(e)}}class vt{}class Bi extends ${constructor(t){const e=[new Ri,new Di,new zi,new ki];super("Bezier Curve",t,e)}}let Ri=class extends O{params;constructor(){const t=new S;t.add(new E("<b>Move</b> the object with the transform control.")),super("box",!0,t),this.params={name:"",position:new g,color:"#000000"}}build(t){t.add(new q("",this.params,"name")),t.add(new R("Position",this.params.position,"x","y","z")),t.add(new N("Color",this.params,"color"))}select(t){}deselect(){}objectChanged(t){this.params.name=t.getName(),this.params.position.set(t.getPosition().x,t.getPosition().y,t.getPosition().z),this.params.color=t.getColor().getHexString()}inspectorChanged(t){!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.setName(this.params.name),t.setPosition(this.params.position),t.updateColor(new H(this.params.color))}},Di=class extends O{controlPoints;currentObject;laceList;atFront=!1;constructor(){const t=new S;t.add(new E("<b>Click</b> on a control point to <b>select</b> it.")),t.add(new E("<b>Move</b> the selected control point with the transform controls.")),t.add(new V("E/Insert","Insert a new control point at the last selected endpoint.")),t.add(new V("R/Delete","Remove the last control point.")),super("waypoints",!1,t),this.controlPoints=[],this.currentObject=null,this.laceList=new wt("Control Points",this.controlPoints,this.listChanged.bind(this),this.listAdd.bind(this),this.listRemove.bind(this),{scrollFix:!0}),C.subscribe("editHandleSelected",P.ALL,e=>{this.currentObject&&(e.getIndex()===0?this.atFront=!0:e.getIndex()===this.controlPoints.length-1&&(this.atFront=!1))}),r.getInteractionsManager().addKeydowns(["e","insert"],(()=>{if(!this.active||this.currentObject===null)return;const e=new J;e.setFromCamera(r.getSelectionManager().getMouse(),r.getCamera());const i=new g;r.getCamera().getWorldDirection(i);const n=this.atFront?this.controlPoints[0].getPosition():this.controlPoints[this.controlPoints.length-1].getPosition(),o=new Y().setFromNormalAndCoplanarPoint(i,n),a=new g;e.ray.intersectPlane(o,a),a.x=Math.round(a.x*100)/100,a.y=Math.round(a.y*100)/100,a.z=Math.round(a.z*100)/100,this.addControlPoint(a.sub(this.currentObject.getPosition()),this.atFront)}).bind(this)),r.getInteractionsManager().addKeydowns(["r","delete"],(()=>{this.active&&this.currentObject!==null&&this.removeControlPoint(this.atFront)}).bind(this))}build(t){t.add(this.laceList)}select(t){this.atFront=!1,this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){const e=t.getControlPoints();this.controlPoints.length=0,e.forEach((i,n)=>{this.controlPoints.push(new Ni(i))}),this.laceList.update()}inspectorChanged(t){}listChanged(t){this.currentObject!==null&&this.currentObject.updateControlPoint(t,this.controlPoints[t].getPosition())}listAdd(){if(this.currentObject===null)return;const t=this.controlPoints[this.controlPoints.length-2].getPosition(),e=this.controlPoints[this.controlPoints.length-1].getPosition(),i=Pt(e,t);this.addControlPoint(i)}addControlPoint(t,e=!1){this.currentObject!==null&&(r.getTransformControls().detach(),r.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.addControlPoint(t,e),this.objectChanged(this.currentObject))}listRemove(){this.currentObject!==null&&(this.removeControlPoint(),this.objectChanged(this.currentObject))}removeControlPoint(t=!1){this.currentObject!==null&&(r.getTransformControls().detach(),r.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.removeControlPoint(t),this.objectChanged(this.currentObject))}};class Ni extends vt{position;constructor(t){super(),this.position=t}setPosition(t){this.position.set(t.x,t.y,t.z)}getPosition(){const t=new g;return t.set(this.position.x,this.position.y,this.position.z),t}getEditor(){return[new R("Position",this.position,"x","y","z")]}}class zi extends O{params;currentObject;slider;constructor(){const t=new S;t.add(new E("<b>Hover</b> over the curve to adjust the t-value.")),super("spline",!1,t,!0),this.params={t:0},this.currentObject=null,this.slider=new L("T",this.params,"t",{min:0,max:1,step:.01}),window.addEventListener("mousemove",(e=>{if(!this.active||r.isOrbiting()||this.currentObject===null)return;const i=new J;i.setFromCamera(r.getSelectionManager().getMouse(),r.getCamera());const n=i.intersectObject(this.currentObject.getCollisionMesh(),!1);if(n.length>0){const o=n[0].point.sub(this.currentObject.getPosition());this.currentObject.updateDeCasteljauFromNearestPoint(o),this.params.t=this.currentObject.getDeCasteljauT(),this.slider.update()}}).bind(this))}build(t){t.add(new T("De-Casteljau Visualization")),t.add(this.slider)}select(t){this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){this.params.t=t.getDeCasteljauT()}inspectorChanged(t){t.updateDeCasteljauT(this.params.t)}}class ki extends O{constructor(){const t=new S;super("info",!1,t,!0)}build(t){t.add(new T("A <b>Bezier Curve</b> \\( b(t) \\) is a parametric curve widely used in computer graphics, animation, and design for modeling smooth and scalable shapes.<br />It is defined by a <b>set of control points</b> \\( b_i \\), which determine the curve's shape.The curve starts at the first control point and ends at the last one, with intermediate control points influencing its curvature.<br/>\\[ b(t) = \\sum_{i=0}^{n} \\binom{n}{i} \\, t^{i} \\, (1-t)^{n-i} \\, b_i \\]Where \\( n \\) is the degree of the curve, \\( b_i \\) are the control points, and \\( t \\) varies from 0 to 1.",{block:!0}))}select(t){}deselect(){}objectChanged(t){}inspectorChanged(t){}}class Wi extends ${constructor(t){const e=[new Ai,new Fi];super("Linear Curve",t,e)}}let Ai=class extends O{params;constructor(){const t=new S;t.add(new E("<b>Move</b> the object with the transform control.")),super("box",!0,t),this.params={name:"",position:new g,color:"#000000"}}build(t){t.add(new q("",this.params,"name")),t.add(new R("Position",this.params.position,"x","y","z")),t.add(new N("Color",this.params,"color"))}select(t){}deselect(){}objectChanged(t){this.params.name=t.getName(),this.params.position.set(t.getPosition().x,t.getPosition().y,t.getPosition().z),this.params.color=t.getColor().getHexString()}inspectorChanged(t){!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.setName(this.params.name),t.setPosition(this.params.position),t.updateColor(new H(this.params.color))}},Fi=class extends O{controlPoints;currentObject;laceList;atFront=!1;constructor(){const t=new S;t.add(new E("<b>Click</b> on a control point to <b>select</b> it.")),t.add(new E("<b>Move</b> the selected control point with the transform controls.")),t.add(new V("E/Insert","Insert a new control point at the last selected endpoint.")),t.add(new V("R/Delete","Remove the last control point.")),super("waypoints",!1,t),this.controlPoints=[],this.currentObject=null,this.laceList=new wt("Control Points",this.controlPoints,this.listChanged.bind(this),this.listAdd.bind(this),this.listRemove.bind(this),{scrollFix:!0}),C.subscribe("editHandleSelected",P.ALL,e=>{this.currentObject&&(e.getIndex()===0?this.atFront=!0:e.getIndex()===this.controlPoints.length-1&&(this.atFront=!1))}),r.getInteractionsManager().addKeydowns(["e","insert"],(()=>{if(!this.active||this.currentObject===null)return;const e=new J;e.setFromCamera(r.getSelectionManager().getMouse(),r.getCamera());const i=new g;r.getCamera().getWorldDirection(i);const n=this.atFront?this.controlPoints[0].getPosition():this.controlPoints[this.controlPoints.length-1].getPosition(),o=new Y().setFromNormalAndCoplanarPoint(i,n),a=new g;e.ray.intersectPlane(o,a),a.x=Math.round(a.x*100)/100,a.y=Math.round(a.y*100)/100,a.z=Math.round(a.z*100)/100,this.addControlPoint(a.sub(this.currentObject.getPosition()),this.atFront)}).bind(this)),r.getInteractionsManager().addKeydowns(["r","delete"],(()=>{this.active&&this.currentObject!==null&&this.removeControlPoint(this.atFront)}).bind(this))}build(t){t.add(this.laceList)}select(t){this.atFront=!1,this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){const e=t.getControlPoints();this.controlPoints.length=0,e.forEach((i,n)=>{this.controlPoints.push(new Gi(i))}),this.laceList.update()}inspectorChanged(t){}listChanged(t){this.currentObject!==null&&this.currentObject.updateControlPoint(t,this.controlPoints[t].getPosition())}listAdd(){if(this.currentObject===null)return;const t=this.controlPoints[this.controlPoints.length-2].getPosition(),e=this.controlPoints[this.controlPoints.length-1].getPosition(),i=Pt(e,t);this.addControlPoint(i)}addControlPoint(t,e=!1){this.currentObject!==null&&(r.getTransformControls().detach(),r.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.addControlPoint(t,e),this.objectChanged(this.currentObject))}listRemove(){this.currentObject!==null&&(this.removeControlPoint(),this.objectChanged(this.currentObject))}removeControlPoint(t=!1){this.currentObject!==null&&(r.getTransformControls().detach(),r.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.removeControlPoint(t),this.objectChanged(this.currentObject))}};class Gi extends vt{position;constructor(t){super(),this.position=t}setPosition(t){this.position.set(t.x,t.y,t.z)}getPosition(){const t=new g;return t.set(this.position.x,this.position.y,this.position.z),t}getEditor(){return[new R("Position",this.position,"x","y","z")]}}class Ji extends ${constructor(t){const e=[new Ki,new $i];super("Uniform B-Spline",t,e)}}let Ki=class extends O{params;degreeSlider;constructor(){const t=new S;t.add(new E("<b>Move</b> the object with the transform control.")),super("box",!0,t),this.params={name:"",position:new g,degree:2,color:"#000000",closed:!1},this.degreeSlider=new L("Degree",this.params,"degree",{min:2,max:10,step:1})}build(t){t.add(new q("",this.params,"name")),t.add(new R("Position",this.params.position,"x","y","z")),t.add(new N("Color",this.params,"color")),t.add(this.degreeSlider),t.add(new Kt("Closed",this.params,"closed"))}select(t){}deselect(){}objectChanged(t){this.params.name=t.getName(),this.params.position.set(t.getPosition().x,t.getPosition().y,t.getPosition().z),this.params.color=t.getColor().getHexString(),this.params.degree=t.getDegree(),this.degreeSlider.setMax(t.getControlPoints().length-1),this.params.closed=t.isClosed()}inspectorChanged(t){!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.setName(this.params.name),t.setPosition(this.params.position),t.updateColor(new H(this.params.color)),t.setDegree(this.params.degree),t.setClosed(this.params.closed)}},$i=class extends O{controlPoints;currentObject;laceList;atFront=!1;constructor(){const t=new S;t.add(new E("<b>Click</b> on a control point to <b>select</b> it.")),t.add(new E("<b>Move</b> the selected control point with the transform controls.")),t.add(new V("E/Insert","Insert a new control point at the last selected endpoint.")),t.add(new V("R/Delete","Remove the last control point.")),super("waypoints",!1,t),this.controlPoints=[],this.currentObject=null,this.laceList=new wt("Control Points",this.controlPoints,this.listChanged.bind(this),this.listAdd.bind(this),this.listRemove.bind(this),{scrollFix:!0}),C.subscribe("editHandleSelected",P.ALL,e=>{this.currentObject&&(e.getIndex()===0?this.atFront=!0:e.getIndex()===this.controlPoints.length-1&&(this.atFront=!1))}),r.getInteractionsManager().addKeydowns(["e","insert"],(()=>{if(!this.active||this.currentObject===null)return;const e=new J;e.setFromCamera(r.getSelectionManager().getMouse(),r.getCamera());const i=new g;r.getCamera().getWorldDirection(i);const n=this.atFront?this.controlPoints[0].getPosition():this.controlPoints[this.controlPoints.length-1].getPosition(),o=new Y().setFromNormalAndCoplanarPoint(i,n),a=new g;e.ray.intersectPlane(o,a),a.x=Math.round(a.x*100)/100,a.y=Math.round(a.y*100)/100,a.z=Math.round(a.z*100)/100,this.addControlPoint(a.sub(this.currentObject.getPosition()),this.atFront)}).bind(this)),r.getInteractionsManager().addKeydowns(["r","delete"],(()=>{this.active&&this.currentObject!==null&&this.removeControlPoint(this.atFront)}).bind(this))}build(t){t.add(this.laceList)}select(t){this.atFront=!1,this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){const e=t.getControlPoints();this.controlPoints.length=0,e.forEach((i,n)=>{this.controlPoints.push(new _i(i))}),this.laceList.update()}inspectorChanged(t){}listChanged(t){this.currentObject!==null&&this.currentObject.updateControlPoint(t,this.controlPoints[t].getPosition())}listAdd(){if(this.currentObject===null)return;const t=this.controlPoints[this.controlPoints.length-2].getPosition(),e=this.controlPoints[this.controlPoints.length-1].getPosition(),i=Pt(e,t);this.addControlPoint(i)}addControlPoint(t,e=!1){this.currentObject!==null&&(r.getTransformControls().detach(),r.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.addControlPoint(t,e),this.objectChanged(this.currentObject))}listRemove(){this.currentObject!==null&&(this.removeControlPoint(),this.objectChanged(this.currentObject))}removeControlPoint(t=!1){this.currentObject!==null&&(r.getTransformControls().detach(),r.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.removeControlPoint(t),this.objectChanged(this.currentObject))}};class _i extends vt{position;constructor(t){super(),this.position=t}setPosition(t){this.position.set(t.x,t.y,t.z)}getPosition(){const t=new g;return t.set(this.position.x,this.position.y,this.position.z),t}getEditor(){return[new R("Position",this.position,"x","y","z")]}}class Xi extends ${constructor(t){const e=[new Yi,new qi];super("Uniform Rational B-Spline",t,e)}}let Yi=class extends O{params;degreeSlider;constructor(){const t=new S;t.add(new E("<b>Move</b> the object with the transform control.")),super("box",!0,t),this.params={name:"",position:new g,degree:2,color:"#000000",closed:!1},this.degreeSlider=new L("Degree",this.params,"degree",{min:2,max:10,step:1})}build(t){t.add(new q("",this.params,"name")),t.add(new R("Position",this.params.position,"x","y","z")),t.add(new N("Color",this.params,"color")),t.add(this.degreeSlider),t.add(new Kt("Closed",this.params,"closed"))}select(t){}deselect(){}objectChanged(t){this.params.name=t.getName(),this.params.position.set(t.getPosition().x,t.getPosition().y,t.getPosition().z),this.params.color=t.getColor().getHexString(),this.params.degree=t.getDegree(),this.degreeSlider.setMax(t.getControlPoints().length-1),this.params.closed=t.isClosed()}inspectorChanged(t){!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.setName(this.params.name),t.setPosition(this.params.position),t.updateColor(new H(this.params.color)),t.setDegree(this.params.degree),t.setClosed(this.params.closed)}},qi=class extends O{controlPoints;currentObject;laceList;atFront=!1;constructor(){const t=new S;t.add(new E("<b>Click</b> on a control point to <b>select</b> it.")),t.add(new E("<b>Move</b> the selected control point with the transform controls.")),t.add(new V("E/Insert","Insert a new control point at the last selected endpoint.")),t.add(new V("R/Delete","Remove the last control point.")),t.add(new E("When a control point is selected, <b>scroll</b> to change its weight.")),super("waypoints",!1,t),this.controlPoints=[],this.currentObject=null,this.laceList=new wt("Control Points",this.controlPoints,this.listChanged.bind(this),this.listAdd.bind(this),this.listRemove.bind(this),{scrollFix:!0}),C.subscribe("editHandleSelected",P.ALL,e=>{this.currentObject&&(e.getIndex()===0?this.atFront=!0:e.getIndex()===this.controlPoints.length-1&&(this.atFront=!1),this.currentObject.showWeightEditRing(e.getIndex()))}),C.subscribe("editHandleUnselected",P.ALL,()=>{this.currentObject&&this.currentObject.hideWeightEditRing()}),r.getInteractionsManager().addKeydowns(["e","insert"],(()=>{if(!this.active||this.currentObject===null)return;const e=new J;e.setFromCamera(r.getSelectionManager().getMouse(),r.getCamera());const i=new g;r.getCamera().getWorldDirection(i);const n=this.atFront?this.controlPoints[0].getPosition():this.controlPoints[this.controlPoints.length-1].getPosition(),o=new Y().setFromNormalAndCoplanarPoint(i,n),a=new g;e.ray.intersectPlane(o,a),a.x=Math.round(a.x*100)/100,a.y=Math.round(a.y*100)/100,a.z=Math.round(a.z*100)/100,this.addControlPoint(a.sub(this.currentObject.getPosition()),this.atFront)}).bind(this)),r.getInteractionsManager().addKeydowns(["r","delete"],(()=>{this.active&&this.currentObject!==null&&this.removeControlPoint(this.atFront)}).bind(this))}build(t){t.add(this.laceList)}select(t){this.atFront=!1,this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){const e=t.getControlPoints();this.controlPoints.length=0,e.forEach((i,n)=>{this.controlPoints.push(new Zi(i))}),this.laceList.update()}inspectorChanged(t){}listChanged(t){if(this.currentObject===null)return;const e=this.controlPoints[t].getPosition(),i=new B(e.x,e.y,e.z,this.controlPoints[t].getWeight());this.currentObject.updateControlPoint(t,i)}listAdd(){if(this.currentObject===null)return;const t=this.controlPoints[this.controlPoints.length-2].getPosition(),e=this.controlPoints[this.controlPoints.length-1].getPosition(),i=Pt(e,t);this.addControlPoint(i)}addControlPoint(t,e=!1){if(this.currentObject===null)return;r.getTransformControls().detach(),r.getSelectionManager().doResetSelectedEditHandle();const i=new B(t.x,t.y,t.z,1);this.currentObject.addControlPoint(i,e),this.objectChanged(this.currentObject)}listRemove(){this.currentObject!==null&&(this.removeControlPoint(),this.objectChanged(this.currentObject))}removeControlPoint(t=!1){this.currentObject!==null&&(r.getTransformControls().detach(),r.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.removeControlPoint(t),this.objectChanged(this.currentObject))}};class Zi extends vt{position;constructor(t){super(),this.position=t}setPosition(t){this.position.set(t.x,t.y,t.z,this.position.w)}getPosition(){const t=new g;return t.set(this.position.x,this.position.y,this.position.z),t}setWeight(t){this.position.set(this.position.x,this.position.y,this.position.z,t)}getWeight(){return this.position.w}getEditor(){const t=new R("Position",this.position,"x","y","z"),e=new L("Weight",this.position,"w",{min:1,max:10,step:.5});return[t,e]}}class Qi extends ${constructor(t){const e=[new tn,new en];super("Bezier Spline",t,e)}}let tn=class extends O{params;constructor(){const t=new S;t.add(new E("<b>Move</b> the object with the transform control.")),super("box",!0,t),this.params={name:"",position:new g,color:"#000000"}}build(t){t.add(new q("",this.params,"name")),t.add(new R("Position",this.params.position,"x","y","z")),t.add(new N("Color",this.params,"color"))}select(t){}deselect(){}objectChanged(t){this.params.name=t.getName(),this.params.position.set(t.getPosition().x,t.getPosition().y,t.getPosition().z),this.params.color=t.getColor().getHexString()}inspectorChanged(t){!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.setName(this.params.name),t.setPosition(this.params.position),t.updateColor(new H(this.params.color))}},en=class extends O{controlPoints;currentObject;laceList;atFront=!1;constructor(){const t=new S;t.add(new E("<b>Click</b> on a control point to <b>select</b> it.")),t.add(new E("<b>Move</b> the selected control point with the transform controls.")),t.add(new V("E/Insert","Insert a new control point at the last selected endpoint.")),t.add(new V("R/Delete","Remove the last control point.")),super("waypoints",!1,t),this.controlPoints=[],this.currentObject=null,this.laceList=new wt("Control Points",this.controlPoints,this.listChanged.bind(this),this.listAdd.bind(this),this.listRemove.bind(this),{scrollFix:!0}),C.subscribe("editHandleSelected",P.ALL,e=>{this.currentObject&&(e.getIndex()===0?this.atFront=!0:e.getIndex()===this.controlPoints.length-1&&(this.atFront=!1))}),r.getInteractionsManager().addKeydowns(["e","insert"],(()=>{if(!this.active||this.currentObject===null)return;const e=new J;e.setFromCamera(r.getSelectionManager().getMouse(),r.getCamera());const i=new g;r.getCamera().getWorldDirection(i);const n=this.atFront?this.controlPoints[0].getPosition():this.controlPoints[this.controlPoints.length-1].getPosition(),o=new Y().setFromNormalAndCoplanarPoint(i,n),a=new g;e.ray.intersectPlane(o,a),a.x=Math.round(a.x*100)/100,a.y=Math.round(a.y*100)/100,a.z=Math.round(a.z*100)/100,this.addControlPoint(a.sub(this.currentObject.getPosition()),this.atFront)}).bind(this)),r.getInteractionsManager().addKeydowns(["r","delete"],(()=>{this.active&&this.currentObject!==null&&this.removeControlPoint(this.atFront)}).bind(this))}build(t){t.add(new T("Control Points",{bold:!0})),t.add(new T("Work in progress!",{italic:!0}))}select(t){this.atFront=!1,this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){const e=t.getControlPoints();this.controlPoints.length=0,e.forEach((i,n)=>{this.controlPoints.push(new nn(i))}),this.laceList.update()}inspectorChanged(t){}listChanged(t){this.currentObject!==null&&(this.currentObject.updateControlPoint(t,this.controlPoints[t].getPosition()),this.objectChanged(this.currentObject))}listAdd(){if(this.currentObject===null)return;const t=this.controlPoints[this.controlPoints.length-2].getPosition(),e=this.controlPoints[this.controlPoints.length-1].getPosition(),i=Pt(e,t);this.addControlPoint(i)}addControlPoint(t,e=!1){this.currentObject!==null&&(r.getTransformControls().detach(),r.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.addControlPoint(t,e),this.objectChanged(this.currentObject))}listRemove(){this.currentObject!==null&&(this.removeControlPoint(),this.objectChanged(this.currentObject))}removeControlPoint(t=!1){this.currentObject!==null&&(r.getTransformControls().detach(),r.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.removeControlPoint(t),this.objectChanged(this.currentObject))}};class nn extends vt{position;constructor(t){super(),this.position=t.clone()}setPosition(t){this.position.set(t.x,t.y,t.z)}getPosition(){const t=new g;return t.set(this.position.x,this.position.y,this.position.z),t}getEditor(){return[new R("Position",this.position,"x","y","z")]}}class ee extends O{currentObject;group=void 0;params;constructor(){const t=new S;super("brick-wall",!1,t,!0),this.currentObject=null,this.params={shadingModel:At.name,color:"#000000"}}build(t){t.add(new Lt("Shading Model",this.params,"shadingModel",this.getShadingModelsDropdown())),t.add(new N("Color",this.params,"color")),this.group=t.addGroup(),this.currentObject!==null&&this.currentObject.getMaterial().buildUI(this.group)}select(t){this.currentObject=t,this.group!==void 0&&(this.group.reset(),this.currentObject.getMaterial().buildUI(this.group))}deselect(){this.currentObject=null}objectChanged(t){this.params.color=t.getColor().getHexString(),this.params.shadingModel=t.getMaterial().getShadingModelName()}inspectorChanged(t){if(!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.updateColor(new H(this.params.color)),t.getMaterial().getShadingModelName()!==this.params.shadingModel){const i=this.createShadingModel(this.params.shadingModel);t.getMaterial().setShadingModel(i)}}createShadingModel(t){return dt()[t].create()}getShadingModelsDropdown(){const t=dt(),e={};for(const i in t)e[i]=t[i].name;return e}}class on extends ${constructor(t){const e=[new sn,new rn,new ee];super("Bezier Patch",t,e)}}let sn=class extends O{params;constructor(){const t=new S;t.add(new E("<b>Move</b> the object with the transform control.")),super("box",!0,t),this.params={name:"",position:new g,color:"#000000"}}build(t){t.add(new q("",this.params,"name")),t.add(new R("Position",this.params.position,"x","y","z")),t.add(new N("Color",this.params,"color"))}select(t){}deselect(){}objectChanged(t){this.params.name=t.getName(),this.params.position.set(t.getPosition().x,t.getPosition().y,t.getPosition().z),this.params.color=t.getColor().getHexString()}inspectorChanged(t){!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.setName(this.params.name),t.setPosition(this.params.position),t.updateColor(new H(this.params.color))}},rn=class extends O{currentObject;lastIndex=null;constructor(){const t=new S;t.add(new E("<b>Click</b> on a control point to <b>select</b> it.")),t.add(new E("<b>Move</b> the selected control point with the transform controls.")),t.add(new E("<b>Once you have selected a control point</b> (at the edges):")),t.add(new V("E/Insert","Insert a new row and/or column at the mouse position.")),t.add(new V("R/Delete","Remove the last row and/or column.")),super("waypoints",!1,t),this.currentObject=null,C.subscribe("editHandleSelected",P.ALL,e=>{this.currentObject&&(this.lastIndex=e.getIndex())}),C.subscribe("editHandleUnselected",P.ALL,()=>{this.lastIndex=null}),r.getInteractionsManager().addKeydowns(["e","insert"],(()=>{if(!this.active||this.currentObject===null||this.lastIndex===null)return;const e=new J;e.setFromCamera(r.getSelectionManager().getMouse(),r.getCamera());const i=new g;r.getCamera().getWorldDirection(i);const n=this.currentObject.getControlPoint(this.lastIndex),o=new Y().setFromNormalAndCoplanarPoint(i,n),a=new g;e.ray.intersectPlane(o,a),a.x=Math.round(a.x*100)/100,a.y=Math.round(a.y*100)/100,a.z=Math.round(a.z*100)/100,this.addControlPoint(this.lastIndex,a)}).bind(this)),r.getInteractionsManager().addKeydowns(["r","delete"],(()=>{this.active&&this.currentObject!==null&&this.lastIndex!==null&&this.removeControlPoint(this.lastIndex)}).bind(this))}build(t){t.add(new T("Control Points",{bold:!0})),t.add(new T("Work in progress!",{italic:!0}))}select(t){this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){}inspectorChanged(t){}addControlPoint(t,e){this.currentObject&&(r.getTransformControls().detach(),r.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.addControlPoint(t,e),this.objectChanged(this.currentObject))}removeControlPoint(t){this.currentObject!==null&&(r.getTransformControls().detach(),r.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.removeControlPoint(t),this.objectChanged(this.currentObject))}};class an extends ${constructor(t){const e=[new ln,new hn,new ee];super("Uniform B-Spline Surface",t,e)}}let ln=class extends O{params;degreeSlider;constructor(){const t=new S;t.add(new E("<b>Move</b> the object with the transform control.")),super("box",!0,t),this.params={name:"",position:new g,color:"#000000",degree:0,closed:"none"},this.degreeSlider=new L("Degree",this.params,"degree",{min:2,max:10,step:1})}build(t){t.add(new q("",this.params,"name")),t.add(new R("Position",this.params.position,"x","y","z")),t.add(new N("Color",this.params,"color")),t.add(this.degreeSlider),t.add(new Lt("Closed",this.params,"closed",{none:"None",u:"X",v:"Y"}))}select(t){}deselect(){}objectChanged(t){this.params.name=t.getName(),this.params.position.set(t.getPosition().x,t.getPosition().y,t.getPosition().z),this.params.color=t.getColor().getHexString(),this.params.degree=t.getDegree(),this.degreeSlider.setMax(t.getMaxDegree()),this.params.closed=t.getClosedU()?"u":t.getClosedV()?"v":"none"}inspectorChanged(t){!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.setName(this.params.name),t.setPosition(this.params.position),t.updateColor(new H(this.params.color)),t.setDegree(this.params.degree),this.params.closed==="u"?t.setClosedU(!0):this.params.closed==="v"?t.setClosedV(!0):(t.setClosedU(!1),t.setClosedV(!1))}},hn=class extends O{currentObject;lastIndex=null;constructor(){const t=new S;t.add(new E("<b>Click</b> on a control point to <b>select</b> it.")),t.add(new E("<b>Move</b> the selected control point with the transform controls.")),t.add(new E("<b>Once you have selected a control point</b> (at the edges):")),t.add(new V("E/Insert","Insert a new row and/or column at the mouse position.")),t.add(new V("R/Delete","Remove the last row and/or column.")),super("waypoints",!1,t),this.currentObject=null,C.subscribe("editHandleSelected",P.ALL,e=>{this.currentObject&&(this.lastIndex=e.getIndex())}),C.subscribe("editHandleUnselected",P.ALL,()=>{this.lastIndex=null}),r.getInteractionsManager().addKeydowns(["e","insert"],(()=>{if(!this.active||this.currentObject===null||this.lastIndex===null)return;const e=new J;e.setFromCamera(r.getSelectionManager().getMouse(),r.getCamera());const i=new g;r.getCamera().getWorldDirection(i);const n=this.currentObject.getControlPoint(this.lastIndex),o=new Y().setFromNormalAndCoplanarPoint(i,n),a=new g;e.ray.intersectPlane(o,a),a.x=Math.round(a.x*100)/100,a.y=Math.round(a.y*100)/100,a.z=Math.round(a.z*100)/100,this.addControlPoint(this.lastIndex,a)}).bind(this)),r.getInteractionsManager().addKeydowns(["r","delete"],(()=>{this.active&&this.currentObject!==null&&this.lastIndex!==null&&this.removeControlPoint(this.lastIndex)}).bind(this))}build(t){t.add(new T("Control Points",{bold:!0})),t.add(new T("Work in progress!",{italic:!0}))}select(t){this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){}inspectorChanged(t){}addControlPoint(t,e){this.currentObject&&(r.getTransformControls().detach(),r.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.addControlPoint(t,e),this.objectChanged(this.currentObject))}removeControlPoint(t){this.currentObject!==null&&(r.getTransformControls().detach(),r.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.removeControlPoint(t),this.objectChanged(this.currentObject))}};class cn extends ${constructor(t){const e=[new dn,new un,new ee];super("Uniform Rational B-Spline Surface",t,e)}}class dn extends O{params;degreeSlider;constructor(){const t=new S;t.add(new E("<b>Move</b> the object with the transform control.")),super("box",!0,t),this.params={name:"",position:new g,color:"#000000",degree:0,closed:"none"},this.degreeSlider=new L("Degree",this.params,"degree",{min:2,max:10,step:1})}build(t){t.add(new q("",this.params,"name")),t.add(new R("Position",this.params.position,"x","y","z")),t.add(new N("Color",this.params,"color")),t.add(this.degreeSlider),t.add(new Lt("Closed",this.params,"closed",{none:"None",u:"X",v:"Y"}))}select(t){}deselect(){}objectChanged(t){this.params.name=t.getName(),this.params.position.set(t.getPosition().x,t.getPosition().y,t.getPosition().z),this.params.color=t.getColor().getHexString(),this.params.degree=t.getDegree(),this.degreeSlider.setMax(t.getMaxDegree()),this.params.closed=t.getClosedU()?"u":t.getClosedV()?"v":"none"}inspectorChanged(t){!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.setName(this.params.name),t.setPosition(this.params.position),t.updateColor(new H(this.params.color)),t.setDegree(this.params.degree),this.params.closed==="u"?t.setClosedU(!0):this.params.closed==="v"?t.setClosedV(!0):(t.setClosedU(!1),t.setClosedV(!1))}}class un extends O{currentObject;lastIndex=null;constructor(){const t=new S;t.add(new E("<b>Click</b> on a control point to <b>select</b> it.")),t.add(new E("<b>Move</b> the selected control point with the transform controls.")),t.add(new E("When a control point is selected, <b>scroll</b> to change its weight.")),t.add(new E("<b>Once you have selected a control point</b> (at the edges):")),t.add(new V("E/Insert","Insert a new row and/or column at the mouse position.")),t.add(new V("R/Delete","Remove the last row and/or column.")),super("waypoints",!1,t),this.currentObject=null,C.subscribe("editHandleSelected",P.ALL,e=>{this.currentObject&&(this.lastIndex=e.getIndex(),this.currentObject.showWeightEditRing(e.getIndex()))}),C.subscribe("editHandleUnselected",P.ALL,()=>{this.lastIndex=null,this.currentObject&&this.currentObject.hideWeightEditRing()}),r.getInteractionsManager().addKeydowns(["e","insert"],(()=>{if(!this.active||this.currentObject===null||this.lastIndex===null)return;const e=new J;e.setFromCamera(r.getSelectionManager().getMouse(),r.getCamera());const i=new g;r.getCamera().getWorldDirection(i);const n=this.currentObject.getControlPoint(this.lastIndex),o=new g(n.x,n.y,n.z),a=new Y().setFromNormalAndCoplanarPoint(i,o),h=new g;e.ray.intersectPlane(a,h),h.x=Math.round(h.x*100)/100,h.y=Math.round(h.y*100)/100,h.z=Math.round(h.z*100)/100,this.addControlPoint(this.lastIndex,h)}).bind(this)),r.getInteractionsManager().addKeydowns(["r","delete"],(()=>{this.active&&this.currentObject!==null&&this.lastIndex!==null&&this.removeControlPoint(this.lastIndex)}).bind(this))}build(t){t.add(new T("Control Points",{bold:!0})),t.add(new T("Work in progress!",{italic:!0}))}select(t){this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){}inspectorChanged(t){}addControlPoint(t,e){this.currentObject&&(r.getTransformControls().detach(),r.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.addControlPoint(t,e),this.objectChanged(this.currentObject))}removeControlPoint(t){this.currentObject!==null&&(r.getTransformControls().detach(),r.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.removeControlPoint(t),this.objectChanged(this.currentObject))}}var Ie=(s=>(s[s.BezierPatch=0]="BezierPatch",s[s.UBSSurface=1]="UBSSurface",s[s.URBSSurface=2]="URBSSurface",s[s.SPHERE=99]="SPHERE",s))(Ie||{});class mn{type;constructor(t){this.type=t}}class gn extends mn{center;radius;color;constructor(t,e,i){super(99),this.center=t,this.radius=e,this.color=i}}class pn{dialog;constructor(){this.dialog=document.createElement("sl-dialog"),this.dialog.noHeader=!0,this.dialog.style.color="var(--sl-input-color)",this.dialog.style.fontFamily="var(--sl-font-sans)",this.dialog.addEventListener("sl-request-close",t=>{t.preventDefault()}),this.dialog.innerHTML=`
            <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; height: 100%;">
                <sl-spinner></sl-spinner>
                <h4 style="margin-left: 10px;">Raytracing...</h4>
            </div>
        `,r.getApp().appendChild(this.dialog)}show(){this.dialog.show()}hide(){this.dialog.hide()}}class de{static dialog=null;static prepareTask(t,e,i,n){const o=r.getPerspectiveCamera();if(o===null)throw new Error("Trying to raytrace in 2D mode!");const h=r.getDirectionalLight().position.clone().normalize(),c=[new gn(new l.Vector3(0,0,0),1,new l.Color(1,1,1))];return{width:t,height:e,bounces:i,skybox:n,objects:c,ambientLight:{color:r.getAmbientLight().color.clone(),intensity:r.getAmbientLight().intensity},directionalLight:{direction:h,color:r.getDirectionalLight().color.clone(),intensity:r.getDirectionalLight().intensity},camera:{position:o.position.clone(),rotation:o.rotation.clone(),fov:o.fov,up:o.up.clone()}}}static execute(t){this.dialog||(this.dialog=new pn),this.dialog.show();const e=new Worker(new URL("/assets/raytracerWorker-B-3tCVgt.js",import.meta.url),{type:"module"});e.onmessage=this.onMessage.bind(this),e.postMessage(t)}static onMessage(t){this.downloadImage(t.data.data,t.data.width,t.data.height),this.dialog?.hide()}static raytrace(t,e,i,n,o,a,h){const c=new l.Color(0,0,0);var d=Number.MAX_VALUE;for(const m of o)if(m.type===Ie.SPHERE){const u=m,p=this.raytraceSphere(u,t,e,a,h);p.hit&&p.distance<d&&(d=p.distance,c.copy(p.color))}return d===Number.MAX_VALUE?n?this.raytraceSkybox(e,new l.Color(.5,.7,1)):new l.Color(0,0,0):c}static raytraceSphere(t,e,i,n,o){const a=e.clone().sub(t.center),h=i.dot(i),c=2*a.dot(i),d=a.dot(a)-t.radius*t.radius,m=c*c-4*h*d;if(m<0)return{color:new l.Color(0,0,0),hit:!1,distance:0};{const u=(-c-Math.sqrt(m))/(2*h),b=e.clone().add(i.clone().multiplyScalar(u)).clone().sub(t.center).normalize(),w=Math.max(0,b.dot(o.direction.normalize()))*o.intensity,f=o.color.clone().multiplyScalar(w),v=n.color.clone().multiplyScalar(n.intensity).add(f);return{color:new l.Color(t.color.r,t.color.g,t.color.b).multiply(v),hit:!0,distance:u}}}static raytraceSkybox(t,e){const i=t.y,n=new l.Color(.5,.5,.5),o=new l.Color(.2,.2,.2),a=e.clone().multiplyScalar(.5),h=e.clone(),c=.5*(i+1);return i>0?h.clone().lerp(a,c):o.clone().lerp(n,c)}static setPixel(t,e,i,n,o){const a=(n*e+i)*4;t[a]=Math.floor(o.r*255),t[a+1]=Math.floor(o.g*255),t[a+2]=Math.floor(o.b*255),t[a+3]=255}static downloadImage(t,e,i){const n=new ImageData(t,e,i),o=document.createElement("canvas");o.width=e,o.height=i;const a=o.getContext("2d");if(a){a.putImageData(n,0,0);const h=o.toDataURL("image/png"),c=document.createElement("a");c.href=h,c.download="raytrace.png",c.click()}else throw new Error("Failed to get canvas context")}}class fn extends O{params;raytraceButton;constructor(){const t=new S;super("trending-up-down",!1,t,!0),this.params={width:512,height:512,bounces:0,skybox:!1},this.raytraceButton=new ei("Raytrace",this.startRaytracer.bind(this),{variant:"primary",prefixIcon:"play",iconLibrary:"lucide"}),C.subscribe("dimensionSwitched",P.ALL,()=>{this.raytraceButton.setDisabled(r.dimension2D())})}build(t){t.add(new T("Raytracer",{bold:!0})),t.add(new L("Width",this.params,"width",{min:128,max:4096,step:128})),t.add(new L("Height",this.params,"height",{min:128,max:4096,step:128})),t.add(new L("Bounces",this.params,"bounces",{min:0,max:10,step:1})),t.add(this.raytraceButton)}startRaytracer(){try{const t=de.prepareTask(this.params.width,this.params.height,this.params.bounces,this.params.skybox);de.execute(t)}catch(t){console.error("Raytracer error:",t)}}select(t){}deselect(){}objectChanged(t){}inspectorChanged(t){}}class bn extends ${constructor(t){const e=[new Pn,new Cn,new wn,new fn];super("Scene",t,e)}}class Pn extends O{dirParams;ambParams;constructor(){const t=new S;super("sun",!1,t,!0),this.dirParams={dirLightRotation:0,dirLightIntensity:1,dirLightColor:"#ffffff"},this.ambParams={ambLightIntensity:.2,ambLightColor:"#f0f0f0"}}build(t){t.add(new T("Directional Light",{bold:!0})),t.add(new L("Rotation",this.dirParams,"dirLightRotation",{min:0,max:360,step:1}).onChange(this.updateDirectionalLight.bind(this))),t.add(new L("Intensity",this.dirParams,"dirLightIntensity",{min:.5,max:3,step:.1}).onChange(this.updateDirectionalLight.bind(this))),t.add(new N("Color",this.dirParams,"dirLightColor").onChange(this.updateDirectionalLight.bind(this))),t.add(new ii),t.add(new T("Ambient Light",{bold:!0})),t.add(new L("Intensity",this.ambParams,"ambLightIntensity",{min:0,max:1,step:.1}).onChange(this.updateAmbientLight.bind(this))),t.add(new N("Color",this.ambParams,"ambLightColor").onChange(this.updateAmbientLight.bind(this)))}updateDirectionalLight(){const e=Math.PI/180*this.dirParams.dirLightRotation,i=15*Math.cos(e),n=15*Math.sin(e);r.getDirectionalLight().position.set(i,20,n),r.getDirectionalLight().intensity=this.dirParams.dirLightIntensity,r.getDirectionalLight().color.set(this.dirParams.dirLightColor)}updateAmbientLight(){r.getAmbientLight().intensity=this.ambParams.ambLightIntensity,r.getAmbientLight().color.set(this.ambParams.ambLightColor)}select(t){this.objectChanged(t)}deselect(){}objectChanged(t){this.dirParams.dirLightRotation=t.dirRotation,this.dirParams.dirLightIntensity=t.dirIntensity,this.dirParams.dirLightColor=t.dirColor,this.ambParams.ambLightIntensity=t.ambIntensity,this.ambParams.ambLightColor=t.ambColor,this.updateDirectionalLight(),this.updateAmbientLight()}inspectorChanged(t){t.dirRotation=this.dirParams.dirLightRotation,t.dirIntensity=this.dirParams.dirLightIntensity,t.dirColor=this.dirParams.dirLightColor,t.ambIntensity=this.ambParams.ambLightIntensity,t.ambColor=this.ambParams.ambLightColor}}class Cn extends O{params;exrLoader;constructor(){const t=new S;super("tent-tree",!1,t,!0),this.params={exrName:"outdoor",exrIntensity:1,showBackground:!1},this.exrLoader=new $e,C.subscribe("dimensionSwitched",P.ALL,()=>{this.updateBackground()})}build(t){t.add(new T("Scene Enviroment",{bold:!0})),t.add(new Lt("Map",this.params,"exrName",{outdoor:"Outdoor",indoor:"Indoor",space:"Space",northernLights:"Northern Lights"}).onChange(this.updateEnviroment.bind(this))),t.add(new L("Intensity",this.params,"exrIntensity",{min:0,max:5,step:.1}).onChange(this.updateEnviromentIntensity.bind(this))),t.add(new Kt("Show Background",this.params,"showBackground",{help:"Background will only be shown in 3D Mode."}).onChange(this.updateBackground.bind(this)))}updateEnviroment(){this.exrLoader.load(`/exrs/${this.params.exrName}.exr`,t=>{t.mapping=Ae,t.minFilter=t.magFilter=Fe,t.flipY=!1,r.getScene().environment=t,r.getScene().environmentIntensity=this.params.exrIntensity,this.params.showBackground&&!r.dimension2D()?(r.getScene().background=t,r.getScene().backgroundIntensity=this.params.exrIntensity):(r.getScene().background=new H(Ft()),r.getScene().backgroundIntensity=1),t.dispose(),C.notify("enviromentChanged",P.ALL)})}updateEnviromentIntensity(){r.getScene().environmentIntensity=this.params.exrIntensity,this.params.showBackground&&(r.getScene().backgroundIntensity=this.params.exrIntensity),C.notify("enviromentIntensityChanged",P.ALL)}updateBackground(){this.params.showBackground&&!r.dimension2D()?(r.getScene().background=r.getScene().environment,r.getScene().backgroundIntensity=this.params.exrIntensity):(r.getScene().background=new H(Ft()),r.getScene().backgroundIntensity=1)}select(t){r.getScene().environment===null&&this.updateEnviroment(),this.objectChanged(t)}deselect(){}objectChanged(t){t.envMap!==this.params.exrName?(this.params.exrName=t.envMap,this.params.exrIntensity=t.envIntensity,this.updateEnviroment()):t.envIntensity!==this.params.exrIntensity&&(this.params.exrIntensity=t.envIntensity,this.updateEnviromentIntensity())}inspectorChanged(t){t.envMap=this.params.exrName,t.envIntensity=this.params.exrIntensity}}class wn extends O{constructor(){const t=new S;super("cog",!1,t,!0)}build(t){t.add(new T("General Settings",{bold:!0})),t.add(new T("Work in progress!",{italic:!0}))}select(t){}deselect(){}objectChanged(t){}inspectorChanged(t){}}class vn{lace;currentInspector;objectInspectors;constructor(t){this.currentInspector=null,this.lace=new ni(t),this.objectInspectors=new Map,this.objectInspectors.set("scene",new bn(this.lace)),this.objectInspectors.set("linearCurve",new Wi(this.lace)),this.objectInspectors.set("bezierCurve",new Bi(this.lace)),this.objectInspectors.set("bezierSpline",new Qi(this.lace)),this.objectInspectors.set("uniformBSplineCurve",new Ji(this.lace)),this.objectInspectors.set("urbsCurve",new Xi(this.lace)),this.objectInspectors.set("bezierPatch",new on(this.lace)),this.objectInspectors.set("uniformBSplineSurface",new an(this.lace)),this.objectInspectors.set("uniformRationalBSplineSurface",new cn(this.lace)),C.subscribe("start",P.ALL,()=>this.updateInspector(null)),C.subscribe("objectSelected",P.ALL,e=>this.updateInspector(e)),C.subscribe("objectUnselected",P.ALL,()=>this.updateInspector(null)),C.subscribe("objectRemoved",P.ALL,()=>this.updateInspector(null)),C.subscribe("objectChanged",P.VIEWPORT,()=>this.objectChanged()),C.subscribe("transformMoved",P.VIEWPORT,()=>this.objectChanged()),C.subscribe("sceneReset",P.ALL,()=>this.updateInspector(null))}updateInspector(t){if(!t){this.lace.hideAll(),this.currentInspector?.deselect();const i=this.objectInspectors.get("scene");if(i!==void 0){i.select(r.getSceneProxy()),this.currentInspector=i;return}this.currentInspector=null;return}var e=void 0;t instanceof ut?e=this.objectInspectors.get("linearCurve"):t instanceof st?e=this.objectInspectors.get("bezierCurve"):t instanceof pt?e=this.objectInspectors.get("bezierSpline"):t instanceof mt?e=this.objectInspectors.get("uniformBSplineCurve"):t instanceof gt?e=this.objectInspectors.get("urbsCurve"):t instanceof ot?e=this.objectInspectors.get("bezierPatch"):t instanceof ft?e=this.objectInspectors.get("uniformBSplineSurface"):t instanceof bt&&(e=this.objectInspectors.get("uniformRationalBSplineSurface")),e?(e.select(t),this.currentInspector=e):(this.lace.hideAll(),this.currentInspector=null)}objectChanged(){this.currentInspector&&this.currentInspector.objectChanged()}}class yn{selectionChanged;constructor(t,e,i){this.selectionChanged=e;const n=document.createElement("div"),o=document.createElement("sl-button-group");o.style.width="100%";const a=document.createElement("sl-dropdown");a.style.width="100%",a.hoist=!0,a.placement="bottom",o.appendChild(a);const h=document.createElement("sl-button");h.size="small",h.variant="danger",h.addEventListener("mousedown",i);const c=document.createElement("sl-icon");c.style.fontSize="1.3em",c.name="x-lg",c.slot="prefix";const d=document.createElement("span");d.textContent="Remove",h.appendChild(c),h.appendChild(d),o.appendChild(h),n.appendChild(o);const m=document.createElement("sl-button");m.slot="trigger",m.caret=!0,m.size="small",m.style.width="100%",m.variant="neutral";const u=document.createElement("sl-icon");u.style.fontSize="1.3em",u.name="plus-lg",u.slot="prefix";const p=document.createElement("span");p.textContent="Add",m.appendChild(u),m.appendChild(p),a.appendChild(m);const b=document.createElement("sl-menu");a.appendChild(b);const w=document.createElement("sl-menu-label");w.textContent="Curves",b.appendChild(w),b.appendChild(this.addNewObject("Linear Curve","LinearCurveObject",this.addLinearCurve.bind(this))),b.appendChild(this.addNewObject("Bezier Curve","BezierCurveObject",this.addBezierCurve.bind(this))),b.appendChild(this.addNewObject("Bezier Spline","BezierSplineObject",this.addBezierSpline.bind(this))),b.appendChild(this.addNewObject("Uniform B-Spline","UniformBSplineObject",this.addUniformBSplineCurve.bind(this))),b.appendChild(this.addNewObject("Uniform Rational B-Spline","UniformRationBSplineObject",this.addURBSCurve.bind(this)));const f=document.createElement("sl-menu-label");f.textContent="Surfaces",b.appendChild(f),b.appendChild(this.addNewObject("Bezier Patch","BezierPatchObject",this.addBezierPatch.bind(this))),b.appendChild(this.addNewObject("Uniform B-Spline Surface","UniformBSplineSurfaceObject",this.addUniformBSplineSurface.bind(this))),b.appendChild(this.addNewObject("Uniform Rational B-Spline Surface","UniformRationalBSplineSurfaceObject",this.addUniformRationalBSplineSurface.bind(this))),t.appendChild(n)}addNewObject(t,e,i){const n=document.createElement("sl-menu-item");n.classList.add("menu-item"),n.onclick=i;const{name:o,lucide:a}=ve(e),h=document.createElement("sl-icon");h.name=o,a&&(h.library="lucide"),h.slot="prefix";const c=document.createElement("span");return c.textContent=t,n.appendChild(h),n.appendChild(c),n}addLinearCurve(){const t=r.getCreationManager().createBasicLinearCurve();this.selectionChanged(t.getUUID())}addBezierCurve(){const t=r.getCreationManager().createBasicBezierCurve();this.selectionChanged(t.getUUID())}addBezierSpline(){const t=r.getCreationManager().createBasicBezierSpline();this.selectionChanged(t.getUUID())}addUniformBSplineCurve(){const t=r.getCreationManager().createBasicUniformBSpline();this.selectionChanged(t.getUUID())}addURBSCurve(){const t=r.getCreationManager().createBasicURBS();this.selectionChanged(t.getUUID())}addBezierPatch(){const t=r.getCreationManager().createBasicBezierPatch();this.selectionChanged(t.getUUID())}addUniformBSplineSurface(){const t=r.getCreationManager().createBasicUniformBSplineSurface();this.selectionChanged(t.getUUID())}addUniformRationalBSplineSurface(){const t=r.getCreationManager().createBasicUniformRationalBSplineSurface();this.selectionChanged(t.getUUID())}}class Mn{container;menu;tree;items;hoveredItem;selectedItem;constructor(t,e={}){const{darkMode:i=!1}=e;this.items=new Map,this.hoveredItem=null,this.selectedItem=null;const n=document.createElement("div");n.className="hierarchy",n.style.border="solid 1px var(--sl-color-neutral-300)",n.style.borderRadius="var(--sl-border-radius-small)",n.style.backgroundColor="var(--sl-color-neutral-0)",n.style.height="100%",n.style.overflow="auto",n.style.color="var(--sl-input-color) !important",i&&n.classList.add("sl-theme-dark"),this.menu=new yn(n,this.selectionChangedUUID.bind(this),this.removeSelected.bind(this)),this.tree=document.createElement("sl-tree"),this.tree.selection="leaf",n.appendChild(this.tree),t.appendChild(n),this.container=n,this.tree.addEventListener("sl-selection-change",o=>this.selectionChanged(o)),this.container.addEventListener("mouseup",()=>this.deselect()),C.subscribe("objectAdded",P.GENERAL,o=>this.addObject(o)),C.subscribe("objectRemoved",P.GENERAL,o=>this.removeObject(o)),C.subscribe("objectChanged",P.INSPECTOR,()=>this.updateHierarchy()),C.subscribe("objectNameChanged",P.ALL,()=>this.updateHierarchy()),C.subscribe("inspectorTabChanged",P.INSPECTOR,()=>this.updateHierarchy())}updateHierarchy(){this.items.clear(),this.tree.innerHTML="",r.getObjectManager().getObjects().forEach(t=>{this.addObject(t),t.getUUID()===this.hoveredItem&&this.viewportHover(t.getUUID()),t.getUUID()===this.selectedItem?.dataset.uuid&&this.viewportSelect(t.getUUID())})}addObject(t){const e=document.createElement("sl-tree-item");e.dataset.uuid=t.getUUID(),e.classList.add("hierarchy-item");const i=document.createElement("div");i.style.display="flex",i.style.alignItems="center",i.style.gap="10px";const{name:n,lucide:o}=ve(t.getType()),a=document.createElement("sl-icon");a.name=n,o&&(a.library="lucide"),i.appendChild(a);const h=document.createElement("span");h.textContent=t.getName(),i.appendChild(h),e.appendChild(i);const c=document.createElement("div");c.style.display="flex",c.style.flexDirection="row",c.style.marginRight="20px",e.appendChild(c);const d=document.createElement("div");d.style.marginRight="10px",d.style.display="none",t instanceof st&&t.getMode()===2&&(d.style.display="");const m=document.createElement("sl-icon");m.name="spline",m.library="lucide",d.appendChild(m),c.appendChild(d);const u=document.createElement("div");u.style.color="#"+t.getColor().getHexString();const p=document.createElement("sl-icon");p.name="circle-fill",u.appendChild(p),c.appendChild(u),e.addEventListener("mouseenter",()=>this.hovered(t.getUUID())),e.addEventListener("mouseleave",()=>this.dehovered(t.getUUID())),e.addEventListener("sl-expand",()=>this.selectionChangedUUID(t.getUUID())),e.addEventListener("sl-collapse",()=>this.selectionChangedUUID(t.getUUID())),this.items.set(t.getUUID(),e),this.tree.appendChild(e)}removeObject(t){const e=this.items.get(t.getUUID());e&&(this.tree.removeChild(e),this.items.delete(t.getUUID()),this.selectedItem=null)}hovered(t){const e=r.getObjectManager().getObjectByUUID(t);e&&(this.hoveredItem=t,r.getSelectionManager().doHover(e))}viewportHover(t){const e=this.items.get(t);e&&(this.hoveredItem=t,e.classList.add("hover"))}dehovered(t){r.getObjectManager().getObjectByUUID(t)&&(this.hoveredItem=null,r.getSelectionManager().doResetHovered())}viewportDehover(){const t=this.hoveredItem;if(!t)return;const e=this.items.get(t);e&&(this.hoveredItem=null,e.classList.remove("hover"))}selectionChangedUUID(t){const e=this.items.get(t);e&&(this.viewportSelect(t),this.selectionChanged(new CustomEvent("sl-selection-change",{detail:{selection:[e]}})))}selectionChanged(t){const e=t.detail.selection[0];if(!e)return;this.selectedItem=e;const i=e.dataset.uuid;if(!i)return;const n=r.getObjectManager().getObjectByUUID(i);n&&r.getSelectionManager().doSelect(n)}removeSelected(){if(!this.selectedItem)return;const t=this.selectedItem.dataset.uuid;if(!t)return;const e=r.getObjectManager().getObjectByUUID(t);e&&(this.selectedItem=null,r.getTransformControls().detach(),this.removeObject(e),r.getObjectManager().removeObject(t))}viewportSelect(t){const e=this.items.get(t);e&&(this.selectedItem&&(this.selectedItem.selected=!1),this.selectedItem=e,e.selected=!0)}deselect(){if(!this.selectedItem)return;this.selectedItem.selected=!1;const t=this.selectedItem.dataset.uuid;if(!t)return;r.getObjectManager().getObjectByUUID(t)&&r.getSelectionManager().doResetSelected(),this.selectedItem=null}viewportDeselect(){this.selectedItem&&(this.selectedItem.selected=!1,this.selectedItem=null)}}class xn{constructor(){const t=new _e(r.getRenderer());r.setEffectComposer(t),this.setupRenderPass()}setupRenderPass(){r.getEffectComposer().addPass(new Xe(r.getScene(),r.getCamera())),r.getEffectComposer().addPass(new Ye)}}class En{constructor(){}saveSceneToFile(t){const e=new Blob([this.objectsToJSON()],{type:"application/json"}),i=document.createElement("a");i.href=URL.createObjectURL(e),i.download=t,i.click(),URL.revokeObjectURL(i.href),r.getInteractionsManager().toast("Scene saved","Scene saved successfully!","success")}saveSceneToCache(){localStorage.setItem("scene",this.objectsToJSON())}loadSceneFromFile(){const t=document.createElement("input");t.type="file",t.accept=".svis",t.onchange=e=>{try{const n=e.target.files?.item(0);if(n){const o=new FileReader;o.onload=a=>{const h=a.target;this.objectsFromJSON(h.result)},o.readAsText(n)}}catch(i){console.warn("Error while loading JSON file: ",i)}},t.click()}loadSceneFromCache(){const t=localStorage.getItem("scene");t&&this.objectsFromJSON(t,!0)}clearSceneCache(){localStorage.removeItem("scene")}setFlagCache(t,e){localStorage.setItem(t,e.toString())}getFlagCache(t){const e=localStorage.getItem(t);return e?e==="true":!1}objectsToJSON(){return JSON.stringify({"2d":r.dimension2D(),scene:r.getSceneProxy().toJSON(),objects:r.getObjectManager().getObjects().map(t=>t.toJSON())},null,1)}objectsFromJSON(t,e=!1){try{const i=JSON.parse(t);if(i["2d"]==null||i["2d"]==null)throw new Error("Could not find the 2d flag in the JSON file!");if(i.scene==null||i.scene==null)throw new Error("Could not find the scene object in the JSON file!");if(i.objects==null||i.objects==null)throw new Error("Could not find the objects array in the JSON file!");(i["2d"]&&!r.dimension2D()||!i["2d"]&&r.dimension2D())&&r.switchDimension(),r.getSceneProxy().fromJSON(i.scene);for(const n of i.objects)Sn.createVisualObject(n);e?i.objects&&i.objects.length>0&&r.getInteractionsManager().toast("Last Session restored","The Last Session was restored successfully!","success"):r.getInteractionsManager().toast("Scene loaded","Scene loaded successfully!","success")}catch(i){console.error("Error while loading JSON file: ",i),r.getInteractionsManager().toast("Error","Error while loading JSON file: <br />"+i,"error")}}}class Sn{static createVisualObject(t){const e=t.type;if(!e){console.warn("Object type not found!");return}switch(e){case"LinearCurveObject":r.getCreationManager().createJSONLinearCurve(t);break;case"BezierCurveObject":r.getCreationManager().createJSONBezierCurve(t);break;case"BezierSplineObject":r.getCreationManager().createJSONBezierSpline(t);break;case"UniformBSplineObject":r.getCreationManager().createJSONUniformBSpline(t);break;case"UniformRationBSplineObject":r.getCreationManager().createJSONURBS(t);break;case"BezierPatchObject":r.getCreationManager().createJSONBezierPatch(t);break;case"UniformBSplineSurfaceObject":r.getCreationManager().createJSONUniformBSplineSurface(t);break;case"UniformRationalBSplineSurfaceObject":r.getCreationManager().createJSONUniformRationalBSplineSurface(t);break;default:console.warn(`Unknown object type: ${e}`);break}}}var Ht=(s=>(s.OBJ="OBJ",s.STL="STL",s.GLTF="GLTF",s))(Ht||{});class On{constructor(){}isExportable(t){return t.getExport()!==null}export(t){this.exportDialog(t)}exportDialog(t){const e=document.createElement("sl-dialog");e.label="Export to "+t,e.classList.add("export-dialog");const i=document.createElement("div");i.innerHTML="",e.appendChild(i);const n=r.getSelectionManager().getSelectedObject();if(n!=null)if(this.isExportable(n)){i.innerHTML+=`Selected object <b> ${n.getName()} </b> can be exported to <b> ${t} </b>.<br>`;const d=document.createElement("sl-button");d.variant="primary",d.innerText="Export Object",d.slot="footer",d.onclick=()=>{this.exportObject(n,t),e.hide()},e.appendChild(d)}else i.innerHTML+=`Selected object <b> ${n.getName()} </b> cannot be exported.<br>`;if(this.exportableObjectExists()){i.innerHTML+="Export all objects that can be exported.";const c=document.createElement("sl-button");c.variant="success",c.innerText="Export All",c.slot="footer",c.onclick=()=>{this.exportAll(t),e.hide()},e.appendChild(c)}else i.innerHTML+="No exportable objects available.";const h=document.createElement("sl-button");h.variant="danger",h.innerText="Cancel",h.slot="footer",h.onclick=()=>{e.hide()},e.appendChild(h),document.body.appendChild(e),e.show()}exportableObjectExists(){const t=r.getObjectManager().getObjects();for(const e of t)if(this.isExportable(e))return!0;return!1}exportAll(t){const e=new Ge,i=r.getObjectManager().getObjects();for(const n of i)if(this.isExportable(n)){const o=n.getExport();if(o!==null){const a=o();a!==null&&(a.updateMatrixWorld(!0),e.add(a))}}e.children.length>0?this.exportToType(e,"exported_objects",t):console.warn("No exportable objects found.")}exportObject(t,e){const i=t.getExport();if(i===null){console.warn("Export function not available for this object.");return}const n=i();if(n===null){console.warn("Export function returned null mesh.");return}this.exportToType(n,t.getName(),e)}exportToType(t,e,i){switch(i){case"OBJ":this.exportToOBJ(t,e);break;case"STL":this.exportToSTL(t,e);break;case"GLTF":this.exportToGLTF(t,e);break;default:console.warn("Export type not supported.");break}}exportToOBJ(t,e){const n=new qe().parse(t);this.downloadFile(n,e.replaceAll(" ","_")+".obj")}exportToSTL(t,e){const n=new Ze().parse(t,{binary:!1});this.downloadFile(n,e.replaceAll(" ","_")+".stl")}exportToGLTF(t,e){new Qe().parse(t,n=>{const o=JSON.stringify(n);this.downloadFile(o,e.replaceAll(" ","_")+".gltf")},n=>{console.error("Error exporting to GLTF:",n)})}downloadFile(t,e){const i=new Blob([t],{type:"text/plain"}),n=URL.createObjectURL(i),o=document.createElement("a");o.href=n,o.download=e,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(n)}}class jn{closed=!1;constructor(t){const e=document.createElement("div");e.className="toolbar";const i=document.createElement("div");i.style.display=r.getIOManager().getFlagCache("toolbarClosed")?"none":"flex",i.style.flexDirection="row",i.style.flexWrap="wrap",e.appendChild(i);const n=document.createElement("sl-button-group");n.label="Scene Management",i.appendChild(n);const o=document.createElement("sl-dropdown");n.appendChild(o);const a=document.createElement("sl-button");a.textContent="File",a.slot="trigger",a.size="medium",a.caret=!0,o.appendChild(a);const h=document.createElement("sl-menu");o.appendChild(h);const c=document.createElement("sl-menu-item"),d=document.createElement("sl-icon");d.library="lucide",d.name="save",d.slot="prefix",c.appendChild(d);const m=document.createTextNode("Save");c.appendChild(m),c.value="save",h.appendChild(c);const u=document.createElement("sl-menu-item"),p=document.createElement("sl-icon");p.library="lucide",p.name="file-up",p.slot="prefix",u.appendChild(p);const b=document.createTextNode("Load");u.appendChild(b),u.value="load",h.appendChild(u);const w=document.createElement("sl-menu-item"),f=document.createElement("sl-icon");f.library="lucide",f.name="folder-pen",f.slot="prefix",w.appendChild(f);const y=document.createTextNode("Examples");w.appendChild(y);const v=document.createElement("sl-menu");v.slot="submenu",w.appendChild(v);const j=document.createElement("sl-menu-item"),x=document.createElement("sl-icon");x.name="cup-hot",x.slot="prefix",j.appendChild(x);const M=document.createTextNode("Utah Teapot");j.appendChild(M),j.value="teapot",v.appendChild(j);const I=document.createElement("sl-menu-item"),_=document.createElement("sl-icon");_.name="cup-hot",_.slot="prefix",I.appendChild(_);const Ve=document.createTextNode("Utah Teapot (Colorful)");I.appendChild(Ve),I.value="teapotColor",v.appendChild(I),h.appendChild(w);const yt=document.createElement("sl-menu-item"),Mt=document.createElement("sl-icon");Mt.library="lucide",Mt.name="folder-output",Mt.slot="prefix",yt.appendChild(Mt);const Te=document.createTextNode("Export");yt.appendChild(Te);const rt=document.createElement("sl-menu");rt.slot="submenu",yt.appendChild(rt);const Tt=document.createElement("sl-menu-item"),Ue=document.createTextNode("OBJ");Tt.appendChild(Ue),Tt.value="exportOBJ",rt.appendChild(Tt);const Ut=document.createElement("sl-menu-item"),Be=document.createTextNode("STL");Ut.appendChild(Be),Ut.value="exportSTL",rt.appendChild(Ut);const Bt=document.createElement("sl-menu-item"),Re=document.createTextNode("GLTF");Bt.appendChild(Re),Bt.value="exportGLTF",rt.appendChild(Bt),h.appendChild(yt),h.addEventListener("sl-select",Ne=>{switch(Ne.detail.item.value){case"save":this.save();break;case"load":this.load();break;case"teapot":this.loadTeapot();break;case"teapotColor":this.loadTeapotColor();break;case"exportOBJ":this.exportOBJ();break;case"exportSTL":this.exportSTL();break;case"exportGLTF":this.exportGLTF();break;default:console.warn("Unknown menu item selected!");break}});const at=document.createElement("sl-button"),xt=document.createElement("sl-icon");xt.library="lucide",xt.name="list-restart",xt.slot="prefix",at.appendChild(xt);const De=document.createTextNode("Reset Scene");at.appendChild(De),at.size="medium",at.onclick=()=>this.resetScene(),n.appendChild(at);const Q=document.createElement("sl-button");Q.textContent=r.dimension2D()?"3D":"2D",Q.size="medium",Q.style.marginLeft="0.5rem",Q.onclick=()=>{r.switchDimension(),Q.textContent=r.dimension2D()?"3D":"2D"},i.appendChild(Q);const tt=document.createElement("sl-button"),et=document.createElement("sl-icon");et.library="lucide",et.name="sun",et.slot="prefix",et.style.display=r.darkMode()?"block":"none",tt.appendChild(et);const it=document.createElement("sl-icon");it.library="lucide",it.name="moon",it.slot="prefix",it.style.display=r.darkMode()?"none":"block",tt.appendChild(it),tt.size="medium",tt.style.marginLeft="0.5rem",tt.onclick=()=>{r.setMode(!r.darkMode()),et.style.display=r.darkMode()?"block":"none",it.style.display=r.darkMode()?"none":"block"},i.appendChild(tt);const lt=document.createElement("sl-button"),Et=document.createElement("sl-icon");Et.library="lucide",Et.name="chevron-left",Et.slot="prefix",lt.appendChild(Et),lt.size="medium",lt.style.marginLeft="0.5rem",lt.onclick=()=>{this.closed=!0,i.style.display="none",Z.style.display="flex",r.getIOManager().setFlagCache("toolbarClosed",!0)},i.appendChild(lt);const Z=document.createElement("sl-button"),St=document.createElement("sl-icon");St.library="lucide",St.name="chevron-right",St.slot="prefix",Z.appendChild(St),Z.size="medium",Z.style.display=r.getIOManager().getFlagCache("toolbarClosed")?"":"none",Z.onclick=()=>{this.closed=!1,i.style.display="flex",Z.style.display="none",r.getIOManager().setFlagCache("toolbarClosed",!1)},e.appendChild(Z),t.appendChild(e)}save(){const e=new Date().toISOString().split(".")[0].replaceAll("-","_").replace("T","-").replaceAll(":","_");r.getIOManager().saveSceneToFile("SplineVis_"+e+".svis")}load(){r.getIOManager().loadSceneFromFile()}loadTeapot(){ce(2,!1)}loadTeapotColor(){ce(2,!0)}exportOBJ(){r.getExportManager().export(Ht.OBJ)}exportSTL(){r.getExportManager().export(Ht.STL)}exportGLTF(){r.getExportManager().export(Ht.GLTF)}resetScene(){r.getInteractionsManager().confirm("Reset Scene","Are you sure you want to reset the scene?",t=>{t&&(r.getTransformControls().detach(),r.getObjectManager().removeObjects(),r.getIOManager().clearSceneCache(),r.getSceneProxy().reset(),C.notify("sceneReset",P.ALL))})}}class ie{keydowns;static blockedTags=["SL-INPUT","SL-COLOR-PICKER"];dialog;constructor(){this.keydowns=new Map,this.dialog=document.createElement("sl-dialog"),window.addEventListener("keydown",t=>{const e=t.key,i=t.target;ie.blockedTags.includes(i.tagName)||this.keydowns.has(e)&&this.keydowns.get(e)?.forEach(n=>n())}),this.addKeydown("d",()=>{r.switchDimension()})}addKeydown(t,e){this.keydowns.has(t)?this.keydowns.get(t)?.push(e):this.keydowns.set(t,[e])}addKeydowns(t,e){t.forEach(i=>this.addKeydown(i,e))}toast(t,e,i){const n=i==="setting"?"neutral":i==="info"?"primary":i==="error"?"danger":i,o=i==="info"?"info":i==="success"?"circle-check-big":i==="setting"?"settings":i==="warning"?"triangle-alert":i==="error"?"circle-x":"message-circle-warning",a=document.createElement("sl-alert");a.variant=n,a.closable=!1,a.duration=1e3;const h=document.createElement("sl-icon");h.name=o,h.library="lucide",h.slot="icon",a.appendChild(h);const c=document.createElement("span");c.innerHTML="<strong>"+t+"</strong><br />"+e,a.appendChild(c);const d=Object.assign(a);document.body.appendChild(d),a.toast()}confirm(t,e,i){this.dialog.innerHTML="",this.dialog.label=t,this.dialog.classList.add("confirm-dialog"),this.dialog.style.color="var(--sl-input-color)",this.dialog.addEventListener("sl-request-close",h=>{i(!1)});const n=document.createElement("div");n.innerHTML=e,this.dialog.appendChild(n);const o=document.createElement("sl-button");o.variant="success",o.innerText="Confirm",o.slot="footer",o.onclick=()=>{i(!0),this.dialog.hide()},this.dialog.appendChild(o);const a=document.createElement("sl-button");a.variant="danger",a.innerText="Cancel",a.slot="footer",a.onclick=()=>{i(!1),this.dialog.hide()},this.dialog.appendChild(a),r.getApp().appendChild(this.dialog),this.dialog.show()}}class Hn extends A{mode;dirRotation;dirIntensity;dirColor;ambIntensity;ambColor;envMap;envIntensity;constructor(){const t=new ge(new ue(0),new me);t.visible=!1,super("SceneProxyObject",t),this.type="SceneProxyObject",this.mode=0,this.dirRotation=0,this.dirIntensity=1,this.dirColor="#ffffff",this.ambIntensity=.2,this.ambColor="#f0f0f0",this.envMap="outdoor",this.envIntensity=1}reset(){this.dirRotation=0,this.dirIntensity=1,this.dirColor="#ffffff",this.ambIntensity=.2,this.ambColor="#f0f0f0",this.envMap="outdoor",this.envIntensity=1}getMode(){return this.mode}setMode(t){this.mode=t}toJSON(){return{name:this.name,type:this.type,position:this.getPosition(),color:this.color.getHex(),mode:this.mode,dirRotation:this.dirRotation,dirIntensity:this.dirIntensity,dirColor:this.dirColor,ambIntensity:this.ambIntensity,ambColor:this.ambColor,envMap:this.envMap,envIntensity:this.envIntensity}}fromJSON(t){this.mode=t.mode,this.dirRotation=t.dirRotation,this.dirIntensity=t.dirIntensity,this.dirColor=t.dirColor,this.ambIntensity=t.ambIntensity,this.ambColor=t.ambColor,this.envMap=t.envMap,this.envIntensity=t.envIntensity}highlight(){}resetHighlight(){}select(){}resetSelect(){}updateColor(t){}dispose(){}}function In(){oi("lucide",{resolver:v=>`https://cdn.jsdelivr.net/npm/lucide-static@0.482.0/icons/${v}.svg`});const s=document.getElementById("app");if(!s)return;const t=document.getElementById("viewport");if(!t)return;const e=document.getElementById("inspector");if(!e)return;const i=document.getElementById("hierarchy");if(!i)return;r.setApp(s),bi(t),Pi(),Ci(t);const n=new yi;r.setObjectManager(n);const o=new Li;r.setCreationManager(o);const a=new Vi;r.setSelectionManager(a);const h=new Ti;r.setEditManager(h);const c=new xn;r.setEffectManager(c);const d=new En;r.setIOManager(d),wi();const m=new ie;r.setInteractionsManager(m);const u=new On;r.setExportManager(u);const p=new Ui(t);r.setControls(p);const b=new Mn(i);r.setHierarchy(b);const w=new vn(e);r.setInspector(w);const f=new jn(t);r.setToolbar(f);const y=new Hn;r.setSceneProxy(y),r.getIOManager().loadSceneFromCache(),document.addEventListener("DOMContentLoaded",()=>{C.notify("start",P.ALL)}),Le()}function Le(){requestAnimationFrame(Le),r.getEffectComposer().render(),r.getOrbitControls().update(),r.getSelectionManager().update()}In();
