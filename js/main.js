
// Supersized плагин

jQuery(function($){
 
    $.supersized({
 
        // Functionality
        slide_interval          :   3000,       // Length between transitions
        transition              :   1,          // 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
        transition_speed        :   700,        // Speed of transition
        slideshow               :   1,

        // Components                           
        slide_links             :   'blank',    // Individual links for each slide (Options: false, 'num', 'name', 'blank')
        thumb_links             :   1,
        thumbnail_navigation    :   1, 
        
        slides                  :   [           // Slideshow Images
                                        {image : 'img/header-bg-1.jpg'},
                                        {image : 'img/header-bg-2.jpg'},
                                        {image : 'img/header-bg-3.jpg'},
                                        {image : 'img/header-bg-4.jpg'}
                                    ]
    });
});


// Ресайз div.supersized_container под 100% высоты экрана -------------------------------

$(function() {

    function setHeight() {
        $('#supersized-container').css({
            height: $(window).height() + 'px'
        });
    }
    setHeight(); 
    $(window).resize( setHeight ); 

});



// Кнопка скролла supersized до следующей секции сайта ------------------------------------------------------------

$(function() {

    var $next = $('#next-section');
    $next.click(function() {
        $('html, body').animate({
            scrollTop: $('#main-navigation').offset().top }, 700, 'easeOutCubic')
    });
});    




// Функционал главной панели навигации ------------------------------------------------------

$(function() {

    var $btn = $('.open-btn');
    var $main_nav = $('#main-navigation');
    var $nav_top = $('.navigation-container').offset().top; 
    var $menu = $('#main-navigation ul');
    var calculated_height = 0; // высота мобильного меню для задания анимации свёртывания/развёртывания

    var $sections = $('main>section'); // разделы страницы
    var $section_links = $('#main-navigation ul>li>a'); // ссылки навигационного меню на разделы страницы 

    $('#main-navigation ul>li').each(function() {
        calculated_height += $(this).outerHeight(); 
    });

    // открытие-закрытие меню по нажатию кнопки + изменение вида кнопки
    $btn.click(function() {

        $menu.toggleClass('opened'); 

        if ($menu.hasClass('opened')) {
            $btn.css({
                'background-position': '0 -16px',
                'transform': 'rotate(-180deg)'
            });
            $menu.css({
                'height': calculated_height
            });
            
        } else {
            $btn.css({
                'background-position': '',
                'transform': 'rotate(0deg)'
            });
            $menu.css({
                'height': 0
            });
        }
    });


    var starting_state; // изначальный вид меню при загрузке, мобильный или полный

    $('document').ready(function() {
        if($(window).width()>960) {
            starting_state = 1; // полный
        } else {
            starting_state = 0; // мобильный
        }
    });

    $(window).resize(function() {

        // при изменении высоты страницы меняется высота div.supersized_container, и весь документ двигается вслед за ним
        // из-за этого надо каждый раз пересчитывать эту переменную
        $nav_top = $('.navigation-container').offset().top; 

        // при изменении размера окна и переключении вида $menu с полного на мобильное срабатывает
        // плавная анимация сворачивания, что нежелательно. Для этого при таком переключении анимация отключается на 1 сек
        if($(window).width()<=960) {
            if(starting_state == 1) {
                $menu.slideUp(0);
                setTimeout(function() {
                    $menu.slideDown(0);
                }, 1000);
                starting_state = 0;
            }
        }

        // сворачивание мобильного меню, если оно открыто в момент растяжения страницы под большой экран
        if($(window).width()>960) {
            $menu.removeClass('opened');
            $btn.css({
                'background-position': '',
                'transform': 'rotate(0deg)'
            });
            $menu.css({
                'height': ''
            });
            starting_state = 1;
        }
    });

    
    $section_links.click(function() {

        var type = $(this).attr('data-name');
        var section = $('section[data-name='+type+']');
        
        if(type == 'home') {
            $('html, body').animate({
            scrollTop: 0 }, 900, 'easeOutCubic');
        } else {
        $('html, body').animate({
            scrollTop: section.offset().top+1 }, 900, 'easeOutCubic');
        }
    });

    
    $(window).scroll(function() {

        // "приклеивание" меню к топу страницы при значении скролла больше nav_top
        if($(window).scrollTop()>$nav_top) {
            $main_nav.css({
                'position': 'fixed',
                'top': 0,
                'left': 0
            });
        } else {
            $main_nav.css({
                'position': '',
                'top': '',
                'left': ''
            });
        }

        // подсвечивания текущего раздела в меню навигации при пролистывании страницы
        $sections.each(function() {

            if($(this).offset().top<=$(window).scrollTop() && $(this).next('section').offset().top>$(window).scrollTop()) {

                var type = $(this).attr('data-name');

                $section_links.each(function() {

                    if($(this).attr('data-name') && $(this).attr('data-name') == type) {
                        $(this).addClass('active');
                    } else {
                        $(this).removeClass('active');
                    }
                });

            } else if ($(window).scrollTop() <= $nav_top) {
                $section_links.each(function() {
                    $(this).removeClass('active');
                });
                $('a[data-name="home"]').addClass('active');
            }
        });

    });

}); 


