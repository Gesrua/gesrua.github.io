function filter(data) {
  var regexp = new RegExp(/\:\:[^\n\r]+?(?:\:\:)/, 'mg');
//   console.log(data.content)
  data.content = data.content.replace(regexp, function(s) {
    var origin = s;
    // console.log('origin ', s);
    var mode = s.slice(0, s.indexOf(' ')) + '-inline'
    s = s.slice(2, -2)
    var mode = s.slice(0, s.indexOf(' '));
    // console.log('mode: ', mode)
    if (mode != 'info' && mode != 'success' && mode != 'warning' && mode != 'danger')
        return origin;
    // console.log(s);
    // mode = mode + '-inline';
    var text = s.slice(s.indexOf(' ')+1)
    // console.log(mode)
    // console.log(text)
    // console.log('<div class = \"' + mode + ' note inline\">' + text + '</div>')
    return '<div class = \"' + mode + '-inline message-body\">' + text + '</div>';
    // return katex.renderToString(s.slice(1, -1), {
    //     displayMode: false,
    //     strict: "ignore"
    //   });
  });
  return data;
}

hexo.extend.filter.register('after_post_render', filter);
