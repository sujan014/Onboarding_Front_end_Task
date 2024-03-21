import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {Button, Table, TableRow, TableHeaderCell, TableHeader, TableCell, TableBody} from "semantic-ui-react";
import { PaginationRender } from "../Pagination/PaginationRender";
import "../components.css";
import { BASE_URL } from "../../App";
import { getCustomers, getProducts, getStores } from "./SalesUtil";
import { RenderNewSalesForm, RenderEditSalesForm, RenderDeleteSalesForm } from "./RenderSalesForms";
import SalesTableMap from "./SalesTablemap";

function SalesList(){
    const [sales, setSales] = useState([]);    
    const [newsalesform, setNewsalesform] = useState(false);
    const [editsalesform, setEditsalesform] = useState(false);
    const [deletesalesform, setDeletesalesform] = useState(false);

    const [argid, setArgid] = useState(0);

    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    
    const [dataChanged, setDataChanged] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsperPage = 6;         // adjust number of items as per required.

    const NewSalesAction = ()=>{
        setNewsalesform(!newsalesform);        
    }
    const EditSalesAction = ()=>{
        setEditsalesform(!editsalesform);        
    }
    const DeleteSalesAction = ()=>{
        setDeletesalesform(!deletesalesform);        
    }
    const EditFormArgs = (id1, FormFunction) => {
        setArgid(id1);        
        FormFunction();     
    }
    // Define a function to handle page changes
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage);
    }
    const fetchSales = async () => {
        try{
            const newsales = await axios.get(`${BASE_URL}/api/Sales`);            
            
            if (newsales.data.length > 0){
                setSales(newsales.data);
            } else {
                alert("Sales data is empty.");
            }                        
        }
        catch{
            alert("Error: Cannot fetch Sales.");
        }
        
        try{
            const cResponse = await getCustomers();
            setCustomers(cResponse.data)
            
            const pResponse = await getProducts();
            setProducts(pResponse.data);
            
            const sResponse = await getStores();
            setStores(sResponse.data);
        }
        catch{
            alert("Error: Cannot fetch Sales data.");
        }
    }
    useEffect(
        () => {            
            fetchSales();
        }
    ,[currentPage, dataChanged]);

    const pageCount = Math.ceil(sales.length / itemsperPage);
    const indexOfLastRecord = currentPage * itemsperPage;
    const indexOfFirstRecord = indexOfLastRecord - itemsperPage;
    const currentItems = sales.slice(indexOfFirstRecord, indexOfLastRecord);

    let count = 0;
    const GetCustomerName = (id) => {
        const match = customers.find( custmr => custmr.id == id);                
        return match?.name ? match?.name : "Undefined";
    }
    const GetProductName = (id) => {
        const match = products.find( prod => prod.id == id);
        return match?.name ? match?.name : "Undefined";
    }
    const GetStoreName = (id) => {
        const match = stores.find( stor => stor.id == id);
        return match?.name ? match?.name : "Undefined";
    }

    return(
        <div id="mainblock">
            <Button color='blue' onClick={NewSalesAction}>New Sale</Button>
            <div id="tablediv">            
                <Table celled>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell>Product</TableHeaderCell>
                            <TableHeaderCell>Customer</TableHeaderCell>
                            <TableHeaderCell>Store</TableHeaderCell>
                            <TableHeaderCell>Date Sold</TableHeaderCell>
                            <TableHeaderCell>Actions</TableHeaderCell>
                            <TableHeaderCell>Actions</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentItems.map((item) => 
                            {
                                const id = item?.id ? item.id : 0;
                                const productId = item?.productId ? item.productId : 0;
                                const customerId = item?.customerId ? item.customerId : 0;
                                const storeId = item?.storeId ? item.storeId : 0;
                                const date = new Date(item.dateSold).toLocaleDateString();

                                return (
                                    <SalesTableMap
                                        key={`Sales-${new Date().toLocaleDateString()}-${id}`} 
                                        id = {id}
                                        product={GetProductName(productId)}
                                        customer = {GetCustomerName(customerId)}
                                        store = {GetStoreName(storeId)}
                                        date = {date}
                                        EditFormArgs = {EditFormArgs}
                                        EditFormAction = {EditSalesAction}
                                        DeleteFormAction = {DeleteSalesAction}                                        
                                    />
                                )
                            }                            
                        )}
                    </TableBody>
                </Table>
                <RenderNewSalesForm condition={newsalesform} formAction={NewSalesAction} updateChange={() => {setDataChanged(!dataChanged)}}/>
                <RenderEditSalesForm condition={editsalesform} Id={argid} formAction={EditSalesAction} updateChange={() => {setDataChanged(!dataChanged)}}/>
                <RenderDeleteSalesForm condition={deletesalesform} Id={argid} formAction={DeleteSalesAction} updateChange={() => {setDataChanged(!dataChanged)}}/>                
            </div>
            <div>
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

export default SalesList;