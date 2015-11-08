'use strict';

module.exports = {
    top: {
        title: 'Responsive Design Made Easy',
        description: 'GroundworkCSS on Handlebars; Created and Maintained by <a href="http://twitter.com/partharamanujam" target="_blank">Partha Ramanujam</a>',
        summary: 'Get Started',
        buttons: [
            {
                href: '/layout-a',
                rel: 'next',
                class: 'green button',
                text: 'View Example Layouts'
            }
        ]
    },
    body: {
        features: [
            {
                icon: 'icon-th',
                header: 'Grid System',
                text: 'A highly configurable, nestable, fractions-based, responsive & adaptive, fluid grid layout system'
            },
            {
                icon: 'icon-tablet',
                header: 'Works Everywhere',
                text: 'Works on virtually everything &mdash; mobile phones, tablets, notebooks, desktops, retina and big screens'
            },
            {
                icon: 'icon-plus-sign-alt',
                header: 'Highly Accessible',
                text: 'Built with a focus on accessibility, supporting <abbr title="Accessible Rich Internet Applications">ARIA</abbr> state/role and semantic element selectors'
            },
            {
                icon: 'icon-thumbs-up',
                header: 'Semantic',
                text: 'Supports semantic markup with <abbr title="Accessible Rich Internet Applications">ARIA</abbr> attribute selectors, using Sass\' @extend, @mixins, %placeholders & more'
            },
            {
                icon: 'icon-magic',
                header: 'Built with Sass',
                text: 'Built from the ground up with <a href="http://sass-lang.com/" target="_blank">Sass</a>, the world\'s most powerful CSS preprocessor'
            },
            {
                icon: 'icon-cogs',
                header: 'Write Less, Do more',
                text: 'Keep source code free of vendor prefixes. <a href="https://github.com/ai/autoprefixer" target="_blank">Autoprefixer</a> is a CSS postprocessor that keeps code future-friendly'
            },
            {
                icon: 'icon-edit-sign',
                header: 'Customizable',
                text: 'Easy to customize, and add your own styles and bolt on additional functionality'
            },
            {
                icon: 'icon-text-width',
                header: 'Responsive Text',
                text: 'Includes the tools you need to create responsive headings, responsive text blocks and responsive tables'
            },
            {
                icon: 'icon-star',
                header: 'Rapid Prototyping',
                text: 'Rapid prototyping and wireframes with dynamic placeholder text, images and fonts'
            }
        ],
        layouts: [
            {
                divclass: 'one fourth two-up-small-tablet padded bounceInDown animated',
                boxcolor: 'asphalt',
                shape: 'round',
                href: '/layout-a',
                src: '/images/layout-a.png',
                textbg: 'turquoise',
                text: 'Website Layout'
            },
            {
                divclass: 'one fourth two-up-small-tablet padded bounceInLeft animated',
                boxcolor: 'yellow',
                shape: 'round',
                href: '/layout-b',
                src: '/images/layout-b.png',
                textbg: 'orange',
                text: 'Website Layout'
            },
            {
                divclass: 'one fourth two-up-small-tablet padded bounceInUp animated',
                boxcolor: 'pink',
                shape: 'round',
                href: '/layout-c',
                src: '/images/layout-c.png',
                textbg: 'purple',
                text: 'Ecommerce Site'
            },
            {
                divclass: 'one fourth two-up-small-tablet padded bounceInRight animated',
                boxcolor: 'green',
                shape: 'round',
                href: '/layout-d',
                src: '/images/example-usage.png',
                textbg: 'asphalt',
                text: 'Usage Examples'
            }
        ]
    }
};