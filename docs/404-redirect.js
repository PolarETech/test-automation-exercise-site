(function () {
  let redirect = sessionStorage.redirect
  delete sessionStorage.redirect
  if (redirect && redirect !== location.href) {
    if (redirect.match(/todo/) && document.cookie.match(/.*PtExampleToken=\{%22auth%22:\{%22token%22:%22\w+-\w+%22\}\}.*/) == null) {
      redirect = redirect.replace('/todo', '/login?redirect=%2Ftodo&message=true')
    }
    history.replaceState(null, null, redirect)
  }
})()
