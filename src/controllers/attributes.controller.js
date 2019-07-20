/**
 * The controller defined below is the attribute controller, highlighted below are the functions of each static method
 * in the controller
 *  Some methods needs to be implemented from scratch while others may contain one or two bugs
 * 
 * - getAllAttributes - This method should return an array of all attributes
 * - getSingleAttribute - This method should return a single attribute using the attribute_id in the request parameter
 * - getAttributeValues - This method should return an array of all attribute values of a single attribute using the attribute id
 * - getProductAttributes - This method should return an array of all the product attributes
 * NB: Check the BACKEND CHALLENGE TEMPLATE DOCUMENTATION in the readme of this repository to see our recommended
 *  endpoints, request body/param, and response object for each of these method
 */
 import {
  Attribute,
  AttributeValue,
  Product,
  ProductAttribute,
 } from '../database/models';

 //const { Op } = Sequelize;


/**
 *
 *
 * @class AttributeController
 */
class AttributeController {
  /**
   * This method get all attributes
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getAllAttributes(req, res, next) {
    // write code to get all attributes from the database here
    try{
      const attribute = await Attribute.findAll();
      return res.status(200).json(attribute);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * This method gets a single attribute using the attribute id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getSingleAttribute(req, res, next) {
    // Write code to get a single attribute using the attribute id provided in the request param
    const {attribute_id} = req.params;
    try{
      const attributes = await Attribute.findByPk(attribute_id);
      return res.status(200).json(attributes);
    }catch(error) {
      return next(error);
    }
    //return res.status(200).json({ message: 'this works' });
  }

  /**
   * This method gets a list attribute values in an attribute using the attribute id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getAttributeValues(req, res, next) {
    // Write code to get all attribute values for an attribute using the attribute id provided in the request param
    // This function takes the param: attribute_id
    const {attribute_id} = req.params;
    try{
      const attributes = await AttributeValue.findAll({
        attributes: { exclude: ['attribute_id'] },
        include:[
          {

            model:Attribute,

            as: 'attribute_type',
            where:{
              attribute_id
            },
            attributes:[]
          }
        ]
      });
      return res.status(200).json(attributes);
    }catch(error) {
      return next(error);
    }    
    //return res.status(200).json({ message: 'this works' });
  }

  /**
   * This method gets a list attribute values in a product using the product id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async getProductAttributes(req, res, next) {
    // Write code to get all attribute values for a product using the product id provided in the request param
    const {product_id} = req.params;
    try{
      const attributeValue = await AttributeValue.findAll({
        
        raw:true,
        include:[
          {
            model:Product,
            where:
            {
              product_id
            },

            attributes: { exclude: ['attribute_id'] },
          }
        ],
        include:[
          {
            model:Attribute,
            as: 'attribute_type',
            raw:true,
            nested:true,
            //attributes:[['name','attribute_name']],
            
            attributes:[]
          }
        ],
        //attributes: { exclude: ['attribute_id'],include:['attribute_type.name']},
        attributes:['attribute_value_id','attribute_type.name',['value','attribute_value']],
        //attributes:[]
      })
      ;

    return res.status(200).json(attributeValue);
    }catch(error) {
      return next(error);
    } 
  }
}

export default AttributeController;
