hexo.extend.tag.register('fold', function (args, content) {
    return '<details><summary>' + args[0] + '</summary>\n' + hexo.render.renderSync({ text: content, engine: 'markdown' }) + '\n</details>';
}, { ends: true })