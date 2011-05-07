/* Drag upload plugin script */

if (window.rcmail) {
	rcmail.addEventListener('init', function(evt) {
			$(document).ready(function() {
				var drag_attach = document.getElementById('compose-attachments');
				drag_attach.ondragenter = drag_attach.ondragover = function (e) {
				e.preventDefault();
				$('#compose-attachments').css("background-color", "#FFFFA6");
				e.dataTransfer.dropEffect = 'copy';
				return false;
				}

				drag_attach.ondragleave = function (e) {
				e.preventDefault();
				$('#compose-attachments').css("background-color", "#fff");
				e.dataTransfer.dropEffect = 'copy';
				return false;
				}

				drag_attach.ondrop = upload;

				function createInstance()
				{
				if (window.XMLHttpRequest)
				{
					req = new XMLHttpRequest();
				}
				else
					rcmail.display_message(rcmail.get_label('fileuploaderror'), 'error');
				return(req);
				};

			function upload(event) {
				event.stopPropagation();
				event.preventDefault();
				$('#compose-attachments').css("background-color", "#fff");
				var data = event.dataTransfer;

				for (var i = 0; i < data.files.length; i++) {

					/* Append binary data. */
					if(!bw.chrome){


						var ts = new Date().getTime(),
						    frame_name = 'rcmupload'+ts;

						var action = rcmail.url("upload", { _id:rcmail.env.compose_id||'', _uploadid:ts });

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
						builder += file.getAsBinary();
						builder += crlf;

						/* Write boundary. */
						builder += dashdash;
						builder += boundary;
						builder += crlf;

						/* Mark end of the request. */
						builder += dashdash;
						builder += boundary;
						builder += dashdash;
						builder += crlf;
						xhr.open("POST", action, true);
						xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' + boundary);

						xhr.onload = upload_finish;
						xhr.sendAsBinary(builder);



						var files=data.files;
						var content = rcmail.get_label('uploading' + (files > 1 ? 'many' : '')),
						    ts = frame_name.replace(/^rcmupload/, '');

						if (rcmail.env.loadingicon)
							content = '<img src="'+rcmail.env.loadingicon+'" alt="" />'+content;
						if (rcmail.env.cancelicon)
							content = '<a title="'+rcmail.get_label('cancel')+'" onclick="return this.cancel_attachment_upload(\''+ts+'\', \''+frame_name+'\');" href="#cancelupload"><img src="'+rcmail.env.cancelicon+'" alt="" /></a>'+content;
						rcmail.add2attachment_list(ts, { name:'', html:content, complete:false });




					}else{
						//builder += file.readAsBinary();
						var reader = new FileReader();
						reader.data = data;
						reader.file = data.files[i];
						var file = data.files[i];
						reader.onload = function(e) {

							var ts = new Date().getTime(),
							    frame_name = 'rcmupload'+ts;

							var action = rcmail.url("upload", { _id:rcmail.env.compose_id||'', _uploadid:ts });

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


							var file = this.file;
							//document.getElementsByName("_attachments[]")[0].files[i]=file;
							/* Generate headers. */
							builder += 'Content-Disposition: form-data; name="_attachments[]"';
							//this.controller.files[0]
							if (file.fileName) {
								builder += '; filename="' + file.fileName + '"';
							}
							builder += crlf;
							builder += 'Content-Type: application/octet-stream';
							builder += crlf;
							builder += crlf;
							builder += e.target.result;
							builder += crlf;

							/* Write boundary. */
							builder += dashdash;
							builder += boundary;
							builder += crlf;

							/* Mark end of the request. */
							builder += dashdash;
							builder += boundary;
							builder += dashdash;
							builder += crlf;
							xhr.open("POST", action, true);
							xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' + boundary);

							xhr.onload = upload_finish;
							xhr.send(builder);



							var files=data.files;
							var content = rcmail.get_label('uploading' + (files > 1 ? 'many' : '')),
							    ts = frame_name.replace(/^rcmupload/, '');

							if (rcmail.env.loadingicon)
								content = '<img src="'+rcmail.env.loadingicon+'" alt="" />'+content;
							if (rcmail.env.cancelicon)
								content = '<a title="'+rcmail.get_label('cancel')+'" onclick="return this.cancel_attachment_upload(\''+ts+'\', \''+frame_name+'\');" href="#cancelupload"><img src="'+rcmail.env.cancelicon+'" alt="" /></a>'+content;
							rcmail.add2attachment_list(ts, { name:'', html:content, complete:false });




						}

						reader.readAsBinaryString(file);
					}

				}

				function upload_finish(event) {
					var d, content = '';
					try {
						content = this.responseText;

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

					} catch (err) {}

				};


				/* Prevent FireFox opening the dragged file. */
				event.stopPropagation();

			}

			});
	})
}

