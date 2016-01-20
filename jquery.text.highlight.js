/**
 * jQuery.text.highlight.js
 *
 * Highlights text within HTML
 *
 * Copyright (c) 2016 Itay Grudev <itay[]grudev.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// ==ClosureCompiler==
// @output_file_name jquery.text.highlight.min.js
// @compilation_level ADVANCED_OPTIMIZATIONS
// ==/ClosureCompiler==
(function ( $, undefined ) {

  // The actual plugin constructor
  function Plugin( element, term, options ) {
    this.element = element;
    this.options = $['extend']( {}, {
      'element': 'mark',
      'class': '',
      'caseSensitive': false
    }, options);
    this.highlight( term );
  }

  Plugin.prototype.highlight = function ( term ) {
    if( term instanceof RegExp || typeof term == 'string' ) {
      // The term is a regular expression or a string
      this.processNode( term, this.element );
    } else if( typeof term == 'array' ||
               typeof term == 'object' && term.length ) {
      // The term is an array containing any of the two above
      for( var i = 0; i < term.length; ++i ) {
        this.processNode( term[i], this.element );
      }
    }
  }

  Plugin.prototype.processNode = function( term, node ) {
    if( node.nodeType == Node.TEXT_NODE ) {
      var pos = null, length;
      if( term instanceof RegExp ) {
        // If the ignoreCase of the RegEx has incorrect setting
        if( term.ignoreCase == this.options['caseSensitive'] ) {
          var flags = (this.options['caseSensitive'])? '' : 'i';
          flags = term['flags'].replace('i', '') + flags;
          term = new RegExp( term.source, flags );
        }
        var match = term.exec( node.data );
        if( match !== null ) {
          pos = match.index;
          length = match[0].length;
        }
      } else if( typeof term == 'string' ) {
        if( this.options['caseSensitive'] )
          pos = node.data.indexOf( term );
        else pos = node.data.toUpperCase().indexOf( term.toUpperCase() );
        length = term.length;
      }
      if( pos !== null && pos > 0 ) {
        var highlightedNode = document.createElement( this.options['element'] );
        highlightedNode.className = this.options['class'];
        $(highlightedNode)['attr']( 'data-text-highlight', '' );
        var beginingNode = node.splitText( pos );
        var endNode = beginingNode.splitText( length );
        var middleNode = beginingNode.cloneNode( true );
        highlightedNode.appendChild( middleNode );
        beginingNode.parentNode.replaceChild( highlightedNode, beginingNode );
        return 1;
      }
    } else if( node.nodeType == Node.ELEMENT_NODE && node.childNodes &&
               ! /(script|style)/i.test( node.tagName ) ){
      for( var i = 0; i < node.childNodes.length; ++i ) {
        i += this.processNode( term, node.childNodes[i] );
      }
    }

    return 0;
  }

  Plugin.prototype.remove = function () {
    $(this.element)['find']('[data-text-highlight]')['each']( function() {
      this.parentNode.replaceChild( this.firstChild, this );
    });
    this.element.normalize();
  }

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $['fn']['textHighlight'] = function ( term, options ) {
    return this['each'](function () {
      if ( ! $['data'](this, 'plugin_textHighlight') ) {
        $['data']( this, 'plugin_textHighlight', new Plugin( this, term, options ) );
      } else {
        $['data']( this, 'plugin_textHighlight' ).remove();
        $['removeData']( this, 'plugin_textHighlight' );
        $['data']( this, 'plugin_textHighlight', new Plugin( this, term, options ) );
      }
    });
  }

  // Remove highlight function that has access to the configuration from the
  // highlight initialization function
  $['fn']['removeHighlight'] = function ( options ) {
    return this['each'](function () {
      if ( ! $['data']( this, 'plugin_textHighlight' ) ) {
        return console.error('Cannot call removeHighlight on element that was not intialised from textHighlight.');
      }
      $['data']( this, 'plugin_textHighlight' ).remove();
      $['removeData']( this, 'plugin_textHighlight' );
    });
  }
})( jQuery );
