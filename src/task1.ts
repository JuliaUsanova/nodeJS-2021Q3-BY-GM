import { stdin, stdout } from 'process';
const readline = require('readline');
const rl = readline.createInterface({
    input: stdin,
    output: stdout,
    terminal: false
});

stdin.setEncoding('utf8');

console.log('>>> Input some text')
rl.on('line', inputHandler)

rl.on('error', (error: Error) => {
    console.error('>>> Something went wrong ', JSON.stringify(error));
})

function inputHandler(text: string) {
    if (!text.length) {
        return console.log('Please type something')
    }

    const reversedText = text.trim().split('').reverse().join('');
    return console.log(reversedText)
}


/*
    Here is the second approach, but I don't like it as I can't check for empty string.
    As far as I understand, the console.log function also uses stdout under the hood,
    so I thought it matches HW requirements.
 */
/*
stdout.write('>>> Input some text')
stdin.on('data', inputHandler)

stdin.on('error', (error: Error) => {
    console.error('>>> Something went wrong ', JSON.stringify(error));
})

function inputHandler(text: string) {
    if (!text.length) {
        return stdout.write('Please type something')
    }

    const reversedText = text.trim().split('').reverse().join('');
    return stdout.write(reversedText)
}
*/
