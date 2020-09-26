hexo.extend.tag.register('pixiv', function (args) {
    pid = args[0], title = args[1], author = args[2]
    ret =  '<a class="tag is-dark is-medium" href="https://www.pixiv.net/artworks/{pid}" target="_blank"><span class="icon"><i class="fas fa-camera"></i></span>&nbsp;&nbsp;{title} by {author}</a>'.replace(
        "{pid}", pid
    ).replace("{title}", title).replace("{author}", author)
    console.log(ret)
    return ret
});