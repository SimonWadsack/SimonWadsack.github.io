import*as l from"three";import{Color as I,SphereGeometry as ae,MeshBasicMaterial as At,Mesh as Ft,Vector3 as w,MathUtils as ao,Texture as Ce,RepeatWrapping as Pe,Vector2 as le,ShaderMaterial as lo,DoubleSide as co,UniformsLib as ye,Curve as Gt,Vector4 as R,Raycaster as _,Plane as it,EquirectangularReflectionMapping as ho,NearestFilter as uo,Group as mo}from"three";import{OrbitControls as Me,TransformControls as xe,LineGeometry as Ee,LineMaterial as go,Line2 as po,EXRLoader as fo,EffectComposer as bo,RenderPass as wo,OutputPass as vo,OBJExporter as Co,STLExporter as Po,GLTFExporter as yo}from"three/examples/jsm/Addons.js";import{TextureElement as k,Vec2Element as ce,ButtonSelectElement as Ve,SliderElement as V,LaceElement as Mo,TextElement as st,Vec3Element as D,ColorElement as z,LabelElement as B,BooleanElement as Jt,TextSelectElement as Kt,ButtonElement as qt,NumberSelectElement as xo,SeperatorElement as Te,Lace as Eo}from"lacery";import{registerIconLibrary as So}from"@shoelace-style/shoelace";class he{data;width;height;texture;columnConnectionVisuals;rowConnectionVisuals;connectionParentMesh=null;connectionMaterial;constructor(t=4,e=4,o=1.25){this.width=t,this.height=e,this.data=new Float32Array(this.width*this.height*4),this.texture=new l.DataTexture(this.data,this.width,this.height,l.RGBAFormat,l.FloatType),this.texture.minFilter=this.texture.magFilter=l.NearestFilter,this.texture.generateMipmaps=!1,this.texture.needsUpdate=!0,this.connectionMaterial=new l.LineBasicMaterial({color:U(),depthTest:!1,transparent:!0}),this.columnConnectionVisuals=[];for(let n=0;n<this.width;n++){const s=new l.BufferGeometry().setFromPoints(this.getColumn(n)),r=new l.Line(s,this.connectionMaterial);r.renderOrder=1e3,r.castShadow=!0,this.columnConnectionVisuals.push(r)}this.rowConnectionVisuals=[];for(let n=0;n<this.height;n++){const s=new l.BufferGeometry().setFromPoints(this.getRow(n)),r=new l.Line(s,this.connectionMaterial);r.renderOrder=1e3,r.castShadow=!0,this.rowConnectionVisuals.push(r)}}getTexture(){return this.texture}getWidth(){return this.width}getHeight(){return this.height}toString(){let t=`DynamicVec3Grid: ${this.width}x${this.height}
`;for(let e=0;e<this.height;e++){for(let o=0;o<this.width;o++){const n=(e*this.width+o)*4;t+=`(${this.data[n].toFixed(2)}, ${this.data[n+1].toFixed(2)}, ${this.data[n+2].toFixed(2)}, ${this.data[n+3].toFixed(2)}) `}t+=`
`}return t}addVisuals(t){if(this.connectionParentMesh===null){this.connectionParentMesh=t;for(let e=0;e<this.width;e++)this.columnConnectionVisuals[e].visible=!1,t.add(this.columnConnectionVisuals[e]);for(let e=0;e<this.height;e++)this.rowConnectionVisuals[e].visible=!1,t.add(this.rowConnectionVisuals[e])}}showVisuals(){for(let t=0;t<this.width;t++)this.columnConnectionVisuals[t].visible=!0;for(let t=0;t<this.height;t++)this.rowConnectionVisuals[t].visible=!0}hideVisuals(){for(let t=0;t<this.width;t++)this.columnConnectionVisuals[t].visible=!1;for(let t=0;t<this.height;t++)this.rowConnectionVisuals[t].visible=!1}getPoint4(t,e){if(t<0||t>=this.height||e<0||e>=this.width)throw new Error("Index out of bounds");const o=(t*this.width+e)*4;return new l.Vector4(this.data[o],this.data[o+1],this.data[o+2],this.data[o+3])}getPoint(t,e){if(t<0||t>=this.height||e<0||e>=this.width)throw new Error("Index out of bounds");const o=(t*this.width+e)*4;return new l.Vector3(this.data[o],this.data[o+1],this.data[o+2])}getPoints4(){const t=[];for(let e=0;e<this.height;e++)for(let o=0;o<this.width;o++){const n=(e*this.width+o)*4;t.push(new l.Vector4(this.data[n],this.data[n+1],this.data[n+2],this.data[n+3]))}return t}getPoints(){const t=[];for(let e=0;e<this.height;e++)for(let o=0;o<this.width;o++){const n=(e*this.width+o)*4;t.push(new l.Vector3(this.data[n],this.data[n+1],this.data[n+2]))}return t}setPoint4(t,e,o){if(t<0||t>=this.height||e<0||e>=this.width)throw new Error("Index out of bounds");const n=(t*this.width+e)*4;this.data[n]=o.x,this.data[n+1]=o.y,this.data[n+2]=o.z,this.data[n+3]=o.w,this.texture.needsUpdate=!0;const s=new l.BufferGeometry().setFromPoints(this.getColumn(e));this.columnConnectionVisuals[e].geometry.dispose(),this.columnConnectionVisuals[e].geometry=s;const r=new l.BufferGeometry().setFromPoints(this.getRow(t));this.rowConnectionVisuals[t].geometry.dispose(),this.rowConnectionVisuals[t].geometry=r}setPoint(t,e,o){this.setPoint4(t,e,new l.Vector4(o.x,o.y,o.z,1))}getColumn4(t){if(t<0||t>=this.width)throw new Error("Index out of bounds");const e=[];for(let o=0;o<this.height;o++){const n=(o*this.width+t)*4;e.push(new l.Vector4(this.data[n],this.data[n+1],this.data[n+2],this.data[n+3]))}return e}getColumn(t){if(t<0||t>=this.width)throw new Error("Index out of bounds");const e=[];for(let o=0;o<this.height;o++){const n=(o*this.width+t)*4;e.push(new l.Vector3(this.data[n],this.data[n+1],this.data[n+2]))}return e}getRow4(t){if(t<0||t>=this.height)throw new Error("Index out of bounds");const e=[];for(let o=0;o<this.width;o++){const n=(t*this.width+o)*4;e.push(new l.Vector4(this.data[n],this.data[n+1],this.data[n+2],this.data[n+3]))}return e}getRow(t){if(t<0||t>=this.height)throw new Error("Index out of bounds");const e=[];for(let o=0;o<this.width;o++){const n=(t*this.width+o)*4;e.push(new l.Vector3(this.data[n],this.data[n+1],this.data[n+2]))}return e}addColumn(t,e=!1){this.resizeBuffer(this.width+1,this.height),e&&this.shiftColumnRight();const o=e?0:this.width-1,n=e?1:this.width-2,s=new l.BufferGeometry().setFromPoints(this.getColumn(o)),r=new l.Line(s,this.connectionMaterial);r.renderOrder=1e3,r.castShadow=!0,e?this.columnConnectionVisuals.unshift(r):this.columnConnectionVisuals.push(r),this.connectionParentMesh?.add(this.columnConnectionVisuals[o]);const c=this.getColumn(n);for(let h=0;h<this.height;h++){const d=c[h].clone().sub(t);this.setPoint(h,o,d)}}removeColumn(t=!1){if(!(this.width<=2)){t&&this.shiftColumnLeft(),this.resizeBuffer(this.width-1,this.height),t?(this.connectionParentMesh?.remove(this.columnConnectionVisuals[0]),this.columnConnectionVisuals.shift()):(this.connectionParentMesh?.remove(this.columnConnectionVisuals[this.width]),this.columnConnectionVisuals.pop());for(let e=0;e<this.height;e++){const o=new l.BufferGeometry().setFromPoints(this.getRow(e));this.rowConnectionVisuals[e].geometry.dispose(),this.rowConnectionVisuals[e].geometry=o}}}addRow(t,e=!1){this.resizeBuffer(this.width,this.height+1),e&&this.shiftRowDown();const o=e?0:this.height-1,n=e?1:this.height-2,s=new l.BufferGeometry().setFromPoints(this.getRow(o)),r=new l.Line(s,this.connectionMaterial);r.renderOrder=1e3,r.castShadow=!0,e?this.rowConnectionVisuals.unshift(r):this.rowConnectionVisuals.push(r),this.connectionParentMesh?.add(this.rowConnectionVisuals[o]);const c=this.getRow(n);for(let h=0;h<this.width;h++){const d=c[h].clone().sub(t);this.setPoint(o,h,d)}}removeRow(t=!1){if(!(this.height<=2)){t&&this.shiftRowUp(),this.resizeBuffer(this.width,this.height-1),t?(this.connectionParentMesh?.remove(this.rowConnectionVisuals[0]),this.rowConnectionVisuals.shift()):(this.connectionParentMesh?.remove(this.rowConnectionVisuals[this.height]),this.rowConnectionVisuals.pop());for(let e=0;e<this.width;e++){const o=new l.BufferGeometry().setFromPoints(this.getColumn(e));this.columnConnectionVisuals[e].geometry.dispose(),this.columnConnectionVisuals[e].geometry=o}}}shiftColumnRight(){for(let t=0;t<this.height;t++)for(let e=this.width-1;e>0;e--){const o=(t*this.width+e)*4,n=(t*this.width+(e-1))*4;this.data.set(this.data.slice(n,n+4),o)}}shiftColumnLeft(){for(let t=0;t<this.height;t++)for(let e=0;e<this.width-1;e++){const o=(t*this.width+e)*4,n=(t*this.width+(e+1))*4;this.data.set(this.data.slice(n,n+4),o)}}shiftRowDown(){for(let t=this.height-1;t>0;t--)for(let e=0;e<this.width;e++){const o=(t*this.width+e)*4,n=((t-1)*this.width+e)*4;this.data.set(this.data.slice(n,n+4),o)}}shiftRowUp(){for(let t=0;t<this.height-1;t++)for(let e=0;e<this.width;e++){const o=(t*this.width+e)*4,n=((t+1)*this.width+e)*4;this.data.set(this.data.slice(n,n+4),o)}}resizeBuffer(t,e){const o=new Float32Array(t*e*4);for(let n=0;n<this.height&&!(n>=e);n++)for(let s=0;s<this.width&&!(s>=t);s++){const r=(n*this.width+s)*4,c=(n*t+s)*4;o.set(this.data.slice(r,r+4),c)}this.width=t,this.height=e,this.data=o,this.texture.dispose(),this.texture=new l.DataTexture(this.data,t,e,l.RGBAFormat,l.FloatType),this.texture.minFilter=this.texture.magFilter=l.NearestFilter,this.texture.generateMipmaps=!1,this.texture.needsUpdate=!0}}const y={allEvents:new Map,generalEvents:new Map,viewportEvents:new Map,inspectorEvents:new Map,hierarchyEvents:new Map,subscribe(i,t,e){let o;switch(t){case"all":o=this.allEvents;break;case"general":o=this.generalEvents;break;case"viewport":o=this.viewportEvents;break;case"inspector":o=this.inspectorEvents;break;case"hierarchy":o=this.hierarchyEvents;break}o.has(i)||o.set(i,[]),o.get(i).push(e)},unsubscribe(i,t,e){let o;switch(t){case"all":o=this.allEvents;break;case"general":o=this.generalEvents;break;case"viewport":o=this.viewportEvents;break;case"inspector":o=this.inspectorEvents;break;case"hierarchy":o=this.hierarchyEvents;break}if(o.has(i)){const n=o.get(i).indexOf(e);n!==-1&&o.get(i).splice(n,1)}},notify(i,t,e){let o;switch(t){case"all":{for(const n of[this.allEvents,this.generalEvents,this.viewportEvents,this.inspectorEvents,this.hierarchyEvents])if(n.has(i))for(const s of n.get(i))s(e);return}case"general":o=this.generalEvents;break;case"viewport":o=this.viewportEvents;break;case"inspector":o=this.inspectorEvents;break;case"hierarchy":o=this.hierarchyEvents;break}if(o.has(i))for(const n of o.get(i))n(e);if(this.allEvents.has(i))for(const n of this.allEvents.get(i))n(e)}};var P=(i=>(i.ALL="all",i.GENERAL="general",i.VIEWPORT="viewport",i.INSPECTOR="inspector",i.HIERARCHY="hierarchy",i))(P||{});class a{static app;static scene;static pCamera;static oCamera;static renderer;static effectComposer;static orbitControls;static oOrbitControls;static transformControls;static oTransformControls;static ambientLight;static directionalLight;static grid;static plane;static tooltip;static objectManager;static creationManager;static selectionManager;static editManager;static effectManager;static ioManager;static interactionsManager;static exportManager;static inspector;static hierarchy;static toolbar;static controls;static sceneProxy;static isOrbitingBool=!1;static isDraggingBool=!1;static is2D=!1;static isDarkMode=!1;static dimension2D(){return this.is2D}static switchDimension(){this.is2D?(this.is2D=!1,this.oTransformControls.detach(),this.orbitControls.enabled=!0,this.oOrbitControls.enabled=!1,this.directionalLight.position.set(10,25,0),this.directionalLight.target.position.set(0,0,0)):(this.is2D=!0,this.transformControls.detach(),this.orbitControls.enabled=!1,this.oOrbitControls.enabled=!0,this.directionalLight.position.set(0,100,0),this.directionalLight.target.position.set(0,0,0)),a.getEffectManager().setupRenderPass(),a.getSelectionManager().doResetSelectedEditHandle(),y.notify("dimensionSwitched",P.ALL,this.is2D)}static darkMode(){return this.isDarkMode}static setMode(t=!1){t?(this.isDarkMode=!0,this.app.classList.remove("sl-theme-light"),this.app.classList.add("sl-theme-dark")):(this.isDarkMode=!1,this.app.classList.add("sl-theme-light"),this.app.classList.remove("sl-theme-dark")),a.getScene().background=new I(se()),a.getIOManager().setFlagCache("darkMode",this.isDarkMode),y.notify("modeSwitched",P.ALL,this.isDarkMode)}static getApp(){return this.app}static setApp(t){this.app=t}static getScene(){return this.scene}static getCamera(){return this.is2D?this.oCamera:this.pCamera}static getPerspectiveCamera(){return this.is2D?null:this.pCamera}static getRenderer(){return this.renderer}static getOrbitControls(){return this.is2D?this.oOrbitControls:this.orbitControls}static onOrbitControlsChange(t){this.orbitControls.addEventListener("change",()=>{this.is2D||t()}),this.oOrbitControls.addEventListener("change",()=>{this.is2D&&t()})}static onTransformControlsChange(t){this.transformControls.addEventListener("change",()=>{this.is2D||t()}),this.oTransformControls.addEventListener("change",()=>{this.is2D&&t()})}static onControlsChange(t){this.onOrbitControlsChange(t),this.onTransformControlsChange(t),y.subscribe("dimensionSwitched",P.ALL,()=>{t()})}static noScroll(){this.orbitControls.enableZoom=!1,this.oOrbitControls.enableZoom=!1}static scroll(){this.orbitControls.enableZoom=!0,this.oOrbitControls.enableZoom=!0}static getTransformControls(){return this.is2D?this.oTransformControls:this.transformControls}static getAmbientLight(){return this.ambientLight}static getDirectionalLight(){return this.directionalLight}static setupScene(t,e,o,n,s,r,c,h,d,u){this.scene=t,this.pCamera=e,this.oCamera=o,this.renderer=n,this.orbitControls=s,this.orbitControls.addEventListener("start",()=>this.isOrbitingBool=!0),this.orbitControls.addEventListener("end",()=>this.isOrbitingBool=!1),this.oOrbitControls=r,this.oOrbitControls.addEventListener("start",()=>this.isOrbitingBool=!0),this.oOrbitControls.addEventListener("end",()=>this.isOrbitingBool=!1),this.transformControls=c,this.transformControls.addEventListener("dragging-changed",m=>{this.orbitControls.enabled=!m.value,this.isDraggingBool=m.value}),this.scene.add(this.transformControls.getHelper()),this.oTransformControls=h,this.oTransformControls.addEventListener("dragging-changed",m=>{this.oOrbitControls.enabled=!m.value,this.isDraggingBool=m.value}),this.scene.add(this.oTransformControls.getHelper()),this.ambientLight=d,this.directionalLight=u}static getEffectComposer(){return this.effectComposer}static setEffectComposer(t){this.effectComposer=t}static getGrid(){return this.grid}static getPlane(){return this.plane}static setupGrid(t,e){this.grid=t,this.plane=e}static getTooltip(){return this.tooltip}static setTooltip(t){this.tooltip=t}static getObjectManager(){return this.objectManager}static setObjectManager(t){this.objectManager=t}static getCreationManager(){return this.creationManager}static setCreationManager(t){this.creationManager=t}static getSelectionManager(){return this.selectionManager}static setSelectionManager(t){this.selectionManager=t}static getEditManager(){return this.editManager}static setEditManager(t){this.editManager=t}static getEffectManager(){return this.effectManager}static setEffectManager(t){this.effectManager=t}static getIOManager(){return this.ioManager}static setIOManager(t){this.ioManager=t}static getInteractionsManager(){return this.interactionsManager}static setInteractionsManager(t){this.interactionsManager=t}static getExportManager(){return this.exportManager}static setExportManager(t){this.exportManager=t}static getInspector(){return this.inspector}static setInspector(t){this.inspector=t}static getHierarchy(){return this.hierarchy}static setHierarchy(t){this.hierarchy=t}static getToolbar(){return this.toolbar}static setToolbar(t){this.toolbar=t}static getControls(){return this.controls}static setControls(t){this.controls=t}static getSceneProxy(){return this.sceneProxy}static setSceneProxy(t){this.sceneProxy=t}static isOrbiting(){return this.isOrbitingBool}static isDragging(){return this.isDraggingBool}static getDefaultImage(){const t=new Image;t.width=1,t.height=1;const e=document.createElement("canvas");e.width=1,e.height=1;const o=e.getContext("2d");return o&&(o.fillStyle="#FFFFFF",o.fillRect(0,0,1,1),t.src=e.toDataURL()),t}}const J=async(i,t)=>{const e=`textures/${i}/${t}`,o=await fetch(e);if(!o.ok)return null;const n=await o.blob();return n.size===0||n.type==="text/html"?null:n};class Be{parentObject;index;radius;mesh;material;constructor(t,e,o=.2){this.parentObject=t,this.index=e,this.radius=o;const n=new ae(this.radius);this.material=new At({color:Nt(),depthTest:!1,transparent:!0}),this.mesh=new Ft(n,this.material),this.mesh.castShadow=!0,this.mesh.renderOrder=1001,this.adjustScale(),a.onControlsChange(this.adjustScale.bind(this)),y.subscribe("modeSwitched",P.ALL,()=>{this.material.color.set(Nt())})}getMesh(){return this.mesh}getParentObject(){return this.parentObject}getIndex(){return this.index}getPosition(){return this.mesh.position.clone()}getWorldPosition(){return this.mesh.getWorldPosition(new w)}setPosition(t){this.mesh.position.set(t.x,t.y,t.z)}highlight(){this.material.color.set(X())}resetHighlight(){this.material.color.set(Nt())}select(){this.material.color.set(U())}resetSelect(){this.material.color.set(Nt())}hide(){this.mesh.visible=!1}show(){this.mesh.visible=!0}getActive(){return this.mesh.visible}adjustScale(){if(a.dimension2D()){this.mesh.scale.set(1,1,1);return}const t=this.mesh.position.distanceTo(a.getCamera().position),o=Math.abs(t)/10,n=Math.max(1,Math.min(o,20));this.mesh.scale.set(n,n,n)}}class G{name;mesh;uuid;type;export;color=new I(0);editHandles;constructor(t,e,o=new w(0,0,0)){this.name=t,this.mesh=e,this.mesh.position.set(o.x,o.y,o.z),this.mesh.castShadow=!0,this.mesh.frustumCulled=!1,this.uuid=ao.generateUUID(),this.type="VisualObject",this.export=null,this.editHandles=new Map}getName(){return this.name}setName(t){this.name=t}getColor(){return this.color.clone()}setColor(t){this.color.set(t)}getUUID(){return this.uuid}getType(){return this.type}getExport(){return this.export}getMesh(){return this.mesh}getPosition(){const t=new w;return t.copy(this.mesh.position),t}setPosition(t){this.mesh.position.set(t.x,t.y,t.z)}move(t,e,o){var n=this.getPosition();n&&(n.x+=t,n.y+=e,n.z+=o,this.setPosition(n))}moveX(t){this.move(t,0,0)}moveY(t){this.move(0,t,0)}moveZ(t){this.move(0,0,t)}edit(){return console.warn("VisualObject: Edit not implemented!"),()=>{console.error("VisualObject: Edit not implemented!")}}createEditHandle(t,e=.2){const o=new Be(this,t,e);this.editHandles.set(t,o),a.getObjectManager().addEditHandle(o)}hasEditHandle(t){return this.editHandles.has(t)}setEditHandlePosition(t,e){if(!this.editHandles.has(t)){console.error("VisualObject:setEditHandlePosition: Edit handle not found!");return}const o=this.editHandles.get(t);o&&o.setPosition(e)}getEditHandlePosition(t){if(!this.editHandles.has(t))return console.error("VisualObject:getEditHandlePosition: Edit handle not found!"),null;const e=this.editHandles.get(t);return e?e.getPosition():null}removeEditHandle(t){if(!this.editHandles.has(t)){console.error("VisualObject:removeEditHandle: Edit handle not found!");return}const e=this.editHandles.get(t);e&&(a.getObjectManager().removeEditHandle(e),this.editHandles.delete(t))}removeEditHandles(){this.editHandles.forEach((t,e)=>{a.getObjectManager().removeEditHandle(t)}),this.editHandles.clear()}hideEditHandle(t){if(!this.editHandles.has(t)){console.error("VisualObject:hideEditHandle: Edit handle not found!");return}const e=this.editHandles.get(t);e&&e.hide()}showEditHandle(t){if(!this.editHandles.has(t)){console.error("VisualObject:showEditHandle: Edit handle not found!");return}const e=this.editHandles.get(t);e&&e.show()}hideEditHandles(){this.editHandles.forEach((t,e)=>{t.hide()})}showEditHandles(){this.editHandles.forEach((t,e)=>{t.show()})}unedit(){console.warn("VisualObject: Unedit not implemented!")}}function Oo(){return`
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
`}function $(i,t,e){if(i.length!==t*e)throw console.error("Invalid points array length:",i.length,"Expected:",t*e,t,e),new Error("Points array length must match width * height");const o=new l.BufferGeometry,n=[],s=[];for(const r of i)n.push(r.x,r.y,r.z);for(let r=0;r<e-1;r++)for(let c=0;c<t-1;c++){const h=r*t+c,d=h+1,u=h+t,m=u+1;s.push(h,u,d),s.push(d,u,m)}return o.setAttribute("position",new l.Float32BufferAttribute(n,3)),o.setIndex(s),o.computeVertexNormals(),o}const mt={};function jo(i,t){if(t===0||t===i)return 1;if(mt[i]&&mt[i][t])return mt[i][t];for(var e=1,o=1;o<=t;o++)e*=(i-o+1)/o;return mt[i]||(mt[i]={}),mt[i][t]=e,e}function Ue(i,t,e){return new l.Vector3(Zt(i.x,t.x,e),Zt(i.y,t.y,e),Zt(i.z,t.z,e))}function Ho(i,t,e){return Ue(i.position,t.position,e)}function Zt(i,t,e){return i+(t-i)*e}function Re(i,t,e,o,n){return o+(i-t)*(n-o)/(e-t)}function K(i,t,e){return(i<0||t<0||t>i)&&console.log("berstein: Invalid arguments for n or i: ",i,t),(e<0||e>1)&&console.log("berstein: Invalid arguments for t: ",e),jo(i,t)*Math.pow(e,t)*Math.pow(1-e,i-t)}function Se(i,t,e){return(i<0||t<0||t>i)&&console.log("bersteinDerivative: Invalid arguments for n or i: ",i,t),(e<0||e>1)&&console.log("bersteinDerivative: Invalid arguments for t: ",e),t===0?-i*K(i-1,t,e):t===i?i*K(i-1,t-1,e):i*(K(i-1,t-1,e)-K(i-1,t,e))}function Qt(i,t,e){const o=[];for(let n=0;n<e;n++){const s=n/(e-1);for(let r=0;r<t;r++){const c=r/(t-1);o.push(Io(i,c,s))}}return o}function Io(i,t,e){const o=new w(0,0,0);for(let n=0;n<i.getWidth();n++){const s=K(i.getWidth()-1,n,t);for(let r=0;r<i.getHeight();r++){const c=i.getPoint(r,n),h=K(i.getHeight()-1,r,e);o.add(c.clone().multiplyScalar(s*h))}}return o}class De{uniforms;constructor(){this.uniforms=new Map}add(t){const e=this.uniforms.get(t.getName());if(e&&e.getType()===t.getType()){e.value=t.value;return}this.uniforms.set(t.getName(),t)}has(t){return this.uniforms.has(t)}get(t){return this.uniforms.get(t)}getAll(){return Array.from(this.uniforms.values())}mergeFrom(t){t.getAll().forEach(e=>{this.add(e)})}getTHREEUniforms(){const t={};return this.uniforms.forEach(e=>{t[e.getName()]={value:e.value}}),t}}class de{uniforms;enviroment;updateCallback=void 0;constructor(){this.uniforms=new De,this.enviroment=!1}getUniforms(){return this.uniforms}setUpdateCallback(t){this.updateCallback=t}removeUpdateCallback(){this.updateCallback=void 0}}class $t{name;type;value;constructor(t,e,o){this.name=t,this.type=e,this.value=o}getName(){return this.name}getType(){return this.type}}class Pt extends $t{constructor(t,e){super(t,1,e)}}class W extends $t{constructor(t,e){super(t,2,e)}}class ue extends $t{constructor(t,e){super(t,3,e)}}class A extends $t{blob;image;constructor(t,e){const o=new Ce;o.wrapS=o.wrapT=Pe,super(t,7,o),e!==null?(this.image=new Image,this.image.src=URL.createObjectURL(e),this.image.onload=()=>{o.image=this.image,o.needsUpdate=!0}):(this.image=null,this.value.image=a.getDefaultImage(),o.needsUpdate=!0),this.blob=e}update(){this.image!==null&&this.image.src&&URL.revokeObjectURL(this.image.src),this.value.dispose();const t=new Ce;t.wrapS=t.wrapT=Pe,this.value=t,this.blob!==null?(this.image===null&&(this.image=new Image),this.image.src=URL.createObjectURL(this.blob),this.image.onload=()=>{this.value.image=this.image,this.value.needsUpdate=!0}):(this.image=null,this.value.image=a.getDefaultImage(),this.value.needsUpdate=!0)}}class ie extends de{tiling;useMainTexture;mainTexture;mainElement;constructor(){super(),this.tiling=new ue("tiling",new le(1,1)),this.useMainTexture=new W("useMainTexture",!1),this.mainTexture=new A("mainTexture",null),this.uniforms.add(this.tiling),this.uniforms.add(this.useMainTexture),this.uniforms.add(this.mainTexture);const t=new k("Texture",this.mainTexture,"blob");t.onChange(()=>{this.useMainTexture.value=t.hasTexture(),this.mainTexture.update()}),this.mainElement=t}getName(){return"Diffuse"}getFragmentShader(){return Lo()}buildUI(t){const e=new ce("Tiling",this.tiling.value,"x","y",{xStep:.1,yStep:.1});t.add(e.onChange(()=>{this.tiling.value.x<.1&&(this.tiling.value.x=.1),this.tiling.value.y<.1&&(this.tiling.value.y=.1),e.update()})),t.add(this.mainElement)}toJSON(){return{tiling:[this.tiling.value.x,this.tiling.value.y]}}fromJSON(t){this.tiling.value.x=t.tiling[0],this.tiling.value.y=t.tiling[1]}dispose(){this.mainTexture.blob=null,this.mainTexture.update(),this.mainElement.updateBlob()}}function Lo(){return`
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
    `}class yt extends de{tiling;useMainTexture;mainTexture;useRoughnessMap;roughnessMap;shininess;useNormalMap;normalMap;normalStrength;useAOMap;aoMap;mainElement;roughnessElement;normalElement;aoElement;constructor(){super(),this.tiling=new ue("tiling",new le(1,1)),this.useMainTexture=new W("useMainTexture",!1),this.mainTexture=new A("mainTexture",null),this.useRoughnessMap=new W("useRoughnessMap",!1),this.roughnessMap=new A("roughnessMap",null),this.shininess=new Pt("shininess",.5),this.useNormalMap=new W("useNormalMap",!1),this.normalMap=new A("normalMap",null),this.normalStrength=new Pt("normalStrength",1),this.useAOMap=new W("useAOMap",!1),this.aoMap=new A("aoMap",null),this.uniforms.add(this.tiling),this.uniforms.add(this.useMainTexture),this.uniforms.add(this.mainTexture),this.uniforms.add(this.roughnessMap),this.uniforms.add(this.useRoughnessMap),this.uniforms.add(this.shininess),this.uniforms.add(this.useNormalMap),this.uniforms.add(this.normalMap),this.uniforms.add(this.normalStrength),this.uniforms.add(this.useAOMap),this.uniforms.add(this.aoMap);const t=new k("Albedo",this.mainTexture,"blob");t.onChange(()=>{this.useMainTexture.value=t.hasTexture(),this.mainTexture.update()}),this.mainElement=t;const e=new k("Roughness",this.roughnessMap,"blob");e.onChange(()=>{this.useRoughnessMap.value=e.hasTexture(),this.roughnessMap.update()}),this.roughnessElement=e;const o=new k("Normal",this.normalMap,"blob");o.onChange(()=>{this.useNormalMap.value=o.hasTexture(),this.normalMap.update()}),this.normalElement=o;const n=new k("Ambient Occlusion",this.aoMap,"blob");n.onChange(()=>{this.useAOMap.value=n.hasTexture(),this.aoMap.update()}),this.aoElement=n}getName(){return"Blinn-Phong"}getFragmentShader(){return Vo()}buildUI(t){t.add(new Ve("Load a preset...",{rock:"Rock",mossyrock:"Mossy Rock",bark:"Bark",onyx:"Onyx"},this.presetSelect.bind(this),{previews:["textures/rock/albedo.jpg","textures/mossyrock/albedo.jpg","textures/bark/albedo.jpg","textures/onyx/albedo.jpg"],previewSize:64}));const e=new ce("Tiling",this.tiling.value,"x","y",{xStep:.1,yStep:.1});t.add(e.onChange(()=>{this.tiling.value.x<.1&&(this.tiling.value.x=.1),this.tiling.value.y<.1&&(this.tiling.value.y=.1),e.update()})),t.add(this.mainElement),t.add(this.roughnessElement),t.add(new V("Shininess",this.shininess,"value",{min:.01,max:1,step:.01})),t.add(this.normalElement),t.add(new V("Normal Strength",this.normalStrength,"value",{min:0,max:1,step:.01})),t.add(this.aoElement)}toJSON(){return{tiling:[this.tiling.value.x,this.tiling.value.y],shininess:this.shininess.value,normalStrength:this.normalStrength.value}}fromJSON(t){this.tiling.value.x=t.tiling[0],this.tiling.value.y=t.tiling[1],this.shininess.value=t.shininess,this.normalStrength.value=t.normalStrength}dispose(){this.mainTexture.blob=null,this.mainTexture.update(),this.roughnessMap.blob=null,this.roughnessMap.update(),this.normalMap.blob=null,this.normalMap.update(),this.aoMap.blob=null,this.aoMap.update(),this.mainElement.updateBlob(),this.roughnessElement.updateBlob(),this.normalElement.updateBlob(),this.aoElement.updateBlob()}async presetSelect(t){const e={albedo:"albedo.jpg",ambientocclusion:"ao.jpg",normal:"normal.jpg",roughness:"roughness.jpg"};try{const[o,n,s,r]=await Promise.all([J(t,e.albedo),J(t,e.ambientocclusion),J(t,e.normal),J(t,e.roughness)]);this.mainTexture.blob=o,this.useMainTexture.value=!0,this.mainTexture.update(),this.roughnessMap.blob=r,this.useRoughnessMap.value=!0,this.roughnessMap.update(),this.normalMap.blob=s,this.useNormalMap.value=!0,this.normalMap.update(),this.aoMap.blob=n,this.useAOMap.value=!0,this.aoMap.update(),this.mainElement.updateBlob(),this.roughnessElement.updateBlob(),this.normalElement.updateBlob(),this.aoElement.updateBlob(),this.updateCallback?.()}catch(o){console.error("Error loading textures",o);return}}}function Vo(){return`
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
    `}class Oe extends de{tiling;useMainTexture;mainTexture;useRoughnessMap;roughnessMap;roughness;useNormalMap;normalMap;normalStrength;useMetallicMap;metallicMap;metallic;useAOMap;aoMap;mainElement;roughnessElement;metallicElement;normalElement;aoElement;constructor(){super(),this.enviroment=!0,this.tiling=new ue("tiling",new le(1,1)),this.useMainTexture=new W("useMainTexture",!1),this.mainTexture=new A("mainTexture",null),this.useRoughnessMap=new W("useRoughnessMap",!1),this.roughnessMap=new A("roughnessMap",null),this.roughness=new Pt("roughness",.5),this.useMetallicMap=new W("useMetallicMap",!1),this.metallicMap=new A("metallicMap",null),this.metallic=new Pt("metallic",.5),this.useNormalMap=new W("useNormalMap",!1),this.normalMap=new A("normalMap",null),this.normalStrength=new Pt("normalStrength",1),this.useAOMap=new W("useAOMap",!1),this.aoMap=new A("aoMap",null),this.uniforms.add(this.tiling),this.uniforms.add(this.useMainTexture),this.uniforms.add(this.mainTexture),this.uniforms.add(this.roughnessMap),this.uniforms.add(this.useRoughnessMap),this.uniforms.add(this.roughness),this.uniforms.add(this.useMetallicMap),this.uniforms.add(this.metallicMap),this.uniforms.add(this.metallic),this.uniforms.add(this.useNormalMap),this.uniforms.add(this.normalMap),this.uniforms.add(this.normalStrength),this.uniforms.add(this.useAOMap),this.uniforms.add(this.aoMap);const t=new k("Albedo",this.mainTexture,"blob");t.onChange(()=>{this.useMainTexture.value=t.hasTexture(),this.mainTexture.update()}),this.mainElement=t;const e=new k("Roughness",this.roughnessMap,"blob");e.onChange(()=>{this.useRoughnessMap.value=e.hasTexture(),this.roughnessMap.update()}),this.roughnessElement=e;const o=new k("Metallic",this.metallicMap,"blob");o.onChange(()=>{this.useMetallicMap.value=o.hasTexture(),this.metallicMap.update()}),this.metallicElement=o;const n=new k("Normal",this.normalMap,"blob");n.onChange(()=>{this.useNormalMap.value=n.hasTexture(),this.normalMap.update()}),this.normalElement=n;const s=new k("Ambient Occlusion",this.aoMap,"blob");s.onChange(()=>{this.useAOMap.value=s.hasTexture(),this.aoMap.update()}),this.aoElement=s}getName(){return"PBR"}getFragmentShader(){return To()}buildUI(t){t.add(new Ve("Load a preset...",{metal:"Metal",rustymetal:"Rusty Metal",facade:"Facade",onyx:"Onyx",rock:"Rock",mossyrock:"Mossy Rock",bark:"Bark"},this.presetSelect.bind(this),{previews:["textures/metal/albedo.jpg","textures/rustymetal/albedo.jpg","textures/facade/albedo.jpg","textures/onyx/albedo.jpg","textures/rock/albedo.jpg","textures/mossyrock/albedo.jpg","textures/bark/albedo.jpg"],previewSize:64}));const e=new ce("Tiling",this.tiling.value,"x","y",{xStep:.1,yStep:.1});t.add(e.onChange(()=>{this.tiling.value.x<.1&&(this.tiling.value.x=.1),this.tiling.value.y<.1&&(this.tiling.value.y=.1),e.update()})),t.add(this.mainElement),t.add(this.roughnessElement),t.add(new V("Roughness",this.roughness,"value",{min:.04,max:1,step:.01})),t.add(this.metallicElement),t.add(new V("Metallic Strength",this.metallic,"value",{min:0,max:1,step:.01})),t.add(this.normalElement),t.add(new V("Normal Strength",this.normalStrength,"value",{min:0,max:1,step:.01})),t.add(this.aoElement)}toJSON(){return{tiling:[this.tiling.value.x,this.tiling.value.y],roughness:this.roughness.value,normalStrength:this.normalStrength.value,metallic:this.metallic.value}}fromJSON(t){this.tiling.value.x=t.tiling[0],this.tiling.value.y=t.tiling[1],this.roughness.value=t.roughness,this.normalStrength.value=t.normalStrength,this.metallic.value=t.metallic}dispose(){this.mainTexture.blob=null,this.mainTexture.update(),this.roughnessMap.blob=null,this.roughnessMap.update(),this.metallicMap.blob=null,this.metallicMap.update(),this.normalMap.blob=null,this.normalMap.update(),this.aoMap.blob=null,this.aoMap.update(),this.mainElement.updateBlob(),this.roughnessElement.updateBlob(),this.metallicElement.updateBlob(),this.normalElement.updateBlob(),this.aoElement.updateBlob()}async presetSelect(t){const e={albedo:"albedo.jpg",ambientocclusion:"ao.jpg",metallic:"metallic.jpg",normal:"normal.jpg",roughness:"roughness.jpg"};try{const[o,n,s,r,c]=await Promise.all([J(t,e.albedo),J(t,e.ambientocclusion),J(t,e.metallic),J(t,e.normal),J(t,e.roughness)]);this.mainTexture.blob=o,this.useMainTexture.value=!0,this.mainTexture.update(),this.roughnessMap.blob=c,this.useRoughnessMap.value=!0,this.roughnessMap.update(),this.metallicMap.blob=s,this.useMetallicMap.value=!0,this.metallicMap.update(),this.normalMap.blob=r,this.useNormalMap.value=!0,this.normalMap.update(),this.aoMap.blob=n,this.useAOMap.value=!0,this.aoMap.update(),this.mainElement.updateBlob(),this.roughnessElement.updateBlob(),this.metallicElement.updateBlob(),this.normalElement.updateBlob(),this.aoElement.updateBlob(),this.updateCallback?.()}catch(o){console.error("Error loading textures",o);return}}}function To(){return`
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
    `}function Mt(){return{[ie.name]:{name:"Diffuse",create:()=>new ie},[yt.name]:{name:"Blinn-Phong",create:()=>new yt},[Oe.name]:{name:"PBR",create:()=>new Oe}}}class me{vertexShader;controlPoints;color;shadingModel;uniformSet;material;group=void 0;constructor(t,e,o,n,s={}){this.vertexShader=t,this.controlPoints=e,this.color=o.clone(),this.shadingModel=n,this.shadingModel.setUpdateCallback(this.updateUniforms.bind(this)),this.uniformSet=new De,this.uniformSet.mergeFrom(n.getUniforms()),this.material=new lo({vertexShader:this.vertexShader,fragmentShader:this.shadingModel.getFragmentShader(),uniforms:{...this.getUniforms(),...this.getEnviromentUniforms(),...ye.common,...ye.lights,...s},side:co,lights:!0}),y.subscribe("enviromentChanged",P.ALL,this.updateEnviroment.bind(this)),y.subscribe("enviromentIntensityChanged",P.ALL,this.updateEnviromentIntensity.bind(this))}update(){this.updateUniforms()}updateControlPoints(){this.material.uniforms.controlPointsTexture.value=this.controlPoints.getTexture(),this.material.uniforms.controlPointsWidth.value=this.controlPoints.getWidth(),this.material.uniforms.controlPointsHeight.value=this.controlPoints.getHeight()}getMaterial(){return this.material}setColor(t){this.color.set(t),this.material.uniforms.color.value.set(t)}setShadingModel(t){this.shadingModel.removeUpdateCallback(),this.shadingModel.dispose(),this.shadingModel=t,this.shadingModel.setUpdateCallback(this.updateUniforms.bind(this)),this.uniformSet.mergeFrom(t.getUniforms()),this.material.fragmentShader=t.getFragmentShader(),this.updateUniforms(),this.updateEnviroment(),this.material.needsUpdate=!0,this.group!==void 0&&(this.group.reset(),this.shadingModel.buildUI(this.group))}getShadingModelName(){return this.shadingModel.constructor.name}getShadingModelJSON(){return this.shadingModel.toJSON()}buildUI(t){this.group=t,this.group.onChange(this.updateUniforms.bind(this)),this.shadingModel.buildUI(this.group)}setCustomUniform(t,e){this.material.uniforms[t]?this.material.uniforms[t].value=e:this.material.uniforms[t]={value:e}}dispose(){this.shadingModel.removeUpdateCallback(),this.shadingModel.dispose(),this.material.dispose()}updateUniforms(){const t=this.getUniforms();for(const e in t)this.material.uniforms[e]&&this.material.uniforms[e].value!==t[e].value?this.material.uniforms[e].value=t[e].value:this.material.uniforms[e]=t[e]}updateEnviroment(){this.shadingModel.enviroment&&(this.material.uniforms.envMap.value=a.getScene().environment,this.material.uniforms.envMapIntensity.value=a.getScene().environmentIntensity)}updateEnviromentIntensity(){this.shadingModel.enviroment&&(this.material.uniforms.envMapIntensity.value=a.getScene().environmentIntensity)}getUniforms(){const t=this.shadingModel.getUniforms().getTHREEUniforms();return t.controlPointsTexture={value:this.controlPoints.getTexture()},t.controlPointsWidth={value:this.controlPoints.getWidth()},t.controlPointsHeight={value:this.controlPoints.getHeight()},t.color={value:this.color},t}getEnviromentUniforms(){return{envMap:{value:null},envMapIntensity:{value:1}}}}var Ne=(i=>(i[i.OBJECT=0]="OBJECT",i[i.CONTROL_POINTS=1]="CONTROL_POINTS",i[i.SHADING=2]="SHADING",i))(Ne||{});class at extends G{mode;controlPoints;geometry;material;collisionGeometry;collisionMesh;radius=.1;constructor(t,e,o,n,s=new l.Color(0),r=new l.Vector3(0,0,0),c=1,h=new yt){const d=new he(o,n);for(let f=0;f<o;f++)for(let C=0;C<n;C++){const v=f+C*o;d.setPoint(C,f,e[v])}const u=new l.PlaneGeometry(0,0,100,100),m=new me(Oo(),d,s,h),g=new l.Mesh(u,m.getMaterial());super(t,g,r),this.controlPoints=d,this.geometry=u,this.material=m,this.mode=c,this.color=s,this.type="BezierPatchObject",this.export=this.exportMesh.bind(this);for(let f=0;f<o;f++)for(let C=0;C<n;C++){const v=f+C*o;this.createEditHandle(v,this.radius),this.setEditHandlePosition(v,e[v])}this.hideEditHandles(),this.controlPoints.addVisuals(this.mesh);const p=this.controlPoints.getWidth()+1,b=this.controlPoints.getHeight()+1;this.collisionGeometry=$(Qt(this.controlPoints,b,p),b,p),this.collisionMesh=new l.Mesh(this.collisionGeometry,new l.MeshBasicMaterial({transparent:!0,opacity:0,visible:!1,side:l.DoubleSide})),this.collisionMesh.userData.collision=!0,this.collisionMesh.userData.object=this,this.mesh.add(this.collisionMesh)}getMode(){return this.mode}setMode(t){this.mode=t,this.mode===0?(this.hideEditHandles(),this.controlPoints.hideVisuals()):this.mode===1?(this.showEditHandles(),this.controlPoints.showVisuals()):this.mode===2&&(this.hideEditHandles(),this.controlPoints.hideVisuals())}toJSON(){return{name:this.name,type:this.type,position:{x:this.mesh.position.x,y:this.mesh.position.y,z:this.mesh.position.z},controlPoints:this.controlPoints.getPoints().map(t=>({x:t.x,y:t.y,z:t.z})),controlPointsWidth:this.controlPoints.getWidth(),controlPointsHeight:this.controlPoints.getHeight(),color:this.color.getHex(),mode:this.mode,shadingModel:{name:this.material.getShadingModelName(),params:this.material.getShadingModelJSON()}}}static fromJSON(t){const e=t.controlPoints.map(d=>new l.Vector3(d.x,d.y,d.z)),o=new l.Color(t.color),n=new l.Vector3(t.position.x,t.position.y,t.position.z),s=t.mode;if(Ne[s]===void 0)throw new Error("Invalid BezierPatchObjectMode mode");const c=Mt()[t.shadingModel.name].create();return c.fromJSON(t.shadingModel.params),new at(t.name,e,t.controlPointsWidth,t.controlPointsHeight,o,n,s,c)}edit(){return this.collisionMesh.userData.collision=!1,this.editUpdate.bind(this)}editUpdate(){if(this.mode===1){const t=a.getSelectionManager().getSelectedEditHandleIndex();if(t===null)return;const e=this.getEditHandlePosition(t);if(e===null)return;this.updateControlPoint(t,e)}}unedit(){this.hideEditHandles(),this.controlPoints.hideVisuals(),this.collisionMesh.userData.collision=!0}updateColor(t){super.setColor(t),this.material.setColor(t)}getMaterial(){return this.material}dispose(){this.material.dispose()}addControlPoint(t,e){if(!this.hasEditHandle(t))return;const o=this.getEditHandlePosition(t);if(o===null)return;const n=Math.floor(t/this.controlPoints.getWidth()),s=t%this.controlPoints.getWidth(),r=o.clone().sub(e),c=new l.Vector3(0,r.y,r.z),h=new l.Vector3(r.x,r.y,0);n===0&&s===0?(this.addControlPointRowCol(n,-1,c),this.addControlPointRowCol(-1,s,h)):n===0&&s===this.controlPoints.getWidth()-1?(this.addControlPointRowCol(n,-1,c),this.addControlPointRowCol(-1,s,h)):n===this.controlPoints.getHeight()-1&&s===0?(this.addControlPointRowCol(-1,s,h),this.addControlPointRowCol(n,-1,c)):n===this.controlPoints.getHeight()-1&&s===this.controlPoints.getWidth()-1?(this.addControlPointRowCol(-1,s,h),this.addControlPointRowCol(n,-1,c)):this.addControlPointRowCol(n,s,r);for(let d=0;d<this.controlPoints.getWidth();d++)for(let u=0;u<this.controlPoints.getHeight();u++){const m=d+u*this.controlPoints.getWidth();this.setEditHandlePosition(m,this.controlPoints.getPoint(u,d))}this.material.updateControlPoints(),this.updateCollisionGeometry()}addControlPointRowCol(t,e,o){var n=0,s=0;t===0?(this.controlPoints.addRow(o,!0),n=this.controlPoints.getWidth(),s=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1)):t===this.controlPoints.getHeight()-1?(this.controlPoints.addRow(o,!1),n=this.controlPoints.getWidth(),s=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1)):e===0?(this.controlPoints.addColumn(o,!0),n=this.controlPoints.getHeight(),s=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight()):e===this.controlPoints.getWidth()-1&&(this.controlPoints.addColumn(o,!1),n=this.controlPoints.getHeight(),s=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight());for(let r=0;r<n;r++)this.createEditHandle(s+r,this.radius)}removeControlPoint(t){if(this.controlPoints.getWidth()<=2||this.controlPoints.getHeight()<=2||!this.hasEditHandle(t))return;const e=Math.floor(t/this.controlPoints.getWidth()),o=t%this.controlPoints.getWidth();e===0||o===0||e===this.controlPoints.getHeight()-1||o===this.controlPoints.getWidth()-1?(this.removeControlPointRowCol(e,-1),this.removeControlPointRowCol(-1,o)):this.removeControlPointRowCol(e,o);for(let n=0;n<this.controlPoints.getWidth();n++)for(let s=0;s<this.controlPoints.getHeight();s++){const r=n+s*this.controlPoints.getWidth();this.setEditHandlePosition(r,this.controlPoints.getPoint(s,n))}this.material.updateControlPoints(),this.updateCollisionGeometry()}removeControlPointRowCol(t,e){var o=0,n=0;t===0?(o=this.controlPoints.getWidth(),n=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1),this.controlPoints.removeRow(!0)):t===this.controlPoints.getHeight()-1?(o=this.controlPoints.getWidth(),n=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1),this.controlPoints.removeRow(!1)):e===0?(o=this.controlPoints.getHeight(),n=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight(),this.controlPoints.removeColumn(!0)):e===this.controlPoints.getWidth()-1&&(o=this.controlPoints.getHeight(),n=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight(),this.controlPoints.removeColumn(!1));for(let s=0;s<o;s++)this.removeEditHandle(n+s)}updateControlPoint(t,e){const o=Math.floor(t/this.controlPoints.getWidth()),n=t%this.controlPoints.getWidth();this.controlPoints.setPoint(o,n,e),this.hasEditHandle(t)&&this.setEditHandlePosition(t,e),this.updateCollisionGeometry()}getControlPoint(t){const e=Math.floor(t/this.controlPoints.getWidth()),o=t%this.controlPoints.getWidth();return this.controlPoints.getPoint(e,o)}highlight(){this.material.setColor(X())}resetHighlight(){this.resetColor()}select(){this.resetColor()}resetSelect(){this.resetColor()}resetColor(){this.material.setColor(this.color)}updateCollisionGeometry(){this.collisionGeometry.dispose();const t=this.controlPoints.getWidth()+1,e=this.controlPoints.getHeight()+1;this.collisionGeometry=$(Qt(this.controlPoints,t,e),t,e),this.collisionMesh.geometry=this.collisionGeometry}exportMesh(){const t=Qt(this.controlPoints,100,100),e=$(t,100,100),o=new l.MeshStandardMaterial({color:this.color,side:l.DoubleSide}),n=new l.Mesh(e,o);return n.position.copy(this.mesh.position),n.rotation.copy(this.mesh.rotation),n.scale.copy(this.mesh.scale),n}}function Bo(){return[-5,10,5]}function Uo(){return[0,100,0]}function Ro(){return 15528177}function Do(){return 3092528}function se(){return a.darkMode()?Do():Ro()}function X(){return 15105570}function U(){return 15158332}function Nt(){return a.darkMode()?11321297:3426654}function kt(i){const t=[1752220,3066993,3447003,10181046,3426654,15844367,13849600,15158332];return t[i%t.length]}function It(i,t){var e=new w;return e.set(i.x+(i.x-t.x),i.y-(i.y-t.y),i.z+(i.z-t.z)),e}function ze(i){switch(i){case"LinearCurveObject":return{name:"waypoints",lucide:!0};case"BezierCurveObject":return{name:"bezier2",lucide:!1};case"BezierSplineObject":return{name:"bezier",lucide:!1};case"UniformBSplineObject":return{name:"spline",lucide:!0};case"UniformRationBSplineObject":return{name:"diameter",lucide:!0};case"BezierPatchObject":return{name:"grid-2x2",lucide:!0};case"UniformBSplineSurfaceObject":return{name:"grid-3x3",lucide:!0};case"UniformRationalBSplineSurfaceObject":return{name:"ratio",lucide:!0};default:return{name:"circle-help",lucide:!0}}}const No=`32
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
1.5 0.0 0.15`;function je(i,t){const e=No.split(`
`),o=parseInt(e[0]);var n=1;for(let s=0;s<o;s++){const r=e[n++].split(" "),c=parseInt(r[0]),h=parseInt(r[1]),d=[];for(let g=0;g<=c;g++)for(let p=0;p<=h;p++){const b=e[n++].split(" "),f=new w(parseFloat(b[0]),parseFloat(b[2]),parseFloat(b[1]));f.multiplyScalar(i),d.push(f)}const u=t?kt(s):8359053,m=new at(`Teapot ${s+1}`,d,c+1,h+1,new I(u));a.getObjectManager().addObject(m)}}function zo(i){const t=new l.Scene;t.background=new l.Color(255);const e=new l.PerspectiveCamera(75,i.clientWidth/i.clientHeight,.1,1e3);e.position.set(...Bo());const o=100,n=new l.OrthographicCamera(i.clientWidth/-100,i.clientWidth/o,i.clientHeight/o,i.clientHeight/-100,.1,1e3);n.position.set(...Uo());const s=new l.WebGLRenderer;s.setSize(i.clientWidth,i.clientHeight),s.setPixelRatio(window.devicePixelRatio),s.shadowMap.enabled=!0,i.appendChild(s.domElement);const r=new Me(e,s.domElement);r.enableDamping=!0,r.dampingFactor=.25;const c=new Me(n,s.domElement);c.enableDamping=!0,c.dampingFactor=.25,c.enableRotate=!1,c.mouseButtons={LEFT:l.MOUSE.PAN,MIDDLE:l.MOUSE.DOLLY,RIGHT:l.MOUSE.PAN};const h=new xe(e,s.domElement);h.setTranslationSnap(.01),h.addEventListener("objectChange",()=>y.notify("transformMoved",P.VIEWPORT));const d=new xe(n,s.domElement);d.setTranslationSnap(.01),d.addEventListener("objectChange",()=>y.notify("transformMoved",P.VIEWPORT)),d.showY=!1;const u=new l.AmbientLight(15790320,.2);t.add(u);const m=new l.DirectionalLight(16777215,1);m.position.set(15,20,0),m.castShadow=!0,m.shadow.mapSize.width=2048,m.shadow.mapSize.height=2048,m.shadow.camera.far=50,m.shadow.camera.near=.5,m.shadow.camera.left=-10,m.shadow.camera.right=10,m.shadow.camera.top=10,m.shadow.camera.bottom=-10,t.add(m),window.addEventListener("resize",()=>Fo(i,e,n,o,s)),window.addEventListener("beforeunload",()=>a.getIOManager().saveSceneToCache()),a.setupScene(t,e,n,s,r,c,h,d,u,m);const g=document.createElement("div");g.style.position="absolute",g.style.bottom="1rem",g.style.right="23%",g.style.display="flex",g.style.flexDirection="column",g.style.alignItems="center",g.style.gap="0.5rem";const p=document.createElement("img");p.src="/icons/eth.svg",p.style.width="5rem",p.style.opacity="0.6",p.style.cursor="pointer",p.onclick=()=>window.open("https://inf.ethz.ch/","_blank"),g.appendChild(p);const b=document.createElement("img");b.src="/icons/cgl.svg",b.style.width="8rem",b.style.cursor="pointer",b.onclick=()=>window.open("https://www.cgl.ethz.ch/","_blank"),g.appendChild(b);const f=document.createElement("p");f.innerText="Made by Simon Wadsack",f.style.fontSize="0.7rem",f.style.color="var(--sl-color-neutral-400)",f.style.cursor="pointer",f.onclick=()=>window.open("https://github.com/SimonWadsack/","_blank"),g.appendChild(f),i.appendChild(g)}function ko(){const i=new l.GridHelper(20,40);i.material.opacity=.75,i.material.transparent=!0,i.position.set(0,-.5,0);const t=new l.PlaneGeometry(20,20);t.rotateX(-Math.PI/2);const e=new l.ShadowMaterial({color:0,opacity:.2}),o=new l.Mesh(t,e);o.receiveShadow=!0,o.position.set(0,-.51,0),a.getScene().add(i),a.getScene().add(o),a.setupGrid(i,o)}function Wo(i){const t=document.createElement("div");t.style.position="absolute",t.style.backgroundColor="var(--sl-color-neutral-100)",t.style.color="var(--sl-input-color)",t.style.fontFamily="var(--sl-font-sans)",t.style.fontSize="var(--sl-font-size-small)",t.style.padding="0.5em",t.style.borderRadius="var(--sl-border-radius-small)",t.style.border="solid",t.style.borderWidth="1px",t.style.borderColor="var(--sl-color-neutral-300)",t.style.pointerEvents="none",t.style.display="none",t.style.zIndex="1000",t.innerText="TEST",i.appendChild(t),a.setTooltip(t)}function Ao(){const i=a.getIOManager().getFlagCache("darkMode");a.setMode(i)}function Fo(i,t,e,o,n){t.aspect=i.clientWidth/i.clientHeight,t.updateProjectionMatrix(),e.left=i.clientWidth/-100,e.right=i.clientWidth/o,e.top=i.clientHeight/o,e.bottom=i.clientHeight/-100,e.updateProjectionMatrix(),n.setSize(i.clientWidth,i.clientHeight)}class Go{objects;meshLookup;editHandleLookup;constructor(){this.objects=new Map,this.meshLookup=new Map,this.editHandleLookup=new Map}addObject(t){const e=t.getMesh();if(!e){console.error(`addObject: Object with id ${t.getUUID()} has no mesh!`);return}a.getScene().add(e),this.objects.set(t.getUUID(),t),this.meshLookup.set(e,t),y.notify("objectAdded",P.GENERAL,t)}addEditHandle(t){const o=t.getParentObject().getMesh();if(!o){console.error("addEditHandle: Parent has no mesh!");return}const n=t.getMesh();o.add(n),this.editHandleLookup.set(n,t),y.notify("editHandleAdded",P.GENERAL,t)}getObjectByUUID(t){return this.objects.has(t)?this.objects.get(t):(console.error(`getObjectById: Object with uuid ${t} not found!`),null)}selectable(t){return t.userData.collision&&t.userData.object?!0:this.meshLookup.has(t)}isEditHandle(t){if(this.editHandleLookup.has(t)){const e=this.editHandleLookup.get(t);if(e&&e.getActive())return!0}return!1}isVisualObject(t){return t.userData.collision&&t.userData.object?!0:this.meshLookup.has(t)}getVisualObjectByMesh(t){return this.meshLookup.has(t)?this.meshLookup.get(t):t.userData.collision&&t.userData.object?t.userData.object:(console.error(`getVisualObjectByMesh: Object with mesh ${t} not found!`),null)}getEditHandleByMesh(t){return this.editHandleLookup.has(t)?this.editHandleLookup.get(t):(console.error(`getEditHandleByMesh: Edit handle with mesh ${t} not found!`),null)}removeObject(t){const e=this.getObjectByUUID(t);if(!e){console.error(`removeObject: Object with id ${t} not found!`);return}const o=e.getMesh();if(!o){console.error(`removeObject: Object with id ${t} has no mesh!`);return}e.dispose(),a.getScene().remove(o),this.objects.delete(t),this.meshLookup.delete(o),y.notify("objectRemoved",P.ALL,e)}removeObjects(){this.objects.forEach((t,e)=>{this.removeObject(e)}),this.objects.clear(),this.meshLookup.clear(),this.editHandleLookup.clear()}removeEditHandle(t){if(!t){console.error(`removeEditHandle: Edit handle ${t} not found!`);return}const o=t.getParentObject().getMesh();if(!o){console.error("removeEditHandle: Parent has no mesh!");return}const n=t.getMesh();o.remove(n),this.editHandleLookup.delete(n),y.notify("editHandleRemoved",P.ALL,t)}getObjects(){return Array.from(this.objects.values())}isGrid(t){return t===a.getGrid()}isPlane(t){return t===a.getPlane()}}function Jo(i,t){if(!i||!Array.isArray(i)||i.length<2)return console.error("bezier: Invalid points array!"),null;if(t<0||t>1)return console.error("bezier: Invalid t value!"),null;const e=i.length-1;let o=new w(0,0,0);for(let n=0;n<=e;n++){const s=K(e,n,t);o.addScaledVector(i[n],s)}return o}function Ko(i,t,e,o,n){if(n<0||n>1+.05)return console.error("cubicBezier: Invalid t value!",n),null;const s=1-n,r=s*s,c=r*s,h=n*n,d=h*n,u=new w(0,0,0);return u.addScaledVector(i,c),u.addScaledVector(t,3*r*n),u.addScaledVector(e,3*s*h),u.addScaledVector(o,d),u}class ge extends Gt{controlPoints;constructor(t=[]){super(),this.controlPoints=t}getPoint(t,e=new w){const o=e;if(this.controlPoints.length<2)return console.log("BezierCurve: Not enough control points!"),o;const n=Jo(this.controlPoints,t);return n===null?(console.log("BezierCurve:getPoint: Bezier calculation failed!"),o):(o.copy(n),o)}setPoints(t){this.controlPoints=t}copy(t){return t instanceof ge?(super.copy(t),this.controlPoints=t.controlPoints.map(e=>e.clone()),this):(console.log("BezierCurve:copy: Source is not an instance of BezierCurve!"),this)}}var ke=(i=>(i[i.OBJECT=0]="OBJECT",i[i.CONTROL_POINTS=1]="CONTROL_POINTS",i[i.DE_CASTELJAU=2]="DE_CASTELJAU",i[i.INFO=3]="INFO",i))(ke||{});class pt extends G{mode;controlPoints;segments;radius;radialSegments;geometry;material;curve;connectionVisual;deCasteljauT;deCasteljauVisuals;deCasteljauCollisionMesh;constructor(t,e=[new l.Vector3(-5,0,0),new l.Vector3(0,5,0),new l.Vector3(5,0,0)],o=new l.Color(0),n=100,s=new l.Vector3(0,0,0),r=1){const c=new ge(e),h=.05,d=8,u=new l.TubeGeometry(c,n,h,d,!1),m=new l.MeshBasicMaterial({color:o});m.side=l.DoubleSide;const g=new l.Mesh(u,m);super(t,g,s),this.curve=c,this.geometry=u,this.material=m,this.controlPoints=e,this.color=o,this.segments=n,this.mode=r,this.radius=h,this.radialSegments=d,this.type="BezierCurveObject";for(let v=0;v<this.controlPoints.length;v++)this.createEditHandle(v),this.setEditHandlePosition(v,this.controlPoints[v]);const p=new l.BufferGeometry().setFromPoints(this.controlPoints),b=new l.LineBasicMaterial({color:U()});this.connectionVisual=new l.Line(p,b),this.connectionVisual.castShadow=!0,g.add(this.connectionVisual),this.connectionVisual.visible=!1,this.hideEditHandles(),this.deCasteljauT=.5,this.deCasteljauVisuals=[];const f=new l.TubeGeometry(this.curve,n,this.radius*10,this.radialSegments,!1),C=new l.MeshBasicMaterial({transparent:!0,opacity:0,visible:!1});this.deCasteljauCollisionMesh=new l.Mesh(f,C),g.add(this.deCasteljauCollisionMesh)}getMode(){return this.mode}setMode(t){this.mode=t,t===0?(this.connectionVisual.visible=!1,this.hideEditHandles(),this.disableDeCasteljau()):t===1?(this.connectionVisual.visible=!0,this.showEditHandles(),this.disableDeCasteljau()):t===2?(this.connectionVisual.visible=!1,this.hideEditHandles(),this.enableDeCasteljau()):t===3&&(this.connectionVisual.visible=!1,this.hideEditHandles(),this.disableDeCasteljau())}toJSON(){return{name:this.name,type:this.type,position:{x:this.mesh.position.x,y:this.mesh.position.y,z:this.mesh.position.z},controlPoints:this.controlPoints.map(t=>({x:t.x,y:t.y,z:t.z})),color:this.color.getHex(),segments:this.segments,mode:this.mode,deCasteljauT:this.deCasteljauT}}static fromJSON(t){const e=t.controlPoints.map(c=>new l.Vector3(c.x,c.y,c.z)),o=new l.Color(t.color),n=new l.Vector3(t.position.x,t.position.y,t.position.z),s=t.mode;if(ke[s]===void 0)throw new Error("Invalid BezierCurveObject mode");const r=new pt(t.name,e,o,t.segments,n,s);return s===2&&(r.enableDeCasteljau(),r.updateDeCasteljauT(t.deCasteljauT!==void 0?t.deCasteljauT:.5)),r}edit(){return this.editUpdate.bind(this)}editUpdate(){if(this.mode===1){const t=a.getSelectionManager().getSelectedEditHandleIndex();if(t===null)return;const e=this.getEditHandlePosition(t);if(e===null)return;this.updateControlPoint(t,e),this.updateConnectionVisual()}}unedit(){this.connectionVisual.visible=!1,this.hideEditHandles()}enableDeCasteljau(){if(this.deCasteljauVisuals.length>0)return;const t=this.controlPoints.length;var e=[];const o=[],n=[];for(let h=0;h<t;h++){const d=new l.SphereGeometry(.1),u=new l.MeshBasicMaterial({color:kt(0)}),m=new l.Mesh(d,u);m.position.set(this.controlPoints[h].x,this.controlPoints[h].y,this.controlPoints[h].z),this.mesh.add(m),e.push(this.controlPoints[h]),o.push(m),n.push(this.controlPoints[h])}const s=new l.BufferGeometry().setFromPoints(n),r=new l.LineBasicMaterial({color:kt(0)}),c=new l.Line(s,r);this.mesh.add(c),this.deCasteljauVisuals[0]={points:o,line:c};for(let h=0;h<t-1;h++){const d=[],u=[],m=h===t-2?.25:.1,g=h===t-2?this.getColor():kt(h+1);for(let C=0;C<t-h-1;C++){const v=Ue(e[C],e[C+1],this.deCasteljauT),E=new l.SphereGeometry(m),M=new l.MeshBasicMaterial({color:g}),x=new l.Mesh(E,M);x.position.set(v.x,v.y,v.z),d.push(v),u.push(x),this.mesh.add(x)}e=d.slice();const p=new l.BufferGeometry().setFromPoints(d),b=new l.LineBasicMaterial({color:g}),f=new l.Line(p,b);this.deCasteljauVisuals[h+1]={points:u,line:f},this.mesh.add(f)}}disableDeCasteljau(){this.deCasteljauVisuals.forEach(t=>{t.points.forEach(e=>{this.mesh.remove(e)}),this.mesh.remove(t.line)}),this.deCasteljauVisuals=[]}getDeCasteljauT(){return this.deCasteljauT}updateDeCasteljauT(t){this.deCasteljauT=t,this.recomputeDeCasteljau()}getCollisionMesh(){return this.deCasteljauCollisionMesh}updateDeCasteljauFromNearestPoint(t){const e=this.curve.getPoints(500);let o=Number.MAX_VALUE,n=0;for(let s=0;s<e.length;s++){const r=e[s].distanceToSquared(t);r<o&&(o=r,n=s)}this.updateDeCasteljauT(n/500)}recomputeDeCasteljau(){if(this.mode===2){for(let t=0;t<this.deCasteljauVisuals[0].points.length;t++)this.deCasteljauVisuals[0].points[t].position.set(this.controlPoints[t].x,this.controlPoints[t].y,this.controlPoints[t].z);this.deCasteljauVisuals[0].line.geometry.setFromPoints(this.controlPoints);for(let t=0;t<this.deCasteljauVisuals.length-1;t++){const e=this.deCasteljauVisuals[t].points,o=this.deCasteljauVisuals[t+1].points;for(let n=0;n<e.length-1;n++){const s=Ho(e[n],e[n+1],this.deCasteljauT);o[n].position.set(s.x,s.y,s.z)}this.deCasteljauVisuals[t+1].line.geometry.setFromPoints(o.map(n=>n.position))}}}updateSegments(t){this.segments=t,this.recompute()}updateColor(t){super.setColor(t),this.material.color.set(t)}dispose(){this.material.dispose()}addControlPoint(t,e=!1){if(e?this.controlPoints.unshift(t):this.controlPoints.push(t),this.recompute(),this.updateConnectionVisual(),e){this.createEditHandle(this.controlPoints.length-1);for(let o=0;o<this.controlPoints.length;o++)this.setEditHandlePosition(o,this.controlPoints[o])}else this.createEditHandle(this.controlPoints.length-1),this.setEditHandlePosition(this.controlPoints.length-1,t);this.controlPoints.length>100?this.updateSegments(1e3):this.controlPoints.length>40&&this.updateSegments(500)}removeControlPoint(t=!1){if(!(this.controlPoints.length<=2)){if(t?this.controlPoints.shift():this.controlPoints.pop(),this.recompute(),this.updateConnectionVisual(),t){this.removeEditHandle(this.controlPoints.length);for(let e=0;e<this.controlPoints.length;e++)this.setEditHandlePosition(e,this.controlPoints[e])}else this.removeEditHandle(this.controlPoints.length);this.controlPoints.length<40?this.updateSegments(100):this.controlPoints.length<100&&this.updateSegments(500)}}updateControlPoint(t,e){this.controlPoints[t].set(e.x,e.y,e.z),this.recompute(),this.updateConnectionVisual(),this.mode===2&&this.recomputeDeCasteljau(),this.hasEditHandle(t)&&this.setEditHandlePosition(t,e)}getControlPoint(t){return this.controlPoints[t]}getControlPoints(){return this.controlPoints.slice()}highlight(){this.material.color.set(X())}resetHighlight(){this.resetColor()}select(){this.material.color.set(U())}resetSelect(){this.resetColor()}resetColor(){this.material.color.set(this.color)}updateConnectionVisual(){this.connectionVisual!==null&&(this.connectionVisual.geometry.dispose(),this.connectionVisual.geometry=new l.BufferGeometry().setFromPoints(this.controlPoints))}recompute(){this.curve.setPoints(this.controlPoints),this.geometry&&this.geometry.dispose(),this.geometry=new l.TubeGeometry(this.curve,this.segments,this.radius,this.radialSegments,!1),this.mesh.geometry=this.geometry,this.deCasteljauCollisionMesh.geometry.dispose(),this.deCasteljauCollisionMesh.geometry=new l.TubeGeometry(this.curve,this.segments,this.radius*10,this.radialSegments,!1)}}var We=(i=>(i[i.OBJECT=0]="OBJECT",i[i.CONTROL_POINTS=1]="CONTROL_POINTS",i))(We||{});class xt extends G{mode;controlPoints;geometry;material;constructor(t,e=[new l.Vector3(-5,0,0),new l.Vector3(0,5,0),new l.Vector3(5,0,0)],o=new l.Color(0),n=new l.Vector3(0,0,0),s=1){const r=new Ee().setPositions(e.map(d=>[d.x,d.y,d.z]).flat()),c=new go({color:o,linewidth:5});c.side=l.DoubleSide;const h=new po(r,c);super(t,h,n),this.geometry=r,this.material=c,this.controlPoints=e,this.color=o,this.mode=s,this.type="LinearCurveObject";for(let d=0;d<this.controlPoints.length;d++)this.createEditHandle(d),this.setEditHandlePosition(d,this.controlPoints[d]);this.hideEditHandles()}getMode(){return this.mode}setMode(t){this.mode=t,t===0?this.hideEditHandles():t===1&&this.showEditHandles()}toJSON(){return{name:this.name,type:this.type,position:{x:this.mesh.position.x,y:this.mesh.position.y,z:this.mesh.position.z},controlPoints:this.controlPoints.map(t=>({x:t.x,y:t.y,z:t.z})),color:this.color.getHex(),mode:this.mode}}static fromJSON(t){const e=t.controlPoints.map(r=>new l.Vector3(r.x,r.y,r.z)),o=new l.Color(t.color),n=new l.Vector3(t.position.x,t.position.y,t.position.z),s=t.mode;if(We[s]===void 0)throw new Error(`Invalid LinearCurveObjectMode: ${s}`);return new xt(t.name,e,o,n,s)}edit(){return this.editUpdate.bind(this)}editUpdate(){if(this.mode===1){const t=a.getSelectionManager().getSelectedEditHandleIndex();if(t===null)return;const e=this.getEditHandlePosition(t);if(e===null)return;this.updateControlPoint(t,e)}}unedit(){this.hideEditHandles()}updateColor(t){super.setColor(t),this.material.color.set(t)}dispose(){this.material.dispose()}addControlPoint(t,e=!1){if(e?this.controlPoints.unshift(t):this.controlPoints.push(t),this.recompute(),e){this.createEditHandle(this.controlPoints.length-1);for(let o=0;o<this.controlPoints.length;o++)this.setEditHandlePosition(o,this.controlPoints[o])}else this.createEditHandle(this.controlPoints.length-1),this.setEditHandlePosition(this.controlPoints.length-1,t)}removeControlPoint(t=!1){if(!(this.controlPoints.length<=2))if(t?this.controlPoints.shift():this.controlPoints.pop(),this.recompute(),t){this.removeEditHandle(this.controlPoints.length);for(let e=0;e<this.controlPoints.length;e++)this.setEditHandlePosition(e,this.controlPoints[e])}else this.removeEditHandle(this.controlPoints.length)}updateControlPoint(t,e){this.controlPoints[t].set(e.x,e.y,e.z),this.recompute(),this.hasEditHandle(t)&&this.setEditHandlePosition(t,e)}getControlPoint(t){return this.controlPoints[t]}getControlPoints(){return this.controlPoints.slice()}highlight(){this.material.color.set(X())}resetHighlight(){this.resetColor()}select(){this.material.color.set(U())}resetSelect(){this.resetColor()}resetColor(){this.material.color.set(this.color)}recompute(){this.geometry&&this.geometry.dispose(),this.geometry=new Ee().setPositions(this.controlPoints.map(t=>[t.x,t.y,t.z]).flat()),this.mesh.geometry=this.geometry}}function nt(i,t,e,o){if((e<o[0]||e>o[o.length-1])&&console.log("basis: Invalid arguments for t: ",e),i===0)return o[t]<=e&&e<o[t+1]?1:0;let n=o[t+i]-o[t],s=o[t+i+1]-o[t+1],r=n===0?0:(e-o[t])/n*nt(i-1,t,e,o),c=s===0?0:(o[t+i+1]-e)/s*nt(i-1,t+1,e,o);return r+c}function N(i,t){let e=[];for(let o=0;o<=t+i+1;o++)e.push(o);return e}function $o(i,t,e,o,n=!1){if(!i||!Array.isArray(i)||i.length<2)return console.error("bspline: Invalid points array!"),null;if(t<o[0]||t>o[o.length-1])return console.error("bspline: Invalid t value!"),null;let s=i.length-1+(n?e:0);if(o.length!==s+e+2)return console.error("bspline: Invalid knots array!"),null;let r=new w(0,0,0);for(let c=0;c<=s;c++){const h=nt(e,c,t,o);r.addScaledVector(i[c%i.length],h)}return r}class pe extends Gt{controlPoints;degree;knots;closed=!1;constructor(t=[],e=2,o=!1){super(),this.controlPoints=t,this.degree=e,this.closed=o;const n=this.closed?this.degree:0;this.knots=N(this.degree,this.controlPoints.length-1+n)}getPoint(t,e=new w){const o=e;if(this.controlPoints.length<2)return console.log("UniformBSplineCurve: Not enough control points!"),o;if(this.degree<2||this.degree>this.controlPoints.length-1)return console.log("UniformBSplineCurve: Degree is out of range!"),o;t=this.knots[this.degree]+t*(this.knots[this.knots.length-this.degree-1]-this.knots[this.degree]);const n=$o(this.controlPoints,t,this.degree,this.knots,this.closed);return n===null?(console.log("UniformBSplineCurve:getPoint: BSpline calculation failed!"),o):(o.copy(n),o)}setPoints(t){this.controlPoints=t;const e=this.closed?this.degree:0;this.knots=N(this.degree,this.controlPoints.length-1+e)}setDegree(t){if(this.degree===t)return;this.degree=t;const e=this.closed?this.degree:0;this.knots=N(this.degree,this.controlPoints.length-1+e)}setClosed(t){if(this.closed===t)return;this.closed=t;const e=this.closed?this.degree:0;this.knots=N(this.degree,this.controlPoints.length-1+e)}copy(t){return t instanceof pe?(super.copy(t),this.controlPoints=t.controlPoints.map(e=>e.clone()),this.degree=t.degree,this.knots=t.knots.slice(),this.closed=t.closed,this):(console.log("UniformBSplineCurve:copy: Source is not an instance of UniformBSplineCurve!"),this)}}var Ae=(i=>(i[i.OBJECT=0]="OBJECT",i[i.CONTROL_POINTS=1]="CONTROL_POINTS",i))(Ae||{});class Et extends G{mode;controlPoints;degree;segments;radius;radialSegments;geometry;material;curve;connectionVisual;closed=!1;constructor(t,e=[new l.Vector3(-5,0,0),new l.Vector3(0,5,0),new l.Vector3(5,0,0)],o=2,n=new l.Color(0),s=100,r=new l.Vector3(0,0,0),c=1,h=!1){const d=new pe(e,o,h),u=.05,m=8,g=new l.TubeGeometry(d,s,u,m,!1),p=new l.MeshBasicMaterial({color:n});p.side=l.DoubleSide;const b=new l.Mesh(g,p);super(t,b,r),this.curve=d,this.geometry=g,this.material=p,this.controlPoints=e,this.degree=o,this.color=n,this.segments=s,this.mode=c,this.closed=h,this.radius=u,this.radialSegments=m,this.type="UniformBSplineObject";for(let v=0;v<this.controlPoints.length;v++)this.createEditHandle(v),this.setEditHandlePosition(v,this.controlPoints[v]);const f=new l.BufferGeometry().setFromPoints(this.controlPoints),C=new l.LineBasicMaterial({color:U()});this.connectionVisual=new l.Line(f,C),this.connectionVisual.castShadow=!0,b.add(this.connectionVisual),this.connectionVisual.visible=!1,this.hideEditHandles()}getMode(){return this.mode}setMode(t){this.mode=t,t===0?(this.connectionVisual.visible=!1,this.hideEditHandles()):t===1&&(this.connectionVisual.visible=!0,this.showEditHandles())}toJSON(){return{name:this.name,type:this.type,position:{x:this.mesh.position.x,y:this.mesh.position.y,z:this.mesh.position.z},controlPoints:this.controlPoints.map(t=>({x:t.x,y:t.y,z:t.z})),degree:this.degree,color:this.color.getHex(),segments:this.segments,mode:this.mode,closed:this.closed}}static fromJSON(t){const e=t.controlPoints.map(r=>new l.Vector3(r.x,r.y,r.z)),o=new l.Color(t.color),n=new l.Vector3(t.position.x,t.position.y,t.position.z),s=t.mode;if(Ae[s]===void 0)throw new Error("Invalid UniformBSplineObject mode");return new Et(t.name,e,t.degree,o,t.segments,n,s,t.closed)}edit(){return this.editUpdate.bind(this)}editUpdate(){if(this.mode===1){const t=a.getSelectionManager().getSelectedEditHandleIndex();if(t===null)return;const e=this.getEditHandlePosition(t);if(e===null)return;this.updateControlPoint(t,e),this.updateConnectionVisual()}}unedit(){this.connectionVisual.visible=!1,this.hideEditHandles()}addControlPoint(t,e=!1){if(e?this.controlPoints.unshift(t):this.controlPoints.push(t),this.recompute(),this.updateConnectionVisual(),e){this.createEditHandle(this.controlPoints.length-1);for(let o=0;o<this.controlPoints.length;o++)this.setEditHandlePosition(o,this.controlPoints[o])}else this.createEditHandle(this.controlPoints.length-1),this.setEditHandlePosition(this.controlPoints.length-1,t);this.controlPoints.length>100?this.updateSegments(1e3):this.controlPoints.length>30&&this.updateSegments(500)}removeControlPoint(t=!1){if(!(this.controlPoints.length<=3)){if(t?this.controlPoints.shift():this.controlPoints.pop(),this.controlPoints.length-1<this.degree&&(this.degree=this.controlPoints.length-1,this.curve.setDegree(this.degree)),this.recompute(),this.updateConnectionVisual(),t){this.removeEditHandle(this.controlPoints.length);for(let e=0;e<this.controlPoints.length;e++)this.setEditHandlePosition(e,this.controlPoints[e])}else this.removeEditHandle(this.controlPoints.length);this.controlPoints.length<30?this.updateSegments(100):this.controlPoints.length<100&&this.updateSegments(500)}}updateControlPoint(t,e){this.controlPoints[t].set(e.x,e.y,e.z),this.recompute(),this.updateConnectionVisual(),this.hasEditHandle(t)&&this.setEditHandlePosition(t,e)}getControlPoint(t){return this.controlPoints[t]}getControlPoints(){return this.controlPoints.slice()}getDegree(){return this.degree}setDegree(t){this.degree=t,this.curve.setDegree(t),this.recompute()}isClosed(){return this.closed}setClosed(t){this.closed=t,this.curve.setClosed(t),this.recompute()}updateSegments(t){this.segments=t,this.recompute()}updateColor(t){super.setColor(t),this.material.color.set(t)}dispose(){this.material.dispose()}highlight(){this.material.color.set(X())}resetHighlight(){this.resetColor()}select(){this.material.color.set(U())}resetSelect(){this.resetColor()}resetColor(){this.material.color.set(this.color)}updateConnectionVisual(){this.connectionVisual!==null&&(this.connectionVisual.geometry.dispose(),this.connectionVisual.geometry=new l.BufferGeometry().setFromPoints(this.controlPoints))}recompute(){this.curve.setPoints(this.controlPoints),this.geometry&&this.geometry.dispose(),this.geometry=new l.TubeGeometry(this.curve,this.segments,this.radius,this.radialSegments,!1),this.mesh.geometry=this.geometry}}function _o(i,t,e,o,n=!1){if(!i||!Array.isArray(i)||i.length<2)return console.error("bspline: Invalid points array!"),null;if(t<o[0]||t>o[o.length-1])return console.error("bspline: Invalid t value!"),null;let s=i.length-1+(n?e:0);if(o.length!==s+e+2)return console.error("bspline: Invalid knots array!"),null;let r=new w(0,0,0),c=0;for(let h=0;h<=s;h++){const d=nt(e,h,t,o),u=h%i.length,m=new w(i[u].x,i[u].y,i[u].z),g=i[u].w*d;r.addScaledVector(m,g),c+=g}return c===0?null:r.divideScalar(c)}class fe extends Gt{controlPoints;degree;knots;closed;constructor(t=[],e=2,o=!1){super(),this.controlPoints=t,this.degree=e,this.closed=o;const n=this.closed?this.degree:0;this.knots=N(this.degree,this.controlPoints.length-1+n)}getPoint(t,e=new w){const o=e;if(this.controlPoints.length<3)return console.log("UniformRationalBSplineCurve: Not enough control points!"),o;if(this.degree<2||this.degree>this.controlPoints.length-1)return console.log("UniformRationalBSplineCurve: Degree is out of range!"),o;t=this.knots[this.degree]+t*(this.knots[this.knots.length-this.degree-1]-this.knots[this.degree]);const n=_o(this.controlPoints,t,this.degree,this.knots,this.closed);return n===null?(console.log("UniformRationalBSplineCurve:getPoint: BSpline calculation failed!"),o):(o.copy(n),o)}setPoints(t){this.controlPoints=t;const e=this.closed?this.degree:0;this.knots=N(this.degree,this.controlPoints.length-1+e)}setDegree(t){if(this.degree===t)return;this.degree=t;const e=this.closed?this.degree:0;this.knots=N(this.degree,this.controlPoints.length-1+e)}setClosed(t){if(this.closed===t)return;this.closed=t;const e=this.closed?this.degree:0;this.knots=N(this.degree,this.controlPoints.length-1+e)}copy(t){return t instanceof fe?(super.copy(t),this.controlPoints=t.controlPoints.map(e=>e.clone()),this.degree=t.degree,this.knots=t.knots.slice(),this.closed=t.closed,this):(console.log("UniformRationalBSplineCurve:copy: Source is not an instance of UniformBSplineCurve!"),this)}}var Fe=(i=>(i[i.OBJECT=0]="OBJECT",i[i.CONTROL_POINTS=1]="CONTROL_POINTS",i))(Fe||{});class St extends G{mode;controlPoints;degree;segments;radius;radialSegments;geometry;material;curve;connectionVisual;weightEditIndex=-1;weightEditRing;closed=!1;constructor(t,e=[new l.Vector4(-5,0,0,1),new l.Vector4(0,5,0,1),new l.Vector4(5,0,0,1)],o=2,n=new l.Color(0),s=100,r=new l.Vector3(0,0,0),c=1,h=!1){const d=new fe(e,o,h),u=.05,m=8,g=new l.TubeGeometry(d,s,u,m,!1),p=new l.MeshBasicMaterial({color:n});p.side=l.DoubleSide;const b=new l.Mesh(g,p);super(t,b,r),this.curve=d,this.geometry=g,this.material=p,this.controlPoints=e,this.degree=o,this.color=n,this.segments=s,this.mode=c,this.closed=h,this.radius=u,this.radialSegments=m,this.type="UniformRationBSplineObject";for(let M=0;M<this.controlPoints.length;M++){this.createEditHandle(M);const x=new l.Vector3(this.controlPoints[M].x,this.controlPoints[M].y,this.controlPoints[M].z);this.setEditHandlePosition(M,x)}const f=new l.BufferGeometry().setFromPoints(this.controlPoints.map(M=>new l.Vector3(M.x,M.y,M.z))),C=new l.LineBasicMaterial({color:U()});this.connectionVisual=new l.Line(f,C),this.connectionVisual.castShadow=!0,b.add(this.connectionVisual),this.connectionVisual.visible=!1,this.hideEditHandles();const v=new l.RingGeometry(.05,.06,32),E=new l.MeshBasicMaterial({color:U()});this.weightEditRing=new l.Mesh(v,E),b.add(this.weightEditRing),this.weightEditRing.visible=!1,a.onOrbitControlsChange(()=>{this.weightEditIndex!==-1&&this.weightEditRing.lookAt(a.getCamera().position)}),window.addEventListener("wheel",M=>{if(this.weightEditIndex!==-1){const x=this.controlPoints[this.weightEditIndex];x.w+=M.deltaY*.01,x.w<1&&(x.w=1),x.w>10&&(x.w=10),this.updateControlPoint(this.weightEditIndex,x),y.notify("objectChanged",P.VIEWPORT,this)}})}getMode(){return this.mode}setMode(t){this.mode=t,t===0?(this.connectionVisual.visible=!1,this.hideWeightEditRing(),this.hideEditHandles()):t===1&&(this.connectionVisual.visible=!0,this.showEditHandles())}toJSON(){return{name:this.name,type:this.type,position:{x:this.mesh.position.x,y:this.mesh.position.y,z:this.mesh.position.z},controlPoints:this.controlPoints.map(t=>({x:t.x,y:t.y,z:t.z,w:t.w})),degree:this.degree,color:this.color.getHex(),segments:this.segments,mode:this.mode,closed:this.closed}}static fromJSON(t){const e=t.controlPoints.map(r=>new l.Vector4(r.x,r.y,r.z,r.w)),o=new l.Color(t.color),n=new l.Vector3(t.position.x,t.position.y,t.position.z),s=t.mode;if(Fe[s]===void 0)throw new Error("Invalid UniformBSplineObject mode");return new St(t.name,e,t.degree,o,t.segments,n,s,t.closed)}edit(){return this.editUpdate.bind(this)}editUpdate(){if(this.mode===1){const t=a.getSelectionManager().getSelectedEditHandleIndex();if(t===null)return;const e=this.getEditHandlePosition(t);if(e===null)return;this.updateControlPoint3(t,e),this.updateConnectionVisual()}}unedit(){this.connectionVisual.visible=!1,this.hideWeightEditRing(),this.hideEditHandles()}showWeightEditRing(t){this.weightEditIndex=t,this.updateWeightEditRing(),this.weightEditRing.visible=!0,a.noScroll()}hideWeightEditRing(){this.weightEditIndex=-1,this.weightEditRing.visible=!1,a.scroll()}updateWeightEditRing(){if(this.weightEditIndex===-1)return;const t=this.controlPoints[this.weightEditIndex];this.weightEditRing.position.set(t.x,t.y,t.z);const e=Re(t.w,1,10,8,20);this.weightEditRing.scale.set(e,e,e),this.weightEditRing.lookAt(a.getCamera().position)}addControlPoint(t,e=!1){if(e?this.controlPoints.unshift(t):this.controlPoints.push(t),this.recompute(),this.updateConnectionVisual(),e){this.createEditHandle(this.controlPoints.length-1);for(let o=0;o<this.controlPoints.length;o++){const n=new l.Vector3(this.controlPoints[o].x,this.controlPoints[o].y,this.controlPoints[o].z);this.setEditHandlePosition(o,n)}}else{this.createEditHandle(this.controlPoints.length-1);const o=this.controlPoints.length-1,n=new l.Vector3(this.controlPoints[o].x,this.controlPoints[o].y,this.controlPoints[o].z);this.setEditHandlePosition(this.controlPoints.length-1,n)}this.controlPoints.length>60?this.updateSegments(1e3):this.controlPoints.length>30&&this.updateSegments(500)}removeControlPoint(t=!1){if(!(this.controlPoints.length<=3)){if(t?this.controlPoints.shift():this.controlPoints.pop(),this.controlPoints.length-1<this.degree&&(this.degree=this.controlPoints.length-1,this.curve.setDegree(this.degree)),this.recompute(),this.updateConnectionVisual(),t){this.removeEditHandle(this.controlPoints.length);for(let e=0;e<this.controlPoints.length;e++){const o=new l.Vector3(this.controlPoints[e].x,this.controlPoints[e].y,this.controlPoints[e].z);this.setEditHandlePosition(e,o)}}else this.removeEditHandle(this.controlPoints.length);this.controlPoints.length<30?this.updateSegments(100):this.controlPoints.length<60&&this.updateSegments(500)}}updateControlPoint3(t,e){this.updateControlPoint(t,new l.Vector4(e.x,e.y,e.z,this.getControlPoint(t).w))}updateControlPoint(t,e){if(this.controlPoints[t].set(e.x,e.y,e.z,e.w),this.recompute(),this.updateConnectionVisual(),this.hasEditHandle(t)){const o=new l.Vector3(this.controlPoints[t].x,this.controlPoints[t].y,this.controlPoints[t].z);this.setEditHandlePosition(t,o)}this.weightEditIndex===t&&this.updateWeightEditRing()}getControlPoint(t){return this.controlPoints[t]}getControlPoints(){return this.controlPoints.slice()}getDegree(){return this.degree}setDegree(t){this.degree=t,this.curve.setDegree(t),this.recompute()}isClosed(){return this.closed}setClosed(t){this.closed=t,this.curve.setClosed(t),this.recompute()}updateSegments(t){this.segments=t,this.recompute()}updateColor(t){super.setColor(t),this.material.color.set(t)}dispose(){this.material.dispose()}highlight(){this.material.color.set(X())}resetHighlight(){this.resetColor()}select(){this.material.color.set(U())}resetSelect(){this.resetColor()}resetColor(){this.material.color.set(this.color)}updateConnectionVisual(){this.connectionVisual!==null&&(this.connectionVisual.geometry.dispose(),this.connectionVisual.geometry=new l.BufferGeometry().setFromPoints(this.controlPoints.map(t=>new l.Vector3(t.x,t.y,t.z))))}recompute(){this.curve.setPoints(this.controlPoints),this.geometry&&this.geometry.dispose(),this.geometry=new l.TubeGeometry(this.curve,this.segments,this.radius,this.radialSegments,!1),this.mesh.geometry=this.geometry}}class be extends Gt{controlPoints;constructor(t=[]){super(),this.controlPoints=t}getPoint(t,e=new w){const o=e;if((this.controlPoints.length-1)%3!==0)return console.log("BezierSplineCurve: Not 3p+1 control points!"),o;const n=(this.controlPoints.length-1)/3,s=Math.min(Math.floor(t*n),n-1),r=(t-s/n)*n,c=s*3,h=Ko(this.controlPoints[c],this.controlPoints[c+1],this.controlPoints[c+2],this.controlPoints[c+3],r);return h===null?(console.log("BezierSplineCurve:getPoint: Bezier calculation failed!"),o):(o.copy(h),o)}setPoints(t){this.controlPoints=t}copy(t){return t instanceof be?(super.copy(t),this.controlPoints=t.controlPoints.map(e=>e.clone()),this):(console.log("BezierSplineCurve:copy: Source is not an instance of BezierCurve!"),this)}}var Ge=(i=>(i[i.OBJECT=0]="OBJECT",i[i.CONTROL_POINTS=1]="CONTROL_POINTS",i))(Ge||{});class Ot extends G{mode;controlPoints;segments;radius;radialSegments;geometry;material;curve;connectionVisuals;constructor(t,e=[new l.Vector3(-5,0,0),new l.Vector3(0,5,0),new l.Vector3(5,0,0)],o=new l.Color(0),n=100,s=new l.Vector3(0,0,0),r=1){const c=new be(e),h=.05,d=8,u=new l.TubeGeometry(c,n,h,d,!1),m=new l.MeshBasicMaterial({color:o});m.side=l.DoubleSide;const g=new l.Mesh(u,m);super(t,g,s),this.curve=c,this.geometry=u,this.material=m,this.controlPoints=e,this.color=o,this.segments=n,this.mode=r,this.radius=h,this.radialSegments=d,this.type="BezierSplineObject";for(let f=0;f<this.controlPoints.length;f++)f%3===0?this.createEditHandle(f,.3):this.createEditHandle(f,.15),this.setEditHandlePosition(f,this.controlPoints[f]);this.connectionVisuals=[];const p=new l.LineBasicMaterial({color:U()});this.connectionVisuals.push(new l.Line(new l.BufferGeometry().setFromPoints([this.controlPoints[0],this.controlPoints[1]]),p));const b=Math.floor((this.controlPoints.length-1)/3)+1;for(let f=1;f<b-1;f++){const C=2+(f-1)*3,v=[this.controlPoints[C],this.controlPoints[C+1],this.controlPoints[C+2]];this.connectionVisuals.push(new l.Line(new l.BufferGeometry().setFromPoints(v),p))}this.connectionVisuals.push(new l.Line(new l.BufferGeometry().setFromPoints([this.controlPoints[this.controlPoints.length-2],this.controlPoints[this.controlPoints.length-1]]),p)),this.connectionVisuals.forEach(f=>this.mesh.add(f)),this.hideConnectionVisuals(),this.hideEditHandles()}getMode(){return this.mode}setMode(t){this.mode=t,t===0?(this.hideConnectionVisuals(),this.hideEditHandles()):t===1&&(this.showConnectionVisuals(),this.showEditHandles())}toJSON(){return{name:this.name,type:this.type,position:{x:this.mesh.position.x,y:this.mesh.position.y,z:this.mesh.position.z},controlPoints:this.controlPoints.map(t=>({x:t.x,y:t.y,z:t.z})),color:this.color.getHex(),segments:this.segments,mode:this.mode}}static fromJSON(t){const e=t.controlPoints.map(r=>new l.Vector3(r.x,r.y,r.z)),o=new l.Color(t.color),n=new l.Vector3(t.position.x,t.position.y,t.position.z),s=t.mode;if(Ge[s]===void 0)throw new Error("Invalid BezierCurveObject mode");return new Ot(t.name,e,o,t.segments,n,s)}edit(){return this.editUpdate.bind(this)}editUpdate(){if(this.mode===1){const t=a.getSelectionManager().getSelectedEditHandleIndex();if(t===null)return;const e=this.getEditHandlePosition(t);if(e===null)return;this.updateControlPoint(t,e)}}unedit(){this.hideConnectionVisuals(),this.hideEditHandles()}updateSegments(t){this.segments=t,this.recompute()}updateColor(t){super.setColor(t),this.material.color.set(t)}dispose(){this.material.dispose()}addControlPoint(t,e=!1){if(e){const o=this.controlPoints.length-1;this.controlPoints.unshift(new l.Vector3(0,0,0)),this.createEditHandle(o+1,.15);const n=t.clone().add(this.controlPoints[1].clone().sub(t).setLength(3));this.controlPoints.unshift(n),this.createEditHandle(o+2,.15),this.controlPoints.unshift(t.clone()),this.createEditHandle(o+3,.3);for(let r=0;r<this.controlPoints.length;r++)this.setEditHandlePosition(r,this.controlPoints[r]);this.updateControlPoint(4,this.controlPoints[4]),this.updateControlPoint(0,this.controlPoints[0]);const s=new l.Line(new l.BufferGeometry().setFromPoints([this.controlPoints[0],this.controlPoints[1]]),new l.LineBasicMaterial({color:U()}));this.connectionVisuals.unshift(s),this.mesh.add(s)}else{const o=this.controlPoints.length-1;this.controlPoints.push(new l.Vector3(0,0,0)),this.createEditHandle(o+1,.15);const n=t.clone().add(this.controlPoints[o].clone().sub(t).setLength(3));this.controlPoints.push(n),this.createEditHandle(o+2,.15),this.controlPoints.push(t.clone()),this.createEditHandle(o+3,.3),this.updateControlPoint(o-1,this.controlPoints[o-1]),this.updateControlPoint(o+3,this.controlPoints[o+3]);const s=new l.Line(new l.BufferGeometry().setFromPoints([this.controlPoints[this.controlPoints.length-2],this.controlPoints[this.controlPoints.length-1]]),new l.LineBasicMaterial({color:U()}));this.connectionVisuals.push(s),this.mesh.add(s)}this.recompute(),this.updateConnectionVisuals(),this.controlPoints.length>100?this.updateSegments(1e3):this.controlPoints.length>40&&this.updateSegments(500)}removeControlPoint(t=!1){if(!(this.controlPoints.length<=6)){if(t){this.controlPoints.shift(),this.removeEditHandle(this.controlPoints.length),this.controlPoints.shift(),this.removeEditHandle(this.controlPoints.length),this.controlPoints.shift(),this.removeEditHandle(this.controlPoints.length);for(let o=0;o<this.controlPoints.length;o++)this.setEditHandlePosition(o,this.controlPoints[o]);const e=this.connectionVisuals.shift();e&&this.mesh.remove(e)}else{this.controlPoints.pop(),this.removeEditHandle(this.controlPoints.length),this.controlPoints.pop(),this.removeEditHandle(this.controlPoints.length),this.controlPoints.pop(),this.removeEditHandle(this.controlPoints.length);const e=this.connectionVisuals.pop();e&&this.mesh.remove(e)}this.recompute(),this.updateConnectionVisuals(),this.controlPoints.length<40?this.updateSegments(100):this.controlPoints.length<100&&this.updateSegments(500)}}updateControlPoint(t,e){if(t===0){const o=e.clone().sub(this.controlPoints[0]);this.controlPoints[0].set(e.x,e.y,e.z),this.setEditHandle(0),this.controlPoints[1].add(o),this.setEditHandle(1)}else if(t===1)this.controlPoints[1].set(e.x,e.y,e.z),this.setEditHandle(1);else if(t===this.controlPoints.length-1){const o=e.clone().sub(this.controlPoints[this.controlPoints.length-1]);this.controlPoints[this.controlPoints.length-1].set(e.x,e.y,e.z),this.setEditHandle(this.controlPoints.length-1),this.controlPoints[this.controlPoints.length-2].add(o),this.setEditHandle(this.controlPoints.length-2)}else if(t===this.controlPoints.length-2)this.controlPoints[this.controlPoints.length-2].set(e.x,e.y,e.z),this.setEditHandle(this.controlPoints.length-2);else if(t%3===0){const o=e.clone().sub(this.controlPoints[t]);this.controlPoints[t].set(e.x,e.y,e.z),this.setEditHandle(t),this.controlPoints[t-1].add(o),this.setEditHandle(t-1),this.controlPoints[t+1].add(o),this.setEditHandle(t+1)}else if(t%3===1){this.controlPoints[t].set(e.x,e.y,e.z),this.setEditHandle(t);const n=this.controlPoints[t-1].clone().multiplyScalar(2).sub(e);this.controlPoints[t-2].set(n.x,n.y,n.z),this.setEditHandle(t-2)}else if(t%3===2){this.controlPoints[t].set(e.x,e.y,e.z),this.setEditHandle(t);const n=this.controlPoints[t+1].clone().multiplyScalar(2).sub(e);this.controlPoints[t+2].set(n.x,n.y,n.z),this.setEditHandle(t+2)}this.recompute(),this.updateConnectionVisuals()}setEditHandle(t){this.hasEditHandle(t)&&this.setEditHandlePosition(t,this.controlPoints[t])}getControlPoint(t){return this.controlPoints[t]}getControlPoints(){return this.controlPoints.slice()}highlight(){this.material.color.set(X())}resetHighlight(){this.resetColor()}select(){this.material.color.set(U())}resetSelect(){this.resetColor()}resetColor(){this.material.color.set(this.color)}hideConnectionVisuals(){this.connectionVisuals!==null&&this.connectionVisuals.forEach(t=>t.visible=!1)}showConnectionVisuals(){this.connectionVisuals!==null&&this.connectionVisuals.forEach(t=>t.visible=!0)}updateConnectionVisuals(){if(this.connectionVisuals===null)return;this.connectionVisuals[0].geometry.dispose(),this.connectionVisuals[0].geometry=new l.BufferGeometry().setFromPoints([this.controlPoints[0],this.controlPoints[1]]);const t=Math.floor((this.controlPoints.length-1)/3)+1;for(let e=1;e<t-1;e++){const o=2+(e-1)*3,n=[this.controlPoints[o],this.controlPoints[o+1],this.controlPoints[o+2]];this.connectionVisuals[e].geometry.dispose(),this.connectionVisuals[e].geometry=new l.BufferGeometry().setFromPoints(n)}this.connectionVisuals[this.connectionVisuals.length-1].geometry.dispose(),this.connectionVisuals[this.connectionVisuals.length-1].geometry=new l.BufferGeometry().setFromPoints([this.controlPoints[this.controlPoints.length-2],this.controlPoints[this.controlPoints.length-1]])}recompute(){this.curve.setPoints(this.controlPoints),this.geometry&&this.geometry.dispose(),this.geometry=new l.TubeGeometry(this.curve,this.segments,this.radius,this.radialSegments,!1),this.mesh.geometry=this.geometry}}function Xo(){return`
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
`}function te(i,t,e,o,n=!1,s=!1){const r=[],c=n?o:0,h=s?o:0,d=N(o,i.getWidth()-1+c),u=N(o,i.getHeight()-1+h);for(let m=0;m<e;m++){const g=m/(e-1);for(let p=0;p<t;p++){const b=p/(t-1);r.push(Yo(i,b,g,o,d,u,n,s))}}return r}function Yo(i,t,e,o,n,s,r=!1,c=!1){const h=new w(0,0,0),d=r?o:0,u=c?o:0;for(let m=0;m<i.getWidth()+d;m++){const g=n[o]+t*(n[n.length-o-1]-n[o]),p=nt(o,m,g,n);for(let b=0;b<i.getHeight()+u;b++){const f=i.getPoint(b%i.getHeight(),m%i.getWidth()),C=s[o]+e*(s[s.length-o-1]-s[o]),v=nt(o,b,C,s);h.add(f.clone().multiplyScalar(p*v))}}return h}function ee(i,t,e,o,n=!1,s=!1){const r=[],c=n?o:0,h=s?o:0,d=N(o,i.getWidth()-1+c),u=N(o,i.getHeight()-1+h);for(let m=0;m<e;m++){const g=m/(e-1);for(let p=0;p<t;p++){const b=p/(t-1);r.push(qo(i,b,g,o,d,u,n,s))}}return r}function qo(i,t,e,o,n,s,r=!1,c=!1){const h=new w(0,0,0);var d=0;const u=r?o:0,m=c?o:0;for(let g=0;g<i.getWidth()+u;g++){const p=n[o]+t*(n[n.length-o-1]-n[o]),b=nt(o,g,p,n);for(let f=0;f<i.getHeight()+m;f++){const C=i.getPoint(f%i.getHeight(),g%i.getWidth()),v=i.getPoint4(f%i.getHeight(),g%i.getWidth()).w,E=s[o]+e*(s[s.length-o-1]-s[o]),M=nt(o,f,E,s),x=v*b*M;h.add(C.clone().multiplyScalar(x)),d+=x}}return h.divideScalar(d)}var Je=(i=>(i[i.OBJECT=0]="OBJECT",i[i.CONTROL_POINTS=1]="CONTROL_POINTS",i[i.SHADING=2]="SHADING",i))(Je||{});class jt extends G{mode;controlPoints;degree;geometry;material;collisionGeometry;collisionMesh;radius=.1;closedU;closedV;constructor(t,e,o,n,s=2,r=new l.Color(0),c=new l.Vector3(0,0,0),h=1,d=new yt,u=!1,m=!1){if(u&&m)throw new Error("Cannot have both closedU and closedV set to true. Please set one of them to false.");const g=new he(o,n);for(let E=0;E<o;E++)for(let M=0;M<n;M++){const x=E+M*o;g.setPoint(M,E,e[x])}const p=new l.PlaneGeometry(0,0,100,100),b=new me(Xo(),g,r,d,{degree:{value:s},closedU:{value:u},closedV:{value:m}}),f=new l.Mesh(p,b.getMaterial());super(t,f,c),this.controlPoints=g,this.geometry=p,this.material=b,this.mode=h,this.color=r,this.degree=s,this.closedU=u,this.closedV=m,this.type="UniformBSplineSurfaceObject",this.export=this.exportMesh.bind(this);for(let E=0;E<o;E++)for(let M=0;M<n;M++){const x=E+M*o;this.createEditHandle(x,this.radius),this.setEditHandlePosition(x,e[x])}this.hideEditHandles(),this.controlPoints.addVisuals(this.mesh);const C=this.controlPoints.getWidth()+3,v=this.controlPoints.getHeight()+3;this.collisionGeometry=$(te(this.controlPoints,C,v,this.degree,this.closedU,this.closedV),C,v),this.collisionMesh=new l.Mesh(this.collisionGeometry,new l.MeshBasicMaterial({transparent:!0,opacity:0,visible:!1,side:l.DoubleSide})),this.collisionMesh.userData.collision=!0,this.collisionMesh.userData.object=this,this.mesh.add(this.collisionMesh)}getMode(){return this.mode}setMode(t){this.mode=t,this.mode===0?(this.hideEditHandles(),this.controlPoints.hideVisuals()):this.mode===1?(this.showEditHandles(),this.controlPoints.showVisuals()):this.mode===2&&(this.hideEditHandles(),this.controlPoints.hideVisuals())}toJSON(){return{name:this.name,type:this.type,position:{x:this.mesh.position.x,y:this.mesh.position.y,z:this.mesh.position.z},controlPoints:this.controlPoints.getPoints().map(t=>({x:t.x,y:t.y,z:t.z})),controlPointsWidth:this.controlPoints.getWidth(),controlPointsHeight:this.controlPoints.getHeight(),degree:this.degree,color:this.color.getHex(),mode:this.mode,closedU:this.closedU,closedV:this.closedV,shadingModel:{name:this.material.getShadingModelName(),params:this.material.getShadingModelJSON()}}}static fromJSON(t){const e=t.controlPoints.map(d=>new l.Vector3(d.x,d.y,d.z)),o=new l.Color(t.color),n=new l.Vector3(t.position.x,t.position.y,t.position.z),s=t.mode;if(Je[s]===void 0)throw new Error("Invalid UniformBSplineSurfaceObjectMode mode");const c=Mt()[t.shadingModel.name].create();return c.fromJSON(t.shadingModel.params),new jt(t.name,e,t.controlPointsWidth,t.controlPointsHeight,t.degree,o,n,s,c,t.closedU,t.closedV)}edit(){return this.collisionMesh.userData.collision=!1,this.editUpdate.bind(this)}editUpdate(){if(this.mode===1){const t=a.getSelectionManager().getSelectedEditHandleIndex();if(t===null)return;const e=this.getEditHandlePosition(t);if(e===null)return;this.updateControlPoint(t,e)}}unedit(){this.hideEditHandles(),this.controlPoints.hideVisuals(),this.collisionMesh.userData.collision=!0}updateColor(t){super.setColor(t),this.material.setColor(t)}getMaterial(){return this.material}dispose(){this.material.dispose()}addControlPoint(t,e){if(!this.hasEditHandle(t))return;const o=this.getEditHandlePosition(t);if(o===null)return;const n=Math.floor(t/this.controlPoints.getWidth()),s=t%this.controlPoints.getWidth(),r=o.clone().sub(e),c=new l.Vector3(0,r.y,r.z),h=new l.Vector3(r.x,r.y,0);n===0&&s===0?(this.addControlPointRowCol(n,-1,c),this.addControlPointRowCol(-1,s,h)):n===0&&s===this.controlPoints.getWidth()-1?(this.addControlPointRowCol(n,-1,c),this.addControlPointRowCol(-1,s,h)):n===this.controlPoints.getHeight()-1&&s===0?(this.addControlPointRowCol(-1,s,h),this.addControlPointRowCol(n,-1,c)):n===this.controlPoints.getHeight()-1&&s===this.controlPoints.getWidth()-1?(this.addControlPointRowCol(-1,s,h),this.addControlPointRowCol(n,-1,c)):this.addControlPointRowCol(n,s,r);for(let d=0;d<this.controlPoints.getWidth();d++)for(let u=0;u<this.controlPoints.getHeight();u++){const m=d+u*this.controlPoints.getWidth();this.setEditHandlePosition(m,this.controlPoints.getPoint(u,d))}this.material.updateControlPoints(),this.updateCollisionGeometry()}addControlPointRowCol(t,e,o){var n=0,s=0;t===0?(this.controlPoints.addRow(o,!0),n=this.controlPoints.getWidth(),s=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1)):t===this.controlPoints.getHeight()-1?(this.controlPoints.addRow(o,!1),n=this.controlPoints.getWidth(),s=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1)):e===0?(this.controlPoints.addColumn(o,!0),n=this.controlPoints.getHeight(),s=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight()):e===this.controlPoints.getWidth()-1&&(console.log("Adding column to the right"),this.controlPoints.addColumn(o,!1),n=this.controlPoints.getHeight(),s=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight());for(let r=0;r<n;r++)this.createEditHandle(s+r,this.radius)}removeControlPoint(t){if(this.controlPoints.getWidth()<=3||this.controlPoints.getHeight()<=3||!this.hasEditHandle(t))return;const e=Math.floor(t/this.controlPoints.getWidth()),o=t%this.controlPoints.getWidth();e===0||o===0||e===this.controlPoints.getHeight()-1||o===this.controlPoints.getWidth()-1?(this.removeControlPointRowCol(e,-1),this.removeControlPointRowCol(-1,o)):this.removeControlPointRowCol(e,o);for(let n=0;n<this.controlPoints.getWidth();n++)for(let s=0;s<this.controlPoints.getHeight();s++){const r=n+s*this.controlPoints.getWidth();this.setEditHandlePosition(r,this.controlPoints.getPoint(s,n))}this.getMaxDegree()<this.degree&&(this.degree=this.getMaxDegree()),this.material.updateControlPoints(),this.updateCollisionGeometry()}removeControlPointRowCol(t,e){var o=0,n=0;t===0?(o=this.controlPoints.getWidth(),n=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1),this.controlPoints.removeRow(!0)):t===this.controlPoints.getHeight()-1?(o=this.controlPoints.getWidth(),n=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1),this.controlPoints.removeRow(!1)):e===0?(o=this.controlPoints.getHeight(),n=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight(),this.controlPoints.removeColumn(!0)):e===this.controlPoints.getWidth()-1&&(o=this.controlPoints.getHeight(),n=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight(),this.controlPoints.removeColumn(!1));for(let s=0;s<o;s++)this.removeEditHandle(n+s)}updateControlPoint(t,e){const o=Math.floor(t/this.controlPoints.getWidth()),n=t%this.controlPoints.getWidth();this.controlPoints.setPoint(o,n,e),this.hasEditHandle(t)&&this.setEditHandlePosition(t,e),this.updateCollisionGeometry()}getControlPoint(t){const e=Math.floor(t/this.controlPoints.getWidth()),o=t%this.controlPoints.getWidth();return this.controlPoints.getPoint(e,o)}highlight(){this.material.setColor(X())}resetHighlight(){this.resetColor()}select(){this.resetColor()}resetSelect(){this.resetColor()}resetColor(){this.material.setColor(this.color)}setDegree(t){this.degree=t,this.material.setCustomUniform("degree",this.degree),this.updateCollisionGeometry()}getDegree(){return this.degree}getMaxDegree(){return Math.min(this.controlPoints.getWidth(),this.controlPoints.getHeight())-1}setClosedU(t){this.closedU=t,this.closedV=!1,this.material.setCustomUniform("closedU",this.closedU),this.material.setCustomUniform("closedV",this.closedV),this.updateCollisionGeometry()}setClosedV(t){this.closedV=t,this.closedU=!1,this.material.setCustomUniform("closedU",this.closedU),this.material.setCustomUniform("closedV",this.closedV),this.updateCollisionGeometry()}getClosedU(){return this.closedU}getClosedV(){return this.closedV}updateCollisionGeometry(){this.collisionGeometry.dispose();const t=this.controlPoints.getWidth()+3,e=this.controlPoints.getHeight()+3;this.collisionGeometry=$(te(this.controlPoints,t,e,this.degree,this.closedU,this.closedV),t,e),this.collisionMesh.geometry=this.collisionGeometry}exportMesh(){const t=te(this.controlPoints,100,100,this.degree,this.closedU,this.closedV),e=$(t,100,100),o=new l.MeshStandardMaterial({color:this.color,side:l.DoubleSide}),n=new l.Mesh(e,o);return n.position.copy(this.mesh.position),n.rotation.copy(this.mesh.rotation),n.scale.copy(this.mesh.scale),n}}function Zo(){return`
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
`}var Ke=(i=>(i[i.OBJECT=0]="OBJECT",i[i.CONTROL_POINTS=1]="CONTROL_POINTS",i[i.SHADING=2]="SHADING",i))(Ke||{});class Ht extends G{mode;controlPoints;degree;geometry;material;collisionGeometry;collisionMesh;radius=.1;weightEditIndex=-1;weightEditRing;closedU;closedV;constructor(t,e,o,n,s=2,r=new l.Color(0),c=new l.Vector3(0,0,0),h=1,d=new yt,u=!1,m=!1){if(u&&m)throw new Error("Cannot have both closedU and closedV set to true. Please set one of them to false.");const g=new he(o,n);for(let x=0;x<o;x++)for(let S=0;S<n;S++){const L=x+S*o;g.setPoint4(S,x,e[L])}const p=new l.PlaneGeometry(0,0,100,100),b=new me(Zo(),g,r,d,{degree:{value:s},closedU:{value:u},closedV:{value:m}}),f=new l.Mesh(p,b.getMaterial());super(t,f,c),this.controlPoints=g,this.geometry=p,this.material=b,this.mode=h,this.color=r,this.degree=s,this.closedU=u,this.closedV=m,this.type="UniformRationalBSplineSurfaceObject",this.export=this.exportMesh.bind(this);for(let x=0;x<o;x++)for(let S=0;S<n;S++){const L=x+S*o;this.createEditHandle(L,this.radius),this.setEditHandlePosition(L,this.controlPoints.getPoint(S,x))}this.hideEditHandles(),this.controlPoints.addVisuals(this.mesh);const C=this.controlPoints.getWidth()+1,v=this.controlPoints.getHeight()+1;this.collisionGeometry=$(ee(this.controlPoints,C,v,this.degree,this.closedU,this.closedV),C,v),this.collisionMesh=new l.Mesh(this.collisionGeometry,new l.MeshBasicMaterial({transparent:!0,opacity:0,visible:!1,side:l.DoubleSide})),this.collisionMesh.userData.collision=!0,this.collisionMesh.userData.object=this,this.mesh.add(this.collisionMesh);const E=new l.RingGeometry(.05,.06,32),M=new l.MeshBasicMaterial({color:U(),depthTest:!1,side:l.DoubleSide});this.weightEditRing=new l.Mesh(E,M),f.add(this.weightEditRing),this.weightEditRing.visible=!1,a.onOrbitControlsChange(()=>{this.weightEditIndex!==-1&&this.weightEditRing.lookAt(a.getCamera().position)}),window.addEventListener("wheel",x=>{if(this.weightEditIndex!==-1){const S=this.getControlPoint(this.weightEditIndex);S.w+=x.deltaY*.01,S.w<1&&(S.w=1),S.w>10&&(S.w=10),this.updateControlPoint(this.weightEditIndex,S),y.notify("objectChanged",P.VIEWPORT,this)}})}getMode(){return this.mode}setMode(t){this.mode=t,this.mode===0?(this.hideEditHandles(),this.controlPoints.hideVisuals(),this.hideWeightEditRing()):this.mode===1?(this.showEditHandles(),this.controlPoints.showVisuals()):this.mode===2&&(this.hideEditHandles(),this.controlPoints.hideVisuals(),this.hideWeightEditRing())}toJSON(){return{name:this.name,type:this.type,position:{x:this.mesh.position.x,y:this.mesh.position.y,z:this.mesh.position.z},controlPoints:this.controlPoints.getPoints4().map(t=>({x:t.x,y:t.y,z:t.z,w:t.w})),controlPointsWidth:this.controlPoints.getWidth(),controlPointsHeight:this.controlPoints.getHeight(),degree:this.degree,color:this.color.getHex(),mode:this.mode,closedU:this.closedU,closedV:this.closedV,shadingModel:{name:this.material.getShadingModelName(),params:this.material.getShadingModelJSON()}}}static fromJSON(t){const e=t.controlPoints.map(d=>new l.Vector4(d.x,d.y,d.z,d.w)),o=new l.Color(t.color),n=new l.Vector3(t.position.x,t.position.y,t.position.z),s=t.mode;if(Ke[s]===void 0)throw new Error("Invalid UniformRationalBSplineSurfaceObjectMode mode");const c=Mt()[t.shadingModel.name].create();return c.fromJSON(t.shadingModel.params),new Ht(t.name,e,t.controlPointsWidth,t.controlPointsHeight,t.degree,o,n,s,c,t.closedU,t.closedV)}edit(){return this.collisionMesh.userData.collision=!1,this.editUpdate.bind(this)}editUpdate(){if(this.mode===1){const t=a.getSelectionManager().getSelectedEditHandleIndex();if(t===null)return;const e=this.getEditHandlePosition(t);if(e===null)return;this.updateControlPoint3(t,e)}}unedit(){this.hideEditHandles(),this.controlPoints.hideVisuals(),this.hideWeightEditRing(),this.collisionMesh.userData.collision=!0}showWeightEditRing(t){this.weightEditIndex=t,this.updateWeightEditRing(),this.weightEditRing.visible=!0,a.noScroll()}hideWeightEditRing(){this.weightEditIndex=-1,this.weightEditRing.visible=!1,a.scroll()}updateWeightEditRing(){if(this.weightEditIndex===-1)return;const t=this.getControlPoint(this.weightEditIndex);this.weightEditRing.position.set(t.x,t.y,t.z);const e=Re(t.w,1,10,8,20);this.weightEditRing.scale.set(e,e,e),this.weightEditRing.lookAt(a.getCamera().position)}updateColor(t){super.setColor(t),this.material.setColor(t)}getMaterial(){return this.material}dispose(){this.material.dispose()}addControlPoint(t,e){if(!this.hasEditHandle(t))return;const o=this.getEditHandlePosition(t);if(o===null)return;const n=Math.floor(t/this.controlPoints.getWidth()),s=t%this.controlPoints.getWidth(),r=o.clone().sub(e),c=new l.Vector3(0,r.y,r.z),h=new l.Vector3(r.x,r.y,0);n===0&&s===0?(this.addControlPointRowCol(n,-1,c),this.addControlPointRowCol(-1,s,h)):n===0&&s===this.controlPoints.getWidth()-1?(this.addControlPointRowCol(n,-1,c),this.addControlPointRowCol(-1,s,h)):n===this.controlPoints.getHeight()-1&&s===0?(this.addControlPointRowCol(-1,s,h),this.addControlPointRowCol(n,-1,c)):n===this.controlPoints.getHeight()-1&&s===this.controlPoints.getWidth()-1?(this.addControlPointRowCol(-1,s,h),this.addControlPointRowCol(n,-1,c)):this.addControlPointRowCol(n,s,r);for(let d=0;d<this.controlPoints.getWidth();d++)for(let u=0;u<this.controlPoints.getHeight();u++){const m=d+u*this.controlPoints.getWidth();this.setEditHandlePosition(m,this.controlPoints.getPoint(u,d))}this.material.updateControlPoints(),this.updateCollisionGeometry()}addControlPointRowCol(t,e,o){var n=0,s=0;t===0?(this.controlPoints.addRow(o,!0),n=this.controlPoints.getWidth(),s=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1)):t===this.controlPoints.getHeight()-1?(this.controlPoints.addRow(o,!1),n=this.controlPoints.getWidth(),s=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1)):e===0?(this.controlPoints.addColumn(o,!0),n=this.controlPoints.getHeight(),s=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight()):e===this.controlPoints.getWidth()-1&&(console.log("Adding column to the right"),this.controlPoints.addColumn(o,!1),n=this.controlPoints.getHeight(),s=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight());for(let r=0;r<n;r++)this.createEditHandle(s+r,this.radius)}removeControlPoint(t){if(this.controlPoints.getWidth()<=3||this.controlPoints.getHeight()<=3||!this.hasEditHandle(t))return;const e=Math.floor(t/this.controlPoints.getWidth()),o=t%this.controlPoints.getWidth();e===0||o===0||e===this.controlPoints.getHeight()-1||o===this.controlPoints.getWidth()-1?(this.removeControlPointRowCol(e,-1),this.removeControlPointRowCol(-1,o)):this.removeControlPointRowCol(e,o);for(let n=0;n<this.controlPoints.getWidth();n++)for(let s=0;s<this.controlPoints.getHeight();s++){const r=n+s*this.controlPoints.getWidth();this.setEditHandlePosition(r,this.controlPoints.getPoint(s,n))}this.getMaxDegree()<this.degree&&(this.degree=this.getMaxDegree()),this.material.updateControlPoints(),this.updateCollisionGeometry()}removeControlPointRowCol(t,e){var o=0,n=0;t===0?(o=this.controlPoints.getWidth(),n=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1),this.controlPoints.removeRow(!0)):t===this.controlPoints.getHeight()-1?(o=this.controlPoints.getWidth(),n=this.controlPoints.getWidth()*(this.controlPoints.getHeight()-1),this.controlPoints.removeRow(!1)):e===0?(o=this.controlPoints.getHeight(),n=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight(),this.controlPoints.removeColumn(!0)):e===this.controlPoints.getWidth()-1&&(o=this.controlPoints.getHeight(),n=(this.controlPoints.getWidth()-1)*this.controlPoints.getHeight(),this.controlPoints.removeColumn(!1));for(let s=0;s<o;s++)this.removeEditHandle(n+s)}updateControlPoint3(t,e){this.updateControlPoint(t,new l.Vector4(e.x,e.y,e.z,this.getControlPoint(t).w))}updateControlPoint(t,e){const o=Math.floor(t/this.controlPoints.getWidth()),n=t%this.controlPoints.getWidth();if(this.controlPoints.setPoint4(o,n,e),this.hasEditHandle(t)){const s=new l.Vector3(e.x,e.y,e.z);this.setEditHandlePosition(t,s)}this.updateCollisionGeometry(),this.weightEditIndex===t&&this.updateWeightEditRing()}getControlPoint(t){const e=Math.floor(t/this.controlPoints.getWidth()),o=t%this.controlPoints.getWidth();return this.controlPoints.getPoint4(e,o)}highlight(){this.material.setColor(X())}resetHighlight(){this.resetColor()}select(){this.resetColor()}resetSelect(){this.resetColor()}resetColor(){this.material.setColor(this.color)}setDegree(t){this.degree=t,this.material.setCustomUniform("degree",this.degree),this.updateCollisionGeometry()}getDegree(){return this.degree}getMaxDegree(){return Math.min(this.controlPoints.getWidth(),this.controlPoints.getHeight())-1}setClosedU(t){this.closedU=t,this.closedV=!1,this.material.setCustomUniform("closedU",this.closedU),this.material.setCustomUniform("closedV",this.closedV),this.updateCollisionGeometry()}setClosedV(t){this.closedV=t,this.closedU=!1,this.material.setCustomUniform("closedU",this.closedU),this.material.setCustomUniform("closedV",this.closedV),this.updateCollisionGeometry()}getClosedU(){return this.closedU}getClosedV(){return this.closedV}updateCollisionGeometry(){this.collisionGeometry.dispose();const t=this.controlPoints.getWidth()+1,e=this.controlPoints.getHeight()+1;this.collisionGeometry=$(ee(this.controlPoints,t,e,this.degree,this.closedU,this.closedV),t,e),this.collisionMesh.geometry=this.collisionGeometry}exportMesh(){const t=ee(this.controlPoints,100,100,this.degree,this.closedU,this.closedV),e=$(t,100,100),o=new l.MeshStandardMaterial({color:this.color,side:l.DoubleSide}),n=new l.Mesh(e,o);return n.position.copy(this.mesh.position),n.rotation.copy(this.mesh.rotation),n.scale.copy(this.mesh.scale),n}}class Qo{constructor(){}createBasicLinearCurve(){const t=[new w(-5,0,0),new w(0,5,-5),new w(5,0,0)],e=new xt("Linear Curve",t,new I("#7f8c8d"));return a.getObjectManager().addObject(e),e}createJSONLinearCurve(t){const e=xt.fromJSON(t);return a.getObjectManager().addObject(e),e}createBasicBezierCurve(){const t=[new w(-5,0,0),new w(0,5,-5),new w(5,0,0)],e=new pt("Bezier Curve",t,new I("#7f8c8d"));return a.getObjectManager().addObject(e),e}createJSONBezierCurve(t){const e=pt.fromJSON(t);return a.getObjectManager().addObject(e),e}createBasicBezierSpline(){const t=[new w(-5,0,0),new w(-2,5,-5),new w(2,5,-5),new w(5,0,0)],e=new Ot("Bezier Spline",t,new I("#7f8c8d"));return a.getObjectManager().addObject(e),e}createJSONBezierSpline(t){const e=Ot.fromJSON(t);return a.getObjectManager().addObject(e),e}createBasicUniformBSpline(){const t=[new w(-5,0,0),new w(0,5,-5),new w(5,0,0)],e=new Et("Uniform B-Spline",t,2,new I("#7f8c8d"));return a.getObjectManager().addObject(e),e}createJSONUniformBSpline(t){const e=Et.fromJSON(t);return a.getObjectManager().addObject(e),e}createBasicURBS(){const t=[new R(-5,0,0,1),new R(0,5,-5,1),new R(5,0,0,1)],e=new St("Uniform Rational B-Spline",t,2,new I("#7f8c8d"));return a.getObjectManager().addObject(e),e}createJSONURBS(t){const e=St.fromJSON(t);return a.getObjectManager().addObject(e),e}createBasicBezierPatch(){const t=[new w(-5,0,-5),new w(0,0,-5),new w(5,0,-5),new w(-5,0,0),new w(0,5,0),new w(5,0,0),new w(-5,0,5),new w(0,0,5),new w(5,0,5)],e=new at("Bezier Patch",t,3,3,new I("#7f8c8d"));return a.getObjectManager().addObject(e),e}createJSONBezierPatch(t){const e=at.fromJSON(t);return a.getObjectManager().addObject(e),e}createBasicUniformBSplineSurface(){const t=[new w(-5,0,-5),new w(0,0,-5),new w(5,0,-5),new w(-5,0,0),new w(0,5,0),new w(5,0,0),new w(-5,0,5),new w(0,0,5),new w(5,0,5)],e=new jt("Uniform B-Spline Surface",t,3,3,2,new I("#7f8c8d"));return a.getObjectManager().addObject(e),e}createJSONUniformBSplineSurface(t){const e=jt.fromJSON(t);return a.getObjectManager().addObject(e),e}createBasicUniformRationalBSplineSurface(){const t=[new R(-5,0,-5,1),new R(0,0,-5,1),new R(5,0,-5,1),new R(-5,0,0,1),new R(0,5,0,1),new R(5,0,0,1),new R(-5,0,5,1),new R(0,0,5,1),new R(5,0,5,1)],e=new Ht("Uniform Rational B-Spline Surface",t,3,3,2,new I("#7f8c8d"));return a.getObjectManager().addObject(e),e}createJSONUniformRationalBSplineSurface(t){const e=Ht.fromJSON(t);return a.getObjectManager().addObject(e),e}}class tn{raycaster;mouse;mouseDown;hoveredObject;hoveredEditHandle;selectedObject;selectedEditHandle;active;canEdit;constructor(){this.raycaster=new l.Raycaster,this.mouse=new l.Vector2,this.mouseDown=new l.Vector2,this.hoveredObject=null,this.hoveredEditHandle=null,this.selectedObject=null,this.selectedEditHandle=null,this.active=!1,this.canEdit=!0;const t=a.getRenderer().domElement;t.addEventListener("mousemove",e=>this.onMouseMove(e)),t.addEventListener("mousedown",e=>this.onMouseDown(e)),t.addEventListener("mouseup",e=>this.onMouseUp(e)),t.addEventListener("mouseenter",()=>this.active=!0),t.addEventListener("mouseleave",()=>this.active=!1),y.subscribe("objectRemoved",P.ALL,e=>{this.selectedObject&&this.selectedObject===e&&this.resetSelected(),this.hoveredObject&&this.hoveredObject===e&&this.resetHovered()})}isActive(){return this.active}getMouse(){return this.mouse}getSelectedObject(){return this.selectedObject}getSelectedEditHandleIndex(){return this.selectedEditHandle?this.selectedEditHandle.getIndex():null}onMouseMove(t){const e=a.getRenderer().domElement;this.mouse.x=t.clientX/e.clientWidth*2-1,this.mouse.y=-(t.clientY/e.clientHeight)*2+1;const o=a.getTooltip();o.style.left=t.clientX+10+"px",o.style.top=t.clientY+10+"px"}onMouseDown(t){this.mouseDown.x=t.clientX,this.mouseDown.y=t.clientY}onMouseUp(t){var e=!1;if(!(Math.abs(this.mouseDown.x-t.clientX)>=5||Math.abs(this.mouseDown.y-t.clientY)>=5)){if(this.hoveredEditHandle){this.selectEditHandle(this.hoveredEditHandle);return}else this.selectedEditHandle&&(this.resetSelectedEditHandle(),e=!0);this.hoveredObject?this.select(this.hoveredObject):e||this.resetSelected()}}update(){if(!this.active)return;this.raycaster.setFromCamera(this.mouse,a.getCamera());const t=this.raycaster.intersectObjects(a.getScene().children,!0),e=a.getObjectManager();if(t.length>0){const o=this.findMesh(t);if(o==null){this.resetHovered(),this.resetHoveredEditHandle();return}if(e.isEditHandle(o)){if(!this.canEdit)return;const s=e.getEditHandleByMesh(o);if(s==null){this.resetHoveredEditHandle();return}else if(this.selectedEditHandle&&this.selectedEditHandle===s)return;this.hoverEditHandle(s);return}else this.resetHoveredEditHandle();const n=e.getVisualObjectByMesh(o);if(n==null){this.resetHovered();return}else if(e.selectable(o)&&!a.isDragging()){if(this.selectedObject&&this.selectedObject===n)return;this.resetHovered(),this.hover(n)}else this.resetHovered()}else this.resetHovered(),this.resetHoveredEditHandle()}enableEditing(){this.canEdit=!0}disableEditing(){this.canEdit=!1,this.resetSelectedEditHandle()}hover(t){a.getHierarchy().viewportHover(t.getUUID()),this.doHover(t),this.showTooltip(t)}hoverEditHandle(t){this.doHoverEditHandle(t),this.showTooltip(t)}doHover(t){this.hoveredObject&&this.hoveredObject!==t&&this.hoveredObject.resetHighlight(),this.hoveredObject=t,this.hoveredObject.highlight()}doHoverEditHandle(t){this.hoveredEditHandle&&this.hoveredEditHandle!==t&&this.hoveredEditHandle.resetHighlight(),this.hoveredEditHandle=t,this.hoveredEditHandle.highlight()}resetHovered(){a.getHierarchy().viewportDehover(),this.doResetHovered(),this.hideTooltip()}resetHoveredEditHandle(){this.doResetHoveredEditHandle(),this.hideTooltip()}doResetHovered(){this.hoveredObject&&(this.hoveredObject.resetHighlight(),this.hoveredObject=null)}doResetHoveredEditHandle(){this.hoveredEditHandle&&(this.hoveredEditHandle.resetHighlight(),this.hoveredEditHandle=null)}select(t){a.getHierarchy().viewportSelect(t.getUUID()),this.doSelect(t)}selectEditHandle(t){this.doSelectEditHandle(t)}doSelect(t){this.selectedObject&&this.selectedObject!==t&&this.doResetSelected(),this.hoveredObject=null,this.selectedObject=t,this.selectedObject.select(),y.notify("objectSelected",P.VIEWPORT,this.selectedObject)}doSelectEditHandle(t){this.selectedEditHandle&&this.selectedEditHandle!==t&&this.doResetSelectedEditHandle(),this.hoveredEditHandle=null,this.selectedEditHandle=t,this.selectedEditHandle.select(),a.getTransformControls().attach(t.getMesh()),y.notify("editHandleSelected",P.VIEWPORT,this.selectedEditHandle)}resetSelected(){a.getHierarchy().viewportDeselect(),this.doResetSelected()}resetSelectedEditHandle(){this.doResetSelectedEditHandle()}doResetSelected(){this.selectedObject&&(this.selectedObject.resetSelect(),this.selectedObject=null,a.getTransformControls().detach(),y.notify("objectUnselected",P.ALL))}doResetSelectedEditHandle(){this.selectedEditHandle&&(this.selectedEditHandle.resetSelect(),this.selectedEditHandle=null,a.getTransformControls().detach(),y.notify("editHandleUnselected",P.ALL))}showTooltip(t){t instanceof G?(a.getTooltip().innerHTML="<b>"+t.getName()+"</b></br><i>Type:</i> "+t.getType(),a.getTooltip().style.display="block"):t instanceof Be&&(a.getTooltip().innerHTML="<b>Control Point - "+(t.getIndex()+1)+"</b></br><i>Object:</i> "+t.getParentObject().getName(),a.getTooltip().style.display="block")}hideTooltip(){a.getTooltip().style.display="none"}findMesh(t){for(const e of t)if(e.object instanceof l.Mesh&&(a.getObjectManager().selectable(e.object)||a.getObjectManager().isEditHandle(e.object)))return e.object;return null}}class en{updateCallback;selectedObject;constructor(){this.updateCallback=null,this.selectedObject=null,y.subscribe("objectSelected",P.ALL,t=>this.selectObject(t)),y.subscribe("objectUnselected",P.ALL,()=>this.unselectObject()),y.subscribe("objectChanged",P.ALL,()=>this.update()),y.subscribe("transformMoved",P.VIEWPORT,()=>this.update())}update(){this.updateCallback&&this.updateCallback()}selectObject(t){if(!t){console.error("editManager:selectObject: Object is null!");return}this.selectedObject=t,this.updateCallback=this.selectedObject.edit()}unselectObject(){if(!this.selectedObject){console.error("editManager:unselectObject: Object is null!");return}this.updateCallback=null,this.selectedObject.unedit(),this.selectedObject=null}}class on{controls=[];details;constructor(t){const e=document.createElement("div");e.className="controls",this.details=document.createElement("sl-details"),this.details.open=!a.getIOManager().getFlagCache("controlsClosed"),this.details.style.minWidth="120px",this.details.summary="Controls",e.appendChild(this.details),t.appendChild(e),this.initControls(),this.redraw(),y.subscribe("dimensionSwitched",P.ALL,o=>this.redraw()),this.details.addEventListener("sl-after-show",()=>a.getIOManager().setFlagCache("controlsClosed",!1)),this.details.addEventListener("sl-after-hide",()=>a.getIOManager().setFlagCache("controlsClosed",!0))}add(t){this.controls.includes(t)||(this.controls.push(t),this.redraw())}remove(t){const e=this.controls.indexOf(t);e!==-1&&(this.controls.splice(e,1),this.redraw())}redraw(){this.details.innerHTML="",this.controls.forEach(t=>{const e=document.createElement("div");e.innerHTML=t.getHTML(),this.details.appendChild(e)})}initControls(){const t=new j;t.add(new $e("Viewport Controls",!1)),t.add(new oe(a.dimension2D.bind(a),"Press <b>D</b> to switch to <b>2D</b>.","Press <b>D</b> to switch to <b>3D</b>.")),t.add(new oe(a.dimension2D.bind(a),"Hold the <b>LMB</b> to <b>orbit</b> around the scene.","Hold the <b>LMB / RMB</b> to pan the camera.")),t.add(new oe(a.dimension2D.bind(a),"Hold the <b>RMB</b> (or shift + LMB) to <b>pan</b> the camera.","")),t.add(new O("<b>Scroll</b> the mouse wheel to <b>zoom</b> in and out.")),t.add(new O("<b>Click</b> on an object to <b>select</b> it.")),this.add(t)}}class Lt{}class $e extends Lt{constructor(t,e=!0){super(),this.text=t,this.breakLine=e}getHTML(){return(this.breakLine?"<br>":"")+`<strong>${this.text}</strong>`}}class O extends Lt{constructor(t){super(),this.text=t}getHTML(){return`<span>${this.text}</span>`}}class oe extends Lt{constructor(t,e,o){super(),this.bool=t,this.textFalse=e,this.textTrue=o}getHTML(){return this.bool()?`<span>${this.textTrue}</span>`:`<span>${this.textFalse}</span>`}}class T extends Lt{constructor(t,e){super(),this.key=t,this.value=e}getHTML(){return`<span><strong>${this.key}</strong>: <span>${this.value}</span></span>`}}class j extends Lt{controls=[];constructor(){super()}add(t){this.controls.push(t)}getHTML(){let t="<div>";return this.controls.forEach(e=>{t+=`<div>${e.getHTML()}</div>`}),t+="</div>",t}}class Y{constructor(t,e,o){this.name=t,this.lace=e,this.modes=o,this.currentObject=null,this.currentMode=-1,this.controls=new j,this.controls.add(new $e(t)),this.controls.add(new T("Q","Switch between modes.")),a.getControls().add(this.controls),a.getInteractionsManager().addKeydown("q",()=>{if(this.currentObject===null||this.currentMode===-1)return;const n=(this.currentMode+1)%this.modes.length;this.showTab(n),this.currentObject.setMode(n)}),this.tab=e.addTab({vertical:!0,onTabChange:()=>y.notify("inspectorTabChanged",P.INSPECTOR)}),o.forEach((n,s)=>{n.disableEditing&&n.objectMode&&console.error("Object mode cannot disable editing.");const r=this.tab.addTab(`Tab-${s}`,n.getIcon(),"lucide");n.build(r),r.registerOnSelected(()=>{this.modeSelected(s),this.resetControls(),a.getControls().add(n.getControls())}),r.registerOnDeSelected(()=>{this.modeDeselected(s),this.resetControls()})}),this.tab.onChange(()=>this.inspectorChanged()),this.hideInspector()}currentObject;currentMode;tab;controls;select(t){this.lace.hideAll(),this.currentObject=t,this.modes.forEach(o=>o.select(t)),this.objectChanged();const e=t.getMode();this.currentMode=e,this.modes[e].setActive(!0),this.showInspector(),this.showTab(e)}deselect(){this.hideInspector(),this.modes.forEach(t=>t.deselect()),this.modes[this.currentMode].setActive(!1),this.currentObject=null}objectChanged(){this.currentObject===null||this.currentMode===-1||(this.modes[this.currentMode].objectChanged(this.currentObject),this.updateTab())}inspectorChanged(){this.currentObject===null||this.currentMode===-1||(this.modes[this.currentMode].inspectorChanged(this.currentObject),y.notify("objectChanged",P.INSPECTOR))}modeSelected(t){this.currentObject===null||t>=this.modes.length||(this.modes[t].objectMode&&this.enableObjectMode(this.currentObject),this.modes[t].disableEditing?a.getSelectionManager().disableEditing():a.getSelectionManager().enableEditing(),this.currentObject.setMode(t),this.currentMode=t,this.modes[t].setActive(!0),this.objectChanged())}modeDeselected(t){t>=this.modes.length||(this.modes[t].objectMode&&this.disableObjectMode(),a.getSelectionManager().enableEditing(),this.modes[t].setActive(!1))}showTab(t){this.tab.show(`Tab-${t}`)}showInspector(){this.lace.show(this.tab),a.getControls().add(this.controls)}hideInspector(){this.lace.hide(this.tab),this.resetControls(),a.getControls().remove(this.controls)}updateTab(){this.tab.update()}resetControls(){this.modes.forEach(t=>a.getControls().remove(t.getControls()))}enableObjectMode(t){a.getTransformControls().attach(t.getMesh()),a.getSelectionManager().disableEditing()}disableObjectMode(){a.getTransformControls().detach(),a.getSelectionManager().enableEditing()}}class H{constructor(t,e,o,n=!1){this.icon=t,this.objectMode=e,this.controls=o,this.disableEditing=n}active=!1;getIcon(){return this.icon}getControls(){return this.controls}setActive(t){this.active=t}}class Vt extends Mo{container;elements;changeCallback;addCallback;removeCallback;divElements=[];editorElements=[];constructor(t,e,o,n,s,r={}){const{scrollFix:c=!1}=r,h=document.createElement("div");h.style.display="flex",h.style.flexDirection="column",h.style.width="100%",h.style.alignItems="center",h.style.justifyContent="space-between",c&&(h.style.maxHeight="calc(50vh - 2rem)"),super(t,h),this.container=h,this.label=t,this.elements=e,this.changeCallback=o,this.addCallback=n,this.removeCallback=s,this.drawList()}drawList(){this.container.innerHTML="";const t=document.createElement("span");t.innerHTML=this.label,t.style.width="100%",t.style.textAlign="left",t.style.marginBottom="0.5em",t.style.fontSize="var(--sl-input-label-font-size-small)",this.container.appendChild(t),this.elements.forEach((s,r)=>{this.drawElement(r)});const e=document.createElement("sl-button-group");e.style.width="100%";const o=document.createElement("sl-button");o.innerText="Add",o.size="small",o.variant="success",o.outline=!0,o.style.width="50%",o.onclick=()=>this.addCallback();const n=document.createElement("sl-button");n.innerText="Remove",n.size="small",n.variant="danger",n.outline=!0,n.style.width="50%",n.onclick=()=>this.removeCallback(),e.appendChild(o),e.appendChild(n),this.container.appendChild(document.createElement("br")),this.container.appendChild(e),this.container.appendChild(document.createElement("br"))}changedIndex(t){this.changeCallback(t),this.changed()}updateIndex(t){this.editorElements[t].forEach(e=>e.update())}getObj(){return null}getKeys(){return[]}update(){this.drawNewElements(),this.removeOldElements(),this.editorElements.forEach((t,e)=>{t.forEach(o=>o.update())})}setSize(t){}drawNewElements(){const t=this.elements.length-this.divElements.length;for(let e=0;e<t;e++)this.drawElement(this.elements.length-t+e)}removeOldElements(){const t=this.divElements.length-this.elements.length;for(let e=0;e<t;e++)this.divElements.pop().remove()}drawElement(t){const e=document.createElement("div");e.classList.add("list-item"),e.style.width="100%",e.style.display="flex",e.style.flexDirection="row",e.style.justifyContent="space-between",e.style.alignItems="center",e.style.padding="0.5em";const o=document.createElement("span");o.innerHTML="<i>"+(t+1).toString()+"</i>: ",o.style.width="20%",o.style.textAlign="center",o.style.marginRight="1em",e.appendChild(o);const n=document.createElement("div");n.style.display="flex",n.style.flexDirection="column",n.style.minWidth="0",n.style.flexGrow="1",this.editorElements[t]=[];var s=0;this.elements[t].getEditor().forEach(c=>{if(this.editorElements[t].push(c),c.registerUpdateCallback(()=>this.changedIndex(t)),c.setSize("small"),s>0){const h=document.createElement("br");n.appendChild(h)}n.appendChild(c.element),s++}),e.appendChild(n),this.divElements.push(e),this.container.appendChild(e)}}class Tt{}class nn extends Y{constructor(t){const e=[new sn,new rn,new ln,new cn];super("Bezier Curve",t,e)}}let sn=class extends H{params;constructor(){const t=new j;t.add(new O("<b>Move</b> the object with the transform control.")),super("box",!0,t),this.params={name:"",position:new w,color:"#000000"}}build(t){t.add(new st("",this.params,"name")),t.add(new D("Position",this.params.position,"x","y","z")),t.add(new z("Color",this.params,"color"))}select(t){}deselect(){}objectChanged(t){this.params.name=t.getName(),this.params.position.set(t.getPosition().x,t.getPosition().y,t.getPosition().z),this.params.color=t.getColor().getHexString()}inspectorChanged(t){!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.setName(this.params.name),t.setPosition(this.params.position),t.updateColor(new I(this.params.color))}},rn=class extends H{controlPoints;currentObject;laceList;atFront=!1;constructor(){const t=new j;t.add(new O("<b>Click</b> on a control point to <b>select</b> it.")),t.add(new O("<b>Move</b> the selected control point with the transform controls.")),t.add(new T("E/Insert","Insert a new control point at the last selected endpoint.")),t.add(new T("R/Delete","Remove the last control point.")),super("waypoints",!1,t),this.controlPoints=[],this.currentObject=null,this.laceList=new Vt("Control Points",this.controlPoints,this.listChanged.bind(this),this.listAdd.bind(this),this.listRemove.bind(this),{scrollFix:!0}),y.subscribe("editHandleSelected",P.ALL,e=>{this.currentObject&&(e.getIndex()===0?this.atFront=!0:e.getIndex()===this.controlPoints.length-1&&(this.atFront=!1))}),a.getInteractionsManager().addKeydowns(["e","insert"],(()=>{if(!this.active||this.currentObject===null)return;const e=new _;e.setFromCamera(a.getSelectionManager().getMouse(),a.getCamera());const o=new w;a.getCamera().getWorldDirection(o);const n=this.atFront?this.controlPoints[0].getPosition():this.controlPoints[this.controlPoints.length-1].getPosition(),s=new it().setFromNormalAndCoplanarPoint(o,n),r=new w;e.ray.intersectPlane(s,r),r.x=Math.round(r.x*100)/100,r.y=Math.round(r.y*100)/100,r.z=Math.round(r.z*100)/100,this.addControlPoint(r.sub(this.currentObject.getPosition()),this.atFront)}).bind(this)),a.getInteractionsManager().addKeydowns(["r","delete"],(()=>{this.active&&this.currentObject!==null&&this.removeControlPoint(this.atFront)}).bind(this))}build(t){t.add(this.laceList)}select(t){this.atFront=!1,this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){const e=t.getControlPoints();this.controlPoints.length=0,e.forEach((o,n)=>{this.controlPoints.push(new an(o))}),this.laceList.update()}inspectorChanged(t){}listChanged(t){this.currentObject!==null&&this.currentObject.updateControlPoint(t,this.controlPoints[t].getPosition())}listAdd(){if(this.currentObject===null)return;const t=this.controlPoints[this.controlPoints.length-2].getPosition(),e=this.controlPoints[this.controlPoints.length-1].getPosition(),o=It(e,t);this.addControlPoint(o)}addControlPoint(t,e=!1){this.currentObject!==null&&(a.getTransformControls().detach(),a.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.addControlPoint(t,e),this.objectChanged(this.currentObject))}listRemove(){this.currentObject!==null&&(this.removeControlPoint(),this.objectChanged(this.currentObject))}removeControlPoint(t=!1){this.currentObject!==null&&(a.getTransformControls().detach(),a.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.removeControlPoint(t),this.objectChanged(this.currentObject))}};class an extends Tt{position;constructor(t){super(),this.position=t}setPosition(t){this.position.set(t.x,t.y,t.z)}getPosition(){const t=new w;return t.set(this.position.x,this.position.y,this.position.z),t}getEditor(){return[new D("Position",this.position,"x","y","z")]}}class ln extends H{params;currentObject;slider;constructor(){const t=new j;t.add(new O("<b>Hover</b> over the curve to adjust the t-value.")),super("spline",!1,t,!0),this.params={t:0},this.currentObject=null,this.slider=new V("T",this.params,"t",{min:0,max:1,step:.01}),window.addEventListener("mousemove",(e=>{if(!this.active||a.isOrbiting()||this.currentObject===null)return;const o=new _;o.setFromCamera(a.getSelectionManager().getMouse(),a.getCamera());const n=o.intersectObject(this.currentObject.getCollisionMesh(),!1);if(n.length>0){const s=n[0].point.sub(this.currentObject.getPosition());this.currentObject.updateDeCasteljauFromNearestPoint(s),this.params.t=this.currentObject.getDeCasteljauT(),this.slider.update()}}).bind(this))}build(t){t.add(new B("De-Casteljau Visualization")),t.add(this.slider)}select(t){this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){this.params.t=t.getDeCasteljauT()}inspectorChanged(t){t.updateDeCasteljauT(this.params.t)}}class cn extends H{constructor(){const t=new j;super("info",!1,t,!0)}build(t){t.add(new B("A <b>Bezier Curve</b> \\( b(t) \\) is a parametric curve widely used in computer graphics, animation, and design for modeling smooth and scalable shapes.<br />It is defined by a <b>set of control points</b> \\( b_i \\), which determine the curve's shape.The curve starts at the first control point and ends at the last one, with intermediate control points influencing its curvature.<br/>\\[ b(t) = \\sum_{i=0}^{n} \\binom{n}{i} \\, t^{i} \\, (1-t)^{n-i} \\, b_i \\]Where \\( n \\) is the degree of the curve, \\( b_i \\) are the control points, and \\( t \\) varies from 0 to 1.",{block:!0}))}select(t){}deselect(){}objectChanged(t){}inspectorChanged(t){}}class hn extends Y{constructor(t){const e=[new dn,new un];super("Linear Curve",t,e)}}let dn=class extends H{params;constructor(){const t=new j;t.add(new O("<b>Move</b> the object with the transform control.")),super("box",!0,t),this.params={name:"",position:new w,color:"#000000"}}build(t){t.add(new st("",this.params,"name")),t.add(new D("Position",this.params.position,"x","y","z")),t.add(new z("Color",this.params,"color"))}select(t){}deselect(){}objectChanged(t){this.params.name=t.getName(),this.params.position.set(t.getPosition().x,t.getPosition().y,t.getPosition().z),this.params.color=t.getColor().getHexString()}inspectorChanged(t){!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.setName(this.params.name),t.setPosition(this.params.position),t.updateColor(new I(this.params.color))}},un=class extends H{controlPoints;currentObject;laceList;atFront=!1;constructor(){const t=new j;t.add(new O("<b>Click</b> on a control point to <b>select</b> it.")),t.add(new O("<b>Move</b> the selected control point with the transform controls.")),t.add(new T("E/Insert","Insert a new control point at the last selected endpoint.")),t.add(new T("R/Delete","Remove the last control point.")),super("waypoints",!1,t),this.controlPoints=[],this.currentObject=null,this.laceList=new Vt("Control Points",this.controlPoints,this.listChanged.bind(this),this.listAdd.bind(this),this.listRemove.bind(this),{scrollFix:!0}),y.subscribe("editHandleSelected",P.ALL,e=>{this.currentObject&&(e.getIndex()===0?this.atFront=!0:e.getIndex()===this.controlPoints.length-1&&(this.atFront=!1))}),a.getInteractionsManager().addKeydowns(["e","insert"],(()=>{if(!this.active||this.currentObject===null)return;const e=new _;e.setFromCamera(a.getSelectionManager().getMouse(),a.getCamera());const o=new w;a.getCamera().getWorldDirection(o);const n=this.atFront?this.controlPoints[0].getPosition():this.controlPoints[this.controlPoints.length-1].getPosition(),s=new it().setFromNormalAndCoplanarPoint(o,n),r=new w;e.ray.intersectPlane(s,r),r.x=Math.round(r.x*100)/100,r.y=Math.round(r.y*100)/100,r.z=Math.round(r.z*100)/100,this.addControlPoint(r.sub(this.currentObject.getPosition()),this.atFront)}).bind(this)),a.getInteractionsManager().addKeydowns(["r","delete"],(()=>{this.active&&this.currentObject!==null&&this.removeControlPoint(this.atFront)}).bind(this))}build(t){t.add(this.laceList)}select(t){this.atFront=!1,this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){const e=t.getControlPoints();this.controlPoints.length=0,e.forEach((o,n)=>{this.controlPoints.push(new mn(o))}),this.laceList.update()}inspectorChanged(t){}listChanged(t){this.currentObject!==null&&this.currentObject.updateControlPoint(t,this.controlPoints[t].getPosition())}listAdd(){if(this.currentObject===null)return;const t=this.controlPoints[this.controlPoints.length-2].getPosition(),e=this.controlPoints[this.controlPoints.length-1].getPosition(),o=It(e,t);this.addControlPoint(o)}addControlPoint(t,e=!1){this.currentObject!==null&&(a.getTransformControls().detach(),a.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.addControlPoint(t,e),this.objectChanged(this.currentObject))}listRemove(){this.currentObject!==null&&(this.removeControlPoint(),this.objectChanged(this.currentObject))}removeControlPoint(t=!1){this.currentObject!==null&&(a.getTransformControls().detach(),a.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.removeControlPoint(t),this.objectChanged(this.currentObject))}};class mn extends Tt{position;constructor(t){super(),this.position=t}setPosition(t){this.position.set(t.x,t.y,t.z)}getPosition(){const t=new w;return t.set(this.position.x,this.position.y,this.position.z),t}getEditor(){return[new D("Position",this.position,"x","y","z")]}}class gn extends Y{constructor(t){const e=[new pn,new fn];super("Uniform B-Spline",t,e)}}let pn=class extends H{params;degreeSlider;constructor(){const t=new j;t.add(new O("<b>Move</b> the object with the transform control.")),super("box",!0,t),this.params={name:"",position:new w,degree:2,color:"#000000",closed:!1},this.degreeSlider=new V("Degree",this.params,"degree",{min:2,max:10,step:1})}build(t){t.add(new st("",this.params,"name")),t.add(new D("Position",this.params.position,"x","y","z")),t.add(new z("Color",this.params,"color")),t.add(this.degreeSlider),t.add(new Jt("Closed",this.params,"closed"))}select(t){}deselect(){}objectChanged(t){this.params.name=t.getName(),this.params.position.set(t.getPosition().x,t.getPosition().y,t.getPosition().z),this.params.color=t.getColor().getHexString(),this.params.degree=t.getDegree(),this.degreeSlider.setMax(t.getControlPoints().length-1),this.params.closed=t.isClosed()}inspectorChanged(t){!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.setName(this.params.name),t.setPosition(this.params.position),t.updateColor(new I(this.params.color)),t.setDegree(this.params.degree),t.setClosed(this.params.closed)}},fn=class extends H{controlPoints;currentObject;laceList;atFront=!1;constructor(){const t=new j;t.add(new O("<b>Click</b> on a control point to <b>select</b> it.")),t.add(new O("<b>Move</b> the selected control point with the transform controls.")),t.add(new T("E/Insert","Insert a new control point at the last selected endpoint.")),t.add(new T("R/Delete","Remove the last control point.")),super("waypoints",!1,t),this.controlPoints=[],this.currentObject=null,this.laceList=new Vt("Control Points",this.controlPoints,this.listChanged.bind(this),this.listAdd.bind(this),this.listRemove.bind(this),{scrollFix:!0}),y.subscribe("editHandleSelected",P.ALL,e=>{this.currentObject&&(e.getIndex()===0?this.atFront=!0:e.getIndex()===this.controlPoints.length-1&&(this.atFront=!1))}),a.getInteractionsManager().addKeydowns(["e","insert"],(()=>{if(!this.active||this.currentObject===null)return;const e=new _;e.setFromCamera(a.getSelectionManager().getMouse(),a.getCamera());const o=new w;a.getCamera().getWorldDirection(o);const n=this.atFront?this.controlPoints[0].getPosition():this.controlPoints[this.controlPoints.length-1].getPosition(),s=new it().setFromNormalAndCoplanarPoint(o,n),r=new w;e.ray.intersectPlane(s,r),r.x=Math.round(r.x*100)/100,r.y=Math.round(r.y*100)/100,r.z=Math.round(r.z*100)/100,this.addControlPoint(r.sub(this.currentObject.getPosition()),this.atFront)}).bind(this)),a.getInteractionsManager().addKeydowns(["r","delete"],(()=>{this.active&&this.currentObject!==null&&this.removeControlPoint(this.atFront)}).bind(this))}build(t){t.add(this.laceList)}select(t){this.atFront=!1,this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){const e=t.getControlPoints();this.controlPoints.length=0,e.forEach((o,n)=>{this.controlPoints.push(new bn(o))}),this.laceList.update()}inspectorChanged(t){}listChanged(t){this.currentObject!==null&&this.currentObject.updateControlPoint(t,this.controlPoints[t].getPosition())}listAdd(){if(this.currentObject===null)return;const t=this.controlPoints[this.controlPoints.length-2].getPosition(),e=this.controlPoints[this.controlPoints.length-1].getPosition(),o=It(e,t);this.addControlPoint(o)}addControlPoint(t,e=!1){this.currentObject!==null&&(a.getTransformControls().detach(),a.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.addControlPoint(t,e),this.objectChanged(this.currentObject))}listRemove(){this.currentObject!==null&&(this.removeControlPoint(),this.objectChanged(this.currentObject))}removeControlPoint(t=!1){this.currentObject!==null&&(a.getTransformControls().detach(),a.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.removeControlPoint(t),this.objectChanged(this.currentObject))}};class bn extends Tt{position;constructor(t){super(),this.position=t}setPosition(t){this.position.set(t.x,t.y,t.z)}getPosition(){const t=new w;return t.set(this.position.x,this.position.y,this.position.z),t}getEditor(){return[new D("Position",this.position,"x","y","z")]}}class wn extends Y{constructor(t){const e=[new vn,new Cn];super("Uniform Rational B-Spline",t,e)}}let vn=class extends H{params;degreeSlider;constructor(){const t=new j;t.add(new O("<b>Move</b> the object with the transform control.")),super("box",!0,t),this.params={name:"",position:new w,degree:2,color:"#000000",closed:!1},this.degreeSlider=new V("Degree",this.params,"degree",{min:2,max:10,step:1})}build(t){t.add(new st("",this.params,"name")),t.add(new D("Position",this.params.position,"x","y","z")),t.add(new z("Color",this.params,"color")),t.add(this.degreeSlider),t.add(new Jt("Closed",this.params,"closed"))}select(t){}deselect(){}objectChanged(t){this.params.name=t.getName(),this.params.position.set(t.getPosition().x,t.getPosition().y,t.getPosition().z),this.params.color=t.getColor().getHexString(),this.params.degree=t.getDegree(),this.degreeSlider.setMax(t.getControlPoints().length-1),this.params.closed=t.isClosed()}inspectorChanged(t){!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.setName(this.params.name),t.setPosition(this.params.position),t.updateColor(new I(this.params.color)),t.setDegree(this.params.degree),t.setClosed(this.params.closed)}},Cn=class extends H{controlPoints;currentObject;laceList;atFront=!1;constructor(){const t=new j;t.add(new O("<b>Click</b> on a control point to <b>select</b> it.")),t.add(new O("<b>Move</b> the selected control point with the transform controls.")),t.add(new T("E/Insert","Insert a new control point at the last selected endpoint.")),t.add(new T("R/Delete","Remove the last control point.")),t.add(new O("When a control point is selected, <b>scroll</b> to change its weight.")),super("waypoints",!1,t),this.controlPoints=[],this.currentObject=null,this.laceList=new Vt("Control Points",this.controlPoints,this.listChanged.bind(this),this.listAdd.bind(this),this.listRemove.bind(this),{scrollFix:!0}),y.subscribe("editHandleSelected",P.ALL,e=>{this.currentObject&&(e.getIndex()===0?this.atFront=!0:e.getIndex()===this.controlPoints.length-1&&(this.atFront=!1),this.currentObject.showWeightEditRing(e.getIndex()))}),y.subscribe("editHandleUnselected",P.ALL,()=>{this.currentObject&&this.currentObject.hideWeightEditRing()}),a.getInteractionsManager().addKeydowns(["e","insert"],(()=>{if(!this.active||this.currentObject===null)return;const e=new _;e.setFromCamera(a.getSelectionManager().getMouse(),a.getCamera());const o=new w;a.getCamera().getWorldDirection(o);const n=this.atFront?this.controlPoints[0].getPosition():this.controlPoints[this.controlPoints.length-1].getPosition(),s=new it().setFromNormalAndCoplanarPoint(o,n),r=new w;e.ray.intersectPlane(s,r),r.x=Math.round(r.x*100)/100,r.y=Math.round(r.y*100)/100,r.z=Math.round(r.z*100)/100,this.addControlPoint(r.sub(this.currentObject.getPosition()),this.atFront)}).bind(this)),a.getInteractionsManager().addKeydowns(["r","delete"],(()=>{this.active&&this.currentObject!==null&&this.removeControlPoint(this.atFront)}).bind(this))}build(t){t.add(this.laceList)}select(t){this.atFront=!1,this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){const e=t.getControlPoints();this.controlPoints.length=0,e.forEach((o,n)=>{this.controlPoints.push(new Pn(o))}),this.laceList.update()}inspectorChanged(t){}listChanged(t){if(this.currentObject===null)return;const e=this.controlPoints[t].getPosition(),o=new R(e.x,e.y,e.z,this.controlPoints[t].getWeight());this.currentObject.updateControlPoint(t,o)}listAdd(){if(this.currentObject===null)return;const t=this.controlPoints[this.controlPoints.length-2].getPosition(),e=this.controlPoints[this.controlPoints.length-1].getPosition(),o=It(e,t);this.addControlPoint(o)}addControlPoint(t,e=!1){if(this.currentObject===null)return;a.getTransformControls().detach(),a.getSelectionManager().doResetSelectedEditHandle();const o=new R(t.x,t.y,t.z,1);this.currentObject.addControlPoint(o,e),this.objectChanged(this.currentObject)}listRemove(){this.currentObject!==null&&(this.removeControlPoint(),this.objectChanged(this.currentObject))}removeControlPoint(t=!1){this.currentObject!==null&&(a.getTransformControls().detach(),a.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.removeControlPoint(t),this.objectChanged(this.currentObject))}};class Pn extends Tt{position;constructor(t){super(),this.position=t}setPosition(t){this.position.set(t.x,t.y,t.z,this.position.w)}getPosition(){const t=new w;return t.set(this.position.x,this.position.y,this.position.z),t}setWeight(t){this.position.set(this.position.x,this.position.y,this.position.z,t)}getWeight(){return this.position.w}getEditor(){const t=new D("Position",this.position,"x","y","z"),e=new V("Weight",this.position,"w",{min:1,max:10,step:.5});return[t,e]}}class yn extends Y{constructor(t){const e=[new Mn,new xn];super("Bezier Spline",t,e)}}let Mn=class extends H{params;constructor(){const t=new j;t.add(new O("<b>Move</b> the object with the transform control.")),super("box",!0,t),this.params={name:"",position:new w,color:"#000000"}}build(t){t.add(new st("",this.params,"name")),t.add(new D("Position",this.params.position,"x","y","z")),t.add(new z("Color",this.params,"color"))}select(t){}deselect(){}objectChanged(t){this.params.name=t.getName(),this.params.position.set(t.getPosition().x,t.getPosition().y,t.getPosition().z),this.params.color=t.getColor().getHexString()}inspectorChanged(t){!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.setName(this.params.name),t.setPosition(this.params.position),t.updateColor(new I(this.params.color))}},xn=class extends H{controlPoints;currentObject;laceList;atFront=!1;constructor(){const t=new j;t.add(new O("<b>Click</b> on a control point to <b>select</b> it.")),t.add(new O("<b>Move</b> the selected control point with the transform controls.")),t.add(new T("E/Insert","Insert a new control point at the last selected endpoint.")),t.add(new T("R/Delete","Remove the last control point.")),super("waypoints",!1,t),this.controlPoints=[],this.currentObject=null,this.laceList=new Vt("Control Points",this.controlPoints,this.listChanged.bind(this),this.listAdd.bind(this),this.listRemove.bind(this),{scrollFix:!0}),y.subscribe("editHandleSelected",P.ALL,e=>{this.currentObject&&(e.getIndex()===0?this.atFront=!0:e.getIndex()===this.controlPoints.length-1&&(this.atFront=!1))}),a.getInteractionsManager().addKeydowns(["e","insert"],(()=>{if(!this.active||this.currentObject===null)return;const e=new _;e.setFromCamera(a.getSelectionManager().getMouse(),a.getCamera());const o=new w;a.getCamera().getWorldDirection(o);const n=this.atFront?this.controlPoints[0].getPosition():this.controlPoints[this.controlPoints.length-1].getPosition(),s=new it().setFromNormalAndCoplanarPoint(o,n),r=new w;e.ray.intersectPlane(s,r),r.x=Math.round(r.x*100)/100,r.y=Math.round(r.y*100)/100,r.z=Math.round(r.z*100)/100,this.addControlPoint(r.sub(this.currentObject.getPosition()),this.atFront)}).bind(this)),a.getInteractionsManager().addKeydowns(["r","delete"],(()=>{this.active&&this.currentObject!==null&&this.removeControlPoint(this.atFront)}).bind(this))}build(t){t.add(new B("Control Points",{bold:!0})),t.add(new B("Work in progress!",{italic:!0}))}select(t){this.atFront=!1,this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){const e=t.getControlPoints();this.controlPoints.length=0,e.forEach((o,n)=>{this.controlPoints.push(new En(o))}),this.laceList.update()}inspectorChanged(t){}listChanged(t){this.currentObject!==null&&(this.currentObject.updateControlPoint(t,this.controlPoints[t].getPosition()),this.objectChanged(this.currentObject))}listAdd(){if(this.currentObject===null)return;const t=this.controlPoints[this.controlPoints.length-2].getPosition(),e=this.controlPoints[this.controlPoints.length-1].getPosition(),o=It(e,t);this.addControlPoint(o)}addControlPoint(t,e=!1){this.currentObject!==null&&(a.getTransformControls().detach(),a.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.addControlPoint(t,e),this.objectChanged(this.currentObject))}listRemove(){this.currentObject!==null&&(this.removeControlPoint(),this.objectChanged(this.currentObject))}removeControlPoint(t=!1){this.currentObject!==null&&(a.getTransformControls().detach(),a.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.removeControlPoint(t),this.objectChanged(this.currentObject))}};class En extends Tt{position;constructor(t){super(),this.position=t.clone()}setPosition(t){this.position.set(t.x,t.y,t.z)}getPosition(){const t=new w;return t.set(this.position.x,this.position.y,this.position.z),t}getEditor(){return[new D("Position",this.position,"x","y","z")]}}class we extends H{currentObject;group=void 0;params;constructor(){const t=new j;super("brick-wall",!1,t,!0),this.currentObject=null,this.params={shadingModel:ie.name,color:"#000000"}}build(t){t.add(new Kt("Shading Model",this.params,"shadingModel",this.getShadingModelsDropdown())),t.add(new z("Color",this.params,"color")),this.group=t.addGroup(),this.currentObject!==null&&this.currentObject.getMaterial().buildUI(this.group)}select(t){this.currentObject=t,this.group!==void 0&&(this.group.reset(),this.currentObject.getMaterial().buildUI(this.group))}deselect(){this.currentObject=null}objectChanged(t){this.params.color=t.getColor().getHexString(),this.params.shadingModel=t.getMaterial().getShadingModelName()}inspectorChanged(t){if(!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.updateColor(new I(this.params.color)),t.getMaterial().getShadingModelName()!==this.params.shadingModel){const o=this.createShadingModel(this.params.shadingModel);t.getMaterial().setShadingModel(o)}}createShadingModel(t){return Mt()[t].create()}getShadingModelsDropdown(){const t=Mt(),e={};for(const o in t)e[o]=t[o].name;return e}}class Sn extends Y{constructor(t){const e=[new On,new jn,new we];super("Bezier Patch",t,e)}}let On=class extends H{params;constructor(){const t=new j;t.add(new O("<b>Move</b> the object with the transform control.")),super("box",!0,t),this.params={name:"",position:new w,color:"#000000"}}build(t){t.add(new st("",this.params,"name")),t.add(new D("Position",this.params.position,"x","y","z")),t.add(new z("Color",this.params,"color"))}select(t){}deselect(){}objectChanged(t){this.params.name=t.getName(),this.params.position.set(t.getPosition().x,t.getPosition().y,t.getPosition().z),this.params.color=t.getColor().getHexString()}inspectorChanged(t){!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.setName(this.params.name),t.setPosition(this.params.position),t.updateColor(new I(this.params.color))}},jn=class extends H{currentObject;lastIndex=null;constructor(){const t=new j;t.add(new O("<b>Click</b> on a control point to <b>select</b> it.")),t.add(new O("<b>Move</b> the selected control point with the transform controls.")),t.add(new O("<b>Once you have selected a control point</b> (at the edges):")),t.add(new T("E/Insert","Insert a new row and/or column at the mouse position.")),t.add(new T("R/Delete","Remove the last row and/or column.")),super("waypoints",!1,t),this.currentObject=null,y.subscribe("editHandleSelected",P.ALL,e=>{this.currentObject&&(this.lastIndex=e.getIndex())}),y.subscribe("editHandleUnselected",P.ALL,()=>{this.lastIndex=null}),a.getInteractionsManager().addKeydowns(["e","insert"],(()=>{if(!this.active||this.currentObject===null||this.lastIndex===null)return;const e=new _;e.setFromCamera(a.getSelectionManager().getMouse(),a.getCamera());const o=new w;a.getCamera().getWorldDirection(o);const n=this.currentObject.getControlPoint(this.lastIndex),s=new it().setFromNormalAndCoplanarPoint(o,n),r=new w;e.ray.intersectPlane(s,r),r.x=Math.round(r.x*100)/100,r.y=Math.round(r.y*100)/100,r.z=Math.round(r.z*100)/100,this.addControlPoint(this.lastIndex,r)}).bind(this)),a.getInteractionsManager().addKeydowns(["r","delete"],(()=>{this.active&&this.currentObject!==null&&this.lastIndex!==null&&this.removeControlPoint(this.lastIndex)}).bind(this))}build(t){t.add(new B("Control Points",{bold:!0})),t.add(new B("Work in progress!",{italic:!0}))}select(t){this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){}inspectorChanged(t){}addControlPoint(t,e){this.currentObject&&(a.getTransformControls().detach(),a.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.addControlPoint(t,e),this.objectChanged(this.currentObject))}removeControlPoint(t){this.currentObject!==null&&(a.getTransformControls().detach(),a.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.removeControlPoint(t),this.objectChanged(this.currentObject))}};class Hn extends Y{constructor(t){const e=[new In,new Ln,new we];super("Uniform B-Spline Surface",t,e)}}let In=class extends H{params;degreeSlider;constructor(){const t=new j;t.add(new O("<b>Move</b> the object with the transform control.")),super("box",!0,t),this.params={name:"",position:new w,color:"#000000",degree:0,closed:"none"},this.degreeSlider=new V("Degree",this.params,"degree",{min:2,max:10,step:1})}build(t){t.add(new st("",this.params,"name")),t.add(new D("Position",this.params.position,"x","y","z")),t.add(new z("Color",this.params,"color")),t.add(this.degreeSlider),t.add(new Kt("Closed",this.params,"closed",{none:"None",u:"X",v:"Y"}))}select(t){}deselect(){}objectChanged(t){this.params.name=t.getName(),this.params.position.set(t.getPosition().x,t.getPosition().y,t.getPosition().z),this.params.color=t.getColor().getHexString(),this.params.degree=t.getDegree(),this.degreeSlider.setMax(t.getMaxDegree()),this.params.closed=t.getClosedU()?"u":t.getClosedV()?"v":"none"}inspectorChanged(t){!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.setName(this.params.name),t.setPosition(this.params.position),t.updateColor(new I(this.params.color)),t.setDegree(this.params.degree),this.params.closed==="u"?t.setClosedU(!0):this.params.closed==="v"?t.setClosedV(!0):(t.setClosedU(!1),t.setClosedV(!1))}},Ln=class extends H{currentObject;lastIndex=null;constructor(){const t=new j;t.add(new O("<b>Click</b> on a control point to <b>select</b> it.")),t.add(new O("<b>Move</b> the selected control point with the transform controls.")),t.add(new O("<b>Once you have selected a control point</b> (at the edges):")),t.add(new T("E/Insert","Insert a new row and/or column at the mouse position.")),t.add(new T("R/Delete","Remove the last row and/or column.")),super("waypoints",!1,t),this.currentObject=null,y.subscribe("editHandleSelected",P.ALL,e=>{this.currentObject&&(this.lastIndex=e.getIndex())}),y.subscribe("editHandleUnselected",P.ALL,()=>{this.lastIndex=null}),a.getInteractionsManager().addKeydowns(["e","insert"],(()=>{if(!this.active||this.currentObject===null||this.lastIndex===null)return;const e=new _;e.setFromCamera(a.getSelectionManager().getMouse(),a.getCamera());const o=new w;a.getCamera().getWorldDirection(o);const n=this.currentObject.getControlPoint(this.lastIndex),s=new it().setFromNormalAndCoplanarPoint(o,n),r=new w;e.ray.intersectPlane(s,r),r.x=Math.round(r.x*100)/100,r.y=Math.round(r.y*100)/100,r.z=Math.round(r.z*100)/100,this.addControlPoint(this.lastIndex,r)}).bind(this)),a.getInteractionsManager().addKeydowns(["r","delete"],(()=>{this.active&&this.currentObject!==null&&this.lastIndex!==null&&this.removeControlPoint(this.lastIndex)}).bind(this))}build(t){t.add(new B("Control Points",{bold:!0})),t.add(new B("Work in progress!",{italic:!0}))}select(t){this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){}inspectorChanged(t){}addControlPoint(t,e){this.currentObject&&(a.getTransformControls().detach(),a.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.addControlPoint(t,e),this.objectChanged(this.currentObject))}removeControlPoint(t){this.currentObject!==null&&(a.getTransformControls().detach(),a.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.removeControlPoint(t),this.objectChanged(this.currentObject))}};class Vn extends Y{constructor(t){const e=[new Tn,new Bn,new we];super("Uniform Rational B-Spline Surface",t,e)}}class Tn extends H{params;degreeSlider;constructor(){const t=new j;t.add(new O("<b>Move</b> the object with the transform control.")),super("box",!0,t),this.params={name:"",position:new w,color:"#000000",degree:0,closed:"none"},this.degreeSlider=new V("Degree",this.params,"degree",{min:2,max:10,step:1})}build(t){t.add(new st("",this.params,"name")),t.add(new D("Position",this.params.position,"x","y","z")),t.add(new z("Color",this.params,"color")),t.add(this.degreeSlider),t.add(new Kt("Closed",this.params,"closed",{none:"None",u:"X",v:"Y"}))}select(t){}deselect(){}objectChanged(t){this.params.name=t.getName(),this.params.position.set(t.getPosition().x,t.getPosition().y,t.getPosition().z),this.params.color=t.getColor().getHexString(),this.params.degree=t.getDegree(),this.degreeSlider.setMax(t.getMaxDegree()),this.params.closed=t.getClosedU()?"u":t.getClosedV()?"v":"none"}inspectorChanged(t){!this.params.color.startsWith("#")&&!this.params.color.startsWith("rgb")&&(this.params.color="#"+this.params.color),t.setName(this.params.name),t.setPosition(this.params.position),t.updateColor(new I(this.params.color)),t.setDegree(this.params.degree),this.params.closed==="u"?t.setClosedU(!0):this.params.closed==="v"?t.setClosedV(!0):(t.setClosedU(!1),t.setClosedV(!1))}}class Bn extends H{currentObject;lastIndex=null;constructor(){const t=new j;t.add(new O("<b>Click</b> on a control point to <b>select</b> it.")),t.add(new O("<b>Move</b> the selected control point with the transform controls.")),t.add(new O("When a control point is selected, <b>scroll</b> to change its weight.")),t.add(new O("<b>Once you have selected a control point</b> (at the edges):")),t.add(new T("E/Insert","Insert a new row and/or column at the mouse position.")),t.add(new T("R/Delete","Remove the last row and/or column.")),super("waypoints",!1,t),this.currentObject=null,y.subscribe("editHandleSelected",P.ALL,e=>{this.currentObject&&(this.lastIndex=e.getIndex(),this.currentObject.showWeightEditRing(e.getIndex()))}),y.subscribe("editHandleUnselected",P.ALL,()=>{this.lastIndex=null,this.currentObject&&this.currentObject.hideWeightEditRing()}),a.getInteractionsManager().addKeydowns(["e","insert"],(()=>{if(!this.active||this.currentObject===null||this.lastIndex===null)return;const e=new _;e.setFromCamera(a.getSelectionManager().getMouse(),a.getCamera());const o=new w;a.getCamera().getWorldDirection(o);const n=this.currentObject.getControlPoint(this.lastIndex),s=new w(n.x,n.y,n.z),r=new it().setFromNormalAndCoplanarPoint(o,s),c=new w;e.ray.intersectPlane(r,c),c.x=Math.round(c.x*100)/100,c.y=Math.round(c.y*100)/100,c.z=Math.round(c.z*100)/100,this.addControlPoint(this.lastIndex,c)}).bind(this)),a.getInteractionsManager().addKeydowns(["r","delete"],(()=>{this.active&&this.currentObject!==null&&this.lastIndex!==null&&this.removeControlPoint(this.lastIndex)}).bind(this))}build(t){t.add(new B("Control Points",{bold:!0})),t.add(new B("Work in progress!",{italic:!0}))}select(t){this.currentObject=t}deselect(){this.currentObject=null}objectChanged(t){}inspectorChanged(t){}addControlPoint(t,e){this.currentObject&&(a.getTransformControls().detach(),a.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.addControlPoint(t,e),this.objectChanged(this.currentObject))}removeControlPoint(t){this.currentObject!==null&&(a.getTransformControls().detach(),a.getSelectionManager().doResetSelectedEditHandle(),this.currentObject.removeControlPoint(t),this.objectChanged(this.currentObject))}}var Q=(i=>(i[i.LOW=0]="LOW",i[i.MEDIUM=1]="MEDIUM",i[i.HIGH=2]="HIGH",i))(Q||{}),Ct=(i=>(i[i.BezierPatch=0]="BezierPatch",i[i.UBSSurface=1]="UBSSurface",i[i.URBSSurface=2]="URBSSurface",i[i.SPHERE=99]="SPHERE",i))(Ct||{});class Un{type;position;color;reflectivity;constructor(t,e,o,n=0){this.type=t,this.position=e,this.color=o,this.reflectivity=n}}class tt{triangle;uv;normal;constructor(t,e,o){this.triangle=t,this.uv=e,this.normal=o}subdivisions}class Rn extends Un{controlPoints;data={};constructor(t,e,o,n=0){super(0,e,o,n),this.controlPoints=t}}class Dn{dialog;preview;previewContainer;console;consolePanel;progressBar;downloadButton;closeButton;tabGroup;constructor(){this.dialog=document.createElement("sl-dialog"),this.dialog.classList.add("raytracer-dialog"),this.dialog.noHeader=!0,this.dialog.style.setProperty("--width","80vw"),this.dialog.style.color="var(--sl-input-color)",this.dialog.style.fontFamily="var(--sl-font-sans)",this.dialog.addEventListener("sl-request-close",m=>{m.preventDefault()});const t=document.createElement("div");t.style.display="flex",t.style.flexDirection="column",t.style.width="100%",t.style.height="70vh";const e=document.createElement("sl-tab-group");e.placement="start",e.style.width="100%",e.style.flex="1 1 0",e.style.minHeight="0",e.style.overflow="hidden",t.appendChild(e),e.addEventListener("sl-tab-show",m=>{this.scrollToBottom(),requestAnimationFrame(this.renderPreview.bind(this))}),this.tabGroup=e;const o=document.createElement("sl-tab");o.slot="nav",o.panel="preview";const n=document.createElement("sl-icon");n.name="eye",n.library="lucide",n.style.fontSize="1.3em",n.style.marginRight="5px",o.appendChild(n),o.appendChild(document.createTextNode("Preview")),e.appendChild(o);const s=document.createElement("sl-tab-panel");s.name="preview",e.appendChild(s),this.previewContainer=document.createElement("div"),this.previewContainer.style.display="flex",this.previewContainer.style.width="100%",this.previewContainer.style.height="100%",this.previewContainer.style.justifyContent="center",this.previewContainer.style.alignItems="center",s.appendChild(this.previewContainer),this.preview=document.createElement("canvas"),this.preview.style.borderRadius="var(--sl-border-radius-medium)",this.previewContainer.appendChild(this.preview);const r=document.createElement("sl-tab");r.slot="nav",r.panel="console";const c=document.createElement("sl-icon");c.name="square-terminal",c.library="lucide",c.style.fontSize="1.3em",c.style.marginRight="5px",r.appendChild(c),r.appendChild(document.createTextNode("Output")),e.appendChild(r),this.consolePanel=document.createElement("sl-tab-panel"),this.consolePanel.name="console",this.consolePanel.style.height="100%",this.consolePanel.style.overflowX="auto",e.appendChild(this.consolePanel),this.console=document.createElement("div"),this.console.style.height="100%",this.console.style.padding="10px",this.console.style.backgroundColor="var(--sl-color-neutral-200)",this.console.style.color="var(--sl-color-neutral-900)",this.console.style.fontFamily="var(--sl-font-mono)",this.console.style.fontSize="var(--sl-font-size-small)",this.console.style.fontWeight="var(--sl-font-weight-bold)",this.console.style.borderRadius="var(--sl-border-radius-medium)",this.console.style.overflow="auto",this.consolePanel.appendChild(this.console);const h=document.createElement("div");h.style.display="flex",h.style.flexDirection="row",h.style.alignContent="center",h.style.justifyContent="space-around",h.style.alignItems="center",h.style.marginTop="20px",t.appendChild(h),this.progressBar=document.createElement("sl-progress-bar"),this.progressBar.textContent="0%",this.progressBar.style.flex="1 1 0",this.progressBar.style.minWidth="0",this.progressBar.style.maxWidth="100%",h.appendChild(this.progressBar),this.progressBar.indeterminate=!0,this.downloadButton=document.createElement("sl-button"),this.downloadButton.variant="primary",this.downloadButton.outline=!0,this.downloadButton.style.marginLeft="10px";const d=document.createElement("sl-icon");d.slot="prefix",d.name="download",d.library="lucide",this.downloadButton.appendChild(d),this.downloadButton.appendChild(document.createTextNode("Download")),h.appendChild(this.downloadButton),this.downloadButton.loading=!0,this.closeButton=document.createElement("sl-button"),this.closeButton.variant="danger",this.closeButton.outline=!0,this.closeButton.style.marginLeft="10px";const u=document.createElement("sl-icon");u.slot="prefix",u.name="x",u.library="lucide",this.closeButton.appendChild(u),this.closeButton.appendChild(document.createTextNode("Close")),h.appendChild(this.closeButton),this.closeButton.disabled=!0,this.dialog.appendChild(t),a.getApp().appendChild(this.dialog)}show(){this.dialog.show()}hide(){this.dialog.hide(),this.console.innerHTML="",this.downloadButton.loading=!0,this.downloadButton.onclick=()=>{},this.closeButton.disabled=!0,this.closeButton.onclick=()=>{},this.progressBar.value=0,this.progressBar.textContent="0%",this.progressBar.indeterminate=!0}setProgress(t){this.progressBar.value=t,this.progressBar.textContent=t+"%",this.progressBar.indeterminate=!1}setProgressIndeterminate(){this.progressBar.indeterminate=!0}setPreview(t,e,o){const n=new ImageData(t,e,o);this.preview.width=e,this.preview.height=o;const s=this.preview.getContext("2d");s?s.putImageData(n,0,0):this.logError("Cannot show preview: no canvas context found"),requestAnimationFrame(this.renderPreview.bind(this))}renderPreview(){const t=this.preview.width/this.preview.height,e=this.previewContainer.clientWidth/this.tabGroup.clientHeight;t<e?(this.preview.style.width="auto",this.preview.style.height=this.tabGroup.clientHeight+"px"):(this.preview.style.width=this.previewContainer.clientWidth+"px",this.preview.style.height="auto")}allowDownload(t=()=>{}){this.downloadButton.onclick=t,this.downloadButton.loading=!1}allowClose(t=()=>{}){this.closeButton.onclick=t,this.closeButton.disabled=!1}log(t){this.addLog(t,"neutral-900")}logInfo(t){this.addLog(t,"primary-600")}logSuccess(t){this.addLog(t,"success-600")}logWarning(t){this.addLog(t,"warning-600")}logError(t){this.addLog(t,"danger-600")}addLog(t,e){const o=document.createElement("div"),n=document.createElement("span"),s=new Date().toLocaleTimeString();n.appendChild(document.createTextNode("["+s+"] ")),n.style.color="var(--sl-color-neutral-500)",n.style.fontWeight="var(--sl-font-weight-light)",o.appendChild(n),o.appendChild(document.createTextNode(t)),o.style.color="var(--sl-color-"+e+")",o.style.marginBottom="5px",o.style.whiteSpace="pre-wrap";const r=this.consolePanel.scrollTop+this.consolePanel.clientHeight>=this.consolePanel.scrollHeight-20;this.console.appendChild(o),r&&this.scrollToBottom()}scrollToBottom(){setTimeout(()=>{this.consolePanel.scrollTop=this.consolePanel.scrollHeight},0)}}function _e(i,t,e){const o=t.clone().sub(i.center),n=e.dot(e),s=2*o.dot(e),r=o.dot(o)-i.radius*i.radius,c=s*s-4*n*r;if(c<0)return{hit:!1,distance:0,data:{u:0,v:0,normal:new l.Vector3(0,0,0)}};{const h=(-s-Math.sqrt(c))/(2*n);return h>lt.EPSILON?{hit:!0,distance:h,data:{u:0,v:0,normal:new l.Vector3(0,0,0)}}:{hit:!1,distance:0,data:{u:0,v:0,normal:new l.Vector3(0,0,0)}}}}function Nn(i,t,e,o,n,s){const r=_e(i,t,e);if(r.hit){const h=t.clone().add(e.clone().multiplyScalar(r.distance)).clone().sub(i.center).normalize(),d=s?0:Math.max(0,h.dot(n.direction.normalize()))*n.intensity,u=n.color.clone().multiplyScalar(d),g=o.color.clone().multiplyScalar(o.intensity).add(u);return{color:new l.Color(i.color.r,i.color.g,i.color.b).multiply(g),normal:h}}else return{color:new l.Color(0,0,0),normal:new l.Vector3(0,0,0)}}function Xe(i,t,e,o,n=!1){const s=t.clone().sub(i.position),r=new l.Ray(s,e.clone().normalize()),c=Wn(i);if(r.intersectBox(c,new l.Vector3)===null)return{hit:!1,distance:0,data:{u:0,v:0,normal:new l.Vector3(0,0,0)}};const{steps:h,triSub:d,adapSub:u,closeK:m,approx:g}=kn(o),p=An(i,h,h),b=Fn(i,p);if(r.intersectBox(b,new l.Vector3)===null)return{hit:!1,distance:0,data:{u:0,v:0,normal:new l.Vector3(0,0,0)}};const f=Gn(i,p,d),{hit:C,uvs:v,distance:E,normal:M}=Ze(i,r,f,u,m,g,n);return{hit:C,distance:E,data:{u:v.u,v:v.v,normal:M}}}function zn(i,t,e,o,n,s,r){if(!t.hit||!t.data)return{color:new l.Color(0,0,0),normal:new l.Vector3(0,0,0)};const c=t.data,h=F(i.controlPoints,c.u,c.v),d=ot(h.du,h.dv),u=s.direction.clone().normalize(),m=e.clone().sub(h.point).normalize(),g=u.clone().add(m).normalize(),p=r?0:Math.max(0,d.dot(u))*s.intensity,f=r?0:Math.pow(Math.max(0,d.dot(g)),32)*s.intensity,C=s.color.clone().multiplyScalar(p),v=s.color.clone().multiplyScalar(f),M=n.color.clone().multiplyScalar(n.intensity).add(C).add(v),S=new l.Color(i.color.r,i.color.g,i.color.b).multiply(M);return t.data.debugColor&&S.copy(t.data.debugColor),{color:S,normal:d}}function kn(i){let t=8,e=2,o=3,n=6,s=30;return i==Q.MEDIUM?(t=12,e=1,o=2,n=5,s=15):i==Q.LOW&&(t=10,e=1,o=1,n=4,s=10),{steps:t,triSub:e,adapSub:o,closeK:n,approx:s}}function F(i,t,e){const o=i.length-1,n=i[0].length-1,s=new l.Vector3(0,0,0),r=new l.Vector3(0,0,0),c=new l.Vector3(0,0,0);for(let h=0;h<=o;h++){const d=K(o,h,t),u=Se(o,h,t);for(let m=0;m<=n;m++){const g=new l.Vector3(i[h][m].x,i[h][m].y,i[h][m].z),p=K(n,m,e),b=Se(n,m,e);s.add(g.clone().multiplyScalar(d*p)),r.add(g.clone().multiplyScalar(u*p)),c.add(g.clone().multiplyScalar(d*b))}}return{point:s,du:r,dv:c}}function Wn(i){if(!i.data.boundingBox){const t=new l.Box3;t.setFromPoints(i.controlPoints.flat()),i.data.boundingBox=t}return i.data.boundingBox}function An(i,t,e){if(!i.data.sampledPoints){const o=[];for(let n=0;n<t;n++){const s=n/(t-1),r=[];for(let c=0;c<e;c++){const h=c/(e-1),d=F(i.controlPoints,s,h),u=ot(d.du,d.dv);r.push({point:d.point,normal:u})}o.push(r)}i.data.sampledPoints=o}return i.data.sampledPoints}function Fn(i,t){if(!i.data.sampledBoundingBox){const e=new l.Box3;e.setFromPoints(t.flat().map(n=>n.point));const o=e.getSize(new l.Vector3).length()*.001;e.expandByScalar(o),i.data.sampledBoundingBox=e}return i.data.sampledBoundingBox}function Gn(i,t,e,o=-1){if(!i.data.triangles){const n=[],s=t.length,r=t[0].length;for(let c=0;c<s-1;c++)for(let h=0;h<r-1;h++){const d=1/(s-1),u=c*d,m=1/(r-1),g=h*m,p=t[c][h],b=t[c+1][h],f=t[c][h+1],C=t[c+1][h+1],v=[p.point,b.point,f.point],E=[p.normal,b.normal,f.normal],M=[b.point,C.point,f.point],x=[b.normal,C.normal,f.normal],S=[new l.Vector2(u,g),new l.Vector2(u+d,g),new l.Vector2(u,g+m)],L=[new l.Vector2(u+d,g),new l.Vector2(u+d,g+m),new l.Vector2(u,g+m)],ft=new tt(v,S,E),q=new tt(M,L,x),Z=Ye([ft,q],i,e,o);n.push(...Z)}i.data.triangles=n}return i.data.triangles}function Ye(i,t,e,o=-1){if(e<=0)return i;const n=[];for(const s of i){const r=o===-1?qe(t,s):Kn(t,s,o);n.push(...r)}return e<=1?n:Ye(n,t,e-1)}function Jn(i,t){var e=null,o=null,n=1/0;for(const s of t){const r=new l.Vector3,c=s.triangle,h=i.intersectTriangle(c[0],c[1],c[2],!1,r),d=r.distanceTo(i.origin);h&&d<n&&(n=d,e=s,o=r)}return{hitPoint:o,hitDistance:n,hitTriangle:e}}function qe(i,t){if(t.subdivisions)return t.subdivisions;const e=t.triangle,o=t.uv,n=t.normal,s=new l.Vector2().addVectors(o[0],o[1]).multiplyScalar(.5),r=new l.Vector2().addVectors(o[1],o[2]).multiplyScalar(.5),c=new l.Vector2().addVectors(o[2],o[0]).multiplyScalar(.5),h=F(i.controlPoints,s.x,s.y),d=ot(h.du,h.dv),u=F(i.controlPoints,r.x,r.y),m=ot(u.du,u.dv),g=F(i.controlPoints,c.x,c.y),p=ot(g.du,g.dv),b=[e[0],h.point,g.point],f=[o[0],s,c],C=[n[0],d,p],v=[e[1],u.point,h.point],E=[o[1],r,s],M=[n[1],m,d],x=[e[2],g.point,u.point],S=[o[2],c,r],L=[n[2],p,m],ft=[h.point,u.point,g.point],q=[s,r,c],Z=[d,m,p],Bt=[new tt(b,f,C),new tt(v,E,M),new tt(x,S,L),new tt(ft,q,Z)];return t.subdivisions=Bt,Bt}function Kn(i,t,e){if(t.subdivisions)return t.subdivisions;if(e=e+1,e<=1)return[t];const o=t.uv,n=[],s=[];for(let r=0;r<=e;r++){s[r]=[];for(let c=0;c<=e-r;c++){const h=e-r-c,d=o[0].clone().multiplyScalar(r/e).add(o[1].clone().multiplyScalar(c/e)).add(o[2].clone().multiplyScalar(h/e)),u=F(i.controlPoints,d.x,d.y),m=ot(u.du,u.dv);s[r][c]={uv:d,point:u.point,normal:m}}}for(let r=0;r<e;r++)for(let c=0;c<e-r;c++){const h=s[r][c],d=s[r+1][c],u=s[r][c+1];if(n.push(new tt([h.point.clone(),d.point.clone(),u.point.clone()],[h.uv.clone(),d.uv.clone(),u.uv.clone()],[h.normal.clone(),d.normal.clone(),u.normal.clone()])),c<e-r-1){const m=s[r+1][c+1];n.push(new tt([d.point.clone(),m.point.clone(),u.point.clone()],[d.uv.clone(),m.uv.clone(),u.uv.clone()],[d.normal.clone(),m.normal.clone(),u.normal.clone()]))}}return t.subdivisions=n,n}function Ze(i,t,e,o,n=6,s=10,r=!1){var{hitPoint:c,hitDistance:h,hitTriangle:d}=Jn(t,e);if(c&&h&&d){const g=He(c,d),p=Ie(t.origin,t.direction,i.controlPoints,g,s,lt.EPSILON);if(!p.converged)return{hit:!1,uvs:{u:0,v:0},distance:0,normal:new l.Vector3(0,0,0)};const b=F(i.controlPoints,p.u,p.v),f=ot(b.du,b.dv);return h=b.point.distanceTo(t.origin),{hit:!0,uvs:{u:p.u,v:p.v},distance:h,normal:f}}if(r)return{hit:!1,uvs:{u:0,v:0},distance:0,normal:new l.Vector3(0,0,0)};const u=$n(t,e,n,.1);if(u.length<=0||u[0].rayTriangleDistance>.3)return{hit:!1,uvs:{u:0,v:0},distance:0,normal:new l.Vector3(0,0,0)};if(o<=0){const g=u[0].hitPoint,p=u[0].hitTriangle,b=He(g,p),f=Ie(t.origin,t.direction,i.controlPoints,b,10,lt.EPSILON);if(!f.converged)return{hit:!1,uvs:{u:0,v:0},distance:0,normal:new l.Vector3(0,0,0)};const C=F(i.controlPoints,f.u,f.v),v=ot(C.du,C.dv);return h=C.point.distanceTo(t.origin),{hit:!0,uvs:{u:f.u,v:f.v},distance:h,normal:v}}const m=[];for(const g of u){const p=qe(i,g.hitTriangle);m.push(...p)}return Ze(i,t,m,o-1,n,s)}function $n(i,t,e=4,o=.1){const n=[];for(const s of t){const[r,c,h]=s.triangle,d=new l.Triangle(r,c,h),u=new l.Vector3;d.closestPointToPoint(i.origin,u);const m=i.distanceToPoint(u),p=new l.Vector3().subVectors(u,i.origin).dot(i.direction);if(p<lt.EPSILON)continue;const b=m+o*p;n.push({score:b,hitPoint:u.clone(),hitDistance:p,hitTriangle:s,rayTriangleDistance:m}),n.sort((f,C)=>f.score-C.score),n.length>e&&n.pop()}return n.sort((s,r)=>s.rayTriangleDistance-r.rayTriangleDistance).map(({hitPoint:s,hitDistance:r,hitTriangle:c,rayTriangleDistance:h})=>({hitPoint:s,hitDistance:r,hitTriangle:c,rayTriangleDistance:h}))}function He(i,t){const[e,o,n]=t.triangle,s=new l.Vector3;l.Triangle.getBarycoord(i,e,o,n,s);const[r,c,h]=t.uv;var d=r.x*s.x+c.x*s.y+h.x*s.z,u=r.y*s.x+c.y*s.y+h.y*s.z;return d=Math.max(0,Math.min(1,d)),u=Math.max(0,Math.min(1,u)),{u:d,v:u}}function ot(i,t){const e=new l.Vector3;return e.crossVectors(i,t),e.normalize(),e}function Ie(i,t,e,o,n=10,s=lt.EPSILON){let r=o.u,c=o.v;const h=t.clone().normalize();for(let d=0;d<n;d++){const{point:u,du:m,dv:g}=F(e,r,c),b=u.clone().sub(i).dot(h),f=i.clone().add(h.clone().multiplyScalar(b)),C=u.clone().sub(f),v=[[m.dot(m)-m.dot(h)*m.dot(h),m.dot(g)-m.dot(h)*g.dot(h)],[g.dot(m)-g.dot(h)*m.dot(h),g.dot(g)-g.dot(h)*g.dot(h)]],E=[C.dot(m),C.dot(g)],M=v[0][0]*v[1][1]-v[0][1]*v[1][0];if(Math.abs(M)<s)return{converged:!1,u:r,v:c};const x=[[v[1][1]/M,-v[0][1]/M],[-v[1][0]/M,v[0][0]/M]],S=-(x[0][0]*E[0]+x[0][1]*E[1]),L=-(x[1][0]*E[0]+x[1][1]*E[1]);if(r+=S,c+=L,r=Math.max(0,Math.min(1,r)),c=Math.max(0,Math.min(1,c)),Math.sqrt(S*S+L*L)<s)return{converged:!0,u:r,v:c}}return{converged:!1,u:r,v:c}}function Qe(){const i=[],t=a.getObjectManager().getObjects();for(const e of t)if(e instanceof at){const o=e.toJSON(),n=o.controlPointsWidth,s=o.controlPointsHeight,r=[];for(let h=0;h<s;h++){r[h]=[];for(let d=0;d<n;d++){const u=o.controlPoints[h*n+d];r[h][d]=new l.Vector3(u.x,u.y,u.z)}}const c=new Rn(r,e.getPosition(),new l.Color(o.color),0);i.push(c)}return i}var re=(i=>(i.INFO="INFO",i.SUCCESS="SUCCESS",i))(re||{});const ne=128,Le=1;var et=[],zt=0,to=[],gt=new Uint8ClampedArray(0);function _n(i,t,e,o){const n=[],{width:s,height:r}=i;for(let c=0;c<r;c+=t)for(let h=0;h<s;h+=t){const d=Math.min(t,s-h),u=Math.min(t,r-c);n.push({started:!1,batch:{workerId:-1,task:i,xStart:h,yStart:c,width:d,height:u,supersamplingFactor:e,suppixelOffsets:o}})}return n}function Xn(i){const t=[],e=1/i;for(let o=0;o<i;o++)for(let n=0;n<i;n++)t.push({dx:(o+.5)*e-.5,dy:(n+.5)*e-.5});return t}function Yn(i,t,e,o,n,s,r,c){for(let d=0;d<s;d++)for(let u=0;u<n;u++){const m=(d*n+u)*4,g=e+u,p=o+d;if(g>=r||p>=c)continue;const b=(p*r+g)*4;for(let f=0;f<4;f++)i[b+f]=t[m+f]}}self.onmessage=async i=>{const t=i.data,e=t.ambientLight,o=t.directionalLight,n=t.camera,s=new l.PerspectiveCamera(n.fov,t.width/t.height,.1,1e3);s.position.copy(n.position),s.rotation.copy(n.rotation),s.up.copy(n.up),s.updateProjectionMatrix(),s.updateMatrixWorld(),e.color=new l.Color(e.color.r,e.color.g,e.color.b),o.direction=new l.Vector3(o.direction.x,o.direction.y,o.direction.z).normalize(),o.color=new l.Color(o.color.r,o.color.g,o.color.b),gt=new Uint8ClampedArray(t.width*t.height*4);const r=Xn(Le),c={type:"INFO",messages:["Dimensions: "+t.width+"x"+t.height,"Found "+t.objects.length+" objects","Quality: "+t.quality,"Starting to raytrace..."],progress:0,data:gt,width:t.width,height:t.height,startTime:t.startTime};self.postMessage(c);var h=[];et=_n(t,ne,Le,r),h.push("Created "+et.length+" batches with size "+ne+"x"+ne+"!");const d=Math.min(Math.max(4,navigator.hardwareConcurrency-4),et.length);h.push("Using "+d+" workers!");for(let m=0;m<d;m++){h.push("Creating Worker-"+m+" ...");const g=new Worker(t.workerURL,{type:"module"});to.push(g),g.onmessage=qn,h.push("Starting Worker-"+m+" ...");const p=et[m];p.started=!0,p.batch.workerId=m,g.postMessage(p.batch)}const u={type:"INFO",messages:h,progress:0,data:gt,width:t.width,height:t.height,startTime:t.startTime};self.postMessage(u)};function qn(i){const t=i.data;Yn(gt,t.data,t.xStart,t.yStart,t.width,t.height,t.task.width,t.task.height),zt++;const e=Math.round(zt/et.length*100),o={type:"INFO",messages:["Batch "+zt+" of "+et.length+" finished!"],progress:e,data:gt,width:t.task.width,height:t.task.height,startTime:t.startTime};if(self.postMessage(o),zt<et.length){const s=et.filter(c=>!c.started)[0],r=to[t.workerId];s&&(s.started=!0,s.batch.workerId=t.workerId,r.postMessage(s.batch));return}const n={type:"SUCCESS",messages:["All batches finished!","Raytracing finished!"],progress:100,data:gt,width:t.task.width,height:t.task.height,startTime:t.startTime,objects:t.task.objects};self.postMessage(n)}const Zn=`import { RaytraceObject } from "./raytraceObject";\r
import { Raytracer } from "./raytracer";\r
import { RaytracerTask } from "./raytracerTask";\r
import * as THREE from 'three';\r
import { RaytracerBatchTask, RaytracerBatchWorkerMessage } from "./raytracerWorker";\r
\r
self.onmessage = async (event: MessageEvent<RaytracerBatchTask>) => {\r
    const batch = event.data;\r
    const task = batch.task;\r
    const ambientLight = task.ambientLight;\r
    const directionalLight = task.directionalLight;\r
    const camera = task.camera;\r
\r
    const raytraceCamera = new THREE.PerspectiveCamera(camera.fov, task.width / task.height, 0.1, 1000);\r
    raytraceCamera.position.copy(camera.position);\r
    raytraceCamera.rotation.copy(camera.rotation);\r
    raytraceCamera.up.copy(camera.up);\r
    raytraceCamera.updateProjectionMatrix();\r
    raytraceCamera.updateMatrixWorld();\r
\r
    ambientLight.color = new THREE.Color(ambientLight.color.r, ambientLight.color.g, ambientLight.color.b);\r
\r
    directionalLight.direction = new THREE.Vector3(directionalLight.direction.x, directionalLight.direction.y, directionalLight.direction.z).normalize();\r
    directionalLight.color = new THREE.Color(directionalLight.color.r, directionalLight.color.g, directionalLight.color.b);\r
\r
    const data = new Uint8ClampedArray(batch.width * batch.height * 4);\r
\r
    const origin = raytraceCamera.position.clone();\r
\r
    for (let x = batch.xStart; x < batch.xStart + batch.width; x++) {\r
        for (let y = batch.yStart; y < batch.yStart + batch.height; y++){\r
\r
            const localX = x - batch.xStart;\r
            const localY = y - batch.yStart;\r
            const accumulatedColor = new THREE.Color(0, 0, 0);\r
\r
            for (const offset of batch.suppixelOffsets){\r
                const ndcX = ((x + offset.dx) / task.width) * 2 - 1;\r
                const ndcY = 1 - ((y + offset.dy) / task.height) * 2;\r
\r
                const ray = new THREE.Raycaster();\r
                ray.setFromCamera(new THREE.Vector2(ndcX, ndcY), raytraceCamera);\r
\r
                const direction = ray.ray.direction.clone().normalize();\r
\r
                const color = Raytracer.raytrace(origin, direction, task.bounces, task.skybox, task.objects, ambientLight, directionalLight, task.quality);\r
                \r
                accumulatedColor.add(color);\r
            }\r
\r
            accumulatedColor.multiplyScalar(1 / (batch.supersamplingFactor * batch.supersamplingFactor));\r
\r
            Raytracer.setPixel(data, batch.width, localX, localY, accumulatedColor);\r
        }\r
    }\r
\r
    const message: RaytracerBatchWorkerMessage = {\r
        workerId: batch.workerId,\r
        progress: 100,\r
        data: data,\r
        xStart: batch.xStart,\r
        yStart: batch.yStart,\r
        width: batch.width,\r
        height: batch.height,\r
        startTime: task.startTime,\r
        task: task,\r
    };\r
\r
    self.postMessage(message);\r
\r
}\r
\r
export {};`;class lt{static dialog=null;static EPSILON=1e-4;static prepareTask(t,e,o,n,s){const r=a.getPerspectiveCamera();if(r===null)throw new Error("Trying to raytrace in 2D mode!");const h=a.getDirectionalLight().position.clone().normalize(),d=Qe();return{startTime:0,width:t,height:e,bounces:o,skybox:n,quality:s,objects:d,ambientLight:{color:a.getAmbientLight().color.clone(),intensity:a.getAmbientLight().intensity},directionalLight:{direction:h,color:a.getDirectionalLight().color.clone(),intensity:a.getDirectionalLight().intensity},camera:{position:r.position.clone(),rotation:r.rotation.clone(),fov:r.fov,up:r.up.clone()},workerURL:URL.createObjectURL(new Blob([Zn],{type:"application/javascript"}))}}static execute(t){this.dialog||(this.dialog=new Dn),this.dialog.show(),this.dialog.setProgress(0),this.dialog.log("Starting Raytracer..."),this.dialog.log("Creating Worker...");const e=new Worker(new URL("/assets/raytracerWorker-BM4CNsCt.js",import.meta.url),{type:"module"});e.onmessage=this.onMessage.bind(this),this.dialog.log("Starting Worker..."),t.startTime=Date.now(),e.postMessage(t)}static onMessage(t){if(!this.dialog)return;const e=t.data.type;if(e===re.INFO)t.data.messages.forEach(o=>{this.dialog&&this.dialog.logInfo("Worker: "+o)}),this.dialog.setPreview(t.data.data,t.data.width,t.data.height),this.dialog.setProgress(t.data.progress);else if(e===re.SUCCESS){this.dialog.setProgress(100),this.dialog.logInfo("Worker: "+t.data.messages[0]),this.dialog.logSuccess("Worker finished!");const o=Date.now()-t.data.startTime,n=Math.floor(o/6e4),s=(o%6e4/1e3).toFixed(2);n>0?this.dialog.logSuccess(`Raytracing took ${n.toString()} minutes and ${s} seconds`):this.dialog.logSuccess(`Raytracing took ${s} seconds`),this.dialog.setPreview(t.data.data,t.data.width,t.data.height),this.dialog.allowDownload(()=>{this.dialog&&(this.dialog.logSuccess("Download started..."),this.downloadImage(t.data.data,t.data.width,t.data.height))}),this.dialog.allowClose(()=>{this.dialog&&this.dialog.hide()})}}static raytrace(t,e,o,n,s,r,c,h){if(o<0)return n?this.raytraceSkybox(e,new l.Color(.5,.7,1)):new l.Color(0,0,0);var d=void 0,u=void 0,m=Number.MAX_VALUE;for(const g of s){const p=this.rayhitObject(g,t,e,h);p.hit&&p.distance<m&&(m=p.distance,d=g,u=p)}if(d&&u){const g=t.clone().add(e.clone().multiplyScalar(m)).add(u.data.normal.clone().multiplyScalar(.01)),p=this.shadowRay(g,s,d,c),b=this.raytraceObject(d,u,t,e,r,c,p,h);if(d.reflectivity>0){const f=e.clone().reflect(u.data.normal).normalize(),C=s.filter(E=>E!==d),v=this.raytrace(g,f,o-1,n,C,r,c,h);b.color.lerp(v,d.reflectivity)}return b.color}else return n?this.raytraceSkybox(e,new l.Color(.5,.7,1)):new l.Color(0,0,0)}static raytraceObject(t,e,o,n,s,r,c,h){switch(t.type){case Ct.SPHERE:return Nn(t,o,n,s,r,c);case Ct.BezierPatch:return zn(t,e,o,n,s,r,c)}return{color:new l.Color(0,0,0),normal:new l.Vector3(0,0,0)}}static rayhitObject(t,e,o,n,s=!1){switch(t.type){case Ct.SPHERE:return _e(t,e,o);case Ct.BezierPatch:return Xe(t,e,o,n,s)}return{hit:!1,distance:0,data:{u:0,v:0,normal:new l.Vector3(0,0,0)}}}static shadowRay(t,e,o,n){const s=n.direction.clone().normalize(),r=t.clone();for(const c of e){if(c===o)continue;if(this.rayhitObject(c,r,s,Q.LOW,!0).hit)return!0}return!1}static raytraceSkybox(t,e){const o=t.y,n=new l.Color(.5,.5,.5),s=new l.Color(.2,.2,.2),r=e.clone().multiplyScalar(.5),c=e.clone(),h=.5*(o+1);return o>0?c.clone().lerp(r,h):s.clone().lerp(n,h)}static setPixel(t,e,o,n,s){const r=(n*e+o)*4;t[r]=Math.floor(s.r*255),t[r+1]=Math.floor(s.g*255),t[r+2]=Math.floor(s.b*255),t[r+3]=255}static downloadImage(t,e,o){const n=new ImageData(t,e,o),s=document.createElement("canvas");s.width=e,s.height=o;const r=s.getContext("2d");if(r){r.putImageData(n,0,0);const c=s.toDataURL("image/png"),h=document.createElement("a");h.href=c,h.download="raytrace.png",h.click()}else throw new Error("Failed to get canvas context")}}class Qn extends H{params;debugParams;raytraceButton;debugButton;constructor(){const t=new j;super("trending-up-down",!1,t,!0),this.params={width:512,height:512,bounces:3,skybox:!0,quality:Q.MEDIUM},this.raytraceButton=new qt("Raytrace",this.startRaytracer.bind(this),{variant:"primary",prefixIcon:"play",iconLibrary:"lucide"}),this.debugButton=new qt("Debug",this.startDebugRaytracer.bind(this),{variant:"warning",prefixIcon:"play",iconLibrary:"lucide"}),y.subscribe("dimensionSwitched",P.ALL,()=>{this.raytraceButton.setDisabled(a.dimension2D())}),this.debugParams={origin:new w(5,5,5),direction:new w(0,0,0)}}build(t){t.add(new B("Raytracer",{bold:!0})),t.add(new V("Width",this.params,"width",{min:128,max:4096,step:128})),t.add(new V("Height",this.params,"height",{min:128,max:4096,step:128})),t.add(new V("Bounces",this.params,"bounces",{min:0,max:10,step:1})),t.add(new xo("Quality",this.params,"quality",{[Q.LOW]:"Low",[Q.MEDIUM]:"Medium",[Q.HIGH]:"High"})),t.add(new Jt("Skybox",this.params,"skybox")),t.add(this.raytraceButton),t.add(new Te),t.add(this.debugButton),t.add(new qt("From Camera",()=>{const e=a.getPerspectiveCamera();e!==null&&(this.debugParams.origin.copy(e.position),this.debugParams.direction.copy(e.getWorldDirection(new w)))}))}startRaytracer(){try{const t=lt.prepareTask(this.params.width,this.params.height,this.params.bounces,this.params.skybox,this.params.quality);lt.execute(t)}catch(t){console.error("Raytracer error:",t)}}startDebugRaytracer(){const e=Qe()[0],o=5,s=a.getDirectionalLight().position.clone().normalize();for(var r=0;r<o;r++)for(var c=0;c<o;c++){const h=r/o*2-1,d=1-c/o*2,u=new l.Raycaster,m=new l.PerspectiveCamera;m.position.copy(this.debugParams.origin),m.lookAt(this.debugParams.direction),m.updateMatrixWorld(),m.updateProjectionMatrix(),u.setFromCamera(new l.Vector2(h,d),m);const g=Xe(e,u.ray.origin,u.ray.direction,this.params.quality),p=new l.Color().setHSL((r+c*o)/(o*o),1,.5);if(g.hit){const f=g.data.u,C=g.data.v,v=F(e.controlPoints,f,C),E=new Ft(new ae(.05,32,32),new At({color:p}));E.position.copy(v.point),a.getScene().add(E);const M=g.data.normal,x=new l.ArrowHelper(M.clone(),v.point.clone(),1,p);a.getScene().add(x);const S=s.clone().normalize(),L=new l.ArrowHelper(S.clone(),v.point.clone(),1,16777215);a.getScene().add(L)}const b=new l.ArrowHelper(u.ray.direction.clone(),u.ray.origin.clone(),g.hit?g.distance:20,p);a.getScene().add(b),e.data.triangles}if(e.data.triangles)for(var r=0;r<e.data.triangles.length;r++){const d=e.data.triangles[r].triangle,u=new Ft(new l.BufferGeometry().setFromPoints(d),new At({color:65280,side:l.DoubleSide,depthTest:!1,wireframe:!0}));a.getScene().add(u)}}select(t){}deselect(){}objectChanged(t){}inspectorChanged(t){}}class ti extends Y{constructor(t){const e=[new ei,new oi,new ni,new Qn];super("Scene",t,e)}}class ei extends H{dirParams;ambParams;constructor(){const t=new j;super("sun",!1,t,!0),this.dirParams={dirLightRotation:0,dirLightIntensity:1,dirLightColor:"#ffffff"},this.ambParams={ambLightIntensity:.2,ambLightColor:"#f0f0f0"}}build(t){t.add(new B("Directional Light",{bold:!0})),t.add(new V("Rotation",this.dirParams,"dirLightRotation",{min:0,max:360,step:1}).onChange(this.updateDirectionalLight.bind(this))),t.add(new V("Intensity",this.dirParams,"dirLightIntensity",{min:.5,max:3,step:.1}).onChange(this.updateDirectionalLight.bind(this))),t.add(new z("Color",this.dirParams,"dirLightColor").onChange(this.updateDirectionalLight.bind(this))),t.add(new Te),t.add(new B("Ambient Light",{bold:!0})),t.add(new V("Intensity",this.ambParams,"ambLightIntensity",{min:0,max:1,step:.1}).onChange(this.updateAmbientLight.bind(this))),t.add(new z("Color",this.ambParams,"ambLightColor").onChange(this.updateAmbientLight.bind(this)))}updateDirectionalLight(){const e=Math.PI/180*this.dirParams.dirLightRotation,o=15*Math.cos(e),n=15*Math.sin(e);a.getDirectionalLight().position.set(o,20,n),a.getDirectionalLight().intensity=this.dirParams.dirLightIntensity,a.getDirectionalLight().color.set(this.dirParams.dirLightColor)}updateAmbientLight(){a.getAmbientLight().intensity=this.ambParams.ambLightIntensity,a.getAmbientLight().color.set(this.ambParams.ambLightColor)}select(t){this.objectChanged(t)}deselect(){}objectChanged(t){this.dirParams.dirLightRotation=t.dirRotation,this.dirParams.dirLightIntensity=t.dirIntensity,this.dirParams.dirLightColor=t.dirColor,this.ambParams.ambLightIntensity=t.ambIntensity,this.ambParams.ambLightColor=t.ambColor,this.updateDirectionalLight(),this.updateAmbientLight()}inspectorChanged(t){t.dirRotation=this.dirParams.dirLightRotation,t.dirIntensity=this.dirParams.dirLightIntensity,t.dirColor=this.dirParams.dirLightColor,t.ambIntensity=this.ambParams.ambLightIntensity,t.ambColor=this.ambParams.ambLightColor}}class oi extends H{params;exrLoader;constructor(){const t=new j;super("tent-tree",!1,t,!0),this.params={exrName:"outdoor",exrIntensity:1,showBackground:!1},this.exrLoader=new fo,y.subscribe("dimensionSwitched",P.ALL,()=>{this.updateBackground()})}build(t){t.add(new B("Scene Enviroment",{bold:!0})),t.add(new Kt("Map",this.params,"exrName",{outdoor:"Outdoor",indoor:"Indoor",space:"Space",northernLights:"Northern Lights"}).onChange(this.updateEnviroment.bind(this))),t.add(new V("Intensity",this.params,"exrIntensity",{min:0,max:5,step:.1}).onChange(this.updateEnviromentIntensity.bind(this))),t.add(new Jt("Show Background",this.params,"showBackground",{help:"Background will only be shown in 3D Mode."}).onChange(this.updateBackground.bind(this)))}updateEnviroment(){this.exrLoader.load(`/exrs/${this.params.exrName}.exr`,t=>{t.mapping=ho,t.minFilter=t.magFilter=uo,t.flipY=!1,a.getScene().environment=t,a.getScene().environmentIntensity=this.params.exrIntensity,this.params.showBackground&&!a.dimension2D()?(a.getScene().background=t,a.getScene().backgroundIntensity=this.params.exrIntensity):(a.getScene().background=new I(se()),a.getScene().backgroundIntensity=1),t.dispose(),y.notify("enviromentChanged",P.ALL)})}updateEnviromentIntensity(){a.getScene().environmentIntensity=this.params.exrIntensity,this.params.showBackground&&(a.getScene().backgroundIntensity=this.params.exrIntensity),y.notify("enviromentIntensityChanged",P.ALL)}updateBackground(){this.params.showBackground&&!a.dimension2D()?(a.getScene().background=a.getScene().environment,a.getScene().backgroundIntensity=this.params.exrIntensity):(a.getScene().background=new I(se()),a.getScene().backgroundIntensity=1)}select(t){a.getScene().environment===null&&this.updateEnviroment(),this.objectChanged(t)}deselect(){}objectChanged(t){t.envMap!==this.params.exrName?(this.params.exrName=t.envMap,this.params.exrIntensity=t.envIntensity,this.updateEnviroment()):t.envIntensity!==this.params.exrIntensity&&(this.params.exrIntensity=t.envIntensity,this.updateEnviromentIntensity())}inspectorChanged(t){t.envMap=this.params.exrName,t.envIntensity=this.params.exrIntensity}}class ni extends H{constructor(){const t=new j;super("cog",!1,t,!0)}build(t){t.add(new B("General Settings",{bold:!0})),t.add(new B("Work in progress!",{italic:!0}))}select(t){}deselect(){}objectChanged(t){}inspectorChanged(t){}}class ii{lace;currentInspector;objectInspectors;constructor(t){this.currentInspector=null,this.lace=new Eo(t),this.objectInspectors=new Map,this.objectInspectors.set("scene",new ti(this.lace)),this.objectInspectors.set("linearCurve",new hn(this.lace)),this.objectInspectors.set("bezierCurve",new nn(this.lace)),this.objectInspectors.set("bezierSpline",new yn(this.lace)),this.objectInspectors.set("uniformBSplineCurve",new gn(this.lace)),this.objectInspectors.set("urbsCurve",new wn(this.lace)),this.objectInspectors.set("bezierPatch",new Sn(this.lace)),this.objectInspectors.set("uniformBSplineSurface",new Hn(this.lace)),this.objectInspectors.set("uniformRationalBSplineSurface",new Vn(this.lace)),y.subscribe("start",P.ALL,()=>this.updateInspector(null)),y.subscribe("objectSelected",P.ALL,e=>this.updateInspector(e)),y.subscribe("objectUnselected",P.ALL,()=>this.updateInspector(null)),y.subscribe("objectRemoved",P.ALL,()=>this.updateInspector(null)),y.subscribe("objectChanged",P.VIEWPORT,()=>this.objectChanged()),y.subscribe("transformMoved",P.VIEWPORT,()=>this.objectChanged()),y.subscribe("sceneReset",P.ALL,()=>this.updateInspector(null))}updateInspector(t){if(!t){this.lace.hideAll(),this.currentInspector?.deselect();const o=this.objectInspectors.get("scene");if(o!==void 0){o.select(a.getSceneProxy()),this.currentInspector=o;return}this.currentInspector=null;return}var e=void 0;t instanceof xt?e=this.objectInspectors.get("linearCurve"):t instanceof pt?e=this.objectInspectors.get("bezierCurve"):t instanceof Ot?e=this.objectInspectors.get("bezierSpline"):t instanceof Et?e=this.objectInspectors.get("uniformBSplineCurve"):t instanceof St?e=this.objectInspectors.get("urbsCurve"):t instanceof at?e=this.objectInspectors.get("bezierPatch"):t instanceof jt?e=this.objectInspectors.get("uniformBSplineSurface"):t instanceof Ht&&(e=this.objectInspectors.get("uniformRationalBSplineSurface")),e?(e.select(t),this.currentInspector=e):(this.lace.hideAll(),this.currentInspector=null)}objectChanged(){this.currentInspector&&this.currentInspector.objectChanged()}}class si{selectionChanged;constructor(t,e,o){this.selectionChanged=e;const n=document.createElement("div"),s=document.createElement("sl-button-group");s.style.width="100%";const r=document.createElement("sl-dropdown");r.style.width="100%",r.hoist=!0,r.placement="bottom",s.appendChild(r);const c=document.createElement("sl-button");c.size="small",c.variant="danger",c.addEventListener("mousedown",o);const h=document.createElement("sl-icon");h.style.fontSize="1.3em",h.name="x-lg",h.slot="prefix";const d=document.createElement("span");d.textContent="Remove",c.appendChild(h),c.appendChild(d),s.appendChild(c),n.appendChild(s);const u=document.createElement("sl-button");u.slot="trigger",u.caret=!0,u.size="small",u.style.width="100%",u.variant="neutral";const m=document.createElement("sl-icon");m.style.fontSize="1.3em",m.name="plus-lg",m.slot="prefix";const g=document.createElement("span");g.textContent="Add",u.appendChild(m),u.appendChild(g),r.appendChild(u);const p=document.createElement("sl-menu");r.appendChild(p);const b=document.createElement("sl-menu-label");b.textContent="Curves",p.appendChild(b),p.appendChild(this.addNewObject("Linear Curve","LinearCurveObject",this.addLinearCurve.bind(this))),p.appendChild(this.addNewObject("Bezier Curve","BezierCurveObject",this.addBezierCurve.bind(this))),p.appendChild(this.addNewObject("Bezier Spline","BezierSplineObject",this.addBezierSpline.bind(this))),p.appendChild(this.addNewObject("Uniform B-Spline","UniformBSplineObject",this.addUniformBSplineCurve.bind(this))),p.appendChild(this.addNewObject("Uniform Rational B-Spline","UniformRationBSplineObject",this.addURBSCurve.bind(this)));const f=document.createElement("sl-menu-label");f.textContent="Surfaces",p.appendChild(f),p.appendChild(this.addNewObject("Bezier Patch","BezierPatchObject",this.addBezierPatch.bind(this))),p.appendChild(this.addNewObject("Uniform B-Spline Surface","UniformBSplineSurfaceObject",this.addUniformBSplineSurface.bind(this))),p.appendChild(this.addNewObject("Uniform Rational B-Spline Surface","UniformRationalBSplineSurfaceObject",this.addUniformRationalBSplineSurface.bind(this))),t.appendChild(n)}addNewObject(t,e,o){const n=document.createElement("sl-menu-item");n.classList.add("menu-item"),n.onclick=o;const{name:s,lucide:r}=ze(e),c=document.createElement("sl-icon");c.name=s,r&&(c.library="lucide"),c.slot="prefix";const h=document.createElement("span");return h.textContent=t,n.appendChild(c),n.appendChild(h),n}addLinearCurve(){const t=a.getCreationManager().createBasicLinearCurve();this.selectionChanged(t.getUUID())}addBezierCurve(){const t=a.getCreationManager().createBasicBezierCurve();this.selectionChanged(t.getUUID())}addBezierSpline(){const t=a.getCreationManager().createBasicBezierSpline();this.selectionChanged(t.getUUID())}addUniformBSplineCurve(){const t=a.getCreationManager().createBasicUniformBSpline();this.selectionChanged(t.getUUID())}addURBSCurve(){const t=a.getCreationManager().createBasicURBS();this.selectionChanged(t.getUUID())}addBezierPatch(){const t=a.getCreationManager().createBasicBezierPatch();this.selectionChanged(t.getUUID())}addUniformBSplineSurface(){const t=a.getCreationManager().createBasicUniformBSplineSurface();this.selectionChanged(t.getUUID())}addUniformRationalBSplineSurface(){const t=a.getCreationManager().createBasicUniformRationalBSplineSurface();this.selectionChanged(t.getUUID())}}class ri{container;menu;tree;items;hoveredItem;selectedItem;constructor(t,e={}){const{darkMode:o=!1}=e;this.items=new Map,this.hoveredItem=null,this.selectedItem=null;const n=document.createElement("div");n.className="hierarchy",n.style.border="solid 1px var(--sl-color-neutral-300)",n.style.borderRadius="var(--sl-border-radius-small)",n.style.backgroundColor="var(--sl-color-neutral-0)",n.style.height="100%",n.style.overflow="auto",n.style.color="var(--sl-input-color) !important",o&&n.classList.add("sl-theme-dark"),this.menu=new si(n,this.selectionChangedUUID.bind(this),this.removeSelected.bind(this)),this.tree=document.createElement("sl-tree"),this.tree.selection="leaf",n.appendChild(this.tree),t.appendChild(n),this.container=n,this.tree.addEventListener("sl-selection-change",s=>this.selectionChanged(s)),this.container.addEventListener("mouseup",()=>this.deselect()),y.subscribe("objectAdded",P.GENERAL,s=>this.addObject(s)),y.subscribe("objectRemoved",P.GENERAL,s=>this.removeObject(s)),y.subscribe("objectChanged",P.INSPECTOR,()=>this.updateHierarchy()),y.subscribe("objectNameChanged",P.ALL,()=>this.updateHierarchy()),y.subscribe("inspectorTabChanged",P.INSPECTOR,()=>this.updateHierarchy())}updateHierarchy(){this.items.clear(),this.tree.innerHTML="",a.getObjectManager().getObjects().forEach(t=>{this.addObject(t),t.getUUID()===this.hoveredItem&&this.viewportHover(t.getUUID()),t.getUUID()===this.selectedItem?.dataset.uuid&&this.viewportSelect(t.getUUID())})}addObject(t){const e=document.createElement("sl-tree-item");e.dataset.uuid=t.getUUID(),e.classList.add("hierarchy-item");const o=document.createElement("div");o.style.display="flex",o.style.alignItems="center",o.style.gap="10px";const{name:n,lucide:s}=ze(t.getType()),r=document.createElement("sl-icon");r.name=n,s&&(r.library="lucide"),o.appendChild(r);const c=document.createElement("span");c.textContent=t.getName(),o.appendChild(c),e.appendChild(o);const h=document.createElement("div");h.style.display="flex",h.style.flexDirection="row",h.style.marginRight="20px",e.appendChild(h);const d=document.createElement("div");d.style.marginRight="10px",d.style.display="none",t instanceof pt&&t.getMode()===2&&(d.style.display="");const u=document.createElement("sl-icon");u.name="spline",u.library="lucide",d.appendChild(u),h.appendChild(d);const m=document.createElement("div");m.style.color="#"+t.getColor().getHexString();const g=document.createElement("sl-icon");g.name="circle-fill",m.appendChild(g),h.appendChild(m),e.addEventListener("mouseenter",()=>this.hovered(t.getUUID())),e.addEventListener("mouseleave",()=>this.dehovered(t.getUUID())),e.addEventListener("sl-expand",()=>this.selectionChangedUUID(t.getUUID())),e.addEventListener("sl-collapse",()=>this.selectionChangedUUID(t.getUUID())),this.items.set(t.getUUID(),e),this.tree.appendChild(e)}removeObject(t){const e=this.items.get(t.getUUID());e&&(this.tree.removeChild(e),this.items.delete(t.getUUID()),this.selectedItem=null)}hovered(t){const e=a.getObjectManager().getObjectByUUID(t);e&&(this.hoveredItem=t,a.getSelectionManager().doHover(e))}viewportHover(t){const e=this.items.get(t);e&&(this.hoveredItem=t,e.classList.add("hover"))}dehovered(t){a.getObjectManager().getObjectByUUID(t)&&(this.hoveredItem=null,a.getSelectionManager().doResetHovered())}viewportDehover(){const t=this.hoveredItem;if(!t)return;const e=this.items.get(t);e&&(this.hoveredItem=null,e.classList.remove("hover"))}selectionChangedUUID(t){const e=this.items.get(t);e&&(this.viewportSelect(t),this.selectionChanged(new CustomEvent("sl-selection-change",{detail:{selection:[e]}})))}selectionChanged(t){const e=t.detail.selection[0];if(!e)return;this.selectedItem=e;const o=e.dataset.uuid;if(!o)return;const n=a.getObjectManager().getObjectByUUID(o);n&&a.getSelectionManager().doSelect(n)}removeSelected(){if(!this.selectedItem)return;const t=this.selectedItem.dataset.uuid;if(!t)return;const e=a.getObjectManager().getObjectByUUID(t);e&&(this.selectedItem=null,a.getTransformControls().detach(),this.removeObject(e),a.getObjectManager().removeObject(t))}viewportSelect(t){const e=this.items.get(t);e&&(this.selectedItem&&(this.selectedItem.selected=!1),this.selectedItem=e,e.selected=!0)}deselect(){if(!this.selectedItem)return;this.selectedItem.selected=!1;const t=this.selectedItem.dataset.uuid;if(!t)return;a.getObjectManager().getObjectByUUID(t)&&a.getSelectionManager().doResetSelected(),this.selectedItem=null}viewportDeselect(){this.selectedItem&&(this.selectedItem.selected=!1,this.selectedItem=null)}}class ai{constructor(){const t=new bo(a.getRenderer());a.setEffectComposer(t),this.setupRenderPass()}setupRenderPass(){a.getEffectComposer().addPass(new wo(a.getScene(),a.getCamera())),a.getEffectComposer().addPass(new vo)}}class li{constructor(){}saveSceneToFile(t){const e=new Blob([this.objectsToJSON()],{type:"application/json"}),o=document.createElement("a");o.href=URL.createObjectURL(e),o.download=t,o.click(),URL.revokeObjectURL(o.href),a.getInteractionsManager().toast("Scene saved","Scene saved successfully!","success")}saveSceneToCache(){localStorage.setItem("scene",this.objectsToJSON())}loadSceneFromFile(){const t=document.createElement("input");t.type="file",t.accept=".svis",t.onchange=e=>{try{const n=e.target.files?.item(0);if(n){const s=new FileReader;s.onload=r=>{const c=r.target;this.objectsFromJSON(c.result)},s.readAsText(n)}}catch(o){console.warn("Error while loading JSON file: ",o)}},t.click()}loadSceneFromCache(){const t=localStorage.getItem("scene");t&&this.objectsFromJSON(t,!0)}clearSceneCache(){localStorage.removeItem("scene")}setFlagCache(t,e){localStorage.setItem(t,e.toString())}getFlagCache(t){const e=localStorage.getItem(t);return e?e==="true":!1}objectsToJSON(){return JSON.stringify({"2d":a.dimension2D(),scene:a.getSceneProxy().toJSON(),objects:a.getObjectManager().getObjects().map(t=>t.toJSON())},null,1)}objectsFromJSON(t,e=!1){try{const o=JSON.parse(t);if(o["2d"]==null||o["2d"]==null)throw new Error("Could not find the 2d flag in the JSON file!");if(o.scene==null||o.scene==null)throw new Error("Could not find the scene object in the JSON file!");if(o.objects==null||o.objects==null)throw new Error("Could not find the objects array in the JSON file!");(o["2d"]&&!a.dimension2D()||!o["2d"]&&a.dimension2D())&&a.switchDimension(),a.getSceneProxy().fromJSON(o.scene);for(const n of o.objects)ci.createVisualObject(n);e?o.objects&&o.objects.length>0&&a.getInteractionsManager().toast("Last Session restored","The Last Session was restored successfully!","success"):a.getInteractionsManager().toast("Scene loaded","Scene loaded successfully!","success")}catch(o){console.error("Error while loading JSON file: ",o),a.getInteractionsManager().toast("Error","Error while loading JSON file: <br />"+o,"error")}}}class ci{static createVisualObject(t){const e=t.type;if(!e){console.warn("Object type not found!");return}switch(e){case"LinearCurveObject":a.getCreationManager().createJSONLinearCurve(t);break;case"BezierCurveObject":a.getCreationManager().createJSONBezierCurve(t);break;case"BezierSplineObject":a.getCreationManager().createJSONBezierSpline(t);break;case"UniformBSplineObject":a.getCreationManager().createJSONUniformBSpline(t);break;case"UniformRationBSplineObject":a.getCreationManager().createJSONURBS(t);break;case"BezierPatchObject":a.getCreationManager().createJSONBezierPatch(t);break;case"UniformBSplineSurfaceObject":a.getCreationManager().createJSONUniformBSplineSurface(t);break;case"UniformRationalBSplineSurfaceObject":a.getCreationManager().createJSONUniformRationalBSplineSurface(t);break;default:console.warn(`Unknown object type: ${e}`);break}}}var Wt=(i=>(i.OBJ="OBJ",i.STL="STL",i.GLTF="GLTF",i))(Wt||{});class hi{constructor(){}isExportable(t){return t.getExport()!==null}export(t){this.exportDialog(t)}exportDialog(t){const e=document.createElement("sl-dialog");e.label="Export to "+t,e.classList.add("export-dialog");const o=document.createElement("div");o.innerHTML="",e.appendChild(o);const n=a.getSelectionManager().getSelectedObject();if(n!=null)if(this.isExportable(n)){o.innerHTML+=`Selected object <b> ${n.getName()} </b> can be exported to <b> ${t} </b>.<br>`;const d=document.createElement("sl-button");d.variant="primary",d.innerText="Export Object",d.slot="footer",d.onclick=()=>{this.exportObject(n,t),e.hide()},e.appendChild(d)}else o.innerHTML+=`Selected object <b> ${n.getName()} </b> cannot be exported.<br>`;if(this.exportableObjectExists()){o.innerHTML+="Export all objects that can be exported.";const h=document.createElement("sl-button");h.variant="success",h.innerText="Export All",h.slot="footer",h.onclick=()=>{this.exportAll(t),e.hide()},e.appendChild(h)}else o.innerHTML+="No exportable objects available.";const c=document.createElement("sl-button");c.variant="danger",c.innerText="Cancel",c.slot="footer",c.onclick=()=>{e.hide()},e.appendChild(c),document.body.appendChild(e),e.show()}exportableObjectExists(){const t=a.getObjectManager().getObjects();for(const e of t)if(this.isExportable(e))return!0;return!1}exportAll(t){const e=new mo,o=a.getObjectManager().getObjects();for(const n of o)if(this.isExportable(n)){const s=n.getExport();if(s!==null){const r=s();r!==null&&(r.updateMatrixWorld(!0),e.add(r))}}e.children.length>0?this.exportToType(e,"exported_objects",t):console.warn("No exportable objects found.")}exportObject(t,e){const o=t.getExport();if(o===null){console.warn("Export function not available for this object.");return}const n=o();if(n===null){console.warn("Export function returned null mesh.");return}this.exportToType(n,t.getName(),e)}exportToType(t,e,o){switch(o){case"OBJ":this.exportToOBJ(t,e);break;case"STL":this.exportToSTL(t,e);break;case"GLTF":this.exportToGLTF(t,e);break;default:console.warn("Export type not supported.");break}}exportToOBJ(t,e){const n=new Co().parse(t);this.downloadFile(n,e.replaceAll(" ","_")+".obj")}exportToSTL(t,e){const n=new Po().parse(t,{binary:!1});this.downloadFile(n,e.replaceAll(" ","_")+".stl")}exportToGLTF(t,e){new yo().parse(t,n=>{const s=JSON.stringify(n);this.downloadFile(s,e.replaceAll(" ","_")+".gltf")},n=>{console.error("Error exporting to GLTF:",n)})}downloadFile(t,e){const o=new Blob([t],{type:"text/plain"}),n=URL.createObjectURL(o),s=document.createElement("a");s.href=n,s.download=e,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(n)}}class di{closed=!1;constructor(t){const e=document.createElement("div");e.className="toolbar";const o=document.createElement("div");o.style.display=a.getIOManager().getFlagCache("toolbarClosed")?"none":"flex",o.style.flexDirection="row",o.style.flexWrap="wrap",e.appendChild(o);const n=document.createElement("sl-button-group");n.label="Scene Management",o.appendChild(n);const s=document.createElement("sl-dropdown");n.appendChild(s);const r=document.createElement("sl-button");r.textContent="File",r.slot="trigger",r.size="medium",r.caret=!0,s.appendChild(r);const c=document.createElement("sl-menu");s.appendChild(c);const h=document.createElement("sl-menu-item"),d=document.createElement("sl-icon");d.library="lucide",d.name="save",d.slot="prefix",h.appendChild(d);const u=document.createTextNode("Save");h.appendChild(u),h.value="save",c.appendChild(h);const m=document.createElement("sl-menu-item"),g=document.createElement("sl-icon");g.library="lucide",g.name="file-up",g.slot="prefix",m.appendChild(g);const p=document.createTextNode("Load");m.appendChild(p),m.value="load",c.appendChild(m);const b=document.createElement("sl-menu-item"),f=document.createElement("sl-icon");f.library="lucide",f.name="folder-pen",f.slot="prefix",b.appendChild(f);const C=document.createTextNode("Examples");b.appendChild(C);const v=document.createElement("sl-menu");v.slot="submenu",b.appendChild(v);const E=document.createElement("sl-menu-item"),M=document.createElement("sl-icon");M.name="cup-hot",M.slot="prefix",E.appendChild(M);const x=document.createTextNode("Utah Teapot");E.appendChild(x),E.value="teapot",v.appendChild(E);const S=document.createElement("sl-menu-item"),L=document.createElement("sl-icon");L.name="cup-hot",L.slot="prefix",S.appendChild(L);const ft=document.createTextNode("Utah Teapot (Colorful)");S.appendChild(ft),S.value="teapotColor",v.appendChild(S),c.appendChild(b);const q=document.createElement("sl-menu-item"),Z=document.createElement("sl-icon");Z.library="lucide",Z.name="folder-output",Z.slot="prefix",q.appendChild(Z);const Bt=document.createTextNode("Export");q.appendChild(Bt);const bt=document.createElement("sl-menu");bt.slot="submenu",q.appendChild(bt);const _t=document.createElement("sl-menu-item"),oo=document.createTextNode("OBJ");_t.appendChild(oo),_t.value="exportOBJ",bt.appendChild(_t);const Xt=document.createElement("sl-menu-item"),no=document.createTextNode("STL");Xt.appendChild(no),Xt.value="exportSTL",bt.appendChild(Xt);const Yt=document.createElement("sl-menu-item"),io=document.createTextNode("GLTF");Yt.appendChild(io),Yt.value="exportGLTF",bt.appendChild(Yt),c.appendChild(q),c.addEventListener("sl-select",ro=>{switch(ro.detail.item.value){case"save":this.save();break;case"load":this.load();break;case"teapot":this.loadTeapot();break;case"teapotColor":this.loadTeapotColor();break;case"exportOBJ":this.exportOBJ();break;case"exportSTL":this.exportSTL();break;case"exportGLTF":this.exportGLTF();break;default:console.warn("Unknown menu item selected!");break}});const wt=document.createElement("sl-button"),Ut=document.createElement("sl-icon");Ut.library="lucide",Ut.name="list-restart",Ut.slot="prefix",wt.appendChild(Ut);const so=document.createTextNode("Reset Scene");wt.appendChild(so),wt.size="medium",wt.onclick=()=>this.resetScene(),n.appendChild(wt);const ct=document.createElement("sl-button");ct.textContent=a.dimension2D()?"3D":"2D",ct.size="medium",ct.style.marginLeft="0.5rem",ct.onclick=()=>{a.switchDimension(),ct.textContent=a.dimension2D()?"3D":"2D"},o.appendChild(ct);const ht=document.createElement("sl-button"),dt=document.createElement("sl-icon");dt.library="lucide",dt.name="sun",dt.slot="prefix",dt.style.display=a.darkMode()?"block":"none",ht.appendChild(dt);const ut=document.createElement("sl-icon");ut.library="lucide",ut.name="moon",ut.slot="prefix",ut.style.display=a.darkMode()?"none":"block",ht.appendChild(ut),ht.size="medium",ht.style.marginLeft="0.5rem",ht.onclick=()=>{a.setMode(!a.darkMode()),dt.style.display=a.darkMode()?"block":"none",ut.style.display=a.darkMode()?"none":"block"},o.appendChild(ht);const vt=document.createElement("sl-button"),Rt=document.createElement("sl-icon");Rt.library="lucide",Rt.name="chevron-left",Rt.slot="prefix",vt.appendChild(Rt),vt.size="medium",vt.style.marginLeft="0.5rem",vt.onclick=()=>{this.closed=!0,o.style.display="none",rt.style.display="flex",a.getIOManager().setFlagCache("toolbarClosed",!0)},o.appendChild(vt);const rt=document.createElement("sl-button"),Dt=document.createElement("sl-icon");Dt.library="lucide",Dt.name="chevron-right",Dt.slot="prefix",rt.appendChild(Dt),rt.size="medium",rt.style.display=a.getIOManager().getFlagCache("toolbarClosed")?"":"none",rt.onclick=()=>{this.closed=!1,o.style.display="flex",rt.style.display="none",a.getIOManager().setFlagCache("toolbarClosed",!1)},e.appendChild(rt),t.appendChild(e)}save(){const e=new Date().toISOString().split(".")[0].replaceAll("-","_").replace("T","-").replaceAll(":","_");a.getIOManager().saveSceneToFile("SplineVis_"+e+".svis")}load(){a.getIOManager().loadSceneFromFile()}loadTeapot(){je(2,!1)}loadTeapotColor(){je(2,!0)}exportOBJ(){a.getExportManager().export(Wt.OBJ)}exportSTL(){a.getExportManager().export(Wt.STL)}exportGLTF(){a.getExportManager().export(Wt.GLTF)}resetScene(){a.getInteractionsManager().confirm("Reset Scene","Are you sure you want to reset the scene?",t=>{t&&(a.getTransformControls().detach(),a.getObjectManager().removeObjects(),a.getIOManager().clearSceneCache(),a.getSceneProxy().reset(),y.notify("sceneReset",P.ALL))})}}class ve{keydowns;static blockedTags=["SL-INPUT","SL-COLOR-PICKER"];dialog;constructor(){this.keydowns=new Map,this.dialog=document.createElement("sl-dialog"),window.addEventListener("keydown",t=>{const e=t.key,o=t.target;ve.blockedTags.includes(o.tagName)||this.keydowns.has(e)&&this.keydowns.get(e)?.forEach(n=>n())}),this.addKeydown("d",()=>{a.switchDimension()})}addKeydown(t,e){this.keydowns.has(t)?this.keydowns.get(t)?.push(e):this.keydowns.set(t,[e])}addKeydowns(t,e){t.forEach(o=>this.addKeydown(o,e))}toast(t,e,o){const n=o==="setting"?"neutral":o==="info"?"primary":o==="error"?"danger":o,s=o==="info"?"info":o==="success"?"circle-check-big":o==="setting"?"settings":o==="warning"?"triangle-alert":o==="error"?"circle-x":"message-circle-warning",r=document.createElement("sl-alert");r.variant=n,r.closable=!1,r.duration=1e3;const c=document.createElement("sl-icon");c.name=s,c.library="lucide",c.slot="icon",r.appendChild(c);const h=document.createElement("span");h.innerHTML="<strong>"+t+"</strong><br />"+e,r.appendChild(h);const d=Object.assign(r);document.body.appendChild(d),r.toast()}confirm(t,e,o){this.dialog.innerHTML="",this.dialog.label=t,this.dialog.classList.add("confirm-dialog"),this.dialog.style.color="var(--sl-input-color)",this.dialog.addEventListener("sl-request-close",c=>{o(!1)});const n=document.createElement("div");n.innerHTML=e,this.dialog.appendChild(n);const s=document.createElement("sl-button");s.variant="success",s.innerText="Confirm",s.slot="footer",s.onclick=()=>{o(!0),this.dialog.hide()},this.dialog.appendChild(s);const r=document.createElement("sl-button");r.variant="danger",r.innerText="Cancel",r.slot="footer",r.onclick=()=>{o(!1),this.dialog.hide()},this.dialog.appendChild(r),a.getApp().appendChild(this.dialog),this.dialog.show()}}class ui extends G{mode;dirRotation;dirIntensity;dirColor;ambIntensity;ambColor;envMap;envIntensity;constructor(){const t=new Ft(new ae(0),new At);t.visible=!1,super("SceneProxyObject",t),this.type="SceneProxyObject",this.mode=0,this.dirRotation=0,this.dirIntensity=1,this.dirColor="#ffffff",this.ambIntensity=.2,this.ambColor="#f0f0f0",this.envMap="outdoor",this.envIntensity=1}reset(){this.dirRotation=0,this.dirIntensity=1,this.dirColor="#ffffff",this.ambIntensity=.2,this.ambColor="#f0f0f0",this.envMap="outdoor",this.envIntensity=1}getMode(){return this.mode}setMode(t){this.mode=t}toJSON(){return{name:this.name,type:this.type,position:this.getPosition(),color:this.color.getHex(),mode:this.mode,dirRotation:this.dirRotation,dirIntensity:this.dirIntensity,dirColor:this.dirColor,ambIntensity:this.ambIntensity,ambColor:this.ambColor,envMap:this.envMap,envIntensity:this.envIntensity}}fromJSON(t){this.mode=t.mode,this.dirRotation=t.dirRotation,this.dirIntensity=t.dirIntensity,this.dirColor=t.dirColor,this.ambIntensity=t.ambIntensity,this.ambColor=t.ambColor,this.envMap=t.envMap,this.envIntensity=t.envIntensity}highlight(){}resetHighlight(){}select(){}resetSelect(){}updateColor(t){}dispose(){}}function mi(){So("lucide",{resolver:v=>`https://cdn.jsdelivr.net/npm/lucide-static@0.482.0/icons/${v}.svg`});const i=document.getElementById("app");if(!i)return;const t=document.getElementById("viewport");if(!t)return;const e=document.getElementById("inspector");if(!e)return;const o=document.getElementById("hierarchy");if(!o)return;a.setApp(i),zo(t),ko(),Wo(t);const n=new Go;a.setObjectManager(n);const s=new Qo;a.setCreationManager(s);const r=new tn;a.setSelectionManager(r);const c=new en;a.setEditManager(c);const h=new ai;a.setEffectManager(h);const d=new li;a.setIOManager(d),Ao();const u=new ve;a.setInteractionsManager(u);const m=new hi;a.setExportManager(m);const g=new on(t);a.setControls(g);const p=new ri(o);a.setHierarchy(p);const b=new ii(e);a.setInspector(b);const f=new di(t);a.setToolbar(f);const C=new ui;a.setSceneProxy(C),a.getIOManager().loadSceneFromCache(),document.addEventListener("DOMContentLoaded",()=>{y.notify("start",P.ALL)}),eo()}function eo(){requestAnimationFrame(eo),a.getEffectComposer().render(),a.getOrbitControls().update(),a.getSelectionManager().update()}mi();
