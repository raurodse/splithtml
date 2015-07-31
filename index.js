(function defineHtmlSplitter (global, factory) {
  if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
    factory(exports); // CommonJS
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], factory); // AMD
  } else {
    global.HtmlSplitter = {};
    factory(HtmlSplitter); // script, wsh, asp
  }
}(this, function htmlSplitterFactory (htmlsplitter){

	/**
	 * Create a orig content copy from first orig node to needle.
	 * @param  {Node} orig   Dom node with content to split
	 * @param  {Node} dest   Destination to result. Usually will be Document Fragment 
	 * @param  {String} needle End selector.
	 */
	function splitTo(orig,dest,needle){
		var index, node, tempcontainer;

		for(index=0; index < orig.childNodes.length ; index++){
			node = orig.childNodes[index];

			if(node.parentNode.querySelector && (node.parentNode.querySelector(needle) === node)){
				break;
			}

			if(node.querySelector){
				if(node.querySelector(needle)){
					tempcontainer = node.cloneNode();
					splitTo(node,tempcontainer,needle);
					dest.appendChild(tempcontainer);
					break;
				}
				else{
					dest.appendChild(node.cloneNode(true));
				}
			}
			else{
				dest.appendChild(node.cloneNode(true));
			}
		}
	}

	/**
	 * Search common parent between two nodes from orig
	 * @param  {node} orig   Dom node with content to search
	 * @param  {String} firstidentifier First identifier to search parent
	 * @param  {String} lastidentifier  Second identifier to search parent
	 * @return {Node}                         Common parent
	 */
	function searchCommonParent(orig,firstidentifier,lastidentifier){
		var commonparent, result, parentstartnode, parentendnode;
		var startnode = orig.querySelector(firstidentifier);
		var endnode = orig.querySelector(lastidentifier);

		if(endnode === null){
			if(orig.parentNode && orig.parentNode.querySelector){
				if(orig.parentNode.querySelector(lastidentifier) === orig){
					endnode = orig;
				}
			}
		}

		if(startnode === null){
			if(orig.parentNode && orig.parentNode.querySelector){
				if(orig.parentNode.querySelector(firstidentifier) === orig){
					startnode = orig;
				}
			}
		}

		result = startnode.compareDocumentPosition(endnode);
		if(result & Node.DOCUMENT_POSITION_CONTAINED_BY){
			// endnode is contained by startnode
			return startnode;

		}

		if( result & Node.DOCUMENT_POSITION_CONTAINS){
			// startnode is contained by endnode
			return endnode;
		}

		parentstartnode = startnode.parentNode;
		parentendnode = endnode.parentNode;
		while(parentstartnode !== null && parentendnode !== null){
			if(parentstartnode === parentendnode){
				// Are siblings
				commonparent = parentstartnode;
				break;
			}
			else{
				result = parentstartnode.compareDocumentPosition(parentendnode);
				if(result & Node.DOCUMENT_POSITION_CONTAINED_BY ){
				// parentstartnode is contained by parentendnode
					commonparent = parentstartnode;
					break;
				}

				if( result & Node.DOCUMENT_POSITION_CONTAINS){
					// startnode is contained by endnode
					commonparent = parentendnode;
					break;
				}
			}
			parentstartnode = parentstartnode.parentNode;
			parentendnode = parentendnode.parentNode;
		}
		return commonparent;
	}

	/**
	 * Create a orig content copy from startid node orig node to endid node.
	 * If endid is same orig then this function return content from startid to end orig
	 * @param  {node} orig    Dom node with content to split
	 * @param  {Node} dest    Destination to result. Usually will be Document Fragment 
	 * @param  {string} startid Start node selector
	 * @param  {string} endid   End node selector
	 */
	function splitFromTo(orig,dest,startid,endid){
		var commonparent , initialnode, node,
			container = null,
			endcase = false,
			found = false;

		// Same node
		if(startid === endid){
			dest.appendChild(orig.querySelector(startid).cloneNode(true))
			return;
		}
		// Not related nodes
		try{
			commonparent = searchCommonParent(orig,startid,endid);
			if(commonparent === orig){
				endcase = true;
			}
		}
		catch(err){
			return;
		}

		// Node contain the other node
		initialnode = orig.querySelector(startid);
		endnode = orig.querySelector(endid);
		if(initialnode === commonparent || endnode === commonparent){
			splitTo(commonparent,dest,endid);
			return;
		}

		node = initialnode;

		loopall:
		while(true){
			if(container === null){
				container = node.parentNode.cloneNode();
				container.appendChild(node.cloneNode(true));
			}
			else{
				var aux = container;
				container = node.parentNode.cloneNode();
				container.appendChild(aux);
			}

			loopsamelevel:
			while(node.nextSibling !== null){
				node = node.nextSibling;

				if(node.parentNode.querySelector && (node.parentNode.querySelector(endid) === node)){
					break loopall;
				}

				if(node.querySelector && node.querySelector(endid)){
						var aux = node.cloneNode();
						splitTo(node,aux,endid);
						container.appendChild(aux);
						break loopall;
				}
				container.appendChild(node.cloneNode(true));
			}
			node = node.parentNode;
			if(endcase){
				if(node.parentNode && node.parentNode.querySelector && (node.parentNode.querySelector(endid) === node)){
					break loopall;
				}
			}
		}
			
		for( i = 0; i < container.childNodes.length; i++){
			dest.appendChild(container.childNodes[i].cloneNode(true));
		}
	}

	htmlsplitter.splitFromTo = splitFromTo;
	htmlsplitter.splitTo = splitTo;
	htmlsplitter.searchCommonParent = searchCommonParent;
}
));
