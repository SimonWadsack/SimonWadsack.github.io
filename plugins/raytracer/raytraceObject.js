var RaytraceObjectType;
(function (RaytraceObjectType) {
    RaytraceObjectType[RaytraceObjectType["BezierPatch"] = 0] = "BezierPatch";
    RaytraceObjectType[RaytraceObjectType["UBSSurface"] = 1] = "UBSSurface";
    RaytraceObjectType[RaytraceObjectType["URBSSurface"] = 2] = "URBSSurface";
    RaytraceObjectType[RaytraceObjectType["SPHERE"] = 99] = "SPHERE";
})(RaytraceObjectType || (RaytraceObjectType = {}));
class RaytraceObject {
    type;
    constructor(type) {
        this.type = type;
    }
}
class RaytraceSphere extends RaytraceObject {
    center;
    radius;
    color;
    constructor(center, radius, color) {
        super(RaytraceObjectType.SPHERE);
        this.center = center;
        this.radius = radius;
        this.color = color;
    }
}

export { RaytraceObject, RaytraceObjectType, RaytraceSphere };
