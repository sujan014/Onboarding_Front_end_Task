import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {Button, Table, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody} from "semantic-ui-react";
import { PaginationRender } from "../Pagination/PaginationRender";
import { BASE_URL } from "../../App";
import '../components.css';
import { RenderDeleteProductForm, RenderEditProductForm, RenderNewProductForm } from "./RenderProductForms";

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
            setProducts(newProducts.data);            
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
                    {currentItems.map((prod) => (
                            <TableRow key={prod.id}>
                                <TableCell>{prod.name}</TableCell>
                                <TableCell>{prod.price}</TableCell>
                                <TableCell>
                                    <Button color='yellow' onClick={() => EditFormArgs(prod.id, prod.name, prod.price, EditProductAction)} icon='edit' labelPosition="left" content='Edit' >
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button color='red' onClick={() => EditFormArgs(prod.id, prod.name, prod.price, DeleteProductAction)} icon='trash' labelPosition="left" content='Delete' >
                                    </Button>
                                </TableCell>
                            </TableRow>                        
                            )
                        )}
                    </TableBody>
                </Table>
                <RenderNewProductForm condition={newProductform} formAction = {NewProductAction} updateChange={() => {setDataChanged(!dataChanged)}} />
                <RenderEditProductForm condition={editProductform} Id={argid} Name={argname} Price={argprice} formAction = {EditProductAction} updateChange={() => {setDataChanged(!dataChanged)}} />
                <RenderDeleteProductForm condition={deleteProductform} Id={argid} Name={argname} Price={argprice} formAction = {DeleteProductAction} updateChange={() => {setDataChanged(!dataChanged)}} />
                
                {/* {newproductform ? <NewProductForm callback={NewProductAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
                {editproductform ? <EditProductForm Id={argid} Name={argname} Price={argprice} callback = {EditProductAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null}
                {deleteproductform ? <DeleteProductForm Id={argid} Name={argname} Price={argprice} callback = {DeleteProductAction} dataChange={() => {setDataChanged(!dataChanged)}}/> : null} */}
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