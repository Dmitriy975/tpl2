/** Изначальный порядок блоков в галерее */
var blocksInitArray = [];

$(document).ready(function() {
    initMainSlider();
    initMobileMenu();
    /** Выполняем только если есть галерея */
    if ($("#mainGalery").has()) {
        blocksInitArray = $("#mainGalery .item");
        setupBlocks();
        $(window).resize(function() {
            setupBlocks();
            initGalleryAnimate();
        });
        initGalleryAnimate();
    }
    initAutoResizeTextArea();
    initAboutSliders();
});

/**
 * Инициализация слайдеров на странице о компании
 */
function initAboutSliders() {
    $('.oils_slick').slick({
        slidesToShow: 7,
        slidesToScroll: 1,
        prevArrow: $("#prevOilBtn"),
        nextArrow: $("#nextOilBtn"),
        variableWidth: true,
        centerMode: true
    });
    $('.reviewSlick').slick({
        slidesToShow: 2,
        slidesToScroll: 2,
        arrows: false,
        dots: true,
        appendDots: $('.reviewsDots'),
        dotsClass: 'reviewsDotsClass'
    });
}

/**
 * Авторесайз textarea. Нужен для хитрой верстки
 */
function initAutoResizeTextArea() {
    var textarea = document.querySelector('textarea.autoSize');
    if (textarea == null) {
        return;
    }
    textarea.addEventListener('keydown', autosize);                
    function autosize(){
        var el = this;
        setTimeout(function(){
            el.style.cssText = 'height:auto; padding:0';
            el.style.cssText = 'height:' + el.scrollHeight + 'px';
        },0);
    }
}

/** Инициализирует слайдер на главной */
function initMainSlider() {
    $('#mainSlider').slick({
        dots: true,
        infinite: false,
        speed: 500,
        arrows: false,
        autoplay: false,
        autoplaySpeed: 3000
    });
}

/**
 * Инициализирует мобильное меню. События открытия/ закрытия
 */
function initMobileMenu() {
    $(".i-menu").click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 400);
        var menu = $("header .menu");
        if (menu.hasClass("opened")) {
            menu.stop().animate({top:"-100%"}, 500);
            menu.removeClass("opened");
        } else {
            menu.stop().animate({top:0}, 500);
            menu.addClass("opened");
        }
    });

    $(".linkSubMobile").click(function () {
        var subMenu = $(this).parent().find(".subMenu");
        if ($(this).hasClass("opened")) {
            subMenu.slideToggle(500);
            $(this).removeClass("opened");
        } else {
            subMenu.slideToggle(500);
            $(this).addClass("opened");
        }
    });
}

/**
 * Инициализирует анимацию галереи
 */
function initGalleryAnimate() {
    var config = {
        rootEl: "#mainGalery",
        itemEl: ".item:not(.start,.end)",
        animateEl: "a",
        inAnimateEffect: "animate__flipInX",
        outAnimateEffect: "animate__zoomOut"
    };
    function handleAnimationEnd() {
        removeAllClasses(this);
        this.removeEventListener('animationend', handleAnimationEnd);
    }
    function removeAllClasses(el) {
        $(el).removeClass("animate__animated " + config.inAnimateEffect + " " + config.outAnimateEffect);
    }
    $(config.rootEl + " " + config.itemEl).on("mouseenter", function () {
        var animateEl = $(this).find(config.animateEl);
        removeAllClasses(animateEl);
        animateEl[0].removeEventListener('animationend', handleAnimationEnd);
        animateEl.addClass("animate__animated " + config.inAnimateEffect);
    });
    $(config.rootEl + " " + config.itemEl).on("mouseleave",function () {
        var animateEl = $(this).find(config.animateEl);
        removeAllClasses(animateEl);
        animateEl.addClass("animate__animated " + config.outAnimateEffect);
        animateEl[0].addEventListener('animationend', handleAnimationEnd);                
    })
}

/**
 * Ровняет последние блоки в галерее на главной
 * @param iter итерация
 */
function setupBlocks(iter) {
    if (!iter) {
        iter = 0;
        $("#mainGalery").html(blocksInitArray);
    }
    $("#mainGalery .item.end").outerHeight(100);
    var heightFull = $("#mainGalery").outerHeight() + 1;
    var blocks = $("#mainGalery .item");
    var last = $(blocks[blocks.length - 1]);
    var rHeightTmp = 0;
    var lHeightTmp = 0;
    /**
     * Получить высоту блока с учетом margin-bottom
     * @param index индекс блока
     */
    function getBlockHeight(index) {
        return $(blocks[index]).outerHeight() + 25;
    }
    // Подсчитываем высоту правого и левого блока
    for (var i = blocks.length - 1; i >= 0;  i--) {
        if (getBlockHeight(i) + rHeightTmp <= heightFull && lHeightTmp == 0) {
            rHeightTmp += getBlockHeight(i);
        } else {
            lHeightTmp += getBlockHeight(i);
        }
    }
    // Если правый больше левого, перемешиваем пока не будет на оборот, либо не зациклились (iter >= 20)
    if (rHeightTmp > lHeightTmp) {
        // var removeIndex = Math.floor(Math.random() * Math.floor(blocks.length - 2)) + 1;
        var removeIndex = 1;
        if (iter > 5 && blocks.length >= 3) {
            removeIndex = iter % 2 ? 2 : 1;
        }
        if (iter > 10 && blocks.length >= 4) {
            removeIndex = iter % 3 ? 3 : 2;
        }
        var removeBlock = blocks[removeIndex];
        $(removeBlock).remove();
        last.before(removeBlock);
        if (iter < 20) {
            setupBlocks(++iter);
        }
        return;
    }
    // fix для ie. Он считает по тупому... как всегда. Какой браузер, так и считает.
    var ieFix = lHeightTmp > heightFull ? 25 : 0;
    last.outerHeight(heightFull - (rHeightTmp - last.outerHeight()) - 1 + ieFix);
}