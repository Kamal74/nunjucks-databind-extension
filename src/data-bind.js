// Data bind extension starts here
function DataBindExt(models, ebinds, context) {
    'use strict';
        this.tags = ['input', 'textarea', 'bind'];
        var dbinds = {};

        function eventDelegate(e) {
            var target    = e.target,
                dbindArr  = dbinds[ e.target.id ].prop.split('.'),
                dbindLen  = dbindArr.length,
                fieldVal  = null,
                modelTmp  = null;
            models || ( models = {} );
            modelTmp = models;
            dbindArr.forEach(function (val, index) {  
                if (!(modelTmp[ val ] && Object.prototype.toString.call(modelTmp[ val ]) === '[object Object]')) {
                    if (index !== dbindLen - 1) {
                        modelTmp[ val ] = {}; // Create a new obj here

                    } else {
                        // This is a property, set the value
                        (target.type === 'checkbox') ? (fieldVal = target.checked) : (fieldVal = target.value);
                        if (typeof fieldVal === 'string') {
                            fieldVal = fieldVal.trim();
                        }
                        
                        modelTmp[ val ] = fieldVal; // Set the value of the property
                    
                    }
                }
                modelTmp = modelTmp[ val ];
            });

        }

        // Delegate change events
        document.addEventListener('change', eventDelegate);

        this.parse = function(parser, nodes, lexer) {
            var tok = parser.nextToken(),
                args = parser.parseSignature(null, true),
                body = parser.advanceAfterBlockEnd(tok); // body var not necessary here.
            var fn = {
                'input': 'bindInput',
                'textarea': 'bindTextarea',
                'bind': 'bindEvents'
            }[ tok.value ];
            return new nodes.CallExtension(this, fn, args, [ body ]);
        
        };

        this.bindInput = function(context, args, body, errorBody) {
            var id            = /id=(\w*)/.exec( args )[1],
                objProp       = /value=([\w+\.]*)/.exec( args )[1],
                objPropArr    = objProp.split( '.' ),
                objPropArrLen = objPropArr.length,
                modelTmp      = context.ctx;

            objPropArr.forEach(function (val, index) {  
                modelTmp = modelTmp[ val ];
            });

            dbinds[ id ] = {
                ele: '#' + id,
                prop: objProp
            };
            return new nunjucks.runtime.SafeString('id="' + id + '" value="' + modelTmp + '"');;

        };

        this.bindTextarea = function(context, args, body, errorBody) {
            var id = /id=(\w*)/.exec(args)[1],
                objProp = /value=(\w*\.\w*)/.exec(args)[1],
                cols = /cols=(\w*)/.exec(args)[1],
                rows = /rows=(\w*)/.exec(args)[1],
                val = objProp.split('.'),
                ret = new nunjucks.runtime.SafeString( '<textarea id="' + id + '" cols="' + cols + '" rows="' + rows + '">' + models[ val[0] ][ val[1] ] + '</textarea>' );

            dbinds[id] = {
                ele  : '#' + id,
                prop : objProp
            };
            return ret;
        };

        this.bindEvents = function(context, args, body, errorBody) {
            var x = args.split(' '),
                id = x[1] + Math.floor(Math.random() * 1000),
                ret = new nunjucks.runtime.SafeString('id="' + id + '"');
            ebinds.push({
                'event': x[0],
                'fn'   : x[1],
                'id'   : id
            });

            return ret;
        }
    }
    // Data bind extension ends here
