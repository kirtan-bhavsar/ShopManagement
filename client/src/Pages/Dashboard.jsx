import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [shops, setShops] = useState([]);
  const [expandedShop, setExpandedShop] = useState(null);
  const [editingShopId, setEditingShopId] = useState(null);
  const [editedShopName, setEditedShopName] = useState("");
  const [addingProductShopId, setAddingProductShopId] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", quantity: "" });
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({ name: "", price: "", quantity: "" });
  const [newShopName, setNewShopName] = useState("");

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const { data } = await axios.get("http://localhost:5500/api/v1/shop/all", {
        withCredentials: true,
      });
      setShops(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Toggle shop accordion
  const toggleShop = (shopId) => {
    setExpandedShop(expandedShop === shopId ? null : shopId);
  };

  // Add Shop
  const handleNewShopChange = (e) => {
    setNewShopName(e.target.value);
  };

  const addShop = async () => {
    if (!newShopName.trim()) {
      toast.error("Shop name is required");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5500/api/v1/shop/add",
        { name: newShopName },
        { withCredentials: true }
      );
      toast.success("Shop added successfully");
      setNewShopName("");
      fetchShops();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add shop");
    }
  };

  // Edit shop
  const startEditingShop = (shopId, currentName) => {
    setEditingShopId(shopId);
    setEditedShopName(currentName);
  };

  const saveShopName = async (shopId) => {
    try {
      await axios.put(
        `http://localhost:5500/api/v1/shop/edit/${shopId}`,
        { name: editedShopName },
        { withCredentials: true }
      );
      toast.success("Shop updated successfully");
      setEditingShopId(null);
      fetchShops();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update shop");
    }
  };

  // Add Product
  const startAddingProduct = (shopId) => {
    setAddingProductShopId(shopId);
    setNewProduct({ name: "", price: "", quantity: "" });
  };

  const handleProductChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const saveProduct = async (shopId) => {
    if (!newProduct.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    try {
      await axios.post(
        `http://localhost:5500/api/v1/product/add/${shopId}`,
        newProduct,
        { withCredentials: true }
      );
      toast.success("Product added successfully");
      setAddingProductShopId(null);
      fetchShops();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    }
  };

  // Edit Product
  const startEditingProduct = (product) => {
    setEditingProductId(product._id);
    setEditedProduct({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    });
  };

  const handleEditProductChange = (e) => {
    setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
  };

  const saveEditedProduct = async (productId) => {
    if (!editedProduct.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    try {
      await axios.put(
        `http://localhost:5500/api/v1/product/edit/${productId}`,
        editedProduct,
        { withCredentials: true }
      );
      toast.success("Product updated successfully");
      setEditingProductId(null);
      fetchShops();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="title">My Shops</h2>

      {/* Add Shop Form */}
      <div className="add-shop-container">
        <input
          type="text"
          placeholder="New Shop Name"
          value={newShopName}
          onChange={handleNewShopChange}
        />
        <button className="add-shop-btn" onClick={addShop}>
          <FontAwesomeIcon icon={faPlus} /> Add Shop
        </button>
      </div>

      {shops.length === 0 ? (
        <p>No shops found</p>
      ) : (
        shops.map((shopObj) => {
          const shopId = shopObj.Shop._id;
          return (
            <div className="accordion-item" key={shopId}>
              <div className="accordion-header">
                {editingShopId === shopId ? (
                  <>
                    <input
                      className="edit-input"
                      type="text"
                      value={editedShopName}
                      onChange={(e) => setEditedShopName(e.target.value)}
                    />
                    <div className="header-buttons">
                      <button
                        className="toggle-btn save-btn"
                        onClick={() => saveShopName(shopId)}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span>{shopObj.Shop.name}</span>
                    <div className="header-buttons">
                      <button
                        className="toggle-btn"
                        onClick={() => toggleShop(shopId)}
                      >
                        {expandedShop === shopId ? "-" : "+"}
                      </button>
                      <button
                        className="toggle-btn"
                        onClick={() => startEditingShop(shopId, shopObj.Shop.name)}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        className="add-product-btn"
                        onClick={() => startAddingProduct(shopId)}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Add Product
                      </button>
                    </div>
                  </>
                )}
              </div>

              {expandedShop === shopId && (
                <div className="accordion-content">
                  <table className="product-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shopObj.Products.map((product) => (
                        <tr key={product._id}>
                          {editingProductId === product._id ? (
                            <>
                              <td>
                                <input
                                  className="edit-input"
                                  type="text"
                                  name="name"
                                  value={editedProduct.name}
                                  onChange={handleEditProductChange}
                                />
                              </td>
                              <td>
                                <input
                                  className="edit-input"
                                  type="number"
                                  name="price"
                                  value={editedProduct.price}
                                  onChange={handleEditProductChange}
                                />
                              </td>
                              <td>
                                <input
                                  className="edit-input"
                                  type="number"
                                  name="quantity"
                                  value={editedProduct.quantity}
                                  onChange={handleEditProductChange}
                                />
                              </td>
                              <td>
                                <button
                                  className="save-product-btn"
                                  onClick={() => saveEditedProduct(product._id)}
                                >
                                  <FontAwesomeIcon icon={faCheck} />
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>{product.name}</td>
                              <td>{product.price}</td>
                              <td>{product.quantity}</td>
                              <td>
                                <button
                                  className="edit-product-btn"
                                  onClick={() => startEditingProduct(product)}
                                >
                                  <FontAwesomeIcon icon={faPen} />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Add Product Form */}
                  {addingProductShopId === shopId && (
                    <div className="add-product-form">
                      <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={handleProductChange}
                      />
                      <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={handleProductChange}
                      />
                      <input
                        type="number"
                        name="quantity"
                        placeholder="Quantity"
                        value={newProduct.quantity}
                        onChange={handleProductChange}
                      />
                      <button
                        className="save-product-btn"
                        onClick={() => saveProduct(shopId)}
                      >
                        Save Product
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Dashboard;
