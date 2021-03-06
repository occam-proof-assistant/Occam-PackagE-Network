"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.significantTokensFromTokens = significantTokensFromTokens;
function significantTokensFromTokens(tokens) {
    var significantTokens = tokens.reduce(function(significantTokens1, token) {
        var tokenSignificant = token.isSignificant();
        if (tokenSignificant) {
            var significantToken = token; ///
            significantTokens1.push(significantToken);
        }
        return significantTokens1;
    }, []);
    return significantTokens;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsaXRpZXMvdG9rZW5zLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gc2lnbmlmaWNhbnRUb2tlbnNGcm9tVG9rZW5zKHRva2Vucykge1xuICBjb25zdCBzaWduaWZpY2FudFRva2VucyA9IHRva2Vucy5yZWR1Y2UoKHNpZ25pZmljYW50VG9rZW5zLCB0b2tlbikgPT4ge1xuICAgICAgICAgIGNvbnN0IHRva2VuU2lnbmlmaWNhbnQgPSB0b2tlbi5pc1NpZ25pZmljYW50KCk7XG5cbiAgICAgICAgICBpZiAodG9rZW5TaWduaWZpY2FudCkge1xuICAgICAgICAgICAgY29uc3Qgc2lnbmlmaWNhbnRUb2tlbiA9IHRva2VuOyAvLy9cblxuICAgICAgICAgICAgc2lnbmlmaWNhbnRUb2tlbnMucHVzaChzaWduaWZpY2FudFRva2VuKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc2lnbmlmaWNhbnRUb2tlbnM7XG4gICAgICAgIH0sIFtdKTtcblxuICByZXR1cm4gc2lnbmlmaWNhbnRUb2tlbnM7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkNBQUEsVUFBWTs7OztRQUVJLDJCQUEyQixHQUEzQiwyQkFBMkI7U0FBM0IsMkJBQTJCLENBQUMsTUFBTTtRQUMxQyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsTUFBTSxVQUFFLGtCQUFpQixFQUFFLEtBQUs7WUFDbkQsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLGFBQWE7WUFFeEMsZ0JBQWdCO2dCQUNaLGdCQUFnQixHQUFHLEtBQUssQ0FBRSxDQUFHLEFBQUgsRUFBRyxBQUFILENBQUc7WUFFbkMsa0JBQWlCLENBQUMsSUFBSSxDQUFDLGdCQUFnQjs7ZUFHbEMsa0JBQWlCOztXQUd6QixpQkFBaUIifQ==