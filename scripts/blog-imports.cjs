module.exports = function transformer(file, api) {
  const j = api.jscodeshift
  const r = j(file.source)
  r.find(j.ImportDeclaration)
    .filter(p => /@\/components\/blog\//.test(p.node.source.value))
    .forEach(p => { p.node.source.value = '@/components/blog' })
  return r.toSource({ quote: 'single' })
}
