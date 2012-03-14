window._gaq == null && (window._gaq = [])
_gaq.push(["_setAccount", "UA-6073342-1"])
_gaq.push(["_trackPageview"])
_gaq.push(["_trackPageLoadTime"])

s = document.createElement("script")
s.type = "text/javascript"
s.async = true
s.src = "" + ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + ".google-analytics.com/ga.js"
document.getElementsByTagName("head")[0].appendChild(s)

$(document).ready ->
  $('#boastful').boastful()
  $(".tweet").tweet({
    join_text: "auto",
    username: "anno",
    avatar_size: 32,
    count: 3,
    loading_text: "loading tweets..."
  })
  true