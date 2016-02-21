$(function() {
  

  $('#closet-trigger').on('click', function(e) {
    e.preventDefault();

    var dest = $(this).attr('data-linkTo');
    var cont = $(this).attr('data-container');

    $('.closet-container').load(dest, function() {

      $('.main-container').animate({ 'opacity': '0', 'margin-left': '-100%' }, 1000, 
        function() { $(this).empty().removeClass('active-container'); });

      $('.' + cont).animate({ 'opacity': '1', 'left': '0' }, 1200, 
        function() { $(this).removeClass('loaded'); });
    });
  });
  
});