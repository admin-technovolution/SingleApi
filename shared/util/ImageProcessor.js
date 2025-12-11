const crypto = require("crypto");
const sharp = require('sharp');
const c = require('./constants');

const IMAGE_SIZES = {
    thumb: {
        width: 150,
        height: 150,
        quality: 70,
        fit: "inside",
        withoutEnlargement: true
    },
    medium: {
        width: 400,
        height: undefined,
        quality: 75,
        fit: "inside",
        withoutEnlargement: true
    },
    full: {
        width: 1080,
        height: 1350,
        quality: 50,
        fit: "cover",
        withoutEnlargement: true
    }
};

class ImageProcessor {

    getUniformExtension() {
        return c.WEBP_EXTENSION;
    }

    async processImages(files, userId, addIsProfile = true) {
        this.sizes = IMAGE_SIZES;

        // Process all files in parallel
        const results = await Promise.all(
            files.map(async (file, index) => {
                const extension = this.getUniformExtension();
                const uniqueId = crypto.randomBytes(8).toString("hex");

                const result = {
                    isProfile: addIsProfile && (index === 0),
                    path: `${userId}/${uniqueId}/`,
                    sizes: []
                };

                // Process all sizes in parallel
                const sizes = await Promise.all(
                    Object.entries(IMAGE_SIZES).map(async ([key, config]) => {
                        let transformer = sharp(file.buffer).resize({
                            width: config.width,
                            height: config.height,
                            fit: config.fit,
                            withoutEnlargement: config.withoutEnlargement
                        });

                        switch (extension) {
                            case c.JPEG_EXTENSION:
                                transformer = transformer.jpeg({ quality: config.quality });
                                break;
                            case c.PNG_EXTENSION:
                                transformer = transformer.png({ compressionLevel: 9 });
                                break;
                            case c.WEBP_EXTENSION:
                                transformer = transformer.webp({ quality: config.quality });
                                break;
                        }

                        return {
                            size: key,
                            name: `${key}.${extension}`,
                            file: await transformer.toBuffer()
                        };
                    })
                );

                result.sizes = sizes;
                return result;
            })
        );

        return results;
    }
}

module.exports = ImageProcessor;
