'use strict';

/**
 * chosen-theme service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::chosen-theme.chosen-theme');
