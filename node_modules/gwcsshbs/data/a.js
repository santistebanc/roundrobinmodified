'use strict';

module.exports = {
    top: {
        title: 'Web Site Example Layout',
        description: 'Demonstrates Typography, Styled Lists, Buttons, Source Reordering, Grid Breakpoint Modifiers and Adapters',
        summary: 'Example Layout 1 of 4',
        buttons: [
            {
                href: '/home',
                rel: 'prev',
                class: 'blue button',
                text: 'Back'
            },
            {
                href: '/layout-b',
                rel: 'next',
                class: 'green button',
                text: 'Image Gallery'
            }
        ]
    },
    body: {
        unordered: [
            'Unordered list item #1',
            'Unordered list item #2',
            'Unordered list item #3',
            'Unordered list item #4'
        ],
        ordered: [
            'Ordered list item #1',
            'Ordered list item #2',
            'Ordered list item #3'
        ]
    }
};