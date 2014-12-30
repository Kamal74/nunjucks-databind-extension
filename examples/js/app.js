'use strict';

// Demo object to be used as model
var models = {
    product: {
        name: 'I phone 6 plus',
        desc: 'Latest from apple'
    }
};

var ebinds = [];

var context = window;

// Initialise nunjucks environment
var envZS = nunjucks.configure('./templates', {
    autoescape: true
});

console.log(envZS);

// Add extension to the environment
envZS.addExtension('DataBind', new DataBindExt( models, ebinds ));

var template = envZS.getTemplate( 'demo-tmpl.html' );

// Render template
template.render(models, function(error, result) {
    document.getElementById( 'cont' ).innerHTML = result;

    // After the DOM is generated, 
    // now bind the listeners that was specified in the template "demo-tpl.html"
    // Syntax for binding is : {% bind "click saveProduct" %}
    for (var i = ebinds.length - 1; i >= 0; i--) {
        document.getElementById( ebinds[i].id ).addEventListener('click', context[ ebinds[i].fn ]);

    };

    // Remove after bindings done.
    // Or store keep the reference to unbind when another template is rendered.
    ebinds = []; 
});




// Example function to be called on click event
// Model will be updated
// In this function, simply get the model and save to DB.
function saveProduct() {
    console.log('Saving....');
    console.log('Updated Product name: ' + models.product.name);
    console.log('Updated Product desc: ' + models.product.desc);
}
