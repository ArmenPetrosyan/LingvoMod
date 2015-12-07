;(function($){

    var functionStr = $('.tab-control.active').data('function');
    var instance = new FuzzyCalculator(functionStr);
    //refresh();

    $('.tab-control').on('click', function () {
        functionStr = $(this).data('function');
        instance = new FuzzyCalculator(functionStr);
        //refresh();
    });

    $('.js-actionButton')
        .on('click', function(){
            var tab = $('.tab-control.active').data('function');

            if(tab == 'triangle'){
                var triangleMin = + $('#triangleMin').val() || 0;
                var triangleX = + $('#triangleX').val() || 0;
                var triangleMax = + $('#triangleMax').val() || 0;

                // Обновляем 3угольное число
                if( (triangleMin < triangleX) && (triangleX < triangleMax) ){
                    instance.setTriangleNum(triangleMin, triangleX, triangleMax);
                }else{
                    $('#error-modal').modal();
                    return false;
                }
            }else
            if(tab == 'sigma'){
                var a = + $('#sigA').val() || 0;
                var c = + $('#sigC').val() || 0;
                instance.setSigmoidParams(a,c);
            }

            var modificatorStr =  $('.active .operators').val();
            var resultMatrix = instance.getSet();

            // если применен модификатор
            if(modificatorStr != 0){
                switch (modificatorStr) {
                    case 'con':
                        resultMatrix = instance.modCon();
                        break;
                    case 'dil':
                        resultMatrix = instance.modDil();
                        break;
                    case 'int':
                        resultMatrix = instance.modInt();
                        break;
                }

                $.plot($(".active .triangle-chart"), [{label:"A", data:resultMatrix}], {  xaxis: { min: 0 },yaxis: { max: 1.5 } });
            }else{
                var card = instance.card().toFixed(2);
                $('.active .card').text(card);


                var support = instance.support(),
                    core   = instance.core();

                $.plot($(".active .triangle-chart"), [
                    {label:"A", data:resultMatrix},
                    {label:"Носій А", data:support},
                    {label:"Ядро нечіткої множини А", data:core},
                    {label:"Виcота нечіткої множини А", data: instance.getHeight() },
                ], {  xaxis: { min: 0 },yaxis: { max: 1.5 } });

            }


        });

})(jQuery);
