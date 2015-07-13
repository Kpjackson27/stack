'use strict';

var request = require('request');
var FeedParser = require('feedparser');
//Create a new 'render' controller method
// exports.render = function(req,res){
// 	res.render('discover', {
// 		title: 'Lyrical Intent | Discover',
// 	});
// };

exports.getDailyFeatured = function(req, res) {
    var poems = [];
    var feed = 'http://feeds.poetryfoundation.org/PoetryFoundation/PoemOfTheDayText?format=xml';
    var r = request(feed, {
        timeout: 10000,
        pool: false
    });
    r.setMaxListeners(50);
    var feedparser = new FeedParser();
    r.on('error', function(error) {
        // handle any request errors
        console.log('free error:' + error);
    });
    r.on('response', function(res) {
        console.log('response:' + this);
        if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
        res.pipe(feedparser);
    });
    feedparser.on('error', function(error) {
        console.log('feedparser error:' + error);
        return res.redirect('/api/feed');
    });
    feedparser.on('readable', function() {
        // console.log('readable:' + this);
        var meta = this.meta, item;
        while (item = this.read()) {
            // console.log(item);
            var poem = {
                title: item.title,
                description: item.description,
                author: item.author,
                //summary: item.summary,
                date: item.date
            };
            poems.push(poem);
        }
    });
    feedparser.on('end', function(error) {
        res.format({
            html: function() {
                res.render('pages/discover', {
                    title: 'Lyrical Intent | Discover',
                    "poems": poems
                });
            },
            json: function() {
                res.json(poems);
            }
        });
    });
};