'use strict';
const Sequelize = require('sequelize');
const { QueryInterface } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('tasks', {
      TaskId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "pending"
      },
      CreatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      UpdatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('tasks');
  }
};
