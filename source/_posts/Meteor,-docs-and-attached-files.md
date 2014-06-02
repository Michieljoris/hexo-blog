title: 'Meteor, docs and attached files'
date: 2014-06-02 22:33:28
comments: true
tags: 
- server
- database
- Meteor
---

You can store files directly in MongoDB documents, however there is a limit of 16MB and the Meteor DDP protocol might not be up to the task (reference..)

There are two atmosphere packages that attempt to fill the gap:

* [CollectionFS](https://github.com/CollectionFS/Meteor-CollectionFS) 
* [fileCollection](https://github.com/vsivsi/meteor-file-collection/)

Both are extensively documentend, with the latter one being the lighter one.

They either use the MongoDB GridFS or store files externally on S3 or the server's file system. They both tie in with the MongoDB style of organising data, extending functionality of collections, by having special 'file' collections.

These 'file' documents can then be referenced from other documents. With these packages come API's and systems for security, manipulation, filtering, UI helpers etc.

My eyes drooped and my mind wandered every time I tried to read through the documentation for these packages. It seemed a bit overdone, at least for my purposes.

<!-- more -->

I have used CouchDB somewhat, and files are called attachments in that corner of the database world. The API is simple, just 'attach' them, and CouchDB takes care of storing them. Access rights are tied to the document they are attached to.

I tried to implement something similar for Meteor.

Instead of storing the files in MongoDB, they are stored on and read from the server's hard disk through a separate static file server. Files are attached by path and name to a document, as an array of file objects. Each object can contain as much meta data as you like, but at least the path and name.

To access a file from the file server an access key needs to accompany the request for the file. This access key is generated (and encrypted) server side by Meteor when the document is published that has the reference to the file. The access key contains two references, one to the currently logged in user's hashed log in token, and one to md5 hash of the contents of the file.

Because transform (reference..) doesn't work on the server side I am using added and friends to modify the relevant docs when published:

```` javascript  Draft of attaching access keys to files in Meteor.publish

Meteor.publish("products", function (options) {
    var sub = this; 
    var userId = this.userId;
    var user = Meteor.users.findOne({_id: userId});
    var handle = Products.find({}).observeChanges({
        added: function(id, product) {
            var hashedToken = '';
            try {
                hashedToken = user.services.resume.loginTokens[0].hashedToken;
            } catch(e) { }
            if (user && hashedToken && product.files) {
                product.files = product.files.map(function(f) {
                    var loginToken = hashedToken;
                    var encrypted = encrypt(JSON.stringify({l:loginToken,f:f.md5}), pwd);
                    return _.extend(f, { key  : encrypted.encrypted });
                });
            }
            sub.added('products', id, product);
        },
        changed: function(id, fields) {
            sub.changed('products', id, fields);
        },
        removed: function(id) {
            // stop observing changes on the post's comments
            // commentHandles[id] && commentHandles[id].stop();
            // delete the post
            sub.removed('products', id);
        }
    });
    sub.ready();
    sub.onStop(function() { handle.stop(); });
});

````

Because the access key gets added to the docs at publication time, and includes the currently logged in user's login token (or hashed version then), every user and every session will get different access keys for the same files. Two different users will have two different access keys, and when a user logs out and in again, the access keys will different as well, since their login token has changed.

You need to be logged in to create any access key at all, and you need access to the document before you get the access key for any attached document. And since the access keys are generated server side, and encrypted with a secret password, no user is able to generate any access key on their own, even when they know their own loginToken (they do) and they know the md5 (which they might) of the file they want.

However the static file server does know the password (shared with meteor) to decrypt the access key to its components. With it they can check whether the login token is valid (by accessing Meteor's MongoDB instance), in other words whether the user that received the access key with an document they were allowed to access is actually logged in. The file server can also check whether the file requested (in the path of the request) is actually the file that was attached to the document in the first place using the decrypted md5 in the access key:

```` javascript Draft of server side authorizing of request

module.exports = function(req) {
    if (req.url.pathname.indexOf('/public') === 0) return VOW.kept(); 
    var vow = VOW.make();
    
    var query = req.url.search;
    var decrypted = decrypt(query.slice(1), pwd);
    var data;
    if (decrypted.error) 
        vow.break({ forbidden: true, srcPath: req.url.pathname });
    else {
        try {
            data = JSON.parse(decrypted.decrypted);
        } catch(e) {
            vow.break({ forbidden: true, srcPath: req.url.pathname });
        }
        var hashedToken = data.l;
        retrieveUser(hashedToken).when(
            function(user) {
                console.log("file retrieval of " + req.url.pathname  + ' by ' , user.emails);
                vow.keep();
                
            },
            function(err) {
                console.log(err);
                vow.break({ forbidden: true, srcPath: req.url.pathname });
            }
        );
    }
    return vow.promise;
  
};
````
Requests come in the form of:

`http://files.server.com/path/to/somefile?KJSDFS93450FJDKSFJKDJFLSFS8908` 

With the part after the question mark being the access key.

When a user uploads a file, the md5 of the file can be calculated client side (by a library such as [SparkMD5](https://github.com/satazor/SparkMD5) for instance), and saved with the document. You could then forbid updating the md5 of any attachments server side perhaps, or attach them server side when the documents gets saved.

Users could reuse an access key for a different path on the file server, in the same session (with the same login token) only if the file on that different path has the same md5 checksum, in other words, it's the same file.

Additional access rights to documents and thus to files can be granted to users within the same session, however when you take away access rights the documents will be 'denied', but the files will still be accessible. However when the logged in user logs out and then in again (new loginToken) the files will be disallowed as well. You could perhaps force to log everybody out `Meteor.logoutOtherClients`, or somehow issue everybody with new login tokens. 

Another caveat is that once a user copies or retrieves the url to a file, this url will work in any browser, on any computer as long as the user is logged in. It might be possible to work around this by setting a cookie (to the loginToken for example) in the tab and browser where the user is logged into the app. The file server can check whether the loginToken in the decrypted access key is the same as the cookie received with the request.

The system is rather simple, and only needs a slight modification to an otherwise open static file server (I used my own [bb-server](http://github.com/Michieljoris/bb-server)), and a small adaption of publish functions for documents that can refer to files. You also have to write the user interface part of listing, uploading, deleting, retrieving of file attachments.

For my own and future reference here is the code for uploading files:
```` html Custom styleable upload link
  <input type="file" id="fileElem" multiple accept="*" style="display:none" onchange="handleFiles(this.files)">
  <a href="#" id="fileSelect">Select files</a>
````  

```` javascript Use HTML5 filereader to read and ajax post the file
function saveFile(fileName, data) {
    if (!fileName) {
        console.log('no filename, so not saving', data);
    }
    console.log('Saving file ' + fileName);
    HTTP.call('POST', FILEHOST + '/?path=' + fileName, {
        content: data
    }, function(error, result) {
        console.log('error: ', error, '\nresult: ', result);
	if (error) {
            console.log('Failed to save on the server ', data.error);
            alert('Warning: this file did not save to the server!!');
	}
	else console.log("Success. Data saved to:", fileName);
    });
} 

handleFiles = function handleFiles(files) {
    // console.log(files);
    var fileList = files; /* now you can work with the file list */
    var reader = new FileReader();
    reader.onload = function(data) {
        //post to bb-server 
	//TODO calculate MD5 of every file
	//TODO add multiple file upload support
        saveFile(fileList[0].name, reader.result);
    };
    // console.log(fileList[0]);
    reader.readAsText(fileList[0]);
};
````
