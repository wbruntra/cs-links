$(document).ready(function() {
  function handleSubmit(e) {
    const uriTest = /\w+:(\/?\/?)[^\s]+/
    const address = $('#address').val()

    if (address.trim() !== '' && uriTest.test(address)) {
      console.log('valid uri!')
    } else {
      console.log('not a valid uri. submit prevented')
      $('#error').text('Invalid link')
      e.preventDefault()
    }
  }

  const form = $('#form')
  form.submit(handleSubmit)
})
