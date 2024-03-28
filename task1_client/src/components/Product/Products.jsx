import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {Button, Table, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody} from "semantic-ui-react";
import { PaginationRender } from "../Pagination/PaginationRender";
import { BASE_URL } from "../../App";
import '../components.css';
import { RenderDeleteProductForm, RenderEditProductForm, RenderNewProductForm } from "./RenderProductForms";
import ProductTableMap from "./ProductTableMap";

function ProductsList(){
    const [products, setProducts] = useState([]);
    const [newProductform, setNewcreateform] = useState(false);
    const [editProductform, setEditcreateform] = useState(false);
    const [deleteProductform, setDeletecreateform] = useState(false);

    const [argid, setArgid] = useState(0);
    const [argname, setArgname] = useState('');
    const [argprice, setArgprice] = useState(0);

    const [dataChanged, setDataChanged] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsperPage = 6;         // adjust number of items as per required.

    const NewProductAction = ()=>{
        setNewcreateform(!newProductform);        
    }
    const EditProductAction = ()=>{
        setEditcreateform(!editProductform);        
    }
    const DeleteProductAction = ()=>{
        setDeletecreateform(!deleteProductform);        
    }
    const EditFormArgs = (id1, name1, price1, FormFunction) => {
        setArgid(id1);
        setArgname(name1);
        setArgprice(price1);
        FormFunction();     
    }
    // Define a function to handle page changes
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage);
    }
    const fetchProducts = async () => {
        try{
            const newProducts = await axios.get(`${BASE_URL}/api/Product`);
            if (newProducts?.data && newProducts.data.length){
                setProducts(newProducts.data);
            } else {
                alert("Products data is empty.");
            }
        }
        catch{
            alert("Error: Cannot fetch Products.");
        }
    }
    useEffect(
        () => {            
            fetchProducts();
        }
    , [currentPage, dataChanged]);

    const pageCount = Math.ceil(products.length / itemsperPage);
    const indexOfLastRecord = currentPage * itemsperPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsperPage;
    const currentItems = products.slice(indexOfFirstRecord, indexOfLastRecord);
    
    return(
        <div id = "mainblock">
            <Button color="blue" onClick={NewProductAction}>New product</Button>
            <div id="tablediv">
                <Table celled>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>Name</TableHeaderCell>
                            <TableHeaderCell>Price</TableHeaderCell>
                            <TableHeaderCell>Actions</TableHeaderCell>
                            <TableHeaderCell>Actions</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {currentItems.map((prod) => {
                            const id = prod?.id ? prod?.id : 0;
                            const name = prod?.name ? prod?.name : "";
                            const price = prod?.price ? prod.price : 0;

                            return (
                                <ProductTableMap 
                                    key={`Product-${new Date().toLocaleDateString()}-${id}`} 
                                    product={prod}
                                    EditFormArgs = {EditFormArgs}
                                    EditFormAction = {EditProductAction}
                                    DeleteFormAction = {DeleteProductAction}
                                />
                            )
                        }                            
                        )}
                    </TableBody>
                </Table>
                <RenderNewProductForm condition={newProductform} formAction = {NewProductAction} updateChange={() => {setDataChanged(!dataChanged)}} />
                <RenderEditProductForm Id={argid} condition={editProductform} Name={argname} Price={argprice} formAction = {EditProductAction} updateChange={() => {setDataChanged(!dataChanged)}} />
                <RenderDeleteProductForm Id={argid} condition={deleteProductform} Name={argname} Price={argprice} formAction = {DeleteProductAction} updateChange={() => {setDataChanged(!dataChanged)}} />                                
            </div>
            <div className="nav_panel">
                <PaginationRender 
                    pageCount={pageCount}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
                <div className="pagenumber">
                    {currentPage}
                </div>
            </div>
        </div>
    )
}

export default ProductsList;