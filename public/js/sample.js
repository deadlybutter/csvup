function parseRow(head, data) {
  var $tr = $('<tr></tr>');
  data.data[0].forEach(function(val, index) {
    if (head || index == 0) {
      $tr.append(`<th>${val}</th>`);
    }
    else {
      $tr.append(`<td>${val}</td>`);
    }
  })
  return $tr;
}

$(function(){
  $('.table-sample').each(function() {
    var rows = $(this).data('rows');
    var url = $(this).data('url');
    var $head = $('<thead></thead>');
    var $body = $('<tbody></tbody>');
    var index = 1;
    Papa.parse(url, {
    	download: true,
      worker: true,
    	step: function(row) {
        if (row.errors.length > 0) {
          return;
        }

        if (index == 1) {
          $head.append(parseRow(true, row));
        }
        else if (index > rows) {
          return;
        }
        else {
          $body.append(parseRow(false, row));
        }
        index++;
    	},
    	complete: function() {
    		$(this).append($head);
        $(this).append($body);
    	}.bind(this)
    });
  });
});
