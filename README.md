nunjucks-databind-extension ( WIP )
===========================
This extension provides one-way binding ( view to model ) and event handling.

#####Future work
Event handling through delegation
Automatic event unbinding
Two-way binding


####Binding an input field
    <input type="text" {% input "id=productName value=product.name" %} />

####Binding a textarea
    {% textarea "id=productDesc, value=product.desc, cols=20, rows=5" %}

####Event Binding

    <button {% bind "click saveProduct" %} > Save </button>
    

###Check examples directory to see implementation.

Note:

Check "examples/js/app.js" on how to hook the extension to nunjucks environment.

Need to run in a web server.
