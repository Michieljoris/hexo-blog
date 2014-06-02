title: Projects
date: 2014-06-03 01:18:51
comments: false

---



<br/>
###[bb-server](http://github.com/Michieljoris/bb-server)

Starting out as cobbled together one page node server, it grew over the past year to a more featured server. Totally rewritten and refactored a couple of times, it now can function as a https server, and a socket server as well. Customized logging, caching in memory and disk, and on the fly transpiling, minifying and compressing of assets and more have turned it into a more production ready server. 

At the same time it still starts up with a single word command, all the features are then disabled by default. A lot of features can still be enabled on that same command line, but for an easier and more complete configuration a config file can be used. No plugin system, since it is easier to just write it into the server than designing one, except for the transpilers, compressors etc, more can easily be added by using little api.

Mostly a learning experience for me, however I do use it for some of my sites. 

<br/>


###[html-builder](https://github.com/Michieljoris/html-builder)

A simple html build system using templates of sort. Using [flatiron plates](https://github.com/flatiron/plates) to fish out markers from the html soup and a javascript object to knit it all together again. But again, because I wrote it myself I can adapt it easily to whatever I need it to be, and you learn a lot while writing and adapting it. [dbeditor](https://github.com/Michieljoris/dbeditor)

Dbeditor allows you to connect to your dropbox, browse the contents and then edit text files using a markdown or wysiwyg editor.

<br/>

###[cachejs](https://github.com/Michieljoris/cachejs)

Implementation of both LRU and ARC cache. Used in bb-server. It includes a heavily commented arc_cache.js file. The Adaptive Replacement Cache algorithm is supposed be efficient. I think I understand how it works, but whether I could have written it I don't know. It seems clever. 
<br/>

###[quilt](https://github.com/Michieljoris/quilt)

A word play on futon, the database manager that comes with CouchDB. I thought it was not as useful as it could be, so I wrote my own version. It allows you to edit the various design docs in the manager. It also simplifies editing and enabling replications, and a number of other enhancements. As usual I start out with big plans for an app, and implement the bulk of it, but there definitly still things that could be worked on and expanded on. 

The other half of this app is a wizard to make it very easy for people to install and cors enable a CouchDB database for use with an other web app, roster. It then initializes the database depending on who they are and what their preferences are, setting up the right replications and permissions.

<br/>

###[validate_doc_update](https://github.com/Michieljoris/validate_doc_update)

Used for the roster web app to easily manage read -and- write permissions. I didn't want to write a different validate_doc_update document for every use case, so I made a generic one that can be controlled via a little dsl, embedded in the read permissions. See the github repo for more info. 
<br/>

###[roster](https://github.com/Michieljoris/roster)

I've been doing shift work to make ends meet for a number of years. I got tired of filling in time sheets, I never seemed to do that without at least one mistake or correction, so I made a little Excel worksheet for my own use. This time sheet was picked up by other staff and management and it had to be adapted to other work places. In the end Excel worksheet just got to complicated so I made this web app. 

It is built using [Smartclient](https://smartclient.com/) for the interface and is served by CouchDB where the data is stored as a couchapp. At the moment it sits on a Linode server. Users are authenticated and can be assigned roles. The user database is synced between databases. I wrote a long spiel about the security aspects of the app [here](http://roster_help.axion5.net/).

The app can be run offline because it uses application cache. The app itself can be synced to a local database, and so can the data the app runs against. The app can also be run against an in-browser database using an implemention of a browser version of CouchDB: [pouchdb](http://pouchdb.com/). 

I tried to keep the UI as simple as possible, no menus, only 5 little buttons. The user can build up their own UI to some extent by dragging and dropping, this gets persisted accross sessions, and even accross databases. 

The thing is designed really to be backend agnostic and extendable by plugin views, even plugin types. But at the moment it works against CouchDB and has only the following types (and their editors): shift, location, person, settings, user and the following views of data: table, calendar and time sheet. The design of the app is such that it is quite easy to add more views of the data, like a graph for instance. 

From the repo's README:

{% blockquote %}
To help people set up a CouchDB instance I wrote quilt, it configures and sets up all the necessary replications for them. It is also a generic CouchDB manager a la futon.

The idea is to have a decentralized but hierarchical group of CouchDB instances against which the app can work, see my blurb on security.

In the end staff can view their upcoming shifts online, bosses can manipulate them, and management can have an overview and collate all the data easily.

SmartClient is a bit cumbersome and it would be nice to rewrite the app using no
frameworks. Especially the calendar gets a bit sluggish.
{% endblockquote %}

The app itself is used by a few people at the organisation I wrote it for. I had
a meeting/presentation with management, but things can move a bit slow at these
organizations. Or maybe I am just not the best salesman..

<br/>

###[bootstrapjs](https://github.com/Michieljoris/bootstrapjs)

To keep the roster app modular I wrote my version of requirejs. Not AMD compatible, but same idea and functionality. See the repo for more info. I had ideas of having it concatenate all the files in the right order for production use. However browserify and the use of transpiled languages (clojure!) make it all this a bit obsolete. Let alone that javascript itself will have modules in es6 it seems. But it was fun to write, basically doing a depth first search to resolve the dependencies, with detection of cyclic dependencies.

<br/>
More on [github](http://github.com/Michieljoris)

