// index.js
import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;


// Set EJS as the templating engine
// Express automatically looks for .ejs files in the views directory and helps with the generation of html
app.set('view engine', 'ejs');

// Middleware module that parses incoming request bodies and makes the data available 
// Use .urlencoded() to parse data that is URL-encoded (the format in which browsers typically send form data.)
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (for CSS, etc.)
// Allows browser to load assetts like CSS and JavaScript as long as they exist in a public directory 
//   without the need to write seperate routes. Express automatically handles the requests. 
app.use(express.static('public'));

// Temporary in-memory storage for blog posts
// While the server is running the posts variable will live in memory
// Posts will only exist as long as the server is running
let posts = [];

// (Home route) - Display all blog posts
// By using (app.get()) and defining the route to be '/', the user will arrive at the homepage of the blog from the root URL
  // follow with res.render as this function will access the index.ejs file for the html homepage. 
app.get('/', (req, res) => {
    res.render('index', { posts });
});

// New Post form route
// Change the route from the root URL to ('/new') to access the new post form 
app.get('/new', (req, res) => {
    res.render('new');
});

// Handle form submission for new post
// Use app.post to handle submitting or sending data and set the route back to be displayed on the homepage. 
app.post('/', (req, res) => {
    const newPost = {
        id: Date.now().toString(),
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        date: new Date().toLocaleString()
    };
    posts.push(newPost); // Add new post to the posts array
    res.redirect('/'); // Redirect to homepage to see the updated list
});

// Edit post form route - Show form to edit an existing post
// Change route to (edit) tro find exisiting posts within the blog
app.get('/edit/:id', (req, res) => {
    const post = posts.find(p => p.id === req.params.id); // Find post by ID
    if (post) {
        res.render('edit', { post });
    } else {
        res.status(404).send('Post not found');
    }
});

// Handle form submission for editing a post
// similar to create post but the route is now (edit)
app.post('/edit/:id', (req, res) => {
    const post = posts.find(p => p.id === req.params.id); // Find post by ID
    if (post) {
        // Update the post with new data from the form
        post.title = req.body.title;
        post.author = req.body.author;
        post.content = req.body.content;
        res.redirect('/'); // Redirect to homepage to see the updated post
    } else {
        res.status(404).send('Post not found');
    }
});

// Delete post route - Handle post deletion
app.get('/delete/:id', (req, res) => {
    posts = posts.filter(p => p.id !== req.params.id); // Remove post by ID
    res.redirect('/'); // Redirect to homepage to see the updated list
});

// Start the Express server on local port defined above.
app.listen(port, () => {
    console.log(`Server is running on local port ${port}.`);
});
