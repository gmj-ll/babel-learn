const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);

module.exports = function({types, template}) {
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.isNew || path.parent.isNew) {
          return;
        }
        const calleeName = path.get('callee').toString()
        const argument = path.get('argument').toString()
        if (targetCalleeName.includes(calleeName))  {
          const { line, column } = path.node.loc.start;
          const ifJSX = path.findParent(path => path.isJSXElement())
          const newNode = ifJSX ? types.jSXExpressionContainer(template.expression(`console.log("filename: (${line}, ${column})")`)()) : template.statement(`console.log("filename: (${line}, ${column})")`)();
          newNode.isNew = true;
          if (ifJSX) {
            path.find(p => p.type === 'JSXElement').node.children.unshift(newNode);
          } else {
            path.insertBefore(newNode);
          }
          }
      }
    }
  }
}
