import React from 'react'
import { Link as a } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div>
            <div className="sidebar-wrapper">
                <nav id="sidebar">
                    <ul className="list-unstyled components">
                        <li>
                            <a to="/"><i className="fa fa-tachometer"></i> Dashboard</a>
                        </li>

                        <li>
                            <a href="#productSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                                className="fab fa-product-hunt"></i> Products</a>
                            <ul className="collapse list-unstyled" id="productSubmenu">
                                <li>
                                    <a to="/admin/products"><i className="fa fa-clipboard"></i> All</a>
                                </li>

                                <li>
                                    <a to="/admin/product"><i className="fa fa-plus"></i> Create</a>
                                </li>
                            </ul>
                        </li>

                        <li>
                            <a to="/admin/orders"><i className="fa fa-shopping-basket"></i> Orders</a>
                        </li>

                        <li>
                            <a to="/admin/users"><i className="fa fa-users"></i> Users</a>
                        </li>

                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Sidebar
