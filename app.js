var model = {
    currentEntry: null,
    entries: []
};

/*
    google.load("feeds", "1");

    function initialize() {
      var feed = new google.feeds.Feed("http://fastpshb.appspot.com/feed/1/fastpshb");
      feed.load(function(result) {
        console.log(result)
        if (!result.error) {
          var container = document.getElementById("feed");
          for (var i = 0; i < result.feed.entries.length; i++) {
            var entry = result.feed.entries[i];
            var div = document.createElement("div");
            div.appendChild(document.createTextNode(entry.title));
            container.appendChild(div);
          }
        }
      });
    }
    google.setOnLoadCallback(initialize);
*/

var controller = {

    init: function() {
    	google.load("feeds", "1");

    	function initialize() {
	      var feed = new google.feeds.Feed("http://fastpshb.appspot.com/feed/1/fastpshb");
	      feed.load(function(result) {
			model.entries = result.feed.entries;
	        
	        // set our current entry to the first one in the list
	        model.currentEntry = model.entries[0];

	        // tell our views to initialize
	        entryListView.init();
	        entryView.init();	        
	      });
	    }

    	google.setOnLoadCallback(initialize);
    },

    getCurrentEntry: function() {
        return model.currentEntry;
    },

    getEntries: function() {
        return model.entries;
    },

    setCurrentEntry: function(entry) {
        model.currentEntry = entry;
    }
};

var entryView = {

    init: function() {
        // store pointers to our DOM elements for easy access later
        this.entryElem = document.getElementById('entry');
        this.entryTitleElem = document.getElementById('entry-title');
        this.entryAuthorElem = document.getElementById('entry-author');
        this.entryPublishedDateElem = document.getElementById('entry-published-date');
        this.entryContentSnippetElem = document.getElementById('entry-content-snippet');
        this.entryContentElem = document.getElementById('entry-content');
        this.entryCategoriesElem = document.getElementById('entry-categories');

        // render this view (update the DOM elements with the right values)
        this.render();
    },

    render: function() {
        // update the DOM elements with values from the current entry
        var currentEntry = controller.getCurrentEntry();
        this.entryTitleElem.innerHTML = '<a href="' + currentEntry.link + '">' + currentEntry.title + '</a>';
        this.entryAuthorElem.textContent = currentEntry.author;
        this.entryPublishedDateElem.textContent = currentEntry.publishedDate;
        // this.entryContentSnippetElem.textContent = 'Content Snippet: ' + currentEntry.contentSnippet;
        this.entryContentElem.textContent = 'Content: ' + currentEntry.content;
        this.entryCategoriesElem.textContent = 'Categories: ' + currentEntry.categories;
    }
};

var entryListView = {

    init: function() {
        // store the DOM element for easy access later
        this.entryListElem = document.getElementById('entry-list');

        // render this view (update the DOM elements with the right values)
        this.render();
    },

    render: function() {
        var entry, elem, i;
        var entries = controller.getEntries();

        this.entryListElem.innerHTML = '';

        // loop over the entries
        for (i = 0; i < entries.length; i++) {
            entry = entries[i];

            // make a new entry list item and set its text
            elem = document.createElement('li');
            elem.textContent = entry.title;

            // on click, setCurrentEntry and render the entryView
            // (using IIFEs so closure applies to correct entry for each list element)
            elem.addEventListener('click', (function(entryCopy) {
                return function() {
                    controller.setCurrentEntry(entryCopy);
                    entryView.render();
                };
            })(entry));

            // finally, add the element to the list
            this.entryListElem.appendChild(elem);
        }
    }
};

// make it go!
controller.init();