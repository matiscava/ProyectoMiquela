export default function getSiblings(e) {
  // for collecting siblings
  let siblings = []; 
  // if no parent, return no sibling
  if(!e.parentNode.parentNode) {
      return siblings;
  }
  // first child of the parent node
  let sibling  = e.parentNode.parentNode.firstChild;
  // collecting siblings
  while (sibling) {
      if (sibling.nodeType === 1 && sibling !== e && sibling.firstElementChild !== null) {
          siblings.push(sibling.firstElementChild);
      }
      sibling = sibling.nextSibling;
  }
  return siblings;
};