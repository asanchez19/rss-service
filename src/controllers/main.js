var request = require('request');
var FeedParser = require('feedparser');
/*
* En caso de utilizar algún ORM importar modelos aqui
*/

const main = async (req, res) => {
  try {
    return res.status(200).json({ response: 'Endpoint de prueba' })
  } catch (e) {
    error(e)
    return res.status(500).send('Error on demo controller')
  }
}
const rssReader = async (req, res, next) => {
  var result = [];
  var req = request(req.query.rss)
  let options = {}
  var feedparser = new FeedParser([options]);

  req.on('error', function (error) {
    // handle any request errors
  });

  req.on('response', function (res) {
    var stream = this; // `this` is `req`, which is a stream

    if (res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
    }
    else {
      stream.pipe(feedparser);

    }
  });

  feedparser.on('error', function (error) {
    // always handle errors
  });
  feedparser.on('end', function () {
    res.status(200).send({ result });
    // always handle errors
  });
  //res.status(200).send({ data: result })
  feedparser.on('readable', function () {
    // This is where the action is!
    var stream = this; // `this` is `feedparser`, which is a stream
    var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
    var item;
    while (item = stream.read()) {
      //console.log(item.title)
      result.push({
        title: item.title,
        description: item.description,
        image: item.image,
        link: item.link,
        date: item.date
      })


    }





  });

}

module.exports = { main, rssReader }
