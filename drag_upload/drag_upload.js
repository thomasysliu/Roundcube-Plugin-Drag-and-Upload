/* Drag upload plugin script */

if (window.rcmail) {
  rcmail.addEventListener('init', function(evt) {
        $(document).ready(function() {
                var div = document.getElementById('compose-attachments');
                div.ondragenter = div.ondragover = function (e) {
                    e.preventDefault();
                    $('#compose-attachments').css("background-color", "#aaa");
                    e.dataTransfer.dropEffect = 'copy';
                    return false;
                }
       
                div.ondragleave = function (e) {
                    e.preventDefault();
                    $('#compose-attachments').css("background-color", "#fff");
                    e.dataTransfer.dropEffect = 'copy';
                    return false;
                }
       
                div.ondrop = upload;
                
   
       
       
       	function createInstance()
	{
		if (window.XMLHttpRequest)
		{
 			req = new XMLHttpRequest();
		} 
		else 
			alert("XHR not created");
		return(req);
	};


    function upload(event) {
        event.stopPropagation();
        event.preventDefault();
        var data = event.dataTransfer;
        var ts = new Date().getTime(),
      frame_name = 'rcmupload'+ts;



    //form.target = frame_name;
    var action = rcmail.url("upload", { _id:rcmail.env.compose_id||'', _uploadid:ts });
    //form.setAttribute('enctype', 'multipart/form-data');
    //form.submit();

        alert("GGG");
        event.preventDefault();
        /* Show spinner for each dropped file. */
        //for (var i = 0; i < data.files.length; i++) {
        //    $('#dropzone').append($('<img src="http://cloud.twbbs.org/file/html5/demo_code/my5/spinner.gif" width="16" height="16" />').css("padding", "48px"));
        //}
        
        var boundary = '------multipartformboundary' + (new Date).getTime();
        var dashdash = '--';
        var crlf     = '\r\n';

        /* Build RFC2388 string. */
        var builder = '';

        builder += dashdash;
        builder += boundary;
        builder += crlf;
	var xhr = createInstance();
			/* Generate token. */            
            builder += 'Content-Disposition: form-data; name="_token"';
            builder += crlf;
            builder += crlf; 
            builder += document.getElementsByName("_token")[0].value;
            builder += crlf;

            /* Write boundary. */
            builder += dashdash;
            builder += boundary;
            builder += crlf;
        
        for (var i = 0; i < data.files.length; i++) {
            var file = data.files[i];
	    document.getElementsByName("_attachments[]")[0].files[i]=file;
            /* Generate headers. */            
            builder += 'Content-Disposition: form-data; name="_attachments[]"';
            if (file.fileName) {
              builder += '; filename="' + file.fileName + '"';
            }
            builder += crlf;
            builder += 'Content-Type: application/octet-stream';
            builder += crlf;
            builder += crlf; 

            /* Append binary data. */
            builder += file.getAsBinary();
            builder += crlf;

            /* Write boundary. */
            builder += dashdash;
            builder += boundary;
            builder += crlf;
        }
        
        /* Mark end of the request. */
        builder += dashdash;
        builder += boundary;
        builder += dashdash;
        builder += crlf;
        xhr.open("POST", action, true);
        xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' + boundary);
        xhr.sendAsBinary(builder);        
        
        xhr.onload = function(event) { 
            /* If we got an error display it. */
            if (xhr.responseText) {
                //alert(xhr.responseText);
            }
                    var d, content = '';
        try {
            //d =xhr.responseText;
          content = xhr.responseText;
          //var scripts = content.getElementsByTagName( 'script' );

          alert(scripts[0]);
          
         
        } catch (err) {}

        if (!content.match(/add2attachment/) ) {
          if (!content.match(/display_message/))
            rcmail.display_message(rcmail.get_label('fileuploaderror'), 'error');
          rcmail.remove_from_attachment_list(e.data.ts);
        }

            
            
    if (document.all) {
      var html = '<iframe name="'+frame_name+'" src="program/blank.gif" style="width:0;height:0;visibility:hidden;"></iframe>';
      document.body.insertAdjacentHTML('BeforeEnd', html);
    }
    else { // for standards-compilant browsers
      var frame = document.createElement('iframe');
      frame.name = frame_name;
      frame.style.border = 'none';
      frame.style.width = 0;
      frame.style.height = 0;
      frame.style.visibility = 'hidden';
      document.body.appendChild(frame);
    }
    // handle upload errors, parsing iframe content in onload
 var doc = frame.document;
	if(frame.contentDocument)
		doc = frame.contentDocument; // For NS6
	else if(frame.contentWindow)
		doc = frame.contentWindow.document; // For IE5.5 and IE6
	// Put the content in the iframe
	doc.open();
	doc.writeln(content);
	doc.close();

            
            
        };
        //$(frame_name).bind('load', {ts:ts}, onload);
        
        
        var files=data.files;
              var content = rcmail.get_label('uploading' + (files > 1 ? 'many' : '')),
        ts = frame_name.replace(/^rcmupload/, '');

      if (rcmail.env.loadingicon)
        content = '<img src="'+rcmail.env.loadingicon+'" alt="" />'+content;
      if (rcmail.env.cancelicon)
        content = '<a title="'+rcmail.get_label('cancel')+'" onclick="return this.cancel_attachment_upload(\''+ts+'\', \''+frame_name+'\');" href="#cancelupload"><img src="'+rcmail.env.cancelicon+'" alt="" /></a>'+content;
      rcmail.add2attachment_list(ts, { name:'', html:content, complete:false });
        
        
        
        
        
        
        /* Prevent FireFox opening the dragged file. */
        event.stopPropagation();
        
    }

       
       
       
       
       
       
       
       
       
        });
  })
}

