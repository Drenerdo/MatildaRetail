$('.notification').draggable({
    axis: "x"
}) 

$('.notification').bind("mouseup mouseleave", function(){
    if ($(this).position().left >= 80) {
        $(this).animate({
            left: 400,
            opacity: 100
        }, 200,
        function(){
            $(this).html('');
            $(this).animate({
                padding: 0,
                height: 0,
                margin: 0
            }, 500,
            function() {
                $(this).remove();
            });
        });
    } else {
        $(this).animate({
            left:0
        });
    }
})