// isotope плагин ----------------------------------------------------------

$(function() {

    $('.works-previews').isotope({
      // options
      itemSelector: '.works-previews figure',
      layoutMode: 'fitRows'
    });
}); 


// Функционал галереи работ ----------------------------------------------------------

$(function() {

    var $img_containers = $('.works-previews figure');

    // масштабирование изображений при изменении размера окна
    $(window).resize(function() {

            $img_containers.each(function() {
            var $new_height = parseFloat($(this).css('width'))/1.325;
            $(this).css('height', $new_height);
        });
    });

    /* попытка написать :hover анимации средствами jQuery
    $img_containers.mouseenter(function() {

        var $overlay = $(this).find('.overlay');
        $overlay.animate({
            'width': '0%',
            'left': '50%'
        }, 200)
        .animate({
            'width': '40%',
            'left': '30%'
        }, 200)
        .animate({
            'transform': 'scale(2.5)'
        }, {queue:false, duration:400, easing:'easeInOutCubic'})
        .animate({
            'opacity': '0.6'
        }, {queue:false, duration:500});


        var $plus = $(this).find('span');
        $plus.animate({
            'width': '0px',
            'margin-left': '0px'
        }, 200)
        .animate({
            'width': '32px',
            'margin-left': '-16px'
        }, 200)
        .animate({
            'opacity': '1'
        }, {queue:false, duration:200})
    });


    // попытка написать снятие :hover анимации средствами jQuery
    $img_containers.mouseleave(function() {

        var $overlay = $(this).find('.overlay');
        $overlay.animate({
            'width': '0%',
            'left': '50%'
        }, 200)
        .animate({
            'width': '40%',
            'left': '30%'
        }, 200)
        .animate({
            'transform': 'scale(1)',
        }, {queue:false, duration:400, easing:'easeInOutCubic'})
        .animate({
            'opacity': '0'
        }, {queue:false, duration:600})
        

        var $plus = $(this).find('span');
        $plus.animate({
            'width': '0px',
            'margin-left': '0px'
        }, 200)
        .animate({
            'width': '32px',
            'margin-left': '-16px'
        }, 200)
        .animate({
            'opacity': '0'
        }, {queue:false, duration:200})
    });

    */


    // Фильтр контента галереи работ

    var $filter = $('.filter a');

    $filter.click(function() {

        var $type = $(this).attr('data-type');
        if($type=='all') {
            $('.works-previews').isotope({ filter: '*'});
        } else {
                $('.works-previews').isotope({ filter: function() {
                return ($(this).attr('data-type') == $type)
            } });
        }

        $filter.removeClass('active');
        $(this).addClass('active');
    });
}); 



// fancybox плагин -----------------------------------------------------------------------


$(document).ready(function() {

    $("a.group").fancybox({
        beforeShow : function() {
            var alt = this.element.find('img').attr('alt');
            
            this.inner.find('img').attr('alt', alt);
            
            this.title = '<h3>' + this.title + '</h3>' + '<p>' + alt + '</p>';
        },
        'minWidth'          :   245,
        'autoWidth'         :   true,
        'padding'           :   0,
        'margin'            :   20,
        'autoScale'         :   true,
        'transitionIn'      :   'none',
        'transitionOut'     :   'none',
        'speedIn'           :   0, 
        'speedOut'          :   0, 
        'overlayShow'       :   true,
        'overlayColor'      :   '#000',
        'centerOnScroll'    :   true, 
        'closeBtn'          :   true,
        'arrows'            :   true,
        'changeSpeed'       :   0,
        'hideOnOverlayClick':   true,
        helpers : {
                    title : { type: 'inside' },
                    media: {}
                }
    });
});

// "выключение всех <a> на странице" -----------------------------------------------------------------------

$(document).ready(function() {
    $('a[href="/"]').click(function(event){event.preventDefault();});
});


