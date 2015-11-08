'use strict';

module.exports = [
    {
        name: ' Home',
        href: '/home',
        icon: 'icon-home'
    },
    {
        name: 'Example Layouts',
        submenu: [
            {
                name: 'Web Page',
                href: '/layout-a'
            },
            {
                name: 'Image Gallery',
                href: '/layout-b'
            },
            {
                name: 'Ecommerce Page',
                href: '/layout-c'
            },
            {
                name: 'Contact Page',
                href: '/layout-d'
            }
        ]
    },
    {
        name: 'Documentation',
        submenu: [
            {
                name: 'Grid',
                title: 'Responsive grid system, grid adapters and helpers',
                href: '/docs/grid.html'
            },
            {
                name: 'Helpers',
                title: 'Layout helpers, spinners and much more',
                href: '/docs/helpers.html'
            },
            {
                name: 'Typography',
                title: 'Text elements, quotes, code and web fonts',
                href: '/docs/typography.html'
            },
            {
                name: 'UI Elements',
                title: 'Navigation, buttons, boxes, message boxes, tables, tabs, and forms',
                submenu: [
                    {
                        name: 'Navigation',
                        title: 'Navigation',
                        href: '/docs/navigation.html'
                    },
                    {
                        name: 'Buttons',
                        title: 'Buttons, button groups, button menus',
                        href: '/docs/buttons.html'
                    },
                    {
                        name: 'Boxes',
                        title: 'Boxes',
                        href: '/docs/boxes.html'
                    },
                    {
                        name: 'Message Boxes',
                        title: 'Message Boxes',
                        href: '/docs/messages.html'
                    },
                    {
                        name: 'Tables',
                        title: 'Tables',
                        href: '/docs/tables.html'
                    },
                    {
                        name: 'Tabs',
                        title: 'Tabs',
                        href: '/docs/tabs.html'
                    },
                    {
                        name: 'Form Elements',
                        title: 'Form Elements',
                        href: '/docs/forms.html'
                    }
                ]
            },
            {
                name: 'Icons',
                title: 'Icons',
                href: '/docs/icons.html'
            },
            {
                name: 'Responsive Text',
                title: 'Responsive text and multi-line text block truncation',
                href: '/docs/responsive-text.html'
            },
            {
                name: 'Placeholder Text',
                title: 'Placeholder text and placeholder fonts for rapid prototyping and wireframes',
                href: '/docs/placeholder-text.html'
            },
            {
                name: 'Animations',
                title: 'Pure CSS3 Animations',
                href: '/docs/animations.html'
            }
        ]
    }
];