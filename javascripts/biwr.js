(function() {

  $(document).ready(function() {
    $('#boastful').boastful();
    $(".tweet").tweet({
      join_text: "auto",
      username: "anno",
      avatar_size: 32,
      count: 3,
      loading_text: "loading tweets..."
    });
    return true;
  });

}).call(this);
