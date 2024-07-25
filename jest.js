function Info (info) {
  // const { name, usage, features } = info
  // return `## ${name}\n\n_${(features || ['none']).join(', ')}_\n\n${usage}`
  return JSON.stringify(info, null, 2)
}

module.exports = { Info }
