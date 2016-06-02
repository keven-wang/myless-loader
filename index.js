var myless = new (require('myless'))({
    auto_close : true,
    max_wait_time: 3
});

function parseQuery(query){
    if(query.length <= 1) { return {}; }

    var data = query.slice(1).split('&');
    var map  = {'true': true, 'false': false};
    var result = {};

    data.forEach(function(i){
        var a = i.split('=');
        var p = a[0];
        var v = a[1];
        result[p] = (
             /^\d+$/.test(v) ? parseInt(v, 10)
           : map.hasOwnProperty(v) ? map[v]
           : v
        );
    });

    return result;
}

function merge(){
    var args = [].slice.call(arguments);
    var result = {};

    args.forEach(function(o){
        for(var p in o){
            result[p] = o[p]
        }
    }); 

    return result;
}

module.exports = function(source) {
    var done = this.async();
    var options = merge(
        {relativeUrls: true, ieCompat: false},
        parseQuery(this.query),
        {filename: this.resource, paths : [this.context]}
    );    
    
    myless.parse(source, options, function(parse_err, result) {
        if (parse_err) {
            console.log(parse_err);
            done(parse_err, null);
            return;
        }

        try {
            done(null, result.css);
        } catch (e) {
            callback(e, null);
        }
    });
};