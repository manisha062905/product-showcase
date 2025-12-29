import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct, toggleFeatured } from "../../datasources/productService";
import { getCategories } from "../../datasources/categoryService";
import "../../styles/products.css";
import { useHistory } from "react-router-dom";

import Switch from "react-switch";

const initProductFilters = {
    category: undefined,
    page: 1,
    page_size: 10,
};

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productFilters, setProductFilters] = useState(initProductFilters);
    const [isLoading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [openMenuId, setOpenMenuId] = useState(null);


    const history = useHistory();

    const toggleMenu = (id) => {
    setOpenMenuId(prev => (prev === id ? null : id));
};
useEffect(() => {
    console.log("openMenuId changed:", openMenuId);
}, [openMenuId]);

const closeMenu = () => {
    setOpenMenuId(false);
};
    const totalPages = Math.ceil(totalCount / productFilters.page_size);
    const loadProducts = async () => {
    setLoading(true);
    try {
        const response = await getProducts(productFilters);
        setProducts(response.results || []);
        setTotalCount(response.count || 0);
    } finally {
        setLoading(false);
    }
};

    const loadCategories = async () => {
        const response = await getCategories();
        setCategories(response.results || []);
    };

    useEffect(() => {
        loadCategories();
        loadProducts();
    }, []);

    useEffect(() => {
        loadProducts();
    }, [productFilters]);

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Delete this product?")) {
            await deleteProduct(id);
            loadProducts();
        }
    };

    const handleToggleFeatured = async (product) => {
        const updated = await toggleFeatured(product.id, !product.is_featured);
        setProducts(products.map(p => p.id === product.id ? updated : p));
    };

    const SelectCategory = () => (
        <select
            className="category-select"
            value={productFilters.category || ""}
            onChange={(e) =>
                setProductFilters({
                    ...productFilters,
                    category: e.target.value || undefined,
                    page:1,
                })
            }
        >
            <option value="">All Categories</option>
            {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
        </select>
    );

    if (isLoading) return <div className="loading">Loading...</div>;
    const goToNextPage = () => {
    if (productFilters.page < totalPages) {
        setProductFilters({
            ...productFilters,
            page: productFilters.page + 1,
        });
    }
};
    const goToPreviousPage = () => {
    if (productFilters.page > 1) {
        setProductFilters({
            ...productFilters,
            page: productFilters.page - 1,
        });
    }
};

    return (
        <div className="products-container">
            <div className="products-header">
                <h2>Products</h2>
                <div className="header-actions">
                    <SelectCategory />
                    <button
                        className="primary-btn"
                        onClick={() => history.push("/products/create")}
                    >
                        Add Product
                    </button>
                </div>
            </div>

            <div className="product-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">

    {/* TOP RIGHT MENU */}
     <button
        type="button"
        className="menu-btn"
        onClick={(e) => {
            e.stopPropagation();
            toggleMenu(product.id);
        }}
    >
        ⋮
    </button>

    {openMenuId === product.id && (
        <div className="dropdown-menu">
            <div onClick={() => history.push(`/products/${product.id}`)}>View</div>
            <div onClick={() => history.push(`/products/edit/${product.id}`)}>Edit</div>
            <div
                className="danger"
                onClick={() => handleDeleteProduct(product.id)}
            >
                Delete
            </div>
        </div>
    )}

    {/* PRODUCT INFO */}
    <div className="product-info">
        <h4>{product.title}</h4>
        <p className="category">{product.category_name}</p>
        <p className="price">₹ {product.price}</p>
    </div>

    {/* BOTTOM RIGHT SWITCH */}
    <div className="card-bottom">
        <Switch
            onChange={() => handleToggleFeatured(product)}
            checked={product.is_featured}
        />
    </div>

</div>

                ))}
            </div>
            {totalPages > 1 && (
            <div className="pagination">
                <button
                    disabled={productFilters.page === 1}
                    onClick={goToPreviousPage}
                >
                    ← Previous
                </button>

                <span>
                    Page {productFilters.page} of {totalPages}
                </span>

                <button
                    disabled={productFilters.page === totalPages}
                    onClick={goToNextPage}
                >
                    Next →
                </button>
            </div>
        )}
        </div>
    );
};

export default Products;

