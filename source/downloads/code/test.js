var httpProxy = require('http-proxy');

var options = {
  router: {
		  'minecraft.axion5.net': '127.0.0.1:9999',
		  'couchdb.axion5.net': '127.0.0.1:5984',
		  'apache.axion5.net': '127.0.0.1:8000',

		  'invoice.axion5.net': '127.0.0.1:8000',
		  'ticket.axion5.net': '127.0.0.1:8000',
		  'job.axion5.net': '127.0.0.1:8000',
		  'pavetheway.axion5.net': '127.0.0.1:8000',
		  'mamre.axion5.net': '127.0.0.1:8000',
		  'simone.axion5.net': '127.0.0.1:8000',
		  'btsync.axion5.net': '127.0.0.1:8888',

		  'www.firstdoor.com.au': '127.0.0.1:6001',
		  'firstdoor.com.au': '127.0.0.1:6001',
		  'firstdoor.axion5.net': '127.0.0.1:6001',
		  'test.firstdoor.com.au': '127.0.0.1:6001',

		  'seo.axion5.net': '127.0.0.1:7090',

		  'quilt.axion5.net':'127.0.0.1:5984', 
		  'quilt.axion5.com':'127.0.0.1:5984',
		  'roster.axion5.com':'127.0.0.1:5984',
		  'roster.axion5.net':'127.0.0.1:5984', 
		  'roster_help.axion5.net':'127.0.0.1:6006',
		  'roster_help.michieljoris.net':'127.0.0.1:6006',
		  'roster_help.axion5.com':'127.0.0.1:6006',

		  'www.greenglass-terrariums.com':'127.0.0.1:6002',
		  'greenglass.axion5.net':'127.0.0.1:6002',

		  'personalinfo.axion5.net':'127.0.0.1:6003',

		  'dbeditor.michieljoris.com':'127.0.0.1:6004',
		  'dbeditor.axion5.net':'127.0.0.1:6004',
		  'edge.michieljoris.com':'127.0.0.1:9876'
	  }
};
console.log('Started proxy server on port 8080');

var proxyServer = httpProxy.createServer(options);
proxyServer.proxy.on('end', function () {
  console.log("The request was proxied.");
});
proxyServer.listen(8080);

