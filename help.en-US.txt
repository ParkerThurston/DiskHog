 Usage: node diskhog [arguments]
-p, --path value, the relative or absolute path name of a file or directory. Default is -p .
 -s, --sort alpha | exten | size 
   alpha sorts alphabetically (ascending)
   exten sorts by extension alphabetically (ascending)
   size sorts by size (descending)
   Default is unsorted
   If two sort orders are given, the second one will be a secondary sort, e.g. -s exten size
-m, --metric, sizes displayed as KB, MB, GB, and TB.
-t, --threshold min, only displays files and folders of at least minimum size. min is the number of millions. Default is -t 0.
-lang, --language <2 letter language code-2 letter country code>. changes the help text and the number format when showing file sizes. 
   Defaults to environment variable LANG. If it doesn't exist, defaults to en-US
-h, --help prints this usage screen. Uses -lang, --language as described above.

All other parameters are ignored.
