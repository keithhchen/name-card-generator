const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

// Load the JSON file
const jsonData = require('./guests.json');

// Load the template image
const templatePath = path.join(__dirname, 'template.jpg');

// Load the custom font
const fontPath = path.join(__dirname, 'SourceHanSansSC-VF.ttf'); // Adjust the path to your .otf font file

// Function to generate name card images
const generateNameCard = async (guest, index) => {
    const templateImage = await loadImage(templatePath);
    const canvas = createCanvas(templateImage.width, templateImage.height);
    const ctx = canvas.getContext('2d');

    // Draw the template image
    ctx.drawImage(templateImage, 0, 0);

    // Load the custom font
    const font = opentype.loadSync(fontPath);

    const { name, name_en } = guest;

    // Prepare text
    const chineseName = `${name}`;
    const schoolText = '  校友';
    const englishName = name_en;

    // Set font sizes for each text
    const fontSizeChineseName = 150;
    const fontSizeSchool = fontSizeChineseName * 38 / 70;
    const fontSizeEnglishName = fontSizeChineseName * 42 / 70;

    // Set font family
    ctx.font = `${fontSizeChineseName}px ${font.familyName}`;
    ctx.fillStyle = 'black';

    // Calculate text widths
    const chineseNameWidth = ctx.measureText(chineseName).width;
    const schoolTextWidth = ctx.measureText(schoolText).width;
    const englishNameWidth = ctx.measureText(englishName).width;

    // Calculate combined text width for chineseName and schoolText
    const combinedWidth = chineseNameWidth + schoolTextWidth;

    // Calculate x position for centered combined text
    const xCombinedText = canvas.width / 2 - combinedWidth / 2.7;

    // Calculate x position for each text
    const xChineseName = xCombinedText;
    const xSchoolText = xCombinedText + chineseNameWidth;
    const xEnglishName = canvas.width / 2 - englishNameWidth / 3.2;

    // Define y positions for the texts
    const yChineseName = 1300; // Adjust as needed
    const ySchool = 150; // Adjust as needed
    const yEnglishName = 1500; // Adjust as needed

    // Print text on the canvas with respective font sizes
    ctx.font = `900 ${fontSizeChineseName}px ${font.familyName}`;
    ctx.fillText(chineseName, xChineseName, yChineseName);

    // Draw regular Chinese name on top to simulate bold effect
    ctx.font = `${fontSizeChineseName}px ${font.familyName}`;
    ctx.fillText(chineseName, xChineseName + 1, yChineseName); // Offset by 1 pixel for bold effect

    ctx.font = `${fontSizeSchool}px ${font.familyName}`;
    ctx.fillText(schoolText, xSchoolText, yChineseName);

    ctx.font = `900 ${fontSizeEnglishName}px ${font.familyName}`;
    ctx.fillText(englishName, xEnglishName, yEnglishName);
    ctx.fillText(englishName, xEnglishName + 1, yEnglishName);

    // Create a copy of the canvas for the top and flip it vertically
    const topCanvas = createCanvas(canvas.width, canvas.height);
    const topCtx = topCanvas.getContext('2d');
    topCtx.drawImage(canvas, 0, 0);

    // Duplicate the texts and rotate the canvas by 180 degrees
    const duplicateCanvas = createCanvas(canvas.width, canvas.height);
    const duplicateCtx = duplicateCanvas.getContext('2d');

    duplicateCtx.translate(canvas.width / 2, canvas.height / 2);
    duplicateCtx.rotate(Math.PI);
    duplicateCtx.translate(-canvas.width / 2, -canvas.height / 2);

    // Print text on the duplicated canvas with respective font sizes
    duplicateCtx.font = `900 ${fontSizeChineseName}px ${font.familyName}`;
    duplicateCtx.fillText(chineseName, xChineseName, yChineseName);

    duplicateCtx.font = `${fontSizeChineseName}px ${font.familyName}`;
    duplicateCtx.fillText(chineseName, xChineseName + 1, yChineseName); // Offset by 1 pixel for bold effect

    duplicateCtx.font = `${fontSizeSchool}px ${font.familyName}`;
    duplicateCtx.fillText(schoolText, xSchoolText, yChineseName);

    duplicateCtx.font = `900 ${fontSizeEnglishName}px ${font.familyName}`;
    duplicateCtx.fillText(englishName, xEnglishName, yEnglishName);
    duplicateCtx.fillText(englishName, xEnglishName + 1, yEnglishName);

    // Composite the rotated canvas onto the original canvas
    ctx.drawImage(duplicateCanvas, 0, 0);

    // Save the image
    const outputFilePath = path.join(__dirname, 'output', `name_card_${index + 1}.jpg`);
    const outputStream = fs.createWriteStream(outputFilePath);
    const stream = canvas.createJPEGStream({ quality: 0.95 });
    stream.pipe(outputStream);
    outputStream.on('finish', () => {
        console.log(`Generated name card for: ${name}`);
    });
};



// Ensure the output directory exists
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Process each guest in the JSON data
(async () => {
    // for (let i = 0; i < jsonData.length; i++) {
    for (let i = 0; i < 2; i++) {
        await generateNameCard(jsonData[i], i);
    }
    console.log('All name cards have been generated.');
})();
