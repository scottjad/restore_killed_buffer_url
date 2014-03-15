// I think by the time kill_buffer_hook runs the buffer is gone so I
// patch kill_buffer

var kill_buffer_original = kill_buffer_original || kill_buffer;

var killed_buffer_urls = [];

kill_buffer = function (buffer, force) {
    if (buffer.display_uri_string) {
        killed_buffer_urls.push(buffer.display_uri_string);
    }

    kill_buffer_original(buffer,force);
};

interactive("restore-killed-buffer-url", "Loads url from a previously killed buffer",
            function restore_killed_buffer_url (I) {
                if (killed_buffer_urls.length !== 0) {                
                    var url = yield I.minibuffer.read(
                        $prompt = "Restore killed buffer url:",
                        $completer = new all_word_completer($completions = killed_buffer_urls, $match_required = true // $require_match
                                                           ),
                        $default_completion = killed_buffer_urls[killed_buffer_urls.length - 1],
                        $auto_complete = "url",
                        $auto_complete_initial = true,
                        $auto_complete_delay = 0,
                        $match_required = true
                        // $require_match // refactor-completers
                    );
                    
                    load_url_in_new_buffer(url);
                } else {
                    I.window.minibuffer.message("No killed buffer urls");
                }
            });
