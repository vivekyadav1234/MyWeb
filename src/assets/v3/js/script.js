$(document).ready(function () {
    //Disable full page
    $("body").on("contextmenu",function(e){
        return false;
    });
    
    //Disable part of page
    // $("#id").on("contextmenu",function(e){
    //     return false;
    // });

});


// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

    var btn = document.getElementById('myBtn');

    btn.addEventListener("click", function() {
      var i = 600;
      var int = setInterval(function() {
        window.scrollTo(0, i);
        i -= 10;
        if (i <=0) clearInterval(int);
      }, 1);
    })

$('#in').focus(function() {
    $(this).attr('placeholder', 'Search By Id')
}).blur(function() {
    $(this).attr('placeholder', '');
});
