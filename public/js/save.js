function uploadDataSet(signedRequest, cb) {
  $.ajax({
    type: 'PUT',
    url: signedRequest,
    data: $('input[aria-describedby="data"]')[0].files[0],
    processData: false,
    contentType: false,
    success: cb
  });
}

function submitDataSet(data) {
  if (!data.aws || !data.data) {
    //TODO: Handle error
    return;
  }

  // TODO: Tell user the file is uploading
  uploadDataSet(data.aws.signedRequest, function(data) {
    console.log('yay', data);
    //redirect them to the view for this data set
  });
}

$(function(){
   $('#upload-form').on('submit', function(e) {
     e.preventDefault();

     var data = {
       'title': $('input[aria-describedby="title"]').val(),
       'description': $('input[aria-describedby="description"]').val(),
       'categories': $('input[aria-describedby="categories"]').val(),
       'dataSource': $('input[aria-describedby="source"]').val()
     }

     $.ajax({
       type: 'POST',
       url: '/api/v1/upload',
       data: JSON.stringify(data),
       success: submitDataSet,
       dataType: 'json',
       contentType: 'application/json; charset=utf-8',
       headers: {
         'Authorization': AUTHORIZATION
       }
      //  TODO: Handle error
     });
   });
});
