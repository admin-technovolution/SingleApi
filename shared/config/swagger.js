const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const methodOrder = ["get", "post", "put", "delete", "patch"];


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Single API',
            version: '1.0.0',
            description: "API documentation for the Single App."
        },
        tags: [
            { name: "Chats" },
            { name: "Discover" },
            { name: "Likes & Dislikes" },
            { name: "Login" },
            { name: "Master Data" },
            { name: "Matches" },
            { name: "RTDN Google" },
            { name: "Subscription" },
            { name: "Users" },
            { name: "Web Sockets" }
        ],
        components: {
            securitySchemes: {
                Bearer: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        }
    },
    apis: ['./src/**/*.js', './shared/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

function sortSwaggerPaths(spec) {
    const methodGroups = {};

    Object.entries(spec.paths).forEach(([path, methods]) => {
        Object.keys(methods).forEach(method => {
            if (!methodGroups[method]) methodGroups[method] = {};
            methodGroups[method][path] = methods[method];
        });
    });

    const sortedPaths = {};

    methodOrder.forEach(method => {
        if (methodGroups[method]) {
            const sortedRoutes = Object.keys(methodGroups[method]).sort((a, b) => a.localeCompare(b));

            sortedRoutes.forEach(path => {
                if (!sortedPaths[path]) sortedPaths[path] = {};
                sortedPaths[path][method] = methodGroups[method][path];
            });
        }
    });

    spec.paths = sortedPaths;
}

sortSwaggerPaths(swaggerSpec);

module.exports = {
    swaggerUi,
    swaggerSpec,
};
