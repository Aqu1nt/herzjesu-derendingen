function addDelay(ele, delay)
{
	delay += "s";
	$(ele)
	.css("animation-delay", delay)
	.css("-webkit-animation-delay", delay)
	.css("-o-animation-delay", delay)
	.css("-moz-animation-delay", delay)
	.css("-ms-animation-delay", delay);

}

$(document).ready(function(){ 
	
	/**
	 * Events owl-carousel
	 */
	$('.owl-carousel.events-slider').owlCarousel(
	{
		loop : false,
		responsiveClass : true,
		nav : true,
		navText : [ '<i class="fa fa-angle-left">',
				'<i class="fa fa-angle-right">' ],
		autoplay : false,
		responsive : {
			0 : {
				items : 1
			},
			480 : {
				items : 2
			},
			768 : {
				items : 3
			}
		}
	});
	
	/**
	 * Events animation Delay
	 */
	$('.event').each(function(i){
		addDelay(this, i * 0.25);
	});
	
	/**
	 * Gallery
	 */
	var gallery = $("#unite-gallery").unitegallery({
		gallery_theme: "tilesgrid",
		grid_num_rows: 2,						//maximum number of grid rows. If set to big value, the navigation will not appear.
		theme_navigation_type: "bullets"
	}); 
	
	$(".ug-thumb-wrapper").each(function(i){
		$(this).addClass("wow").addClass("zoomIn").addClass("fast");
		addDelay(this, i * 0.1);
	});
}); 
