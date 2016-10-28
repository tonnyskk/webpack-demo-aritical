// var $ = require('jquery'); // ES5
// import $ from 'jquery'; // ES6
//
import './styles.scss';

if (document.querySelectorAll('a').length) {
    // This is a split point
    require.ensure([], () => {
        // All the code in here, and everything that is imported
        // will be in a separate file
        // import Button from './components/Button'
        const Button = require('./components/Button').default;
        const button = new Button('Google');
        button.render('a');
    });
}

// If we have a title, render the Header component on it
if (document.querySelectorAll('h1').length) {
    require.ensure([], () => {
        const Header = require('./components/Header').default;

        new Header().render('h1');
    });
}
