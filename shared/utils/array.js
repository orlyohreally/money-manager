"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function normalize(array) {
    return array.reduce((res, item) => {
        res[item._id] = item;
        return res;
    }, {});
}
exports.normalize = normalize;
function unnormalizeArray(object) {
    return Object.keys(object).map(key => object[key]);
}
exports.unnormalizeArray = unnormalizeArray;
function orderNormalizedArrayByKey(key) {
    return (a, b) => a.value[key] - b.value[key];
}
exports.orderNormalizedArrayByKey = orderNormalizedArrayByKey;
//# sourceMappingURL=array.js.map