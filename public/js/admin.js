var current_number;
var left_arrow;
var right_arrow;

window.onload = function()
    {
        current_number = $('#current_number');
        left_arrow     = $('#number_left_arrow');
        right_arrow    = $('#number_right_arrow');

        left_arrow.on('click', function()
            {
                current_number.text( parseInt(current_number.text()) - 1 );
            });
        right_arrow.on('click', function()
            {
                current_number.text( parseInt(current_number.text()) + 1 );
            });
    }