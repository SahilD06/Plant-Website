(function ($) {
    'use strict'  ;

    var browserWindow = $(window);

    browserWindow.on('load', function () {
        $('.preloader').fadeOut('slow', function () {
            $(this).remove();
        });
    });

    if ($.fn.classyNav) {
        $('#alazeaNav').classyNav();
    }

    $('#searchIcon').on('click', function () {
        $('.search-form').toggleClass('active');
    });
    $('.closeIcon').on('click', function () {
        $('.search-form').removeClass('active');
    });

    if ($.fn.owlCarousel) {
        var welcomeSlide = $('.hero-post-slides');
        var testiSlides = $('.testimonials-slides');
        var portfolioSlides = $('.portfolio-slides');

        welcomeSlide.owlCarousel({
            items: 1,
            margin: 0,
            loop: true,
            nav: false,
            dots: false,
            autoplay: true,
            center: true,
            autoplayTimeout: 5000,
            smartSpeed: 1000
        });

        testiSlides.owlCarousel({
            items: 1,
            margin: 0,
            loop: true,
            nav: false,
            dots: true,
            autoplay: true,
            autoplayTimeout: 5000,
            smartSpeed: 700,
            animateIn: 'fadeIn',
            animateOut: 'fadeOut'
        });

        portfolioSlides.owlCarousel({
            items: 2,
            margin: 30,
            loop: true,
            nav: true,
            navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
            dots: true,
            autoplay: false,
            autoplayTimeout: 5000,
            smartSpeed: 700,
            center: true
        });
    }

    if ($.fn.imagesLoaded) {
        $('.alazea-portfolio').imagesLoaded(function () {
            $('.portfolio-filter').on('click', 'button', function () {
                var filterValue = $(this).attr('data-filter');
                $grid.isotope({
                    filter: filterValue
                });
            });
            var $grid = $('.alazea-portfolio').isotope({
                itemSelector: '.single_portfolio_item',
                percentPosition: true,
                masonry: {
                    columnWidth: '.single_portfolio_item'
                }
            });
        });
    }

    if ($.fn.magnificPopup) {
        $('.portfolio-img, .product-img').magnificPopup({
            gallery: {
                enabled: true
            },
            type: 'image'
        });
        $('.video-icon').magnificPopup({
            type: 'iframe'
        });
    }

    if ($.fn.barfiller) {
        $('#bar1').barfiller({
            tooltip: true,
            duration: 1000,
            barColor: '#70c745',
            animateOnResize: true
        });
        $('#bar2').barfiller({
            tooltip: true,
            duration: 1000,
            barColor: '#70c745',
            animateOnResize: true
        });
        $('#bar3').barfiller({
            tooltip: true,
            duration: 1000,
            barColor: '#70c745',
            animateOnResize: true
        });
        $('#bar4').barfiller({
            tooltip: true,
            duration: 1000,
            barColor: '#70c745',
            animateOnResize: true
        });
    }

    $(document).ready(function() {
        if ($.fn.scrollUp) {
            browserWindow.scrollUp({
                scrollSpeed: 1500,
                scrollText: '<i class="fa fa-angle-up"></i>',
            });
        }
    
        if ($.fn.counterUp) {
            $('.counter').counterUp({
                delay: 10,
                time: 2000,
            });
        }
    
        if ($.fn.sticky) {
            $(".alazea-main-menu").sticky({
                topSpacing: 0,
            });
        }
    
        if ($.fn.tooltip) {
            $('[data-toggle="tooltip"]').tooltip({
                trigger: 'hover', 
                container: 'body' 
            });
        }
    });
    

    $('.slider-range-price').each(function () {
        var min = jQuery(this).data('min');
        var max = jQuery(this).data('max');
        var unit = jQuery(this).data('unit');
        var value_min = jQuery(this).data('value-min');
        var value_max = jQuery(this).data('value-max');
        var label_result = jQuery(this).data('label-result');
        var t = $(this);
        $(this).slider({
            range: true,
            min: min,
            max: max,
            values: [value_min, value_max],
            slide: function (event, ui) {
                var result = label_result + " " + unit + ui.values[0] + ' - ' + unit + ui.values[1];
                console.log(t);
                t.closest('.slider-range').find('.range-price').html(result);
            }
        });
    })

    $('a[href="#"]').on('click', function ($) {
        $.preventDefault();
    });

    if (browserWindow.width() > 767) {
        new WOW().init();
    }

})(jQuery);