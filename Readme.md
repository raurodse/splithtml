# Usage 
## HtmlSplitter.splitFromTo()
  Create a orig content copy from first orig node to needle.
  @param  {Node} orig   Dom node with content to split
  @param  {Node} dest   Destination to result. Usually will be Document Fragment 
  @param  {String} needle End selector.
	 
## HtmlSplitter.splitTo()
	
  Search common parent between two nodes from orig
  @param  {node} orig   Dom node with content to search
  @param  {String} firstidentifier First identifier to search parent
  @param  {String} lastidentifier  Second identifier to search parent
  @return {Node}                         Common parent
	 
## HtmlSplitter.searchCommonParent()
  Create a orig content copy from startid node orig node to endid node.
  If endid is same orig then this function return content from startid to end orig
  @param  {node} orig    Dom node with content to split
  @param  {Node} dest    Destination to result. Usually will be Document Fragment 
  @param  {string} startid Start node selector
  @param  {string} endid   End node selector
