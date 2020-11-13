export function isOrContainsNode(parent: Node, child: Node) {
  return parent === child || (parent.contains && parent.contains(child));
}
