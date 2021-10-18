import path from "path";
import csv from "csvtojson/index";
import * as fs from "fs";
import { readFile, writeFile } from "fs/promises";

const csvFilePath = path.join(__dirname, '../csv/nodejs-hw1-ex1.csv');


function convertToJSON() {
    const outputPath = path.join(__dirname, '../dist/json_1.txt');
    const writableStream = fs.createWriteStream(outputPath, 'utf8');
    const readableStream = fs.createReadStream(csvFilePath, { encoding: 'utf8', highWaterMark: 500 });

    readableStream.pipe(csv({ output: 'json' })).pipe(writableStream);
    readableStream.on('error', (error) => {
        console.error('Something went wrong on read from file ', error)
    });
    writableStream.on('error', (error) => {
        console.error('Something went wrong on write to file ', error)
    });

}

async function convertToJsonAsync() {
    const outputPath = path.join(__dirname, '../dist/json_2.txt');

    console.log('Reading file... ');
    try {
        const file = await readFile(csvFilePath, 'utf8');
        const parsedCSV = await csv({output: 'line'}).fromString(file);
        await writeFile(outputPath, JSON.stringify(parsedCSV), 'utf8');
        console.log('File was written!');
    }
    catch (error) {
        console.error(error)
    }
}

convertToJSON();
convertToJsonAsync();
