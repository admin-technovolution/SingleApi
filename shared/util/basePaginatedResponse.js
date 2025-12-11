/**
 * @swagger
 * components:
 *   schemas:
 *     PaginationDto:
 *       type: object
 *       properties:
 *         nextCursor:
 *           type: string
 *           required: false
 *           description: Cursor for fetching the next page (null if no more results)
 *           example: "68d416ebe7884b8394eb22e7"
 *         pageSize:
 *           type: integer
 *           description: Number of items returned in this page
 *           example: 20
 *         hasMore:
 *           type: boolean
 *           description: Flag to know there are more results to fetch
 *           example: true
 * 
 *     BasePaginatedResponse:
 *       type: object
 *       properties:
 *         results:
 *           type: array
 *           description: The list of returned items
 *         pagination:
 *           $ref: '#/components/schemas/PaginationDto'
 */
class BasePaginatedResponse {
    constructor(results, { nextCursor = null, pageSize = 0, hasMore = false }) {
        this.results = results;
        this.pagination = {
            nextCursor,
            pageSize,
            hasMore
        };
    }
}

module.exports = BasePaginatedResponse;
