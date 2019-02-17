'use strict';

const got = require('got');
const Parser = require('rss-parser');

const parser = new Parser();

module.exports = async function (activity) {
    try {
        const response = await got(activity.Context.connector.endpoint);
        const json = await parser.parseString(response.body);

        activity.Response.Data.items = [];

        for (let i = 0; i < json.items.length; i++) {
            activity.Response.Data.items.push(format(json.items[i]));
        }
    } catch (error) {
        let m = error.message;

        if (error.stack) {
            m = m + ': ' + error.stack;
        }

        activity.Response.ErrorCode = (error.response && error.response.statusCode) || 500;
        activity.Response.Data = {
            ErrorText: m
        };
    }

    function format(_item) {
        return {
            title: _item.title,
            link: _item.link,
            description: _item.contentSnippet,
            html: _item.content,
            date: _item.isoDate,
            id: _item.guid
        };
    }
};
