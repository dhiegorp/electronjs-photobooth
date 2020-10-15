const path = require('path')
const fs = require('fs')

const logError = err => err && console.error(err);

let images = [];

exports.rm = (index, done) => {
    console.log(index);
    fs.unlink(images[index], err => {
        console.log(images, index, err, done);
        if (err) return logError(err);
        images.splice(index, 1);
        done();
    })
}

exports.cache = imgPath => {
    images = images.concat([imgPath]);
    return images;
}

exports.getFromCache = index => {
    return images[index];
}

exports.save = (picturesPath, contents, done) => {
    console.log('done', done);
    const base64data = contents.replace(/^data:image\/png;base64,/, '');
    const imgPath = path.join(picturesPath, `${new Date().getUTCMilliseconds()}.png`);
    fs.writeFile(imgPath, base64data, { encoding: 'base64' }, err => {
        if (err) return logError(err);

        done(null, imgPath);
    })

};

exports.getPicturesPath = app => {
    return path.join(app.getPath('pictures'), 'photobooth')
}

exports.mkDir = picturesPath => {
    fs.stat(picturesPath, (err, status) => {
        if (err && err.code !== 'ENOENT') {
            logError(err);
        } else if (err || !status.isDirectory()) {
            fs.mkdir(picturesPath, logError);
        }
    });
}