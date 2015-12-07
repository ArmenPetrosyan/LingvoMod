// класс обработчика нечетких множеств
function FuzzyCalculator(memberFuncStr, fuzzySet){

    var triangleNum = fuzzySet || {min:0, x:5, max:10},
        stepCount   = 100,
        a           = 0,
        c           = 0;

    var memberFunc  = function(){}; // функция истинности ( объявление )

    switch (memberFuncStr) {        // функция истинности ( инициализация )

        case 'sigma' :            // опционально сигмоидная ;)
            memberFunc = function(x){
                return 1 / (1 + Math.exp(-  a * (x - c))) || 0;
            };
            break;

        default :                   // по умолчанию треугольная
            memberFunc = function(x){
                var result = 0;

                if (triangleNum.min <= x && x <= triangleNum.x){
                    result = (x - triangleNum.min) / (triangleNum.x - triangleNum.min);
                }
                else
                if(triangleNum.x <= x && x <= triangleNum.max){
                    result = (triangleNum.max - x) / (triangleNum.max - triangleNum.x);
                }

                return result;
            };
    }

    // Интерфейс управления классом
    return {

        setTriangleNum : function(min, x, max){
            triangleNum.min = min;
            triangleNum.x   = x;
            triangleNum.max = max;
        },

        setSigmoidParams : function(aa,cc){
            a = aa;
            c = cc;
        },

        getSet      : function(){
            var path = [];

            for (var x = 0; x < stepCount; x++){
                var pow = memberFunc(x);
                path.push([x, pow]);
            }

            return path;
        },

        getHeight : function(){
            var x = this.fuzzyHeight();
            return [[x,0], [x,1]];
        },

        // Висота нечіткої множини А
        fuzzyHeight : function(){
            var maxX = 0,
                maxY = 0;

            for (var x = 0; x < stepCount; x++){
                if( maxY < memberFunc(x) ){
                    maxY = memberFunc(x);
                    maxX = x;
                }
            }

            return maxX;
        },

        // Носій нечіткої множини А
        support      : function(){
            var path = [];

            for (var x = 0; x < stepCount; x++){
                var pow = memberFunc(x);
                if( pow > 0 ){
                    path.push([x, pow]);
                }
            }

            return path;
        },

        // Ядро нечіткої множини А
        core      : function(){
            var path = [];

            for (var x = 0; x < stepCount; x++){
                var pow = memberFunc(x);
                if( pow == 1 ){
                    path.push([x, pow]);
                }
            }

            return path;
        },

        // Потужність (кардинальне число) нечіткої множини А
        card       : function(){
            var sum = 0;

            for (var x = 0; x < stepCount; x++){
                var pow = memberFunc(x);
                sum += pow;
            }

            return sum;
        },

        // Оператор концентрації (concentration)
        modCon        : function(){
            var path = [];

            for (var x = 0; x < stepCount; x++){
                var pow = Math.pow(memberFunc(x),2);

                path.push([x, pow]);

            }

            return path;
        },

        // Оператор розтягнення (dilatation)
        modDil         : function(){
            var path = [];

            for (var x = 0; x < stepCount; x++){
                var pow = Math.sqrt(memberFunc(x));

                path.push([x, pow]);

            }

            return path;
        },

        // Оператор збільшення контрастності
        modInt       : function(){
            var path = [];

            for (var x = 0; x < stepCount; x++){
                var pow = memberFunc(x);

                if (pow < 0.5){
                    pow = 2 * Math.pow(pow,2);
                }else {
                    pow = 1 - (2 * Math.pow((1 - pow),2));
                }

                path.push([x, pow]);
            }

            return path;
        },
    }
}