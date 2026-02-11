const attributeService = require("./attribute.service");

/**
 * Get all attributes
 */
exports.getAll = async (req, res, next) => {
  try {
    const data = await attributeService.getAttributes();

    return res.status(200).json({
      success: true,
      message: "Attributes fetched successfully",
      data,
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: "Failed to fetch attributes",
      error,
    });
  }
};

/**
 * Get values of a single attribute
 */
exports.getValues = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next({
        statusCode: 400,
        message: "Attribute ID is required",
      });
    }

    const data = await attributeService.getAttributeValues(id);

    if (!data || data.length === 0) {
      return next({
        statusCode: 404,
        message: "Attribute values not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attribute values fetched successfully",
      data,
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: "Failed to fetch attribute values",
      error,
    });
  }
};

/**
 * Create attribute with values
 */
exports.create = async (req, res, next) => {
  try {
    const { name, values } = req.body;

    if (!name || typeof name !== "string") {
      return next({
        statusCode: 400,
        message: "Attribute name is required and must be a string",
      });
    }

    if (!Array.isArray(values) || values.length === 0) {
      return next({
        statusCode: 400,
        message: "Attribute values must be a non-empty array",
      });
    }

    const result = await attributeService.createAttribute(name, values);

    return res.status(201).json({
      success: true,
      message: "Attribute created successfully",
      data: result,
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: "Failed to create attribute",
      error,
    });
  }
};

/**
 * Map attribute values to product
 */
exports.mapProduct = async (req, res, next) => {
  try {
    const { productId, attributeValueIds } = req.body;

    if (!productId) {
      return next({
        statusCode: 400,
        message: "Product ID is required",
      });
    }

    if (!Array.isArray(attributeValueIds) || attributeValueIds.length === 0) {
      return next({
        statusCode: 400,
        message: "Attribute value IDs must be a non-empty array",
      });
    }

    const result = await attributeService.mapProductAttributes(
      productId,
      attributeValueIds,
    );

    return res.status(200).json({
      success: true,
      message: "Product attributes mapped successfully",
      data: result,
    });
  } catch (error) {
    next({
      statusCode: 500,
      message: "Failed to map product attributes",
      error,
    });
  }
};
