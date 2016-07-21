$( document ).ready(function() {
  $(window).bind('load', function(){
    $("img").each(function() {
        /* variables */
        var this_img   = $(this);
        var baseline   = 33;
        var img_height = this_img.height();

        /* do the maths */
        var remainder  = parseFloat(img_height%baseline);

        /* how much do we need to add? */
        var offset     = parseFloat(baseline-remainder);

        /* apply the margin to the image */
        this_img.css("margin-bottom",offset+"px");
    });
  });
});
