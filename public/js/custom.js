(function($){
  "use strict";
  
  // Preloader 
	jQuery(window).on('load', function() {
		jQuery("#status").fadeOut();
		jQuery("#preloader").delay(350).fadeOut("slow");
	});
  
	// on ready function
	jQuery(document).ready(function($) {
	var $this = $(window);

	$(".prev-step").on('click',function(){
		$( ".next-step" ).removeClass( "active" );
		$( ".prev-step" ).addClass( "active" );

		$( "#login" ).removeClass("lighting");
		$( "#register").addClass( "lighting" );
		
	});

	$(".next-step").on('click',function(){
		$( ".prev-step" ).removeClass( "active" );
		$( ".next-step" ).addClass( "active" );

		$( "#login" ).addClass("lighting");
		$( "#register").removeClass( "lighting" );
	});


	$(".p-step").on('click',function(){
		$( ".next-step" ).addClass( "active" );
		$( ".prev-step" ).removeClass( "active" );

		$( "#login" ).addClass("lighting");
		$( "#register").removeClass( "lighting" );
		
	});

	$(".n-step").on('click',function(){
		$( ".prev-step" ).addClass( "active" );
		$( ".next-step" ).removeClass( "active" );

		$( "#login" ).removeClass("lighting");
		$( "#register").addClass( "lighting" );
	});


	$(".log_in").on('click',function(){
		$( ".prev-step" ).addClass( "active" );
		$( ".next-step" ).removeClass( "active" );

		$( "#login" ).removeClass("lighting");
		$( "#register").addClass( "lighting" );
	});


	$(".sign_up").on('click',function(){
		$( ".next-step" ).addClass( "active" );
		$( ".prev-step" ).removeClass( "active" );

		$( "#login" ).addClass("lighting");
		$( "#register").removeClass( "lighting" );
		
	});

	//show hide login form js
	$('#search_button').on("click", function(e) {
		$('#search_open').slideToggle();
		e.stopPropagation(); 
	});

    $( "#test" ).hover(function() {
           $('#modal-profile').modal({
        show: true
    });
  });  
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get('message');
  if(myParam == "applysussces") {
      $('#myModal').modal({show: true});
  }
  if(myParam == "applysusscesDone") {
    $('#myModal').modal({show: true});
    $(".message").html("Ứng Tuyển Thành Công")
}
  if(myParam == "FormIsCreated") {
    $('#myModal').modal({show: true});
    $(".message").html("Tạo Form Ứng Tuyển Thành Công")
    $("#tieptuc2").click(function(){
      $('#myModal').modal('hide');
      $('#step1').hide()
      $('#step2').addClass("in")
      $("#titleStep1").hide()
    })
    
}
if(myParam == "Create-Don-Ung-Tuyen-Done") {
  $('#myModal').modal({show: true});
  $(".message").html("Tạo Đơn Ứng Tuyển Thành Công")
  $("#tieptuc2").click(function(){
    $('#myModal').modal('hide');
  })
}
if(myParam == "loginFail") {
  $('#myModal').modal({show: true});
  $(".message").html("Bạn hãy đăng nhập.<br>Để sử dụng ứng dụng")
  $("#tieptuc2").click(function(){
    $('#myModal').modal('hide');
  })
}
if(myParam == "SentEmailDone") {
  $('#myModal').modal({show: true});
}
if(myParam == "CreatteFileJD") {
  $('#myModal').modal({show: true});
  $(".message").html("Thêm vị trí tuyển dụng thành công")
  $("#tieptuc2").click(function(){
    $('#myModal').modal('hide');
    $('#step1').hide()
    $('#step2').hide()
    $('#step3').addClass("in")
    $("#titleStep1").hide()
    $("#titleStep2").hide()
  })
}
if(myParam == "CreateShortURL") {
  $('#myModal').modal({show: true});
  $(".message").html("Đã rút gọn tin tuyển dụng")
  $("#tieptuc2").click(function(){
    $('#myModal').modal('hide');
    $('#step1').hide()
    $('#step2').hide()
    $('#step3').addClass("in")
    $("#titleStep1").hide()
    $("#titleStep2").hide()
   
  })
}
if(myParam == "DeleteDone") {
  $('#myModal').modal({show: true});
  $(".message").html("Đã Xoá Form Tuyển Dụng")
  $("#tieptuc2").click(function(){
    $('#myModal').modal('hide');
    $('#step1').hide()
    $('#step2').hide()
    $('#step3').addClass("in")
    $("#titleStep1").hide()
    $("#titleStep2").hide()
  })
}


  $(".browse-button input:file").change(function () {
      $("input[name='attachment']").each(function () {
          var fileName = $(this).val().split('/').pop().split('\\').pop();
          $(".filename").val(fileName);
          $(".browse-button-text").html('<i class="fa fa-refresh"></i> Change');
          $(".clear-button").show();
      });
  });
  $('.clear-button').click(function () {
      $('.filename').val("");
      $('.clear-button').hide();
      $('.browse-button input:file').val("");
      $(".browse-button-text").html('<i class="fa fa-folder-open"></i> Browse');
  });


  
  function readURL(input) {
      if (input.files && input.files[0]) {
          var reader = new FileReader();

          reader.onload = function (e) {
              $('#wizardPicturePreview').attr('src', e.target.result);
          }

          reader.readAsDataURL(input.files[0]); // convert to base64 string
      }
  }

  $("#fileUT").change(function () {
      readURL(this);
  });

	$(document).on("click", function(e){
		if(!(e.target.closest('#search_open'))){	
			$("#search_open").slideUp();   		
		}
   });
   
   // ===== Scroll to Top ==== 
$(window).scroll(function() {
    if ($(this).scrollTop() >= 100) {       
        $('#return-to-top').fadeIn(200);   
    } else {
        $('#return-to-top').fadeOut(200);  
    }
});
$('#return-to-top').on('click', function() {     
    $('body,html').animate({
        scrollTop : 0                
    }, 500);
});
   
   //------------------------ OWL JS Start --------------------//
   
   
   $(document).ready(function() {
              $('.jp_tittle_slider_content_wrapper .owl-carousel').owlCarousel({
                loop: true,
                margin: 10,
				autoplay:true,
                responsiveClass: true,
				navText : ['<i class="fa fa-chevron-left" aria-hidden="true"></i>','<i class="fa fa-chevron-right" aria-hidden="true"></i>'],
				animateOut: 'bounceInDown',
				animateIn: 'bounceInDown',
                responsive: {
                  0: {
                    items: 1,
                    nav: true
                  },
                  600: {
                    items: 1,
                    nav: true
                  },
                  1000: {
                    items: 1,
                    nav: true,
                    loop: true,
                    margin: 20
                  }
                }
              })
            })
			
			
			$(document).ready(function() {
              $('.jp_hiring_slider_wrapper .owl-carousel').owlCarousel({
                loop: true,
                margin: 10,
				autoplay:true,
                responsiveClass: true,
				smartSpeed: 1200,
				navText : ['<i class="fa fa-arrow-circle-o-left" aria-hidden="true"></i>','<i class="fa fa-arrow-circle-o-right" aria-hidden="true"></i>'],
                responsive: {
                  0: {
                    items: 1,
                    nav: true
                  },
                  600: {
                    items: 2,
                    nav: true
                  },
                  1000: {
                    items: 4,
                    nav: true,
                    loop: true,
                    margin: 20
                  }
                }
              })
            })
			// Featured Products Js
				$('.ss_featured_products .owl-carousel').owlCarousel({
					loop:true,
					margin:0,
					nav:true,
					autoplay:true,
					navText:["PREV" , "NEXT"],
					dots:true,
					smartSpeed: 1200,
					responsive:{
						0:{
							items:1
						},
						600:{
							items:1
						},
						1000:{
							items:1
						}
					}
				});
				
				
				$(document).ready(function() {
              $('.jp_spotlight_slider_wrapper .owl-carousel').owlCarousel({
                loop: true,
                margin: 10,
				autoplay:true,
                responsiveClass: true,
				smartSpeed: 1200,
				navText : ['<i class="fa fa-arrow-circle-o-left" aria-hidden="true"></i>','<i class="fa fa-arrow-circle-o-right" aria-hidden="true"></i>'],
                responsive: {
                  0: {
                    items: 1,
                    nav: true
                  },
                  600: {
                    items: 1,
                    nav: true
                  },
                  1000: {
                    items: 1,
                    nav: true,
                    loop: true,
                    margin: 20
                  }
                }
              })
            })
			
			$(document).ready(function() {
              $('.jp_best_deal_slider_wrapper .owl-carousel').owlCarousel({
                loop: true,
                margin: 10,
				autoplay:true,
                responsiveClass: true,
				smartSpeed: 1200,
				navText : ['<i class="fa fa-arrow-circle-o-left" aria-hidden="true"></i>','<i class="fa fa-arrow-circle-o-right" aria-hidden="true"></i>'],
                responsive: {
                  0: {
                    items: 1,
                    nav: true
                  },
                  600: {
                    items: 1,
                    nav: true
                  },
                  1000: {
                    items: 1,
                    nav: true,
                    loop: true,
                    margin: 20
                  }
                }
              })
            })
			
			$(document).ready(function() {
              $('.jp_client_slider_wrapper .owl-carousel').owlCarousel({
                loop: true,
                margin: 10,
				autoplay:true,
                responsiveClass: true,
				smartSpeed: 1200,
				navText : ['<i class="fa fa-arrow-circle-o-left" aria-hidden="true"></i>','<i class="fa fa-arrow-circle-o-right" aria-hidden="true"></i>'],
                responsive: {
                  0: {
                    items: 1,
                    nav: true
                  },
                  600: {
                    items: 1,
                    nav: true
                  },
                  1000: {
                    items: 1,
                    nav: true,
                    loop: true,
                    margin: 20
                  }
                }
              })
            })
			
			//------------------------ OWL JS End--------------------//
			
			
	//-------------------------------------------------------
    // counter-section
    //-------------------------------------------------------
	
    $('.jp_counter_main_wrapper').on('inview', function(event, visible, visiblePartX, visiblePartY) {
        if (visible) {
            $(this).find('.timer').each(function () {
                var $this = $(this);
                $({ Counter: 0 }).animate({ Counter: $this.text() }, {
                    duration: 2000,
                    easing: 'swing',
                    step: function () {
                        $this.text(Math.ceil(this.Counter));
                    }
                });
            });
            $(this).off('inview');
        }
    });
   
   
   
	
	});
})();   