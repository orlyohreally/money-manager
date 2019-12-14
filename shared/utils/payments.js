"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const array_1 = require("./array");
function getTotalPaymentAmount(payments) {
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
}
exports.getTotalPaymentAmount = getTotalPaymentAmount;
function aggregateAmountsByMember(payments, membersIds) {
    const groupedPayments = lodash_1.groupBy(array_1.unnormalizeArray(payments), "memberId");
    return membersIds.reduce((res, memberId) => {
        res[memberId] = getTotalPaymentAmount(groupedPayments[memberId] || []);
        return res;
    }, {});
}
exports.aggregateAmountsByMember = aggregateAmountsByMember;
function getDischargedTotal(payments, membersIds) {
    const aggregatedPayments = aggregateAmountsByMember(payments, membersIds);
    const totalAmount = getTotalPaymentAmount(array_1.unnormalizeArray(payments));
    return membersIds.reduce((res, memberId) => {
        res[memberId] =
            aggregatedPayments[memberId] - totalAmount / membersIds.length;
        return res;
    }, {});
}
exports.getDischargedTotal = getDischargedTotal;
//# sourceMappingURL=payments.js.map