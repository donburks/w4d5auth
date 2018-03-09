$(function() {
  $("#clickMe").on('click', function() {
    $.post("/click", function(result) {
      if (result.success) {
        $("#counter").text(Number($("#counter").text())+1);
      } else {
        alert("WTF!");
      }
    }, 'json');
  });
});
