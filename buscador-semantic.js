window.addEventListener('DOMContentLoaded', () => {
    const locale = 'es';
     
    function localize(item) {
        const locale = localStorage.lang
        if (typeof item === 'string')
            return item
        if (typeof item === 'object') {
            let resp = item[locale] || item.und || item.es || item.va || item.ca || item[0] || '';
            return resp
        }
    }

$(".ui.search").search({
    minCharacters: 3,
    error: {
        noResults: locale == "es" ? "No se han encontrado resultados" : "No s'han trobat resultats",
    },
    apiSettings: {
        onResponse: function (data) {
            let response = {
                results: []
            };
            // translate GitHub API response to work with search
            $.each(data.items, function (index, item) {
                let maxResults = 20;
                if (index >= maxResults) {
                    return false;
                }
                // add result to category
                response.results.push({
                    title: localize(item.title, locale),
                    description: localize(item.lead, locale),
                    url: localize(item.data.slug, locale),
                    regExp: {
                        escape     : /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
                        beginsWith : '(?:\s|^)'
    },
                });
            });
            return response;
        },
        url: 'https://api.digitalvalue.es/alcantir/collections/articulos?or=title=/{query}/i|title.und=/{query}/i|title.va=/{query}/i|title.es=/{query}/i|title.ca=/{query}/i&nodeTypes=/transparencia/i'
    }//or=title=//ior=title.und=//i|title.va=//i|title.es=//i|title.ca=//i&limit=50&sort=title.und&nodeTypes=/noticia/i
})

})


