Extract Key words and feed to API Calls on load.

Inject script in Nginx 
     sub_filter_once on;
        sub_filter '</head>' '<script src="https://xx.load.js"></script>
                             
                             </head>';
        sub_filter_types text/html;
