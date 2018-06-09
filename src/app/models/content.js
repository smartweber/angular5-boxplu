var Content = (function () {
    function Content(data) {
        this.description = data.long_description;
        this.poster = data.images.poster.url;
        this.banner = data.images.banner.url;
        this.name = data.name;
    }
    return Content;
}());
export { Content };
//# sourceMappingURL=content.js.map