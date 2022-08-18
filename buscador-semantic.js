window.addEventListener('DOMContentLoaded', () => {
    const locale = 'es';
    const cdn = 'https://cdn.digitalvalue.es/alcantir/assets/';

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
        showNoResults: true,
        error: {
            noResults: locale == "es" ? "No se han encontrado resultados" : "No s'han trobat resultats",
        },
        apiSettings: {
            onResponse: function (data) {
                let response = {
                    results: []
                };
                $.each(data.items, function (index, item) {
                    let maxResults = 20;
                    if (index >= maxResults) {
                        return false;
                    }
                    response.results.push({
                        title: localize(item.title, locale, cdn),
                        description: localize(item.lead, locale),
                        url: localize(item.data.slug, locale),
                        regExp: {
                            escape: /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
                            beginsWith: '(?:\s|^)'
                        },
                    });
                });
                return response;
            },
            url: 'https://api.digitalvalue.es/alcantir/collections/articulos?or=title=/{query}/i|title.und=/{query}/i|title.va=/{query}/i|title.es=/{query}/i|title.ca=/{query}/i&nodeTypes=/transparencia/i'
        }
    })

});

(function ($, window, document, undefined) {

    "use strict";

    window = (typeof window != 'undefined' && window.Math == Math) ?
        window :
        (typeof self != 'undefined' && self.Math == Math) ?
        self :
        Function('return this')();
    $.fn.search.settings = {

        name: 'Search',
        namespace: 'search',

        silent: false,
        debug: false,
        verbose: false,
        performance: true,

        // template to use (specified in settings.templates)
        type: 'standard',

        // minimum characters required to search
        minCharacters: 1,

        // whether to select first result after searching automatically
        selectFirstResult: false,

        // API config
        apiSettings: false,

        // object to search
        source: false,

        // Whether search should query current term on focus
        searchOnFocus: true,

        // fields to search
        searchFields: [
            'title',
            'description'
        ],

        // field to display in standard results template
        displayField: '',

        // whether to include fuzzy results in local search
        searchFullText: true,

        // whether to add events to prompt automatically
        automatic: true,

        // delay before hiding menu after blur
        hideDelay: 0,

        // delay before searching
        searchDelay: 200,

        // maximum results returned from local
        maxResults: 7,

        // whether to store lookups in local cache
        cache: true,

        // whether no results errors should be shown
        showNoResults: true,

        // transition settings
        transition: 'scale',
        duration: 200,
        easing: 'easeOutExpo',

        // callbacks
        onSelect: false,
        onResultsAdd: false,

        onSearchQuery: function (query) {},
        onResults: function (response) {},

        onResultsOpen: function () {},
        onResultsClose: function () {},

        className: {
            animating: 'animating',
            active: 'active',
            empty: 'empty',
            focus: 'focus',
            hidden: 'hidden',
            loading: 'loading',
            results: 'results',
            pressed: 'down'
        },

        error: {
            source: 'Cannot search. No source used, and Semantic API module was not included',
            noResults: 'Your search returned no results',
            logging: 'Error in debug logging, exiting.',
            noEndpoint: 'No search endpoint was specified',
            noTemplate: 'A valid template name was not specified.',
            serverError: 'There was an issue querying the server.',
            maxResults: 'Results must be an array to use maxResults setting',
            method: 'The method you called is not defined.'
        },

        metadata: {
            cache: 'cache',
            results: 'results',
            result: 'result'
        },

        regExp: {
            escape: /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
            beginsWith: '(?:\s|^)'
        },

        // maps api response attributes to internal representation
        fields: {
            categories: 'results', // array of categories (category view)
            categoryName: 'name', // name of category (category view)
            categoryResults: 'results', // array of results (category view)
            description: 'description', // result description
            image: 'image', // result image
            price: 'price', // result price
            results: 'results', // array of results (standard)
            title: 'title', // result title
            url: 'url', // result url
            action: 'action', // "view more" object name
            actionText: 'text', // "view more" text
            actionURL: 'url' // "view more" url
        },

        selector: {
            prompt: '.prompt',
            searchButton: '.search.button',
            results: '.results',
            message: '.results > .message',
            category: '.category',
            result: '.result',
            title: '.title, .name'
        },

        templates: {

            message: function (message, type) {
                var
                    html = '';
                if (message !== undefined && type !== undefined) {
                    html += '' +
                        '<div class="message ' + type + '">';
                    // message type
                    if (type == 'empty') {
                        html += '' +
                            '<div class="header">Sin resultados</div class="header">' +
                            '<div class="description">' + message + '</div class="description">';
                    } else {
                        html += ' <div class="description">' + message + '</div>';
                    }
                    html += '</div>';
                }
                return html;
            },
            standard: function (response, fields) {
                var
                    html = '';
                if (response[fields.results] !== undefined) {

                    // each result
                    $.each(response[fields.results], function (index, result) {
                        if (result[fields.url]) {
                            html += '<a class="result" href="' + result[fields.url] + '">';
                        } else {
                            html += '<a class="result">';
                        }
                        if (result[fields.image] !== undefined) {
                            html += '' +
                                '<div class="image">' +
                                ' <img src="' + result[fields.image] + '">' +
                                '</div>';
                        }
                        html += '<div class="content">';
                        if (result[fields.price] !== undefined) {
                            html += '<div class="price">' + result[fields.price] + '</div>';
                        }
                        if (result[fields.title] !== undefined) {
                            html += '<div class="title">' + result[fields.title] + '</div>';
                        }
                        if (result[fields.description] !== undefined) {
                            html += '<div class="description">' + result[fields.description] + '</div>';
                        }
                        html += '' +
                            '</div>';
                        html += '</a>';
                    });

                    if (response[fields.action]) {
                        html += '' +
                            '<a href="' + response[fields.action][fields.actionURL] + '" class="action">' +
                            response[fields.action][fields.actionText] +
                            '</a>';
                    }
                    return html;
                }
                return false;
            }
        }
    };

})(jQuery, window, document);